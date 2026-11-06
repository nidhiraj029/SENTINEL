# 🛡️ SENTINEL

## Personal Digital Identity Firewall

> **“Before you trust a website with your identity, SENTINEL checks whether you should.”**

SENTINEL is a **browser-based digital identity protection and scam intelligence platform** designed to detect suspicious websites, phishing attempts, brand impersonation, scam campaigns, and identity-targeting threats **before users submit sensitive information**.

Instead of simply asking:

> ❌ *“Is this website malicious?”*

SENTINEL asks:

> 🧠 **“Is this website trying to steal my identity, and what is the attack pattern behind it?”**

The platform combines a **Chrome/Chromium browser extension**, **FastAPI risk engine**, **threat intelligence**, **Scam DNA analysis**, **scam-network visualization**, **protected identity monitoring**, and an optional **local AI security analyst**.

---

# 🚨 The Problem

Modern phishing attacks are becoming increasingly sophisticated.

Attackers can create websites that:

- Look almost identical to legitimate services
- Impersonate popular brands
- Use shortened or suspicious URLs
- Redirect users through multiple domains
- Ask for passwords, emails, phone numbers, or other identity information
- Use urgency and social-engineering language
- Reuse the same infrastructure across multiple scams
- Operate as coordinated scam campaigns

Traditional browser warnings often focus on whether a URL is known to be malicious.

But a newly created phishing website may not yet exist in a blacklist.

### SENTINEL takes a different approach.

It analyzes the **behavior and characteristics of a website in real time** and produces an explainable risk score.

---

# 💡 SENTINEL's Solution

SENTINEL acts as a **Personal Digital Identity Firewall** between the user and suspicious websites.

```text
                     USER
                       │
                       ▼
              ┌─────────────────┐
              │ Chrome Browser  │
              └────────┬────────┘
                       │
                       ▼
             ┌──────────────────┐
             │ SENTINEL Shield  │
             │ Browser Extension│
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ FastAPI Risk     │
             │ Intelligence     │
             │ Engine           │
             └────────┬─────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Risk Analysis   Identity     Threat Intel
                   Firewall
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              Scam DNA Analysis
                      │
                      ▼
              Scam Network Graph
                      │
                      ▼
              Local AI Analyst
                      │
                      ▼
             Security Center
```

---

# ✨ Core Features

## 1. 🛡️ Real-Time Browser Shield

The Chrome/Chromium extension analyzes the current website and communicates with the SENTINEL backend.

It can detect:

- Suspicious URLs
- Missing HTTPS
- IP-based URLs
- Suspicious TLDs
- Excessive subdomains
- Multiple hyphens
- Punycode domains
- Login pages
- Password fields
- Email/phone fields
- Redirect chains
- Suspicious keywords
- Brand impersonation
- Lookalike domains
- Protected identity exposure

The extension provides an immediate risk assessment.

---

# 2. 🎯 Explainable Risk Engine

SENTINEL does not simply return:

```text
MALICIOUS
```

Instead, it calculates a risk score based on multiple signals.

### Risk Scale

| Score | Risk Level | Meaning |
|---:|---|---|
| 0–30 | 🟢 LOW RISK | No significant threat detected |
| 31–50 | 🟡 SUSPICIOUS | Some unusual characteristics detected |
| 51–75 | 🟠 HIGH RISK | Strong indicators of malicious behavior |
| 76–100 | 🔴 DANGEROUS | High-confidence phishing/scam indicators |

### Example Signals

| Signal | Weight |
|---|---:|
| HTTP instead of HTTPS | +15 |
| IP address used as domain | +20 |
| Multiple hyphens | +10 |
| Excessive subdomains | +10 |
| Punycode | +20 |
| Suspicious TLD | +10 |
| Login path | +15 |
| Password field detected | +20 |
| Protected identity detected | +15 |
| Redirect chain | +10 |
| Urgency indicators | +10 |
| Suspicious keywords | +6 each |
| Brand impersonation | +30 |
| Lookalike brand | +25 |

The final score is capped at **100**.

---

# 3. 🏢 Brand Impersonation Detection

Attackers frequently create fake websites pretending to be trusted companies.

SENTINEL maintains a brand intelligence database containing services such as:

- Google
- Microsoft
- Apple
- PayPal
- Amazon
- Meta
- Facebook
- Instagram
- WhatsApp
- Netflix
- GitHub
- LinkedIn

For example:

```text
google.com
        ↓
Trusted

google-security-login.example
        ↓
Potential impersonation
```

SENTINEL distinguishes legitimate domains from suspicious lookalikes and subdomains.

---

# 4. 🧬 Scam DNA

SENTINEL goes beyond individual URL detection.

Multiple scam websites can share similar characteristics.

The **Scam DNA engine** extracts patterns such as:

- Domain structure
- Suspicious keywords
- Brand targets
- URL structure
- Redirect behavior
- Infrastructure indicators
- Identity collection behavior
- Social-engineering signals

This allows multiple attacks to be grouped into potential campaigns.

### Example

```text
Scam A
 ├── Fake PayPal
 ├── Urgent verification
 └── Password collection

Scam B
 ├── Fake PayPal
 ├── Urgent verification
 └── Password collection

Scam C
 ├── Fake PayPal
 ├── Urgent verification
 └── Password collection

              ↓

       Same Scam DNA
              ↓

       Potential Campaign
```

---

# 5. 🕸️ Scam Network

SENTINEL represents relationships between suspicious entities as a graph.

```text
                 ┌──────────────┐
                 │ Fake PayPal  │
                 └──────┬───────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
         Domain A   Domain B   Domain C
              │         │         │
              └────┬────┴────┬────┘
                   ▼         ▼
              Same Pattern  Same Brand
                   │
                   ▼
             Scam Campaign
```

The goal is to move from:

> **“This URL looks suspicious.”**

to:

> **“These suspicious websites may belong to the same coordinated campaign.”**

---

# 6. 🔐 Protected Identity Firewall

SENTINEL is designed around **identity protection**, not credential collection.

The browser extension can detect the presence of:

- Login fields
- Password fields
- Email fields
- Phone-number fields

without collecting the actual values.

### SENTINEL NEVER collects:

❌ Passwords  
❌ OTPs  
❌ PINs  
❌ Banking credentials  
❌ Authentication codes  

The protected identity layer is intended to warn users when a suspicious website attempts to collect identity information.

---

# 7. 🤖 Local AI Security Analyst

SENTINEL can optionally use a **local Ollama model** to explain detected threats.

Instead of simply displaying:

```text
Risk Score: 87
```

the AI analyst can explain:

```text
This website is high risk because:

• It uses a suspicious domain structure.
• It attempts to imitate a known brand.
• A login page was detected.
• Password collection was detected.
• Multiple phishing indicators were found.

Recommendation:
Do not enter credentials or personal information.
```

The local AI architecture allows SENTINEL to work without requiring paid cloud AI APIs.

---

# 8. 📊 Security Center

The web dashboard acts as the central investigation interface.

It provides:

- Current threat status
- Risk scores
- Scan history
- Threat statistics
- Identity protection status
- Scam intelligence
- Threat explanations
- Security analytics

Architecture:

```text
Chrome Extension
       │
       ▼
FastAPI Backend
       │
       ├── Risk Engine
       ├── Identity Firewall
       ├── Threat Intelligence
       ├── Scam DNA
       ├── Scam Network
       └── AI Analyst
       │
       ▼
Security Center
```

---

# 🔎 Advanced Security Tools

SENTINEL also provides analyzers for different types of suspicious content.

### URL Analyzer

Analyze:

```text
https://example.com/login
```

and receive:

- Risk score
- Risk classification
- Detection reasons
- Threat signals
- Brand analysis

### Email Analyzer

Analyze suspicious email content for:

- Urgency
- Credential requests
- Suspicious links
- Scam language
- Brand impersonation

### Message Analyzer

Analyze suspicious:

- SMS messages
- Chat messages
- Social-media messages

### QR Analyzer

Analyze QR-code destinations before visiting them.

### Screenshot Analysis

Future-facing interface for analyzing screenshots of suspicious websites or messages.

---

# 🧠 Architecture

```text
┌─────────────────────────────────────────────────────┐
│                    SENTINEL                         │
│         Personal Digital Identity Firewall          │
└────────────────────────┬────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌───────────────────┐          ┌────────────────────┐
│ Chrome Extension  │          │ Security Center    │
│                   │          │ Web Dashboard      │
└─────────┬─────────┘          └─────────┬──────────┘
          │                              │
          └──────────────┬───────────────┘
                         ▼
                ┌─────────────────┐
                │ FastAPI Backend │
                └────────┬────────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
┌────────────┐    ┌──────────────┐   ┌──────────────┐
│ Risk       │    │ Identity     │   │ Threat       │
│ Engine     │    │ Firewall     │   │ Intelligence │
└─────┬──────┘    └──────┬───────┘   └──────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         ▼
                 ┌──────────────┐
                 │ Scam DNA     │
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ Scam Network │
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ Local AI     │
                 │ Analyst      │
                 └──────────────┘
```

---

# 📁 Project Structure

```text
SENTINEL/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── sentinel.db
│   └── .venv/
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── frontend/
│   └── index.html
│
├── run.sh
├── README.md
└── .gitignore
```

---

# ⚙️ Technology Stack

### Frontend

- HTML
- CSS
- JavaScript

### Browser Protection

- Chrome Extension
- Manifest V3
- Content Scripts
- Background Service Worker

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- HTTPX

### Database

- SQLite

### AI

- Ollama
- Local LLM

### Development

- Git
- GitHub
- VS Code
- WSL / Ubuntu

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/nidhiraj029/SENTINEL.git
cd SENTINEL
```

---

## 2. Start the backend

```bash
chmod +x run.sh
./run.sh
```

The backend runs on:

```text
http://127.0.0.1:8000
```

---

# 🌐 Open the Security Center

Open:

```text
http://127.0.0.1:8000/dashboard
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🧩 Install the Chrome Extension

1. Open Chrome.
2. Navigate to:

```text
chrome://extensions/
```

3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose:

```text
SENTINEL/extension/
```

6. Pin the SENTINEL extension.

The browser shield can now communicate with the local SENTINEL backend.

---

# 🤖 Optional Ollama Setup

Install Ollama and pull a lightweight local model.

Example:

```bash
ollama pull qwen2.5:1.5b
```

Start Ollama:

```bash
ollama serve
```

SENTINEL can then use the local model for threat explanations.

No paid cloud AI API is required for the local AI workflow.

---

# 🔌 API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Backend information |
| `GET /dashboard` | Security Center |
| `GET /api/health` | Health check |
| `GET /api/risk-rules` | Risk rules |
| `POST /api/analyze` | Analyze URL |
| `GET /api/history` | Scan history |
| `GET /api/stats` | Security statistics |
| `POST /api/identity/register` | Register protected identity |
| `GET /api/identity/status` | Identity protection status |
| `POST /api/ai/explain` | Generate AI explanation |
| `POST /api/analyze/email` | Analyze email |
| `POST /api/analyze/message` | Analyze message |
| `POST /api/analyze/qr` | Analyze QR destination |

---

# 🧪 Testing

Run the Python syntax check:

```bash
python3 -m py_compile backend/main.py
```

Check the repository:

```bash
git status
```

Test the API:

```bash
curl http://127.0.0.1:8000/api/health
```

Example URL analysis:

```bash
curl -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

Example suspicious URL:

```bash
curl -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"http://paypal-login-security.com/verify/account"}'
```

---

# 🗺️ Development Roadmap

SENTINEL is organized into **8 development phases**.

## Phase 1 — Risk Intelligence Engine

- URL analysis
- Domain analysis
- Risk scoring
- Threat signals
- Explainable detection
- SQLite scan history
- FastAPI foundation

### Status: ✅ Completed

---

## Phase 2 — Real-Time Chrome Protection

- Chrome Manifest V3 extension
- Browser monitoring
- Real-time URL analysis
- Login detection
- Password-field detection
- Risk popup
- Browser Shield

### Status: ✅ Completed

---

## Phase 3 — Protected Identity Firewall

- Identity registration
- Protected identity state
- Identity exposure detection
- Login/password/email/phone signals
- Privacy-preserving architecture

### Status: ✅ Completed

---

## Phase 4 — Scam DNA + Threat Intelligence

- Scam pattern extraction
- Brand intelligence
- Suspicious-domain analysis
- Campaign similarity
- Threat intelligence
- Scam clustering

### Status: ✅ Completed

---

## Phase 5 — Scam Network Graph

- Domain relationships
- Brand relationships
- Campaign relationships
- Shared indicators
- Attack-network visualization

### Status: ✅ Completed

---

## Phase 6 — Local AI Security Analyst

- Local Ollama integration
- Threat explanations
- Risk summaries
- Security recommendations
- AI-assisted investigation

### Status: ✅ Completed

---

## Phase 7 — Security Center + Advanced Security Tools

- Security dashboard
- Scan history
- Statistics
- Email analyzer
- Message analyzer
- QR analyzer
- Screenshot analysis
- Security reports
- Advanced threat analytics

### Status: ✅ Completed

---

## Phase 8 — Complete Integration + Hackathon Demo

- End-to-end integration
- Browser → backend → intelligence pipeline
- UI refinement
- Regression testing
- Performance testing
- Demo scenarios
- Documentation
- GitHub release

### Status: ✅ Completed

---

# 🎬 Hackathon Demo Flow

A typical SENTINEL demonstration can follow this sequence:

### Step 1 — Open a legitimate website

```text
google.com
```

SENTINEL:

```text
🟢 LOW RISK
Risk Score: 0
```

---

### Step 2 — Open a suspicious website

Example:

```text
paypal-login-security.com
```

SENTINEL detects:

```text
🔴 DANGEROUS
Risk Score: 100
```

Possible reasons:

```text
• Suspicious domain
• Brand impersonation
• Login page
• Suspicious keywords
• Identity collection indicators
```

---

### Step 3 — Show the Identity Firewall

Demonstrate that SENTINEL detects the presence of identity fields without collecting:

```text
❌ Password
❌ OTP
❌ PIN
❌ Banking credentials
```

---

### Step 4 — Show Scam DNA

Demonstrate how multiple suspicious domains can share:

```text
Same brand
Same attack pattern
Same keywords
Same infrastructure indicators
```

---

### Step 5 — Show Scam Network

Visualize:

```text
Domain
   ↓
Brand
   ↓
Campaign
   ↓
Related Domains
   ↓
Attack Network
```

---

### Step 6 — Ask the AI Security Analyst

The local AI explains:

```text
Why is this website dangerous?

What indicators were detected?

What should the user do?
```

---

# 🏆 Why SENTINEL?

Most security tools answer:

> **“Is this website dangerous?”**

SENTINEL attempts to answer a broader question:

> **“Is this website trying to compromise my digital identity, what evidence supports that conclusion, and is it connected to a larger scam campaign?”**

SENTINEL combines:

```text
Browser Protection
       +
Risk Intelligence
       +
Identity Protection
       +
Threat Intelligence
       +
Scam DNA
       +
Scam Network
       +
Local AI
```

into one security platform.

---

# 🔒 Privacy by Design

SENTINEL is designed with privacy as a core principle.

The system should **never collect or store**:

- Passwords
- OTPs
- PINs
- Banking credentials
- Authentication codes

Browser detection focuses on the **presence of sensitive input fields**, rather than their contents.

Where identity information is required for future versions, it should be protected through hashing/tokenization and local processing wherever possible.

---

# ⚠️ Limitations

SENTINEL is an experimental security platform and should not be considered a replacement for:

- Antivirus software
- Enterprise security systems
- Browser security mechanisms
- Security operations centers
- Professional threat intelligence platforms

Risk scores are based on available signals and may produce:

- False positives
- False negatives
- Incomplete campaign relationships

Real-world threat intelligence would require additional external feeds and continuously updated datasets.

---

# ⚖️ Responsible Use

SENTINEL is intended for:

- Cybersecurity education
- Defensive security research
- Scam awareness
- Threat investigation
- Personal digital safety
- Hackathon demonstrations

Do not use SENTINEL to conduct unauthorized attacks, credential harvesting, surveillance, or other malicious activities.

---

# 📌 Project Status

| Component | Status |
|---|---|
| FastAPI Backend | ✅ |
| Risk Engine | ✅ |
| SQLite Storage | ✅ |
| Chrome Extension | ✅ |
| Browser Shield | ✅ |
| Brand Detection | ✅ |
| Identity Firewall | ✅ |
| Scam DNA | ✅ |
| Scam Network | ✅ |
| Local AI Analyst | ✅ |
| Security Center | ✅ |
| Advanced Analyzers | ✅ |
| Integration | ✅ |
| Documentation | ✅ |

---

# 👨‍💻 Author

**Nidhiraj**

BE — Artificial Intelligence & Machine Learning Engineering

GitHub:

```text
https://github.com/nidhiraj029
```

Project:

```text
https://github.com/nidhiraj029/SENTINEL
```

---

# 📄 License

This project is intended primarily for educational, research, and hackathon purposes.

Add an appropriate open-source license before distributing SENTINEL as a production security product.
