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
import { scoreLeadSync } from '@/lib/dealer-platform/ai/lead-scorer';

const LEAD_SOURCE_TO_ESPO = {
  'Get E-Price': 'GetEPrice',
  'Pre-Approval': 'PreApproval',
  'Trade-In': 'TradeIn',
  'Test Drive': 'TestDrive',
  'Contact': 'Contact',
  'Build Your Deal': 'BuildYourDeal',
  'Chat': 'Chat',
  'Phone Call': 'Contact',
  'Inventory Alert': 'Contact',
  'Reserve': 'Reserve',
};

function creditRangeToTier(range) {
  if (!range) return null;
  const m = String(range).match(/(\d{3})/);
  const n = m ? Number(m[0]) : null;
  if (n == null) return null;
  if (n >= 750) return 'Excellent';
  if (n >= 700) return 'Good';
  if (n >= 600) return 'Fair';
  return 'Rebuilding';
}

function adaptLeadForScoring(lead) {
  return {
    cLeadSource: LEAD_SOURCE_TO_ESPO[lead.source] || null,
    emailAddress: lead.email,
    phoneNumber: lead.phone,
    cTradeInYear: lead.tradeInfo?.year,
    cTradeInMake: lead.tradeInfo?.make,
    cTradeInModel: lead.tradeInfo?.model,
    cFinanceApproved: !!lead.preApproval,
    cCreditTier: creditRangeToTier(lead.preApproval?.creditScore),
    createdAt: lead.createdAt,
  };
}

function scoreLeadDemo(lead) {
  return scoreLeadSync(adaptLeadForScoring(lead));
}

/* ─── Salesperson assignment helpers (Phase 3C) ─────────────────── */
const SALESPEOPLE = ['Carlos Rivera', 'Maria Santos', 'James Mitchell', 'Ana Gutierrez'];
const SALESPERSON_COLOR = {
  'Carlos Rivera':  '#3B82F6',
  'Maria Santos':   '#10B981',
  'James Mitchell': '#F59E0B',
  'Ana Gutierrez':  '#8B5CF6',
};

function SalespersonAvatar({ name, size = 'sm' }) {
  if (!name) return null;
  const initial = String(name).trim().charAt(0).toUpperCase() || '?';
  const color = SALESPERSON_COLOR[name] || '#78716C';
  const px = size === 'lg' ? 28 : 20;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ background: color, width: px, height: px, fontSize: size === 'lg' ? 12 : 10 }}
      title={name}>
      {initial}
    </span>
  );
}

function leadResponseMinutes(lead) {
  if (!lead?.createdAt || !Array.isArray(lead.timeline)) return null;
  const created = new Date(lead.createdAt).getTime();
  if (!Number.isFinite(created)) return null;
  const firstTouch = lead.timeline.find((t) => {
    const evt = String(t?.event || '').toLowerCase();
    return /contact|call|sms|email|reply|response/.test(evt);
  });
  if (!firstTouch?.t) return null;
  const touched = new Date(firstTouch.t).getTime();
  if (!Number.isFinite(touched) || touched < created) return null;
  return Math.max(0, Math.round((touched - created) / 60000));
}

function fmtResponseTime(mins) {
  if (mins == null) return '—';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function ScoreBadge({ result, size = 'sm' }) {
  if (!result) return null;
  const palette = {
    HOT:  { bg: '#B91C1C', fg: '#FFFFFF', pulse: true },
    WARM: { bg: '#FCD34D', fg: '#7A5A0F' },
    COOL: { bg: '#D1FAE5', fg: '#065F46' },
    COLD: { bg: '#E7E5E4', fg: '#78716C' },
  }[result.tier] || { bg: '#E7E5E4', fg: '#78716C' };
  const sizing = size === 'lg'
    ? 'text-sm px-3 py-1 gap-1.5 font-bold'
    : 'text-[11px] px-2 py-0.5 gap-1 font-bold';
  return (
    <span className={`inline-flex items-center rounded-full tabular ${sizing} ${palette.pulse ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: palette.bg, color: palette.fg }}
      title={`${result.tier} — ${result.recommendation}`}>
      <span>{result.emoji}</span>
      <span>{result.score}</span>
    </span>
  );
}

function buildFollowupPreviews(lead, repName) {
  const firstName = String(lead.name || '').split(/\s+/)[0] || 'there';
  const vehicle = lead.vehicleLabel && lead.vehicleLabel !== 'No specific vehicle'
    ? lead.vehicleLabel
    : 'vehicle you asked about';
  const rep = repName || 'Marco';
  return [
    {
      label: '4 hours',
      channels: ['email', 'sms'],
      text: `Hi ${firstName}, it's ${rep} from Primo Auto Group. Got your inquiry on the ${vehicle}. Want to set up a quick test drive this week? — ${rep}`,
    },
    {
      label: '24 hours',
      channels: ['email', 'sms'],
      text: `Quick update — the ${vehicle} is still available, but I've had two other customers ask about it today. Want me to hold it for you?`,
    },
    {
      label: 'Day 3',
      channels: ['email'],
      text: `Hey ${firstName}, we just got a similar vehicle that might interest you — same trim, lower miles, just hit the lot. Pulling photos now if you'd like to see.`,
    },
    {
      label: 'Day 7',
      channels: ['email'],
      text: `Just wanted to follow up one last time about the ${vehicle}. If timing isn't right, no worries — happy to keep an eye out for the right one when you're ready.`,
    },
  ];
}

function deriveFollowupLog(lead) {
  const events = [];
  const created = new Date(lead.createdAt).getTime();
  const ageMs = TODAY.getTime() - created;
  const ageHours = ageMs / 3600000;
  const ageDays = ageHours / 24;

  if (ageHours >= 4) {
    events.push({ t: new Date(created + 4 * 3600000).toISOString(), kind: 'auto', done: true,
      label: `Auto-email: "Thanks for your interest in ${lead.vehicleLabel || 'our inventory'}"` });
  }
  if (ageHours >= 24 && lead.status === 'New') {
    events.push({ t: new Date(created + 24 * 3600000).toISOString(), kind: 'auto', done: true,
      label: `Auto-text: "Still interested in the ${lead.vehicleLabel || 'vehicle'}? It's still available."` });
  }
  if (lead.status === 'Contacted' || lead.status === 'Appointment Set' || lead.status === 'Showed') {
    events.push({ t: new Date(created + Math.min(ageHours, 30) * 3600000).toISOString(), kind: 'manual', done: true,
      label: `Manual call by dealer — connected with ${lead.name.split(' ')[0]}` });
  }
  if (ageDays >= 3 && lead.status !== 'Sold' && lead.status !== 'Lost') {
    events.push({ t: new Date(created + 3 * 86400000).toISOString(), kind: 'auto', done: true,
      label: `Auto-email #2: ${lead.vehicleLabel || 'Vehicle'} update + 2 similar vehicles to consider` });
  }
  if (ageDays >= 7 && (lead.status === 'New' || lead.status === 'Contacted')) {
    events.push({ t: new Date(created + 7 * 86400000).toISOString(), kind: 'auto', done: true,
      label: 'Auto-email: Final follow-up — last chance before we feature it' });
  }
  return events;
}

export function LeadsTab({ leads, setLeads, inventory, settings, setSettings, onConvertToDeal, flash, messages, setMessages, onCreateTask }) {
  const [showLicense, setShowLicense] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('info'); // 'info' | 'messages'
  const [msgChannel, setMsgChannel] = useState('sms');
  const [msgDraft, setMsgDraft] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterSalesperson, setFilterSalesperson] = useState('all'); // 'all' | name | 'unassigned'
  const [assignOpenFor, setAssignOpenFor] = useState(null);          // lead.id of open menu
  const [expanded, setExpanded] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [bulkAction, setBulkAction] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [savedOpen, setSavedOpen] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const [sortKey, setSortKey] = useState('score');
  const [followupEdits, setFollowupEdits] = useState({});
  const [editingStage, setEditingStage] = useState(null);
  const followupRef = useRef(null);
  const savedViews = settings?.savedViews?.leads || [];

  const scoresById = useMemo(() => {
    const m = new Map();
    leads.forEach((l) => { m.set(l.id, scoreLeadDemo(l)); });
    return m;
  }, [leads]);

  /* ─── Salesperson assignment + round-robin ──────────────────── */
  const assignmentSettings = settings?.assignment || {};
  const autoAssignOn = assignmentSettings.autoAssign !== false; // default true

  const assignLead = useCallback((leadId, name) => {
    setLeads((arr) => arr.map((l) => l.id === leadId ? { ...l, assignedTo: name } : l));
    if (name) flash(`Lead assigned to ${name}`);
  }, [setLeads, flash]);

  const counts = useMemo(() => {
    const c = { all: leads.length, unassigned: 0 };
    SALESPEOPLE.forEach((n) => { c[n] = 0; });
    leads.forEach((l) => {
      if (l.assignedTo && c[l.assignedTo] != null) c[l.assignedTo]++;
      else c.unassigned++;
    });
    return c;
  }, [leads]);

  // Round-robin auto-assign whenever a brand-new (unassigned) lead appears.
  const prevLeadIdsRef = useRef(null);
  useEffect(() => {
    const ids = new Set(leads.map((l) => l.id));
    if (prevLeadIdsRef.current === null) {
      prevLeadIdsRef.current = ids;
      return;
    }
    if (!autoAssignOn) {
      prevLeadIdsRef.current = ids;
      return;
    }
    const newOnes = leads.filter(
      (l) => !prevLeadIdsRef.current.has(l.id) && !l.assignedTo,
    );
    if (newOnes.length === 0) {
      prevLeadIdsRef.current = ids;
      return;
    }
    let idx = Number(assignmentSettings.lastAssignedIndex);
    if (!Number.isFinite(idx)) idx = -1;
    const assignments = new Map();
    for (const lead of newOnes) {
      idx = (idx + 1) % SALESPEOPLE.length;
      assignments.set(lead.id, SALESPEOPLE[idx]);
    }
    setLeads((arr) =>
      arr.map((l) => (assignments.has(l.id) ? { ...l, assignedTo: assignments.get(l.id) } : l)),
    );
    setSettings((s) => ({
      ...s,
      assignment: { ...(s?.assignment || {}), lastAssignedIndex: idx },
    }));
    prevLeadIdsRef.current = ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, autoAssignOn]);

  const applyView = (v) => {
    setSearch(v.filter.search || '');
    setFilterStatus(v.filter.status || 'all');
    setFilterSource(v.filter.source || 'all');
    setSavedOpen(false);
    flash(`Loaded view: ${v.name}`);
  };
  const saveCurrentView = (name) => {
    if (!name || !name.trim()) return;
    const view = {
      id: 'sv-l-' + Date.now(),
      name: name.trim(),
      filter: { search, status: filterStatus, source: filterSource }
    };
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), leads: [...(s.savedViews?.leads || []), view] } }));
    flash(`Saved view: ${view.name}`);
  };
  const deleteView = (id) => {
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), leads: (s.savedViews?.leads || []).filter(v => v.id !== id) } }));
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [l.name, l.email, l.phone, l.vehicleLabel].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (filterSource !== 'all' && l.source !== filterSource) return false;
      if (filterSalesperson !== 'all') {
        if (filterSalesperson === 'unassigned') {
          if (l.assignedTo) return false;
        } else if (l.assignedTo !== filterSalesperson) {
          return false;
        }
      }
      if (filterDate !== 'all') {
        const days = (TODAY.getTime() - new Date(l.createdAt).getTime()) / 86400000;
        if (filterDate === 'today' && days > 1) return false;
        if (filterDate === 'week' && days > 7) return false;
        if (filterDate === 'month' && days > 30) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortKey === 'score') {
        const sa = scoresById.get(a.id)?.score ?? 0;
        const sb = scoresById.get(b.id)?.score ?? 0;
        if (sb !== sa) return sb - sa;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortKey === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortKey === 'name') return String(a.name).localeCompare(String(b.name));
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [leads, search, filterStatus, filterSource, filterSalesperson, filterDate, sortKey, scoresById]);

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterSource, filterSalesperson, filterDate]);

  const allSelected = filtered.length > 0 && filtered.every(l => selectedLeads.has(l.id));
  const toggleAll = () => {
    if (allSelected) { const n = new Set(selectedLeads); filtered.forEach(l => n.delete(l.id)); setSelectedLeads(n); }
    else { const n = new Set(selectedLeads); filtered.forEach(l => n.add(l.id)); setSelectedLeads(n); }
  };
  const toggleOne = (id) => { const n = new Set(selectedLeads); n.has(id) ? n.delete(id) : n.add(id); setSelectedLeads(n); };
  const bulkApply = (action) => {
    const ids = Array.from(selectedLeads);
    if (ids.length === 0) return;
    if (action === 'contacted')   { setLeads(arr => arr.map(l => ids.includes(l.id) ? { ...l, status: 'Contacted' } : l)); flash(`${ids.length} marked Contacted`); }
    else if (action === 'lost')   { setLeads(arr => arr.map(l => ids.includes(l.id) ? { ...l, status: 'Lost' } : l)); flash(`${ids.length} marked Lost`); }
    else if (action === 'delete') {
      const removed = leads.filter(l => ids.includes(l.id));
      setLeads(arr => arr.filter(l => !ids.includes(l.id)));
      flash(`${ids.length} lead${ids.length === 1 ? '' : 's'} deleted`, { tone: 'destructive', undo: () => setLeads(arr => [...removed, ...arr]) });
    }
    else if (action === 'csv') {
      const headers = ['name','email','phone','source','vehicleLabel','status','createdAt'];
      const rows = leads.filter(l => ids.includes(l.id));
      downloadFile(`${slug}-leads.csv`, buildCSV(headers, rows));
      flash(`Exported ${ids.length} leads to CSV`);
    }
    setSelectedLeads(new Set());
    setBulkAction(null);
  };

  const updateLead = (id, patch) => setLeads(arr => arr.map(l => l.id === id ? { ...l, ...patch } : l));

  const expandLead = (id) => {
    setExpanded(expanded === id ? null : id);
    if (!leads.find(l => l.id === id)?.read) updateLead(id, { read: true });
  };

  const unread = leads.filter(l => !l.read).length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-stone-500 mt-1">
            {filtered.length} of {leads.length} · {unread > 0 && <span className="font-semibold" style={{ color: RED_ACCENT }}>{unread} unread</span>}
            {unread > 0 && <span> · </span>}
            <span>4 min average response time</span>
          </p>
        </div>
        <Btn variant="default" icon={Bell} onClick={() => setShowNotifs(s => !s)}>
          Notification Settings
        </Btn>
      </div>

      {/* Notification settings panel */}
      {showNotifs && (
        <Card className="p-5 mb-4 anim-slide" style={{ borderColor: GOLD }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
              <Sparkles className="w-4 h-4" style={{ color: '#7A5A0F' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold">Lead Automation</h3>
              <p className="text-xs text-stone-500 mt-1">
                Powered by AI automation — <span className="font-semibold" style={{ color: GOLD }}>included at no extra cost</span>
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <Toggle checked={settings.notifications.emailAlerts}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, emailAlerts: v } }))}
                label="Email me on new leads"
                description="Instant notification with full lead details" />
              <Field label="Notification email">
                <Input value={settings.notifications.alertEmail}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, alertEmail: e.target.value } }))} />
              </Field>
              <Toggle checked={settings.notifications.smsAlerts}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, smsAlerts: v } }))}
                label="Text me on new leads"
                description="SMS within 30 seconds of submission" />
              <Field label="Notification phone">
                <Input value={settings.notifications.alertPhone}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, alertPhone: e.target.value } }))} />
              </Field>
            </div>
            <div className="space-y-4">
              <Toggle checked={settings.notifications.autoFollowupEmail}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, autoFollowupEmail: v } }))}
                label="Auto-send follow-up email after 24h"
                description="If no contact yet, send personalized follow-up" />
              <Toggle checked={settings.notifications.autoFollowupSms}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, autoFollowupSms: v } }))}
                label="Auto-send text after 4h if uncontacted"
                description="Speed-to-lead is the #1 predictor of close rate" />
              <Field label="Speed-to-lead target">
                <Select value={settings.notifications.speedToLead}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, speedToLead: e.target.value } }))}>
                  {['5 min','15 min','30 min','1 hour'].map(t => <option key={t}>{t}</option>)}
                </Select>
              </Field>
            </div>
          </div>

          {/* Follow-up sequence preview */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> Follow-Up Sequence Preview
              </div>
              <Toggle checked={settings.notifications.autoFollowupEmail || settings.notifications.autoFollowupSms}
                onChange={() => {}} disabled />
            </div>
            <div className="space-y-1.5">
              {[
                { time: 'Hour 4', kind: 'Email', text: 'Thanks for your interest in [vehicle]', icon: Mail },
                { time: 'Hour 24', kind: 'Text', text: "Still interested in the [vehicle]? It's still available.", icon: MessageSquare },
                { time: 'Day 3', kind: 'Email', text: '[Vehicle] update + 2 similar vehicles to consider', icon: Mail },
                { time: 'Day 7', kind: 'Email', text: 'Final follow-up — last chance before we feature it', icon: Mail }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-md border border-stone-100">
                    <span className="text-[10px] smallcaps font-bold tabular text-stone-500 w-14">{s.time}</span>
                    <Icon className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-[10px] smallcaps font-semibold w-10" style={{ color: '#7A5A0F' }}>{s.kind}</span>
                    <span className="text-[12px] text-stone-700 flex-1 italic">"{s.text}"</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-stone-500 leading-relaxed">
              <strong className="text-stone-700">AI-powered follow-up</strong> — included free.
              <span style={{ color: GOLD }}> Competitors charge $500+/mo for this.</span>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, vehicle…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs w-36">
            <option value="all">All status</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="text-xs w-40">
            <option value="all">All sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="text-xs w-32">
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </Select>
          <Select value={filterSalesperson} onChange={(e) => setFilterSalesperson(e.target.value)} className="text-xs w-44" title="Filter by salesperson">
            <option value="all">All salespeople ({counts.all})</option>
            {SALESPEOPLE.map((n) => {
              const first = n.split(' ')[0];
              return <option key={n} value={n}>{first} ({counts[n] || 0})</option>;
            })}
            <option value="unassigned">Unassigned ({counts.unassigned})</option>
          </Select>
          <label className="inline-flex items-center gap-2 text-xs text-stone-700"
            title="Round-robin assign new leads to Carlos → Maria → James → Ana">
            <Toggle
              checked={autoAssignOn}
              onChange={(v) =>
                setSettings((s) => ({ ...s, assignment: { ...(s?.assignment || {}), autoAssign: v } }))
              }
              label={<span className="text-xs">Auto-assign: <strong>{autoAssignOn ? 'On' : 'Off'}</strong></span>}
            />
          </label>
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="text-xs w-40" title="Sort">
            <option value="score">🔥 AI Score (hottest first)</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name (A-Z)</option>
          </Select>
          <div className="relative">
            <button onClick={() => setSavedOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md hover:bg-stone-100 transition"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' }}>
              <Bookmark className="w-3.5 h-3.5" /> Views <ChevronDown className="w-3 h-3" />
            </button>
            {savedOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSavedOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg z-40 py-1 anim-fade"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {savedViews.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-center" style={{ color: 'var(--text-muted)' }}>No saved views yet</div>
                  ) : savedViews.map(v => (
                    <div key={v.id} className="flex items-center group">
                      <button onClick={() => applyView(v)}
                        className="flex-1 px-3 py-2 text-left text-xs hover:bg-stone-50 truncate">{v.name}</button>
                      <button onClick={() => deleteView(v.id)} title="Delete view"
                        className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                  <button onClick={() => { setSavedOpen(false); setShowSaveView(true); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50"
                    style={{ color: 'var(--text-primary)' }}>
                    <Plus className="w-3 h-3" /> Save current view…
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {selectedLeads.size > 0 && (
        <div className="mb-3 p-3 rounded-lg flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold mr-2" style={{ color: 'var(--text-primary)' }}>{selectedLeads.size} selected</span>
          <Btn size="sm" variant="default" onClick={() => bulkApply('contacted')}>Mark Contacted</Btn>
          <Btn size="sm" variant="default" onClick={() => bulkApply('lost')}>Mark Lost</Btn>
          <Btn size="sm" variant="default" icon={Download} onClick={() => bulkApply('csv')}>Export CSV</Btn>
          <Btn size="sm" variant="default" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100" onClick={() => bulkApply('delete')}>Delete</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setSelectedLeads(new Set())}>Clear</Btn>
        </div>
      )}

      {/* Leads table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={toggleAll} className="flex items-center justify-center">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
                <th className="px-4 py-2.5 w-6"></th>
                <th className="px-2 py-2.5 text-left">Name</th>
                <th className="px-2 py-2.5 text-left w-20">AI Score</th>
                <th className="px-2 py-2.5 text-left w-44">Assigned To</th>
                <th className="px-2 py-2.5 text-left">Contact</th>
                <th className="px-2 py-2.5 text-left">Source</th>
                <th className="px-2 py-2.5 text-left">Vehicle of Interest</th>
                <th className="px-2 py-2.5 text-left">Status</th>
                <th className="px-2 py-2.5 text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 px-4">
                  <Users className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No leads yet</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Leads appear here when customers submit forms on your website. Try clearing your filters above.</div>
                </td></tr>
              ) : paged.map(l => (
                <React.Fragment key={l.id}>
                  <tr onClick={() => expandLead(l.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${!l.read ? 'bg-amber-50/30' : ''} ${expanded === l.id ? 'bg-stone-50' : ''} ${selectedLeads.has(l.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOne(l.id)} className="flex items-center justify-center">
                        {selectedLeads.has(l.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {!l.read && <div className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: RED_ACCENT }} />}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`${l.read ? 'font-medium' : 'font-bold'} text-stone-900`}>{l.name}</span>
                        {l.status !== 'New' && (
                          <Mail className="w-3 h-3 text-amber-700" aria-label="Follow-up sequence active" title="Follow-up sequence active" />
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <ScoreBadge result={scoresById.get(l.id)} />
                    </td>
                    <td className="px-2 py-3 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setAssignOpenFor(assignOpenFor === l.id ? null : l.id)}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-stone-100 transition group"
                        title={l.assignedTo ? `Assigned to ${l.assignedTo}` : 'Click to assign'}>
                        {l.assignedTo ? (
                          <>
                            <SalespersonAvatar name={l.assignedTo} />
                            <span className="text-[12px] text-stone-700">{l.assignedTo.split(' ')[0]}</span>
                          </>
                        ) : (
                          <span className="text-[12px] text-stone-400 italic">Unassigned</span>
                        )}
                        <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
                      </button>
                      {assignOpenFor === l.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setAssignOpenFor(null)} />
                          <div className="absolute left-0 top-full mt-1 w-52 rounded-md shadow-lg z-40 py-1 anim-fade"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            {SALESPEOPLE.map((name) => (
                              <button key={name}
                                onClick={() => { assignLead(l.id, name); setAssignOpenFor(null); }}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-stone-50 flex items-center gap-2">
                                <SalespersonAvatar name={name} />
                                <span>{name}</span>
                                {l.assignedTo === name && <Check className="w-3 h-3 ml-auto text-emerald-600" strokeWidth={2.5} />}
                              </button>
                            ))}
                            {l.assignedTo && (
                              <>
                                <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                                <button
                                  onClick={() => { assignLead(l.id, null); setAssignOpenFor(null); flash('Lead unassigned'); }}
                                  className="w-full px-3 py-2 text-left text-xs hover:bg-stone-50 text-stone-500 italic">
                                  Unassign
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-[12px] text-stone-700">{l.email}</div>
                      <div className="text-[11px] text-stone-500 tabular">{l.phone}</div>
                    </td>
                    <td className="px-2 py-3">
                      <LeadSourceBadge source={l.source} />
                    </td>
                    <td className="px-2 py-3 text-stone-700">{l.vehicleLabel}</td>
                    <td className="px-2 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-2 py-3 text-right text-xs text-stone-500 tabular">{relTime(l.createdAt)}</td>
                  </tr>
                  {expanded === l.id && (
                    <tr>
                      <td colSpan={10} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="md:hidden flex justify-end mb-3">
                          <button onClick={() => setExpanded(null)}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-100">
                            Close
                          </button>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-6 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
                          {/* Detail */}
                          <div className="lg:col-span-2 space-y-5">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Submitted Information</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="font-medium">{l.name}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Email</span><span className="font-mono text-[12px]">{l.email}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Phone</span><span className="font-mono tabular">{l.phone}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Source</span><span>{l.source}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Vehicle of interest</span><span>{l.vehicleLabel}</span></div>
                                {l.preApproval && (
                                  <>
                                    <div className="border-t border-stone-100 pt-2 mt-2 text-[10px] smallcaps font-semibold text-stone-500">Pre-Approval</div>
                                    <div className="flex justify-between"><span className="text-stone-500">Credit score range</span><span>{l.preApproval.creditScore}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Monthly income</span><span className="tabular">{fmtMoney(l.preApproval.monthlyIncome)}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Employer</span><span>{l.preApproval.employer}</span></div>
                                  </>
                                )}
                                {l.tradeInfo && (
                                  <>
                                    <div className="border-t border-stone-100 pt-2 mt-2 text-[10px] smallcaps font-semibold text-stone-500">Trade-In</div>
                                    <div className="flex justify-between"><span className="text-stone-500">Vehicle</span><span>{l.tradeInfo.year} {l.tradeInfo.make} {l.tradeInfo.model}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Mileage</span><span className="tabular">{Number(l.tradeInfo.mileage).toLocaleString()} mi</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Condition</span><span>{l.tradeInfo.condition}</span></div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Timeline */}
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Customer Engagement Timeline</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4">
                                <div className="space-y-3">
                                  {l.timeline.map((t, i) => (
                                    <div key={i} className="flex gap-3">
                                      <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: i === l.timeline.length - 1 ? GOLD : '#d6d2c8' }} />
                                        {i < l.timeline.length - 1 && <div className="w-px flex-1 bg-stone-200" />}
                                      </div>
                                      <div className="flex-1 pb-2">
                                        <div className="text-sm">{t.event}</div>
                                        <div className="text-[11px] text-stone-400 tabular mt-0.5">{relTime(t.t)}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Internal Notes</div>
                              <Textarea value={l.notes || ''}
                                onChange={(e) => updateLead(l.id, { notes: e.target.value })}
                                placeholder="Called back, coming Saturday at 11am..."
                                rows={3} />
                            </div>

                            {/* Follow-Up Log */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> AI Follow-Up Log
                                </div>
                                <span className="text-[9px] smallcaps font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                                  AUTOMATED
                                </span>
                              </div>
                              <div className="bg-white border border-stone-200 rounded-md p-4">
                                {(() => {
                                  const log = deriveFollowupLog(l);
                                  if (log.length === 0) {
                                    return (
                                      <div className="text-[12px] text-stone-500 italic flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        First automated touchpoint scheduled for 4 hours after lead capture.
                                      </div>
                                    );
                                  }
                                  return (
                                    <div className="space-y-2.5">
                                      {log.map((e, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                          <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: e.kind === 'auto' ? GOLD_SOFT : '#E8F2EC' }}>
                                            {e.kind === 'auto'
                                              ? <Sparkles className="w-2.5 h-2.5" style={{ color: '#7A5A0F' }} />
                                              : <Phone className="w-2.5 h-2.5" style={{ color: '#256B40' }} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-[12px] text-stone-800">{e.label}</div>
                                            <div className="text-[10px] text-stone-400 tabular mt-0.5">{relTime(e.t)}</div>
                                          </div>
                                          {e.done && <Check className="w-3.5 h-3.5 text-green-700 mt-0.5 shrink-0" strokeWidth={2.5} />}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                                <Sparkles className="w-2.5 h-2.5 inline mr-0.5" style={{ color: GOLD }} />
                                AI-powered follow-up included free — competitors charge $500+/mo for this.
                              </div>
                            </div>

                            {/* AI Analysis */}
                            {(() => {
                              const result = scoresById.get(l.id);
                              if (!result) return null;
                              const signals = result.topSignals && result.topSignals.length > 0
                                ? result.topSignals
                                : ['Limited engagement so far'];
                              return (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                                      <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> AI Analysis
                                    </div>
                                  </div>
                                  <div className="rounded-md p-4 text-white" style={{ backgroundColor: '#1C1917' }}>
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                      <div className="flex items-baseline gap-2">
                                        <span className="font-display text-3xl font-semibold tabular">{result.score}</span>
                                        <span className="text-stone-400 text-sm">/100</span>
                                      </div>
                                      <ScoreBadge result={result} size="lg" />
                                    </div>
                                    <div className="text-[10px] smallcaps font-semibold text-stone-400 mb-1.5">Top Signals</div>
                                    <ul className="space-y-1 mb-3">
                                      {signals.slice(0, 3).map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[12px] text-stone-100">
                                          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
                                          <span>{s}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="text-[10px] smallcaps font-semibold text-stone-400 mb-1">Recommendation</div>
                                    <div className="text-[12px] leading-snug" style={{ color: GOLD }}>
                                      {result.recommendation}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Salesperson Performance */}
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
                                <Users className="w-3 h-3" /> Salesperson Performance
                              </div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Assigned to</span>
                                  {l.assignedTo ? (
                                    <span className="inline-flex items-center gap-2 font-medium">
                                      <SalespersonAvatar name={l.assignedTo} />
                                      {l.assignedTo}
                                    </span>
                                  ) : (
                                    <span className="italic text-stone-400">Unassigned</span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Response time</span>
                                  <span className="tabular">
                                    {(() => {
                                      const m = leadResponseMinutes(l);
                                      return m == null ? 'No response yet' : fmtResponseTime(m);
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Close rate (last 90d)</span>
                                  <span className="tabular font-medium">22%</span>
                                </div>
                              </div>
                            </div>

                            {/* AI Follow-Up Sequence */}
                            <div ref={followupRef}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> AI Follow-Up Sequence
                                </div>
                                <span className="text-[9px] smallcaps font-bold px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>PREVIEW</span>
                              </div>
                              <div className="bg-white border border-stone-200 rounded-md p-4">
                                {(() => {
                                  const previews = buildFollowupPreviews(l, settings?.dealerName);
                                  const ageHours = (TODAY.getTime() - new Date(l.createdAt).getTime()) / 3600000;
                                  const stageHourThreshold = [4, 24, 72, 168];
                                  return (
                                    <div className="space-y-3">
                                      {previews.map((p, i) => {
                                        const wouldHaveSent = ageHours >= stageHourThreshold[i];
                                        const editKey = `${l.id}-${i}`;
                                        const editedText = followupEdits[editKey];
                                        const text = editedText != null ? editedText : p.text;
                                        const isEditing = editingStage === editKey;
                                        return (
                                          <div key={i} className="flex gap-3">
                                            <div className="flex flex-col items-center pt-1">
                                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wouldHaveSent ? GOLD : '#d6d2c8' }} />
                                              {i < previews.length - 1 && <div className="w-px flex-1 bg-stone-200 mt-1" />}
                                            </div>
                                            <div className="flex-1 pb-1 min-w-0">
                                              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                  <span className="text-[10px] smallcaps font-bold tabular text-stone-700">{p.label}</span>
                                                  <span className="flex items-center gap-1">
                                                    {p.channels.includes('email') && <Mail className="w-3 h-3 text-stone-500" />}
                                                    {p.channels.includes('sms') && <MessageSquare className="w-3 h-3 text-stone-500" />}
                                                  </span>
                                                  <span className={`text-[9px] smallcaps font-bold px-1.5 py-0.5 rounded`}
                                                    style={{ backgroundColor: wouldHaveSent ? '#E8F2EC' : GOLD_SOFT, color: wouldHaveSent ? '#256B40' : '#7A5A0F' }}>
                                                    {wouldHaveSent ? '✅ Would have sent' : '⏳ Scheduled'}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <button onClick={() => setEditingStage(isEditing ? null : editKey)}
                                                    className="text-[10px] smallcaps font-semibold text-stone-600 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-100">
                                                    {isEditing ? 'Done' : 'Edit'}
                                                  </button>
                                                  <Btn size="sm" variant="gold" icon={Send}
                                                    onClick={() => flash('Message sent (demo)')}>Send Now</Btn>
                                                </div>
                                              </div>
                                              {isEditing ? (
                                                <Textarea rows={3} value={text} className="text-[12px]"
                                                  onChange={(e) => setFollowupEdits((m) => ({ ...m, [editKey]: e.target.value }))} />
                                              ) : (
                                                <div className="text-[12px] text-stone-700 italic leading-snug bg-stone-50 rounded px-2 py-1.5 border border-stone-100">
                                                  &ldquo;{text}&rdquo;
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                                  <Btn variant="gold" icon={Sparkles}
                                    onClick={() => flash('AI follow-up sequence generated')}>
                                    Generate AI Sequence
                                  </Btn>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions sidebar */}
                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Quick Actions</div>
                              <div className="flex space-x-2 mb-2">
                                <a href={`tel:${l.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Phone className="w-4 h-4 text-stone-700" />
                                  <span>Call</span>
                                </a>
                                <a href={`sms:${l.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <MessageSquare className="w-4 h-4 text-stone-700" />
                                  <span>Text</span>
                                </a>
                                <a href={`mailto:${l.email}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Mail className="w-4 h-4 text-stone-700" />
                                  <span>Email</span>
                                </a>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setShowLicense(true)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Camera className="w-3.5 h-3.5" /> Scan License
                                </button>
                                <button onClick={() => onCreateTask && onCreateTask(l)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <CheckSquare className="w-3.5 h-3.5" /> Follow-Up
                                </button>
                              </div>
                              <button onClick={() => setActiveDetailTab(activeDetailTab === 'messages' ? 'info' : 'messages')}
                                className={`w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md transition text-xs font-medium ${activeDetailTab === 'messages' ? 'border-2 border-amber-500 bg-amber-50 text-amber-900' : 'bg-white border border-stone-200 hover:border-stone-400'}`}>
                                <MessageSquare className="w-3.5 h-3.5" />
                                {activeDetailTab === 'messages' ? 'Hide Messages' : `Messages (${(messages?.[l.id] || []).length})`}
                              </button>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    const r = scoreLeadDemo(l);
                                    flash(`Lead scored: ${r.score}/100 (${r.tier}) — ${r.recommendation}`);
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md transition text-xs font-medium bg-white border border-stone-200 hover:border-stone-400">
                                  🔥 Score Lead
                                </button>
                                <button
                                  onClick={() => {
                                    requestAnimationFrame(() => {
                                      followupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    });
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md transition text-xs font-medium bg-white border border-stone-200 hover:border-stone-400">
                                  <Sparkles className="w-3.5 h-3.5" /> AI Follow-Up
                                </button>
                              </div>
                            </div>

                            {expanded === l.id && activeDetailTab === 'messages' && (
                              <div className="rounded-md p-3 bg-white border-2 border-amber-200">
                                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Conversation Thread</div>
                                <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                                  {(messages?.[l.id] || []).length === 0 ? (
                                    <div className="text-xs text-center text-stone-400 py-4">No messages yet — send the first one below.</div>
                                  ) : (messages[l.id] || []).map(m => {
                                    const isOut = m.dir === 'out';
                                    return (
                                      <div key={m.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs`}
                                          style={{ backgroundColor: isOut ? GOLD_SOFT : '#F5F5F0', color: isOut ? '#1A1612' : '#1C1917' }}>
                                          <div>{m.text}</div>
                                          <div className="text-[9px] mt-0.5 opacity-60 flex items-center gap-1.5">
                                            {m.channel === 'sms' ? <MessageSquare className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                                            {new Date(m.when).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-1 mb-2">
                                  <button onClick={() => setMsgChannel('sms')}
                                    className={`flex-1 px-2 py-1 text-[10px] font-bold rounded ${msgChannel === 'sms' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>SMS</button>
                                  <button onClick={() => setMsgChannel('email')}
                                    className={`flex-1 px-2 py-1 text-[10px] font-bold rounded ${msgChannel === 'email' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>EMAIL</button>
                                </div>
                                <Textarea rows={2} value={msgDraft} onChange={(e) => setMsgDraft(e.target.value)}
                                  placeholder={msgChannel === 'sms' ? 'Type SMS…' : 'Type email…'} className="text-xs" />
                                <Btn variant="gold" size="sm" className="w-full mt-2" icon={Send}
                                  disabled={!msgDraft.trim()}
                                  onClick={() => {
                                    const m = { id: 'm-' + Date.now(), dir: 'out', channel: msgChannel, text: msgDraft.trim(), when: new Date().toISOString() };
                                    setMessages(prev => ({ ...prev, [l.id]: [...(prev[l.id] || []), m] }));
                                    setMsgDraft('');
                                    flash(`${msgChannel === 'sms' ? 'Text' : 'Email'} sent (demo)`);
                                  }}>
                                  Send {msgChannel === 'sms' ? 'Text' : 'Email'}
                                </Btn>
                                <div className="text-[9px] text-stone-400 mt-1.5 text-center">In production: wired to Twilio (SMS) and Resend (email)</div>
                              </div>
                            )}

                            <Field label="Update Status">
                              <Select value={l.status} onChange={(e) => updateLead(l.id, { status: e.target.value })}>
                                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <Btn variant="gold" className="w-full" icon={Calculator}
                              onClick={() => onConvertToDeal(l)}>
                              Convert to Deal
                            </Btn>

                            <div className="text-[10px] smallcaps text-stone-400 pt-2 border-t border-stone-200">
                              Lead ID: {l.id} · Received {fmtDate(l.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="lead" />
      </Card>

      <ConfirmDialog
        isOpen={showSaveView}
        title="Save current view"
        message="Give this filter combination a name to load it later."
        confirmLabel="Save view"
        confirmColor="dark"
        inputs={[{ name: 'name', label: 'View name', placeholder: 'e.g., Hot leads this week' }]}
        onConfirm={(vals) => { saveCurrentView(vals.name); setShowSaveView(false); }}
        onCancel={() => setShowSaveView(false)} />

      {/* Driver's License Scanner placeholder */}
      {showLicense && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 anim-fade no-print" onClick={() => setShowLicense(false)}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-stone-700" />
                <h3 className="font-display text-lg font-semibold">Scan Driver's License</h3>
              </div>
              {/* Viewfinder placeholder */}
              <div className="relative aspect-[1.6/1] rounded-md overflow-hidden mb-4"
                style={{ backgroundColor: '#0F0F0F' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-14 h-14 text-stone-600" strokeWidth={1.25} />
                </div>
                {/* corner crosshairs */}
                {[
                  { top: 12, left: 12, br: ['t','l'] },
                  { top: 12, right: 12, br: ['t','r'] },
                  { bottom: 12, left: 12, br: ['b','l'] },
                  { bottom: 12, right: 12, br: ['b','r'] }
                ].map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 26, height: 26,
                    borderTop:    p.br.includes('t') ? `2px solid ${GOLD}` : 'none',
                    borderBottom: p.br.includes('b') ? `2px solid ${GOLD}` : 'none',
                    borderLeft:   p.br.includes('l') ? `2px solid ${GOLD}` : 'none',
                    borderRight:  p.br.includes('r') ? `2px solid ${GOLD}` : 'none',
                    ...p
                  }} />
                ))}
                <div className="absolute inset-0 flex items-end justify-center pb-3">
                  <span className="text-[11px] font-semibold smallcaps tracking-wider" style={{ color: GOLD }}>
                    Position license in frame
                  </span>
                </div>
              </div>
              <div className="text-sm space-y-1.5 mb-3" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Auto-fills name + address</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Date of birth, license number</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> State + expiration</div>
              </div>
              <div className="rounded-md p-3 text-[12px]" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                Available on mobile devices — uses your phone's camera. In production: powered by Microblink BlinkID OCR.
              </div>
            </div>
            <div className="px-5 py-3 flex justify-end" style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={() => setShowLicense(false)}>Close</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== DEAL BUILDER TAB ========================= */

