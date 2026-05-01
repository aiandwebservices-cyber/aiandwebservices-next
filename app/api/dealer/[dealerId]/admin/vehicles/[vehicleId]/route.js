// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../../_lib/espocrm.js';

const CURRENCY_FIELDS = ['listPrice', 'salePrice', 'costBasis', 'finalSalePrice'];

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function applyCurrency(payload) {
  for (const f of CURRENCY_FIELDS) {
    if (payload[f] !== undefined && payload[f] !== null && payload[f] !== '') {
      payload[f] = Number(payload[f]);
      payload[`${f}Currency`] = 'USD';
    }
  }
  return payload;
}

export async function GET(_req, { params }) {
  const { dealerId, vehicleId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  if (!vehicleId) return bad('vehicleId is required');

  const result = await espoFetch(
    'GET',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    null,
    dealerConfig,
  );
  if (!result.ok) {
    const status = result.status === 404 ? 404 : 502;
    return Response.json({ ok: false, error: result.error }, { status });
  }
  return Response.json({ ok: true, vehicle: result.data });
}

export async function PUT(req, { params }) {
  const { dealerId, vehicleId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  if (!vehicleId) return bad('vehicleId is required');

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }
  if (!body || typeof body !== 'object') return bad('Body must be an object');

  const payload = applyCurrency({ ...body });
  if (payload.status === 'Sold' && !payload.dateSold) {
    payload.dateSold = today();
  }

  const result = await espoFetch(
    'PUT',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    payload,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, vehicle: result.data });
}

export async function DELETE(_req, { params }) {
  const { dealerId, vehicleId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  if (!vehicleId) return bad('vehicleId is required');

  const result = await espoFetch(
    'DELETE',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
