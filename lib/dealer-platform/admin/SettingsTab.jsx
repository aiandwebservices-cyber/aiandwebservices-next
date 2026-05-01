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
          Available on the <span className="font-semibold" style={{ color: GOLD }}>Revenue Engine plan</span> ($249/mo).
        </p>

        <div className="space-y-5">
          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect CRM</div>
            <div className="grid md:grid-cols-3 gap-2">
              {[['Salesforce','#00A1E0'],['HubSpot','#FF7A59'],['EspoCRM','#3B5998']].map(([name, color]) => (
                <button key={name}
                  className="p-3 border border-stone-200 rounded-md hover:border-stone-400 transition flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-display font-bold text-sm" style={{ backgroundColor: color }}>
                    {name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-500">Connect</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect DMS</div>
            <div className="grid md:grid-cols-2 gap-2">
              {['DealerSocket','CDK Global'].map(name => (
                <div key={name} className="p-3 border border-stone-200 rounded-md flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-md bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-sm">{name[0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-400">Enterprise plan</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect Lending</div>
            <div className="grid md:grid-cols-3 gap-2">
              {['Capital One','Ally Financial','Chase Auto'].map(name => (
                <div key={name} className="p-3 border border-stone-200 rounded-md flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-md bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-sm">{name[0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-400">Coming soon</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

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

