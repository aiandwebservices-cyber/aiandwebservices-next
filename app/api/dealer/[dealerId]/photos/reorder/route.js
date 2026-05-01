import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';
import { publicUrlForKey } from '../../../_lib/r2.js';

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

  const { vehicleId, photoOrder } = body || {};
  if (!vehicleId || typeof vehicleId !== 'string') {
    return bad('vehicleId is required');
  }
  if (!Array.isArray(photoOrder)) {
    return bad('photoOrder must be an array of R2 keys');
  }

  const expectedPrefix = `dealers/${encodeURIComponent(dealerId)}/vehicles/`;
  const cleaned = photoOrder
    .filter((k) => typeof k === 'string' && k.startsWith(expectedPrefix));

  const photoUrls = cleaned.map((k) => publicUrlForKey(k)).filter(Boolean).join(',');

  const result = await espoFetch(
    'PUT',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    { photoUrls },
    dealerConfig,
  );
  if (!result.ok) {
    const status = result.status === 404 ? 404 : 502;
    return Response.json({ ok: false, error: result.error }, { status });
  }

  return Response.json({ ok: true });
}
