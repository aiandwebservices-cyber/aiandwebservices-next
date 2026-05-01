'use client';

import { useState, useEffect } from 'react';
import { X, Users, Calendar, Flame, MessageSquare, Car, Key, RefreshCw, Phone } from 'lucide-react';
import { TODAY } from './_internals';

function isTodayISO(isoStr) {
  return isoStr && isoStr.startsWith(TODAY);
}

function fmtTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function MetricCard({ icon: Icon, iconColor, label, value, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-100 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center justify-center w-11 h-11 rounded-lg shrink-0"
        style={{ backgroundColor: `${iconColor}18` }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-stone-900 leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-stone-400 truncate mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

export default function MobileDashboard({ leads = [], appointments = [], inventory = [], onNavigate, onClose }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Derived metrics
  const todayLeads = leads.filter(l => isTodayISO(l.createdAt));
  const hotLeads = leads.filter(l => (l.score ?? 0) >= 80);
  const unreadCount = leads.filter(l => !l.read).length;
  const activeInventory = inventory.filter(v => v.status !== 'Sold');

  const pendingAppts = appointments.filter(a =>
    a.status !== 'Completed' && a.status !== 'Cancelled'
  );
  const nextAppt = pendingAppts.sort((a, b) =>
    new Date(a.scheduledAt || a.date || 0) - new Date(b.scheduledAt || b.date || 0)
  )[0];

  const todayDrives = appointments.filter(a =>
    (a.type === 'Test Drive' || a.serviceType === 'Test Drive') &&
    isTodayISO(a.scheduledAt || a.date)
  );

  function nav(tab) {
    onNavigate?.(tab);
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-stone-100 shrink-0">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Quick View</h2>
          <p className="text-[11px] text-stone-400">Live lot overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Refresh">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" key={refreshKey}>
        <MetricCard
          icon={Users}
          iconColor="#2AA5A0"
          label="New leads today"
          value={todayLeads.length}
          sub={todayLeads.slice(0, 3).map(l => l.name).join(', ') || 'None yet'}
          onClick={() => nav('leads')}
        />

        <MetricCard
          icon={Calendar}
          iconColor="#6366F1"
          label="Pending appointments"
          value={pendingAppts.length}
          sub={nextAppt
            ? `Next: ${nextAppt.customerName || nextAppt.name || '—'} at ${fmtTime(nextAppt.scheduledAt || nextAppt.date)}`
            : 'None scheduled'}
          onClick={() => nav('appointments')}
        />

        <MetricCard
          icon={Flame}
          iconColor="#EF4444"
          label="Hot leads (80+ score)"
          value={hotLeads.length}
          sub={hotLeads.slice(0, 3).map(l => l.name).join(', ') || 'None right now'}
          onClick={() => nav('leads')}
        />

        <MetricCard
          icon={MessageSquare}
          iconColor="#F59E0B"
          label="Unread messages"
          value={unreadCount}
          sub={unreadCount > 0 ? 'Tap to view lead inbox' : 'All caught up'}
          onClick={() => nav('leads')}
        />

        <MetricCard
          icon={Car}
          iconColor="#10B981"
          label="Vehicles on lot"
          value={activeInventory.length}
          sub={`${inventory.filter(v => v.featured).length} featured`}
          onClick={() => nav('inventory')}
        />

        <MetricCard
          icon={Key}
          iconColor="#8B5CF6"
          label="Test drives today"
          value={todayDrives.length}
          sub={todayDrives[0]
            ? `${todayDrives[0].customerName || todayDrives[0].name || '—'} at ${fmtTime(todayDrives[0].scheduledAt || todayDrives[0].date)}`
            : 'None scheduled today'}
          onClick={() => nav('appointments')}
        />

        {/* Quick-dial for today's leads */}
        {todayLeads.filter(l => l.phone).length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1">
              One-tap call — today's leads
            </p>
            <div className="space-y-2">
              {todayLeads.filter(l => l.phone).slice(0, 5).map(lead => (
                <a
                  key={lead.id}
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 shrink-0">
                    <Phone size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-stone-900 truncate">{lead.name}</div>
                    <div className="text-[11px] text-stone-400 truncate">{lead.phone}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Call</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
