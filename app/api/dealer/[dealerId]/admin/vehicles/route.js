// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';
import { withErrorHandling } from '../../../../../../lib/dealer-platform/utils/error-handler.js';

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

export const GET = withErrorHandling(async (_req, { params }) => {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const result = await espoFetch(
    'GET',
    '/api/v1/CVehicle?orderBy=dateAdded&order=desc&maxSize=200',
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return Response.json({ ok: true, vehicles: list, total: result.data?.total ?? list.length });
});

export const POST = withErrorHandling(async (req, { params }) => {
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

  const payload = applyCurrency({ ...body });
  if (!payload.dateAdded) payload.dateAdded = today();

  const result = await espoFetch('POST', '/api/v1/CVehicle', payload, dealerConfig);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    vehicleId: result.data?.id,
    vehicle: result.data,
  });
});
