#!/usr/bin/env python3
"""
fetch_square_payment_link_details.py
Fetches all Square payment links and prints a mapping table.

NOTE: Square's Payment Links API only returns API-created links.
Links created via the Square UI (dashboard) are NOT returned by the API.
For those, this script resolves the long URL by following the short URL redirect.

Usage:
    python3 scripts/fetch_square_payment_link_details.py --env production
    python3 scripts/fetch_square_payment_link_details.py --env sandbox
"""

import argparse
import json
import os
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

# ── Known short URLs for UI-created links (not returned by API) ───────────────
UI_CREATED_SHORT_URLS = [
    ("Presence Setup (UI)",              "https://square.link/u/vIhHdVt7"),
    ("Presence Monthly (UI)",            "https://square.link/u/w7cNLsU1"),
    ("Growth Monthly (UI)",              "https://square.link/u/HA9aJUJ3"),
    ("Revenue Engine Monthly (UI)",      "https://square.link/u/LtnBQwkx"),
    ("AI-First Monthly (UI)",            "https://square.link/u/rLr5EylX"),
    ("AI Automation Starter Monthly (UI)","https://square.link/u/yXsIx0aS"),
    ("Consulting Monthly (UI)",          "https://square.link/u/PL0z3B2T"),
]

# ── Fetch API-created payment links (paginated) ───────────────────────────────
print(f"\n{'='*60}")
print(f"  Square Payment Link Fetcher  |  ENV: {ENV.upper()}")
print(f"  API: {ENDPOINT}")
print(f"{'='*60}\n")

all_links = []
cursor = None

while True:
    params = {"limit": 100}
    if cursor:
        params["cursor"] = cursor

    resp = requests.get(ENDPOINT, headers=HEADERS, params=params, timeout=15)
    if not resp.ok:
        raise SystemExit(f"API error {resp.status_code}: {resp.text}")

    data = resp.json()
    links = data.get("payment_links", [])
    all_links.extend(links)
    print(f"  Page fetched: {len(links)} link(s) | cursor: {data.get('cursor', 'none')}")

    cursor = data.get("cursor")
    if not cursor:
        break

print(f"\n  API-created links found: {len(all_links)}")
print(f"  UI-created links (resolved via redirect): {len(UI_CREATED_SHORT_URLS)}")
print(f"  Total: {len(all_links) + len(UI_CREATED_SHORT_URLS)}\n")

# ── Print API-created links ───────────────────────────────────────────────────
results = []

print("─── API-CREATED LINKS ────────────────────────────────────────────────────────────")
print(f"{'ID':<26} {'Short URL':<34} {'Amount':>8}  Long URL")
print("-" * 110)

for link in all_links:
    link_id   = link.get("id", "")
    short_url = link.get("url", "")
    long_url  = link.get("long_url", short_url)
    qp = link.get("quick_pay", {})
    amount_cents = qp.get("price_money", {}).get("amount", 0) if qp else 0
    amount_str = f"${amount_cents // 100}" if amount_cents else "—"
    desc = (link.get("description") or "")[:50]
    print(f"{link_id:<26} {short_url:<34} {amount_str:>8}  {long_url}")
    results.append({
        "source": "api",
        "id": link_id,
        "short_url": short_url,
        "long_url": long_url,
        "amount": amount_str,
        "description": desc,
        "raw": link,
    })

# ── Resolve UI-created links via redirect ─────────────────────────────────────
print("\n─── UI-CREATED LINKS (resolved via redirect) ─────────────────────────────────────")
print(f"{'Label':<36} {'Short URL':<34}  Long URL")
print("-" * 110)

for label, short_url in UI_CREATED_SHORT_URLS:
    try:
        r = requests.get(short_url, allow_redirects=True, timeout=10)
        long_url = r.url
    except Exception as e:
        long_url = f"ERROR: {e}"
    print(f"{label:<36} {short_url:<34}  {long_url}")
    results.append({
        "source": "ui",
        "id": "",
        "short_url": short_url,
        "long_url": long_url,
        "amount": "—",
        "description": label,
        "raw": {},
    })

# ── Write JSON output ─────────────────────────────────────────────────────────
timestamp   = datetime.now().strftime("%Y%m%d_%H%M%S")
output_file = Path(__file__).parent / f"square_links_details_{ENV}_{timestamp}.json"

with open(output_file, "w") as f:
    json.dump({"env": ENV, "fetched_at": timestamp, "count": len(results), "links": results}, f, indent=2)

print(f"\n  Full JSON written to: {output_file}")
print(f"  Total links documented: {len(results)}\n")
