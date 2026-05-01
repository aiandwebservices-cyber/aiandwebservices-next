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

export function ReportingTab({ inventory, sold, leads }) {
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  const monthlyUnits = [8, 6, 9, 7, 11, 10];
  const monthlyGross = [38400, 28200, 41700, 32500, 52400, 47200];
  const maxUnits = Math.max(...monthlyUnits);
  const maxGross = Math.max(...monthlyGross);

  const ageBuckets = useMemo(() => {
    const a = { fresh: 0, mid: 0, old: 0 };
    inventory.forEach(v => {
      if (v.daysOnLot < 31) a.fresh++;
      else if (v.daysOnLot < 61) a.mid++;
      else a.old++;
    });
    return a;
  }, [inventory]);
  const totalAge = ageBuckets.fresh + ageBuckets.mid + ageBuckets.old || 1;

  const salespeople = [
    { name: 'Carlos Rivera',  sold: 5, gross: 24500, close: 0.22 },
    { name: 'James Mitchell', sold: 3, gross: 14100, close: 0.15 },
    { name: 'Maria Santos',   sold: 2, gross: 13800, close: 0.10, note: '(F&I)' }
  ];

  const fmt$ = (n) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Reporting</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sales performance, gross profit, inventory aging, and team metrics.</p>
        </div>
        <Btn variant="default" icon={Download} onClick={() => alert('PDF export — wired in production via @react-pdf/renderer.')}>Export PDF</Btn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Avg Days to Sell" value="28d" icon={Clock} sub="industry avg: 38" />
        <StatCard label="Avg Gross / Unit" value={fmt$(4850)} icon={DollarSign} accent={GOLD} />
        <StatCard label="Lead → Sale Rate" value="18%" icon={TrendingUp} accent="#2F7A4A" sub="↑ 2.4% MoM" />
        <StatCard label="Avg Response Time" value="12 min" icon={Zap} sub="industry avg: 47 min" />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-display text-lg font-semibold">Sales Performance — Last 6 Months</h3>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1" style={{ backgroundColor: GOLD }} /> Units
            <span className="inline-block w-3 h-3 rounded-sm align-middle ml-3 mr-1" style={{ backgroundColor: '#2F7A4A' }} /> Gross profit
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end gap-3 h-56" style={{ borderBottom: '1px solid var(--border)' }}>
            {months.map((m, i) => {
              const u = monthlyUnits[i];
              const g = monthlyGross[i];
              const uH = Math.round((u / maxUnits) * 200);
              const gY = 200 - Math.round((g / maxGross) * 200);
              return (
                <div key={m} className="flex-1 flex flex-col items-center justify-end relative">
                  <div className="absolute text-[10px] font-bold tabular -translate-y-5"
                    style={{ bottom: uH + 'px', color: GOLD }}>{u}</div>
                  <div className="w-full rounded-t" style={{ height: uH + 'px', backgroundColor: GOLD }} />
                  <div className="absolute w-2 h-2 rounded-full"
                    style={{ bottom: (200 - gY) + 'px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2F7A4A' }} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>
            {months.map(m => <div key={m} className="flex-1 text-center">{m}</div>)}
          </div>
          <div className="mt-4 p-3 rounded-md text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <strong>Best month: March</strong> — 11 units, $52,400 gross
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-display text-lg font-semibold">By Salesperson — This Month</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-right">Sold</th>
                <th className="px-3 py-2 text-right">Gross</th>
                <th className="px-3 py-2 text-right">Close Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {salespeople.map(p => (
                <tr key={p.name}>
                  <td className="px-4 py-3 font-medium">{p.name} {p.note && <span className="text-[10px] text-stone-400">{p.note}</span>}</td>
                  <td className="px-3 py-3 text-right tabular">{p.sold}</td>
                  <td className="px-3 py-3 text-right tabular font-semibold">{fmt$(p.gross)}</td>
                  <td className="px-3 py-3 text-right tabular">{(p.close * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold mb-4">Inventory Age Distribution</h3>
          <div className="flex items-center gap-6 flex-wrap">
            <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E7E5E4" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.fresh / totalAge) * 100} 100`} strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#D97706" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.mid / totalAge) * 100} 100`}
                strokeDashoffset={`${-((ageBuckets.fresh / totalAge) * 100)}`} />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#DC2626" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.old / totalAge) * 100} 100`}
                strokeDashoffset={`${-(((ageBuckets.fresh + ageBuckets.mid) / totalAge) * 100)}`} />
            </svg>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10B981' }} /> 0–30 days: <strong>{ageBuckets.fresh}</strong></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D97706' }} /> 31–60 days: <strong>{ageBuckets.mid}</strong></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#DC2626' }} /> 60+ days: <strong>{ageBuckets.old}</strong></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

