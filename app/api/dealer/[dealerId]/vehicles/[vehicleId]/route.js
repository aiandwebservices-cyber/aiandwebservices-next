import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
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
