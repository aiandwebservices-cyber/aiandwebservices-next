export type ContactLead = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  message?: string;
  service?: string;
  [key: string]: unknown;
};

/**
 * Owner notification for the public contact form.
 * Same provider and destination as app/api/contact/route.js:
 * HubSpot when HUBSPOT_TOKEN is set, and the n8n webhook at CONTACT_WEBHOOK_URL.
 * Neither call is an email API. Failures are logged and do not throw.
 */
export async function notifyContactLead(data: ContactLead, env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const payload = {
    ...data,
    submitted_at: new Date().toISOString(),
    source: 'aiandwebservices.com',
  };

  const hubspotToken = env.HUBSPOT_TOKEN;
  if (hubspotToken) {
    try {
      const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubspotToken}`,
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
    } catch (err) {
      console.error('HubSpot error:', err);
    }
  } else {
    console.log('No HUBSPOT_TOKEN set');
  }

  const webhookUrl = env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => console.log('n8n webhook status:', r.status))
      .catch((err) => console.error('n8n webhook error:', err.message));
  }
}
