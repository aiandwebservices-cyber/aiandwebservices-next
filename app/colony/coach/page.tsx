'use client';

import { useEffect, useState } from 'react';

interface Hint {
  hint_id: string;
  label: string;
  file: string;
  before: string;
  after: string;
}

interface Proposal {
  path: string;
  filename: string;
  status: string;
  hints: Hint[];
  has_hints: boolean;
  preview: string;
  full_text?: string;
  error?: string;
}

interface AuditRow {
  id: number;
  proposal_path: string;
  proposal_section: string;
  target_file: string;
  action: string;
  status: string;
  diff_summary: string | null;
  error_message: string | null;
  applied_at: string;
  rolled_back_at: string | null;
}

export default function CoachPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [pr, au] = await Promise.all([
        fetch('/api/colony/coach/proposals').then((r) => r.json()),
        fetch('/api/colony/coach/audit?limit=20').then((r) => r.json()),
      ]);
      setProposals(Array.isArray(pr) ? pr : []);
      setAudit(Array.isArray(au) ? au : []);
    } catch (e) {
      setMessage(`Refresh failed: ${(e as Error).message}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function applyHint(proposal: Proposal, hint: Hint) {
    if (!confirm(`Apply hint "${hint.label}" to ${hint.file}?\n\nThis will modify the file. You can rollback after.`)) return;
    setBusy(`apply:${hint.hint_id}`);
    try {
      const resp = await fetch('/api/colony/coach/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_path: proposal.path, hint_id: hint.hint_id, apply: true }),
      });
      const data = await resp.json();
      if (data.ok) {
        setMessage(`Applied: ${hint.label} (audit_id=${data.audit_id})`);
      } else {
        setMessage(`Failed: ${data.error}`);
      }
      await refresh();
    } catch (e) {
      setMessage(`Apply error: ${(e as Error).message}`);
    }
    setBusy(null);
  }

  async function rollbackAudit(auditId: number) {
    if (!confirm(`Rollback audit_id ${auditId}?\n\nThis restores the file to its state before the apply.`)) return;
    setBusy(`rollback:${auditId}`);
    try {
      const resp = await fetch('/api/colony/coach/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit_id: auditId, confirm: true }),
      });
      const data = await resp.json();
      if (data.ok) {
        setMessage(`Rolled back audit_id ${auditId}`);
      } else {
        setMessage(`Rollback failed: ${data.error}`);
      }
      await refresh();
    } catch (e) {
      setMessage(`Rollback error: ${(e as Error).message}`);
    }
    setBusy(null);
  }

  async function rejectProposal(proposal: Proposal) {
    const reason = prompt(`Reject ${proposal.filename}? Reason (optional):`);
    if (reason === null) return;
    setBusy(`reject:${proposal.path}`);
    try {
      const resp = await fetch('/api/colony/coach/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_path: proposal.path, reason }),
      });
      const data = await resp.json();
      if (data.ok) {
        setMessage(`Rejected: ${proposal.filename}`);
      } else {
        setMessage(`Reject failed: ${data.error}`);
      }
      await refresh();
    } catch (e) {
      setMessage(`Reject error: ${(e as Error).message}`);
    }
    setBusy(null);
  }

  const pending = proposals.filter((p) => p.status === 'PENDING');
  const handled = proposals.filter((p) => p.status !== 'PENDING');

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Coach Proposals</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Coach watches your pipelines and proposes config changes. Nothing applies automatically — you approve each change.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-zinc-900 border border-zinc-700 text-sm text-zinc-300 flex justify-between items-start">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="ml-3 text-zinc-500 hover:text-zinc-200">×</button>
        </div>
      )}

      {loading && <div className="text-sm text-zinc-500">Loading…</div>}

      <section className="mb-8">
        <h2 className="text-lg font-medium text-zinc-200 mb-3">Pending ({pending.length})</h2>
        {pending.length === 0 && !loading && (
          <div className="text-sm text-zinc-500 italic">No pending proposals.</div>
        )}
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.path} className="p-4 rounded bg-zinc-900/50 border border-zinc-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium text-zinc-100">{p.filename}</div>
                  <div className="text-xs text-zinc-500">
                    {p.has_hints ? `${p.hints.length} apply hints` : 'No apply hints — manual review only'}
                  </div>
                </div>
                <button
                  onClick={() => rejectProposal(p)}
                  disabled={busy === `reject:${p.path}`}
                  className="text-xs text-zinc-400 hover:text-red-400 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>

              <details className="text-xs text-zinc-400 mb-3">
                <summary className="cursor-pointer hover:text-zinc-200">Preview</summary>
                <pre className="mt-2 p-2 bg-zinc-950 rounded overflow-x-auto whitespace-pre-wrap">{p.preview}</pre>
              </details>

              {p.has_hints && (
                <div className="space-y-2">
                  {p.hints.map((h) => (
                    <div key={h.hint_id} className="p-3 rounded bg-zinc-950 border border-zinc-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-zinc-200">{h.label}</div>
                          <div className="text-xs text-zinc-500 truncate">{h.file}</div>
                        </div>
                        <button
                          onClick={() => applyHint(p, h)}
                          disabled={busy === `apply:${h.hint_id}`}
                          className="ml-3 px-3 py-1 text-xs bg-emerald-900/50 border border-emerald-700 text-emerald-200 rounded hover:bg-emerald-800/50 disabled:opacity-50"
                        >
                          {busy === `apply:${h.hint_id}` ? 'Applying…' : 'Apply'}
                        </button>
                      </div>
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer text-zinc-500 hover:text-zinc-200">Diff preview</summary>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-zinc-500 mb-1">Before:</div>
                            <pre className="p-2 bg-red-950/30 border border-red-900/50 rounded overflow-x-auto whitespace-pre-wrap text-zinc-300">{h.before.slice(0, 300)}</pre>
                          </div>
                          <div>
                            <div className="text-zinc-500 mb-1">After:</div>
                            <pre className="p-2 bg-emerald-950/30 border border-emerald-900/50 rounded overflow-x-auto whitespace-pre-wrap text-zinc-300">{h.after.slice(0, 300)}</pre>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-zinc-200 mb-3">Handled ({handled.length})</h2>
        <div className="space-y-2">
          {handled.slice(0, 10).map((p) => (
            <div key={p.path} className="p-3 rounded bg-zinc-900/30 border border-zinc-800/50 text-sm">
              <span className="text-zinc-400">{p.filename}</span>
              <span className="ml-3 text-xs text-zinc-500">{p.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-200 mb-3">Audit Log</h2>
        <div className="space-y-2">
          {audit.slice(0, 20).map((row) => (
            <div key={row.id} className="p-3 rounded bg-zinc-900/30 border border-zinc-800/50 text-xs flex justify-between">
              <div className="flex-1 min-w-0">
                <span className={row.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}>{row.action}</span>
                <span className="ml-2 text-zinc-300">{row.proposal_section}</span>
                <span className="ml-2 text-zinc-500 truncate">{row.target_file}</span>
                {row.error_message && <span className="ml-2 text-red-400">— {row.error_message}</span>}
                {row.rolled_back_at && <span className="ml-2 text-amber-400">[rolled back]</span>}
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="text-zinc-500">{new Date(row.applied_at).toLocaleString()}</span>
                {row.action === 'APPLY' && row.status === 'SUCCESS' && !row.rolled_back_at && (
                  <button
                    onClick={() => rollbackAudit(row.id)}
                    disabled={busy === `rollback:${row.id}`}
                    className="px-2 py-0.5 text-xs bg-amber-950/50 border border-amber-800 text-amber-200 rounded hover:bg-amber-900/50 disabled:opacity-50"
                  >
                    {busy === `rollback:${row.id}` ? '…' : 'Rollback'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
