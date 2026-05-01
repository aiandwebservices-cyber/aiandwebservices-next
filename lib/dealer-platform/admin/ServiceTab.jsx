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

export function AppointmentsTab({ appointments, setAppointments, flash }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reschedFor, setReschedFor] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');
  const [confirmTransition, setConfirmTransition] = useState(null); // { id, target, label }
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedAppts, setSelectedAppts] = useState(new Set());

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [a.customerName, a.phone, a.vehicleMake, a.vehicleModel, a.serviceType].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(a.when) - new Date(b.when));
  }, [appointments, filter, search]);

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [filter, search]);
  const allApptsSelected = filtered.length > 0 && filtered.every(a => selectedAppts.has(a.id));
  const toggleAllAppts = () => {
    if (allApptsSelected) { const n = new Set(selectedAppts); filtered.forEach(a => n.delete(a.id)); setSelectedAppts(n); }
    else { const n = new Set(selectedAppts); filtered.forEach(a => n.add(a.id)); setSelectedAppts(n); }
  };
  const toggleOneAppt = (id) => { const n = new Set(selectedAppts); n.has(id) ? n.delete(id) : n.add(id); setSelectedAppts(n); };
  const bulkApplyAppts = (action) => {
    const ids = Array.from(selectedAppts);
    if (ids.length === 0) return;
    if (action === 'confirm')      { setAppointments(arr => arr.map(a => ids.includes(a.id) ? { ...a, status: 'Confirmed' } : a)); flash(`${ids.length} confirmed`); }
    else if (action === 'cancel')  { setAppointments(arr => arr.map(a => ids.includes(a.id) ? { ...a, status: 'Cancelled' } : a)); flash(`${ids.length} cancelled`); }
    else if (action === 'csv') {
      const headers = ['customerName','phone','email','vehicleYear','vehicleMake','vehicleModel','serviceType','when','status','estimate','advisor'];
      downloadFile(`${slug}-appointments.csv`, buildCSV(headers, appointments.filter(a => ids.includes(a.id))));
      flash(`Exported ${ids.length} appointments`);
    }
    setSelectedAppts(new Set());
  };

  const stats = useMemo(() => {
    const today = new Date(TODAY);
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);
    const weekEnd = new Date(today.getTime() + 7 * 86400000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = appointments.filter(a => {
      const d = new Date(a.when);
      return d >= today && d < tomorrow;
    }).length;
    const weekCount = appointments.filter(a => {
      const d = new Date(a.when);
      return d >= today && d < weekEnd;
    }).length;
    const completedMonth = SEED_APPT_HISTORY.filter(h =>
      h.status === 'Completed' && new Date(h.date) >= monthStart
    ).length + appointments.filter(a => a.status === 'Completed').length;

    const allMonth = SEED_APPT_HISTORY.concat(
      appointments.map(a => ({ ...a, date: a.when, amount: a.estimate }))
    ).filter(h => new Date(h.date) >= monthStart);
    const noShows = allMonth.filter(h => h.status === 'No-Show').length;
    const noShowRate = allMonth.length ? (noShows / allMonth.length * 100) : 0;

    const completedThisMonthRevenue = SEED_APPT_HISTORY
      .filter(h => h.status === 'Completed')
      .reduce((s, h) => s + (h.amount || 0), 0)
      + appointments.filter(a => a.status === 'Completed').reduce((s, a) => s + (a.estimate || 0), 0);

    return { todayCount, weekCount, completedMonth, noShowRate, revenue: completedThisMonthRevenue };
  }, [appointments]);

  const update = (id, patch) => setAppointments(arr => arr.map(a => a.id === id ? { ...a, ...patch } : a));

  const transition = (id, status) => {
    update(id, { status });
    flash(`Appointment ${status.toLowerCase()}`);
  };

  const reschedule = () => {
    if (!reschedFor || !reschedDate || !reschedTime) return;
    const iso = new Date(`${reschedDate}T${reschedTime}:00`).toISOString();
    update(reschedFor, { when: iso, status: 'Pending' });
    flash('Appointment rescheduled');
    setReschedFor(null); setReschedDate(''); setReschedTime('');
  };

  const fmtApptTime = (iso) => {
    const d = new Date(iso);
    const today = new Date(TODAY);
    const sameDay = d.toDateString() === today.toDateString();
    const tomorrow = new Date(today.getTime() + 86400000);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (sameDay) return `Today, ${time}`;
    if (isTomorrow) return `Tomorrow, ${time}`;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ', ' + time;
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Service Appointments</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your service bay schedule and customer service history.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Today's Appointments" value={stats.todayCount} icon={Calendar} accent={GOLD} />
        <StatCard label="This Week" value={stats.weekCount} icon={Clock} />
        <StatCard label="Completed This Month" value={stats.completedMonth} icon={Check} accent="#2F7A4A" />
        <StatCard label="No-Show Rate" value={stats.noShowRate.toFixed(1) + '%'}
          icon={AlertTriangle} accent={stats.noShowRate > 10 ? RED_ACCENT : '#a8a39a'}
          sub={stats.noShowRate > 10 ? 'industry avg: 8%' : 'below industry avg'} />
        <StatCard label="Service Revenue" value={fmtMoney(stats.revenue)}
          icon={DollarSign} accent={GOLD} sub={`${new Date(TODAY).toLocaleDateString('en-US', { month: 'long' })} estimated`} />
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, vehicle, service…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="flex bg-stone-100 rounded-md p-0.5 flex-wrap">
            {['all', ...APPT_STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded smallcaps ${filter === s ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {selectedAppts.size > 0 && (
        <div className="mb-3 p-3 rounded-lg flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold mr-2">{selectedAppts.size} selected</span>
          <Btn size="sm" variant="default" onClick={() => bulkApplyAppts('confirm')}>Confirm</Btn>
          <Btn size="sm" variant="default" onClick={() => bulkApplyAppts('cancel')}>Cancel</Btn>
          <Btn size="sm" variant="default" icon={Download} onClick={() => bulkApplyAppts('csv')}>Export CSV</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setSelectedAppts(new Set())}>Clear</Btn>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={toggleAllAppts} className="flex items-center justify-center">
                    {allApptsSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left">Customer</th>
                <th className="px-2 py-2.5 text-left">Vehicle</th>
                <th className="px-2 py-2.5 text-left">Service</th>
                <th className="px-2 py-2.5 text-left">Scheduled</th>
                <th className="px-2 py-2.5 text-right">Est.</th>
                <th className="px-2 py-2.5 text-left">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 px-4">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No appointments</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Service appointments will appear here once scheduled.</div>
                </td></tr>
              ) : paged.map(a => (
                <React.Fragment key={a.id}>
                  <tr onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${expanded === a.id ? 'bg-stone-50' : ''} ${selectedAppts.has(a.id) ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOneAppt(a.id)} className="flex items-center justify-center">
                        {selectedAppts.has(a.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{a.customerName}</div>
                      <div className="text-[11px] text-stone-500 tabular">{a.phone}</div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="font-medium text-[13px]">{a.vehicleYear} {a.vehicleMake} {a.vehicleModel}</div>
                      <div className="text-[10px] text-stone-400 font-mono">VIN ··{(a.vehicleVin || '').slice(-6)}</div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] rounded-full font-medium"
                        style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                        <Wrench className="w-3 h-3" />{a.serviceType}
                      </span>
                    </td>
                    <td className="px-2 py-3 tabular text-stone-700">{fmtApptTime(a.when)}</td>
                    <td className="px-2 py-3 text-right tabular font-medium">{fmtMoney(a.estimate)}</td>
                    <td className="px-2 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {a.status === 'Pending' && (
                          <Btn size="sm" variant="default" onClick={() => transition(a.id, 'Confirmed')}>Confirm</Btn>
                        )}
                        {a.status === 'Confirmed' && (
                          <Btn size="sm" variant="outlineGold" onClick={() => transition(a.id, 'In Progress')}>Start</Btn>
                        )}
                        {a.status === 'In Progress' && (
                          <Btn size="sm" variant="dark" onClick={() => transition(a.id, 'Completed')}>Complete</Btn>
                        )}
                        {(a.status === 'Pending' || a.status === 'Confirmed') && (
                          <IconBtn icon={X} title="Cancel" tone="danger" onClick={() => setConfirmTransition({ appt: a, target: 'Cancelled', label: 'Cancel appointment' })} />
                        )}
                        {a.status === 'Confirmed' && (
                          <IconBtn icon={AlertCircle} title="No-Show" tone="danger" onClick={() => setConfirmTransition({ appt: a, target: 'No-Show', label: 'Mark as no-show' })} />
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr>
                      <td colSpan={8} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="md:hidden flex justify-end mb-3">
                          <button onClick={() => setExpanded(null)}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-100">
                            Close
                          </button>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-5 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Customer Details</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="font-medium">{a.customerName}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Phone</span><a href={`tel:${a.phone}`} className="font-mono tabular hover:underline">{a.phone}</a></div>
                                <div className="flex justify-between"><span className="text-stone-500">Email</span><a href={`mailto:${a.email}`} className="font-mono text-[12px] hover:underline">{a.email}</a></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Vehicle</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Year/Make/Model</span><span className="font-medium">{a.vehicleYear} {a.vehicleMake} {a.vehicleModel}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">VIN</span><span className="font-mono text-[12px]">{a.vehicleVin}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Service Notes</div>
                              <Textarea value={a.notes || ''}
                                onChange={(e) => update(a.id, { notes: e.target.value })}
                                rows={3} placeholder="Tech notes, customer concerns, parts needed…" />
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Service History</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 text-sm text-stone-600">
                                {a.history || 'No prior service records.'}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Reschedule</div>
                              {reschedFor === a.id ? (
                                <div className="bg-white border border-stone-200 rounded-md p-4 space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={reschedDate} onChange={(e) => setReschedDate(e.target.value)}
                                      className="px-2 py-1.5 border border-stone-200 rounded text-sm tabular ring-gold" />
                                    <input type="time" value={reschedTime} onChange={(e) => setReschedTime(e.target.value)}
                                      className="px-2 py-1.5 border border-stone-200 rounded text-sm tabular ring-gold" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Btn size="sm" variant="gold" onClick={reschedule}>Save</Btn>
                                    <Btn size="sm" variant="ghost" onClick={() => setReschedFor(null)}>Cancel</Btn>
                                  </div>
                                </div>
                              ) : (
                                <Btn variant="default" icon={Calendar} className="w-full"
                                  onClick={() => {
                                    const d = new Date(a.when);
                                    setReschedDate(d.toISOString().slice(0, 10));
                                    setReschedTime(d.toISOString().slice(11, 16));
                                    setReschedFor(a.id);
                                  }}>
                                  Reschedule
                                </Btn>
                              )}
                            </div>

                            <Field label="Service Type">
                              <Select value={a.serviceType}
                                onChange={(e) => update(a.id, { serviceType: e.target.value, estimate: SERVICE_RATES[e.target.value] || a.estimate })}>
                                {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <Field label="Service Advisor">
                              <Input value={a.advisor || ''} onChange={(e) => update(a.id, { advisor: e.target.value })}
                                placeholder="Assign advisor…" />
                            </Field>

                            <Field label="Status">
                              <Select value={a.status} onChange={(e) => update(a.id, { status: e.target.value })}>
                                {APPT_STATUSES.map(s => <option key={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <a href={`tel:${a.phone}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <Phone className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Call</span>
                              </a>
                              <a href={`sms:${a.phone}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Text</span>
                              </a>
                              <a href={`mailto:${a.email}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <Mail className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Email</span>
                              </a>
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
        <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="appointment" />
      </Card>

      <ConfirmDialog
        isOpen={!!confirmTransition}
        title={confirmTransition ? `${confirmTransition.label}?` : ''}
        message={confirmTransition ? `${confirmTransition.appt.customerName} · ${confirmTransition.appt.serviceType} · ${new Date(confirmTransition.appt.when).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : ''}
        confirmLabel={confirmTransition?.target === 'No-Show' ? 'Mark No-Show' : 'Cancel Appointment'}
        cancelLabel="Keep"
        confirmColor="red"
        onConfirm={() => { transition(confirmTransition.appt.id, confirmTransition.target); setConfirmTransition(null); }}
        onCancel={() => setConfirmTransition(null)} />
    </div>
  );
}

/* ====================== PERFORMANCE TAB ========================== */

