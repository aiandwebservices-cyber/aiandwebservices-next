import crypto from 'crypto';

const NOTIFICATION_URL = 'https://www.aiandwebservices.com/api/square-webhook';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-square-hmacsha256-signature');
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

    if (!signatureKey) {
      console.error('[square-webhook] CRITICAL: SQUARE_WEBHOOK_SIGNATURE_KEY not set');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!signatureHeader) {
      console.warn('[square-webhook] No signature header');
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hmac = crypto.createHmac('sha256', signatureKey);
    hmac.update(NOTIFICATION_URL + rawBody);
    const computedSignature = hmac.digest('base64');

    console.log('[square-webhook] Validation', {
      notificationUrl: NOTIFICATION_URL,
      rawBodyLength: rawBody.length,
      keyLength: signatureKey.length,
      expectedPrefix: signatureHeader.substring(0, 20),
      computedPrefix: computedSignature.substring(0, 20),
      match: signatureHeader === computedSignature,
    });

    const expectedBuffer = Buffer.from(signatureHeader, 'base64');
    const computedBuffer = Buffer.from(computedSignature, 'base64');

    if (expectedBuffer.length !== computedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, computedBuffer)) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      console.error('[square-webhook] Invalid JSON');
      return new Response(JSON.stringify({ error: 'Invalid body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[square-webhook] Valid event', {
      type: event.type,
      eventId: event.event_id,
    });

    const forwardUrl = process.env.SQUARE_WEBHOOK_N8N_FORWARD_URL;
    if (forwardUrl) {
      fetch(forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: rawBody,
      }).catch(err => console.error('[square-webhook] Forward failed:', err.message));
    } else {
      console.warn('[square-webhook] SQUARE_WEBHOOK_N8N_FORWARD_URL not set');
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[square-webhook] Unhandled error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: { 'Allow': 'POST, OPTIONS' },
  });
}
