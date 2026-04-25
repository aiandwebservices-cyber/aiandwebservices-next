'use client';

import { useEffect, useState } from 'react';

type TimeWindow = '30d' | '90d' | 'all';

interface Analytics {
  window: TimeWindow;
  total_opportunities_tracked: number;
  avg_days_by_stage: Record<string, number | null>;
  median_days_by_stage: Record<string, number | null>;
  sample_size_by_stage: Record<string, number>;
  velocity_insights: string[];
  has_data: boolean;
}

const STAGES = ['Lead', 'Audit Scheduled', 'Audit Complete', 'Proposal Sent', 'Proposal Signed', 'Active', 'Churned'];

export function StageAnalyticsCard() {
  const [window, setWindow] = useState<TimeWindow>('90d');
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/colony/health/stage-analytics?window=${window}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [window]);

  const cardStyle = {
    background: 'var(--colony-bg-elevated)',
    border: '1px solid var(--colony-border)',
    borderRadius: 'var(--colony-radius)',
    padding: '1rem',
  };

  if (loading) {
    return <div style={cardStyle}><div style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted)' }}>Loading...</div></div>;
  }

  if (!data || !data.has_data) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
          Stage Velocity
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-secondary)', marginTop: '0.5rem' }}>
          No stage transitions recorded yet. Configure EspoCRM webhooks to start capturing.
        </div>
      </div>
    );
  }

  const windows: TimeWindow[] = ['30d', '90d', 'all'];
  const maxDays = Math.max(...STAGES.map((s) => data.median_days_by_stage[s] || 0));

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Stage Velocity
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', marginTop: '0.25rem' }}>
            {data.total_opportunities_tracked} opportunit{data.total_opportunities_tracked === 1 ? 'y' : 'ies'} tracked, median days per stage
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

      {data.velocity_insights.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          {data.velocity_insights.map((insight, i) => (
            <div key={i} style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--colony-warning, #f59e0b)', marginBottom: '0.25rem' }}>
              💡 {insight}
            </div>
          ))}
        </div>
      )}

      <div>
        {STAGES.map((stage) => {
          const med = data.median_days_by_stage[stage];
          const samples = data.sample_size_by_stage[stage] || 0;
          const pct = med !== null && maxDays > 0 ? (med / maxDays) * 100 : 0;
          return (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', width: '8rem', flexShrink: 0 }}>{stage}</div>
              <div style={{ flex: 1, height: '0.75rem', background: 'var(--colony-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--colony-accent, #10b981)', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-primary)', width: '5rem', textAlign: 'right' as const, flexShrink: 0 }}>
                {med !== null ? `${med}d` : '—'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', width: '3rem', textAlign: 'right' as const, flexShrink: 0 }}>
                n={samples}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--colony-border)', fontSize: '0.7rem', color: 'var(--colony-text-muted)' }}>
        Median shown above. Average values: {STAGES.map((s) => data.avg_days_by_stage[s] === null ? null : `${s}=${data.avg_days_by_stage[s]}d`).filter(Boolean).join(' · ')}
      </div>
    </div>
  );
}
