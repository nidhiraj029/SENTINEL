SENTINEL
Personal Digital Identity Firewall
“Before you trust a website with your identity, SENTINEL checks whether you should.”

SENTINEL is a hackathon-ready cybersecurity MVP combining a Chrome Manifest V3 extension, FastAPI backend, SQLite event storage, explainable risk scoring, Scam DNA classification, protected-identity concepts, and an optional local Ollama AI security analyst.

The goal is simple:

Don't just detect a scam. Understand the threat behind it and protect the user's digital identity before sensitive information is submitted.

🚀 What is SENTINEL?
SENTINEL is a personal browser security and scam-intelligence platform built around three connected components:

                    SENTINEL
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Web Security   Chrome      FastAPI Risk
       Center      Extension       Engine
                      │               │
                      └───────┬───────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
          Risk Engine    Identity       Threat
                         Firewall     Intelligence
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
              Scam DNA   Scam Network   Local AI
Web Security Center
The central investigation and control interface.

Users can:

Analyze suspicious URLs
View risk scores
Inspect security signals
View scan history
Monitor security statistics
Investigate threats
Analyze suspicious messages/emails/QR-related inputs
Review identity security
Request AI-powered explanations
Chrome/Chromium Browser Shield
The browser extension provides real-time protection while browsing.

It can:

Analyze visited URLs
Collect sanitized page signals
Detect login pages
Detect password/email/phone fields
Calculate per-site identity risk
Display risk information
Show warnings for high-risk pages
Communicate with the FastAPI backend
FastAPI Risk Engine
The backend performs the core security analysis.

It handles:

URL normalization
Domain analysis
Risk scoring
Suspicious keyword detection
Brand impersonation detection
Lookalike/typosquatting heuristics
Login-page detection
Identity-risk signals
Redirect analysis
Threat classification
Scan history
Scam DNA fingerprinting
Local AI explanations
🛡️ Current MVP
The current SENTINEL MVP includes:

✅ FastAPI risk engine
✅ Explainable 0–100 risk score
✅ Risk classification
✅ Scam classification
✅ Brand impersonation detection
✅ Lookalike/typosquatting heuristics
✅ Login/password-field signal support
✅ SQLite scan history
✅ Security dashboard
✅ Chrome Manifest V3 extension
✅ Chrome extension popup
✅ Automatic page signal collection
✅ High-risk warning overlay
✅ Protected identity concepts
✅ Popup identity-field inventory
✅ Per-site identity risk
✅ Scam DNA fingerprint matching
✅ Related-domain clustering
✅ Local Ollama AI explanation
✅ Deterministic AI explanation fallback
✅ Offline popup explanation fallback
✅ Email/message/QR analysis workflows
✅ Safe demo scenarios
✅ Web + extension + backend integration
🎯 Core Risk Model
SENTINEL uses a simple, explainable 0–100 risk score.

Score	Risk Level	Meaning
0–30	🟢 LOW RISK	No major suspicious indicators
31–50	🟡 SUSPICIOUS	Some security concerns detected
51–75	🟠 HIGH RISK	Multiple strong warning indicators
76–100	🔴 DANGEROUS	Strong evidence of phishing/scam behavior
Example:

https://google.com

Score:          0
Risk Level:     LOW RISK
Classification: SAFE
Synthetic phishing demo:

http://paypal-login-security.com/verify/account

Score:          100
Risk Level:     DANGEROUS
Classification: PHISHING
🔍 Security Signals
SENTINEL combines multiple explainable signals instead of relying on one indicator.

URL and Domain Signals
Missing HTTPS
IP-address URLs
Multiple hyphens
Excessive subdomains
Punycode/IDN domains
Suspicious TLDs
Suspicious keywords
Login/sign-in paths
Redirect chains
Identity Signals
Login page detected
Password field detected
Email field detected
Phone field detected
Protected identity requested
Identity-targeting behavior
Brand Protection
SENTINEL detects potential:

Brand impersonation
Lookalike domains
Typosquatting patterns
Suspicious brand references
Legitimate official domains and subdomains are handled separately from suspicious lookalikes.

🧬 Scam DNA
Traditional phishing detection asks:

“Is this URL dangerous?”

SENTINEL goes one step further.

Scam DNA asks:
“What characteristics does this scam share with other scams?”

A scam fingerprint can contain characteristics such as:

Domain structure
Suspicious keywords
Brand impersonation
URL patterns
Redirect behavior
Login-page characteristics
Identity targeting
Scam language
Other security indicators
This allows SENTINEL to identify related suspicious domains and campaign patterns.

Scam URL
   │
   ▼
Extract Signals
   │
   ▼
Create Scam DNA Fingerprint
   │
   ▼
Compare With Known Patterns
   │
   ▼
Find Related Domains / Campaigns
🕸️ Scam Network Intelligence
SENTINEL models relationships between suspicious entities.

             ┌──────────────┐
             │   Campaign   │
             └──────┬───────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     Domain       Brand        URL
        │                       │
        ▼                       ▼
   Redirects              Login Page
        │                       │
        └───────────┬───────────┘
                    ▼
              Identity Target
The investigation can therefore move from:

URL
 ↓
Threat
 ↓
Campaign
 ↓
Network
instead of treating every suspicious URL as an isolated event.

🧠 Local AI Security Analyst
SENTINEL optionally integrates with Ollama for local AI-powered security explanations.

The AI analyst can explain:

Why a website is risky
Which signals contributed to the score
What the detected threat means
What the user should do next
Why a domain may be impersonating a brand
What suspicious characteristics were detected
Example:

User:
Why is this website dangerous?

SENTINEL AI:
The website uses a suspicious domain pattern,
contains a login path, requests identity information,
and appears to imitate a known brand.
Avoid entering credentials and leave the page.
Local-first architecture
SENTINEL
   │
   ├── Ollama available
   │       ↓
   │   Local AI analysis
   │
   └── Ollama unavailable
           ↓
      Deterministic fallback
This allows SENTINEL to remain functional without paid cloud AI APIs.

🔐 Privacy by Design
SENTINEL follows the principle:

Protect the identity without collecting the identity.

The extension does not need:

❌ Password values
❌ OTPs
❌ PINs
❌ CVVs
❌ Banking credentials
❌ Cookies
❌ Authentication tokens
The browser extension sends only the URL and sanitized page metadata/security signals required for analysis.

For example:

Allowed:
URL
Login detected = true
Password field detected = true
Email field detected = true
Page title
Sanitized security signals

Not collected:
Actual password
Actual OTP
Actual PIN
Actual card number
Authentication token
🖥️ Security Center
The Security Center is the main investigation interface.

It can provide:

Overall security statistics
Recent scans
Risk distribution
Threat history
URL investigation
Identity security status
Scam DNA information
Related-domain information
AI security analysis
Additional security analyzers
The dashboard is intended to answer three questions:

1. What happened?
2. Why is it dangerous?
3. What should I do?
🧰 Advanced Security Tools
The MVP includes additional investigation workflows such as:

URL Analyzer
Analyze a URL and receive:

Risk score
Classification
Security reasons
Detected signals
Confidence
Email Analyzer
Analyze suspicious email content for scam/phishing indicators.

Message Analyzer
Analyze suspicious SMS/message content.

QR Analyzer
Support analysis of QR-related scam inputs.

Identity Risk
Show what identity-related fields a site is requesting and calculate the associated risk.

🔌 API
Core Endpoints
Method	Endpoint	Purpose
GET	/	API/project information
GET	/dashboard	Security dashboard
GET	/api/health	Backend health
GET	/api/risk-rules	Risk rules
POST	/api/analyze	Analyze URL/page
GET	/api/history	Scan history
GET	/api/stats	Security statistics
POST	/api/identity/register	Register protected identity
GET	/api/identity/status	Identity protection status
POST	/api/ai/explain	AI security explanation
POST	/api/analyze/email	Analyze email
POST	/api/analyze/message	Analyze message
POST	/api/analyze/qr	Analyze QR input
Interactive API documentation:

http://127.0.0.1:8000/docs
📁 Project Structure
SENTINEL/
│
├── backend/
│   ├── .venv/
│   ├── main.py
│   ├── requirements.txt
│   └── sentinel.db
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
├── .gitignore
├── README.md
└── run.sh
⚙️ Technology Stack
Frontend
HTML
CSS
JavaScript
Browser Extension
Chrome Manifest V3
JavaScript
Content Scripts
Background Service Worker
Chrome Extension APIs
Backend
Python
FastAPI
Uvicorn
Pydantic
SQLite
HTTPX
AI
Ollama
Local LLMs
Security Intelligence
Rule-based analysis
Domain intelligence
Brand detection
Risk scoring
Scam DNA
Related-domain clustering
Threat classification
🚀 Installation
Requirements
Install:

Python 3.10+
Google Chrome or Chromium
Git
Ollama (optional)
Clone Repository
git clone https://github.com/nidhiraj029/SENTINEL.git
cd SENTINEL
Start Backend
Option 1 — Using run.sh
./run.sh
Option 2 — Manually
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --host 127.0.0.1 --port 8000
Backend:

http://127.0.0.1:8000
Dashboard:

http://127.0.0.1:8000/dashboard
API docs:

http://127.0.0.1:8000/docs
🌐 Chrome Extension Installation
Open Google Chrome.
Visit:
chrome://extensions/
Enable Developer mode.
Click Load unpacked.
Select:
SENTINEL/extension
Pin SENTINEL to the Chrome toolbar.
Keep the FastAPI backend running.
The extension communicates with:

http://127.0.0.1:8000
🧪 Safe Demo
Do not visit real malicious websites for testing.

SENTINEL provides safe synthetic test scenarios.

Example:

curl -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"http://paypal-login-security.com/verify/account","login_detected":true,"password_field":true,"email_field":true}'
The URL above is used only as a synthetic test string.

A legitimate test:

curl -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
Expected:

Score:          0
Risk Level:     LOW RISK
Classification: SAFE
🦙 Ollama
Ollama is optional.

If Ollama is installed and running locally, SENTINEL can use:

OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:1.5b
SENTINEL still works when Ollama is unavailable because the system provides deterministic explanation fallbacks.

🧪 Testing Strategy
SENTINEL should be tested using:

Safe URLs
https://google.com
https://www.google.com
Synthetic phishing URL
http://paypal-login-security.com/verify/account
Identity scenarios
Login page
Password field
Email field
Phone field
Protected identity
AI scenarios
Ollama available
Ollama unavailable
Fallback explanation
Extension scenarios
Safe page
Suspicious page
High-risk page
Login page
Identity form
🗺️ Development Roadmap
SENTINEL is organized into exactly 8 development phases.

Phase 1 — Risk Intelligence Engine / Browser Shield Foundation
Status: ✅ 100% Complete

Foundation of the SENTINEL security engine.

Implemented:

URL analysis
URL normalization
Domain analysis
Explainable risk scoring
Risk classification
Suspicious URL detection
Security signals
Brand detection
Lookalike-domain heuristics
SQLite scan history
FastAPI endpoints
Initial browser-shield integration
Phase 2 — Real-Time Chrome Protection
Status: ✅ 100% Complete

Browser-based real-time protection.

Implemented:

Chrome/Chromium extension
Manifest V3
URL monitoring
Automatic page signal collection
Login detection
Password-field detection
Email/phone signal detection
Backend risk analysis
Extension popup
High-risk warning overlay
Phase 3 — Protected Identity Firewall
Status: ✅ 100% Complete

Identity-focused browser protection.

Implemented:

Identity field inventory
Email detection
Phone detection
Password/login security signals
Protected identity concepts
Per-site identity risk
Privacy-first identity handling
Core principle:

Detect the identity threat.
Do not collect the identity secret.
Phase 4 — Scam DNA + Threat Intelligence
Status: ✅ 100% Complete

Campaign-oriented threat intelligence.

Implemented:

Scam fingerprints
Suspicious domain patterns
Threat indicators
Brand impersonation patterns
Lookalike patterns
Related scam characteristics
Scam DNA matching
Related-domain clustering
Phase 5 — Scam Network Graph
Status: ✅ 100% Complete

Relationship-based scam investigation.

Implemented:

Domain entities
Brand entities
URL relationships
Campaign relationships
Threat connections
Related-domain investigation
Network-oriented threat analysis
Concept:

Brand
  ↓
Domain
  ↓
URL
  ↓
Campaign
  ↓
Identity Target
Phase 6 — Local AI Security Analyst
Status: ✅ 100% Complete

Local AI-powered security analysis.

Implemented:

Ollama integration
Security explanations
Risk interpretation
Threat reasoning
Recommended actions
Local AI operation
Deterministic fallback
Offline popup explanation fallback
Phase 7 — Security Center + Advanced Security Tools
Status: ✅ 100% Complete

Centralized security investigation interface.

Implemented:

Security dashboard
Risk statistics
Scan history
Threat investigation
Identity security
AI security analysis
Email analyzer
Message analyzer
QR analyzer
Advanced investigation workflows
Phase 8 — Complete Integration + Testing + Hackathon Demo
Status: ✅ 100% Complete

Final integration of all major components.

Chrome Extension
       │
       ▼
FastAPI Risk Engine
       │
       ├── Risk Intelligence
       ├── Identity Firewall
       ├── Scam DNA
       ├── Scam Network
       └── Local AI
       │
       ▼
Security Center
Completed:

Web + extension integration
Backend integration
End-to-end workflows
Risk-engine testing
Browser protection testing
Identity testing
Scam DNA testing
AI testing
Dashboard testing
Safe demo scenarios
GitHub-ready project structure
📊 Project Completion
Component	Status
Risk Intelligence Engine	✅ Complete
Browser Shield	✅ Complete
Chrome Extension	✅ Complete
Identity Firewall	✅ Complete
Scam DNA	✅ Complete
Threat Intelligence	✅ Complete
Scam Network	✅ Complete
Local AI Analyst	✅ Complete
Security Center	✅ Complete
Advanced Security Tools	✅ Complete
Web Application	✅ Complete
Backend API	✅ Complete
End-to-End Integration	✅ Complete
Hackathon MVP	✅ Complete
🎤 Hackathon Demo Flow
A recommended demo sequence:

1. Start SENTINEL
Launch:

FastAPI Backend
+
Chrome Extension
+
Security Center
2. Show the Security Center
Display:

Security statistics
Recent scans
Threat activity
Identity protection
Risk distribution
3. Visit a Safe Website
Use:

https://google.com
Show:

LOW RISK
SAFE
4. Demonstrate a Synthetic Phishing Scenario
Use:

paypal-login-security.com
Show:

DANGEROUS
PHISHING
5. Explain the Detection
Show:

Suspicious domain
HTTP connection
Login path
Suspicious keywords
Brand impersonation
Identity targeting
6. Show Scam DNA
Explain how the system extracts characteristics and finds related suspicious patterns.

7. Show Scam Network Intelligence
Demonstrate:

Brand
 ↓
Suspicious Domain
 ↓
URL
 ↓
Campaign
 ↓
Identity Target
8. Demonstrate the AI Security Analyst
Ask:

Why is this website dangerous?

Show the local AI explanation.

9. Finish With the Core Message
SENTINEL doesn't just detect the scam. It helps explain the attack, identify related threats, and protect the user's digital identity before it's too late.

🏆 Why SENTINEL?
Most basic phishing tools answer one question:

“Is this URL safe?”

SENTINEL aims to answer several:

Is this website dangerous?
        ↓
Why is it dangerous?
        ↓
Is it targeting my identity?
        ↓
Does it resemble other scams?
        ↓
What campaign could it belong to?
        ↓
What should I do?
That transforms SENTINEL from a simple URL checker into a:

Personal Digital Identity Firewall + Scam Intelligence Platform

⚠️ Limitations
SENTINEL is a hackathon MVP.

Its threat intelligence and detection mechanisms are primarily heuristic/rule-based and should not be treated as a replacement for:

Commercial threat-intelligence platforms
Enterprise browser security
Endpoint detection and response
Professional incident response
Security operations centers
Production-grade anti-phishing infrastructure
The project is intended for educational, research, demonstration, and authorized security-testing purposes.

🔒 Responsible Use
Only analyze websites, systems, and data that you are authorized to inspect.

Do not use SENTINEL to:

Collect credentials
Capture authentication tokens
Intercept private communications
Bypass security controls
Attack systems without authorization
📜 License
This project is intended as a hackathon and educational cybersecurity project.

Use responsibly and only against systems and data you are authorized to analyze.
