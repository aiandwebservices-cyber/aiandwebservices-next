import { getDealerConfig } from '../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

// Server-side in-memory cache (per VIN, 24-hour TTL)
const pricingCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000;

function cachedGet(key) {
  const entry = pricingCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { pricingCache.delete(key); return null; }
  return entry.data;
}
function cacheSet(key, data) {
  pricingCache.set(key, { data, ts: Date.now() });
}

function computeEstimated({ year, make, model, mileage, listPrice, oneOwner, cleanTitle, noAccidents, zip }) {
  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(0, currentYear - Number(year || currentYear));

  // Mileage adj: -$0.10 per mile over 12K/year average
  const mileageOverAvg = Math.max(0, Number(mileage || 0) - 12000 * Math.max(1, ageYears));
  const mileageAdj = -(mileageOverAvg * 0.10);

  // Condition premium
  const conditionAdj = (oneOwner && cleanTitle && noAccidents) ? 1500 : 0;

  const base = Number(listPrice || 0);
  const marketAvg = Math.round((base + mileageAdj + conditionAdj) / 100) * 100;
  const marketLow = Math.round(marketAvg * 0.92 / 100) * 100;
  const marketHigh = Math.round(marketAvg * 1.08 / 100) * 100;
  const predictedPrice = Math.round(marketAvg * 0.97 / 100) * 100;

  const diff = marketAvg > 0 ? (base - marketAvg) / marketAvg : 0;
  const pricePosition = diff > 0.025 ? 'above_market' : diff < -0.025 ? 'below_market' : 'at_market';
  const percentile = Math.max(5, Math.min(95, Math.round(50 + diff * 350)));

  const comparableListings = 15 + Math.floor(Math.random() * 26); // 15-40
  const avgDaysOnMarket = 25 + Math.floor(Math.random() * 21);    // 25-45

  return {
    source: 'estimated',
    marketAvg,
    marketLow,
    marketHigh,
    predictedPrice,
    comparableListings,
    avgDaysOnMarket,
    pricePosition,
    percentile,
    zipCode: zip || '00000',
  };
}

async function fetchFromMarketcheck(apiKey, { vin, year, make, model, mileage, zip }) {
  const radius = 100;
  const [priceRes, statsRes] = await Promise.allSettled([
    fetch(
      `https://mc-api.marketcheck.com/v2/predict/car/price?api_key=${apiKey}&vin=${vin}&miles=${mileage || 0}&zip=${zip || ''}`,
      { signal: AbortSignal.timeout(6000) },
    ),
    fetch(
      `https://mc-api.marketcheck.com/v2/stats/car?api_key=${apiKey}&year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&zip=${zip || ''}&radius=${radius}`,
      { signal: AbortSignal.timeout(6000) },
    ),
  ]);

  let predictedPrice = null;
  if (priceRes.status === 'fulfilled' && priceRes.value.ok) {
    const d = await priceRes.value.json();
    predictedPrice = d?.predicted_price || d?.price || null;
  }

  let statsData = {};
  if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
    const d = await statsRes.value.json();
    statsData = d?.stats || d || {};
  }

  if (!predictedPrice && !statsData.mean) return null;

  const marketAvg = statsData.mean ? Math.round(statsData.mean) : (predictedPrice || 0);
  const marketLow = statsData.min ? Math.round(statsData.min) : Math.round(marketAvg * 0.92);
  const marketHigh = statsData.max ? Math.round(statsData.max) : Math.round(marketAvg * 1.08);
  const comparableListings = statsData.count || 0;
  const avgDaysOnMarket = statsData.avg_dom || null;

  return {
    source: 'marketcheck',
    marketAvg,
    marketLow,
    marketHigh,
    predictedPrice: predictedPrice ? Math.round(predictedPrice) : Math.round(marketAvg * 0.97),
    comparableListings,
    avgDaysOnMarket,
    zipCode: zip || '',
  };
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const sp = new URL(req.url).searchParams;
  const vin        = sp.get('vin') || '';
  const year       = sp.get('year') || '';
  const make       = sp.get('make') || '';
  const model      = sp.get('model') || '';
  const mileage    = sp.get('mileage') || '0';
  const listPrice  = sp.get('listPrice') || '0';
  const zip        = sp.get('zip') || '';
  const oneOwner   = sp.get('oneOwner') === 'true';
  const cleanTitle = sp.get('cleanTitle') === 'true';
  const noAccidents = sp.get('noAccidents') === 'true';

  const cacheKey = vin ? `vin:${vin}` : `${year}-${make}-${model}-${mileage}`;
  const cached = cachedGet(cacheKey);
  if (cached) return Response.json({ ok: true, pricing: cached, cached: true });

  const apiKey = process.env.MARKETCHECK_API_KEY;
  let pricing = null;

  if (apiKey && vin) {
    try {
      pricing = await fetchFromMarketcheck(apiKey, { vin, year, make, model, mileage, zip });
    } catch { /* fall through to estimated */ }
  }

  if (!pricing) {
    pricing = computeEstimated({ year, make, model, mileage, listPrice, oneOwner, cleanTitle, noAccidents, zip });
  }

  if (pricing.pricePosition === undefined && pricing.source === 'marketcheck') {
    const price = Number(listPrice || 0);
    const diff = pricing.marketAvg > 0 ? (price - pricing.marketAvg) / pricing.marketAvg : 0;
    pricing.pricePosition = diff > 0.025 ? 'above_market' : diff < -0.025 ? 'below_market' : 'at_market';
    pricing.percentile = Math.max(5, Math.min(95, Math.round(50 + diff * 350)));
  }

  cacheSet(cacheKey, pricing);
  return Response.json({ ok: true, pricing });
}
