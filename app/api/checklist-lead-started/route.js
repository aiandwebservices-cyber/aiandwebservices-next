import { NextResponse } from 'next/server';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { firstName, email, phone, companyName, source } = body;

  if (!email || !firstName) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const timestamp = new Date().toISOString();

  // HubSpot upsert — create/update contact with "started" status
  const token = process.env.HUBSPOT_TOKEN;
  if (token) {
    try {
      const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inputs: [{
            id: email,
            idProperty: 'email',
            properties: {
              email,
              firstname: firstName,
              phone: phone || '',
              company: companyName || '',
              checklist_status: 'started',
              checklist_started_at: timestamp,
              checklist_source: source || 'site',
            },
          }],
        }),
      });
      if (!hsRes.ok) {
        const err = await hsRes.text();
        console.error('[checklist-lead-started] HubSpot error:', err);
      }
    } catch (err) {
      console.error('[checklist-lead-started] HubSpot fetch error:', err);
    }
  }

  // n8n webhook — EspoCRM lead creation + David notification
  // Always fire when env var is set; non-blocking for caller
  const n8nUrl = process.env.N8N_LEAD_STARTED_WEBHOOK;
  if (n8nUrl) {
    try {
      const n8nRes = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          phone: phone || '',
          companyName: companyName || '',
          source: source || 'site',
          startedAt: timestamp,
          event: 'checklist_started',
        }),
      });
      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error('[checklist-lead-started] n8n error:', errText);
      }
    } catch (err) {
      console.error('[checklist-lead-started] n8n fetch error:', err);
    }
  }

  return NextResponse.json({ success: true });
}
