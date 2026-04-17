# Square Webhook Automation — System Documentation

## Overview

When a customer pays a setup fee on the website, Square fires a webhook. This system:

1. **Validates** the webhook signature (Next.js API route)
2. **Normalizes** the payment data (n8n)
3. **Matches** the payment amount to the correct tier (n8n)
4. **Emails** the customer their monthly subscription link (Resend)
5. **Updates** HubSpot with the customer's tier and status (HubSpot)
6. **Alerts David** if a payment can't be matched (Resend → david@)

---

## Architecture

```
Customer pays setup fee on Square checkout
        │
        ▼
Square fires webhook
        │
        ▼
POST https://www.aiandwebservices.com/api/square-webhook
        │
  [Next.js API Route — app/api/square-webhook/route.js]
  ├── Validates HMAC-SHA256 signature
  ├── Returns 401 if invalid (stops here)
  └── Returns 200, forwards raw payload to n8n
        │
        ▼
POST https://<ngrok>/webhook/.../square-webhook
        │
  [n8n Workflow — square-webhook-processor]
  │
  ├── Node 1: Webhook (receives forwarded event)
  ├── Node 2: Normalize (extract payment fields)
  ├── Node 3: IF event_type == "payment.created"
  │           └── FALSE → stop (log only)
  ├── Node 4: Match Tier (JS logic, maps amount → tier)
  ├── Node 5: IF tier_matched AND NOT is_monthly
  │     │
  │     ├── TRUE path:
  │     │   ├── Node 5a: Build Email HTML (code node)
  │     │   ├── Node 6:  Send Enrollment Email (Resend)
  │     │   └── Node 7:  Update HubSpot Contact
  │     │
  │     └── FALSE path:
  │         └── Node 8: Alert David (Resend → david@)
```

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Vercel + `.env.local` | Validates Square's HMAC signature |
| `SQUARE_WEBHOOK_N8N_FORWARD_URL` | Vercel + `.env.local` | ngrok URL that points to n8n webhook |
| `HUBSPOT_TOKEN` | Vercel + `.env.local` | HubSpot API access |
| `RESEND_API_KEY` | n8n credential store | Resend email sending (stored in n8n, not .env) |

---

## Files Involved

| File | Purpose |
|---|---|
| `app/api/square-webhook/route.js` | Next.js webhook endpoint — validates HMAC, forwards to n8n |
| `n8n-workflows/square-webhook-processor.json` | n8n workflow — import via n8n UI |
| `templates/subscription-enrollment-email.html` | Source email template (for reference/editing) |
| `scripts/verify_hubspot_properties.py` | Verifies HubSpot custom properties exist |
| `lib/pricing.ts` | Source of truth for tier pricing + Square payment links |

---

## HubSpot Custom Properties Required

All three must exist under **Contacts** before the workflow runs:

| Property Name | Type | Purpose |
|---|---|---|
| `tier_slug` | Single-line text | e.g. `growth`, `revenue-engine` |
| `setup_paid_date` | Date | Date setup fee was received (YYYY-MM-DD) |
| `monthly_link_sent` | Single-line text | Monthly Square checkout URL sent to customer |

**Verify:** `python3 scripts/verify_hubspot_properties.py`

**Create missing properties:** HubSpot → Settings → Properties → Contacts → Create property

---

## Manual Setup Steps (New Environment)

1. **Square Dashboard** → your app → Webhooks → Subscriptions
   - Confirm webhook URL: `https://www.aiandwebservices.com/api/square-webhook`
   - Confirm events: `payment.created`, `invoice.payment_made`
   - Copy **Signature Key**

2. **Add to Vercel:**
   ```bash
   vercel env add SQUARE_WEBHOOK_SIGNATURE_KEY production
   vercel env add SQUARE_WEBHOOK_N8N_FORWARD_URL production
   ```

3. **Start ngrok:**
   ```bash
   ngrok http 5678
   ```
   Copy the HTTPS URL and paste it as `SQUARE_WEBHOOK_N8N_FORWARD_URL` in Vercel and `.env.local`.
   Format: `https://<random>.ngrok-free.dev/webhook/<uuid>/square-webhook`
   The UUID comes from n8n after importing and activating the workflow.

4. **Import n8n workflow:**
   - n8n UI → Workflows → Import from File
   - Select `n8n-workflows/square-webhook-processor.json`
   - Verify credentials: map "HubSpot API" and "Resend API" to existing credentials
   - Activate the workflow
   - Copy the webhook URL shown at the top of Node 1

5. **Update `SQUARE_WEBHOOK_N8N_FORWARD_URL`** with the exact n8n webhook URL from step 4.

6. **Redeploy Vercel:**
   ```bash
   vercel --prod
   ```

---

## How to Test End-to-End

### Step 1 — Verify endpoint rejects invalid signatures
```bash
curl -si -X POST https://www.aiandwebservices.com/api/square-webhook \
  -H "Content-Type: application/json" \
  -d '{"test":true}' | head -3
# Expected: HTTP/2 401
```

### Step 2 — Send Square test event
- Square Developer Dashboard → Webhooks → your subscription → **Send Test Event**
- Choose event type: `payment.created`
- Check Vercel Logs for: `[square-webhook] Received validated event:`

### Step 3 — Check n8n execution
- n8n UI → Executions → look for the workflow run
- Verify all nodes ran successfully
- Check for errors in the Resend or HubSpot nodes

### Step 4 — Verify email sent
- Check david@aiandwebservices.com (or Resend dashboard) for the test email
- Verify all template variables are substituted correctly

### Step 5 — Verify HubSpot
- HubSpot → Contacts → find the test customer
- Confirm `tier_slug`, `setup_paid_date`, `monthly_link_sent` are populated

---

## How to Handle an Unmatched Payment

If David receives an alert email with subject `[AIandWEBservices] UNMATCHED PAYMENT`:

1. Note the **Payment ID** and **Order ID** from the alert email
2. Square Dashboard → Transactions → search by Payment ID
3. Identify the plan purchased (by amount or customer context)
4. Manually email customer with the correct monthly link from `lib/pricing.ts`
5. Update HubSpot contact manually:
   - Set `tier_slug`, `setup_paid_date`, `monthly_link_sent`
   - Set `lifecyclestage` to `customer`
6. Investigate why the tier match failed — update the `Match Tier` node if needed

---

## How to Add a New Tier

When a new pricing tier is created:

- [ ] Add tier to `lib/pricing.ts` with `setupFee`, `monthlyFee`, `setupLinkId`, `monthlyLinkLong`
- [ ] Create Square payment links (setup + monthly) via Square Dashboard or API script
- [ ] Update `TIER_BY_AMOUNT` or `TIER_BY_LINK_ID` in the **Match Tier** node in n8n
- [ ] Update `TIER_META` in `components/panels/Pricing.jsx`
- [ ] Update the contact form dropdown in `components/panels/Contact.jsx`
- [ ] Update `components/panels/Services.jsx` MAIN_PLANS array
- [ ] Update `lib/services-data.ts` with marketing copy
- [ ] Create service page at `app/services/<slug>/page.jsx`
- [ ] Run `npx tsc --noEmit` to confirm no TS errors

---

## Known Limitations

1. **ngrok dependency** — `SQUARE_WEBHOOK_N8N_FORWARD_URL` points to a local ngrok tunnel. If ngrok restarts, the URL changes and must be updated in Vercel env vars + redeployed. A permanent solution is to host n8n on a VPS or use n8n Cloud.

2. **$99 tier ambiguity** — Three tiers have a $99 setup fee (Revenue Engine, AI Automation Starter, Consulting). The workflow disambiguates via `order_id`, but this relies on Square embedding the `setupLinkId` in the order metadata. If Square's order structure changes, this may break — monitor the "Alert David" emails for unexpected unmatched payments.

3. **Customer name** — Square does not guarantee `shipping_address.first_name` is present on all payment types. The workflow falls back to the email address as the display name. Collect name on the checkout form if possible.

4. **Monthly payments** — `invoice.payment_made` events (recurring subscriptions) are received but not processed beyond logging. Future work: update HubSpot subscription status on each monthly payment.

5. **No retry logic** — If the Resend or HubSpot node fails, n8n will show an error in the Executions log but will not retry. Monitor executions regularly and re-run manually if needed.
