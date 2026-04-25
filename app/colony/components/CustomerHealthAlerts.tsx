'use client';

import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  customer_id: string;
  customer_name: string;
  alert_type: string;
  severity: string;
  message: string;
  detected_at: string;
  metadata?: Record<string, unknown>;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: 'bg-red-950/40 border-red-900', text: 'text-red-300', label: 'CRITICAL' },
  WARNING:  { bg: 'bg-amber-950/40 border-amber-900', text: 'text-amber-300', label: 'WARNING' },
  INFO:     { bg: 'bg-blue-950/40 border-blue-900', text: 'text-blue-300', label: 'INFO' },
};

export function CustomerHealthAlerts({ cohortId }: { cohortId?: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (cohortId) params.set('cohort_id', cohortId);
    fetch(`/api/colony/health/alerts?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cohortId]);

  if (loading) {
    return (
      <div className="p-4 rounded bg-zinc-900/50 border border-zinc-800">
        <div className="text-sm text-zinc-500">Loading customer health...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-4 rounded bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Customer Health</div>
            <div className="text-sm text-emerald-400 mt-1">All customers healthy</div>
          </div>
          <div className="text-2xl">✓</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded bg-zinc-900/50 border border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Customer Health</div>
          <div className="text-sm text-zinc-200 mt-1">{alerts.length} open alert{alerts.length === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.slice(0, 10).map((a) => {
          const style = SEVERITY_STYLES[a.severity] || SEVERITY_STYLES.INFO;
          return (
            <div key={a.id} className={`p-3 rounded border ${style.bg}`}>
              <div className="flex items-start gap-2">
                <span className={`text-xs font-semibold ${style.text} uppercase`}>{style.label}</span>
                <span className="text-xs text-zinc-500">{a.alert_type}</span>
              </div>
              <div className="text-sm text-zinc-200 mt-1">{a.message}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {new Date(a.detected_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
