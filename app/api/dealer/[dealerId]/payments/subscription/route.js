import { getDealerConfig, isValidEmail } from '../../../_lib/espocrm.js';
import {
  createCheckoutSession,
  findOrCreateCustomerByEmail,
  getOrigin,
  PLATFORM_PLANS,
  SUBSCRIPTION_PRICE_ENV,
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

  const { dealerEmail, plan } = body || {};
  if (!isValidEmail(dealerEmail)) return bad('Valid dealerEmail is required');
  if (!PLATFORM_PLANS.includes(plan)) {
    return bad(`plan must be one of: ${PLATFORM_PLANS.join(', ')}`);
  }

  const priceEnvKey = SUBSCRIPTION_PRICE_ENV[plan];
  const priceId = process.env[priceEnvKey];
  if (!priceId) {
    return Response.json(
      { ok: false, error: `${priceEnvKey} is not configured on the server` },
      { status: 500 },
    );
  }

  const origin = getOrigin(req);
  const successUrl =
    `${origin}/dealers/${encodeURIComponent(dealerId)}` +
    `?subscription=success&plan=${encodeURIComponent(plan)}` +
    `&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    `${origin}/dealers/${encodeURIComponent(dealerId)}?subscription=cancelled`;

  try {
    const customer = await findOrCreateCustomerByEmail(dealerEmail.trim());
    const session = await createCheckoutSession({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        kind: 'subscription',
        dealerId,
        plan,
        dealerEmail: dealerEmail.trim(),
      },
    });

    return Response.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      customerId: customer.id,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: `Stripe error: ${err.message || err}` },
      { status: 502 },
    );
  }
}
