'use client';
import { useState } from 'react';
import {
  Activity, Users, Award, TrendingDown, Clock, Star, Calendar, RefreshCw,
} from 'lucide-react';
import { Card, GOLD } from './_internals';

const ACCENT_FOR_TYPE = {
  'lead-new':     { color: '#BE123C', icon: Users },
  'lead-status':  { color: '#0369A1', icon: Users },
  'sold':         { color: '#059669', icon: Award },
  'price-drop':   { color: '#EA580C', icon: TrendingDown },
  'reservation':  { color: GOLD,     icon: Clock },
  'feature':      { color: GOLD,     icon: Star },
  'appointment':  { color: '#0284C7', icon: Calendar },
  'review':       { color: '#9333EA', icon: Star },
  'restore':      { color: '#0891B2', icon: RefreshCw },
};

const fmtAgo = (iso) => {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24);
  if (d < 7) return d + 'd ago';
  return new Date(iso).toLocaleDateString();
};

/**
 * Recent Activity feed — auto-extends as the dealer makes mutations
 * (sold, reservations, price changes, etc.). Click a row to jump to the
 * relevant tab.
 */
export function ActivityLog({ activity = [], onJump }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-stone-600" strokeWidth={2} />
          <h3 className="font-display text-lg font-semibold tracking-tight">Recent Activity</h3>
        </div>
        {activity.length > 8 && (
          <button onClick={() => setExpanded(e => !e)}
            className="text-[11px] font-semibold text-blue-600 hover:underline">
            {expanded ? 'Show less' : `View all (${activity.length})`}
          </button>
        )}
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {(expanded ? activity : activity.slice(0, 8)).map(a => {
          const accent = ACCENT_FOR_TYPE[a.type] || { color: '#78716C', icon: Activity };
          const Icon = accent.icon;
          return (
            <button key={a.id}
              onClick={() => a.refTab && onJump && onJump(a.refTab)}
              className="w-full text-left px-5 py-3 themed-row transition flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: accent.color + '22' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: accent.color }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                {a.sub && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{a.sub}</div>}
              </div>
              <div className="text-[10px] shrink-0 tabular" style={{ color: 'var(--text-muted)' }}>{fmtAgo(a.when)}</div>
            </button>
          );
        })}
        {activity.length === 0 && (
          <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No activity yet — actions will appear here as they happen.
          </div>
        )}
      </div>
    </Card>
  );
}

export default ActivityLog;
