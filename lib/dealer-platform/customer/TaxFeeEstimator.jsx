'use client';
import { useState } from 'react';
import { C, FONT_MONO, FONT_DISPLAY, fmt } from './_internals';

/**
 * TaxFeeEstimator — ZIP-based out-the-door cost estimator.
 *
 * Uses simplified state-level rates by leading digit of ZIP code (FL → 6%,
 * NY → 8.875%, etc.). The richer per-vehicle estimator currently lives
 * inline in VehicleDetailDrawer; this is the standalone reusable form.
 */
const STATE_RATES = {
  '0': { name: 'Northeast', rate: 0.0700 },
  '1': { name: 'NY/NJ',     rate: 0.0888 },
  '2': { name: 'Mid-Atlantic', rate: 0.0600 },
  '3': { name: 'Southeast (FL)', rate: 0.0600 },
  '4': { name: 'Midwest',   rate: 0.0625 },
  '5': { name: 'Midwest',   rate: 0.0625 },
  '6': { name: 'South Central', rate: 0.0625 },
  '7': { name: 'TX/OK',     rate: 0.0625 },
  '8': { name: 'Mountain',  rate: 0.0500 },
  '9': { name: 'West (CA/WA)', rate: 0.0875 },
};

const DEALER_FEES = { docFee: 599, tagTitle: 350, dealerPrep: 299 };

export function TaxFeeEstimator({ price, className = '' }) {
  const [zip, setZip] = useState('');
  const valid = /^\d{5}$/.test(zip);
  const region = valid ? (STATE_RATES[zip[0]] || { name: 'US', rate: 0.0700 }) : null;
  const tax  = region ? Math.round(price * region.rate) : 0;
  const fees = DEALER_FEES.docFee + DEALER_FEES.tagTitle + DEALER_FEES.dealerPrep;
  const otd  = price + tax + fees;

  return (
    <div className={className}>
      <label style={{ display: 'block', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow, marginBottom: 6 }}>
        ZIP CODE FOR OUT-THE-DOOR ESTIMATE
      </label>
      <input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="e.g. 33132" maxLength={5}
        style={{
          background: C.bg2, border: `1px solid ${C.rule2}`, color: C.ink,
          fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 2,
          padding: '8px 12px', width: 140,
        }} />
      {valid && (
        <div className="mt-3 space-y-1.5 text-sm" style={{ color: C.ink }}>
          <Row label="Sale Price" value={fmt(price)} />
          <Row label={`Sales Tax (${region.name} ~${(region.rate * 100).toFixed(2)}%)`} value={fmt(tax)} />
          <Row label="Doc + Tag + Prep" value={fmt(fees)} />
          <div style={{ borderTop: `1px solid ${C.rule2}`, paddingTop: 8, marginTop: 8 }}>
            <Row label="OUT-THE-DOOR" value={
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.gold }}>{fmt(otd)}</span>
            } strong />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: 'var(--font-inter)', color: strong ? C.ink : C.inkDim, fontSize: 12 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', color: C.ink, fontWeight: 600, fontSize: 14 }}>{value}</span>
    </div>
  );
}

export default TaxFeeEstimator;
