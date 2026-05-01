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

export function DashboardTab({ inventory, leads, sold, settings, setSettings, updateVehicle,
  reservations, onConfirmReservation, onExtendReservation, onReleaseReservation,
  reservationCount,
  onAdd, onEdit, soldThisMonth, featuredCount, onSaleCount, unreadLeads, flash, onOpenLeads,
  activity = [], onJump, taskStats = { overdue: 0, dueToday: 0, open: 0 } }) {
  const [activityExpanded, setActivityExpanded] = useState(false);

  const websiteViews = useMemo(() => 14728 + inventory.reduce((s, v) => s + (v.views || 0), 0), [inventory]);

  const aging = useMemo(() => {
    return inventory
      .filter(v => v.status !== 'Sold' && v.daysOnLot >= 30)
      .sort((a, b) => b.daysOnLot - a.daysOnLot);
  }, [inventory]);

  const mostViewed = useMemo(() =>
    [...inventory].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [inventory]);

  const recentLeads = useMemo(() =>
    [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [leads]);

  const tier = (days) => {
    if (days >= 60) return { color: '#A12B2B', bg: '#FBE6E6', label: 'ACTION NEEDED' };
    if (days >= 45) return { color: '#9C4F1A', bg: '#FCEBDB', label: 'AGING' };
    if (days >= 30) return { color: '#8A6912', bg: '#FBF1D6', label: 'WATCH' };
    return null;
  };

  const dropPrice = (v, pct) => {
    const newPrice = Math.round(v.listPrice * (1 - pct / 100) / 5) * 5;
    updateVehicle(v.id, { listPrice: newPrice, status: 'Price Drop' });
    flash(`Price dropped on ${v.year} ${v.make} ${v.model}`);
  };
  const putOnSale = (v) => {
    const sale = Math.round(v.listPrice * 0.93 / 5) * 5;
    updateVehicle(v.id, { salePrice: sale, status: 'On Sale' });
    flash(`${v.year} ${v.make} ${v.model} put on sale`);
  };
  const featureIt = (v) => {
    updateVehicle(v.id, { status: 'Featured' });
    flash(`${v.year} ${v.make} ${v.model} featured`);
  };
  const exportToFB = (v) => {
    flash(`Export queued: ${v.year} ${v.make} ${v.model} → Facebook Marketplace`);
  };

  const ruleAffected = {
    rule30: inventory.filter(v => v.daysOnLot >= 30 && v.daysOnLot < 45).length,
    rule45: inventory.filter(v => v.daysOnLot >= 45 && v.daysOnLot < 60).length,
    rule60: inventory.filter(v => v.daysOnLot >= 60).length
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Hero */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[10px] font-semibold smallcaps text-stone-500 mb-1.5">
            {new Date(TODAY).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 leading-tight">
            Welcome back, <em className="not-italic" style={{ color: GOLD }}>{(settings.dealerName || config.dealerName || 'Dealer').split(' ')[0]}</em>.
          </h1>
          <p className="text-stone-500 mt-2 text-sm">
            {unreadLeads > 0
              ? `You have ${unreadLeads} new lead${unreadLeads === 1 ? '' : 's'} and ${aging.filter(v => v.daysOnLot >= 60).length} vehicle${aging.filter(v => v.daysOnLot >= 60).length === 1 ? '' : 's'} that need attention.`
              : 'Your lot is in good shape today.'}
          </p>
        </div>
        <Btn variant="gold" size="lg" icon={Plus} onClick={onAdd}>Add New Vehicle</Btn>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 mb-6">
        <StatCard label="Total Vehicles" value={inventory.length} icon={Car} />
        <StatCard label="Featured" value={featuredCount} icon={Star} accent={GOLD} />
        <StatCard label="On Sale" value={onSaleCount} icon={Tag} accent={RED_ACCENT} />
        <StatCard label="Sold This Month" value={soldThisMonth} icon={Award} accent="#2F7A4A" />
        <StatCard label="Active Leads"
          value={<span>{unreadLeads}<span className="text-stone-400 text-xl"> / {leads.length}</span></span>}
          icon={Users} accent={unreadLeads ? RED_ACCENT : '#a8a39a'}
          sub={unreadLeads ? `${unreadLeads} unread` : 'all read'} />
        <StatCard label="Reservations" value={reservationCount}
          icon={Timer} accent={reservationCount ? GOLD : '#a8a39a'}
          sub={reservationCount ? 'on 48-hr hold' : 'none active'} />
      </div>

      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <button onClick={() => onJump && onJump('tasks')}
          className={`text-left rounded-lg p-4 relative transition lg:col-span-2 ${taskStats.overdue > 0 ? 'border-2' : 'border'}`}
          style={{ backgroundColor: taskStats.overdue > 0 ? '#FEF2F2' : 'var(--bg-card)', borderColor: taskStats.overdue > 0 ? '#DC2626' : 'var(--border)' }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-semibold smallcaps" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-muted)' }}>
              {taskStats.overdue > 0 ? '⚠ Overdue Tasks' : 'Overdue Tasks'}
            </span>
            <AlertCircle className="w-4 h-4" style={{ color: taskStats.overdue > 0 ? '#DC2626' : '#a8a39a' }} strokeWidth={1.75} />
          </div>
          <div className="font-display text-3xl font-medium tracking-tight tabular leading-none" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-primary)' }}>
            {taskStats.overdue}
          </div>
          <div className="text-[11px] mt-2" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-muted)' }}>
            {taskStats.overdue > 0 ? 'Action needed — review now' : 'You\'re all caught up'}
          </div>
        </button>
        <button onClick={() => onJump && onJump('tasks')}
          className="text-left rounded-lg p-4 relative border transition lg:col-span-2 hover:bg-stone-50"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>Tasks Due Today</span>
            <CheckSquare className="w-4 h-4" style={{ color: taskStats.dueToday > 0 ? GOLD : '#a8a39a' }} strokeWidth={1.75} />
          </div>
          <div className="font-display text-3xl font-medium tracking-tight tabular leading-none">{taskStats.dueToday}</div>
          <div className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{taskStats.open} open total</div>
        </button>
        <StatCard label="Website Views" value={websiteViews.toLocaleString()} icon={Eye} sub="last 30 days" />
        <StatCard label="Avg Days to Sell" value="22 days" icon={Clock} sub="industry avg: 38" />
      </div>
      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
        <StatCard label="Lead → Sale Rate" value="14.2%" icon={TrendingUp} accent="#2F7A4A" sub="↑ 2.4% MoM" />
        <StatCard label="Avg Gross Profit" value="$4,475" icon={DollarSign} accent={GOLD} />
      </div>

      {/* MARKET PRICING INTELLIGENCE */}
      <Card className="overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"
          style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.06), transparent)' }}>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-stone-700" />
            <h3 className="font-display text-lg font-semibold tracking-tight">Market Pricing Intelligence</h3>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold smallcaps"
              style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Live Data</span>
          </div>
          <div className="flex items-center gap-3">
            {(() => {
              const above = inventory.filter(v => MARKET_PRICES[v.id] && (v.salePrice || v.listPrice) > MARKET_PRICES[v.id]).length;
              const score = Math.max(0, Math.min(100, 100 - above * 4));
              return (
                <>
                  <div className="text-right">
                    <div className="text-[9px] smallcaps text-stone-500">Competitiveness</div>
                    <div className="font-display tabular text-lg font-semibold" style={{ color: score >= 80 ? '#2F7A4A' : score >= 60 ? GOLD : RED_ACCENT }}>
                      {score}<span className="text-xs text-stone-400">/100</span>
                    </div>
                  </div>
                  {above > 0 && (
                    <span className="text-[10px] font-semibold smallcaps px-2 py-1 rounded-full" style={{ backgroundColor: '#FBE6E6', color: '#A12B2B' }}>
                      {above} above market
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-5 py-3 text-left">Vehicle</th>
                <th className="px-3 py-3 text-right">Your Price</th>
                <th className="px-3 py-3 text-right">Market Avg</th>
                <th className="px-3 py-3 text-right">Variance</th>
                <th className="px-5 py-3 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventory.filter(v => MARKET_PRICES[v.id]).map(v => {
                const yours = v.salePrice || v.listPrice;
                const mkt = MARKET_PRICES[v.id];
                const diff = yours - mkt;
                const pct = (diff / mkt) * 100;
                const above = pct > 0;
                return (
                  <tr key={v.id} className="hover:bg-stone-50 transition">
                    <td className="px-5 py-3">
                      <button onClick={() => onEdit(v.id)} className="font-medium text-sm hover:underline text-left">
                        {v.year} {v.make} {v.model}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-right tabular font-semibold">{fmtMoney(yours)}</td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(mkt)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular"
                        style={above ? { backgroundColor: '#FBE6E6', color: '#A12B2B' } : { backgroundColor: '#E8F2EC', color: '#256B40' }}>
                        {above ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(pct).toFixed(1)}% {above ? 'above' : 'below'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px]">
                      {above && pct > 3 ? (
                        <span className="text-stone-700">Consider price drop — currently {Math.abs(pct).toFixed(1)}% over market</span>
                      ) : above ? (
                        <span className="text-stone-500">Slightly above — monitor</span>
                      ) : pct < -3 ? (
                        <span className="text-stone-700" style={{ color: '#256B40' }}>Strong value — consider featuring</span>
                      ) : (
                        <span className="text-stone-500">Competitively priced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          Market data updates daily from Cars.com, AutoTrader & CarGurus aggregates. Powered by <strong className="text-stone-700">AIandWEBservices</strong>.
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — aging + autopilot (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aging Inventory */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h3 className="font-display text-lg font-semibold tracking-tight">Aging Inventory Alerts</h3>
                <span className="text-xs text-stone-500">{aging.length} vehicle{aging.length === 1 ? '' : 's'}</span>
              </div>
              <span className="text-[10px] smallcaps text-stone-400">30+ days on lot</span>
            </div>
            {aging.length === 0 ? (
              <div className="p-8 text-center text-sm text-stone-500">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-stone-300" />
                Nothing aging — your lot is moving.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {aging.map(v => {
                  const t = tier(v.daysOnLot);
                  return (
                    <div key={v.id} className="px-5 py-4 flex items-center gap-4 hover:bg-stone-50 transition">
                      <VehiclePhoto vehicle={v} size="sm" />
                      <div className="flex-1 min-w-0">
                        <button onClick={() => onEdit(v.id)} className="font-medium text-sm text-stone-900 hover:underline text-left">
                          {v.year} {v.make} {v.model} <span className="text-stone-400 font-normal">— {v.trim}</span>
                        </button>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 tabular">
                          <span className="font-medium text-stone-700">{fmtMoney(v.salePrice || v.listPrice)}</span>
                          <span>·</span>
                          <span>{fmtMiles(v.mileage)}</span>
                          <span>·</span>
                          <span>Stock {v.stockNumber}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: t.color }}>
                          {v.daysOnLot}<span className="text-xs ml-0.5">d</span>
                        </div>
                        <div className="text-[10px] font-bold smallcaps mt-1" style={{ color: t.color }}>{t.label}</div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <div className="flex gap-1.5">
                          <Btn size="sm" variant="default" onClick={() => dropPrice(v, 5)}>−5%</Btn>
                          <Btn size="sm" variant="outlineGold" onClick={() => putOnSale(v)} icon={Tag}>Sale</Btn>
                        </div>
                        <div className="flex gap-1.5">
                          <Btn size="sm" variant="ghost" onClick={() => featureIt(v)} icon={Star}>Feature</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => exportToFB(v)} icon={Share2}>FB</Btn>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Price Autopilot */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-stone-600" strokeWidth={2} />
                <h3 className="font-display text-lg font-semibold tracking-tight">Price Autopilot Rules</h3>
              </div>
              <span className="text-[10px] smallcaps font-semibold text-stone-500">AI-POWERED</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'autoDrop3At30', label: 'Auto-drop 3% at 30 days', count: ruleAffected.rule30, desc: 'Gentle nudge for vehicles starting to age' },
                { key: 'autoDrop5At45', label: 'Auto-drop 5% at 45 days', count: ruleAffected.rule45, desc: 'Stronger reduction to drive interest' },
                { key: 'autoSaleAt60',  label: 'Auto-mark On Sale at 60 days', count: ruleAffected.rule60, desc: 'Apply 7% sale discount and add red banner' }
              ].map(rule => (
                <div key={rule.key} className="flex items-center gap-4 p-3 rounded-md hover:bg-stone-50 transition">
                  <Toggle checked={!!settings.pricing[rule.key]}
                    onChange={(v) => setSettings(s => ({ ...s, pricing: { ...s.pricing, [rule.key]: v } }))} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-900">{rule.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{rule.desc}</div>
                  </div>
                  <div className="text-right shrink-0 px-3">
                    <div className="font-display tabular text-xl font-medium" style={{ color: rule.count > 0 ? GOLD : '#a8a39a' }}>
                      {rule.count}
                    </div>
                    <div className="text-[10px] smallcaps text-stone-500">vehicle{rule.count === 1 ? '' : 's'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Most Viewed */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-stone-700" />
                <h3 className="font-display text-lg font-semibold tracking-tight">Most Viewed Vehicles</h3>
              </div>
              <span className="text-[10px] smallcaps text-stone-400">last 30 days</span>
            </div>
            <div className="divide-y divide-stone-100">
              {mostViewed.map((v, i) => {
                const max = mostViewed[0]?.views || 1;
                const pct = ((v.views || 0) / max) * 100;
                return (
                  <div key={v.id} className="px-5 py-3 flex items-center gap-4 hover:bg-stone-50">
                    <span className="font-display tabular text-sm w-5 text-stone-400">{i + 1}</span>
                    <VehiclePhoto vehicle={v} size="xs" />
                    <button onClick={() => onEdit(v.id)} className="flex-1 min-w-0 text-left text-sm font-medium hover:underline">
                      {v.year} {v.make} {v.model}
                    </button>
                    <div className="hidden md:block w-32">
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: pct + '%', backgroundColor: GOLD }} />
                      </div>
                    </div>
                    <div className="font-display tabular text-sm font-medium w-16 text-right">
                      {(v.views || 0).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT — recent leads (1/3) */}
        <div className="space-y-6">
          {/* Active Reservations */}
          {reservations && reservations.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Timer className="w-4 h-4 text-stone-600" />
                  <h3 className="font-display text-lg font-semibold tracking-tight">Active Reservations</h3>
                </div>
                <span className="text-[10px] smallcaps font-semibold text-stone-500">48-HR HOLDS</span>
              </div>
              <div className="divide-y divide-stone-100">
                {reservations.map(r => {
                  const veh = inventory.find(v => v.id === r.vehicleId);
                  const remaining = new Date(r.expiresAt).getTime() - Date.now();
                  const totalHold = 48 * 3600 * 1000;
                  const elapsed = totalHold - remaining;
                  const pct = Math.max(0, Math.min(100, (elapsed / totalHold) * 100));
                  const hours = Math.floor(remaining / 3600000);
                  const mins = Math.floor((remaining % 3600000) / 60000);
                  const urgent = hours < 12;
                  return (
                    <div key={r.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{veh ? `${veh.year} ${veh.make} ${veh.model}` : 'Vehicle removed'}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{r.customerName} · {r.phone}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display tabular text-base font-semibold" style={{ color: urgent ? RED_ACCENT : GOLD }}>
                            {hours}h {mins}m
                          </div>
                          <div className="text-[9px] smallcaps text-stone-400">remaining</div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: pct + '%', backgroundColor: urgent ? RED_ACCENT : GOLD }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-3">
                        <DollarSign className="w-3 h-3" />
                        <span className="tabular">{fmtMoney(r.depositAmount)}</span>
                        <span>deposit · reserved {relTime(r.reservedAt)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <Btn size="sm" variant="gold" onClick={() => onConfirmReservation(r.id)}>Confirm</Btn>
                        <Btn size="sm" variant="default" onClick={() => onExtendReservation(r.id)}>+24h</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => onReleaseReservation(r.id)}>Release</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-stone-700" />
                <h3 className="font-display text-lg font-semibold tracking-tight">Recent Leads</h3>
              </div>
              <button onClick={onOpenLeads} className="text-[11px] smallcaps font-semibold text-stone-500 hover:text-stone-900">
                View all <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>
            <div className="divide-y divide-stone-100">
              {recentLeads.map(l => (
                <button key={l.id} onClick={onOpenLeads}
                  className="w-full text-left px-5 py-3.5 hover:bg-stone-50 transition flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${l.read ? 'font-medium' : 'font-bold'} text-stone-900 truncate`}>{l.name}</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <LeadSourceBadge source={l.source} />
                    <span className="truncate">{l.vehicleLabel}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 tabular">{relTime(l.createdAt)}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick stats sidebar */}
          <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
            <div className="relative">
              <div className="text-[10px] font-semibold smallcaps mb-2" style={{ color: GOLD }}>Speed to Lead</div>
              <div className="font-display text-3xl font-medium tracking-tight leading-none">
                4<span className="text-base text-stone-400 ml-1">min avg</span>
              </div>
              <div className="text-xs text-stone-300 mt-3 leading-relaxed">
                Industry average is <span className="text-white font-medium">47 minutes</span>. You're responding 12× faster — that's why your close rate is up.
              </div>
              <div className="mt-4 pt-4 border-t border-stone-700 flex items-center justify-between">
                <div>
                  <div className="font-display tabular text-xl font-medium">73%</div>
                  <div className="text-[10px] smallcaps text-stone-400">close rate</div>
                </div>
                <div>
                  <div className="font-display tabular text-xl font-medium">{leads.length}</div>
                  <div className="text-[10px] smallcaps text-stone-400">leads MTD</div>
                </div>
                <div>
                  <div className="font-display tabular text-xl font-medium">$4,475</div>
                  <div className="text-[10px] smallcaps text-stone-400">avg gross</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <Card className="mt-6 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-stone-600" strokeWidth={2} />
            <h3 className="font-display text-lg font-semibold tracking-tight">Recent Activity</h3>
          </div>
          {activity.length > 8 && (
            <button onClick={() => setActivityExpanded(e => !e)}
              className="text-[11px] font-semibold text-blue-600 hover:underline">
              {activityExpanded ? 'Show less' : `View all (${activity.length})`}
            </button>
          )}
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {(activityExpanded ? activity : activity.slice(0, 8)).map(a => {
            const accent = {
              'lead-new':     { color: '#BE123C', icon: Users },
              'lead-status':  { color: '#0369A1', icon: Users },
              'sold':         { color: '#059669', icon: Award },
              'price-drop':   { color: '#EA580C', icon: TrendingDown },
              'reservation':  { color: GOLD,     icon: Clock },
              'feature':      { color: GOLD,     icon: Star },
              'appointment':  { color: '#0284C7', icon: Calendar },
              'review':       { color: '#9333EA', icon: Star },
              'restore':      { color: '#0891B2', icon: RefreshCw }
            }[a.type] || { color: '#78716C', icon: Activity };
            const Icon = accent.icon;
            const fmtAgo = (iso) => {
              const ms = Date.now() - new Date(iso).getTime();
              const m = Math.floor(ms / 60000);
              if (m < 1) return 'just now';
              if (m < 60) return m + 'm ago';
              const h = Math.floor(m / 60);
              if (h < 24) return h + 'h ago';
              const d = Math.floor(h / 24);
              if (d < 7) return d + 'd ago';
              return new Date(iso).toLocaleDateString();
            };
            return (
              <button key={a.id}
                onClick={() => a.refTab && onJump && onJump(a.refTab)}
                className="w-full text-left px-5 py-3 themed-row transition flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent.color + '22' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: accent.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                  {a.sub && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{a.sub}</div>}
                </div>
                <div className="text-[10px] shrink-0 tabular" style={{ color: 'var(--text-muted)' }}>{fmtAgo(a.when)}</div>
              </button>
            );
          })}
          {activity.length === 0 && (
            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No activity yet — actions will appear here as they happen.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ====================== INVENTORY TAB ============================ */

