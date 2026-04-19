export const runtime = 'nodejs';

const QUESTIONS = {
  q1:  'Do you currently have a way to capture and track customer inquiries?',
  q2:  'Are there repetitive tasks that your team does manually more than once per day?',
  q3:  'Do you struggle to follow up with leads in a timely manner?',
  q4:  'Is your team spending more than 10 hours/week on admin work (data entry, scheduling, emails)?',
  q5:  'Do you answer customer calls or emails outside of business hours?',
  q6:  'Do some customer questions go unanswered because your team is busy?',
  q7:  'Would you like to offer 24/7 support without hiring someone?',
  q8:  'Do you have a consistent process for onboarding new customers?',
  q9:  'Are you publishing blog content or social media regularly?',
  q10: 'Do you struggle to keep up with content creation?',
  q11: 'Would ranking for more search terms help your business grow?',
  q12: 'Are you currently doing any email marketing to your list?',
  q13: 'Do leads sometimes get lost between initial contact and follow-up?',
  q14: 'Would you like to automatically nurture leads while you focus on closing?',
  q15: 'Are there pricing or plan decisions you want customers to self-serve?',
  q16: "Would increasing your team's closing rate by 20-30% impact your revenue significantly?",
  q17: 'Do you have a CRM or customer database?',
  q18: 'Do your different tools talk to each other, or are they siloed?',
  q19: 'Would you benefit from seeing which customers/prospects are most engaged?',
  q20: 'Are you tracking which marketing channels actually convert customers?',
};

function buildQaTableHtml(answers) {
  const rows = Object.entries(QUESTIONS).map(([id, text], i) => {
    const answered = !!answers[id];
    const num = id.slice(1);
    const bg = i % 2 === 0 ? '#f9fafb' : '#ffffff';
    const answerCell = answered
      ? `<span style="background:#16a34a;color:#fff;font-weight:700;padding:3px 10px;border-radius:4px;font-size:13px;">YES</span>`
      : `<span style="color:#9ca3af;font-style:italic;">— not answered —</span>`;
    return `<tr style="background:${bg};">
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;">Q${num}. ${text}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;white-space:nowrap;text-align:center;">${answerCell}</td>
    </tr>`;
  });
  return `<table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${rows.join('')}</table>`;
}

function buildQaPlainText(answers) {
  return Object.entries(QUESTIONS).map(([id, text]) => {
    const num = id.slice(1);
    const answered = !!answers[id];
    return `Q${num}. ${text}\n→ ${answered ? 'YES' : '(not answered)'}`;
  }).join('\n\n');
}

function buildNoteBody({ firstName, email, companyName, source, answers, score, submittedAt }) {
  const header = [
    `AI Readiness Checklist — Submitted ${submittedAt}`,
    `Score: ${score}/20`,
    `Source: ${source}`,
    companyName ? `Company: ${companyName}` : null,
  ].filter(Boolean).join('\n');

  const lines = Object.entries(QUESTIONS).map(([id, text]) => {
    const answered = answers[id] ? 'YES' : 'NO';
    const num = id.slice(1);
    return `Q${num}. ${text}\n→ ${answered}`;
  });

  return `${header}\n\n${lines.join('\n\n')}`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { firstName, email, companyName = '', source = 'site', answers = {} } = body;

  if (!firstName || !email || typeof answers !== 'object') {
    return Response.json({ success: false, error: 'firstName, email, and answers are required' }, { status: 400 });
  }

  const score = Object.values(answers).filter(Boolean).length;
  const submittedAt = new Date().toISOString().split('T')[0];

  const qaTableHtml  = buildQaTableHtml(answers);
  const qaPlainText  = buildQaPlainText(answers);
  const answeredCount = score;

  const hubspotToken = process.env.HUBSPOT_TOKEN;
  let hubspotContactId = null;

  // ── 1. Look up HubSpot contact by email ──
  if (hubspotToken) {
    try {
      const lookupRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=hs_object_id`,
        { headers: { Authorization: `Bearer ${hubspotToken}` } }
      );
      if (lookupRes.ok) {
        const contact = await lookupRes.json();
        hubspotContactId = contact.id;
      } else if (lookupRes.status !== 404) {
        console.error('[checklist-submit] HubSpot contact lookup failed:', lookupRes.status);
      }
    } catch (err) {
      console.error('[checklist-submit] HubSpot lookup error:', err.message);
    }

    // ── 2. Create HubSpot Note attached to contact (if found) ──
    const noteBody = buildNoteBody({ firstName, email, companyName, source, answers, score, submittedAt });
    try {
      const notePayload = {
        properties: {
          hs_note_body: noteBody,
          hs_timestamp: new Date().toISOString(),
        },
        ...(hubspotContactId
          ? {
              associations: [
                {
                  to: { id: hubspotContactId },
                  types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
                },
              ],
            }
          : {}),
      };

      const noteRes = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify(notePayload),
      });

      if (!noteRes.ok) {
        const err = await noteRes.text();
        console.error('[checklist-submit] HubSpot notes POST failed:', noteRes.status, err);
      }
    } catch (err) {
      console.error('[checklist-submit] HubSpot notes error:', err.message);
    }
  } else {
    console.warn('[checklist-submit] HUBSPOT_TOKEN not set — skipping HubSpot note');
  }

  // ── 3. Forward to n8n Workflow ──
  const webhookUrl = process.env.N8N_CHECKLIST_WEBHOOK;
  if (!webhookUrl) {
    console.error('[checklist-submit] N8N_CHECKLIST_WEBHOOK not set');
    return Response.json({ success: false, error: 'Webhook not configured — contact david@aiandwebservices.com' }, { status: 500 });
  }

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName,
        companyName,
        source,
        answers,
        qaTableHtml,
        qaPlainText,
        answeredCount,
      }),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error('[checklist-submit] n8n returned non-OK:', n8nRes.status, errText);
      return Response.json(
        { success: false, error: 'Failed to process your submission. Please try again.' },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('[checklist-submit] n8n fetch error:', err.message);
    return Response.json(
      { success: false, error: 'Network error reaching submission processor. Please try again.' },
      { status: 502 }
    );
  }

  return Response.json({ success: true, score });
}
