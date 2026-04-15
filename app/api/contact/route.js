export async function POST(req) {
  try {
    const data = await req.json();

    // Fire webhook if configured
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submitted_at: new Date().toISOString(),
          source: 'aiandwebservices.com',
        }),
      });
      console.log('Webhook status:', webhookRes.status);
    } else {
      console.log('No CONTACT_WEBHOOK_URL set');
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
