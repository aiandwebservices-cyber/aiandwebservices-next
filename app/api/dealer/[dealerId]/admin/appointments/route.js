// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const result = await espoFetch(
    'GET',
    '/api/v1/CServiceAppointment?orderBy=requestedDate&order=asc&maxSize=100',
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return Response.json({ ok: true, appointments: list, total: result.data?.total ?? list.length });
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
  if (!body || typeof body !== 'object') return bad('Body must be an object');

  const payload = { ...body };
  if (payload.estimatedCost !== undefined && payload.estimatedCost !== null && payload.estimatedCost !== '') {
    payload.estimatedCost = Number(payload.estimatedCost);
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
  return Response.json({ ok: true, appointmentId: result.data?.id, appointment: result.data });
}

export async function PUT(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { appointmentId, status, requestedDate, requestedTime, ...rest } = body || {};
  if (!appointmentId) return bad('appointmentId is required');

  const payload = { ...rest };
  if (status !== undefined) payload.status = status;
  if (requestedDate !== undefined) payload.requestedDate = requestedDate;
  if (requestedTime !== undefined) payload.requestedTime = requestedTime;

  if (payload.estimatedCost !== undefined && payload.estimatedCost !== null && payload.estimatedCost !== '') {
    payload.estimatedCost = Number(payload.estimatedCost);
    payload.estimatedCostCurrency = 'USD';
  }

  const result = await espoFetch(
    'PUT',
    `/api/v1/CServiceAppointment/${encodeURIComponent(appointmentId)}`,
    payload,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, appointment: result.data });
}
