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

export function SettingsTab({ settings, setSettings, flash }) {
  const cfg = useAdminConfig();
  const locName = cfg.dealerName ? `${cfg.dealerName} — Main Lot` : 'Main Lot';
  const locAddr = cfg.address ? `${cfg.address.street || ''}, ${cfg.address.city || ''}, ${cfg.address.state || ''} ${cfg.address.zip || ''}`.replace(/^,\s*|\s*,\s*$/g, '').trim() : '';
  const locPhone = cfg.phone || '';
  const [savedPulse, setSavedPulse] = useState(false);
  const isInitialRef = useRef(true);
  useEffect(() => {
    if (isInitialRef.current) { isInitialRef.current = false; return; }
    setSavedPulse(true);
    const t = setTimeout(() => setSavedPulse(false), 1400);
    return () => clearTimeout(t);
  }, [settings]);
  const set = (path, value) => {
    setSettings(s => {
      const next = JSON.parse(JSON.stringify(s));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] = cur[keys[i]] || {};
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // ---- AI agent toggles default to enabled where the integration is local ----
  const ai = settings.ai || {};
  const aiVal = (key, fallback = true) => (ai[key] === undefined ? fallback : !!ai[key]);

  // ---- Integration connect modal ----
  const [connectModal, setConnectModal] = useState(null);
  const [qbOAuthModal, setQbOAuthModal] = useState(false);
  // shape: { key, name, fields: [{ name, label, type?, placeholder?, hint? }] }
  const integrations = settings.integrations || {};
  const integrationConnected = (key) => !!integrations[key]?.connected;
  const openConnect = (key, name, fields) =>
    setConnectModal({
      key, name, fields,
      defaults: fields.reduce(
        (acc, f) => ({ ...acc, [f.name]: integrations[key]?.[f.name] ?? '' }),
        {},
      ),
    });
  const saveConnection = (values) => {
    if (!connectModal) return;
    setSettings((s) => ({
      ...s,
      integrations: {
        ...(s.integrations || {}),
        [connectModal.key]: { ...values, connected: true },
      },
    }));
    flash(`${connectModal.name} connected`, 'success');
    setConnectModal(null);
  };
  const disconnect = (key, name) => {
    setSettings((s) => ({
      ...s,
      integrations: { ...(s.integrations || {}), [key]: { connected: false } },
    }));
    flash(`${name} disconnected`);
  };

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Configure your dealership profile, notifications, and integrations.</p>
      </div>

      {/* Dealership Info */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Dealership Info</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Dealership Name"><Input value={settings.dealership.name} onChange={(e) => set('dealership.name', e.target.value)} /></Field>
          <Field label="Logo URL"><Input value={settings.dealership.logoUrl || ''} onChange={(e) => set('dealership.logoUrl', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Street Address" className="md:col-span-2"><Input value={settings.dealership.address} onChange={(e) => set('dealership.address', e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-3 md:col-span-2">
            <Field label="City"><Input value={settings.dealership.city} onChange={(e) => set('dealership.city', e.target.value)} /></Field>
            <Field label="State"><Input value={settings.dealership.state} onChange={(e) => set('dealership.state', e.target.value)} maxLength={2} /></Field>
            <Field label="ZIP"><Input value={settings.dealership.zip} onChange={(e) => set('dealership.zip', e.target.value)} /></Field>
          </div>
          <Field label="Phone"><Input value={settings.dealership.phone} onChange={(e) => set('dealership.phone', e.target.value)} /></Field>
          <Field label="Email"><Input value={settings.dealership.email} onChange={(e) => set('dealership.email', e.target.value)} /></Field>
          <Field label="Website URL" className="md:col-span-2"><Input value={settings.dealership.website} onChange={(e) => set('dealership.website', e.target.value)} /></Field>
        </div>

        <div className="mt-5">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Hours of Operation</div>
          <div className="space-y-2.5 divide-y divide-stone-100">
            {days.map(d => (
              <div key={d} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap pt-2.5">
                <div className="w-12 text-sm font-semibold smallcaps text-stone-600">{d}</div>
                <Toggle checked={!settings.dealership.hours[d].closed}
                  onChange={(v) => set(`dealership.hours.${d}.closed`, !v)} />
                {settings.dealership.hours[d].closed ? (
                  <span className="text-xs text-stone-400 italic">Closed</span>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input type="time" value={settings.dealership.hours[d].open}
                      onChange={(e) => set(`dealership.hours.${d}.open`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                    <span className="text-stone-400 text-xs">to</span>
                    <input type="time" value={settings.dealership.hours[d].close}
                      onChange={(e) => set(`dealership.hours.${d}.close`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Lead Notifications</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Toggle checked={settings.notifications.emailAlerts}
              onChange={(v) => set('notifications.emailAlerts', v)} label="Email alerts on new leads" />
            <Field label="Alert email"><Input value={settings.notifications.alertEmail}
              onChange={(e) => set('notifications.alertEmail', e.target.value)} /></Field>
          </div>
          <div className="space-y-4">
            <Toggle checked={settings.notifications.smsAlerts}
              onChange={(v) => set('notifications.smsAlerts', v)} label="SMS alerts on new leads" />
            <Field label="Alert phone"><Input value={settings.notifications.alertPhone}
              onChange={(e) => set('notifications.alertPhone', e.target.value)} /></Field>
          </div>
          <Field label="Speed-to-lead target" className="md:col-span-2 max-w-xs">
            <Select value={settings.notifications.speedToLead}
              onChange={(e) => set('notifications.speedToLead', e.target.value)}>
              {['5 min','15 min','30 min','1 hour'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      {/* AI Agent Configuration */}
      <Card className="p-6 relative overflow-hidden"
        style={{ borderColor: `${GOLD}55`, boxShadow: `0 0 0 1px ${GOLD}22` }}>
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="font-display text-xl font-medium">🤖 AI Agent Configuration</h2>
            <span className="text-[10px] smallcaps font-semibold ml-1 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Active</span>
          </div>
          <p className="text-sm text-stone-500 mb-5">
            Six AI features keep your lot moving — toggle any of them on or off.
          </p>

          {/* Toggle row helper renders inline (kept simple, no extra component) */}
          <div className="space-y-4 divide-y divide-stone-100">
            {/* a. Chat */}
            <div className="pt-1 first:pt-0 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('chatAgent', true)} onChange={(v) => set('ai.chatAgent', v)}
                label="AI Sales Agent (Chat)"
                description="Responds to customer questions on your website 24/7 using your real inventory data" />
              <span className="text-[11px] whitespace-nowrap inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                🟢 Active — 142 conversations this month
              </span>
            </div>

            {/* b. SMS */}
            <div className="pt-4 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('smsAgent', false)} onChange={(v) => set('ai.smsAgent', v)}
                label="AI Sales Agent (SMS)"
                description="Responds to incoming text messages with inventory-aware answers" />
              {aiVal('smsAgent', false) ? (
                <span className="text-[11px] whitespace-nowrap inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                  🟢 Active
                </span>
              ) : (
                <span className="text-[11px] whitespace-nowrap text-amber-700">
                  Configure Twilio in Integrations to enable
                </span>
              )}
            </div>

            {/* c. Auto-Descriptions */}
            <div className="pt-4 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('autoDescriptions', true)} onChange={(v) => set('ai.autoDescriptions', v)}
                label="AI Auto-Descriptions"
                description="Automatically generate listing descriptions when new vehicles are added" />
              <span className="text-[11px] whitespace-nowrap text-stone-500">
                45 descriptions generated this month — $0.04 total
              </span>
            </div>

            {/* d. Lead Scoring */}
            <div className="pt-4 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('leadScoring', true)} onChange={(v) => set('ai.leadScoring', v)}
                label="AI Lead Scoring"
                description="Automatically score and prioritize new leads based on behavior and intent signals" />
              <span className="text-[11px] whitespace-nowrap text-stone-500">
                89 leads scored this month
              </span>
            </div>

            {/* e. Follow-Up Sequences */}
            <div className="pt-4 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('followUpSequences', true)} onChange={(v) => set('ai.followUpSequences', v)}
                label="AI Follow-Up Sequences"
                description="Generate personalized follow-up messages for each lead based on their specific vehicle interest" />
              <span className="text-[11px] whitespace-nowrap text-stone-500">
                34 sequences generated — $0.14 total
              </span>
            </div>

            {/* f. Review Responses */}
            <div className="pt-4 flex items-start justify-between gap-4">
              <Toggle checked={aiVal('reviewResponses', true)} onChange={(v) => set('ai.reviewResponses', v)}
                label="AI Review Responses"
                description="Auto-draft responses to Google reviews in your voice for one-tap approval" />
              <span className="text-[11px] whitespace-nowrap text-stone-500">
                12 responses drafted this month — $0.01 total
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Usage This Month */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">AI Usage This Month</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Detailed breakdown of every AI call across your platform.
        </p>
        <div className="overflow-x-auto rounded-md border border-stone-200">
          <table className="text-sm w-full">
            <thead className="bg-stone-50">
              <tr className="text-[10px] smallcaps font-semibold text-stone-500">
                <th className="px-4 py-2 text-left">Feature</th>
                <th className="px-4 py-2 text-right">Calls</th>
                <th className="px-4 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 tabular">
              {[
                ['Chat conversations', 142, 2.84],
                ['Descriptions', 45, 0.04],
                ['Lead scoring', 89, 0.00],
                ['Follow-up sequences', 34, 0.14],
                ['Review responses', 12, 0.01],
                ['Price analysis', 8, 0.00],
              ].map(([feat, calls, cost]) => (
                <tr key={feat}>
                  <td className="px-4 py-2 text-stone-700">{feat}</td>
                  <td className="px-4 py-2 text-right text-stone-700">{calls}</td>
                  <td className="px-4 py-2 text-right text-stone-700">${cost.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-stone-50 font-semibold">
                <td className="px-4 py-2">TOTAL</td>
                <td className="px-4 py-2 text-right">330</td>
                <td className="px-4 py-2 text-right">$3.03</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[11px] text-stone-500 italic">
          AI costs are included in your plan — no extra charges.
        </div>
      </Card>

      {/* Commission Rules */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Commission Structure</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Drives the per-deal commission shown on the Sold tab.
        </p>

        {(() => {
          const c = settings.commission || {};
          const type = c.type || 'percentage';
          return (
            <div className="space-y-5">
              <Field label="Commission type" className="max-w-sm">
                <Select value={type} onChange={(e) => set('commission.type', e.target.value)}>
                  <option value="percentage">Percentage of front gross</option>
                  <option value="flat">Flat per unit</option>
                  <option value="tiered">Tiered (graduated)</option>
                </Select>
              </Field>

              {type === 'percentage' && (
                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
                  <Field label="Rate (% of front gross)">
                    <Input type="number" min={0} max={100} value={c.rate ?? 25}
                      onChange={(e) => set('commission.rate', Number(e.target.value) || 0)} />
                  </Field>
                  <Field label="Minimum per unit ($)">
                    <Input type="number" min={0} value={c.minimum ?? 200}
                      onChange={(e) => set('commission.minimum', Number(e.target.value) || 0)} />
                  </Field>
                  <Field label="Maximum per unit ($)">
                    <Input type="number" min={0} value={c.maximum ?? 2000}
                      onChange={(e) => set('commission.maximum', Number(e.target.value) || 0)} />
                  </Field>
                </div>
              )}

              {type === 'flat' && (
                <div className="grid sm:grid-cols-2 gap-4 max-w-md">
                  <Field label="Flat amount per unit ($)">
                    <Input type="number" min={0} value={c.flatAmount ?? 500}
                      onChange={(e) => set('commission.flatAmount', Number(e.target.value) || 0)} />
                  </Field>
                </div>
              )}

              {type === 'tiered' && (
                <div className="space-y-3 max-w-lg">
                  <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                    <div className="text-xs text-stone-600">$0–$2,000 front gross</div>
                    <Field label="Flat ($)">
                      <Input type="number" min={0} value={c.tier1Flat ?? 200}
                        onChange={(e) => set('commission.tier1Flat', Number(e.target.value) || 0)} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                    <div className="text-xs text-stone-600">$2,001–$4,000</div>
                    <Field label="Rate (%)">
                      <Input type="number" min={0} max={100} value={c.tier2Pct ?? 20}
                        onChange={(e) => set('commission.tier2Pct', Number(e.target.value) || 0)} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                    <div className="text-xs text-stone-600">$4,001+</div>
                    <Field label="Rate (%)">
                      <Input type="number" min={0} max={100} value={c.tier3Pct ?? 25}
                        onChange={(e) => set('commission.tier3Pct', Number(e.target.value) || 0)} />
                    </Field>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 grid sm:grid-cols-2 gap-4 max-w-lg">
                <Field label="Pack amount ($)"
                  hint="Standard dealer overhead deducted before front-gross calc.">
                  <Input type="number" min={0} value={c.pack ?? 500}
                    onChange={(e) => set('commission.pack', Number(e.target.value) || 0)} />
                </Field>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Website Customization */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Website Customization</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Colors sync to your customer-facing website automatically.</p>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input type="color" value={settings.branding.primaryColor}
                  onChange={(e) => set('branding.primaryColor', e.target.value)}
                  className="w-10 h-10 rounded border border-stone-300 cursor-pointer" />
                <Input value={settings.branding.primaryColor} onChange={(e) => set('branding.primaryColor', e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Accent Color">
              <div className="flex items-center gap-2">
                <input type="color" value={settings.branding.accentColor}
                  onChange={(e) => set('branding.accentColor', e.target.value)}
                  className="w-10 h-10 rounded border border-stone-300 cursor-pointer" />
                <Input value={settings.branding.accentColor} onChange={(e) => set('branding.accentColor', e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Background Theme">
              <div className="flex bg-stone-100 rounded-md p-0.5">
                {['Light','Dark'].map(t => (
                  <button key={t} onClick={() => set('branding.theme', t)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded ${settings.branding.theme === t ? 'bg-white shadow-sm' : 'text-stone-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
        <div className="mt-5 p-4 rounded-md flex items-center gap-3"
          style={{ background: `linear-gradient(135deg, ${settings.branding.primaryColor}15 0%, ${settings.branding.accentColor}15 100%)` }}>
          <div className="w-10 h-10 rounded-md" style={{ backgroundColor: settings.branding.primaryColor }} />
          <div className="w-10 h-10 rounded-md" style={{ backgroundColor: settings.branding.accentColor }} />
          <div className="flex-1 text-xs text-stone-600">
            Live preview — your site uses these colors as soon as you save.
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-stone-100">
          <Toggle checked={settings.branding.hablamosEspanol}
            onChange={(v) => set('branding.hablamosEspanol', v)}
            label={<span className="flex items-center gap-2"><Languages className="w-3.5 h-3.5" /> Hablamos Español</span>}
            description="Enables full Spanish translation toggle on your customer site" />
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Social Links</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['facebook', Facebook, 'Facebook', '#1877F2'],
            ['instagram', Instagram, 'Instagram', '#E1306C'],
            ['tiktok', MessageSquare, 'TikTok', '#000000'],
            ['youtube', Youtube, 'YouTube', '#FF0000'],
            ['google', MapPin, 'Google Business Profile', '#4285F4']
          ].map(([key, Icon, label, color]) => (
            <Field key={key} label={label}>
              <div className="relative">
                <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color }} />
                <Input value={settings.social[key] || ''}
                  onChange={(e) => set('social.' + key, e.target.value)}
                  placeholder={`${label.toLowerCase()}.com/yourpage`}
                  className="pl-9" />
              </div>
            </Field>
          ))}
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Integrations</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Connect external services to unlock SMS, email, payments, vehicle history, and more.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {/* EspoCRM — always connected */}
          <div className="p-4 border-2 rounded-md flex items-start gap-3"
            style={{ borderColor: '#256B4033', backgroundColor: '#E8F2EC55' }}>
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#3B5998' }}>E</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">EspoCRM</div>
                <span className="text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>🟢 Connected</span>
              </div>
              <div className="text-[11px] text-stone-500">CRM backbone for leads, vehicles, and service.</div>
            </div>
          </div>

          {/* Twilio */}
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#F22F46' }}>T</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">Twilio</div>
                <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  integrationConnected('twilio')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {integrationConnected('twilio') ? '🟢 Connected' : '🔴 Not configured'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 mb-2">SMS for leads, appointments, and AI agent.</div>
              {integrationConnected('twilio') ? (
                <Btn size="sm" variant="ghost" onClick={() => disconnect('twilio', 'Twilio')}>Disconnect</Btn>
              ) : (
                <Btn size="sm" variant="outlineGold" onClick={() => openConnect('twilio', 'Twilio', [
                  { name: 'accountSid', label: 'Account SID', placeholder: 'AC…' },
                  { name: 'authToken',  label: 'Auth Token',  type: 'password' },
                  { name: 'phoneNumber',label: 'Twilio Phone Number', placeholder: '+1305…' },
                ])}>Connect</Btn>
              )}
            </div>
          </div>

          {/* Resend */}
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#000' }}>R</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">Resend</div>
                <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  integrationConnected('resend')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {integrationConnected('resend') ? '🟢 Connected' : '🔴 Not configured'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 mb-2">Transactional email — alerts, review requests, follow-ups.</div>
              {integrationConnected('resend') ? (
                <Btn size="sm" variant="ghost" onClick={() => disconnect('resend', 'Resend')}>Disconnect</Btn>
              ) : (
                <Btn size="sm" variant="outlineGold" onClick={() => openConnect('resend', 'Resend', [
                  { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_…' },
                ])}>Connect</Btn>
              )}
            </div>
          </div>

          {/* Google Places — has inline Place ID input */}
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#4285F4' }}>G</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">Google Places</div>
                <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  settings.googlePlaceId
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {settings.googlePlaceId ? '🟢 Connected' : '🔴 Not configured'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 mb-2">Used for review requests and the Reputation tab.</div>
              <Field label="Google Place ID">
                <Input value={settings.googlePlaceId || ''}
                  onChange={(e) => set('googlePlaceId', e.target.value)}
                  placeholder="ChIJ…" className="font-mono text-xs" />
              </Field>
            </div>
          </div>

          {/* Stripe */}
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#635BFF' }}>S</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">Stripe</div>
                <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  integrationConnected('stripe')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {integrationConnected('stripe') ? '🟢 Connected' : '🔴 Not configured'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 mb-2">Hold deposits, service payments, and reservations.</div>
              {integrationConnected('stripe') ? (
                <Btn size="sm" variant="ghost" onClick={() => disconnect('stripe', 'Stripe')}>Disconnect</Btn>
              ) : (
                <Btn size="sm" variant="outlineGold" onClick={() => openConnect('stripe', 'Stripe', [
                  { name: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_…' },
                  { name: 'secretKey',      label: 'Secret Key',      type: 'password', placeholder: 'sk_live_…' },
                ])}>Connect</Btn>
              )}
            </div>
          </div>

          {/* CARFAX */}
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: '#D7282F' }}>C</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-sm font-semibold">CARFAX</div>
                <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  integrationConnected('carfax')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {integrationConnected('carfax') ? '🟢 Connected' : '🔴 Not configured'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 mb-2">VIN history reports for inventory listings.</div>
              {integrationConnected('carfax') ? (
                <Btn size="sm" variant="ghost" onClick={() => disconnect('carfax', 'CARFAX')}>Disconnect</Btn>
              ) : (
                <Btn size="sm" variant="outlineGold" onClick={() => openConnect('carfax', 'CARFAX', [
                  { name: 'partnerId', label: 'Partner ID' },
                  { name: 'apiKey',    label: 'API Key', type: 'password' },
                ])}>Connect</Btn>
              )}
            </div>
          </div>

          {/* QuickBooks Online */}
          {(() => {
            const qb = integrations.quickbooks || {};
            const qbConnected = !!qb.connected;
            return (
              <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center font-display font-bold text-sm shrink-0 text-white"
                  style={{ backgroundColor: '#2CA01C' }}>Q</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="text-sm font-semibold" style={{ color: '#2CA01C' }}>QuickBooks Online</div>
                    <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      qbConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {qbConnected ? `🟢 Connected — ${qb.companyName || 'Company'}` : '🔴 Not connected'}
                    </span>
                  </div>
                  {qbConnected ? (
                    <div className="space-y-2">
                      <Toggle checked={!!qb.autoSyncSales}
                        onChange={(v) => set('integrations.quickbooks.autoSyncSales', v)}
                        label="Auto-sync vehicle sales" />
                      <Toggle checked={!!qb.autoSyncService}
                        onChange={(v) => set('integrations.quickbooks.autoSyncService', v)}
                        label="Auto-sync service payments" />
                      <Btn size="sm" variant="ghost" className="text-red-600 hover:text-red-700 mt-1"
                        onClick={() => {
                          set('integrations.quickbooks.connected', false);
                          set('integrations.quickbooks.companyName', null);
                          flash('QuickBooks disconnected');
                        }}>Disconnect</Btn>
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] text-stone-500 mb-2">
                        Automatically record vehicle sales, track expenses, and sync customer data.
                      </div>
                      <Btn size="sm" variant="outlineGold"
                        onClick={() => setQbOAuthModal(true)}>Connect QuickBooks</Btn>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </Card>

      {/* Credit & Lending Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Credit &amp; Lending</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Connect credit bureaus and lender platforms to run soft pulls and submit financing applications directly from the Deal Builder.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 700Credit */}
          {(() => {
            const cr = integrations.credit || {};
            const ready = !!(cr.enabled && cr.apiKey && cr.dealerId);
            return (
              <div className="p-4 border rounded-md" style={{ borderColor: ready ? '#A7F3D0' : '#E5E7EB' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold" style={{ color: '#1A56C4' }}>700Credit</span>
                  </div>
                  <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {ready ? '🟢 Active' : '⚪ Not configured'}
                  </span>
                </div>
                <Toggle checked={!!cr.enabled}
                  onChange={(v) => set('integrations.credit.enabled', v)}
                  label="Enable soft and hard credit pulls" />
                <div className="text-[10px] text-stone-400 mt-1 mb-3">
                  Pulls from Experian, Equifax, and TransUnion · ~$2–5 per pull, billed by 700Credit
                </div>
                <div className="space-y-2">
                  <Field label="API Key">
                    <Input type="password" value={cr.apiKey || ''}
                      onChange={(e) => set('integrations.credit.apiKey', e.target.value)}
                      placeholder="700credit-api-key" className="font-mono text-xs" />
                  </Field>
                  <Field label="Dealer ID">
                    <Input value={cr.dealerId || ''}
                      onChange={(e) => set('integrations.credit.dealerId', e.target.value)}
                      placeholder="e.g. D-12345" className="font-mono text-xs" />
                  </Field>
                </div>
              </div>
            );
          })()}

          {/* RouteOne */}
          {(() => {
            const ro = integrations.routeone || {};
            const ready = !!(ro.enabled && ro.dealerId && ro.username);
            return (
              <div className="p-4 border rounded-md" style={{ borderColor: ready ? '#A7F3D0' : '#E5E7EB' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold" style={{ color: '#003D6B' }}>RouteOne</span>
                  </div>
                  <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {ready ? '🟢 Active' : '⚪ Not configured'}
                  </span>
                </div>
                <Toggle checked={!!ro.enabled}
                  onChange={(v) => set('integrations.routeone.enabled', v)}
                  label="Submit to 1,200+ lenders via RouteOne" />
                <div className="text-[10px] text-stone-400 mt-1 mb-3">
                  Requires RouteOne dealer enrollment
                </div>
                <div className="space-y-2">
                  <Field label="Dealer ID">
                    <Input value={ro.dealerId || ''}
                      onChange={(e) => set('integrations.routeone.dealerId', e.target.value)}
                      placeholder="RO-12345" className="font-mono text-xs" />
                  </Field>
                  <Field label="Username">
                    <Input value={ro.username || ''}
                      onChange={(e) => set('integrations.routeone.username', e.target.value)}
                      placeholder="dealer@routeone.net" className="font-mono text-xs" />
                  </Field>
                </div>
              </div>
            );
          })()}

          {/* DealerTrack */}
          {(() => {
            const dt = integrations.dealertrack || {};
            const ready = !!(dt.enabled && dt.dealerId && dt.username);
            return (
              <div className="p-4 border rounded-md" style={{ borderColor: ready ? '#A7F3D0' : '#E5E7EB' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold" style={{ color: '#D6492C' }}>DealerTrack</span>
                  </div>
                  <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {ready ? '🟢 Active' : '⚪ Not configured'}
                  </span>
                </div>
                <Toggle checked={!!dt.enabled}
                  onChange={(v) => set('integrations.dealertrack.enabled', v)}
                  label="Submit to DealerTrack lender network" />
                <div className="text-[10px] text-stone-400 mt-1 mb-3">
                  Requires DealerTrack dealer enrollment
                </div>
                <div className="space-y-2">
                  <Field label="Dealer ID">
                    <Input value={dt.dealerId || ''}
                      onChange={(e) => set('integrations.dealertrack.dealerId', e.target.value)}
                      placeholder="DT-12345" className="font-mono text-xs" />
                  </Field>
                  <Field label="Username">
                    <Input value={dt.username || ''}
                      onChange={(e) => set('integrations.dealertrack.username', e.target.value)}
                      placeholder="dealer@dealertrack.com" className="font-mono text-xs" />
                  </Field>
                </div>
              </div>
            );
          })()}
        </div>
      </Card>

      {/* Vehicle History Reports — CARFAX + AutoCheck badge display */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Vehicle History Reports</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Display CARFAX and AutoCheck badges on your inventory using your existing dealer subscription.
          Customers can click the badge to view the full report.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* CARFAX */}
          {(() => {
            const cx = settings.integrations?.carfax || {};
            const ready = !!(cx.enabled && cx.dealerId);
            return (
              <div className="p-4 border rounded-md" style={{ borderColor: ready ? '#A7F3D0' : '#E5E7EB' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold" style={{ color: '#003478', letterSpacing: '0.5px' }}>CARFAX</span>
                    <span className="text-[11px] text-stone-500">Vehicle History</span>
                  </div>
                  <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {ready ? '🟢 Connected' : '⚪ Not configured'}
                  </span>
                </div>
                <Toggle
                  checked={!!cx.enabled}
                  onChange={(v) => set('integrations.carfax.enabled', v)}
                  label="Display CARFAX badges on vehicle listings"
                />
                <div className="mt-3">
                  <Field label="CARFAX Dealer ID"
                    hint="Your CARFAX Dealer ID is on your CARFAX dealer portal. Customers will see CARFAX badges and can click to view the report.">
                    <Input value={cx.dealerId || ''}
                      onChange={(e) => set('integrations.carfax.dealerId', e.target.value)}
                      placeholder="e.g. 12345" className="font-mono text-xs" />
                  </Field>
                </div>
              </div>
            );
          })()}

          {/* AutoCheck */}
          {(() => {
            const ac = settings.integrations?.autocheck || {};
            const ready = !!(ac.enabled && ac.accountId);
            return (
              <div className="p-4 border rounded-md" style={{ borderColor: ready ? '#A7F3D0' : '#E5E7EB' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold" style={{ color: '#0033A0' }}>AutoCheck</span>
                    <span className="text-[11px] text-stone-500">by Experian</span>
                  </div>
                  <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {ready ? '🟢 Connected' : '⚪ Not configured'}
                  </span>
                </div>
                <Toggle
                  checked={!!ac.enabled}
                  onChange={(v) => set('integrations.autocheck.enabled', v)}
                  label="Display AutoCheck badges on vehicle listings"
                />
                <div className="mt-3">
                  <Field label="AutoCheck Account / Site ID"
                    hint="Your AutoCheck Site ID from the Experian dealer portal. Customers can view the AutoCheck Score.">
                    <Input value={ac.accountId || ''}
                      onChange={(e) => set('integrations.autocheck.accountId', e.target.value)}
                      placeholder="e.g. 100123" className="font-mono text-xs" />
                  </Field>
                </div>
              </div>
            );
          })()}
        </div>
      </Card>

      {/* Listing Syndication — marketplace credentials */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Listing Syndication</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Connect each marketplace once — listings sync automatically per the schedule in Marketing.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { key: 'carscom',    label: 'Cars.com',    color: '#0066A1', fields: [{ name: 'apiKey',  label: 'Cars.com API Key', type: 'password', placeholder: 'cars_…' }] },
            { key: 'autotrader', label: 'AutoTrader',  color: '#E25319', fields: [{ name: 'dealerId', label: 'AutoTrader Dealer ID', placeholder: 'AT-…' }] },
            { key: 'cargurus',   label: 'CarGurus',    color: '#0E8A5F', fields: [{ name: 'dealerId', label: 'CarGurus Dealer ID',   placeholder: 'CG-…' }] },
            { key: 'facebook',   label: 'Facebook Marketplace', color: '#1877F2', fields: [{ name: 'pageId', label: 'Facebook Page ID', placeholder: '1234567890' }] },
          ].map((p) => {
            const connected = integrationConnected(p.key);
            return (
              <div key={p.key} className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
                  style={{ backgroundColor: p.color }}>{p.label[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="text-sm font-semibold">{p.label}</div>
                    <span className={`text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      connected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {connected ? '🟢 Connected' : '🔴 Not configured'}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mb-2">
                    {p.fields.map((f) => f.label).join(' · ')}
                  </div>
                  {connected ? (
                    <Btn size="sm" variant="ghost" onClick={() => disconnect(p.key, p.label)}>Disconnect</Btn>
                  ) : (
                    <Btn size="sm" variant="outlineGold" onClick={() => openConnect(p.key, p.label, p.fields)}>Connect</Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* QuickBooks OAuth modal */}
      {qbOAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-24 anim-fade"
          onClick={() => setQbOAuthModal(false)}>
          <div className="rounded-lg shadow-xl max-w-sm w-full"
            style={{ backgroundColor: 'var(--bg-card)' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: '#2CA01C' }}>Q</div>
                <div>
                  <div className="font-display text-base font-semibold">Connect QuickBooks Online</div>
                  <div className="text-[11px] text-stone-500">You'll be redirected to Intuit to authorize LotPilot</div>
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-md p-4 mb-4 space-y-2">
                <div className="text-[11px] font-semibold text-stone-700 mb-2">LotPilot will be able to:</div>
                {[
                  'Create journal entries for vehicle sales',
                  'Sync customer records',
                  'Record service payments',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-[11px] text-stone-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-stone-400">
                  No access to your bank accounts or tax information.
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={() => setQbOAuthModal(false)}>Cancel</Btn>
              <Btn variant="gold" icon={Check}
                onClick={() => {
                  setQbOAuthModal(false);
                  set('integrations.quickbooks.connected', true);
                  set('integrations.quickbooks.companyName', 'Primo Auto LLC');
                  flash('QuickBooks connected!', 'success');
                }}>Authorize</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Connect modal — generic single/multi-input dialog */}
      <ConfirmDialog
        isOpen={!!connectModal}
        title={connectModal ? `Connect ${connectModal.name}` : ''}
        message={connectModal ? `Enter your ${connectModal.name} credentials. Stored locally — keys are not validated yet.` : ''}
        confirmLabel="Save & Connect"
        confirmColor="gold"
        cancelLabel="Cancel"
        inputs={connectModal
          ? connectModal.fields.map((f) => ({
              name: f.name,
              label: f.label,
              type: f.type || 'text',
              placeholder: f.placeholder || '',
              hint: f.hint,
              defaultValue: connectModal.defaults?.[f.name] || '',
            }))
          : []}
        onConfirm={saveConnection}
        onCancel={() => setConnectModal(null)}
      />

      {/* Branding footer */}
      <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: GOLD }}>Powered by</div>
            <div className="font-display text-2xl font-medium tracking-tight leading-none">
              AI<span style={{ color: GOLD }}>and</span>WEB<span className="text-stone-400">services</span>
            </div>
            <div className="text-xs text-stone-400 mt-2 max-w-md">
              Custom dealership platforms — websites, lead automation, deal builders, and review management.
              Built for high-volume independent dealers.
            </div>
          </div>
          <a href="https://aiandwebservices.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm font-semibold transition">
            Visit AIandWEBservices <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>

      {/* Locations */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-stone-500" />
          <h3 className="font-display text-lg font-semibold">Locations</h3>
        </div>
        <div className="rounded-md p-4 mb-3" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold">{locName}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{locAddr || '—'}</div>
              <div className="text-sm tabular" style={{ color: 'var(--text-secondary)' }}>{locPhone || '—'}</div>
            </div>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full smallcaps"
              style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Active</span>
          </div>
        </div>
        <button disabled
          className="w-full p-4 rounded-md flex items-center gap-3 cursor-not-allowed opacity-70"
          style={{ border: '2px dashed var(--border-strong)', backgroundColor: 'var(--bg-card)' }}>
          <Shield className="w-4 h-4 text-stone-400" />
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add Location
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Growth</span>
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Multi-location management available on Growth plan ($349/mo)
            </div>
          </div>
        </button>
      </Card>

      <div className={`flex justify-end items-center gap-2 pt-2 px-3 py-2 rounded-md transition ${savedPulse ? 'saved-pulse' : ''}`}>
        <Check className={`w-4 h-4 ${savedPulse ? 'text-emerald-600' : 'text-stone-400'}`} strokeWidth={2.5} />
        <span className={`text-sm font-medium ${savedPulse ? 'text-emerald-700' : 'text-stone-500'}`}>
          {savedPulse ? 'Saved' : 'All changes saved automatically'}
        </span>
      </div>
    </div>
  );
}

/* ====================== SERVICE APPOINTMENTS TAB ================= */

