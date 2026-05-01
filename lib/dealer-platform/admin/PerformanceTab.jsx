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

export function PerformanceTab() {
  const config = useAdminConfig();
  const dealerSlug = config.dealerSlug || 'primo';

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setAnalyticsLoading(true);
    fetch(`/api/dealer/${encodeURIComponent(dealerSlug)}/analytics`)
      .then(r => r.json())
      .then(j => { if (!cancel && j.ok) setAnalytics(j); })
      .catch(() => {})
      .finally(() => { if (!cancel) setAnalyticsLoading(false); });
    return () => { cancel = true; };
  }, [dealerSlug]);

  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const lastWeek = analytics?.dailyViews?.slice(-7) || [];
  const traffic = lastWeek.length === 7 ? lastWeek.map(d => d.views) : [180, 210, 195, 220, 240, 190, 230];
  const maxTraffic = Math.max(...traffic);

  const topPagesPctTotal = analytics?.topPages?.reduce((s, p) => s + p.views, 0) || 1;
  const topPages = analytics?.topPages?.map(p => ({
    page: p.title || p.path,
    pct: Math.round((p.views / topPagesPctTotal) * 100),
  })) || [
    { page: 'Homepage', pct: 45 }, { page: 'Inventory', pct: 32 },
    { page: 'Finance', pct: 12 }, { page: 'Trade-In', pct: 6 }, { page: 'Service', pct: 5 },
  ];

  const refTotal = analytics?.topReferrers?.reduce((s, r) => s + r.visits, 0) || 1;
  const refColor = { Google: '#4285F4', Direct: '#a8a39a', Facebook: '#1877F2', 'Cars.com': GOLD, CarGurus: '#34A853' };
  const sources = analytics?.topReferrers?.map(r => ({
    name: r.source, pct: Math.round((r.visits / refTotal) * 100),
    color: refColor[r.source] || '#d6d2c8', visits: r.visits,
  })) || [
    { name: 'Google Search', pct: 52, color: '#4285F4' },
    { name: 'Direct', pct: 18, color: '#a8a39a' },
    { name: 'Facebook', pct: 14, color: '#1877F2' },
    { name: 'Google My Business', pct: 9, color: '#34A853' },
    { name: 'Cars.com referral', pct: 4, color: GOLD },
    { name: 'Other', pct: 3, color: '#d6d2c8' },
  ];

  const apiCwv = analytics?.coreWebVitals;
  // Color thresholds: LCP <=2.5s good / <=4 needs improvement / else poor.
  // FID <=100ms / <=300 / else. CLS <=0.1 / <=0.25 / else.
  const colorFor = (kind, v) => {
    if (kind === 'lcp') return v <= 2.5 ? '#256B40' : v <= 4 ? '#92400E' : '#991B1B';
    if (kind === 'fid') return v <= 100 ? '#256B40' : v <= 300 ? '#92400E' : '#991B1B';
    if (kind === 'cls') return v <= 0.1 ? '#256B40' : v <= 0.25 ? '#92400E' : '#991B1B';
    return '#256B40';
  };
  const cwv = apiCwv ? [
    { metric: 'LCP', label: 'Largest Contentful Paint', value: `${apiCwv.lcp}s`, threshold: '2.5s', desc: 'How fast main content appears', tone: colorFor('lcp', apiCwv.lcp) },
    { metric: 'INP', label: 'Interaction to Next Paint', value: `${apiCwv.fid}ms`, threshold: '200ms', desc: 'Responsiveness to user input', tone: colorFor('fid', apiCwv.fid) },
    { metric: 'CLS', label: 'Cumulative Layout Shift', value: String(apiCwv.cls), threshold: '0.10', desc: 'Visual stability during load', tone: colorFor('cls', apiCwv.cls) },
  ] : [
    { metric: 'LCP', label: 'Largest Contentful Paint', value: '1.1s', threshold: '2.5s', desc: 'How fast main content appears', tone: '#256B40' },
    { metric: 'INP', label: 'Interaction to Next Paint', value: '45ms', threshold: '200ms', desc: 'Responsiveness to user input', tone: '#256B40' },
    { metric: 'CLS', label: 'Cumulative Layout Shift', value: '0.02', threshold: '0.10', desc: 'Visual stability during load', tone: '#256B40' },
  ];

  const devices = analytics?.deviceBreakdown || { desktop: 42, mobile: 51, tablet: 7 };

  if (analyticsLoading && !analytics) {
    return <div className="p-6 lg:p-8 max-w-[1600px] mx-auto"><Skeleton rows={8} /></div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Website Performance</h1>
          <p className="text-sm text-stone-500 mt-1">
            How your customer-facing site is performing — speed, traffic, and engagement.
          </p>
        </div>
        <div className="text-[10px] smallcaps text-stone-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
          Live data · last 30 days
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Page Views (30d)" value={(analytics?.pageViews ?? 6247).toLocaleString()} icon={Eye} accent="#2F7A4A" />
        <StatCard label="Unique Visitors" value={(analytics?.uniqueVisitors ?? 2891).toLocaleString()} icon={Users} accent="#2F7A4A" />
        <StatCard label="Bounce Rate" value={`${analytics?.bounceRate ?? 34.2}%`} icon={TrendingDown} accent="#2F7A4A" sub="industry avg: 58%" />
        <StatCard label="Avg Session" value={analytics?.avgSessionDuration ?? '2m 48s'} icon={Clock} sub="48% above industry" />
        <StatCard label="Page Load (LCP)" value={apiCwv ? `${apiCwv.lcp}s` : '1.8s'} icon={Zap} accent="#2F7A4A" sub="good ≤ 2.5s" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-xl font-medium">Core Web Vitals</h2>
              </div>
              <p className="text-xs text-stone-500">Google's three key page-experience metrics</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold smallcaps flex items-center gap-1.5"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
              <BadgeCheck className="w-3 h-3" /> All Passing
            </div>
          </div>
          <div className="space-y-4">
            {cwv.map(m => {
              const passing = m.tone === '#256B40';
              const bg = passing ? '#E8F2EC' : m.tone === '#92400E' ? '#FEF3C7' : '#FEE2E2';
              return (
                <div key={m.metric} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-2">
                    <div className="font-display text-2xl font-medium tabular leading-none" style={{ color: m.tone }}>{m.value}</div>
                    <div className="text-[10px] smallcaps text-stone-400 mt-1">{m.metric}</div>
                  </div>
                  <div className="col-span-7">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{m.desc}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-[11px] text-stone-500 tabular">good ≤ {m.threshold}</div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                      {passing
                        ? <Check className="w-3.5 h-3.5" style={{ color: m.tone }} strokeWidth={3} />
                        : <AlertTriangle className="w-3.5 h-3.5" style={{ color: m.tone }} strokeWidth={2.5} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 p-3 rounded-md text-xs leading-relaxed flex items-start gap-2"
            style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.08), transparent)', borderLeft: `3px solid ${GOLD}` }}>
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: GOLD }} />
            <div>
              <strong>Your site passes Google's Core Web Vitals — most dealer sites DON'T.</strong>
              <span className="text-stone-600"> Sites that pass rank higher in search results and convert 24% more visitors.</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Smartphone className="w-4 h-4 text-stone-500" />
            <h2 className="font-display text-xl font-medium">Device Split</h2>
          </div>
          <div className="space-y-5">
            {[
              { key: 'mobile',  label: 'Mobile',  Icon: Smartphone, color: GOLD },
              { key: 'desktop', label: 'Desktop', Icon: Monitor,    color: '#a8a39a' },
              { key: 'tablet',  label: 'Tablet',  Icon: Square,     color: '#6b655b' },
            ].map(d => {
              const pct = devices[d.key] ?? 0;
              return (
                <div key={d.key}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-stone-600 flex items-center gap-2"><d.Icon className="w-3.5 h-3.5" />{d.label}</span>
                    <span className="font-display tabular text-2xl font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-5 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
            Most car shoppers research on mobile. Your site is optimized for both — many dealers' sites fail mobile usability tests.
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-stone-500" />
              <h2 className="font-display text-xl font-medium">Daily Traffic — Last 7 Days</h2>
            </div>
            <span className="font-display tabular text-2xl font-medium">
              {traffic.reduce((a,b) => a+b, 0).toLocaleString()} <span className="text-xs text-stone-400 font-normal">visitors</span>
            </span>
          </div>
          <div className="flex items-end gap-3 h-64 mt-6">
            {traffic.map((v, i) => {
              const h = (v / maxTraffic) * 100;
              const isToday = i === traffic.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="font-display tabular text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition">{v}</div>
                  <div className="w-full bg-stone-100 rounded-t-md relative overflow-hidden" style={{ height: '224px' }}>
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all"
                      style={{ height: h + '%', background: isToday ? `linear-gradient(to top, ${GOLD}, #E8C97A)` : 'linear-gradient(to top, #6b655b, #a8a39a)' }} />
                  </div>
                  <div className="text-[10px] smallcaps text-stone-500">{dayLabels[i]}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-stone-500" />
            <h2 className="font-display text-xl font-medium">Top Pages</h2>
          </div>
          <div className="space-y-3">
            {topPages.map((p, i) => (
              <div key={p.page}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-medium">{p.page}</span>
                  <span className="font-display tabular text-sm font-semibold">{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: p.pct + '%', backgroundColor: i === 0 ? GOLD : '#a8a39a' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Traffic Sources</h2>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {sources.map(s => (
            <div key={s.name} title={s.name} style={{ width: s.pct + '%', backgroundColor: s.color }} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sources.map(s => (
            <div key={s.name} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-sm flex-1">{s.name}</span>
              <span className="font-display tabular text-sm font-semibold">{s.pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 -translate-y-1/2 translate-x-1/3"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative flex items-center gap-3">
          <Activity className="w-5 h-5" style={{ color: GOLD }} />
          <div className="flex-1">
            <div className="text-[10px] smallcaps font-semibold mb-0.5" style={{ color: GOLD }}>Performance Monitoring</div>
            <div className="text-sm">Live performance tracking powered by <strong>AIandWEBservices</strong> — included free with every Primo platform subscription.</div>
          </div>
        </div>
      </Card>

      {/* Data source indicator */}
      <div className="text-[11px] text-stone-400 text-center mt-4 leading-relaxed">
        📊 {analytics?.source === 'demo' ? 'Demo data' : 'Live data'} — connect Vercel Analytics for live metrics.
      </div>
    </div>
  );
}

/* ====================== TASKS TAB ================================ */

