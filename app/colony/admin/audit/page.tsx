'use client'
import { useState, useEffect } from 'react'
import type { AuditEntry } from '@/lib/colony/onboarding-writers'

function StatusDot({ success }: { success: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ background: success ? '#34d399' : '#f87171' }}
    />
  )
}

function AuditDetailModal({ entry, onClose }: { entry: AuditEntry; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base" style={{ color: 'var(--colony-text-primary)' }}>
            Audit entry: <span className="font-mono text-sm">{entry.target_cohort_id}</span>
          </h2>
          <button onClick={onClose} className="text-lg opacity-60 hover:opacity-100">✕</button>
        </div>
        <pre
          className="text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap"
          style={{ color: 'var(--colony-text-secondary)', fontFamily: 'monospace' }}
        >
          {JSON.stringify(entry, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null)
  const [selected, setSelected] = useState<AuditEntry | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/colony/admin/audit')
      .then(r => r.json())
      .then((json: { status: string; data?: AuditEntry[]; error?: string }) => {
        if (json.status === 'ok' && json.data) {
          setEntries(json.data)
        } else {
          setError(json.error ?? 'Failed to load audit log')
        }
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Network error'))
  }, [])

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: 'var(--colony-text-secondary)' }}>
        Every onboarding action recorded. Click a row to see full details.
      </p>

      {error && (
        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
        >
          {error}
        </div>
      )}

      {entries === null && !error && (
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Loading...</div>
      )}

      {entries !== null && entries.length === 0 && (
        <div
          className="rounded-xl px-6 py-12 text-center"
          style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
        >
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm font-medium" style={{ color: 'var(--colony-text-primary)' }}>
            No onboardings yet
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            Entries appear here after the first customer is provisioned.
          </p>
        </div>
      )}

      {entries && entries.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--colony-border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--colony-bg-elevated)', borderBottom: '1px solid var(--colony-border)' }}>
                {['Timestamp', 'Admin', 'Action', 'Cohort', 'Success', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--colony-text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const stepsObj = entry.result as Record<string, { success: boolean }> | undefined
                const allOk = stepsObj
                  ? Object.values(stepsObj).every(s => s.success)
                  : false
                return (
                  <tr
                    key={entry.id}
                    style={{ borderBottom: '1px solid var(--colony-border)', background: 'var(--colony-bg-content)' }}
                  >
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--colony-text-secondary)' }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--colony-text-primary)' }}>
                      {entry.admin_email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--colony-bg-elevated)', color: 'var(--colony-accent)' }}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--colony-text-primary)' }}>
                      {entry.target_cohort_id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusDot success={allOk} />
                        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
                          {allOk ? 'All steps' : 'Partial'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(entry)}
                        className="text-xs underline transition-opacity hover:opacity-70"
                        style={{ color: 'var(--colony-accent)' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && <AuditDetailModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
