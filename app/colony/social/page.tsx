'use client';

import { useEffect, useState } from 'react';

interface SocialDraft {
  path: string;
  filename: string;
  platform?: string;
  source_blog_title?: string;
  source_blog_id?: string;
  status?: string;
  generated_at?: string;
  body_preview: string;
  body_full: string;
  hashtags?: string;
  canonical_url?: string;
}

export default function SocialPage() {
  const [drafts, setDrafts] = useState<SocialDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'linkedin' | 'facebook'>('all');

  const refresh = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/colony/social');
      const data = await resp.json();
      setDrafts(Array.isArray(data) ? data : []);
    } catch (e) {
      setMessage(`Refresh failed: ${(e as Error).message}`);
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (path: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`${status === 'APPROVED' ? 'Approve for publishing' : 'Reject'} this post?`)) return;
    setBusy(path);
    try {
      const resp = await fetch('/api/colony/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_path: path, new_status: status }),
      });
      const data = await resp.json();
      setMessage(data.ok ? `Marked ${status} — will publish on next cron tick` : `Failed: ${data.reason || data.error}`);
      await refresh();
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
    setBusy(null);
  };

  const filtered = filter === 'all' ? drafts : drafts.filter((d) => d.platform === filter);
  const pending = filtered.filter((d) => d.status === 'PENDING');
  const approved = filtered.filter((d) => d.status === 'APPROVED');
  const sent = filtered.filter((d) => d.status === 'SENT');
  const failed = filtered.filter((d) => d.status === 'FAILED');

  const renderDraft = (d: SocialDraft) => {
    const platformEmoji = d.platform === 'linkedin' ? '🔵' : d.platform === 'facebook' ? '📘' : '📝';
    return (
      <div key={d.path} style={{
        background: 'var(--colony-bg-elevated, #1a1a1a)',
        border: '1px solid var(--colony-border, #333)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--colony-text-primary, #fff)', fontWeight: 500 }}>
              {platformEmoji} {d.source_blog_title || '(untitled)'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted, #888)', marginTop: '0.25rem' }}>
              {d.filename} · {d.generated_at}
            </div>
          </div>
          {d.status === 'PENDING' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => updateStatus(d.path, 'APPROVED')}
                disabled={busy === d.path}
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#10b981',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {busy === d.path ? '...' : 'Approve'}
              </button>
              <button
                onClick={() => updateStatus(d.path, 'REJECTED')}
                disabled={busy === d.path}
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--colony-text-muted, #888)',
                  background: 'transparent',
                  border: '1px solid var(--colony-border, #333)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(expanded === d.path ? null : d.path)}
          style={{
            fontSize: '0.75rem',
            color: 'var(--colony-text-muted, #888)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded === d.path ? '▼ Hide body' : '▶ Show body'}
        </button>
        {expanded === d.path && (
          <pre style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            background: 'var(--colony-bg, #0a0a0a)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: 'var(--colony-text-secondary, #ccc)',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
          }}>{d.body_full}</pre>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--colony-text-primary, #fff)' }}>
          Social Queue
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--colony-text-muted, #888)', marginTop: '0.25rem' }}>
          Blog posts transformed into LinkedIn + Facebook drafts. Approve to publish.
        </p>
      </div>

      {message && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: 'var(--colony-bg-elevated, #1a1a1a)',
          border: '1px solid var(--colony-border, #333)',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: 'var(--colony-text-secondary, #ccc)',
        }}>
          {message}
          <button onClick={() => setMessage(null)} style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: 'var(--colony-text-muted, #888)', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['all', 'linkedin', 'facebook'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              background: filter === f ? 'var(--colony-bg-elevated, #1a1a1a)' : 'transparent',
              color: filter === f ? 'var(--colony-text-primary, #fff)' : 'var(--colony-text-muted, #888)',
              border: '1px solid var(--colony-border, #333)',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: 'var(--colony-text-muted, #888)' }}>Loading...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{
          padding: '1.5rem',
          background: 'var(--colony-bg-elevated, #1a1a1a)',
          border: '1px solid var(--colony-border, #333)',
          borderRadius: '8px',
          color: 'var(--colony-text-muted, #888)',
          fontSize: '0.875rem',
        }}>
          No drafts yet. Run the syndication agent against a blog post to generate.
        </div>
      )}

      {pending.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--colony-text-primary, #fff)', marginBottom: '0.5rem' }}>
            Pending approval ({pending.length})
          </h2>
          {pending.map(renderDraft)}
        </section>
      )}

      {approved.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--colony-accent, #10b981)', marginBottom: '0.5rem' }}>
            Approved, waiting to publish ({approved.length})
          </h2>
          {approved.map(renderDraft)}
        </section>
      )}

      {sent.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--colony-text-muted, #888)', marginBottom: '0.5rem' }}>
            Published ({sent.length})
          </h2>
          {sent.slice(0, 10).map(renderDraft)}
        </section>
      )}

      {failed.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--colony-danger, #ef4444)', marginBottom: '0.5rem' }}>
            Failed ({failed.length})
          </h2>
          {failed.map(renderDraft)}
        </section>
      )}
    </div>
  );
}
