import { NextResponse } from 'next/server';

export async function POST(request) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'HUBSPOT_TOKEN env var is not set. Add it in Vercel dashboard or .env.local.' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, firstName, companyName, source, answers = {} } = body;

  if (!email || !firstName) {
    return NextResponse.json({ success: false, error: 'email and firstName are required.' }, { status: 400 });
  }

  const yesCount  = Object.values(answers).filter(v => v === 'yes').length;
  const noCount   = Object.values(answers).filter(v => v === 'no').length;
  const answered  = yesCount + noCount;

  const properties = {
    email,
    firstname: firstName,
    checklist_completed: 'true',
    checklist_source: source || 'site',
    checklist_submitted_at: new Date().toISOString(),
    checklist_score: String(yesCount),
    checklist_answered: String(answered),
    checklist_completion_rate: String(Math.round((answered / 20) * 100)),
  };
  if (companyName) properties.company = companyName;

  // Use upsert so re-submitters update rather than create duplicates
  const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      inputs: [
        {
          properties,
          idProperty: 'email',
        },
      ],
    }),
  });

  if (!hsRes.ok) {
    const err = await hsRes.text();
    console.error('[checklist-submit] HubSpot error:', err);
    return NextResponse.json(
      { success: false, error: 'HubSpot API error. Check server logs.' },
      { status: 502 }
    );
  }

  const hsData = await hsRes.json();
  const contactId = hsData?.results?.[0]?.id ?? null;

  // Fire-and-forget n8n webhook for EspoCRM + notification emails
  const n8nUrl = process.env.N8N_CHECKLIST_WEBHOOK;
  if (n8nUrl) {
    try {
      const n8nRes = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          companyName: companyName || '',
          source: source || 'site',
          answers
        })
      });
      if (!n8nRes.ok) {
        const errText = await n8nRes.text();
        console.error('[checklist-submit] n8n webhook failed:', errText);
      }
    } catch (err) {
      console.error('[checklist-submit] n8n webhook error:', err);
    }
  }

  return NextResponse.json({ success: true, contactId });
}
