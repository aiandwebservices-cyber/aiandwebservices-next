import { espoFetch, getDealerConfig } from '../../../../_lib/espocrm.js';
import { daysOnLot } from '../../../../../../../lib/dealer-platform/ai/price-optimizer.js';

const VALID_ACTIONS = new Set(['drop', 'sale']);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function effectivePrice(vehicle) {
  return num(vehicle?.salePrice) ?? num(vehicle?.listPrice) ?? null;
}

function vehicleLabel(v) {
  if (!v) return 'vehicle';
  if (v.name) return v.name;
  const parts = [v.year, v.make, v.model].filter(Boolean);
  return parts.length ? parts.join(' ') : (v.id || 'vehicle');
}

function roundTo95(n) {
  if (!Number.isFinite(n) || n <= 0) return n;
  const hundreds = Math.floor(n / 100) * 100;
  return Math.max(0, hundreds - 5);
}

function validateRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return { ok: false, error: 'rules must be a non-empty array' };
  }
  for (const r of rules) {
    if (!r || typeof r !== 'object') return { ok: false, error: 'each rule must be an object' };
    if (!Number.isFinite(Number(r.daysThreshold)) || Number(r.daysThreshold) < 0) {
      return { ok: false, error: 'rule.daysThreshold must be a non-negative number' };
    }
    if (!VALID_ACTIONS.has(r.action)) {
      return { ok: false, error: `rule.action must be one of: ${[...VALID_ACTIONS].join(', ')}` };
    }
    if (!Number.isFinite(Number(r.percent)) || Number(r.percent) <= 0 || Number(r.percent) >= 100) {
      return { ok: false, error: 'rule.percent must be a number between 0 and 100' };
    }
  }
  return { ok: true };
}

// Pick the highest-threshold rule the vehicle satisfies.
function matchRule(vehicleDays, rules) {
  const sorted = [...rules].sort(
    (a, b) => Number(b.daysThreshold) - Number(a.daysThreshold),
  );
  return sorted.find((r) => vehicleDays >= Number(r.daysThreshold)) || null;
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
  const { rules, dryRun = true } = body || {};
  const valid = validateRules(rules);
  if (!valid.ok) return bad(valid.error);

  const listResult = await espoFetch(
    'GET',
    '/api/v1/CVehicle?orderBy=dateAdded&order=desc&maxSize=200',
    null,
    dealerConfig,
  );
  if (!listResult.ok) {
    return Response.json({ ok: false, error: listResult.error }, { status: 502 });
  }
  const vehicles = Array.isArray(listResult.data?.list) ? listResult.data.list : [];

  const affected = [];
  let totalSavingsAtRisk = 0;

  for (const v of vehicles) {
    // Skip already-sold vehicles.
    if (v?.status === 'Sold') continue;

    const days = daysOnLot(v);
    const rule = matchRule(days, rules);
    if (!rule) continue;

    const current = effectivePrice(v);
    if (!current) continue;

    const pct = Number(rule.percent);
    const newPrice = roundTo95(current * (1 - pct / 100));
    if (!newPrice || newPrice >= current) continue;

    const drop = current - newPrice;
    totalSavingsAtRisk += drop;

    affected.push({
      vehicleId: v.id,
      vehicle: vehicleLabel(v),
      daysOnLot: days,
      currentPrice: current,
      newPrice,
      dropPercent: Math.round((drop / current) * 1000) / 10,
      action: rule.action === 'sale' ? 'mark_on_sale' : 'price_drop',
      rule: { daysThreshold: rule.daysThreshold, action: rule.action, percent: pct },
    });
  }

  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      affected,
      unaffected: vehicles.length - affected.length,
      totalSavingsAtRisk: Math.round(totalSavingsAtRisk),
    });
  }

  // Apply: PUT each affected vehicle's salePrice (and status if rule.action === 'sale').
  const applied = [];
  const failures = [];

  for (const a of affected) {
    const payload = {
      salePrice: a.newPrice,
      salePriceCurrency: 'USD',
    };
    if (a.action === 'mark_on_sale') {
      payload.status = 'OnSale';
    }
    const res = await espoFetch(
      'PUT',
      `/api/v1/CVehicle/${encodeURIComponent(a.vehicleId)}`,
      payload,
      dealerConfig,
    );
    if (res.ok) {
      applied.push(a);
    } else {
      failures.push({ vehicleId: a.vehicleId, error: res.error });
    }
  }

  return Response.json({
    ok: failures.length === 0,
    dryRun: false,
    affected: applied,
    failures,
    unaffected: vehicles.length - affected.length,
    totalSavingsAtRisk: Math.round(totalSavingsAtRisk),
  });
}
