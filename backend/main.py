from __future__ import annotations

import hashlib
import ipaddress
import json
import os
import re
import sqlite3
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

BASE = Path(__file__).resolve().parent
DB_PATH = BASE / "sentinel.db"

app = FastAPI(title="SENTINEL API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BRANDS = {
    "google": ["google"],
    "microsoft": ["microsoft", "office365", "outlook"],
    "apple": ["apple", "icloud"],
    "paypal": ["paypal"],
    "amazon": ["amazon"],
    "meta": ["meta"],
    "facebook": ["facebook"],
    "instagram": ["instagram"],
    "whatsapp": ["whatsapp"],
    "netflix": ["netflix"],
    "github": ["github"],
    "linkedin": ["linkedin"],
}

KEYWORDS = [
    "login", "verify", "account", "security", "secure", "password",
    "wallet", "payment", "update", "confirmation", "recover",
    "suspended", "unlock", "signin", "sign-in", "credential",
]

SUSPICIOUS_TLDS = {"xyz", "top", "click", "buzz", "work", "support", "zip", "mov"}

WEIGHTS = {
    "https_missing": 15,
    "ip_address": 20,
    "multiple_hyphens": 10,
    "excessive_subdomains": 10,
    "punycode": 20,
    "suspicious_tld": 10,
    "login_path": 15,
    "password_field": 20,
    "protected_identity": 15,
    "redirect_chain": 10,
    "urgency": 10,
    "brand_impersonation": 30,
    "lookalike_brand": 25,
    "suspicious_keyword": 6,
}

def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    con = db()
    con.executescript("""
    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        domain TEXT,
        score INTEGER,
        level TEXT,
        classification TEXT,
        reasons TEXT,
        timestamp INTEGER
    );
    CREATE TABLE IF NOT EXISTS identities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        identity_type TEXT NOT NULL,
        identity_hash TEXT NOT NULL UNIQUE,
        enabled INTEGER DEFAULT 1,
        created_at INTEGER
    );
    """)
    con.commit()
    con.close()

init_db()

class AnalyzeRequest(BaseModel):
    url: str
    login_detected: bool = False
    password_field: bool = False
    email_field: bool = False
    phone_field: bool = False
    brand: str | None = None
    protected_identity: bool = False
    page_title: str = ""
    visible_text_signals: list[str] = Field(default_factory=list)
    redirect_count: int = 0

class IdentityRequest(BaseModel):
    identity_type: str
    identity_hash: str

class TextRequest(BaseModel):
    text: str

class AIRequest(BaseModel):
    url: str
    score: int
    classification: str
    signals: list[str] = Field(default_factory=list)

def safe_domain(url: str) -> tuple[str, str]:
    raw = url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw):
        raw = "http://" + raw
    parsed = urlparse(raw)
    return parsed.netloc.split("@")[-1].split(":")[0].lower(), raw

def add(reasons, signal, severity, points):
    reasons.append({"signal": signal, "severity": severity, "points": points})

def looks_like_brand(domain: str):
    hits = []
    compact = re.sub(r"[^a-z0-9]", "", domain)
    for brand, aliases in BRANDS.items():
        for alias in aliases:
            if alias in domain and domain != f"{alias}.com":
                hits.append(brand)
            if alias.replace("o", "0") in compact or alias.replace("l", "1") in compact:
                hits.append(brand)
    return sorted(set(hits))

def classify(score, reasons, domain):
    text = " ".join(r["signal"].lower() for r in reasons)
    if score <= 30:
        return "SAFE"
    if "brand impersonation" in text:
        return "BRAND_IMPERSONATION"
    if "password field" in text and "login" in text:
        return "CREDENTIAL_HARVESTING"
    if "login" in text or "login page" in text:
        return "PHISHING"
    if any(k in domain for k in ("bank", "wallet", "payment")):
        return "BANKING_SCAM"
    return "SUSPICIOUS_WEBSITE"

def analyze(req: AnalyzeRequest):
    domain, normalized = safe_domain(req.url)
    parsed = urlparse(normalized)
    reasons = []
    score = 0

    if parsed.scheme != "https":
        add(reasons, "HTTPS missing", "high", WEIGHTS["https_missing"])
        score += WEIGHTS["https_missing"]

    try:
        ipaddress.ip_address(domain)
        add(reasons, "URL uses an IP address", "high", WEIGHTS["ip_address"])
        score += WEIGHTS["ip_address"]
    except ValueError:
        pass

    if domain.count("-") >= 2:
        add(reasons, "Multiple hyphens in domain", "medium", WEIGHTS["multiple_hyphens"])
        score += WEIGHTS["multiple_hyphens"]

    if len(domain.split(".")) >= 4:
        add(reasons, "Excessive subdomains", "medium", WEIGHTS["excessive_subdomains"])
        score += WEIGHTS["excessive_subdomains"]

    if "xn--" in domain:
        add(reasons, "Punycode/IDN domain", "high", WEIGHTS["punycode"])
        score += WEIGHTS["punycode"]

    tld = domain.rsplit(".", 1)[-1] if "." in domain else ""
    if tld in SUSPICIOUS_TLDS:
        add(reasons, f"Suspicious TLD: .{tld}", "medium", WEIGHTS["suspicious_tld"])
        score += WEIGHTS["suspicious_tld"]

    path_text = (parsed.path + "?" + parsed.query).lower()
    login_detected = req.login_detected or bool(re.search(r"login|signin|sign-in|authenticate", path_text))
    if login_detected:
        add(reasons, "Login page pattern", "high", WEIGHTS["login_path"])
        score += WEIGHTS["login_path"]

    if req.password_field:
        add(reasons, "Password field detected", "high", WEIGHTS["password_field"])
        score += WEIGHTS["password_field"]

    if req.protected_identity:
        add(reasons, "Protected identity requested on this page", "critical", WEIGHTS["protected_identity"])
        score += WEIGHTS["protected_identity"]

    if req.redirect_count >= 2:
        add(reasons, f"Redirect chain detected ({req.redirect_count})", "medium", WEIGHTS["redirect_chain"])
        score += WEIGHTS["redirect_chain"]

    joined = " ".join(req.visible_text_signals).lower()
    urgency_terms = ("urgent", "immediately", "act now", "suspended", "expires today", "verify now")
    if any(term in joined for term in urgency_terms):
        add(reasons, "Urgency language detected", "medium", WEIGHTS["urgency"])
        score += WEIGHTS["urgency"]

    keyword_hits = []
    for kw in KEYWORDS:
        if kw in domain.lower() or kw in path_text:
            keyword_hits.append(kw)
    for kw in keyword_hits[:5]:
        add(reasons, f"Suspicious keyword: {kw}", "medium", WEIGHTS["suspicious_keyword"])
        score += WEIGHTS["suspicious_keyword"]

    brands = looks_like_brand(domain)
    if brands:
        official_like = any(domain == f"{b}.com" for b in brands)
        if not official_like:
            for brand in brands[:2]:
                add(reasons, f"Possible {brand.title()} impersonation", "critical", WEIGHTS["brand_impersonation"])
                score += WEIGHTS["brand_impersonation"]
            if any(domain.replace("-", "").replace("0", "o").replace("1", "l").find(b) >= 0 for b in brands):
                add(reasons, "Lookalike brand pattern", "high", WEIGHTS["lookalike_brand"])
                score += WEIGHTS["lookalike_brand"]

    score = min(score, 100)
    if score <= 30:
        level = "LOW RISK"
    elif score <= 50:
        level = "SUSPICIOUS"
    elif score <= 75:
        level = "HIGH RISK"
    else:
        level = "DANGEROUS"

    classification = classify(score, reasons, domain)
    confidence = round(min(0.99, max(0.15, score / 100)), 2)

    result = {
        "url": req.url,
        "domain": domain,
        "score": score,
        "level": level,
        "classification": classification,
        "confidence": confidence,
        "reasons": reasons,
        "signals": [r["signal"] for r in reasons],
        "timestamp": int(time.time()),
        "identity_detected": bool(req.email_field or req.phone_field),
        "identity_protected": req.protected_identity,
        "login_detected": login_detected,
    }

    con = db()
    con.execute(
        "INSERT INTO scans(url,domain,score,level,classification,reasons,timestamp) VALUES(?,?,?,?,?,?,?)",
        (req.url, domain, score, level, classification, json.dumps(reasons), result["timestamp"]),
    )
    con.commit()
    con.close()
    return result

@app.get("/", response_class=HTMLResponse)
def root():
    return '<h1>SENTINEL</h1><p>Personal Digital Identity Firewall — API online.</p><p><a href="/dashboard">Open Security Center</a></p>'

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    return (BASE.parent / "frontend" / "index.html").read_text(encoding="utf-8")

@app.get("/api/health")
def health():
    return {"name": "SENTINEL", "status": "online", "version": "1.0.0"}

@app.get("/api/risk-rules")
def risk_rules():
    return {"levels": {"LOW RISK": [0,30], "SUSPICIOUS": [31,50], "HIGH RISK": [51,75], "DANGEROUS": [76,100]}, "weights": WEIGHTS}

@app.post("/api/analyze")
def api_analyze(req: AnalyzeRequest):
    return analyze(req)

@app.get("/api/history")
def history(limit: int = 50):
    con = db()
    rows = con.execute("SELECT * FROM scans ORDER BY id DESC LIMIT ?", (min(limit, 200),)).fetchall()
    con.close()
    return [dict(r) for r in rows]

@app.get("/api/stats")
def stats():
    con = db()
    total = con.execute("SELECT COUNT(*) c FROM scans").fetchone()["c"]
    dangerous = con.execute("SELECT COUNT(*) c FROM scans WHERE score >= 76").fetchone()["c"]
    high = con.execute("SELECT COUNT(*) c FROM scans WHERE score BETWEEN 51 AND 75").fetchone()["c"]
    suspicious = con.execute("SELECT COUNT(*) c FROM scans WHERE score BETWEEN 31 AND 50").fetchone()["c"]
    safe = con.execute("SELECT COUNT(*) c FROM scans WHERE score <= 30").fetchone()["c"]
    con.close()
    return {"total": total, "dangerous": dangerous, "high": high, "suspicious": suspicious, "safe": safe, "threats_prevented": dangerous}

@app.post("/api/identity/register")
def register_identity(req: IdentityRequest):
    con = db()
    try:
        con.execute(
            "INSERT INTO identities(identity_type,identity_hash,enabled,created_at) VALUES(?,?,1,?)",
            (req.identity_type, req.identity_hash, int(time.time())),
        )
        con.commit()
        return {"status": "registered"}
    except sqlite3.IntegrityError:
        return {"status": "already_registered"}
    finally:
        con.close()

@app.get("/api/identity/status")
def identity_status():
    con = db()
    rows = con.execute("SELECT id,identity_type,enabled,created_at FROM identities ORDER BY id DESC").fetchall()
    con.close()
    return [dict(r) for r in rows]

@app.post("/api/ai/explain")
async def ai_explain(req: AIRequest):
    base = (
        f"This website received a SENTINEL risk score of {req.score}/100 and was classified as "
        f"{req.classification}. Signals include: {', '.join(req.signals[:8]) or 'none'}. "
        "Do not enter passwords or other sensitive credentials until the site is verified."
    )
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    model = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
    prompt = (
        "You are SENTINEL, a defensive website-security assistant. Explain this risk in 3 short "
        "sentences. Never request or infer passwords. Use only the supplied metadata.\n"
        f"URL: {req.url}\nScore: {req.score}\nClassification: {req.classification}\nSignals: {req.signals}"
    )
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.post(
                f"{ollama_url}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False},
            )
            r.raise_for_status()
            data = r.json()
            text = data.get("response", "").strip()
            if text:
                return {"provider": "ollama", "model": model, "explanation": text}
    except Exception:
        pass
    return {"provider": "fallback", "model": None, "explanation": base}

@app.post("/api/analyze/email")
def analyze_email(req: TextRequest):
    text = req.text.lower()
    signals = []
    for term, label in [
        ("urgent", "Urgency language"),
        ("verify", "Verification request"),
        ("password", "Credential request"),
        ("click here", "Call-to-action link"),
        ("won", "Prize/reward claim"),
        ("account suspended", "Account pressure"),
        ("bank", "Financial context"),
    ]:
        if term in text:
            signals.append(label)
    score = min(100, len(signals) * 14)
    return {"score": score, "classification": "PHISHING" if score >= 42 else "SUSPICIOUS_MESSAGE", "signals": signals}

@app.post("/api/analyze/message")
def analyze_message(req: TextRequest):
    return analyze_email(req)

@app.post("/api/analyze/qr")
async def analyze_qr(file: UploadFile = File(...)):
    return {
        "status": "demo",
        "message": "QR image received. For the hackathon MVP, decode the QR locally and submit its destination URL to /api/analyze.",
        "filename": file.filename,
    }
