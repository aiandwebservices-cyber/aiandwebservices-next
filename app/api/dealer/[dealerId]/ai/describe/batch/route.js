import { espoFetch, getDealerConfig } from '../../../../_lib/espocrm.js';
import { generateVehicleDescription } from '../../../../../../../lib/dealer-platform/ai/description-writer.js';
import { PRIMO_DEALER_CONFIG } from '../../../../../../../lib/dealer-platform/ai/system-prompt.js';

const DEALER_CONFIGS = {
  lotcrm: PRIMO_DEALER_CONFIG,
};

const REQUEST_DELAY_MS = 1000;

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = DEALER_CONFIGS[dealerId];
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  const espoConfig = getDealerConfig(dealerId);
  if (!espoConfig) return bad('EspoCRM dealer not configured', 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }
  const { vehicleIds } = body || {};
  if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
    return bad('vehicleIds must be a non-empty array');
  }

  const results = [];
  for (let i = 0; i < vehicleIds.length; i++) {
    const id = vehicleIds[i];
    try {
      const fetched = await espoFetch(
        'GET',
        `/api/v1/CVehicle/${encodeURIComponent(id)}`,
        null,
        espoConfig,
      );
      if (!fetched.ok) {
        results.push({ vehicleId: id, ok: false, error: `fetch: ${fetched.error}` });
      } else {
        const { description } = await generateVehicleDescription(fetched.data, dealerConfig);
        const patch = await espoFetch(
          'PATCH',
          `/api/v1/CVehicle/${encodeURIComponent(id)}`,
          { description },
          espoConfig,
        );
        if (patch.ok) {
          results.push({ vehicleId: id, ok: true, description });
        } else {
          results.push({ vehicleId: id, ok: false, error: `patch: ${patch.error}`, description });
        }
      }
    } catch (e) {
      results.push({ vehicleId: id, ok: false, error: e.message });
    }
    if (i < vehicleIds.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  const generated = results.filter((r) => r.ok).length;
  const errors = results.length - generated;
  return Response.json({ ok: true, generated, errors, results });
}
