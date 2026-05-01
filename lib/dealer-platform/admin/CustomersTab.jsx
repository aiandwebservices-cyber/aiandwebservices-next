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

export function CustomersTab({ leads, sold, appointments, deals, flash }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const customers = useMemo(() => {
    const map = new Map();
    const keyFor = (rec) => (rec.email || '').toLowerCase().trim() || (rec.phone || '').replace(/\D/g, '') || (rec.name || rec.customerName || '').toLowerCase().trim();
    const upsert = (key, data) => {
      const cur = map.get(key) || {
        id: 'cu-' + key.slice(0, 12),
        name: data.name || data.customerName || data.buyerName || 'Unknown',
        email: data.email || data.buyerEmail || '',
        phone: data.phone || data.buyerPhone || '',
        leads: [], sold: [], service: [], deals: [],
        firstSeen: data.when || data.createdAt || data.saleDate || new Date().toISOString(),
        lastSeen:  data.when || data.createdAt || data.saleDate || new Date().toISOString(),
        notes: ''
      };
      if (!cur.email && (data.email || data.buyerEmail)) cur.email = data.email || data.buyerEmail;
      if (!cur.phone && (data.phone || data.buyerPhone)) cur.phone = data.phone || data.buyerPhone;
      const stamp = data.when || data.createdAt || data.saleDate;
      if (stamp) {
        if (new Date(stamp) < new Date(cur.firstSeen)) cur.firstSeen = stamp;
        if (new Date(stamp) > new Date(cur.lastSeen))  cur.lastSeen = stamp;
      }
      map.set(key, cur);
      return cur;
    };
    leads.forEach(l => { const k = keyFor(l); if (!k) return; const c = upsert(k, { name: l.name, email: l.email, phone: l.phone, createdAt: l.createdAt }); c.leads.push(l); });
    sold.forEach(s => { const k = keyFor({ name: s.buyerName, email: s.buyerEmail, phone: s.buyerPhone }); if (!k) return; const c = upsert(k, { name: s.buyerName, email: s.buyerEmail, phone: s.buyerPhone, saleDate: s.saleDate }); c.sold.push(s); });
    appointments.forEach(a => { const k = keyFor(a); if (!k) return; const c = upsert(k, { name: a.customerName, email: a.email, phone: a.phone, when: a.when }); c.service.push(a); });
    deals.forEach(d => { const k = keyFor({ name: d.customerName, email: d.customerEmail, phone: d.customerPhone }); if (!k) return; const c = upsert(k, { name: d.customerName, email: d.customerEmail, phone: d.customerPhone }); c.deals.push(d); });
    return Array.from(map.values()).map(c => ({
      ...c,
      ltv: c.sold.reduce((s, x) => s + (x.salePrice || 0), 0),
      status: c.sold.length > 0 ? 'Active' : (c.leads.length > 0 ? 'Prospect' : (c.service.length > 0 ? 'Service Customer' : 'Other'))
    }));
  }, [leads, sold, appointments, deals]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => [c.name, c.email, c.phone].join(' ').toLowerCase().includes(q));
  }, [customers, search]);

  const fmt$ = (n) => '$' + Math.round(n).toLocaleString();
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const statusColors = {
    'Active':           { bg: '#D1FAE5', fg: '#065F46' },
    'Prospect':         { bg: '#FEF3C7', fg: '#92400E' },
    'Service Customer': { bg: '#E0E7FF', fg: '#3730A3' },
    'Other':            { bg: '#E7E5E4', fg: '#57534E' }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Unified profiles across leads, deals, sales, and service. {customers.length} total.
          </p>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-[10px] smallcaps font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2.5 text-left">Name</th>
                <th className="px-3 py-2.5 text-left">Contact</th>
                <th className="px-3 py-2.5 text-right">Vehicles</th>
                <th className="px-3 py-2.5 text-right">Service</th>
                <th className="px-3 py-2.5 text-right">Lifetime $</th>
                <th className="px-3 py-2.5 text-left">First Contact</th>
                <th className="px-3 py-2.5 text-left">Last Activity</th>
                <th className="px-3 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 px-4">
                  <BadgeCheck className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold mb-1">No customers found</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Customers are auto-built from leads, deals, sales, and service appointments.</div>
                </td></tr>
              ) : filtered.map(c => {
                const sc = statusColors[c.status];
                return (
                  <React.Fragment key={c.id}>
                    <tr onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                      className={`cursor-pointer transition themed-row ${expanded === c.id ? 'bg-stone-50' : ''}`}>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-3 py-3">
                        <div className="text-[12px]">{c.email || <span className="text-stone-400">no email</span>}</div>
                        <div className="text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{c.phone}</div>
                      </td>
                      <td className="px-3 py-3 text-right tabular">{c.sold.length}</td>
                      <td className="px-3 py-3 text-right tabular">{c.service.length}</td>
                      <td className="px-3 py-3 text-right tabular font-semibold" style={{ color: c.ltv > 0 ? GOLD : 'var(--text-muted)' }}>
                        {c.ltv > 0 ? fmt$(c.ltv) : '—'}
                      </td>
                      <td className="px-3 py-3 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{fmtDate(c.firstSeen)}</td>
                      <td className="px-3 py-3 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{fmtDate(c.lastSeen)}</td>
                      <td className="px-3 py-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full smallcaps"
                          style={{ backgroundColor: sc.bg, color: sc.fg }}>{c.status}</span>
                      </td>
                    </tr>
                    {expanded === c.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-5" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <div className="grid lg:grid-cols-3 gap-4">
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Vehicles purchased</div>
                              {c.sold.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No purchases yet.</div> : c.sold.map(s => (
                                <div key={s.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{s.year} {s.make} {s.model}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(s.saleDate)} · {fmt$(s.salePrice)}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Lead history</div>
                              {c.leads.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No leads.</div> : c.leads.map(l => (
                                <div key={l.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{l.source}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(l.createdAt)} · {l.vehicleLabel}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Service history</div>
                              {c.service.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No appointments.</div> : c.service.map(s => (
                                <div key={s.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{s.serviceType}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(s.when)} · ${s.estimate}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4 lg:col-span-3">
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Lifetime Value</div>
                                  <div className="font-display text-2xl tabular font-semibold" style={{ color: GOLD }}>{fmt$(c.ltv)}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Touchpoints</div>
                                  <div className="font-display text-2xl tabular font-semibold">{c.leads.length + c.sold.length + c.service.length + c.deals.length}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Customer Since</div>
                                  <div className="font-display text-2xl tabular font-semibold">{fmtDate(c.firstSeen)}</div>
                                </div>
                              </div>
                            </Card>
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
      </Card>
    </div>
  );
}

/* ====================== REPORTING TAB ============================ */

