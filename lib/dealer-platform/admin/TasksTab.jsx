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

export function TasksTab({ tasks, setTasks, leads, sold, flash }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(null);

  const filtered = useMemo(() => {
    const now = new Date(TODAY);
    const today0 = new Date(now); today0.setUTCHours(0, 0, 0, 0);
    return tasks
      .map(t => {
        const due = new Date(t.dueAt);
        const overdue = t.status !== 'Completed' && due < today0;
        return { ...t, _overdue: overdue };
      })
      .filter(t => {
        if (search) {
          const q = search.toLowerCase();
          const hay = [t.title, t.assignedTo, t.relatedTo, t.notes].join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filter === 'open') return t.status === 'Open';
        if (filter === 'overdue') return t._overdue;
        if (filter === 'today') {
          const today1 = new Date(today0); today1.setUTCDate(today1.getUTCDate() + 1);
          const due = new Date(t.dueAt);
          return t.status !== 'Completed' && due >= today0 && due < today1;
        }
        if (filter === 'completed') return t.status === 'Completed';
        return true;
      })
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [tasks, search, filter]);

  const startAdd = () => {
    setDraft({
      title: '', dueAt: isoAt(1, 10), assignedTo: TEAM_MEMBERS[0].name,
      relatedTo: '', priority: 'Medium', status: 'Open', notes: ''
    });
    setShowAdd(true);
  };
  const saveDraft = () => {
    if (!draft.title.trim()) return;
    setTasks(arr => [{ ...draft, id: 'tk-' + Date.now() }, ...arr]);
    setShowAdd(false);
    setDraft(null);
    flash('Task created');
  };
  const completeTask = (id) => {
    setTasks(arr => arr.map(t => t.id === id ? { ...t, status: 'Completed', completedAt: new Date().toISOString() } : t));
  };
  const reopenTask = (id) => {
    setTasks(arr => arr.map(t => t.id === id ? { ...t, status: 'Open', completedAt: null } : t));
  };
  const deleteTask = (id) => {
    const removed = tasks.find(t => t.id === id);
    setTasks(arr => arr.filter(t => t.id !== id));
    flash('Task deleted', { tone: 'destructive', undo: () => removed && setTasks(arr => [removed, ...arr]) });
  };

  const fmtDue = (iso) => {
    const d = new Date(iso);
    const today = new Date(TODAY); today.setUTCHours(0, 0, 0, 0);
    const dd = new Date(d); dd.setUTCHours(0, 0, 0, 0);
    const diff = Math.round((dd - today) / 86400000);
    const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    if (diff === 0) return `Today ${time}`;
    if (diff === 1) return `Tomorrow ${time}`;
    if (diff === -1) return `Yesterday ${time}`;
    if (diff > 0 && diff < 7) return `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${time}`;
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${time}`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Tasks &amp; Follow-Ups</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Stay on top of leads, deal paperwork, and customer follow-ups.</p>
        </div>
        <Btn variant="gold" icon={Plus} onClick={startAdd}>Add Task</Btn>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="flex bg-stone-100 rounded-md p-0.5 flex-wrap">
            {[['all','All'],['today','Today'],['overdue','Overdue'],['open','Open'],['completed','Done']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded smallcaps ${filter === k ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-[10px] smallcaps font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2.5 w-10"></th>
                <th className="px-3 py-2.5 text-left">Task</th>
                <th className="px-3 py-2.5 text-left">Due</th>
                <th className="px-3 py-2.5 text-left">Assigned</th>
                <th className="px-3 py-2.5 text-left">Related</th>
                <th className="px-3 py-2.5 text-left">Priority</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 px-4">
                  <CheckSquare className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold mb-1">No tasks</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Create a task to track follow-ups, paperwork, and to-dos.</div>
                </td></tr>
              ) : filtered.map(t => {
                const isDone = t.status === 'Completed';
                const priColors = { High: '#DC2626', Medium: '#D97706', Low: '#65A30D' };
                return (
                  <tr key={t.id} className={`themed-row transition ${isDone ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => isDone ? reopenTask(t.id) : completeTask(t.id)}
                        title={isDone ? 'Reopen' : 'Mark complete'}
                        className="flex items-center justify-center">
                        {isDone ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-stone-400 hover:text-emerald-600 transition" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`font-medium ${isDone ? 'line-through' : ''}`}>{t.title}</div>
                      {t.notes && <div className="text-[11px] mt-0.5 truncate max-w-md" style={{ color: 'var(--text-muted)' }}>{t.notes}</div>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[12px] tabular ${t._overdue ? 'font-bold' : ''}`}
                        style={{ color: t._overdue ? '#DC2626' : 'var(--text-secondary)' }}>
                        {t._overdue && '⚠ '}
                        {fmtDue(t.dueAt)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[12px]">{t.assignedTo}</td>
                    <td className="px-3 py-3 text-[12px]">{t.relatedTo || <span className="text-stone-400">—</span>}</td>
                    <td className="px-3 py-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded smallcaps"
                        style={{ backgroundColor: priColors[t.priority] + '22', color: priColors[t.priority] }}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => deleteTask(t.id)} title="Delete"
                        className="p-1.5 text-stone-400 hover:text-red-600 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && draft && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-20 anim-fade no-print" onClick={() => setShowAdd(false)}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold mb-4">Create Task</h3>
              <Field label="Title" required>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g., Call buyer about financing" autoFocus />
              </Field>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Due Date">
                  <Input type="date" value={draft.dueAt.slice(0, 10)}
                    onChange={(e) => {
                      const t = draft.dueAt.slice(11, 19);
                      setDraft({ ...draft, dueAt: e.target.value + 'T' + t + '.000Z' });
                    }} />
                </Field>
                <Field label="Due Time">
                  <Input type="time" value={draft.dueAt.slice(11, 16)}
                    onChange={(e) => {
                      const d = draft.dueAt.slice(0, 10);
                      setDraft({ ...draft, dueAt: d + 'T' + e.target.value + ':00.000Z' });
                    }} />
                </Field>
              </div>
              <Field label="Assigned To" className="mt-3">
                <Select value={draft.assignedTo} onChange={(e) => setDraft({ ...draft, assignedTo: e.target.value })}>
                  {TEAM_MEMBERS.map(m => <option key={m.name} value={m.name}>{m.name} — {m.role}</option>)}
                </Select>
              </Field>
              <Field label="Related to (optional)" className="mt-3" hint="Lead or customer name">
                <Input value={draft.relatedTo} onChange={(e) => setDraft({ ...draft, relatedTo: e.target.value })}
                  placeholder="e.g., Maria Rodriguez" />
              </Field>
              <Field label="Priority" className="mt-3">
                <Select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </Select>
              </Field>
              <Field label="Notes" className="mt-3">
                <Textarea rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </Field>
            </div>
            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn variant="gold" onClick={saveDraft} disabled={!draft.title.trim()}>Create Task</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== CUSTOMERS TAB ============================ */

