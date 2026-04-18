#!/usr/bin/env python3
"""
E2E test: payment.created + COMPLETED for Consulting ($99) via TIER_BY_LINK_ID path.
Expected: Notify David email + Enrollment email to aiandwebservices@gmail.com,
          HubSpot contact upserted with tier_slug=consulting.
"""

import hashlib, hmac, base64, json, urllib.request, urllib.error, os
from datetime import datetime, timezone
from pathlib import Path

def _load_env():
    env_path = Path(__file__).parent.parent / '.env.local'
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_env()
SIGNATURE_KEY    = os.environ['SQUARE_WEBHOOK_SIGNATURE_KEY']
NOTIFICATION_URL = "https://www.aiandwebservices.com/api/square-webhook"
ENDPOINT         = "https://www.aiandwebservices.com/api/square-webhook"

now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
event_id = "e2e-notify-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
payment_id = "e2e_pay_notify_001_" + datetime.now(timezone.utc).strftime("%H%M%S")
order_id   = "e2e_ord_KHQJJWZ4JZMDT7JW_" + datetime.now(timezone.utc).strftime("%H%M%S")

payload = {
    "merchant_id": "MLTDBEPZS805X",
    "type": "payment.created",
    "event_id": event_id,
    "created_at": now,
    "data": {
        "type": "payment",
        "id": payment_id,
        "object": {
            "payment": {
                "id": payment_id,
                "created_at": now,
                "updated_at": now,
                "amount_money": {"amount": 9900, "currency": "USD"},
                "status": "COMPLETED",
                "source_type": "CARD",
                "order_id": order_id,
                "buyer_email_address": "aiandwebservices@gmail.com",
                "billing_address": {"first_name": "E2E", "last_name": "Test"},
                "shipping_address": {"first_name": "E2E", "last_name": "Test"},
                "location_id": "LQGZZDTD2YXES",
                "receipt_url": f"https://squareup.com/receipt/preview/{payment_id}",
                "version": 1
            }
        }
    }
}

raw_body = json.dumps(payload, separators=(',', ':'))

sig = base64.b64encode(
    hmac.new(
        SIGNATURE_KEY.encode('utf-8'),
        (NOTIFICATION_URL + raw_body).encode('utf-8'),
        hashlib.sha256
    ).digest()
).decode('utf-8')

print("=== E2E Test: Notify David + Enrollment Email ===")
print(f"Endpoint:   {ENDPOINT}")
print(f"Event ID:   {event_id}")
print(f"Payment ID: {payment_id}")
print(f"Order ID:   {order_id}")
print(f"Signature:  {sig}")
print(f"Payload:    {raw_body[:140]}...")
print()

req = urllib.request.Request(
    ENDPOINT,
    data=raw_body.encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': sig,
        'square-environment': 'Production',
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        status = resp.status
        body   = resp.read().decode('utf-8')
except urllib.error.HTTPError as e:
    status = e.code
    body   = e.read().decode('utf-8')

print(f"Status: {status}")
print(f"Body:   {body}")
print()

if status == 200:
    print("✓ Endpoint accepted payload — pipeline triggered.")
    print()
    print("Expect within ~30s:")
    print("  (a) aiandwebservices@gmail.com — subject: [AIWS] Consulting payment...")
    print("  (b) aiandwebservices@gmail.com — Consulting enrollment email with monthly link")
    print("  (c) HubSpot contact aiandwebservices@gmail.com: tier_slug=consulting")
    print()
    print("HubSpot cleanup (run after verifying):")
    print("  python3 -c \"")
    print("  import urllib.request, json")
    print("  token = open('.env.local').read()")
    print("  # search contact then DELETE /crm/v3/objects/contacts/{id}")
    print("  \"")
    print()
    print(f"  Or via API: search by email=aiandwebservices@gmail.com, then:")
    print(f"  DELETE https://api.hubapi.com/crm/v3/objects/contacts/<id>")
else:
    print("✗ Unexpected status — signature or endpoint issue.")
