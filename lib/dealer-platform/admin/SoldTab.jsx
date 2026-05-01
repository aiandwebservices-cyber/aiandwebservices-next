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

/* ─── Commission helpers (Phase 3C) ──────────────────────────────── */
const SP_COLOR_SOLD = {
  'Carlos Rivera':  '#3B82F6',
  'Maria Santos':   '#10B981',
  'James Mitchell': '#F59E0B',
  'Ana Gutierrez':  '#8B5CF6',
};

function frontGrossOf(s) {
  return Math.max(0, Number(s.salePrice || 0) - Number(s.cost || 0) - Number(s.pack || 0));
}

function backGrossOf(s) {
  return Math.max(0, Number(s.fniGross || s.backGross || 0));
}

function computeCommission(sale, rules) {
  const r = rules || {};
  const type = r.type || 'percentage';
  const front = frontGrossOf(sale);
  if (type === 'flat') {
    return Math.max(0, Number(r.flatAmount ?? 500));
  }
  if (type === 'tiered') {
    const t1 = Number(r.tier1Flat ?? 200);
    const t2 = Number(r.tier2Pct ?? 20);
    const t3 = Number(r.tier3Pct ?? 25);
    if (front <= 2000) return t1;
    if (front <= 4000) return Math.round((front * t2) / 100);
    return Math.round((front * t3) / 100);
  }
  // percentage (default)
  const rate = Number(r.rate ?? 25) / 100;
  const min  = Number(r.minimum ?? 200);
  const max  = Number(r.maximum ?? 2000);
  return Math.max(min, Math.min(max, Math.round(front * rate)));
}

export function SoldTab({ sold, setSold, onRestore, flash, settings, setSettings }) {
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewMethod, setReviewMethod] = useState('email');
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedSold, setSelectedSold] = useState(new Set());
  const [expandedSold, setExpandedSold] = useState(null);
  const commissionRules = settings?.commission || {};

  // Per-sale commission rows (memoized once per sold list).
  const commissionRows = useMemo(
    () => sold.map((s) => ({
      sale: s,
      front: frontGrossOf(s),
      back: backGrossOf(s),
      commission: computeCommission(s, commissionRules),
    })),
    [sold, commissionRules],
  );

  // This-month roll-up by salesperson.
  const commissionSummary = useMemo(() => {
    const m = TODAY.getMonth(), y = TODAY.getFullYear();
    const rows = commissionRows.filter(({ sale }) => {
      const d = new Date(sale.saleDate);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const byPerson = new Map();
    for (const r of rows) {
      const name = r.sale.assignedTo || 'No salesperson';
      const cur = byPerson.get(name) || { units: 0, gross: 0, commission: 0 };
      cur.units += 1;
      cur.gross += r.front;
      cur.commission += r.commission;
      byPerson.set(name, cur);
    }
    const list = Array.from(byPerson.entries()).map(([name, v]) => ({
      name, ...v,
      avg: v.units ? Math.round(v.commission / v.units) : 0,
    })).sort((a, b) => b.commission - a.commission);
    const total = list.reduce(
      (acc, r) => ({
        units: acc.units + r.units,
        gross: acc.gross + r.gross,
        commission: acc.commission + r.commission,
      }),
      { units: 0, gross: 0, commission: 0 },
    );
    total.avg = total.units ? Math.round(total.commission / total.units) : 0;
    return { list, total };
  }, [commissionRows]);

  const stats = useMemo(() => {
    const m = TODAY.getMonth(), y = TODAY.getFullYear();
    const thisMonth = sold.filter(s => {
      const d = new Date(s.saleDate);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const totalSold = thisMonth.length;
    const grosses = thisMonth.map(s => s.salePrice - s.cost);
    const avgGross = grosses.length ? grosses.reduce((a, b) => a + b, 0) / grosses.length : 0;
    const avgDays = thisMonth.length ? thisMonth.reduce((a, s) => a + s.daysOnLotAtSale, 0) / thisMonth.length : 0;
    const revenue = thisMonth.reduce((a, s) => a + s.salePrice, 0);
    const profit = thisMonth.reduce((a, s) => a + (s.salePrice - s.cost), 0);
    return { totalSold, avgGross, avgDays, revenue, profit };
  }, [sold]);

  const sendReviewRequest = (saleId) => {
    setSold(arr => arr.map(s => s.id === saleId ? {
      ...s, review: { ...(s.review || {}), status: 'sent', method: reviewMethod, sentAt: new Date(TODAY).toISOString() }
    } : s));
    flash('Review request sent');
    setReviewModal(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sold Vehicles</h1>
        <p className="text-sm text-stone-500 mt-1">Archive of delivered units with profit reporting and review tracking.</p>
      </div>

      {/* Monthly summary */}
      <Card className="p-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(to right, white 0%, white 50%, #FFFCF2 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">
            {new Date(TODAY).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Monthly Performance
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{stats.totalSold}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Sold This Month</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{fmtMoney(stats.avgGross)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Avg Gross Profit</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{Math.round(stats.avgDays)}<span className="text-base text-stone-400 ml-1">d</span></div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Avg Days to Sell</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{fmtMoney(stats.revenue)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Total Revenue</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none" style={{ color: GOLD }}>{fmtMoney(stats.profit)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Total Profit</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Commission Summary — This Month */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Commission Summary — This Month</h2>
        </div>
        <p className="text-sm text-stone-500 mb-4">
          Computed from front gross at the configured commission rules.
        </p>
        {commissionSummary.list.length === 0 ? (
          <div className="text-sm italic text-stone-500 py-4 text-center">
            No sold vehicles this month yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-stone-200">
            <table className="text-sm w-full">
              <thead className="bg-stone-50">
                <tr className="text-[10px] smallcaps font-semibold text-stone-500">
                  <th className="px-4 py-2 text-left">Salesperson</th>
                  <th className="px-4 py-2 text-right">Units Sold</th>
                  <th className="px-4 py-2 text-right">Total Gross</th>
                  <th className="px-4 py-2 text-right">Commission</th>
                  <th className="px-4 py-2 text-right">Avg / Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 tabular">
                {commissionSummary.list.map((r) => (
                  <tr key={r.name}>
                    <td className="px-4 py-2 flex items-center gap-2">
                      {r.name === 'No salesperson' ? (
                        <span className="italic text-stone-400">No salesperson</span>
                      ) : (
                        <>
                          <span className="inline-flex items-center justify-center rounded-full font-semibold text-white"
                            style={{
                              background: SP_COLOR_SOLD[r.name] || '#78716C',
                              width: 20, height: 20, fontSize: 10,
                            }}>
                            {r.name[0]}
                          </span>
                          <span>{r.name}</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{r.units}</td>
                    <td className="px-4 py-2 text-right">{fmtMoney(r.gross)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{fmtMoney(r.commission)}</td>
                    <td className="px-4 py-2 text-right">{fmtMoney(r.avg)}</td>
                  </tr>
                ))}
                <tr className="bg-stone-50 font-semibold">
                  <td className="px-4 py-2">TOTAL</td>
                  <td className="px-4 py-2 text-right">{commissionSummary.total.units}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(commissionSummary.total.gross)}</td>
                  <td className="px-4 py-2 text-right" style={{ color: GOLD }}>{fmtMoney(commissionSummary.total.commission)}</td>
                  <td className="px-4 py-2 text-right">{fmtMoney(commissionSummary.total.avg)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Sold table */}
      <Card className="overflow-hidden">
        {selectedSold.size > 0 && (
          <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
            <span className="text-sm font-semibold mr-2">{selectedSold.size} selected</span>
            <Btn size="sm" variant="outlineGold" icon={Star}
              onClick={() => { selectedSold.forEach(id => { const s = sold.find(x => x.id === id); if (s) setReviewModal(s); }); flash(`Review requests sent to ${selectedSold.size}`); setSelectedSold(new Set()); }}>
              Request Reviews
            </Btn>
            <Btn size="sm" variant="default" icon={Download}
              onClick={() => {
                const headers = ['year','make','model','trim','saleDate','salePrice','cost','buyerName'];
                const rows = sold.filter(s => selectedSold.has(s.id));
                downloadFile(`${slug}-sold.csv`, buildCSV(headers, rows));
                flash(`Exported ${selectedSold.size} sold vehicles`);
                setSelectedSold(new Set());
              }}>Export CSV</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSelectedSold(new Set())}>Clear</Btn>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={() => {
                    if (sold.every(s => selectedSold.has(s.id))) setSelectedSold(new Set());
                    else setSelectedSold(new Set(sold.map(s => s.id)));
                  }} className="flex items-center justify-center">
                    {sold.length > 0 && sold.every(s => selectedSold.has(s.id))
                      ? <CheckSquare className="w-4 h-4 text-blue-600" />
                      : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left">Vehicle</th>
                <th className="px-3 py-2.5 text-left">Sale Date</th>
                <th className="px-3 py-2.5 text-right">Listed</th>
                <th className="px-3 py-2.5 text-right">Final Price</th>
                <th className="px-3 py-2.5 text-right">Cost</th>
                <th className="px-3 py-2.5 text-right">Gross</th>
                <th className="px-3 py-2.5 text-right">Commission</th>
                <th className="px-3 py-2.5 text-right">Days</th>
                <th className="px-3 py-2.5 text-left">Buyer</th>
                <th className="px-3 py-2.5 text-left">Review</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sold.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-16 px-4">
                  <Archive className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No sold vehicles</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Vehicles you mark as sold from inventory will appear here with full sale history.</div>
                </td></tr>
              ) : (pageSize === Infinity ? sold : sold.slice((page - 1) * pageSize, page * pageSize)).map(s => {
                const gross = s.salePrice - s.cost;
                const grossPct = (gross / s.salePrice) * 100;
                const r = s.review || { status: 'not-sent' };
                const front = frontGrossOf(s);
                const back = backGrossOf(s);
                const commission = computeCommission(s, commissionRules);
                const isOpen = expandedSold === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <tr className={`hover:bg-stone-50 cursor-pointer ${selectedSold.has(s.id) ? 'bg-amber-50/50' : ''} ${isOpen ? 'bg-stone-50' : ''}`}
                      onClick={() => setExpandedSold(isOpen ? null : s.id)}>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { const n = new Set(selectedSold); n.has(s.id) ? n.delete(s.id) : n.add(s.id); setSelectedSold(n); }}
                          className="flex items-center justify-center">
                          {selectedSold.has(s.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{s.year} {s.make} {s.model}</div>
                        <div className="text-[11px] text-stone-500">{s.trim}</div>
                      </td>
                      <td className="px-3 py-3 text-stone-600 tabular">{fmtDate(s.saleDate)}</td>
                      <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(s.listedPrice)}</td>
                      <td className="px-3 py-3 text-right tabular font-semibold">{fmtMoney(s.salePrice)}</td>
                      <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(s.cost)}</td>
                      <td className="px-3 py-3 text-right tabular">
                        <div className="font-semibold" style={{ color: gross > 0 ? '#2F7A4A' : '#A12B2B' }}>{fmtMoney(gross)}</div>
                        <div className="text-[10px] text-stone-400">{grossPct.toFixed(1)}%</div>
                      </td>
                      <td className="px-3 py-3 text-right tabular">
                        <div className="font-semibold" style={{ color: GOLD }}>{fmtMoney(commission)}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {s.assignedTo || <span className="italic">No salesperson</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular">{s.daysOnLotAtSale}d</td>
                      <td className="px-3 py-3 text-stone-700">{s.buyerName}</td>
                      <td className="px-3 py-3">
                        {r.status === 'received' ? (
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} className="w-3 h-3"
                                fill={n <= (r.stars || 0) ? GOLD : 'transparent'}
                                stroke={n <= (r.stars || 0) ? GOLD : '#d6d2c8'} strokeWidth={1.5} />
                            ))}
                          </div>
                        ) : r.status === 'sent' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">Not sent</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {r.status === 'not-sent' && (
                            <Btn size="sm" variant="outlineGold" icon={Star}
                              onClick={() => setReviewModal(s)}>
                              Request Review
                            </Btn>
                          )}
                          <Btn size="sm" variant="ghost" icon={RefreshCw} onClick={() => setConfirmRestore(s)}>
                            Restore
                          </Btn>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={12} className="bg-stone-50 px-6 py-4 anim-slide">
                          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                            <div className="bg-white border border-stone-200 rounded-md p-4 text-sm">
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
                                <DollarSign className="w-3 h-3" /> Commission Breakdown
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex justify-between"><span className="text-stone-500">Front Gross</span><span className="tabular">{fmtMoney(front)}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Back Gross (F&I)</span><span className="tabular">{fmtMoney(back)}</span></div>
                                <div className="flex justify-between border-t border-stone-100 pt-1.5"><span className="text-stone-500">Total Gross</span><span className="tabular font-semibold">{fmtMoney(front + back)}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Commission Rate</span><span className="tabular">{commissionRules.type === 'flat' ? 'Flat' : commissionRules.type === 'tiered' ? 'Tiered' : `${Number(commissionRules.rate ?? 25)}%`}</span></div>
                                <div className="flex justify-between border-t border-stone-100 pt-1.5"><span className="text-stone-500">Commission</span><span className="tabular font-semibold" style={{ color: GOLD }}>{fmtMoney(commission)}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Paid to</span><span className="font-medium">{s.assignedTo || <span className="italic text-stone-400">No salesperson</span>}</span></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <Paginator total={sold.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="sold vehicle" />
      </Card>

      {/* Review request modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 flex items-center justify-center p-4 anim-slide">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
                <Star className="w-4 h-4" style={{ color: '#7A5A0F' }} fill={GOLD} />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium leading-none">Request Google Review</h3>
                <p className="text-xs text-stone-500 mt-1">Send to {reviewModal.buyerName}</p>
              </div>
            </div>
            <div className="mb-4 p-3 bg-stone-50 rounded-md">
              <div className="text-sm">{reviewModal.year} {reviewModal.make} {reviewModal.model} {reviewModal.trim}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Sold {fmtDate(reviewModal.saleDate)} for {fmtMoney(reviewModal.salePrice)}</div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Send via</div>
              <div className="grid grid-cols-3 gap-2">
                {['email','sms','both'].map(m => (
                  <button key={m} onClick={() => setReviewMethod(m)}
                    className={`px-3 py-2.5 border-2 rounded-md text-sm font-medium transition ${reviewMethod === m ? '' : 'border-stone-200 hover:border-stone-300'}`}
                    style={reviewMethod === m ? { borderColor: GOLD, backgroundColor: '#FFFCF2' } : {}}>
                    {m === 'email' ? 'Email' : m === 'sms' ? 'SMS' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mb-5 leading-relaxed">
              <Sparkles className="w-3 h-3 inline mr-1" style={{ color: GOLD }} />
              Automated review requests boost your Google rating — included with all Primo plans.
            </p>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setReviewModal(null)}>Cancel</Btn>
              <Btn variant="gold" icon={Send} onClick={() => sendReviewRequest(reviewModal.id)}>Send Request</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmRestore}
        title={confirmRestore ? `Restore ${confirmRestore.year} ${confirmRestore.make} ${confirmRestore.model}?` : ''}
        message="This moves the vehicle back to active inventory. The original sale record will be removed."
        confirmLabel="Restore"
        confirmColor="dark"
        onConfirm={() => { onRestore(confirmRestore.id); setConfirmRestore(null); }}
        onCancel={() => setConfirmRestore(null)} />
    </div>
  );
}

/* ====================== MARKETING TAB ============================ */

