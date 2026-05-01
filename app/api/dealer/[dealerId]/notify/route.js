import { notifyDealer } from '../../_lib/notify.js';

const VALID_TYPES = new Set([
  'new_lead',
  'new_appointment',
  'new_reservation',
  'new_deal',
  'price_match',
]);

export async function POST(req, { params }) {
  const { dealerId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return Response.json({ ok: false, error: 'Body must be an object' }, { status: 400 });
  }
  if (!VALID_TYPES.has(body.type)) {
    return Response.json({ ok: false, error: 'Invalid or missing type' }, { status: 400 });
  }

  // Fire and forget — do not await. n8n down must not block the response.
  notifyDealer({ dealerId, ...body });

  return Response.json({ ok: true });
}
