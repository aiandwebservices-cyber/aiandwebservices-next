export async function POST(req) {
  const data = await req.json();

  // Fire webhook if configured
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        submitted_at: new Date().toISOString(),
        source: 'aiandwebservices.com',
      }),
    });
  }

  return Response.json({ ok: true });
}
