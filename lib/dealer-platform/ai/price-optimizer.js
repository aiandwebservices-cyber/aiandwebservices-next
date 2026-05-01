// AI price-optimization heuristics for dealer inventory.
// Pure functions — no network. Called from /api/dealer/[dealerId]/ai/pricing.

const DAY_MS = 24 * 60 * 60 * 1000;

// Days-on-lot buckets and the base recommendation that flows from each.
const DAYS_BUCKETS = [
  { max: 14,       label: 'Fresh',      action: 'none',            urgency: 'low',      basePct: 0  },
  { max: 29,       label: 'Normal',     action: 'none',            urgency: 'low',      basePct: 0  },
  { max: 44,       label: 'Aging',      action: 'feature',         urgency: 'medium',   basePct: 2  },
  { max: 59,       label: 'Stale',      action: 'small_drop',      urgency: 'medium',   basePct: 4  },
  { max: 74,       label: 'Critical',   action: 'moderate_drop',   urgency: 'high',     basePct: 6  },
  { max: Infinity, label: 'Distressed', action: 'aggressive_drop', urgency: 'critical', basePct: 9  },
];

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pickEffectivePrice(vehicle) {
  return num(vehicle?.salePrice) ?? num(vehicle?.listPrice) ?? null;
}

function vehicleLabel(v) {
  if (!v) return 'vehicle';
  if (v.name) return v.name;
  const parts = [v.year, v.make, v.model].filter(Boolean);
  return parts.length ? parts.join(' ') : (v.id || 'vehicle');
}

function parseDateAdded(vehicle) {
  const raw = vehicle?.dateAdded || vehicle?.createdAt || null;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysOnLot(vehicle, now = Date.now()) {
  const d = parseDateAdded(vehicle);
  if (!d) return 0;
  return Math.max(0, Math.floor((now - d.getTime()) / DAY_MS));
}

function bucketFor(days) {
  return DAYS_BUCKETS.find((b) => days <= b.max) || DAYS_BUCKETS[DAYS_BUCKETS.length - 1];
}

function marginTier(marginPct) {
  if (marginPct === null) return { tier: 'unknown', note: 'cost basis missing — margin unknown' };
  if (marginPct < 5)  return { tier: 'floor',    note: 'At floor — consider wholesale' };
  if (marginPct < 15) return { tier: 'minimal',  note: 'Minimal margin — limited room to discount' };
  if (marginPct < 25) return { tier: 'moderate', note: 'Moderate margin — moderate room to discount' };
  return                     { tier: 'healthy',  note: 'Healthy margin — room to reduce' };
}

function marketPosition(price, marketAvg) {
  if (!price || !marketAvg) return null;
  const pct = ((price - marketAvg) / marketAvg) * 100;
  let label;
  if (pct > 5) label = 'overpriced';
  else if (pct < -5) label = 'underpriced';
  else label = 'market_rate';
  return { pct: Math.round(pct * 10) / 10, label, marketAvg };
}

function estimateDaysToSell(action) {
  switch (action) {
    case 'none':            return 21;
    case 'feature':         return 18;
    case 'small_drop':      return 14;
    case 'moderate_drop':   return 14;
    case 'aggressive_drop': return 10;
    case 'wholesale':       return 7;
    default:                return 21;
  }
}

function roundTo95(n) {
  // Round down to nearest $100, then subtract $5 → ends in 95 (e.g. 30137 → 29995).
  if (!Number.isFinite(n) || n <= 0) return n;
  const hundreds = Math.floor(n / 100) * 100;
  return Math.max(0, hundreds - 5);
}

export function analyzePricing(vehicle, marketData = null) {
  const days = daysOnLot(vehicle);
  const bucket = bucketFor(days);
  const price = pickEffectivePrice(vehicle);
  const cost = num(vehicle?.costBasis);

  const marginPct =
    price && cost && cost > 0 ? ((price - cost) / cost) * 100 : null;
  const margin = marginTier(marginPct);

  const marketAvg = num(marketData?.marketAvg);
  const market = marketPosition(price, marketAvg);

  // Start from the bucket's suggested drop, then adjust for margin + market.
  let dropPct = bucket.basePct;
  let action = bucket.action;
  let urgency = bucket.urgency;

  // Margin floor: never recommend a drop that would push margin below 3%.
  if (margin.tier === 'floor') {
    action = 'wholesale';
    urgency = 'critical';
    dropPct = 0;
  } else if (margin.tier === 'minimal' && dropPct > 3) {
    dropPct = 3;
    if (action === 'aggressive_drop') action = 'moderate_drop';
  }

  // Market: nudge harder if overpriced; ease off if underpriced.
  if (market) {
    if (market.label === 'overpriced' && market.pct > 5) {
      dropPct = Math.max(dropPct, Math.min(market.pct, 10));
      if (urgency === 'low') urgency = 'medium';
    } else if (market.label === 'underpriced') {
      // Already below market — featuring usually beats discounting.
      dropPct = 0;
      if (action === 'small_drop' || action === 'feature') action = 'feature';
      if (urgency === 'high') urgency = 'medium';
    }
  }

  let suggestedPrice = null;
  if (price && dropPct > 0) {
    const raw = price * (1 - dropPct / 100);
    suggestedPrice = roundTo95(raw);
    // Don't let the suggested price fall below cost + 3% if cost is known.
    if (cost && suggestedPrice < cost * 1.03) {
      suggestedPrice = roundTo95(cost * 1.03);
      action = 'wholesale';
      urgency = 'critical';
    }
  } else if (action === 'wholesale' && cost) {
    suggestedPrice = roundTo95(cost * 1.05);
  }

  const finalPrice = suggestedPrice ?? price;
  const estimatedGross =
    finalPrice && cost ? Math.round(finalPrice - cost) : null;
  const estimatedDaysToSell = estimateDaysToSell(action);

  const reasoningParts = [];
  reasoningParts.push(
    `Vehicle has been on lot ${days} day${days === 1 ? '' : 's'} (${bucket.label}).`,
  );
  if (marginPct !== null) {
    reasoningParts.push(`Current margin ${marginPct.toFixed(1)}% — ${margin.note}.`);
  } else {
    reasoningParts.push(margin.note + '.');
  }
  if (market) {
    if (market.label === 'overpriced') {
      reasoningParts.push(
        `Market average is $${Math.round(market.marketAvg).toLocaleString()} — ` +
          `you're ${market.pct.toFixed(1)}% above.`,
      );
    } else if (market.label === 'underpriced') {
      reasoningParts.push(
        `Market average is $${Math.round(market.marketAvg).toLocaleString()} — ` +
          `you're ${Math.abs(market.pct).toFixed(1)}% below. Strong value, should move fast.`,
      );
    } else {
      reasoningParts.push(
        `Priced within 5% of market average ($${Math.round(market.marketAvg).toLocaleString()}).`,
      );
    }
  }
  if (suggestedPrice && price && suggestedPrice < price) {
    const realPct = ((price - suggestedPrice) / price) * 100;
    reasoningParts.push(
      `Recommend dropping to $${suggestedPrice.toLocaleString()} (${realPct.toFixed(1)}% reduction) ` +
        `to move within ~${estimatedDaysToSell} days.`,
    );
    if (estimatedGross !== null) {
      reasoningParts.push(`Estimated gross at new price: $${estimatedGross.toLocaleString()}.`);
    }
  } else if (action === 'feature') {
    reasoningParts.push('Hold price, feature in marketing to drive interest.');
  } else if (action === 'wholesale') {
    reasoningParts.push('Margin is too thin to discount further — consider wholesale or auction.');
  } else if (action === 'none') {
    reasoningParts.push('No action needed at this time.');
  }

  return {
    vehicleId: vehicle?.id || null,
    vehicleLabel: vehicleLabel(vehicle),
    daysOnLot: days,
    bucket: bucket.label,
    currentPrice: price,
    costBasis: cost,
    marginPct: marginPct === null ? null : Math.round(marginPct * 10) / 10,
    marginTier: margin.tier,
    marketPosition: market,
    action,
    urgency,
    suggestedPrice,
    suggestedDrop: Math.round(dropPct * 10) / 10,
    estimatedDaysToSell,
    estimatedGross,
    reasoning: reasoningParts.join(' '),
  };
}

function avg(xs) {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function healthScore({ avgDays, avgMargin, atRiskRatio }) {
  // Blend three signals into a 0-100 score.
  // - Faster turn (lower avg days) → better. 0d=100, 60d=0.
  const dayScore = Math.max(0, Math.min(100, 100 - (avgDays / 60) * 100));
  // - Higher margin → better. 0%=0, 25%=100.
  const marginScore = Math.max(0, Math.min(100, (avgMargin / 25) * 100));
  // - Low at-risk ratio → better.
  const riskScore = Math.max(0, Math.min(100, (1 - atRiskRatio) * 100));
  return Math.round(dayScore * 0.4 + marginScore * 0.35 + riskScore * 0.25);
}

export async function generatePricingReport(vehicles, opts = {}) {
  const list = Array.isArray(vehicles) ? vehicles : [];
  const marketLookup = opts.marketLookup || (() => null);

  const analyses = list.map((v) => {
    const md = marketLookup(v);
    const marketData = md ? { marketAvg: md } : null;
    return { vehicle: v, ...analyzePricing(v, marketData) };
  });

  const days = analyses.map((a) => a.daysOnLot);
  const margins = analyses.map((a) => a.marginPct).filter((m) => m !== null);

  const needsAction = analyses
    .filter((a) => a.action !== 'none' && a.urgency !== 'low')
    .map((a) => ({
      vehicleId: a.vehicleId,
      vehicle: a.vehicleLabel,
      daysOnLot: a.daysOnLot,
      currentPrice: a.currentPrice,
      suggestedPrice: a.suggestedPrice,
      action: a.action,
      urgency: a.urgency,
      reasoning: a.reasoning,
    }));

  const performingWell = analyses
    .filter((a) => a.action === 'none' && a.daysOnLot <= 21 && (a.marginPct ?? 0) >= 18)
    .map((a) => ({
      vehicleId: a.vehicleId,
      vehicle: a.vehicleLabel,
      reason:
        a.daysOnLot <= 7
          ? 'Just arrived, strong margin'
          : `On lot ${a.daysOnLot}d, ${a.marginPct?.toFixed(1)}% margin`,
    }));

  const totalAtRisk = analyses.filter(
    (a) => a.urgency === 'high' || a.urgency === 'critical',
  ).length;

  // Estimate margin erosion if no action: each at-risk vehicle loses
  // roughly its base-pct of current price as time progresses.
  const potentialLossIfNoAction = Math.round(
    analyses
      .filter((a) => a.urgency === 'high' || a.urgency === 'critical')
      .reduce((sum, a) => {
        if (!a.currentPrice) return sum;
        const erosionPct = a.urgency === 'critical' ? 0.06 : 0.04;
        return sum + a.currentPrice * erosionPct;
      }, 0),
  );

  const avgDaysOnLot = Math.round(avg(days));
  const avgMargin = margins.length
    ? Math.round(avg(margins) * 10) / 10
    : 0;
  const score = healthScore({
    avgDays: avgDaysOnLot,
    avgMargin,
    atRiskRatio: list.length ? totalAtRisk / list.length : 0,
  });

  const recommendations = [];
  const sixtyPlus = analyses.filter((a) => a.daysOnLot >= 60).length;
  if (sixtyPlus > 0) {
    recommendations.push(
      `${sixtyPlus} vehicle${sixtyPlus === 1 ? '' : 's'} need${sixtyPlus === 1 ? 's' : ''} immediate price action (60+ days)`,
    );
  }
  if (margins.length) {
    const tone = avgMargin >= 18 ? 'healthy' : avgMargin >= 12 ? 'moderate' : 'thin';
    recommendations.push(`Average margin is ${tone} at ${avgMargin}%`);
  }
  if (performingWell.length) {
    const best = analyses
      .filter((a) => a.marginPct !== null)
      .sort((a, b) => (b.marginPct || 0) - (a.marginPct || 0))[0];
    if (best && best.marginPct !== null && best.daysOnLot <= 21) {
      recommendations.push(
        `Consider featuring ${best.vehicleLabel} — best margin vehicle (${best.marginPct.toFixed(1)}%)`,
      );
    }
  }
  if (recommendations.length === 0) {
    recommendations.push('Lot is healthy — no urgent pricing actions required.');
  }

  return {
    totalInventory: list.length,
    avgDaysOnLot,
    avgMargin,
    healthScore: score,
    needsAction,
    performingWell,
    totalAtRisk,
    potentialLossIfNoAction,
    recommendations,
  };
}
