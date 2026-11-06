const API = "http://127.0.0.1:8000";

function pageSignals() {
  const inputs = [...document.querySelectorAll("input")];
  const passwordField = inputs.some(i => i.type === "password");
  const emailField = inputs.some(i =>
    i.type === "email" ||
    /email|mail/i.test(`${i.name} ${i.id} ${i.autocomplete} ${i.placeholder}`)
  );
  const phoneField = inputs.some(i =>
    i.type === "tel" ||
    /phone|mobile|tel/i.test(`${i.name} ${i.id} ${i.autocomplete} ${i.placeholder}`)
  );
  const loginDetected =
    passwordField ||
    /login|sign in|signin|authenticate|verify account/i.test(document.body?.innerText || "") ||
    /login|signin|sign-in|authenticate/i.test(location.pathname);

  const formActions = [...document.forms]
    .map(f => f.action)
    .filter(Boolean)
    .slice(0, 5);

  return {
    login_detected: loginDetected,
    password_field: passwordField,
    email_field: emailField,
    phone_field: phoneField,
    page_title: document.title.slice(0, 160),
    visible_text_signals: (document.body?.innerText || "")
      .split(/\s+/)
      .filter(x => /urgent|immediately|act now|suspended|expires today|verify now/i.test(x))
      .slice(0, 20),
    form_actions: formActions
  };
}

async function scan() {
  if (/^(chrome|edge|about|chrome-extension):\/\//.test(location.href)) return;

  const signals = pageSignals();
  try {
    const response = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        url: location.href,
        ...signals
      })
    });
    const result = await response.json();
    await chrome.storage.local.set({sentinel_current_result: result});

    if (result.score >= 76) showWarning(result);
  } catch (_) {}
}

function showWarning(result) {
  if (document.getElementById("sentinel-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "sentinel-overlay";
  overlay.innerHTML = `
    <div style="
      position:fixed;inset:0;z-index:2147483647;background:rgba(3,7,18,.82);
      display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;
    ">
      <div style="
        width:min(560px,calc(100vw - 40px));background:#0b1020;color:#f8fafc;
        border:1px solid #ef4444;border-radius:20px;padding:28px;
        box-shadow:0 25px 80px rgba(0,0,0,.6);
      ">
        <div style="font-size:28px;font-weight:800;margin-bottom:8px">🚨 SENTINEL ALERT</div>
        <div style="font-size:18px;font-weight:800;color:#f87171">THIS WEBSITE MAY BE DANGEROUS</div>
        <div style="font-size:52px;font-weight:900;margin:18px 0 2px">${result.score}/100</div>
        <div style="font-size:13px;color:#fca5a5;margin-bottom:18px">${result.classification}</div>
        <div style="display:grid;gap:8px;margin-bottom:22px">
          ${(result.reasons || []).slice(0,5).map(r => `<div style="background:#151b2e;border-radius:9px;padding:9px">⚠ ${r.signal}</div>`).join("")}
        </div>
        <div style="display:flex;gap:10px">
          <button id="sentinel-leave" style="flex:1;padding:12px;border:0;border-radius:10px;background:#ef4444;color:white;font-weight:800">LEAVE SITE</button>
          <button id="sentinel-continue" style="flex:1;padding:12px;border:1px solid #475569;border-radius:10px;background:#111827;color:white;font-weight:800">CONTINUE</button>
        </div>
      </div>
    </div>`;
  document.documentElement.appendChild(overlay);

  document.getElementById("sentinel-leave").onclick = () => history.back();
  document.getElementById("sentinel-continue").onclick = () => overlay.remove();
}

scan();
