# Primo Auto Group — n8n Notification & Follow-Up Workflow

This workflow runs on the existing self-hosted n8n at `~/docker/n8n/` on the
`shared-apps` Docker network. It receives lead/appointment/reservation events
from the Next.js dealer API and fans them out to:

- Twilio SMS (alerts to dealer + customer follow-ups)
- Resend email (alerts to dealer + customer follow-up sequences)
- EspoCRM check-ins (to skip follow-ups once a human has engaged the lead)

Workflow name in n8n: **Primo — Lead Notification + Follow-Up**

---

## 1. Prerequisites

### Network reachability — n8n → Primo EspoCRM

The Primo EspoCRM container lives on the `primo-net` Docker network. n8n lives
on `shared-apps`. Pick **one**:

**Option A — connect EspoCRM to shared-apps (recommended):**

```bash
docker network connect shared-apps primo-espocrm
# Then n8n can reach it via http://primo-espocrm:80 internally
```

**Option B — expose EspoCRM port to host:**

In `~/docker/primo-espocrm/docker-compose.yml`, ensure:

```yaml
ports:
  - "8081:80"
```

Then n8n reaches it via `http://host.docker.internal:8081`.

The Next.js app already uses `http://localhost:8081`. If you take Option A,
update the `EspoCRM URL` env value in n8n only.

### n8n credentials to create (Settings → Credentials)

| Name | Type | Notes |
|---|---|---|
| `Primo Twilio` | Twilio | SID + Auth Token from twilio.com console |
| `Primo Resend` | HTTP Header Auth | Header `Authorization`, value `Bearer <RESEND_API_KEY>` |
| `Primo EspoCRM` | HTTP Header Auth | Header `X-Api-Key`, value `7190e14d23e6ca8d68a5d2b29c91e55e` |

### n8n environment variables (set on the n8n container)

```
PRIMO_TWILIO_FROM=+13055550199
PRIMO_RESEND_FROM=sales@primoautogroup.com
PRIMO_DEALER_ADDRESS=123 Biscayne Blvd, Miami, FL 33132
PRIMO_ESPOCRM_URL=http://primo-espocrm  # or http://host.docker.internal:8081
PRIMO_ADMIN_PANEL_URL=https://primoautogroup.com/admin
```

---

## 2. Trigger — Webhook node

- **HTTP Method:** POST
- **Path:** `primo-lead`  → full URL `http://localhost:5678/webhook/primo-lead`
- **Response Mode:** `When last node finishes` → set to `Immediately` so
  the Next.js call returns instantly. (Next.js fires-and-forgets anyway,
  but this avoids holding sockets open.)
- **Response Code:** 200, body `{ "ok": true }`

Incoming payload shape:

```json
{
  "type": "new_lead | new_appointment | new_reservation | new_deal | price_match",
  "dealerId": "primo",
  "dealerName": "Primo Auto Group",
  "dealerPhone": "(305) 555-0199",
  "dealerEmail": "sales@primoautogroup.com",
  "notifyPhone": "+13055550199",
  "notifyEmail": "sales@primoautogroup.com",
  "customerName": "Maria Rodriguez",
  "customerPhone": "(305) 555-0142",
  "customerEmail": "maria.r@email.com",
  "source": "GetEPrice",
  "vehicleOfInterest": "2023 BMW X5 - $42,995",
  "message": "any additional context",
  "leadId": "espocrm-lead-id",
  "timestamp": "2026-05-01 22:30:00"
}
```

---

## 3. Node 1 — Switch (by `type`)

Type: **Switch** (mode: Expression).

Routing expression: `{{ $json.type }}`

Outputs:

- `new_lead` → Branch A
- `new_deal` → Branch A (same flow; subject line tweaks downstream)
- `price_match` → Branch A
- `new_appointment` → Branch B
- `new_reservation` → Branch C

---

## Branch A — New Lead (and new_deal / price_match)

### Node 2a — Twilio SMS to dealer

- Credential: `Primo Twilio`
- From: `={{ $env.PRIMO_TWILIO_FROM }}`
- To: `={{ $json.notifyPhone }}`
- Message:
  ```
  🚗 New lead! {{ $json.customerName }} is interested in {{ $json.vehicleOfInterest }}.
  Source: {{ $json.source }}.
  Call them: {{ $json.customerPhone }}
  ```

### Node 3a — Resend email to dealer

Use HTTP Request node, credential `Primo Resend`.

- Method: POST
- URL: `https://api.resend.com/emails`
- Body (JSON):
  ```json
  {
    "from": "{{ $env.PRIMO_RESEND_FROM }}",
    "to": ["{{ $json.notifyEmail }}"],
    "subject": "New Lead: {{ $json.customerName }} — {{ $json.source }}",
    "html": "<h2>New {{ $json.source }} Lead</h2><p><strong>{{ $json.customerName }}</strong> ({{ $json.customerEmail }} / {{ $json.customerPhone }}) is interested in <strong>{{ $json.vehicleOfInterest }}</strong>.</p><p>Message: {{ $json.message }}</p><p><a href=\"{{ $env.PRIMO_ADMIN_PANEL_URL }}/leads/{{ $json.leadId }}\">Open lead in admin panel →</a></p>"
  }
  ```

### Node 4a — Wait 4 hours

Type: **Wait**, Amount: 4, Unit: hours.

### Node 5a — Check EspoCRM (still status="New"?)

HTTP Request, credential `Primo EspoCRM`.

- Method: GET
- URL: `={{ $env.PRIMO_ESPOCRM_URL }}/api/v1/Lead/{{ $json.leadId }}`

Then **IF** node:

- Condition: `{{ $json.status === 'New' }}` → continue to Node 6a
- Else: stop

### Node 6a — Resend email to customer (Day 0 + 4h)

- From: `{{ $env.PRIMO_RESEND_FROM }}`
- To: `{{ $('Webhook').item.json.customerEmail }}`
- Subject: `Thanks for your interest in the {{ $('Webhook').item.json.vehicleOfInterest }}`
- HTML:
  ```
  Hi {{ $('Webhook').item.json.customerName }},
  thanks for reaching out about the {{ $('Webhook').item.json.vehicleOfInterest }}.
  A team member will be in touch shortly. In the meantime,
  you can reach us anytime at {{ $('Webhook').item.json.dealerPhone }}.
  — The Primo Auto Group Team
  ```

### Node 7a — Wait 20 hours (cumulative ~24h)

### Node 8a — Re-check EspoCRM (status still "New"?)

Same GET as Node 5a + IF node. Continue only if `status === 'New'`.

### Node 9a — Twilio SMS to customer

- To: `{{ $('Webhook').item.json.customerPhone }}`
- Body:
  ```
  Hi {{ $('Webhook').item.json.customerName }}, just following up on the
  {{ $('Webhook').item.json.vehicleOfInterest }} you were looking at.
  Still interested? Text or call us at {{ $('Webhook').item.json.dealerPhone }}.
  — Primo Auto Group
  ```

### Node 10a — Wait 48 hours (cumulative Day 3)

### Node 11a — Re-check EspoCRM (status still "New" or "Contacted"?)

IF condition: `{{ ['New','Contacted'].includes($json.status) }}`

### Node 12a — Resend email to customer

Subject: `{{ $('Webhook').item.json.vehicleOfInterest }} is still available`

For "2 similar vehicles", insert an additional HTTP Request node *before*
this email:

- Method: GET
- URL: `={{ $env.PRIMO_ESPOCRM_URL }}/api/v1/CVehicle?where[0][type]=equals&where[0][attribute]=status&where[0][value]=Available&maxSize=2&orderBy=dateAdded&order=desc`

Then template the HTML body to include `{{ $json.list[0].year }} {{ $json.list[0].make }}`
etc., and a CTA `<a href="{{ $env.PRIMO_ADMIN_PANEL_URL.replace('/admin','') }}/inventory">Schedule a test drive →</a>`.

### Node 13a — Wait 96 hours (cumulative Day 7)

### Node 14a — Final follow-up email

Subject: `Last chance — {{ $('Webhook').item.json.vehicleOfInterest }}`

Body:
```
We wanted to follow up one last time about the {{ vehicle }}. If you're
still in the market, we'd love to help. If not, no worries at all.
— Primo Auto Group
```

(Optional: gate on `status === 'New'` again before sending.)

---

## Branch B — New Appointment

### Node 2b — Twilio SMS to dealer

To: `{{ $json.notifyPhone }}`
Body:
```
📅 New service appointment! {{ $json.customerName }} —
{{ $json.serviceType }} — {{ $json.requestedDate }} {{ $json.requestedTime }}
```

### Node 3b — Twilio SMS confirmation to customer

To: `{{ $json.customerPhone }}`
Body:
```
Your appointment at Primo Auto Group is confirmed!
{{ $json.serviceType }} on {{ $json.requestedDate }} at {{ $json.requestedTime }}.
See you then! Questions? Call {{ $json.dealerPhone }}
```

### Node 4b — Wait until 24h before appointment

Type: **Wait**, Mode: `At Specified Time`.

DateTime expression:
```
={{ DateTime.fromISO($json.requestedDate + 'T' + $json.requestedTime).minus({ hours: 24 }).toISO() }}
```

### Node 5b — Reminder SMS to customer

To: `{{ $('Webhook').item.json.customerPhone }}`
Body:
```
Reminder: your {{ $('Webhook').item.json.serviceType }} appointment is tomorrow
at {{ $('Webhook').item.json.requestedTime }}.
See you at {{ $env.PRIMO_DEALER_ADDRESS }}!
— Primo Auto Group
```

---

## Branch C — New Reservation

### Node 2c — Twilio SMS to dealer

To: `{{ $json.notifyPhone }}`
Body:
```
⏰ Vehicle reserved! {{ $json.customerName }} reserved the
{{ $json.vehicleOfInterest }}. $500 deposit hold — 48hr window.
Confirm in admin panel.
```

### Node 3c — Resend email to customer

To: `{{ $json.customerEmail }}`
Subject: `Your vehicle is held — {{ $json.vehicleOfInterest }}`
HTML:
```
Your vehicle is held! The {{ $json.vehicleOfInterest }} is reserved for you
for the next 48 hours. A team member will contact you shortly to confirm.
— Primo Auto Group
```

---

## 4. Test commands

Replace the URL with the actual webhook path from your n8n instance.

### new_lead

```bash
curl -X POST http://localhost:5678/webhook/primo-lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new_lead",
    "dealerId": "primo",
    "dealerName": "Primo Auto Group",
    "dealerPhone": "(305) 555-0199",
    "dealerEmail": "sales@primoautogroup.com",
    "notifyPhone": "+13055550199",
    "notifyEmail": "sales@primoautogroup.com",
    "customerName": "Maria Rodriguez",
    "customerPhone": "(305) 555-0142",
    "customerEmail": "maria.r@email.com",
    "source": "GetEPrice",
    "vehicleOfInterest": "2023 BMW X5 - $42,995",
    "message": "Wants to know about financing options",
    "leadId": "TEST_LEAD_ID",
    "timestamp": "2026-05-01 22:30:00"
  }'
```

### new_appointment

```bash
curl -X POST http://localhost:5678/webhook/primo-lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new_appointment",
    "dealerId": "primo",
    "dealerName": "Primo Auto Group",
    "dealerPhone": "(305) 555-0199",
    "notifyPhone": "+13055550199",
    "notifyEmail": "sales@primoautogroup.com",
    "customerName": "James Chen",
    "customerPhone": "(305) 555-0177",
    "customerEmail": "jchen@email.com",
    "serviceType": "Oil Change",
    "requestedDate": "2026-05-08",
    "requestedTime": "10:00",
    "timestamp": "2026-05-01 22:30:00"
  }'
```

### new_reservation

```bash
curl -X POST http://localhost:5678/webhook/primo-lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new_reservation",
    "dealerId": "primo",
    "dealerName": "Primo Auto Group",
    "dealerPhone": "(305) 555-0199",
    "notifyPhone": "+13055550199",
    "notifyEmail": "sales@primoautogroup.com",
    "customerName": "Aisha Patel",
    "customerPhone": "(305) 555-0188",
    "customerEmail": "aisha.p@email.com",
    "vehicleOfInterest": "2024 Toyota Camry XSE - $34,500",
    "leadId": "TEST_RESERVATION_ID",
    "timestamp": "2026-05-01 22:30:00"
  }'
```

### new_deal / price_match

Same body as `new_lead`, just change `type` to `new_deal` or `price_match`.
Both route through Branch A — adjust the email subject in Node 3a if you
want type-specific copy (use a Switch or IF node before the email).

---

## 5. Operational notes

- The Wait nodes survive n8n restarts (n8n persists wait jobs to its DB).
- If you delete a lead in EspoCRM mid-sequence, the next "Check EspoCRM"
  node will return 404 — wrap that HTTP Request with `Continue On Fail`
  and add an IF node `{{ $json.error === undefined }}` to short-circuit
  cleanly instead of erroring out the workflow.
- All follow-up emails should pull customer data from `$('Webhook').item.json`,
  not the EspoCRM check response (the check returns the lead record, not
  the original webhook payload).
- Twilio rate limit on trial accounts is 1 msg/sec. Production fine.
- Resend free tier: 100 emails/day. Upgrade if Primo's lead volume exceeds.
