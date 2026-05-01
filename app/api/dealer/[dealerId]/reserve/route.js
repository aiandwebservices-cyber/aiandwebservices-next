import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  nowEspoDateTime,
} from '../../_lib/espocrm.js';
import { sanitizeInput } from '../../../../../lib/dealer-platform/middleware/sanitize.js';
import { rateLimit } from '../../../../../lib/dealer-platform/middleware/rate-limit.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(req, { params }) {
  const limited = rateLimit(req, { limit: 30, window: 60 });
  if (limited) return limited;
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = sanitizeInput(await req.json());
  } catch {
    return bad('Invalid JSON body');
  }

  const {
    vehicleId,
    customerName,
    customerEmail,
    customerPhone,
    depositAmount,
  } = body || {};

  if (!vehicleId) return bad('vehicleId is required');
  if (!customerName) return bad('customerName is required');
  if (!isValidEmail(customerEmail)) return bad('Valid customerEmail is required');
  const phoneDigits = normalizePhone(customerPhone);
  if (customerPhone && !phoneDigits) {
    return bad('customerPhone must contain at least 10 digits');
  }

  const reservedAt = nowEspoDateTime(0);
  const expiresAt = nowEspoDateTime(48);
  const deposit = Number(depositAmount ?? 500);

  const payload = {
    name: `${customerName} — ${vehicleId}`,
    vehicleId,
    customerName,
    customerEmail: customerEmail.trim(),
    reservedAt,
    expiresAt,
    depositAmount: deposit,
    depositAmountCurrency: 'USD',
    status: 'Active',
  };
  if (phoneDigits) payload.customerPhone = phoneDigits;

  const reservation = await espoFetch(
    'POST',
    '/api/v1/CVehicleReservation',
    payload,
    dealerConfig,
  );
  if (!reservation.ok) {
    return Response.json({ ok: false, error: reservation.error }, { status: 502 });
  }

  const patch = await espoFetch(
    'PATCH',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    { status: 'Reserved' },
    dealerConfig,
  );
  if (!patch.ok) {
    return Response.json({
      ok: false,
      error: `Reservation created but vehicle status update failed: ${patch.error}`,
      reservationId: reservation.data?.id,
    }, { status: 502 });
  }

  return Response.json({
    ok: true,
    reservationId: reservation.data?.id,
    expiresAt,
  });
}
