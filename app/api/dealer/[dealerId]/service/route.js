import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
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
    customerName,
    customerPhone,
    customerEmail,
    vehicleYear,
    vehicleMake,
    vehicleModel,
    serviceType,
    requestedDate,
    requestedTime,
    notes,
    estimatedCost,
  } = body || {};

  if (!customerName) return bad('customerName is required');
  if (!isValidEmail(customerEmail)) return bad('Valid customerEmail is required');
  if (customerPhone && !normalizePhone(customerPhone)) {
    return bad('customerPhone must contain at least 10 digits');
  }

  const phoneDigits = normalizePhone(customerPhone);

  const payload = {
    name: `${customerName} — ${serviceType || 'Service'}`,
    customerName,
    customerEmail: customerEmail.trim(),
    serviceType: serviceType || '',
    requestedDate: requestedDate || '',
    requestedTime: requestedTime || '',
    notes: notes || '',
    vehicleYear: vehicleYear || '',
    vehicleMake: vehicleMake || '',
    vehicleModel: vehicleModel || '',
    status: 'Pending',
  };

  if (phoneDigits) payload.customerPhone = phoneDigits;

  if (estimatedCost !== undefined && estimatedCost !== null && estimatedCost !== '') {
    payload.estimatedCost = Number(estimatedCost);
    payload.estimatedCostCurrency = 'USD';
  }

  const result = await espoFetch(
    'POST',
    '/api/v1/CServiceAppointment',
    payload,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  return Response.json({ ok: true, appointmentId: result.data?.id });
}
