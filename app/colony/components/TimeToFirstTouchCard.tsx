'use client';

import { useEffect, useState } from 'react';

type TimeWindow = '7d' | '30d' | '90d' | 'all';

interface Stats {
  window: TimeWindow;
  leads_analyzed: number;
  leads_with_touch: number;
  leads_no_touch: number;
  median_minutes: number | null;
  p25_minutes: number | null;
  p75_minutes: number | null;
  min_minutes: number | null;
  max_minutes: number | null;
  buckets: {
    under_5min: number;
    min_5_to_60: number;
    min_60_to_1440: number;
    hr_24_to_72: number;
    over_72hr: number;
  };
  pct_under_5min: number | null;
  pct_under_1hr: number | null;
  has_data: boolean;
}

function formatMinutes(m: number | null): string {
  if (m === null) return '—';
  if (m < 1) return `${Math.round(m * 60)}s`;
  if (m < 60) return `${Math.round(m)}m`;
  if (m < 1440) return `${(m / 60).toFixed(1)}h`;
  return `${(m / 1440).toFixed(1)}d`;
}

function medianColor(m: number | null): string {
  if (m === null) return 'var(--colony-text-muted)';
  if (m < 5) return 'var(--colony-success, #10b981)';
  if (m < 60) return 'var(--colony-accent, #10b981)';
  if (m < 1440) return 'var(--colony-warning, #f59e0b)';
  return 'var(--colony-danger, #ef4444)';
}

export function TimeToFirstTouchCard() {
  const [window, setWindow] = useState<TimeWindow>('30d');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/colony/health/time-to-first-touch?window=${window}`)
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [window]);

  const windows: TimeWindow[] = ['7d', '30d', '90d', 'all'];

  if (loading) {
    return (
      <div
        style={{
          background: 'var(--colony-bg-elevated)',
          border: '1px solid var(--colony-border)',
          borderRadius: 'var(--colony-radius)',
          padding: '1rem',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (!stats || !stats.has_data) {
    return (
      <div
        style={{
          background: 'var(--colony-bg-elevated)',
          border: '1px solid var(--colony-border)',
          borderRadius: 'var(--colony-radius)',
          padding: '1rem',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Time to First Touch
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-secondary)' }}>
          No leads in this window yet.
        </div>
      </div>
    );
  }

  const totalBucketed = stats.leads_with_touch;
  const bucketEntries: Array<[string, number, string]> = [
    ['< 5 min',   stats.buckets.under_5min,     'var(--colony-success, #10b981)'],
    ['5-60 min',  stats.buckets.min_5_to_60,    'var(--colony-accent, #10b981)'],
    ['1-24 hr',   stats.buckets.min_60_to_1440, 'var(--colony-warning, #f59e0b)'],
    ['1-3 days',  stats.buckets.hr_24_to_72,    '#f97316'],
    ['> 3 days',  stats.buckets.over_72hr,      'var(--colony-danger, #ef4444)'],
  ];

  return (
    <div
      style={{
        background: 'var(--colony-bg-elevated)',
        border: '1px solid var(--colony-border)',
        borderRadius: 'var(--colony-radius)',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Time to First Touch
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', marginTop: '0.25rem' }}>
            {stats.leads_with_touch} of {stats.leads_analyzed} leads touched
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {windows.map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                border: '1px solid var(--colony-border)',
                borderRadius: '4px',
                background: window === w ? 'var(--colony-bg-hover)' : 'transparent',
                color: window === w ? 'var(--colony-text-primary)' : 'var(--colony-text-muted)',
                cursor: 'pointer',
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 600, color: medianColor(stats.median_minutes) }}>
          {formatMinutes(stats.median_minutes)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)' }}>median</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', marginLeft: 'auto' }}>
          p25: {formatMinutes(stats.p25_minutes)} · p75: {formatMinutes(stats.p75_minutes)}
        </div>
      </div>

      {/* Distribution bars */}
      <div style={{ marginBottom: '0.75rem' }}>
        {bucketEntries.map(([label, count, color]) => {
          const pct = totalBucketed === 0 ? 0 : (count / totalBucketed) * 100;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', width: '4rem' }}>{label}</div>
              <div style={{ flex: 1, height: '0.5rem', background: 'var(--colony-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', width: '3rem', textAlign: 'right' }}>
                {count} ({pct.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>

      {stats.leads_no_touch > 0 && (
        <div style={{ fontSize: '0.7rem', color: 'var(--colony-warning, #f59e0b)', marginTop: '0.5rem' }}>
          ⚠ {stats.leads_no_touch} lead{stats.leads_no_touch === 1 ? '' : 's'} never received a first touch
        </div>
      )}
    </div>
  );
}
