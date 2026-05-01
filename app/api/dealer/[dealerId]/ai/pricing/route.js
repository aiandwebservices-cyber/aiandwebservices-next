import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';
import {
  analyzePricing,
  generatePricingReport,
} from '../../../../../../lib/dealer-platform/ai/price-optimizer.js';

// Hardcoded fallback used when no Marketcheck integration is configured.
// Mirrors the MARKET_PRICES table from the primo-admin sample.
const MARKET_PRICES_FALLBACK = {
  v1: 44200, v2: 39100, v3: 43800, v4: 30800,
  v5: 37200, v6: 51400, v7: 60500, v8: 56300,
};

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function lookupMarket(vehicle) {
  if (!vehicle) return null;
  const byId = MARKET_PRICES_FALLBACK[vehicle.id];
  if (byId) return byId;
  return null;
}

async function fetchAllVehicles(dealerConfig) {
  return espoFetch(
    'GET',
    '/api/v1/CVehicle?orderBy=dateAdded&order=desc&maxSize=200',
    null,
    dealerConfig,
  );
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const result = await fetchAllVehicles(dealerConfig);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  const report = await generatePricingReport(list, { marketLookup: lookupMarket });

  return Response.json({ ok: true, report });
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
  const { vehicleId } = body || {};
  if (!vehicleId || typeof vehicleId !== 'string') {
    return bad('vehicleId is required');
  }

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

  const vehicle = result.data;
  const marketAvg = lookupMarket(vehicle);
  const marketData = marketAvg ? { marketAvg } : null;
  const recommendation = analyzePricing(vehicle, marketData);

  return Response.json({ ok: true, recommendation });
}
