'use client';
import { Bell, Users, Clock, Calendar } from 'lucide-react';
import { GOLD, RED_ACCENT } from './_internals';

/**
 * Notification dropdown panel — opens from the topbar Bell button.
 * Aggregates unread leads + active reservations + upcoming appointments and
 * shows the 5 most recent. Clicking an item jumps to its tab.
 */
export function NotificationDropdown({
  leads, setLeads, unreadLeads,
  reservations, appointments,
  setActiveTab, onClose, flash,
}) {
  const items = [
    ...leads.filter(l => !l.read).map(l => ({
      type: 'lead', id: l.id,
      when: l.createdAt,
      title: l.name,
      sub: l.source + ' · ' + l.vehicleLabel,
      icon: Users,
      accent: RED_ACCENT,
      onClick: () => { setActiveTab('leads'); onClose(); }
    })),
    ...reservations.map(r => ({
      type: 'reservation', id: r.id,
      when: r.reservedAt,
      title: r.customerName,
      sub: 'Reserved · expires soon',
      icon: Clock,
      accent: GOLD,
      onClick: () => { setActiveTab('dashboard'); onClose(); }
    })),
    ...appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').slice(0, 3).map(a => ({
      type: 'appointment', id: a.id,
      when: a.when,
      title: a.customerName,
      sub: a.serviceType + ' · ' + new Date(a.when).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' }),
      icon: Calendar,
      accent: '#0284C7',
      onClick: () => { setActiveTab('appointments'); onClose(); }
    }))
  ].sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 5);

  const fmtAgo = (iso) => {
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 0) return new Date(iso).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  };

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-80 max-h-80 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-xl z-40 anim-fade">
        <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-stone-900">Notifications</span>
          {unreadLeads > 0 && (
            <button onClick={() => { setLeads(arr => arr.map(l => ({ ...l, read: true }))); flash(`Marked ${unreadLeads} as read`); }}
              className="text-[11px] text-blue-600 hover:underline font-semibold">Mark all read</button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-stone-500">
            <Bell className="w-6 h-6 mx-auto mb-2 text-stone-300" />
            You're all caught up
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {items.map(it => {
              const Icon = it.icon;
              return (
                <button key={it.type + ':' + it.id} onClick={it.onClick}
                  className="w-full text-left px-4 py-3 hover:bg-stone-50 transition flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: it.accent + '22' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: it.accent }} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-stone-900 truncate">{it.title}</div>
                    <div className="text-[11px] text-stone-500 truncate">{it.sub}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{fmtAgo(it.when)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationDropdown;
