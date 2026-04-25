'use client';

import { useEffect, useState } from 'react';

interface VariantStats {
  variant_id: string;
  variant_label: string;
  sends: number;
  replies: number;
  interested_replies: number;
  reply_rate_pct: number | null;
  interested_rate_pct: number | null;
  is_winner: boolean;
  is_loser: boolean;
}

interface Data {
  total_sends: number;
  total_tagged_sends: number;
  total_replies: number;
  baseline_reply_rate_pct: number | null;
  variants: VariantStats[];
  has_data: boolean;
}

export function VariantPerformanceCard({ cohortId }: { cohortId?: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (cohortId) params.set('cohort_id', cohortId);
    fetch(`/api/colony/health/variant-performance?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cohortId]);

  const cardStyle = {
    background: 'var(--colony-bg-elevated)',
    border: '1px solid var(--colony-border)',
    borderRadius: 'var(--colony-radius)',
    padding: '1rem',
  };

  if (loading) return <div style={cardStyle}><div style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted)' }}>Loading...</div></div>;

  if (!data || !data.has_data) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
          Subject Variant Performance
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-secondary)', marginTop: '0.5rem' }}>
          No sends yet. Call `tag_email_variant()` after sending to start A/B tracking.
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
          Subject Variant Performance
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-muted)', marginTop: '0.25rem' }}>
          {data.total_tagged_sends} of {data.total_sends} sends tagged · baseline reply rate {data.baseline_reply_rate_pct ?? '—'}%
        </div>
      </div>

      {data.total_tagged_sends === 0 && (
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-warning, #f59e0b)', marginBottom: '0.5rem' }}>
          ⚠ No sends have subject_variant_id set yet. Tag sends via qdrant_memory.tag_email_variant() to enable A/B analysis.
        </div>
      )}

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--colony-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Variant</th>
              <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Sends</th>
              <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Replies</th>
              <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Reply %</th>
              <th style={{ textAlign: 'right', padding: '0.25rem 0.5rem', color: 'var(--colony-text-muted)', fontWeight: 500 }}>Interested %</th>
            </tr>
          </thead>
          <tbody>
            {data.variants.map((v, i) => {
              const bg = v.is_winner ? 'rgba(16, 185, 129, 0.1)' : v.is_loser ? 'rgba(239, 68, 68, 0.1)' : 'transparent';
              const marker = v.is_winner ? '🏆' : v.is_loser ? '📉' : '';
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--colony-border)', background: bg }}>
                  <td style={{ padding: '0.25rem 0.5rem', color: 'var(--colony-text-primary)' }}>
                    {marker} {v.variant_label}
                  </td>
                  <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right', color: 'var(--colony-text-secondary)' }}>{v.sends}</td>
                  <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right', color: 'var(--colony-text-secondary)' }}>{v.replies}</td>
                  <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right', color: 'var(--colony-text-primary)' }}>{v.reply_rate_pct !== null ? `${v.reply_rate_pct}%` : '—'}</td>
                  <td style={{ padding: '0.25rem 0.5rem', textAlign: 'right', color: 'var(--colony-success, #10b981)' }}>{v.interested_rate_pct !== null ? `${v.interested_rate_pct}%` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
