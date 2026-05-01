import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';
import { generateVehicleDescription } from '../../../../../../lib/dealer-platform/ai/description-writer.js';
import { PRIMO_DEALER_CONFIG } from '../../../../../../lib/dealer-platform/ai/system-prompt.js';

const DEALER_CONFIGS = {
  primo: PRIMO_DEALER_CONFIG,
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

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { vehicle } = body || {};
  if (!vehicle || typeof vehicle !== 'object') {
    return bad('vehicle object is required');
  }

  try {
    const { description, tokens } = await generateVehicleDescription(vehicle, dealerConfig);
    return Response.json({ ok: true, description, tokens });
  } catch (e) {
    console.error('[ai/describe] generation failed:', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 502 });
  }
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = DEALER_CONFIGS[dealerId];
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);
  const espoConfig = getDealerConfig(dealerId);
  if (!espoConfig) return bad('EspoCRM dealer not configured', 404);

  const { searchParams } = new URL(req.url);
  if (searchParams.get('missing') !== 'true') {
    return bad('Pass ?missing=true to backfill descriptions');
  }

  // Fetch all vehicles where description is empty.
  const q = new URLSearchParams();
  q.set('orderBy', 'dateAdded');
  q.set('order', 'desc');
  q.set('maxSize', '200');
  q.set('where[0][type]', 'or');
  q.set('where[0][value][0][type]', 'isNull');
  q.set('where[0][value][0][attribute]', 'description');
  q.set('where[0][value][1][type]', 'equals');
  q.set('where[0][value][1][attribute]', 'description');
  q.set('where[0][value][1][value]', '');

  const list = await espoFetch('GET', `/api/v1/CVehicle?${q.toString()}`, null, espoConfig);
  if (!list.ok) {
    return Response.json({ ok: false, error: list.error }, { status: 502 });
  }
  const vehicles = Array.isArray(list.data?.list) ? list.data.list : [];
  const total = vehicles.length;

  let generated = 0;
  let errors = 0;
  const details = [];

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    try {
      const { description } = await generateVehicleDescription(v, dealerConfig);
      const patch = await espoFetch(
        'PATCH',
        `/api/v1/CVehicle/${encodeURIComponent(v.id)}`,
        { description },
        espoConfig,
      );
      if (patch.ok) {
        generated++;
        details.push({ vehicleId: v.id, ok: true });
      } else {
        errors++;
        details.push({ vehicleId: v.id, ok: false, error: patch.error });
      }
    } catch (e) {
      errors++;
      details.push({ vehicleId: v.id, ok: false, error: e.message });
    }
    if (i < vehicles.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  return Response.json({ ok: true, generated, errors, total, details });
}
