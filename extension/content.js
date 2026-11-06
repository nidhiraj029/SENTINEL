const API = "http://127.0.0.1:8000";

function isRestrictedUrl(url) {
  return /^(chrome|edge|about|chrome-extension|devtools|view-source):\/\//i.test(url);
}

function extractPageSignals() {
  const inputs = Array.from(document.querySelectorAll("input"));
  const fieldMeta = inputs.map(i => {
    const context = `${i.name} ${i.id} ${i.autocomplete} ${i.placeholder} ${i.getAttribute("aria-label") || ""}`;
    const label = i.labels?.[0]?.innerText || "";
    const hint = `${context} ${label}`.trim();
    const types = [];
    if (i.type === "password" || /pass(word)?|current-password|new-password/i.test(hint)) types.push("password");
    if (i.type === "email" || /email|e-mail|mail address/i.test(hint)) types.push("email");
    if (i.type === "tel" || /phone|mobile|telephone|tel number/i.test(hint)) types.push("phone");
    if (/user(name)?|account|customer.?id|member.?id/i.test(hint)) types.push("account");
    return { types: [...new Set(types)], hint: hint.slice(0, 80) };
  }).filter(f => f.types.length);
  const fieldTypes = new Set(fieldMeta.flatMap(f => f.types));
  const passwordField = fieldTypes.has("password");
  const emailField = fieldTypes.has("email");
  const phoneField = fieldTypes.has("phone");

  const pageText = (document.body?.innerText || "").slice(0, 10000);
  const loginDetected =
    passwordField ||
    /login|sign in|signin|authenticate|verify account|log in/i.test(pageText) ||
    /login|signin|sign-in|authenticate/i.test(location.pathname);

  const urgencyRegex = /\b(urgent|immediately|act now|suspended|expires today|verify now|unauthorized access|action required)\b/gi;
  const visibleSignals = (pageText.match(urgencyRegex) || [])
    .map(s => s.toLowerCase())
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 10);

  // Account creation detection — look for register/signup patterns
  const accountCreation =
    /register|sign[\s-]?up|create[\s-]?account|join[\s-]?now|new[\s-]?account/i.test(pageText) ||
    inputs.some(i =>
      /name|first.?name|last.?name|dob|birthday|zip|postal|country|gender/i.test(
        `${i.name} ${i.id} ${i.autocomplete} ${i.placeholder}`
      )
    );

  const formActions = Array.from(document.forms)
    .map(f => f.action)
    .filter(Boolean)
    .slice(0, 5);

  return {
    url: location.href,
    login_detected: loginDetected,
    password_field: passwordField,
    email_field: emailField,
    phone_field: phoneField,
    account_creation: accountCreation,
    page_title: document.title.slice(0, 160),
    visible_text_signals: visibleSignals,
    form_actions: formActions,
    identity_fields_detected: [...fieldTypes],
    identity_field_count: fieldMeta.length
  };
}

function showWarningOverlay(result) {
  if (document.getElementById("sentinel-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "sentinel-overlay";
  overlay.style.cssText = `
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483647 !important;
    background: rgba(4, 7, 16, 0.94) !important;
    backdrop-filter: blur(8px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    padding: 20px !important;
  `;

  const reasonsList = (result.reasons || [])
    .slice(0, 5)
    .map(r => `
      <div style="
        background: rgba(239, 68, 68, 0.08);
        border-left: 3px solid #ef4444;
        border-radius: 6px;
        padding: 8px 12px;
        color: #fecaca;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span style="color:#ef4444;font-weight:bold">•</span>
        <span>${r.signal}</span>
      </div>
    `).join("");

  overlay.innerHTML = `
    <div style="
      width: min(560px, 100%);
      background: #090e1a;
      border: 1px solid rgba(239, 68, 68, 0.6);
      box-shadow: 0 0 50px rgba(239, 68, 68, 0.25), 0 25px 60px rgba(0, 0, 0, 0.8);
      border-radius: 16px;
      padding: 30px;
      color: #f8fafc;
      box-sizing: border-box;
      animation: sentinelFadeIn 0.2s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444;
          display: grid; place-items: center; font-size: 22px;
        ">⚠</div>
        <div>
          <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">
            SENTINEL SECURITY ALERT
          </div>
          <div style="font-size: 13px; color: #f87171; font-weight: 600;">
            This website may be dangerous.
          </div>
        </div>
      </div>

      <div style="
        display: flex; align-items: baseline; justify-content: space-between;
        margin: 20px 0 16px 0; padding: 14px 18px;
        background: #0d1527; border-radius: 12px; border: 1px solid #1e293b;
      ">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">
            Risk Score
          </div>
          <div style="font-size: 42px; font-weight: 900; color: #ef4444; line-height: 1.1;">
            ${result.score}<span style="font-size: 20px; color: #64748b; font-weight: 500;">/100</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="
            display: inline-block; padding: 6px 12px; border-radius: 8px;
            background: #ef4444; color: #ffffff; font-size: 12px; font-weight: 800;
            letter-spacing: 0.5px; text-transform: uppercase;
          ">
            ${result.level || "DANGEROUS"}
          </div>
          <div style="font-size: 12px; color: #fca5a5; margin-top: 6px;">
            ${result.classification || "THREAT DETECTED"}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
          Key Risk Indicators:
        </div>
        <div style="display: grid; gap: 8px;">
          ${reasonsList || '<div style="color:#94a3b8;font-size:13px;">Multiple suspicious signals detected.</div>'}
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <button id="sentinel-leave-btn" style="
          flex: 1.2; padding: 13px; border: none; border-radius: 10px;
          background: #ef4444; color: #ffffff; font-size: 14px; font-weight: 800;
          cursor: pointer; transition: background 0.2s;
        ">LEAVE SITE</button>
        <button id="sentinel-continue-btn" style="
          flex: 1; padding: 13px; border: 1px solid #334155; border-radius: 10px;
          background: #111827; color: #cbd5e1; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        ">CONTINUE</button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(overlay);

  document.getElementById("sentinel-leave-btn").onclick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "about:blank";
    }
  };

  document.getElementById("sentinel-continue-btn").onclick = () => {
    overlay.remove();
    attachMiniWarning(result);
  };
}

function attachMiniWarning(result) {
  if (document.getElementById("sentinel-mini-pill")) return;
  const pill = document.createElement("div");
  pill.id = "sentinel-mini-pill";
  pill.style.cssText = `
    position: fixed !important;
    bottom: 16px !important;
    right: 16px !important;
    z-index: 2147483646 !important;
    background: #0f172a !important;
    color: #f87171 !important;
    border: 1px solid #ef4444 !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
    padding: 8px 14px !important;
    border-radius: 30px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    font-family: sans-serif !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    cursor: pointer !important;
  `;
  pill.innerHTML = `🛡️ SENTINEL: ${result.level} (${result.score}/100)`;
  pill.onclick = () => showWarningOverlay(result);
  document.documentElement.appendChild(pill);
}

async function runPageScan() {
  if (isRestrictedUrl(location.href)) return;

  const payload = extractPageSignals();

  // Primary: notify background worker to run scan with rich DOM signals
  chrome.runtime.sendMessage(
    { type: "SENTINEL_CONTENT_SIGNALS", payload },
    (response) => {
      if (chrome.runtime.lastError || !response?.result) {
        // Fallback: direct fetch if background worker is busy or reloading
        fetch(`${API}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(r => r.json())
          .then(result => {
            chrome.storage.local.set({ sentinel_last_result: result });
            if (result.score >= 76) showWarningOverlay(result);
          })
          .catch(() => {});
        return;
      }

      const result = response.result;
      if (result && result.score >= 76) {
        showWarningOverlay(result);
      }
    }
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SENTINEL_SCAN_NOW") {
    const payload = extractPageSignals();
    chrome.runtime.sendMessage({type:"SENTINEL_CONTENT_SIGNALS", payload}, response => {
      if (chrome.runtime.lastError) sendResponse({success:false});
      else sendResponse({success:true, result:response?.result || null});
    });
    return true;
  }
});

// Listen for push notifications from background worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SENTINEL_SCAN_RESULT" || message.type === "SENTINEL_WARNING") {
    const result = message.result;
    if (result && result.score >= 76) {
      showWarningOverlay(result);
    }
  }
});

runPageScan();
