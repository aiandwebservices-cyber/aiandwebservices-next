import { espoFetch, getDealerConfig, nowEspoDateTime } from '../../../_lib/espocrm.js';
import { constructWebhookEvent, getStripe } from '../../../_lib/stripe.js';

export const dynamic = 'force-dynamic';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

async function findReservationBySession(sessionId, dealerConfig) {
  const path =
    '/api/v1/CVehicleReservation?' +
    new URLSearchParams({
      'where[0][type]': 'equals',
      'where[0][attribute]': 'stripeSessionId',
      'where[0][value]': sessionId,
      maxSize: '1',
    }).toString();
  const res = await espoFetch('GET', path, null, dealerConfig);
  if (!res.ok) return null;
  const list = res.data?.list || [];
  return list[0] || null;
}

async function handleCheckoutCompleted(session, dealerConfig) {
  const meta = session.metadata || {};
  if (meta.vehicleId) {
    const reservation = await findReservationBySession(session.id, dealerConfig);
    const patches = [];
    patches.push(
      espoFetch(
        'PATCH',
        `/api/v1/CVehicle/${encodeURIComponent(meta.vehicleId)}`,
        { status: 'Reserved' },
        dealerConfig,
      ),
    );
    if (reservation?.id) {
      patches.push(
        espoFetch(
          'PATCH',
          `/api/v1/CVehicleReservation/${encodeURIComponent(reservation.id)}`,
          {
            status: 'Confirmed',
            confirmedAt: nowEspoDateTime(0),
            stripePaymentIntentId: session.payment_intent || null,
          },
          dealerConfig,
        ),
      );
    }
    const results = await Promise.all(patches);
    return {
      kind: 'deposit',
      vehicleId: meta.vehicleId,
      reservationId: reservation?.id || null,
      espoOk: results.every((r) => r.ok),
      espoErrors: results.filter((r) => !r.ok).map((r) => r.error),
    };
  }
  if (meta.appointmentId) {
    const r = await espoFetch(
      'PATCH',
      `/api/v1/CServiceAppointment/${encodeURIComponent(meta.appointmentId)}`,
      {
        paymentStatus: 'Paid',
        paidAt: nowEspoDateTime(0),
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent || null,
      },
      dealerConfig,
    );
    return {
      kind: 'service',
      appointmentId: meta.appointmentId,
      espoOk: r.ok,
      espoErrors: r.ok ? [] : [r.error],
    };
  }
  return { kind: 'unknown', espoOk: true, espoErrors: [] };
}

async function handleChargeRefunded(charge, dealerConfig) {
  const stripe = getStripe();
  let session = null;
  if (charge.payment_intent) {
    const list = await stripe.checkout.sessions.list({
      payment_intent: charge.payment_intent,
      limit: 1,
    });
    session = list.data[0] || null;
  }
  if (!session) {
    return { kind: 'refund', espoOk: true, espoErrors: ['no checkout session linked to charge'] };
  }
  const meta = session.metadata || {};
  if (meta.kind !== 'deposit' || !meta.vehicleId) {
    return { kind: 'refund-noop', espoOk: true, espoErrors: [] };
  }
  const reservation = await findReservationBySession(session.id, dealerConfig);
  const patches = [
    espoFetch(
      'PATCH',
      `/api/v1/CVehicle/${encodeURIComponent(meta.vehicleId)}`,
      { status: 'Available' },
      dealerConfig,
    ),
  ];
  if (reservation?.id) {
    patches.push(
      espoFetch(
        'PATCH',
        `/api/v1/CVehicleReservation/${encodeURIComponent(reservation.id)}`,
        {
          status: 'Released',
          releasedAt: nowEspoDateTime(0),
          refundedAmount: (charge.amount_refunded || 0) / 100,
        },
        dealerConfig,
      ),
    );
  }
  const results = await Promise.all(patches);
  return {
    kind: 'refund',
    vehicleId: meta.vehicleId,
    reservationId: reservation?.id || null,
    espoOk: results.every((r) => r.ok),
    espoErrors: results.filter((r) => !r.ok).map((r) => r.error),
  };
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const sig = req.headers.get('stripe-signature');
  if (!sig) return bad('Missing stripe-signature header', 400);

  const rawBody = await req.text();
  let event;
  try {
    event = constructWebhookEvent(rawBody, sig);
  } catch (err) {
    return bad(`Webhook signature verification failed: ${err.message || err}`, 400);
  }

  try {
    let result;
    switch (event.type) {
      case 'checkout.session.completed':
        result = await handleCheckoutCompleted(event.data.object, dealerConfig);
        break;
      case 'charge.refunded':
        result = await handleChargeRefunded(event.data.object, dealerConfig);
        break;
      default:
        result = { kind: 'ignored', type: event.type };
    }
    return Response.json({ ok: true, eventType: event.type, result });
  } catch (err) {
    return Response.json(
      { ok: false, eventType: event.type, error: err.message || String(err) },
      { status: 500 },
    );
  }
}
