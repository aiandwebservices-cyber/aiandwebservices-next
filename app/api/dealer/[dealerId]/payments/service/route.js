import { getDealerConfig } from '../../../_lib/espocrm.js';
import {
  createCheckoutSession,
  dollarsToCents,
  getOrigin,
} from '../../../_lib/stripe.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { appointmentId, customerEmail, amount, serviceType } = body || {};
  if (!appointmentId) return bad('appointmentId is required');
  if (!serviceType) return bad('serviceType is required');

  const amountCents = dollarsToCents(amount);
  if (!amountCents) return bad('amount must be a positive number of dollars');

  const origin = getOrigin(req);
  const successUrl =
    `${origin}/dealers/${encodeURIComponent(dealerId)}` +
    `?service=success&appointment=${encodeURIComponent(appointmentId)}` +
    `&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    `${origin}/dealers/${encodeURIComponent(dealerId)}` +
    `?service=cancelled&appointment=${encodeURIComponent(appointmentId)}`;

  try {
    const session = await createCheckoutSession({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail ? String(customerEmail).trim() : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: serviceType,
              description: `Service payment — ${serviceType}`,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        kind: 'service',
        dealerId,
        appointmentId,
        serviceType,
      },
    });

    return Response.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: `Stripe error: ${err.message || err}` },
      { status: 502 },
    );
  }
}
