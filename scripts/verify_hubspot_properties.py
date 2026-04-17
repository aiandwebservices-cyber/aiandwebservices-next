#!/usr/bin/env python3
"""
verify_hubspot_properties.py
Checks that the 3 required custom contact properties exist in HubSpot.
Exits 0 if all pass, 1 if any are missing.
"""

import os
import sys
from pathlib import Path

try:
    import requests
    from dotenv import load_dotenv
except ImportError:
    raise SystemExit("Missing dependency: pip install requests python-dotenv --break-system-packages")

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env.local")

TOKEN = os.getenv("HUBSPOT_TOKEN", "")
if not TOKEN:
    raise SystemExit("ERROR: HUBSPOT_TOKEN not set in .env.local")

REQUIRED = ["tier_slug", "setup_paid_date", "monthly_link_sent"]

resp = requests.get(
    "https://api.hubapi.com/crm/v3/properties/contacts",
    headers={"Authorization": f"Bearer {TOKEN}"},
    timeout=15,
)

if not resp.ok:
    raise SystemExit(f"HubSpot API error: {resp.status_code} {resp.text}")

existing = {p["name"] for p in resp.json().get("results", [])}

print("\nHubSpot Custom Property Check")
print("=" * 40)
all_pass = True
for prop in REQUIRED:
    if prop in existing:
        print(f"  PASS  {prop}")
    else:
        print(f"  FAIL  {prop}  ← MISSING — create in HubSpot Settings → Properties")
        all_pass = False

print("=" * 40)
if all_pass:
    print("All 3 properties exist. Ready to proceed.\n")
    sys.exit(0)
else:
    print("One or more properties are missing. Create them before importing the n8n workflow.\n")
    sys.exit(1)
