'use client'

import { useEffect, useState } from 'react'
import { useNiches } from '../hooks/useNiches'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { capture } from '../../lib/posthog'
import type { NichePerformanceRow } from '@/lib/colony/contracts'

type SortKey = keyof Omit<NichePerformanceRow, 'niche'>

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'leads_count',     label: 'Leads'        },
  { key: 'outreach_rate',   label: 'Outreach %'   },
  { key: 'reply_rate',      label: 'Reply %'      },
  { key: 'interested_rate', label: 'Interested %' },
  { key: 'conversion_rate', label: 'Conversion %' },
  { key: 'avg_deal_value',  label: 'Avg Deal'     },
]

export function NichePerformance() {
  const { data, status } = useNiches()
  const [sortKey, setSortKey] = useState<SortKey>('leads_count')
  const [asc, setAsc] = useState(false)

  useEffect(() => {
    if (status === 'ok') capture('colony_analytics_section_viewed', { section: 'niche_performance' })
  }, [status])

  if (status === 'loading') return <LoadingSkeleton variant="list-row" count={4} />
  if (status === 'error' || !data || data.rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-xl" style={{ background: 'rgba(163,163,163,0.04)', border: '1px dashed var(--colony-border)' }}>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Need more data to compute</p>
      </div>
    )
  }

  const maxConversion = Math.max(...data.rows.map(r => r.conversion_rate))
  const sorted = [...data.rows].sort((a, b) => {
    const diff = (a[sortKey] as number) - (b[sortKey] as number)
    return asc ? diff : -diff
  })

  function handleSort(key: SortKey) {
    if (key === sortKey) setAsc(p => !p)
    else { setSortKey(key); setAsc(false) }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--colony-bg-elevated)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--colony-border)' }}>
              <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--colony-text-secondary)' }}>
                Niche
              </th>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className="text-right px-3 py-2.5 text-xs font-semibold cursor-pointer hover:opacity-80 select-none"
                  style={{ color: sortKey === col.key ? 'var(--colony-accent)' : 'var(--colony-text-secondary)' }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortKey === col.key ? (asc ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const isBest = row.conversion_rate > 0 && row.conversion_rate === maxConversion
              return (
                <tr
                  key={row.niche}
                  style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--colony-border)' : undefined }}
                >
                  <td className="px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--colony-text-primary)' }}>
                    {isBest && <span className="mr-1">🏆</span>}
                    {row.niche}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-primary)' }}>{row.leads_count}</td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>{row.outreach_rate}%</td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>{row.reply_rate}%</td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>{row.interested_rate}%</td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums font-semibold" style={{ color: row.conversion_rate > 0 ? 'var(--colony-success)' : 'var(--colony-text-secondary)' }}>
                    {row.conversion_rate}%
                  </td>
                  <td className="px-3 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>${row.avg_deal_value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
