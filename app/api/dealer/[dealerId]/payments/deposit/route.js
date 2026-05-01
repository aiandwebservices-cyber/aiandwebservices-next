import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  phoneNumberData,
  nowEspoDateTime,
} from '../../../_lib/espocrm.js';
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

  const {
    vehicleId,
    customerName,
    customerEmail,
    customerPhone,
    amount = 500,
  } = body || {};

  if (!vehicleId) return bad('vehicleId is required');
  if (!customerName) return bad('customerName is required');
  if (!isValidEmail(customerEmail)) return bad('Valid customerEmail is required');

  const phoneDigits = normalizePhone(customerPhone);
  if (customerPhone && !phoneDigits) {
    return bad('customerPhone must contain at least 10 digits');
  }

  const amountCents = dollarsToCents(amount);
  if (!amountCents) return bad('amount must be a positive number of dollars');

  // a. Fetch vehicle from EspoCRM for description
  const vehicle = await espoFetch(
    'GET',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    null,
    dealerConfig,
  );
  if (!vehicle.ok) {
    return Response.json(
      { ok: false, error: `Vehicle not found in EspoCRM: ${vehicle.error}` },
      { status: vehicle.status || 502 },
    );
  }
  const v = vehicle.data || {};
  const year = v.cYear || v.year || '';
  const make = v.cMake || v.make || '';
  const model = v.cModel || v.model || '';
  const stockNumber = v.cStockNumber || v.stockNumber || '—';
  const vehicleLabel = `${year} ${make} ${model}`.trim() || 'Vehicle';

  const origin = getOrigin(req);
  const successUrl =
    `${origin}/dealers/${encodeURIComponent(dealerId)}` +
    `?deposit=success&vehicle=${encodeURIComponent(vehicleId)}` +
    `&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/dealers/${encodeURIComponent(dealerId)}?deposit=cancelled`;

  // b. Create Stripe Checkout Session
  let session;
  try {
    session = await createCheckoutSession({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail.trim(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: `Refundable deposit — ${vehicleLabel}`,
              description: `Refundable deposit — ${vehicleLabel} (Stock #${stockNumber})`,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        kind: 'deposit',
        dealerId,
        vehicleId,
        customerName,
        customerEmail: customerEmail.trim(),
      },
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: `Stripe error: ${err.message || err}` },
      { status: 502 },
    );
  }

  // c. Create/update Lead in EspoCRM with source=Reserve
  const [firstName, ...rest] = String(customerName).trim().split(/\s+/);
  const lastName = rest.join(' ') || firstName;
  const leadPayload = {
    firstName,
    lastName,
    emailAddress: customerEmail.trim(),
    source: 'Reserve',
    status: 'New',
    description: `Deposit checkout started for ${vehicleLabel} (Stock #${stockNumber})`,
  };
  const phoneData = phoneNumberData(customerPhone);
  if (phoneData) leadPayload.phoneNumberData = phoneData;
  const lead = await espoFetch('POST', '/api/v1/Lead', leadPayload, dealerConfig);

  // d. Create CVehicleReservation with status=Active
  const reservedAt = nowEspoDateTime(0);
  const expiresAt = nowEspoDateTime(48);
  const reservationPayload = {
    name: `${customerName} — ${vehicleLabel}`,
    vehicleId,
    customerName,
    customerEmail: customerEmail.trim(),
    reservedAt,
    expiresAt,
    depositAmount: Number(amount),
    depositAmountCurrency: 'USD',
    status: 'Active',
    stripeSessionId: session.id,
    leadId: lead.ok ? lead.data?.id || null : null,
  };
  if (phoneDigits) reservationPayload.customerPhone = phoneDigits;

  const reservation = await espoFetch(
    'POST',
    '/api/v1/CVehicleReservation',
    reservationPayload,
    dealerConfig,
  );

  return Response.json({
    ok: true,
    checkoutUrl: session.url,
    sessionId: session.id,
    reservationId: reservation.ok ? reservation.data?.id || null : null,
    leadId: lead.ok ? lead.data?.id || null : null,
    espoWarnings: [
      ...(lead.ok ? [] : [`lead create failed: ${lead.error}`]),
      ...(reservation.ok ? [] : [`reservation create failed: ${reservation.error}`]),
    ],
  });
}
