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
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!signatureHeader) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compute two candidate signatures — one per Square's old API, one per new API
    const hmacA = crypto.createHmac('sha256', signatureKey);
    hmacA.update(NOTIFICATION_URL + rawBody);
    const sigA = hmacA.digest('base64');

    const hmacB = crypto.createHmac('sha256', signatureKey);
    hmacB.update(rawBody);
    const sigB = hmacB.digest('base64');

    const matchA = signatureHeader === sigA;
    const matchB = signatureHeader === sigB;

    console.log('[square-webhook] Dual-candidate validation', {
      notificationUrl: NOTIFICATION_URL,
      rawBodyLength: rawBody.length,
      keyLength: signatureKey.length,
      expectedPrefix: signatureHeader.substring(0, 20),
      sigA_urlPlusBody_prefix: sigA.substring(0, 20),
      sigB_bodyOnly_prefix: sigB.substring(0, 20),
      matchA,
      matchB,
    });

    if (!matchA && !matchB) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid body' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[square-webhook] Valid event', {
      type: event.type,
      eventId: event.event_id,
      hmacScheme: matchA ? 'url+body' : 'body-only',
    });

    const forwardUrl = process.env.SQUARE_WEBHOOK_N8N_FORWARD_URL;
    if (forwardUrl) {
      fetch(forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: rawBody,
      }).catch(err => console.error('[square-webhook] Forward failed:', err.message));
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[square-webhook] Unhandled error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200, headers: { 'Allow': 'POST, OPTIONS' },
  });
}
