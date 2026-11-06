# SENTINEL

### Personal Digital Identity Firewall

> Before you trust a website with your identity, SENTINEL checks whether you should.

SENTINEL is a hackathon-ready cybersecurity MVP combining a Chrome Manifest V3 extension, FastAPI backend, SQLite event storage, explainable risk scoring, Scam DNA classification, protected-identity concepts, and an optional local Ollama AI analyst.

## Current MVP

- FastAPI risk engine
- Explainable 0–100 risk score
- Scam classification
- Brand impersonation detection
- Lookalike/typosquatting heuristics
- Login/password-field signal support
- SQLite scan history
- Security dashboard
- Chrome extension popup
- Automatic page signal collection
- Warning overlay for high-risk pages
- Local Ollama explanation with deterministic fallback
- Safe demo scenarios

## Privacy

SENTINEL never needs password values, OTPs, PINs, CVVs, cookies, or authentication tokens. The extension only sends URL and sanitized page metadata/signals.

## Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open:

```text
http://127.0.0.1:8000
```

Dashboard:

```text
http://127.0.0.1:8000/dashboard
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Chrome extension

1. Open Chrome.
2. Visit `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the `extension` folder.
6. Keep the FastAPI backend running.

## Safe demo

Do not visit real malicious websites.

Use the dashboard's Demo Scenarios or API:

```bash
curl -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"http://paypal-login-security.com/verify/account","login_detected":true,"password_field":true,"email_field":true}'
```

This synthetic URL is used only as a test string.

## Ollama

Optional. If Ollama is running locally:

```text
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:1.5b
```

SENTINEL works without Ollama using a deterministic explanation fallback.

## Limitations

This is a hackathon MVP. Its threat intelligence is heuristic/rule-based and should not be treated as a replacement for commercial threat intelligence, browser security, or professional incident response.
