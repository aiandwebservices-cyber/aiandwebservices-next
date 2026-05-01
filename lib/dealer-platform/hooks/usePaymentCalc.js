/**
 * Auto-loan monthly payment formula:
 *   M = P · r / (1 − (1 + r)^−n)
 *   where P = principal (price − down), r = monthly interest rate, n = months
 *
 * Pure functions — no React state. Importable from any component.
 */

/**
 * Calculate the monthly payment for a loan.
 *
 * @param {number} price          Vehicle price in dollars
 * @param {number} downPct        Down payment percentage (e.g. 10 for 10%)
 * @param {number} termMonths     Loan term in months
 * @param {number} aprPct         APR as a percentage (e.g. 6.9 for 6.9%)
 * @returns {number}              Monthly payment in dollars
 */
export function monthlyPayment(price, downPct = 10, termMonths = 60, aprPct = 6.9) {
  const principal = price * (1 - downPct / 100);
  const r = aprPct / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (r * principal) / (1 - Math.pow(1 + r, -termMonths));
}

/**
 * Format a number as a US dollar amount with thousands separators.
 */
export function fmtDollars(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

/**
 * Format a mileage number with thousands separators.
 */
export function fmtMiles(n) {
  return n.toLocaleString('en-US');
}

/**
 * usePaymentCalc — convenience hook for building payment widgets.
 *
 * Returns a single function `calc({ price, downPct, term, apr })` so a
 * component can recompute on-the-fly as the user adjusts sliders.
 *
 * Note: this is just a thin wrapper around monthlyPayment for now — kept
 * as a hook so future versions can pull `creditTiers` from config context.
 */
export function usePaymentCalc(creditTiers) {
  return ({ price, downPct = 10, term = 60, apr, tier }) => {
    const effectiveApr = apr ?? (tier && creditTiers?.[tier]) ?? 6.9;
    return {
      monthly: monthlyPayment(price, downPct, term, effectiveApr),
      apr: effectiveApr,
      principal: price * (1 - downPct / 100),
    };
  };
}
