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
    '/api/v1/Lead?orderBy=createdAt&order=desc&maxSize=200',
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return Response.json({ ok: true, leads: list, total: result.data?.total ?? list.length });
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

  const { leadId, status, description, ...rest } = body || {};
  if (!leadId) return bad('leadId is required');

  const payload = { ...rest };
  if (status !== undefined) payload.status = status;
  if (description !== undefined) payload.description = description;

  const result = await espoFetch(
    'PUT',
    `/api/v1/Lead/${encodeURIComponent(leadId)}`,
    payload,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, lead: result.data });
}
