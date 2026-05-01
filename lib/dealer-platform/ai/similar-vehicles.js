// Score and rank "similar" vehicles for the day-3 follow-up touch.
// Pure function — no I/O. Caller fetches inventory and target vehicle.

const PRICE_TOLERANCE = 0.20;
const YEAR_TOLERANCE = 3;

function priceOf(v) {
  const p = Number(v?.salePrice ?? v?.listPrice ?? 0);
  return Number.isFinite(p) && p > 0 ? p : null;
}

function yearOf(v) {
  const y = Number(v?.year);
  return Number.isFinite(y) && y > 1900 ? y : null;
}

function sameBodyStyle(a, b) {
  const ax = (a?.bodyStyle || '').trim().toLowerCase();
  const bx = (b?.bodyStyle || '').trim().toLowerCase();
  if (!ax || !bx) return false;
  return ax === bx;
}

function priceSimilarity(targetPrice, candidatePrice) {
  if (targetPrice === null || candidatePrice === null) return 0;
  const diff = Math.abs(candidatePrice - targetPrice) / targetPrice;
  if (diff > PRICE_TOLERANCE) return 0;
  return 1 - diff / PRICE_TOLERANCE;
}

function yearSimilarity(targetYear, candidateYear) {
  if (targetYear === null || candidateYear === null) return 0;
  const diff = Math.abs(candidateYear - targetYear);
  if (diff > YEAR_TOLERANCE) return 0;
  return 1 - diff / YEAR_TOLERANCE;
}

function makeMatch(a, b) {
  const ax = (a?.make || '').trim().toLowerCase();
  const bx = (b?.make || '').trim().toLowerCase();
  return !!ax && ax === bx ? 1 : 0;
}

function scoreVehicle(target, candidate) {
  const bodyOk = sameBodyStyle(target, candidate);
  if (!bodyOk) return 0;

  const tPrice = priceOf(target);
  const cPrice = priceOf(candidate);
  const priceScore = priceSimilarity(tPrice, cPrice);
  if (tPrice !== null && cPrice !== null && priceScore === 0) return 0;

  const yearScore = yearSimilarity(yearOf(target), yearOf(candidate));
  const makeScore = makeMatch(target, candidate);

  return 0.5 * priceScore + 0.3 * yearScore + 0.2 * makeScore + 0.1;
}

export function findSimilarVehicles(targetVehicle, allVehicles, limit = 3) {
  if (!targetVehicle || !Array.isArray(allVehicles)) return [];

  const targetId = targetVehicle.id;
  const scored = [];
  for (const v of allVehicles) {
    if (!v || v.id === targetId) continue;
    const score = scoreVehicle(targetVehicle, v);
    if (score <= 0) continue;
    scored.push({
      id: v.id,
      year: v.year ?? null,
      make: v.make ?? null,
      model: v.model ?? null,
      trim: v.trim ?? null,
      bodyStyle: v.bodyStyle ?? null,
      price: priceOf(v),
      mileage: v.mileage ?? null,
      similarity: Math.round(score * 100) / 100,
    });
  }
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, Math.max(0, limit));
}
