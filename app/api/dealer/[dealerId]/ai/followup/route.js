import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';
import {
  writeFollowUp,
  writeFollowUpSequence,
} from '../../../../../../lib/dealer-platform/ai/followup-writer.js';
import { PRIMO_DEALER_CONFIG } from '../../../../../../lib/dealer-platform/ai/system-prompt.js';
import { findSimilarVehicles } from '../../../../../../lib/dealer-platform/ai/similar-vehicles.js';

const DEALER_CONFIGS = {
  lotcrm: PRIMO_DEALER_CONFIG,
};

const VALID_STAGES = new Set(['4h', '24h', 'day3', 'day7', 'all']);
const VALID_CHANNELS = new Set(['sms', 'email', 'both']);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

async function fetchLead(leadId, espoConfig) {
  const res = await espoFetch(
    'GET',
    `/api/v1/Lead/${encodeURIComponent(leadId)}`,
    null,
    espoConfig
  );
  if (!res.ok) return null;
  return res.data;
}

async function fetchVehicleByLabel(label, espoConfig) {
  if (!label || typeof label !== 'string') return null;
  const trimmed = label.trim();
  if (!trimmed) return null;

  // Try direct ID lookup first (Espo IDs are 17-char hex-ish strings).
  if (/^[A-Za-z0-9]{16,24}$/.test(trimmed) && !/\s/.test(trimmed)) {
    const byId = await espoFetch(
      'GET',
      `/api/v1/CVehicle/${encodeURIComponent(trimmed)}`,
      null,
      espoConfig
    );
    if (byId.ok && byId.data?.id) return byId.data;
  }

  // Otherwise try name search.
  const q = new URLSearchParams();
  q.set('maxSize', '1');
  q.set('where[0][type]', 'contains');
  q.set('where[0][attribute]', 'name');
  q.set('where[0][value]', trimmed);
  const search = await espoFetch(
    'GET',
    `/api/v1/CVehicle?${q.toString()}`,
    null,
    espoConfig
  );
  if (search.ok && Array.isArray(search.data?.list) && search.data.list.length > 0) {
    return search.data.list[0];
  }
  return null;
}

async function fetchInventory(espoConfig, limit = 100) {
  const q = new URLSearchParams();
  q.set('maxSize', String(limit));
  q.set('orderBy', 'dateAdded');
  q.set('order', 'desc');
  q.set('where[0][type]', 'in');
  q.set('where[0][attribute]', 'status');
  ['Available', 'Featured', 'OnSale', 'JustArrived', 'PriceDrop'].forEach((s, i) => {
    q.set(`where[0][value][${i}]`, s);
  });
  const res = await espoFetch('GET', `/api/v1/CVehicle?${q.toString()}`, null, espoConfig);
  if (!res.ok) return [];
  return Array.isArray(res.data?.list) ? res.data.list : [];
}

async function buildContext(leadId, dealerId) {
  const espoConfig = getDealerConfig(dealerId);
  if (!espoConfig) return { error: `Unknown dealer: ${dealerId}`, status: 404 };

  const dealerConfig = DEALER_CONFIGS[dealerId] || PRIMO_DEALER_CONFIG;
  const lead = await fetchLead(leadId, espoConfig);
  if (!lead) return { error: 'Lead not found', status: 404 };

  let vehicle = null;
  if (lead.cVehicleOfInterest) {
    vehicle = await fetchVehicleByLabel(lead.cVehicleOfInterest, espoConfig);
  }

  return { lead, vehicle, dealerConfig, espoConfig };
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  if (!getDealerConfig(dealerId)) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { leadId, stage, channel } = body || {};
  if (!leadId || typeof leadId !== 'string') return bad('leadId is required');
  if (!stage || !VALID_STAGES.has(stage)) return bad('stage must be one of 4h,24h,day3,day7,all');
  if (channel && !VALID_CHANNELS.has(channel)) return bad('channel must be sms, email, or both');

  const ctx = await buildContext(leadId, dealerId);
  if (ctx.error) return bad(ctx.error, ctx.status || 400);

  try {
    if (stage === 'all') {
      const sequence = await writeFollowUpSequence(ctx.lead, ctx.vehicle, ctx.dealerConfig);
      return Response.json({
        ok: true,
        leadId,
        sequence,
        vehicle: ctx.vehicle ? { id: ctx.vehicle.id, name: [ctx.vehicle.year, ctx.vehicle.make, ctx.vehicle.model].filter(Boolean).join(' ') } : null,
      });
    }
    const result = await writeFollowUp(ctx.lead, ctx.vehicle, ctx.dealerConfig, stage);
    const filtered = (() => {
      if (channel === 'sms') return { sms: result.sms, stage: result.stage, tokens: result.tokens };
      if (channel === 'email') return { email: result.email, stage: result.stage, tokens: result.tokens };
      return result;
    })();
    return Response.json({ ok: true, leadId, ...filtered });
  } catch (e) {
    console.error('[ai/followup] generation failed:', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 502 });
  }
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  if (!getDealerConfig(dealerId)) return bad(`Unknown dealer: ${dealerId}`, 404);

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId');
  if (!leadId) return bad('leadId query param is required');

  const ctx = await buildContext(leadId, dealerId);
  if (ctx.error) return bad(ctx.error, ctx.status || 400);

  let similar = [];
  if (ctx.vehicle) {
    const inventory = await fetchInventory(ctx.espoConfig, 100);
    similar = findSimilarVehicles(ctx.vehicle, inventory, 3);
  }

  try {
    const sequence = await writeFollowUpSequence(ctx.lead, ctx.vehicle, ctx.dealerConfig);
    return Response.json({
      ok: true,
      leadId,
      lead: {
        id: ctx.lead.id,
        firstName: ctx.lead.firstName || '',
        lastName: ctx.lead.lastName || '',
        emailAddress: ctx.lead.emailAddress || '',
        phoneNumber: ctx.lead.phoneNumber || '',
        cVehicleOfInterest: ctx.lead.cVehicleOfInterest || '',
      },
      vehicle: ctx.vehicle
        ? {
            id: ctx.vehicle.id,
            year: ctx.vehicle.year ?? null,
            make: ctx.vehicle.make ?? null,
            model: ctx.vehicle.model ?? null,
            trim: ctx.vehicle.trim ?? null,
            bodyStyle: ctx.vehicle.bodyStyle ?? null,
            price: Number(ctx.vehicle.salePrice ?? ctx.vehicle.listPrice ?? 0) || null,
          }
        : null,
      similar,
      sequence,
    });
  } catch (e) {
    console.error('[ai/followup GET] generation failed:', e.message);
    return Response.json({ ok: false, error: e.message }, { status: 502 });
  }
}
