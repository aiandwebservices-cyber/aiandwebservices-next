'use client';

import { useEffect, useState } from 'react';

type Dim = 'niche' | 'source' | 'city' | 'assignedUser';
type TimeWindow = '30d' | '90d' | 'all';

const DIM_LABELS: Record<Dim, string> = {
  niche: 'Niche',
  source: 'Source',
  city: 'City',
  assignedUser: 'Assigned',
};

interface Cell {
  dim_a_value: string;
  dim_b_value: string;
  total_leads: number;
  reached_audit: number;
  reached_proposal: number;
  reached_signed: number;
  audit_rate_pct: number | null;
  proposal_rate_pct: number | null;
  signed_rate_pct: number | null;
  is_outlier_high: boolean;
  is_outlier_low: boolean;
}

interface Result {
  window: TimeWindow;
  dim_a: Dim;
  dim_b: Dim;
  baseline_audit_rate_pct: number | null;
  baseline_proposal_rate_pct: number | null;
  baseline_signed_rate_pct: number | null;
  total_leads: number;
  cells: Cell[];
  has_data: boolean;
  notes: string[];
}

export function FunnelCrossTabsCard() {
  const [dimA, setDimA] = useState<Dim>('niche');
  const [dimB, setDimB] = useState<Dim>('source');
  const [window, setWindow] = useState<TimeWindow>('90d');
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dimA === dimB) return;
    setLoading(true);
    fetch(`/api/colony/health/funnel-crosstabs?dim_a=${dimA}&dim_b=${dimB}&window=${window}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dimA, dimB, window]);

  const dims: Dim[] = ['niche', 'source', 'city', 'assignedUser'];
  const windows: TimeWindow[] = ['30d', '90d', 'all'];

  const cardStyle = {
    background: 'var(--colony-bg-elevated)',
    border: '1px solid var(--colony-border)',
    borderRadius: 'var(--colony-radius)',
    padding: '1rem',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Funnel Cross-Tabs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', marginTop: '0.25rem' }}>
            Segments with conversion &gt;2x or &lt;0.5x baseline surface at top
          </div>
        </div>
      </div>

      {/* Dimension selectors */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' as const }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', alignSelf: 'center' }}>Group by:</div>
        <select
          value={dimA}
          onChange={(e) => setDimA(e.target.value as Dim)}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            background: 'var(--colony-bg)',
            color: 'var(--colony-text-primary)',
            border: '1px solid var(--colony-border)',
            borderRadius: '4px',
          }}
        >
          {dims.map((d) => <option key={d} value={d}>{DIM_LABELS[d]}</option>)}
        </select>
        <span style={{ color: 'var(--colony-text-muted)', alignSelf: 'center' }}>×</span>
        <select
          value={dimB}
          onChange={(e) => setDimB(e.target.value as Dim)}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            background: 'var(--colony-bg)',
            color: 'var(--colony-text-primary)',
            border: '1px solid var(--colony-border)',
            borderRadius: '4px',
          }}
        >
          {dims.filter((d) => d !== dimA).map((d) => <option key={d} value={d}>{DIM_LABELS[d]}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
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

      {loading && <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted)' }}>Computing...</div>}

      {!loading && data && (
        <>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', marginBottom: '0.5rem' }}>
            Baseline: audit {data.baseline_audit_rate_pct ?? '—'}% · proposal {data.baseline_proposal_rate_pct ?? '—'}% · signed {data.baseline_signed_rate_pct ?? '—'}% ({data.total_leads} leads)
          </div>

          {data.notes.length > 0 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--colony-warning, #f59e0b)', marginBottom: '0.5rem' }}>
              {data.notes.map((n, i) => <div key={i}>⚠ {n}</div>)}
            </div>
          )}

          {!data.has_data && <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted)' }}>No segments with 3+ leads to analyze.</div>}

          {data.has_data && (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--colony-border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>{DIM_LABELS[data.dim_a]}</th>
                    <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>{DIM_LABELS[data.dim_b]}</th>
                    <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Leads</th>
                    <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Audit %</th>
                    <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Proposal %</th>
                    <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Signed %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cells.slice(0, 20).map((c, i) => {
                    const outlierBg = c.is_outlier_high
                      ? 'rgba(16, 185, 129, 0.1)'
                      : c.is_outlier_low
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'transparent';
                    const indicator = c.is_outlier_high ? '↑' : c.is_outlier_low ? '↓' : '';
                    const indicatorColor = c.is_outlier_high ? 'var(--colony-success, #10b981)' : 'var(--colony-danger, #ef4444)';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--colony-border)', background: outlierBg }}>
                        <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-primary)' }}>{c.dim_a_value}</td>
                        <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-primary)' }}>{c.dim_b_value}</td>
                        <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-secondary)', textAlign: 'right' }}>{c.total_leads}</td>
                        <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right' }}>
                          <span style={{ color: 'var(--colony-text-primary)' }}>{c.audit_rate_pct}%</span>
                          {indicator && <span style={{ color: indicatorColor, marginLeft: '0.25rem' }}>{indicator}</span>}
                        </td>
                        <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-secondary)', textAlign: 'right' }}>{c.proposal_rate_pct}%</td>
                        <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-secondary)', textAlign: 'right' }}>{c.signed_rate_pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {data.cells.length > 20 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Showing top 20 of {data.cells.length} segments
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
