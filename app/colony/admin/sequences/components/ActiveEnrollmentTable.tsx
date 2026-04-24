'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EnrollmentWithTemplateName } from '@/lib/colony/sequences/types'

export default function ActiveEnrollmentTable({ initial }: { initial: EnrollmentWithTemplateName[] }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'halted' | 'completed'>('all')
  const [rows, setRows] = useState(initial)
  const [pending, setPending] = useState<string | null>(null)
  const router = useRouter()

  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  async function halt(id: string) {
    setPending(id)
    try {
      await fetch('/api/colony/sequences/halt', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: id }),
      })
      setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'halted', halt_reason: 'manual' } : r))
      router.refresh()
    } finally {
      setPending(null)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {(['all', 'active', 'halted', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: filter === f ? 'var(--colony-accent)' : 'var(--colony-bg-elevated)',
              color: filter === f ? '#fff' : 'var(--colony-text-primary)',
              border: '1px solid var(--colony-border)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--colony-border)' }}>
        <table className="w-full">
          <thead style={{ background: 'var(--colony-bg-elevated)' }}>
            <tr className="text-xs uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              <th className="px-4 py-2 text-left">Lead</th>
              <th className="px-4 py-2 text-left">Template</th>
              <th className="px-4 py-2 text-right">Step</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Next due</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="text-sm" style={{ borderBottom: '1px solid var(--colony-border)' }}>
                <td className="px-4 py-2 font-mono text-xs" style={{ color: 'var(--colony-text-primary)' }}>{e.lead_id}</td>
                <td className="px-4 py-2" style={{ color: 'var(--colony-text-secondary)' }}>{e.template_name}</td>
                <td className="px-4 py-2 text-right" style={{ color: 'var(--colony-text-primary)' }}>{e.current_step}</td>
                <td className="px-4 py-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: e.status === 'active'
                        ? 'rgba(42,165,160,0.12)'
                        : e.status === 'halted'
                          ? 'rgba(245,158,11,0.15)'
                          : 'rgba(16,185,129,0.12)',
                      color: e.status === 'active'
                        ? 'var(--colony-accent)'
                        : e.status === 'halted'
                          ? 'var(--colony-warning)'
                          : 'var(--colony-success)',
                    }}
                  >
                    {e.status}{e.halt_reason ? ` · ${e.halt_reason}` : ''}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
                  {e.next_send_due_at ? new Date(e.next_send_due_at).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  {e.status === 'active' && (
                    <button
                      onClick={() => halt(e.id)}
                      disabled={pending === e.id}
                      className="text-xs font-semibold px-3 py-1 rounded-md disabled:opacity-50"
                      style={{ border: '1px solid var(--colony-warning)', color: 'var(--colony-warning)' }}
                    >
                      {pending === e.id ? '…' : 'Halt'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
                  No enrollments for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
