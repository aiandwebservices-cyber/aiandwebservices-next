#!/usr/bin/env python3
"""
End-to-end test: sends a fake payment.created webhook to the production endpoint.
Expected outcome: 200 OK from Next.js, then an UNMATCHED PAYMENT alert email
arrives at aiandwebservices@gmail.com within ~30s.
"""

import hashlib
import hmac
import base64
import json
import urllib.request
import urllib.error
import os
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
SIGNATURE_KEY = os.environ['SQUARE_WEBHOOK_SIGNATURE_KEY']
NOTIFICATION_URL = "https://www.aiandwebservices.com/api/square-webhook"
ENDPOINT = "https://www.aiandwebservices.com/api/square-webhook"

payload = {
    "merchant_id": "MLEF0FAKE00TEST",
    "type": "payment.created",
    "event_id": "e2e-test-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ"),
    "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "data": {
        "type": "payment",
        "id": "fake_payment_e2e_001",
        "object": {
            "payment": {
                "id": "fake_payment_e2e_001",
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                "amount_money": {
                    "amount": 9900,
                    "currency": "USD"
                },
                "status": "COMPLETED",
                "source_type": "CARD",
                "order_id": "fake_order_e2e_001",
                "buyer_email_address": "testbuyer@example.com",
                "shipping_address": {
                    "first_name": "Test",
                    "last_name": "Buyer"
                },
                "receipt_url": "https://squareup.com/receipt/preview/fake_payment_e2e_001",
                "location_id": "FAKE_LOCATION_001",
                "version": 1
            }
        }
    }
}

raw_body = json.dumps(payload, separators=(',', ':'))

sig_input = NOTIFICATION_URL + raw_body
signature = base64.b64encode(
    hmac.new(
        SIGNATURE_KEY.encode('utf-8'),
        sig_input.encode('utf-8'),
        hashlib.sha256
    ).digest()
).decode('utf-8')

print("=== Square Webhook E2E Test ===")
print(f"Endpoint:  {ENDPOINT}")
print(f"Signature: {signature}")
print(f"Payload:   {raw_body[:120]}...")
print()

req = urllib.request.Request(
    ENDPOINT,
    data=raw_body.encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': signature,
        'square-environment': 'Production',
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        status = resp.status
        body = resp.read().decode('utf-8')
except urllib.error.HTTPError as e:
    status = e.code
    body = e.read().decode('utf-8')

print(f"Status:    {status}")
print(f"Body:      {body}")
print()
if status == 200:
    print("✓ Endpoint accepted the payload. Expect UNMATCHED PAYMENT email at aiandwebservices@gmail.com within ~30s.")
else:
    print("✗ Unexpected status — check signature key or endpoint.")
