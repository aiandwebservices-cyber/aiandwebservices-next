'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard, Car, Plus, Users, FileText, Archive, Megaphone,
  Settings as SettingsIcon, Bell, Search, Edit3, Trash2, Eye, EyeOff,
  ChevronDown, ChevronRight, ChevronUp, Filter, Download, Upload,
  ExternalLink, Calculator, Calendar, MapPin, Globe, Facebook, Instagram,
  Youtube, Check, X, AlertTriangle, AlertCircle, TrendingUp, Hash, Award,
  ShieldCheck, Zap, Save, Star, Tag, Clock, Phone, Mail, MessageSquare,
  DollarSign, BarChart3, Image as ImageIcon, GripVertical, Send, Printer,
  Sparkles, ArrowUpRight, ArrowDownRight, RefreshCw, Share2, Menu,
  MoreHorizontal, FileSpreadsheet, ThumbsUp, Languages, Receipt, Layers,
  PlusCircle, MinusCircle, ChevronLeft, Power, CircleDot, Square, CheckSquare,
  Wrench, Activity, Gauge, Timer, Shield, Flag, Reply,
  TrendingDown, BadgeCheck, Smartphone, Monitor, Sun, Moon, HelpCircle, Bookmark, Camera,
} from 'lucide-react';
import {
  GOLD, GOLD_SOFT, RED_ACCENT,
  MAKES, COLORS, BODY_STYLES, TRANSMISSIONS, DRIVETRAINS, FUEL_TYPES,
  STATUSES, LEAD_SOURCES, LEAD_STATUSES, DEAL_STATUSES, APPT_STATUSES,
  SERVICE_TYPES, SERVICE_RATES, FNI_PRODUCT_CATALOG, TEAM_MEMBERS, POPULAR_MAKES,
  TODAY, isoDaysAgo, isoDays, isoAt,
  storage, fetchWithTimeout, nhtsaDecodeVin, nhtsaGetAllMakes, nhtsaGetModelsForMake,
  fuelEconomyLookup, nhtsaRecalls, espoSaveVehicle,
  fmtMoney, fmtMiles, fmtDate, relTime, calcPayment, dealFinanced, validVin,
  downloadFile, csvEscape, buildCSV, parseCSV, newId,
  Btn, Card, Field, Input, Select, Textarea, IconBtn, StatusBadge, LeadSourceBadge,
  Toggle, VehiclePhoto, StatCard, ConfirmDialog, Skeleton, Paginator, SectionHeader,
} from './_internals';
import { useAdminConfig } from './AdminConfigContext';
import { SEED_FNI_HISTORY } from '@/lib/dealer-platform/data/seed-deals';
import { SEED_APPT_HISTORY } from '@/lib/dealer-platform/data/seed-appointments';
import { ActivityLog } from './ActivityLog';
import { BreadcrumbBar } from './BreadcrumbBar';

/* ─── Advanced Desking constants ─────────────────────────────────── */
const PACK = 500;
const FNI_DEALER_COST_RATIO = 0.38;

const LENDERS = [
  { name: 'Capital One',    color: '#003087', result: { approved: true,  tier: 'Tier 1', apr: 4.9, max: 45000 } },
  { name: 'Ally Financial', color: '#8B1A1A', result: { approved: true,  tier: 'Tier 2', apr: 6.9, max: 38000 } },
  { name: 'Chase Auto',     color: '#117ACA', result: { approved: false } },
  { name: 'Wells Fargo',    color: '#D71E28', result: { approved: true,  tier: 'Tier 2', apr: 5.9, max: 42000 } },
  { name: 'Local CU',       color: '#2D6A4F', result: { approved: true,  tier: 'Tier 1', apr: 4.5, max: 50000 } },
];

const SCENARIO_COLORS = ['#10B981', '#C8970F', '#3B82F6'];

function initScenarios(deal) {
  const listPrice  = deal.listPrice  || 0;
  const tradeValue = deal.trade?.value || 0;
  const tradeACV   = Math.round(tradeValue * 0.91);
  const apr        = deal.apr || 6.9;
  return [
    { label: 'Conservative', salePrice: listPrice,                     tradeAllowance: Math.round(tradeValue * 0.94), tradeACV, apr,                        term: 60 },
    { label: 'Competitive',  salePrice: Math.round(listPrice * 0.964), tradeAllowance: tradeValue,                   tradeACV, apr,                        term: 72 },
    { label: 'Aggressive',   salePrice: Math.round(listPrice * 0.929), tradeAllowance: Math.round(tradeValue * 1.06),tradeACV, apr: Math.max(1, apr - 1),  term: 72 },
  ];
}

function computeScenario(s, deal) {
  const fees    = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
  const fniRev  = FNI_PRODUCT_CATALOG.reduce((sum, p) => sum + (deal.fniProducts?.[p.key] ? p.price : 0), 0);
  const down    = deal.downPayment || 0;
  const vCost   = deal.cost || 0;
  const amountFinanced = Math.max(0, s.salePrice + fees + fniRev - down - s.tradeAllowance);
  const monthly        = calcPayment(amountFinanced, s.apr, s.term);
  const frontGross     = s.salePrice - vCost;
  const backGross      = fniRev;
  const totalGross     = frontGross + backGross;
  const tradeOver      = Math.max(0, s.tradeAllowance - s.tradeACV);
  const netProfit      = totalGross - PACK - tradeOver;
  const commission     = Math.max(0, netProfit * 0.25);
  return { ...s, fees, fniRev, down, amountFinanced, monthly, frontGross, backGross, totalGross, tradeOver, netProfit, commission };
}

const LENDER_OPTIONS = [
  { id: 'capitalOne',  label: 'Capital One Auto Finance', defaultChecked: true  },
  { id: 'ally',        label: 'Ally Financial',           defaultChecked: true  },
  { id: 'chase',       label: 'Chase Auto',               defaultChecked: true  },
  { id: 'wellsFargo',  label: 'Wells Fargo Dealer Services', defaultChecked: false },
  { id: 'bofa',        label: 'Bank of America',          defaultChecked: false },
  { id: 'localCU',     label: 'Local Credit Union',       defaultChecked: true  },
];

/* ─── DealCard — manages its own scenario / lender state ─────────── */
function DealCard({ deal, updateDeal, onMarkSold, openCredit, isOpen, onToggle, flash, dealerSlug }) {
  const [scenarios, setScenarios] = useState(() => initScenarios(deal));
  const [targetGross, setTargetGross]       = useState('');
  const [lenderPlatform, setLenderPlatform] = useState('routeone');
  const [selectedLenders, setSelectedLenders] = useState(
    () => LENDER_OPTIONS.filter(l => l.defaultChecked).map(l => l.label),
  );
  const [lenderResults, setLenderResults]   = useState(null);
  const [lenderLoading, setLenderLoading]   = useState(false);

  const computed = scenarios.map(s => computeScenario(s, deal));
  const maxGrossIdx    = computed.reduce((b, c, i) => c.totalGross > computed[b].totalGross ? i : b, 0);
  const minPaymentIdx  = computed.reduce((b, c, i) => c.monthly   < computed[b].monthly   ? i : b, 0);
  const winnerIdx      = computed.reduce((b, c, i) => c.netProfit > computed[b].netProfit ? i : b, 0);

  const fees    = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
  const fniRev  = FNI_PRODUCT_CATALOG.reduce((s, p) => s + (deal.fniProducts?.[p.key] ? p.price : 0), 0);
  const financed = Math.max(0, dealFinanced(deal) + fniRev);
  const monthly  = calcPayment(financed, deal.apr, deal.termMonths);
  const totalCost = (deal.salePrice || 0) + fees + fniRev;

  // Name Your Gross — reverse-calc against Competitive (B) scenario
  const tgNum = parseFloat(targetGross) || 0;
  let ngSalePrice = null, ngMonthly = null;
  if (tgNum > 0) {
    const sc = computed[1];
    ngSalePrice = Math.round(tgNum + (deal.cost || 0) - sc.fniRev + PACK + sc.tradeOver);
    const ngFinanced = Math.max(0, ngSalePrice + sc.fees + sc.fniRev - sc.down - sc.tradeAllowance);
    ngMonthly = calcPayment(ngFinanced, sc.apr, sc.term);
  }

  const runLenderSubmission = async () => {
    setLenderLoading(true);
    try {
      const res = await fetch(`/api/dealer/${dealerSlug}/integrations/lenders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          platform: lenderPlatform,
          dealId: deal.id,
          customerInfo: { name: deal.customerName, income: deal.monthlyIncome },
          vehicleInfo: { vin: deal.vin, year: deal.year, make: deal.make, model: deal.model, price: deal.salePrice },
          financeTerms: { amount: deal.amountFinanced, term: deal.termMonths, apr: deal.apr },
          selectedLenders,
        }),
      });
      const data = await res.json();
      if (data.ok && data.results) {
        setLenderResults(data.results);
        flash(`Submitted to ${data.submissions} lender${data.submissions !== 1 ? 's' : ''}`);
      } else {
        flash('Lender submission failed');
      }
    } catch {
      flash('Lender submission failed — network error');
    } finally {
      setLenderLoading(false);
    }
  };

  const applyBestRate = () => {
    if (!lenderResults) return;
    const approved = lenderResults.filter(l => l.status === 'approved' && l.apr);
    if (!approved.length) { flash('No approved offers to apply'); return; }
    const best = approved.reduce((a, b) => a.apr < b.apr ? a : b);
    updateDeal(deal.id, { apr: best.apr, lender: best.lender, preApproved: true });
    flash(`Best rate applied: ${best.lender} at ${best.apr}%`);
  };

  const updateScenario = (i, field, value) =>
    setScenarios(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: Number(value) } : s));

  return (
    <Card className="overflow-hidden">
      {/* ── Card header row ── */}
      <button onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 hover:bg-stone-50 transition text-left">
        <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
          <Calculator className="w-4 h-4" style={{ color: '#7A5A0F' }} />
        </div>
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className="font-display font-medium text-base leading-tight">{deal.customerName}</div>
            <div className="text-[11px] text-stone-500 tabular mt-0.5">{deal.phone}</div>
          </div>
          <div>
            <div className="text-[10px] smallcaps text-stone-400">Vehicle</div>
            <div className="text-sm font-medium truncate">{deal.vehicleLabel}</div>
          </div>
          <div>
            <div className="text-[10px] smallcaps text-stone-400">Monthly Payment</div>
            <div className="font-display tabular text-lg font-semibold" style={{ color: GOLD }}>
              {fmtMoney(monthly, 0)}<span className="text-xs text-stone-400 font-normal">/mo</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <StatusBadge status={deal.status} />
            <ChevronDown className={`w-4 h-4 text-stone-400 transition ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-stone-200 bg-stone-50 anim-slide">

          {/* ── PROFIT MATRIX ─────────────────────────────── */}
          <div className="p-6 border-b border-stone-200 bg-white">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-[10px] smallcaps font-semibold text-stone-400 mb-0.5">Advanced Desking</div>
                <h3 className="font-display text-lg font-semibold">Profit Matrix — 3 Scenarios</h3>
              </div>
              {/* Name Your Gross inline */}
              <div className="flex flex-wrap items-center gap-2 bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
                <DollarSign className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-[10px] smallcaps text-stone-500 whitespace-nowrap">Target Gross</span>
                <input type="number" placeholder="4000" value={targetGross}
                  onChange={e => setTargetGross(e.target.value)}
                  className="w-24 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                {ngSalePrice !== null && (
                  <div className="text-[11px] font-medium whitespace-nowrap" style={{ color: GOLD }}>
                    → sell at {fmtMoney(ngSalePrice)} · {fmtMoney(ngMonthly, 0)}/mo
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {computed.map((s, i) => {
                const isHighGross   = i === maxGrossIdx;
                const isLowPayment  = i === minPaymentIdx;
                const isWinner      = i === winnerIdx;
                const col = SCENARIO_COLORS[i];
                return (
                  <div key={s.label} className="border rounded-md overflow-hidden text-sm"
                    style={{ borderColor: isWinner ? col : '#e7e5e4', borderWidth: isWinner ? 2 : 1 }}>
                    {/* header */}
                    <div className="px-3 py-2 flex items-center justify-between gap-1 flex-wrap"
                      style={{ backgroundColor: col + '18', borderBottom: `2px solid ${col}` }}>
                      <span className="font-display font-semibold text-sm">{s.label}</span>
                      <div className="flex gap-1 flex-wrap">
                        {isHighGross  && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white bg-emerald-500">HIGH GROSS</span>}
                        {isLowPayment && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white bg-blue-500">LOW PMT</span>}
                        {isWinner     && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: col }}>★ WINNER</span>}
                      </div>
                    </div>
                    {/* editable inputs */}
                    <div className="p-3 space-y-2">
                      {[
                        ['Sale Price',    'salePrice',      s.salePrice],
                        ['Trade Allow.',  'tradeAllowance', s.tradeAllowance],
                        ['Trade ACV',     'tradeACV',       s.tradeACV],
                        ['APR %',         'apr',            s.apr],
                        ['Term (mo)',     'term',           s.term],
                      ].map(([label, field, val]) => (
                        <div key={field} className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-stone-500 shrink-0">{label}</span>
                          <input type="number" value={val}
                            onChange={e => updateScenario(i, field, e.target.value)}
                            className="w-24 text-right tabular text-xs px-1.5 py-0.5 border border-stone-200 rounded ring-gold" />
                        </div>
                      ))}
                    </div>
                    {/* computed financed + payment */}
                    <div className="bg-stone-50 border-t border-stone-100 p-3 space-y-1">
                      {[['Down Pmt', fmtMoney(s.down)], ['Amt Financed', fmtMoney(s.amountFinanced)]].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-[10px] text-stone-500">
                          <span>{l}</span><span className="tabular">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold" style={{ color: col }}>
                        <span>Monthly</span><span className="tabular">{fmtMoney(s.monthly, 0)}/mo</span>
                      </div>
                    </div>
                    {/* gross breakdown */}
                    <div className="border-t border-stone-100 p-3 space-y-1">
                      {[
                        ['Front Gross',       s.frontGross,    false],
                        ['Back Gross (F&I)',  s.backGross,     false],
                        ['Total Gross',       s.totalGross,    true],
                        ['Pack',              -PACK,           false],
                        ['Trade Over-Allow.', -s.tradeOver,    false],
                        ['Net Profit',        s.netProfit,     true],
                        ['Commission (25%)',  s.commission,    false],
                      ].map(([label, val, bold]) => (
                        <div key={label}
                          className={`flex justify-between ${bold ? 'font-bold text-[11px]' : 'text-[10px] text-stone-500'}`}
                          style={bold ? { color: val > 0 ? col : '#EF4444' } : {}}>
                          <span>{label}</span>
                          <span className="tabular">{val < 0 ? '(' : ''}{fmtMoney(Math.abs(val))}{val < 0 ? ')' : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Deal worksheet + right rail ── */}
          <div className="grid lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Deal Worksheet</h3>
                <Btn size="sm" variant="default" icon={Printer}
                  onClick={() => { window.print(); flash('Print dialog opened'); }}>
                  Print Deal Sheet
                </Btn>
              </div>

              {/* Vehicle pricing */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Vehicle Pricing</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">List Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 text-sm">$</span>
                      <input type="number" value={deal.listPrice}
                        onChange={(e) => updateDeal(deal.id, { listPrice: Number(e.target.value) })}
                        className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between" style={{ color: GOLD }}>
                    <span className="text-sm font-semibold">Negotiated Sale Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <input type="number" value={deal.salePrice}
                        onChange={(e) => updateDeal(deal.id, { salePrice: Number(e.target.value) })}
                        className="w-28 text-right tabular px-2 py-1 border-2 rounded text-sm font-semibold ring-gold"
                        style={{ borderColor: GOLD }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Trade-In</div>
                {deal.trade?.make ? (
                  <>
                    <div className="text-sm font-medium mb-3">
                      {deal.trade.year} {deal.trade.make} {deal.trade.model}
                      <span className="text-stone-400 text-xs ml-2 tabular">{Number(deal.trade.mileage || 0).toLocaleString()} mi</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">Trade Allowance</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-sm">$</span>
                        <input type="number" value={deal.trade.value || 0}
                          onChange={(e) => updateDeal(deal.id, { trade: { ...deal.trade, value: Number(e.target.value) } })}
                          className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-stone-400 italic">No trade-in on this deal</div>
                )}
              </div>

              {/* Dealer fees */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Dealer Fees</div>
                <div className="space-y-2.5">
                  {[['docFee','Documentation Fee'],['tagTitle','Tag, Title & Registration'],['dealerPrep','Dealer Prep']].map(([k, label]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-sm">$</span>
                        <input type="number" value={deal.fees?.[k] || 0}
                          onChange={(e) => updateDeal(deal.id, { fees: { ...deal.fees, [k]: Number(e.target.value) } })}
                          className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs smallcaps text-stone-500">Total Fees</span>
                    <span className="text-sm font-semibold tabular">{fmtMoney(fees)}</span>
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Financing Terms</div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Down Payment">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <Input type="number" value={deal.downPayment}
                        onChange={(e) => updateDeal(deal.id, { downPayment: Number(e.target.value) })} className="pl-7" />
                    </div>
                  </Field>
                  <Field label="Term">
                    <Select value={deal.termMonths}
                      onChange={(e) => updateDeal(deal.id, { termMonths: Number(e.target.value) })}>
                      {[36, 48, 60, 72, 84].map(t => <option key={t} value={t}>{t} months</option>)}
                    </Select>
                  </Field>
                  <Field label="APR">
                    <div className="relative">
                      <Input type="number" step="0.1" value={deal.apr}
                        onChange={(e) => updateDeal(deal.id, { apr: Number(e.target.value) })} className="pr-7" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">%</span>
                    </div>
                  </Field>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {deal.preApproved
                      ? <span className="text-emerald-700 font-semibold">✓ Pre-approved · {deal.lender}</span>
                      : 'Run a soft credit inquiry — no impact to score'}
                  </div>
                  <Btn size="sm" variant="outlineGold" icon={ShieldCheck} onClick={() => openCredit(deal)}>Run Soft Pull</Btn>
                </div>
              </div>

              {/* F&I Products — improved with margin info */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> F&I Products
                  </div>
                  <span className="font-display tabular text-sm font-semibold" style={{ color: GOLD }}>
                    F&I Gross: {fmtMoney(fniRev)} from {FNI_PRODUCT_CATALOG.filter(p => deal.fniProducts?.[p.key]).length} products
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 mb-3">
                  Industry avg: 62% of customers buy at least one F&I product
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {FNI_PRODUCT_CATALOG.map(p => {
                    const selected    = !!(deal.fniProducts?.[p.key]);
                    const dealerCost  = Math.round(p.price * FNI_DEALER_COST_RATIO);
                    const margin      = p.price - dealerCost;
                    return (
                      <button key={p.key} type="button"
                        onClick={() => updateDeal(deal.id, { fniProducts: { ...(deal.fniProducts || {}), [p.key]: !selected } })}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md border text-left transition ${selected ? 'border-2' : 'border-stone-200 hover:border-stone-300'}`}
                        style={selected ? { borderColor: GOLD, backgroundColor: '#FFFCF2' } : {}}>
                        <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                          style={selected ? { backgroundColor: GOLD } : { border: '1.5px solid #d6d2c8' }}>
                          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium">{p.label}</div>
                          <div className="text-[9px] text-stone-400 tabular">
                            Cost {fmtMoney(dealerCost)} · Margin {fmtMoney(margin)}
                          </div>
                        </div>
                        <span className="text-[12px] font-semibold tabular"
                          style={selected ? { color: '#7A5A0F' } : { color: '#a8a29e' }}>
                          {fmtMoney(p.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deal Notes */}
              <Field label="Deal Notes">
                <Textarea value={deal.notes || ''} rows={2}
                  onChange={(e) => updateDeal(deal.id, { notes: e.target.value })}
                  placeholder="Approval tier, customer requests, contingencies..." />
              </Field>

              {/* ── LENDER SUBMISSION ── */}
              <div className="bg-white border border-stone-200 rounded-md p-4">
                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3 flex items-center gap-1.5">
                  <Send className="w-3 h-3" /> Lender Submission
                </div>

                {/* Platform tabs */}
                <div className="flex bg-stone-100 rounded-md p-0.5 mb-3 w-fit">
                  {['routeone', 'dealertrack'].map((p) => (
                    <button key={p} onClick={() => setLenderPlatform(p)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded smallcaps transition ${lenderPlatform === p ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
                      {p === 'routeone' ? 'RouteOne' : 'DealerTrack'}
                    </button>
                  ))}
                </div>

                {/* Lender checklist */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] text-stone-500">Select lenders</div>
                    <div className="flex gap-3 text-[10px]">
                      <button className="text-stone-400 hover:text-stone-600"
                        onClick={() => setSelectedLenders(LENDER_OPTIONS.map(l => l.label))}>
                        Select All
                      </button>
                      <button className="text-stone-400 hover:text-stone-600"
                        onClick={() => setSelectedLenders([])}>
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {LENDER_OPTIONS.map((l) => {
                      const checked = selectedLenders.includes(l.label);
                      return (
                        <button key={l.id} type="button"
                          onClick={() => setSelectedLenders(prev =>
                            checked ? prev.filter(x => x !== l.label) : [...prev, l.label],
                          )}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-[11px] hover:bg-stone-50">
                          <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                            style={checked ? { backgroundColor: GOLD } : { border: '1.5px solid #d6d2c8' }}>
                            {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="truncate text-stone-600">{l.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Results */}
                {lenderResults && (
                  <div className="space-y-1.5 mb-3">
                    {lenderResults.map((l) => {
                      const icon = l.status === 'approved' ? '✅' : l.status === 'declined' ? '❌' : '⏳';
                      const bg   = l.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : l.status === 'declined' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
                      return (
                        <div key={l.lender} className={`flex items-start gap-2 text-[11px] p-2 rounded border ${bg}`}>
                          <span>{icon}</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-stone-700">{l.lender}: </span>
                            {l.status === 'approved' && <span className="text-stone-600">Approved — {l.tier}, {l.apr}% APR, up to {fmtMoney(l.maxAmount)}{l.conditions && l.conditions !== 'None' ? ` · ${l.conditions}` : ''}</span>}
                            {l.status === 'declined' && <span className="text-stone-400">Declined — {l.reason}</span>}
                            {l.status === 'pending' && <span className="text-amber-700">{l.note}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2">
                  <Btn size="sm" variant="outlineGold" icon={Send}
                    onClick={runLenderSubmission}
                    disabled={lenderLoading || selectedLenders.length === 0}
                    className={lenderLoading ? 'opacity-60 cursor-not-allowed' : ''}>
                    {lenderLoading
                      ? `Submitting to ${selectedLenders.length}…`
                      : lenderResults
                        ? 'Resubmit'
                        : `Submit to ${selectedLenders.length} Lender${selectedLenders.length !== 1 ? 's' : ''}`}
                  </Btn>
                  {lenderResults && lenderResults.some(l => l.status === 'approved') && (
                    <Btn size="sm" variant="gold" icon={Check} onClick={applyBestRate}>Apply Best Rate</Btn>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right rail: summary + actions ── */}
            <div className="bg-stone-900 text-white p-6 lg:rounded-bl-lg lg:sticky lg:top-16 lg:self-start">
              <div className="text-[10px] smallcaps font-semibold mb-4" style={{ color: GOLD }}>Deal Summary</div>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between"><span className="text-stone-400">Sale Price</span><span className="tabular">{fmtMoney(deal.salePrice)}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">+ Fees</span><span className="tabular">{fmtMoney(fees)}</span></div>
                {fniRev > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: GOLD }}>+ F&I Products</span>
                    <span className="tabular" style={{ color: GOLD }}>{fmtMoney(fniRev)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone-700 pt-3">
                  <span className="font-medium">Total Cost</span>
                  <span className="font-semibold tabular">{fmtMoney(totalCost)}</span>
                </div>
                <div className="flex justify-between"><span className="text-stone-400">− Trade Allowance</span><span className="tabular">{fmtMoney(deal.trade?.value || 0)}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">− Down Payment</span><span className="tabular">{fmtMoney(deal.downPayment)}</span></div>
                <div className="flex justify-between border-t border-stone-700 pt-3">
                  <span className="font-semibold">Amount Financed</span>
                  <span className="font-display text-base font-semibold tabular" style={{ color: GOLD }}>{fmtMoney(financed)}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-md p-4 mb-5">
                <div className="text-[10px] smallcaps text-stone-400 mb-1">Customer Pays</div>
                <div className="font-display tabular text-4xl font-medium" style={{ color: GOLD }}>
                  {fmtMoney(monthly, 0)}
                </div>
                <div className="text-[11px] text-stone-400 mt-1 tabular">
                  for {deal.termMonths} months @ {deal.apr}% APR
                </div>
                <div className="text-[10px] text-stone-500 mt-2 pt-2 border-t border-white/10 tabular">
                  Total of payments: {fmtMoney(monthly * deal.termMonths)}
                </div>
              </div>

              <Field label="Status" className="mb-3">
                <select value={deal.status}
                  onChange={(e) => updateDeal(deal.id, { status: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 text-white rounded-md text-sm">
                  {DEAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <div className="space-y-2">
                <Btn variant="gold" className="w-full" icon={Send}
                  onClick={() => flash('Deal sheet sent to ' + deal.email)}>
                  Send to Customer
                </Btn>
                <Btn variant="default" className="w-full bg-stone-800 border-stone-700 text-white hover:bg-stone-700" icon={Award}
                  onClick={() => onMarkSold(deal)}>
                  Mark Delivered
                </Btn>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-700 text-[10px] smallcaps text-stone-500">
                Deal #{deal.id.slice(-6).toUpperCase()} · Created {fmtDate(deal.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

export function DealsTab({ deals, setDeals, inventory, onMarkSold, flash }) {
  const cfg = useAdminConfig();
  const dealerSlug = cfg?.dealerSlug || 'demo';

  const [expanded, setExpanded] = useState(deals[0]?.id || null);
  const [filter, setFilter] = useState('active');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [creditDeal, setCreditDeal] = useState(null);
  const [creditForm, setCreditForm] = useState({ ssn: '', dob: '', address: '', income: '' });
  const [creditState, setCreditState] = useState('idle'); // idle | loading | result
  const [creditResult, setCreditResult] = useState(null);

  const runSoftPull = async () => {
    setCreditState('loading');
    try {
      const res = await fetch(`/api/dealer/${dealerSlug}/integrations/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pull',
          type: 'soft',
          customerName: creditDeal?.customerName || 'Customer',
          ssn: creditForm.ssn || '000-00-0000',
          dob: creditForm.dob || '1990-01-01',
          address: creditForm.address,
          monthlyIncome: Number(creditForm.income) || 0,
        }),
      });
      const data = await res.json();
      if (data.ok && data.result) {
        setCreditResult(data.result);
        setCreditState('result');
      } else {
        setCreditState('idle');
        flash('Credit pull failed — check integration settings');
      }
    } catch {
      setCreditState('idle');
      flash('Credit pull failed — network error');
    }
  };
  const applyCreditResult = () => {
    if (creditResult && creditDeal) {
      setDeals(arr => arr.map(d => d.id === creditDeal.id
        ? { ...d, apr: creditResult.estimatedApr ?? creditResult.apr, lender: creditResult.bureau || '700Credit', preApproved: true }
        : d,
      ));
      flash(`Pre-approved at ${creditResult.estimatedApr ?? creditResult.apr}% — APR auto-filled`);
    }
    closeCredit();
  };
  const openCredit = (deal) => {
    setCreditDeal(deal);
    setCreditForm({ ssn: '', dob: '', address: '', income: '' });
    setCreditState('idle');
    setCreditResult(null);
  };
  const closeCredit = () => { setCreditDeal(null); setCreditState('idle'); setCreditResult(null); };

  const fniStats = useMemo(() => {
    const all = SEED_FNI_HISTORY.concat(deals.filter(d => d.fniProducts).map(d => ({
      ...d.fniProducts, dealId: d.id
    })));
    const totals = FNI_PRODUCT_CATALOG.reduce((acc, p) => {
      acc[p.key] = all.filter(d => d[p.key]).length;
      return acc;
    }, {});
    const dealsCount = all.length || 1;
    const monthRevenue = FNI_PRODUCT_CATALOG.reduce((sum, p) => sum + (totals[p.key] || 0) * p.price, 0);
    const avgPerDeal = monthRevenue / dealsCount;
    const penetration = FNI_PRODUCT_CATALOG.map(p => ({
      ...p, count: totals[p.key], rate: (totals[p.key] / dealsCount * 100)
    }));
    return { monthRevenue, avgPerDeal, penetration, dealsCount };
  }, [deals]);

  const filtered = useMemo(() => {
    if (filter === 'active') return deals.filter(d => !['Delivered','Lost'].includes(d.status));
    if (filter === 'won') return deals.filter(d => d.status === 'Delivered');
    if (filter === 'lost') return deals.filter(d => d.status === 'Lost');
    return deals;
  }, [deals, filter]);

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [filter]);

  const updateDeal = (id, patch) => setDeals(arr => arr.map(d => d.id === id ? { ...d, ...patch } : d));

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Deal Builder</h1>
          <p className="text-sm text-stone-500 mt-1">
            Full desking tool — built into your dealership platform.
          </p>
        </div>
        <div className="flex bg-stone-100 rounded-md p-0.5">
          {['active','won','lost','all'].map(k => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-xs font-semibold rounded smallcaps ${filter === k ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              {k === 'active' ? `Active (${deals.filter(d => !['Delivered','Lost'].includes(d.status)).length})` : k}
            </button>
          ))}
        </div>
      </div>

      {/* F&I Revenue Summary */}
      <Card className="overflow-hidden mb-6">
        <div className="grid md:grid-cols-3 gap-0 divide-x divide-stone-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">F&I Revenue This Month</div>
            </div>
            <div className="font-display tabular text-3xl font-medium" style={{ color: GOLD }}>
              {fmtMoney(fniStats.monthRevenue)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1.5">
              from {fniStats.dealsCount} deal{fniStats.dealsCount === 1 ? '' : 's'}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Avg F&I Per Deal</div>
            </div>
            <div className="font-display tabular text-3xl font-medium">{fmtMoney(fniStats.avgPerDeal)}</div>
            <div className="text-[11px] text-stone-500 mt-1.5">industry avg: $1,452</div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Product Penetration</div>
            </div>
            <div className="space-y-1">
              {fniStats.penetration.slice(0, 3).map(p => (
                <div key={p.key} className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-600 flex-1 truncate">{p.label}</span>
                  <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: p.rate + '%', backgroundColor: GOLD }} />
                  </div>
                  <span className="text-[10px] tabular text-stone-500 w-9 text-right">{p.rate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Calculator className="w-10 h-10 mx-auto text-stone-300 mb-3" strokeWidth={1.25} />
          <h3 className="font-display text-lg font-semibold mb-1">No deals here yet</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Customers who use "Build Your Deal" on your website appear here.
            You can also convert any lead into a deal from the Leads tab.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {paged.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              updateDeal={updateDeal}
              onMarkSold={onMarkSold}
              openCredit={openCredit}
              isOpen={expanded === deal.id}
              onToggle={() => setExpanded(expanded === deal.id ? null : deal.id)}
              flash={flash}
              dealerSlug={dealerSlug}
            />
          ))}
          <Card><Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="deal" /></Card>
        </div>
      )}

      {/* Credit Pre-Qualification modal */}
      {creditDeal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-16 anim-fade no-print" onClick={closeCredit}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                <h3 className="font-display text-lg font-semibold">Credit Pre-Qualification</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Soft inquiry — <strong>no impact to credit score</strong>.
              </p>
              {creditState === 'idle' && (
                <>
                  <Field label="Customer">
                    <Input value={creditDeal.customerName || 'Customer'} readOnly className="bg-stone-50" />
                  </Field>
                  <Field label="SSN" className="mt-3">
                    <Input value={creditForm.ssn} maxLength={11}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 9);
                        if (v.length > 5) v = v.slice(0, 3) + '-' + v.slice(3, 5) + '-' + v.slice(5);
                        else if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
                        setCreditForm(f => ({ ...f, ssn: v }));
                      }}
                      placeholder="●●●-●●-●●●●" className="font-mono" />
                  </Field>
                  <Field label="Date of Birth" className="mt-3">
                    <Input type="date" value={creditForm.dob} onChange={(e) => setCreditForm(f => ({ ...f, dob: e.target.value }))} />
                  </Field>
                  <Field label="Address" className="mt-3">
                    <Input value={creditForm.address} onChange={(e) => setCreditForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="123 Main St, Miami, FL 33101" />
                  </Field>
                  <Field label="Monthly Income ($)" className="mt-3">
                    <Input type="number" value={creditForm.income} onChange={(e) => setCreditForm(f => ({ ...f, income: e.target.value }))} placeholder="6500" />
                  </Field>
                </>
              )}
              {creditState === 'loading' && (
                <div className="py-12 text-center">
                  <RefreshCw className="w-10 h-10 mx-auto animate-spin" style={{ color: GOLD }} />
                  <div className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>Pulling credit profile…</div>
                </div>
              )}
              {creditState === 'result' && creditResult && (
                <div className="space-y-3">
                  {creditResult.approved ? (
                    <div className="rounded-md p-4" style={{ backgroundColor: '#D1FAE5', border: '1px solid #10B981' }}>
                      <div className="text-xl font-display font-bold text-emerald-800 mb-0.5">✓ PRE-APPROVED</div>
                      <div className="text-xs text-emerald-700">{creditResult.bureau} · Pull ID: {creditResult.pullId}</div>
                    </div>
                  ) : (
                    <div className="rounded-md p-4 bg-red-50 border border-red-200">
                      <div className="text-xl font-display font-bold text-red-700">✗ Not Approved</div>
                    </div>
                  )}
                  {creditResult.creditScore && (
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-display font-bold tabular"
                        style={{ color: creditResult.creditScore >= 750 ? '#059669' : creditResult.creditScore >= 700 ? '#2563EB' : creditResult.creditScore >= 650 ? '#D97706' : '#DC2626' }}>
                        {creditResult.creditScore}
                      </div>
                      <div>
                        <div className="text-[10px] smallcaps text-stone-500">Credit Score</div>
                        <div className="text-xs font-semibold">{creditResult.tier} — {creditResult.creditScore >= 750 ? 'Excellent' : creditResult.creditScore >= 700 ? 'Good' : creditResult.creditScore >= 650 ? 'Fair' : 'Poor'}</div>
                        <div className="text-[10px] text-stone-400">{creditResult.bureau}</div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>Max Approved</div><div className="font-semibold tabular">${(creditResult.maxAmount || 0).toLocaleString()}</div></div>
                    <div><div className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>Est. APR</div><div className="font-semibold tabular" style={{ color: GOLD }}>{creditResult.estimatedApr}%</div></div>
                  </div>
                  {Array.isArray(creditResult.factors) && creditResult.factors.length > 0 && (
                    <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                      <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Credit Factors</div>
                      <ul className="space-y-1">
                        {creditResult.factors.map((f) => (
                          <li key={f} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                            <span className="text-stone-300 shrink-0">·</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="pt-1">
                    <button disabled
                      className="w-full text-left text-[11px] px-3 py-2 border border-stone-200 rounded-md text-stone-400 cursor-not-allowed flex items-center justify-between">
                      <span>Run Hard Pull</span>
                      <span className="text-[10px] text-stone-300">700Credit Premium — impacts credit score</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              {creditState === 'idle' && (
                <>
                  <Btn variant="ghost" onClick={closeCredit}>Cancel</Btn>
                  <Btn variant="gold" icon={ShieldCheck} onClick={runSoftPull}>Check Rate</Btn>
                </>
              )}
              {creditState === 'loading' && <Btn variant="ghost" disabled>Working…</Btn>}
              {creditState === 'result' && (
                <>
                  <Btn variant="ghost" onClick={closeCredit}>Close</Btn>
                  <Btn variant="gold" icon={Check} onClick={applyCreditResult}>Apply to Deal</Btn>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== SOLD VEHICLES TAB ======================== */

