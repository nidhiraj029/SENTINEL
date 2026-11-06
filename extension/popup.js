const API = "http://127.0.0.1:8000";

const $ = (id) => document.getElementById(id);

function updateUI(result, url) {
  if (!result) return;

  const score = result.score ?? 0;
  const level = result.level || "UNKNOWN";
  const classification = result.classification || "ANOMALY ANALYSIS";
  const domain = result.domain || (url ? new URL(url).hostname : "Target Site");

  $("domain").textContent = domain;
  $("domain").title = result.url || url || "";

  // Protocol check
  const isHttps = (result.url || url || "").startsWith("https://");
  const protoEl = $("security-protocol");
  if (isHttps) {
    protoEl.textContent = "HTTPS ENCRYPTED";
    protoEl.className = "protocol-badge";
  } else {
    protoEl.textContent = "HTTP INSECURE";
    protoEl.className = "protocol-badge insecure";
  }

  // Identity detection banner
  const identityBanner = $("identity-banner");
  if (result.identity_detected || result.identity_protected) {
    identityBanner.classList.remove("hidden");
    const idDesc = result.identity_protected
      ? "Protected user identity requested"
      : "Identity fields (Email/Phone) detected";
    $("identity-text").textContent = idDesc;
  } else {
    identityBanner.classList.add("hidden");
  }
  const fields = result.identity_fields || {};
  const detected = Object.entries({email: fields.email, phone: fields.phone, password: fields.password, account: fields.account_creation || fields.account})
    .filter(([, found]) => found).map(([name]) => name);
  const fieldTypes = result.identity_fields_detected || [];
  const shown = [...new Set([...detected, ...fieldTypes])];
  $("identity-details").textContent = `Identity fields: ${shown.length ? shown.join(", ") : "none detected"} • Site identity risk: ${result.identity_risk || "UNKNOWN"}`;

  $("seen-before").textContent = result.seen_before ? "Seen before" : "New to this device";
  $("seen-before").classList.toggle("seen", Boolean(result.seen_before));
  $("campaign-info").textContent = result.campaign_fingerprint ? `Fingerprint ${result.campaign_fingerprint}` : "No campaign fingerprint available";
  const related = result.related_domains || [];
  $("related-domains").textContent = related.length ? `Related domains: ${related.join(", ")}` : "No matching campaigns in local history";

  // Risk Score & Badge
  $("score").textContent = score;
  $("level").textContent = level;
  $("classification").textContent = classification.replace(/_/g, " ");

  const card = $("score-card");
  card.className = "score-card";
  if (score <= 30) {
    card.classList.add("safe");
  } else if (score <= 50) {
    card.classList.add("suspicious");
  } else if (score <= 75) {
    card.classList.add("high");
  } else {
    card.classList.add("dangerous");
  }

  // Threat reasons
  const reasonsEl = $("reasons");
  reasonsEl.innerHTML = "";
  const reasons = result.reasons || [];
  $("signal-count").textContent = reasons.length;

  if (reasons.length > 0) {
    reasons.slice(0, 6).forEach((r) => {
      const item = document.createElement("div");
      item.className = `reason ${r.severity || "medium"}`;
      item.innerHTML = `<span>⚠</span> <span>${r.signal}</span>`;
      reasonsEl.appendChild(item);
    });
  } else {
    const item = document.createElement("div");
    item.className = "reason safe";
    item.innerHTML = `<span>✓</span> <span>No significant threats detected</span>`;
    reasonsEl.appendChild(item);
  }
}

function localExplanation(result) {
  const signals = (result.reasons || []).slice(0, 2).map(r => r.signal).join(" and ");
  return `SENTINEL scored this site ${result.score ?? 0}/100 (${result.level || "unknown risk"}). ${signals ? `The main indicators are ${signals}.` : "No strong indicators were found."} Avoid entering sensitive information until you trust the site.`;
}

async function explainRisk() {
  const button = $("explain-btn"), box = $("explanation");
  button.disabled = true; button.textContent = "ANALYZING…"; box.classList.remove("hidden");
  const tab = await getActiveTab();
  let result = window.currentResult;
  try {
    if (!result) throw new Error("No scan result");
    const response = await fetch(`${API}/api/ai/explain`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({url:result.url || tab?.url || "", score:result.score || 0, classification:result.classification || "UNKNOWN", signals:(result.reasons || []).map(r => r.signal)})});
    if (!response.ok) throw new Error("AI service unavailable");
    const data = await response.json();
    box.textContent = `${data.explanation} (${data.provider === "ollama" ? "Ollama" : "offline fallback"})`;
  } catch (_) {
    box.textContent = localExplanation(result || {score:0, reasons:[]}) + " (offline fallback)";
  } finally { button.disabled = false; button.textContent = "WHY IS THIS DANGEROUS?"; }
}

async function getActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  } catch (_) {
    return null;
  }
}

async function loadCachedOrScan() {
  const tab = await getActiveTab();
  if (!tab || !tab.url) {
    $("domain").textContent = "No Active Tab";
    $("classification").textContent = "Open a website to analyze";
    return;
  }

  // Try loading cached result immediately for instant response
  try {
    const key = `scan_${tab.id}`;
    const stored = await chrome.storage.local.get([key, "sentinel_last_result"]);
    const cached = stored[key] || stored.sentinel_last_result;
    if (cached && (cached.url === tab.url || cached.domain === new URL(tab.url).hostname)) {
      updateUI(cached, tab.url);
      window.currentResult = cached;
      return;
    }
  } catch (_) {}

  // If no cache or different tab, run scan
  await runScan();
}

async function runScan() {
  const btn = $("scan-btn");
  const txt = $("scan-text");
  const originalText = txt.textContent;

  txt.textContent = "ANALYZING...";
  btn.disabled = true;
  $("message").textContent = "Querying SENTINEL Risk Intelligence Engine...";

  try {
    const tab = await getActiveTab();
    if (!tab || !tab.url) throw new Error("No active URL");

    let result = null;
    try {
      const scanned = await chrome.tabs.sendMessage(tab.id, {type:"SENTINEL_SCAN_NOW"});
      result = scanned?.result || null;
    } catch (_) {}
    if (!result) {
      const response = await fetch(`${API}/api/analyze`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({url:tab.url})});
      if (!response.ok) throw new Error(`Engine returned ${response.status}`);
      result = await response.json();
    }
    updateUI(result, tab.url);
    window.currentResult = result;

    if (tab.id) {
      await chrome.storage.local.set({
        [`scan_${tab.id}`]: result,
        sentinel_last_result: result
      });
    }

    $("message").textContent = `Scan complete • Score: ${result.score}/100`;
  } catch (error) {
    $("message").textContent = "Engine offline. Start backend on port 8000.";
  } finally {
    txt.textContent = originalText;
    btn.disabled = false;
  }
}

$("scan-btn").addEventListener("click", runScan);
$("explain-btn").addEventListener("click", explainRisk);
loadCachedOrScan();
