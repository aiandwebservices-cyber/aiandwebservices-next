import { getDealerConfig } from '../../../_lib/espocrm.js';
import { getStripe, getOrigin } from '../../../_lib/stripe.js';

export async function POST(request, { params }) {
  const { dealerId } = await params;

  const config = getDealerConfig(dealerId);
  if (!config) {
    return Response.json({ error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const stripeCustomerId = config.stripeCustomerId;
  if (!stripeCustomerId) {
    return Response.json(
      { error: 'Billing is not yet configured for this account. Contact support to set up your subscription.' },
      { status: 400 },
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return Response.json({ error: 'Stripe is not configured on this server.' }, { status: 500 });
  }

  const returnUrl = `${getOrigin(request)}/dealers/${dealerId}/admin`;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json(
      { error: err.message || 'Failed to create billing portal session' },
      { status: 500 },
    );
  }
}
