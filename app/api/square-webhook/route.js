import crypto from 'crypto';

/**
 * Square Webhook Handler
 *
 * Validates Square's HMAC-SHA256 signature, logs the event, and forwards
 * the payload to n8n for processing.
 *
 * Square signs webhooks by computing:
 *   HMAC-SHA256(notification_url + raw_body, SQUARE_WEBHOOK_SIGNATURE_KEY)
 * and base64-encoding the result.
 *
 * Docs: https://developer.squareup.com/docs/webhooks/validate-notifications
 */

// Square sends this header containing the base64-encoded HMAC signature
const SQUARE_SIG_HEADER = 'x-square-hmacsha256-signature';

// The URL Square POSTs to — must match exactly what's in the Square dashboard
const NOTIFICATION_URL = 'https://www.aiandwebservices.com/api/square-webhook';

export async function POST(request) {
  // ── 1. Guard: signature key must be present ──────────────────────────────
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!sigKey) {
    console.error('[square-webhook] FATAL: SQUARE_WEBHOOK_SIGNATURE_KEY is not set. Cannot validate webhook — rejecting all requests.');
    return Response.json(
      { error: 'Webhook signature key not configured' },
      { status: 500 }
    );
  }

  // ── 2. Read raw body BEFORE any parsing (Square signs the raw bytes) ──────
  const rawBody = await request.text();
  const incomingSig = request.headers.get(SQUARE_SIG_HEADER);

  // ── 3. Compute expected HMAC-SHA256 ──────────────────────────────────────
  //    Square signs: notification_url + raw_body
  const expectedSig = crypto
    .createHmac('sha256', sigKey)
    .update(NOTIFICATION_URL + rawBody)
    .digest('base64');

  // ── 4. Timing-safe comparison to prevent timing attacks ───────────────────
  let signatureValid = false;
  if (incomingSig) {
    try {
      const incomingBuf  = Buffer.from(incomingSig, 'base64');
      const expectedBuf  = Buffer.from(expectedSig, 'base64');
      // timingSafeEqual requires same-length buffers
      if (incomingBuf.length === expectedBuf.length) {
        signatureValid = crypto.timingSafeEqual(incomingBuf, expectedBuf);
      }
    } catch {
      signatureValid = false;
    }
  }

  if (!signatureValid) {
    console.warn('[square-webhook] Signature mismatch — rejecting request.', {
      hasHeader: !!incomingSig,
      bodyLength: rawBody.length,
    });
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 5. Parse and log the validated event ─────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error('[square-webhook] Failed to parse JSON body:', err.message);
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const eventType  = event?.type ?? 'unknown';
  const merchantId = event?.merchant_id ?? 'unknown';
  const eventId    = event?.event_id ?? 'unknown';

  // Extract payment or invoice details for logging
  const paymentData = event?.data?.object?.payment;
  const invoiceData = event?.data?.object?.invoice;
  const amountMoney = paymentData?.amount_money ?? invoiceData?.payment_requests?.[0]?.computed_amount_money;

  console.log('[square-webhook] Received validated event:', {
    eventType,
    eventId,
    merchantId,
    paymentId:  paymentData?.id ?? null,
    invoiceId:  invoiceData?.id ?? null,
    amount:     amountMoney ? `${amountMoney.amount} ${amountMoney.currency}` : null,
    status:     paymentData?.status ?? invoiceData?.status ?? null,
  });

  // ── 6. Forward to n8n — fire and forget, non-blocking ────────────────────
  const n8nUrl = process.env.SQUARE_WEBHOOK_N8N_FORWARD_URL;
  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rawBody,
    })
      .then(r => console.log('[square-webhook] n8n forward status:', r.status))
      .catch(err => console.error('[square-webhook] n8n forward error:', err.message));
  } else {
    console.warn('[square-webhook] SQUARE_WEBHOOK_N8N_FORWARD_URL not set — event not forwarded to n8n.');
  }

  // ── 7. Acknowledge receipt to Square ─────────────────────────────────────
  //    Square requires a 200 response quickly or it will retry.
  return Response.json({ received: true });
}

// Handle CORS preflight (Square doesn't send OPTIONS but good practice)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': 'https://webhook.squareupstaging.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-square-hmacsha256-signature',
    },
  });
}
