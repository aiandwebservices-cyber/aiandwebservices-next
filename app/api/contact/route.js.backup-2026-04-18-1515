export async function POST(req) {
  try {
    const data = await req.json();
    const payload = {
      ...data,
      submitted_at: new Date().toISOString(),
      source: 'aiandwebservices.com',
    };

    // Send contact to HubSpot CRM
    const hubspotToken = process.env.HUBSPOT_TOKEN;
    if (hubspotToken) {
      const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify({
          properties: {
            firstname: data.first_name || '',
            lastname: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            hs_lead_status: 'NEW',
            message: data.message || '',
            jobtitle: data.service || '',
          },
        }),
      });
      if (!hsRes.ok) {
        const err = await hsRes.text();
        console.error('HubSpot error:', hsRes.status, err);
      } else {
        console.log('HubSpot contact created');
      }
    } else {
      console.log('No HUBSPOT_TOKEN set');
    }

    // Fire n8n webhook — fire-and-forget, does not block response
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => console.log('n8n webhook status:', r.status))
        .catch(err => console.error('n8n webhook error:', err.message));
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
