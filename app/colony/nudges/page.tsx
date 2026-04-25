'use client';

import { useEffect, useState } from 'react';

interface NudgeDraft {
  path: string;
  filename: string;
  nudge_type: string;
  lead_id: string;
  cohort_id: string;
  subject: string;
  status: string;
  generated_at: string;
  metadata: Record<string, unknown>;
  body_preview: string;
  body_full: string;
}

export default function NudgesPage() {
  const [drafts, setDrafts] = useState<NudgeDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/colony/nudges');
      const data = await resp.json();
      setDrafts(Array.isArray(data) ? data : []);
    } catch (e) {
      setMessage(`Refresh failed: ${(e as Error).message}`);
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (path: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`${status === 'APPROVED' ? 'Approve' : 'Reject'} this draft?`)) return;
    setBusy(path);
    try {
      const resp = await fetch('/api/colony/nudges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_path: path, new_status: status }),
      });
      const data = await resp.json();
      setMessage(data.ok ? `Marked ${status}` : `Failed: ${data.reason || data.error}`);
      await refresh();
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
    setBusy(null);
  };

  const grouped: Record<string, NudgeDraft[]> = {};
  for (const d of drafts) {
    const t = d.nudge_type || 'unknown';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(d);
  }

  const typeLabels: Record<string, string> = {
    post_audit: 'Post-Audit Follow-ups',
    cold_revival: 'Cold Lead Revivals',
    onboarding: 'Onboarding Sequences',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Nudge Queue</h1>
        <p className="text-sm text-zinc-400 mt-1">
          AI-drafted follow-ups waiting for your approval. Nothing sends until you approve.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-zinc-900 border border-zinc-700 text-sm text-zinc-300">
          {message}
          <button onClick={() => setMessage(null)} className="ml-3 text-zinc-500">×</button>
        </div>
      )}

      {loading && <div className="text-sm text-zinc-500">Loading...</div>}

      {!loading && drafts.length === 0 && (
        <div className="p-6 rounded bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400">
          No pending nudges. New drafts will appear here as agents generate them.
        </div>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <section key={type} className="mb-8">
          <h2 className="text-lg font-medium text-zinc-200 mb-3">
            {typeLabels[type] || type} ({items.length})
          </h2>
          <div className="space-y-2">
            {items.map((d) => (
              <div key={d.path} className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-100">{d.subject || '(no subject)'}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Lead {d.lead_id} · {new Date(d.generated_at).toLocaleString()}
                      {d.metadata?.company ? ` · ${d.metadata.company}` : ''}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => updateStatus(d.path, 'APPROVED')}
                      disabled={busy === d.path}
                      className="px-3 py-1 text-xs bg-emerald-900/50 border border-emerald-700 text-emerald-200 rounded hover:bg-emerald-800/50 disabled:opacity-50"
                    >
                      {busy === d.path ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(d.path, 'REJECTED')}
                      disabled={busy === d.path}
                      className="px-3 py-1 text-xs text-zinc-400 hover:text-red-400 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedPath(expandedPath === d.path ? null : d.path)}
                  className="text-xs text-zinc-500 hover:text-zinc-200"
                >
                  {expandedPath === d.path ? '▼ Hide body' : '▶ Show body'}
                </button>
                {expandedPath === d.path && (
                  <pre className="mt-2 p-2 bg-zinc-950 rounded text-xs text-zinc-300 whitespace-pre-wrap">{d.body_full}</pre>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
