'use client'

import type { MRRBreakdown } from '../types'

interface MRRBreakdownTableProps {
  breakdown: MRRBreakdown[]
}

export function MRRBreakdownTable({ breakdown }: MRRBreakdownTableProps) {
  const total = breakdown.reduce((sum, row) => sum + row.monthly_amount, 0)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--colony-border)' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--colony-bg-elevated)', borderBottom: '1px solid var(--colony-border)' }}>
            <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              Plan
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              Clients
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              MRR
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row, i) => {
            const share = total > 0 ? (row.monthly_amount / total) * 100 : 0
            return (
              <tr
                key={row.plan}
                style={{
                  borderBottom: i < breakdown.length - 1 ? '1px solid var(--colony-border)' : 'none',
                  background: i % 2 === 1 ? 'rgba(163,163,163,0.03)' : 'transparent',
                }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--colony-text-primary)' }}>
                  {row.plan}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: 'var(--colony-text-secondary)' }}>
                  {row.count}
                </td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                  ${row.monthly_amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: 'var(--colony-text-secondary)' }}>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--colony-border)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, background: 'var(--colony-accent)' }}
                      />
                    </div>
                    <span>{share.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid var(--colony-border)', background: 'var(--colony-bg-elevated)' }}>
            <td className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              Total
            </td>
            <td className="px-4 py-2.5 text-right text-xs font-semibold" style={{ color: 'var(--colony-text-secondary)' }}>
              {breakdown.reduce((s, r) => s + r.count, 0)}
            </td>
            <td className="px-4 py-2.5 text-right font-bold" style={{ color: 'var(--colony-text-primary)' }}>
              ${total.toLocaleString()}
            </td>
            <td className="px-4 py-2.5 text-right text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
              100%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
