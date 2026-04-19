export const runtime = 'nodejs';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { firstName, email, phone = '', companyName = '', source = 'site' } = body;

  if (!firstName || !email) {
    return Response.json({ success: false, error: 'firstName and email are required' }, { status: 400 });
  }

  const startedAt = new Date().toISOString();
  const hubspotToken = process.env.HUBSPOT_TOKEN;

  // ── 1. HubSpot: create/update contact ──
  if (hubspotToken) {
    try {
      const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify({
          inputs: [
            {
              idProperty: 'email',
              id: email,
              properties: {
                firstname: firstName,
                email,
                phone,
                company: companyName,
                lifecyclestage: 'lead',
                hs_lead_status: 'NEW',
              },
            },
          ],
        }),
      });
      if (!hsRes.ok) {
        const err = await hsRes.text();
        console.error('[checklist-lead-started] HubSpot upsert failed:', hsRes.status, err);
      }
    } catch (err) {
      console.error('[checklist-lead-started] HubSpot fetch error:', err.message);
    }
  } else {
    console.warn('[checklist-lead-started] HUBSPOT_TOKEN not set — skipping HubSpot upsert');
  }

  // ── 2. n8n Workflow 1: fire-and-forget ──
  const webhookUrl = process.env.N8N_LEAD_STARTED_WEBHOOK;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName, phone, companyName, source, startedAt }),
    })
      .then(r => { if (!r.ok) console.error('[checklist-lead-started] n8n non-OK:', r.status); })
      .catch(err => console.error('[checklist-lead-started] n8n fetch error:', err.message));
  } else {
    console.warn('[checklist-lead-started] N8N_LEAD_STARTED_WEBHOOK not set');
  }

  return Response.json({ success: true });
}
