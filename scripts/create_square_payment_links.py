#!/usr/bin/env python3
"""
create_square_payment_links.py
Creates 5 one-time setup fee payment links via Square API.
Monthly subscription links must be created manually in the Square UI (Quick Pay does not support recurring).

Usage:
    python3 scripts/create_square_payment_links.py --env sandbox
    python3 scripts/create_square_payment_links.py --env production
"""

import argparse
import os
import time
import uuid
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    raise SystemExit("Missing dependency: pip install requests python-dotenv --break-system-packages")

try:
    from dotenv import load_dotenv
except ImportError:
    raise SystemExit("Missing dependency: pip install requests python-dotenv --break-system-packages")

# ── Load .env.local ──────────────────────────────────────────────────────────
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

# ── CLI args ─────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--env", choices=["sandbox", "production"], default="sandbox")
args = parser.parse_args()

ENV = args.env

if ENV == "sandbox":
    ACCESS_TOKEN = os.getenv("SQUARE_SANDBOX_ACCESS_TOKEN", "")
    LOCATION_ID  = os.getenv("SQUARE_SANDBOX_LOCATION_ID", "")
    BASE_URL     = "https://connect.squareupsandbox.com"
else:
    ACCESS_TOKEN = os.getenv("SQUARE_PRODUCTION_ACCESS_TOKEN", "")
    LOCATION_ID  = os.getenv("SQUARE_PRODUCTION_LOCATION_ID", "")
    BASE_URL     = "https://connect.squareup.com"

ENDPOINT   = f"{BASE_URL}/v2/online-checkout/payment-links"
SQUARE_VER = "2026-01-22"

if not ACCESS_TOKEN:
    raise SystemExit(f"ERROR: SQUARE_{ENV.upper()}_ACCESS_TOKEN is not set in .env.local")
if not LOCATION_ID:
    raise SystemExit(f"ERROR: SQUARE_{ENV.upper()}_LOCATION_ID is not set in .env.local")

HEADERS = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json",
    "Square-Version": SQUARE_VER,
}

# ── Plan definitions: (display_name, setup_cents, monthly_dollars_for_description) ──
PLANS = [
    ("Growth",                5900,  199),
    ("Revenue Engine",        9900,  299),
    ("AI-First",             19900,  499),
    ("AI Automation Starter", 9900,   99),
    ("Consulting",            9900,  199),
]

REDIRECT_SETUP = "https://www.aiandwebservices.com/thank-you-setup"

SETUP_DESC = (
    "One-time setup fee for the {plan} plan. Covers onboarding consultation, "
    "initial configuration, and account setup.\n\n"
    "After payment, you'll receive an email within minutes with a link to enroll "
    "in the ${monthly}/month {plan} subscription.\n\n"
    "Questions? Contact david@aiandwebservices.com"
)


def cents_to_dollars(cents: int) -> str:
    return str(cents // 100)


def build_setup_payload(plan_name: str, setup_cents: int, monthly_dollars: int) -> dict:
    return {
        "idempotency_key": str(uuid.uuid4()),
        "quick_pay": {
            "name": f"{plan_name} Plan – One-Time Setup Fee (${cents_to_dollars(setup_cents)})",
            "price_money": {"amount": setup_cents, "currency": "USD"},
            "location_id": LOCATION_ID,
        },
        "description": SETUP_DESC.format(
            plan=plan_name,
            monthly=monthly_dollars,
        ),
        "checkout_options": {
            "redirect_url": REDIRECT_SETUP,
        },
    }


def create_link(payload: dict) -> tuple:
    """Returns (url, error_message)."""
    try:
        resp = requests.post(ENDPOINT, headers=HEADERS, json=payload, timeout=15)
        data = resp.json()
        if resp.ok and "payment_link" in data:
            return data["payment_link"].get("url"), None
        errors = data.get("errors", [])
        msg = "; ".join(e.get("detail", str(e)) for e in errors) or resp.text
        return None, f"HTTP {resp.status_code}: {msg}"
    except Exception as exc:
        return None, str(exc)


# ── Run ───────────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"  Square Payment Link Creator  |  ENV: {ENV.upper()}")
print(f"  Creating: SETUP FEES ONLY (5 one-time links)")
print(f"  API: {ENDPOINT}")
print(f"{'='*60}\n")

results = []  # (tier, amount, url, status)

for plan_name, setup_cents, monthly_dollars in PLANS:
    print(f"Creating SETUP link: {plan_name} (${cents_to_dollars(setup_cents)})...")
    payload = build_setup_payload(plan_name, setup_cents, monthly_dollars)
    url, err = create_link(payload)
    if url:
        status = "OK"
        print(f"  ✓ {url}")
    else:
        status = f"FAIL: {err}"
        print(f"  ✗ {err}")
    results.append((plan_name, f"${cents_to_dollars(setup_cents)}", url or "—", status))
    time.sleep(0.5)

# ── Summary table ─────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print("  SUMMARY — SETUP FEES ONLY")
print(f"{'='*60}")
header = f"{'Tier':<26} {'Amount':<10} {'Status':<8} URL"
print(header)
print("-" * 90)
for tier, amount, url, status in results:
    ok = "✓" if status == "OK" else "✗"
    print(f"{tier:<26} {amount:<10} {ok:<8} {url}")

# ── Write output file ─────────────────────────────────────────────────────────
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_file = Path(__file__).parent / f"square_links_output_{ENV}_{timestamp}.txt"
with open(output_file, "w") as f:
    f.write(f"Square Setup Fee Payment Links — {ENV.upper()} — {timestamp}\n")
    f.write("=" * 80 + "\n\n")
    for tier, amount, url, status in results:
        f.write(f"{tier} | {amount} | One-time Setup\n")
        f.write(f"  Status : {status}\n")
        f.write(f"  URL    : {url}\n\n")

print(f"\n  Output saved to: {output_file}\n")

failed = [r for r in results if r[3] != "OK"]
if failed:
    print(f"  ⚠️  {len(failed)} link(s) failed. Check errors above.")
else:
    print(f"  ✅  All {len(results)} setup fee links created successfully.")

# ── Manual steps reminder ─────────────────────────────────────────────────────
print(f"""
{'='*60}
  ✓ Created 5 one-time setup fee links via API.

  NEXT STEPS (manual, via Square UI):
  You need to create 5 MONTHLY subscription links by duplicating
  your existing Presence Monthly link in the Square Dashboard.

  Pattern: Square Dashboard → Payment Links → find Presence Monthly
  → click ⋮ → Duplicate → edit amount/title/description for each:

    - Growth Monthly:                $199/mo
    - Revenue Engine Monthly:        $299/mo
    - AI-First Monthly:              $499/mo
    - AI Automation Starter Monthly:  $99/mo
    - Consulting Monthly:            $199/mo

  Use redirect URL:
  https://www.aiandwebservices.com/thank-you-subscription
{'='*60}
""")
