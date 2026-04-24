'use client'

import { useMemo, useState } from 'react'
import type { CustomerSummary } from '@/lib/colony/admin-queries'
import CustomerRow from './CustomerRow'

export default function CustomerSearch({ initial }: { initial: CustomerSummary[] }) {
  const [q, setQ] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const plans = useMemo(() => {
    const set = new Set(initial.map(c => c.plan))
    return ['all', ...Array.from(set)]
  }, [initial])

  const filtered = useMemo(() => {
    return initial.filter(c => {
      if (planFilter !== 'all' && c.plan !== planFilter) return false
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (q) {
        const needle = q.toLowerCase()
        if (!c.business_name.toLowerCase().includes(needle) && !c.cohort_id.toLowerCase().includes(needle)) {
          return false
        }
      }
      return true
    })
  }, [initial, q, planFilter, statusFilter])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by business or cohort id…"
          className="flex-1 min-w-[200px] rounded-md px-3 py-2 text-sm"
          style={{
            background: 'var(--colony-bg-elevated)',
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-primary)',
          }}
        />
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="rounded-md px-3 py-2 text-sm"
          style={{
            background: 'var(--colony-bg-elevated)',
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-primary)',
          }}
        >
          {plans.map(p => <option key={p} value={p}>{p === 'all' ? 'All plans' : p}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md px-3 py-2 text-sm"
          style={{
            background: 'var(--colony-bg-elevated)',
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-primary)',
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="onboarding">Onboarding</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--colony-border)' }}>
        <table className="w-full">
          <thead style={{ background: 'var(--colony-bg-elevated)' }}>
            <tr className="text-xs uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-right">MRR</th>
              <th className="px-4 py-2 text-right">Leads 7d</th>
              <th className="px-4 py-2 text-left">Last active</th>
              <th className="px-4 py-2 text-center">Alerts</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => <CustomerRow key={c.cohort_id} summary={c} />)}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
                  No customers match these filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
