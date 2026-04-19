# Checklist Deployment Notes

## Required Vercel Env Vars

| Variable | Value |
|---|---|
| `HUBSPOT_TOKEN` | HubSpot private app token (existing — already in Vercel) |
| `N8N_LEAD_STARTED_WEBHOOK` | `https://probable-sadden-speech.ngrok-free.dev/webhook/checklist-lead-started` |
| `N8N_CHECKLIST_WEBHOOK` | `https://probable-sadden-speech.ngrok-free.dev/webhook/checklist-submit` |

Add via Vercel dashboard → Project Settings → Environment Variables. Set for Production + Preview + Development.

## Deployment Checklist

1. Confirm ngrok tunnel is running and pointing to local n8n on port 5678
2. Add `N8N_LEAD_STARTED_WEBHOOK` and `N8N_CHECKLIST_WEBHOOK` in Vercel project settings
3. Deploy (trigger via git push or Vercel dashboard)
4. Test end-to-end with a real email address
5. Verify HubSpot contact appears (created/updated via batch/upsert)
6. Verify HubSpot Note appears on that contact with Q&A breakdown
7. Verify EspoCRM lead appears (via Workflow 1 — Create EspoCRM Lead)
8. Submit assessment answers, verify:
   - EspoCRM lead updates (via Workflow 2 — Update EspoCRM Lead)
   - David receives notification email
   - Customer receives results email

## n8n Workflow Notes

### Workflow 1 — Checklist Lead Started
- Fires on email-step submission (before user sees questions)
- Payload: `{ email, firstName, phone, companyName, source, startedAt }`
- Creates EspoCRM lead immediately so David knows someone started

### Workflow 2 — Checklist Processor v2
- Fires on assessment submission
- Payload: `{ email, firstName, companyName, source, answers: { q1: true, q3: true, ... } }`
- Workflow computes `score`, `tier`, `tierMessage` server-side
- Triggers customer results email + David notification

## Post-Ship: Confirm User Email Template (n8n UI edit required)

In the Workflow 2 "Send Customer Email" node, update:

**Subject:** `{firstName}, your AI Readiness results + a time to talk`

**Body order:**
1. Branded header (logo + teal bar)
2. Warm intro — "Hi {firstName}, here's what your score means..."
3. **Cal.com booking button — prominent, above the fold** (`https://cal.com/aiandwebservices/30min`)
4. Score display: `{score}/20 — {tier}`
5. Tier message: `{tierMessage}`
6. "What Happens Next" section (3 bullets)
7. Footer with contact info + unsubscribe

## Architecture Reference

```
/checklist (page)
  → ChecklistForm.jsx (step: email)
      → POST /api/checklist-lead-started  → n8n Workflow 1
  → ChecklistForm.jsx (step: questions)
      → POST /api/checklist-submit        → HubSpot Notes API
                                          → n8n Workflow 2
  → ChecklistForm.jsx (step: submitted)
```
