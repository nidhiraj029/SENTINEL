import sys
sys.path.insert(0, ".")
from backend.main import analyze, AnalyzeRequest

def test(label, cond, detail=""):
    if cond:
        print(f"  PASS  {label}")
    else:
        print(f"  FAIL  {label} {detail}")
        sys.exit(1)

# 1. Official Google
r1 = analyze(AnalyzeRequest(url="https://google.com"))
test("https://google.com -> SAFE", r1["score"] == 0 and r1["level"] == "LOW RISK", str(r1["score"]))

# 2. WWW Google
r2 = analyze(AnalyzeRequest(url="https://www.google.com"))
test("https://www.google.com -> SAFE", r2["score"] == 0 and r2["level"] == "LOW RISK", str(r2["score"]))

# 3. Fake PayPal
r3 = analyze(AnalyzeRequest(url="http://paypal-login-security.com/verify/account"))
test("Fake PayPal -> DANGEROUS", r3["score"] == 100 and r3["level"] == "DANGEROUS", str(r3["score"]))

# 4. No duplicate brand signals
sigs = [r["signal"] for r in r3["reasons"]]
test("No duplicate 'Paypal impersonation'", sigs.count("Possible Paypal impersonation") == 1, str(sigs))
test("No duplicate 'Lookalike brand pattern'", sigs.count("Lookalike brand pattern") == 1, str(sigs))

# 5. Identity risk detection
r4 = analyze(AnalyzeRequest(
    url="http://suspicious-portal-update.xyz/login",
    email_field=True, phone_field=True, password_field=True
))
test("Multi-field identity harvesting -> HIGH", r4["identity_risk"] == "HIGH", r4["identity_risk"])
test("Identity fields reported", r4["identity_fields"]["email"] is True and r4["identity_fields"]["password"] is True)

# 6. Identity risk on trusted domain is LOW (accounts.google.com)
# Note: login_path (+15) + password_field (+20) = 35 — URL signals fire before trust check.
# Brand impersonation is gated by trust. Identity risk must be LOW (not HIGH) for trusted domains.
r5 = analyze(AnalyzeRequest(
    url="https://accounts.google.com/signin",
    email_field=True, password_field=True
))
test("Google accounts: no brand impersonation signal", 
     not any("impersonation" in r["signal"].lower() for r in r5["reasons"]),
     f"reasons={[r['signal'] for r in r5['reasons']]}")
test("Google accounts: identity_risk is LOW (trusted domain)",
     r5["identity_risk"] == "LOW",
     f"identity_risk={r5['identity_risk']}")

print()
print("ALL REGRESSION TESTS PASSED!")
print(f"  google.com:          {r1['score']}/100  {r1['level']}")
print(f"  www.google.com:      {r2['score']}/100  {r2['level']}")
print(f"  paypal-login-*.com:  {r3['score']}/100  {r3['level']}")
print(f"  Signals: {sigs}")
print(f"  Identity harvest:    {r4['identity_risk']}")
print(f"  Google accounts:     {r5['score']}/100  identity={r5['identity_risk']}")

