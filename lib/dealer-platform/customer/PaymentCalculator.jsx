'use client';
import { useState } from 'react';
import { C, FONT_DISPLAY, FONT_MONO, monthlyPayment, fmt } from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

/**
 * PaymentCalculator — interactive monthly payment widget.
 *
 * Uses the shared `monthlyPayment` formula from _internals (P = r·PV /
 * (1 − (1+r)^−n)) with credit-tier APRs from `config.creditTiers`.
 *
 * The richer per-vehicle calculator with sliders is currently inline in
 * VehicleDetailDrawer.jsx; this file is the lightweight version that any
 * other section can drop in (e.g., a "build your monthly" section on the
 * homepage).
 */
export function PaymentCalculator({
  price = 35000,
  defaultDownPct = 10,
  defaultTermMonths = 60,
  defaultTier = 'Excellent',
  className = '',
}) {
  const config = useCustomerConfig();
  const tiers = config.creditTiers || { Excellent: 3.9, Good: 5.9, Fair: 8.9, Rebuilding: 12.9 };
  const [tier, setTier] = useState(defaultTier);
  const [downPct, setDownPct] = useState(defaultDownPct);
  const [term, setTerm] = useState(defaultTermMonths);
  const apr = tiers[tier] ?? 6.9;
  const pmt = monthlyPayment(price, downPct, term, apr);

  return (
    <div className={`p-4 rounded-md ${className}`} style={{ background: C.panel, border: `1px solid ${C.rule}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.inkLow }}>EST. MO.</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: C.gold, lineHeight: 1, marginBottom: 12 }}>
        {fmt(pmt)}<span style={{ fontSize: 14, color: C.inkLow, marginLeft: 4 }}>/mo</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: C.ink }}>
        <label>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginBottom: 4 }}>DOWN %</div>
          <input type="range" min="0" max="50" step="5" value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full" />
          <div className="text-center tabular">{downPct}%</div>
        </label>
        <label>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginBottom: 4 }}>TERM</div>
          <select value={term} onChange={(e) => setTerm(Number(e.target.value))}
            style={{ background: C.bg, border: `1px solid ${C.rule2}`, color: C.ink, fontFamily: FONT_MONO, fontSize: 12 }}
            className="w-full px-2 py-1 rounded">
            {[36, 48, 60, 72, 84].map(t => <option key={t} value={t}>{t}mo</option>)}
          </select>
        </label>
        <label>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.inkLow, marginBottom: 4 }}>CREDIT</div>
          <select value={tier} onChange={(e) => setTier(e.target.value)}
            style={{ background: C.bg, border: `1px solid ${C.rule2}`, color: C.ink, fontFamily: FONT_MONO, fontSize: 12 }}
            className="w-full px-2 py-1 rounded">
            {Object.keys(tiers).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.inkLow, marginTop: 8 }}>
        {fmt(price)} · {term}mo · {apr}% APR · {fmt(price * downPct / 100)} down
      </div>
    </div>
  );
}

export default PaymentCalculator;
