// Format EspoCRM CVehicle records into a concise context block for Claude.
// Groups by body style for easier model reference. Includes an estimated
// monthly payment computed at 5.9% APR / 60 months / $0 down.

const DEFAULT_APR = 5.9;
const DEFAULT_TERM_MONTHS = 60;

export function estimateMonthlyPayment(price, aprPercent = DEFAULT_APR, months = DEFAULT_TERM_MONTHS) {
  const PV = Number(price);
  if (!Number.isFinite(PV) || PV <= 0) return null;
  const r = aprPercent / 12 / 100;
  if (r === 0) return Math.round(PV / months);
  const denom = 1 - Math.pow(1 + r, -months);
  const payment = (r * PV) / denom;
  return Math.round(payment);
}

function fmtPrice(n) {
  if (n === null || n === undefined || n === '') return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return `$${num.toLocaleString('en-US')}`;
}

function fmtMileage(n) {
  if (n === null || n === undefined || n === '') return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return `${num.toLocaleString('en-US')} mi`;
}

function priceLine(v) {
  const list = fmtPrice(v.listPrice);
  const sale = fmtPrice(v.salePrice);
  if (sale && list && Number(v.salePrice) < Number(v.listPrice)) {
    return `${sale} (was ${list} ON SALE)`;
  }
  return sale || list || 'Call for price';
}

function vehicleLine(v, idx) {
  const name = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ').trim() || 'Vehicle';
  const price = priceLine(v);
  const effectivePrice = Number(v.salePrice ?? v.listPrice ?? 0);
  const monthly = estimateMonthlyPayment(effectivePrice);
  const parts = [
    `${idx + 1}. ${name}`,
    `— ${price}`,
  ];
  const mi = fmtMileage(v.mileage);
  if (mi) parts.push(`— ${mi}`);
  if (v.exteriorColor) parts.push(`— ${v.exteriorColor}`);
  if (v.drivetrain) parts.push(`— ${v.drivetrain}`);
  if (v.status && v.status !== 'Available') parts.push(`— ${v.status}`);
  if (monthly) parts.push(`— Est. $${monthly}/mo`);
  return parts.join(' ');
}

export function formatInventoryForAI(vehicles) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return 'CURRENT INVENTORY: (none available right now — let the customer know we can notify them when matching vehicles arrive)';
  }

  const groups = new Map();
  for (const v of vehicles) {
    const key = (v.bodyStyle || 'Other').trim() || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(v);
  }

  const lines = [`CURRENT INVENTORY (${vehicles.length} vehicles):`, ''];
  let runningIdx = 0;
  for (const [bodyStyle, group] of groups) {
    lines.push(`-- ${bodyStyle.toUpperCase()} (${group.length}) --`);
    for (const v of group) {
      lines.push(vehicleLine(v, runningIdx));
      runningIdx++;
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}
