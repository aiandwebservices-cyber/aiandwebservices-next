#!/usr/bin/env python3
"""
update_square_payment_links.py
Updates description on the Revenue Engine setup fee payment link.

Links to update:
  - Revenue Engine Setup (ID: R5TCDCXYIUABP3TA) — description references $249/month

DO NOT RUN until you have reviewed the fetch output and confirmed the IDs are correct.

Usage:
    python3 scripts/update_square_payment_links.py --env production
    python3 scripts/update_square_payment_links.py --env sandbox
"""

import argparse
import os
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
parser.add_argument("--env", choices=["sandbox", "production"], default="production")
args = parser.parse_args()

ENV = args.env

if ENV == "sandbox":
    ACCESS_TOKEN = os.getenv("SQUARE_SANDBOX_ACCESS_TOKEN", "")
    BASE_URL     = "https://connect.squareupsandbox.com"
else:
    ACCESS_TOKEN = os.getenv("SQUARE_PRODUCTION_ACCESS_TOKEN", "")
    BASE_URL     = "https://connect.squareup.com"

ENDPOINT   = f"{BASE_URL}/v2/online-checkout/payment-links"
SQUARE_VER = "2026-01-22"

if not ACCESS_TOKEN:
    raise SystemExit(f"ERROR: SQUARE_{ENV.upper()}_ACCESS_TOKEN is not set in .env.local")

HEADERS = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json",
    "Square-Version": SQUARE_VER,
}

# ── Links to update ───────────────────────────────────────────────────────────
UPDATES = [
    {
        "id": "R5TCDCXYIUABP3TA",
        "label": "Revenue Engine Setup",
        "new_description": (
            "One-time setup fee for the Revenue Engine plan. Covers onboarding consultation, "
            "initial configuration, and account setup.\n\n"
            "After payment, you'll receive an email within minutes with a link to enroll "
            "in the $249/month Revenue Engine subscription.\n\n"
            "Questions? Contact david@aiandwebservices.com"
        ),
    },
]


def get_link(link_id: str) -> dict | None:
    """Fetch a single payment link to get its current version."""
    resp = requests.get(f"{ENDPOINT}/{link_id}", headers=HEADERS, timeout=15)
    if resp.ok:
        return resp.json().get("payment_link")
    print(f"  ERROR fetching {link_id}: {resp.status_code} {resp.text}")
    return None


def update_link(link_id: str, version: int, new_description: str) -> dict | None:
    """PUT updated description. Square requires version to prevent stale updates."""
    payload = {
        "payment_link": {
            "version": version,
            "description": new_description,
        }
    }
    resp = requests.put(f"{ENDPOINT}/{link_id}", headers=HEADERS, json=payload, timeout=15)
    if resp.ok:
        return resp.json().get("payment_link")
    print(f"  ERROR updating {link_id}: {resp.status_code} {resp.text}")
    return None


# ── Run ───────────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"  Square Payment Link Updater  |  ENV: {ENV.upper()}")
print(f"  Updating 1 setup fee description")
print(f"{'='*60}\n")

for item in UPDATES:
    link_id = item["id"]
    label   = item["label"]
    new_desc = item["new_description"]

    print(f"Processing: {label} (ID: {link_id})")

    # Step 1: fetch current version
    current = get_link(link_id)
    if not current:
        print(f"  ✗ Could not fetch link — skipping\n")
        continue

    version = current.get("version", 1)
    old_desc = current.get("description", "")
    print(f"  Current version : {version}")
    print(f"  Current desc    : {old_desc[:80]}...")

    # Step 2: update
    updated = update_link(link_id, version, new_desc)
    if updated:
        print(f"  ✓ Updated successfully")
        print(f"  New version     : {updated.get('version')}")
        print(f"  New desc        : {updated.get('description', '')[:80]}...")
    else:
        print(f"  ✗ Update failed")
    print()

print("Done.\n")
