'use client'

import { useEffect } from 'react'
import { useBotPerformance } from '../hooks/useBotPerformance'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { capture } from '../../lib/posthog'
import type { BotPerformanceRow } from '@/lib/colony/contracts'

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  const w = 48
  const h = 20
  const barW = Math.floor(w / values.length) - 1

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {values.map((v, i) => {
        const barH = Math.round((v / max) * (h - 2))
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={h - barH - 1}
            width={barW}
            height={barH}
            rx={1}
            fill="rgba(42,165,160,0.55)"
          />
        )
      })}
    </svg>
  )
}

const TREND_ICON: Record<BotPerformanceRow['trend'], string> = {
  up:     '▲',
  down:   '▼',
  stable: '→',
}
const TREND_COLOR: Record<BotPerformanceRow['trend'], string> = {
  up:     'var(--colony-success)',
  down:   'var(--colony-danger)',
  stable: 'var(--colony-text-secondary)',
}

export function BotPerformance() {
  const { data, status } = useBotPerformance()

  useEffect(() => {
    if (status === 'ok') capture('colony_analytics_section_viewed', { section: 'bot_performance' })
  }, [status])

  if (status === 'loading') return <LoadingSkeleton variant="list-row" count={5} />
  if (status === 'error' || !data || data.rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-xl" style={{ background: 'rgba(163,163,163,0.04)', border: '1px dashed var(--colony-border)' }}>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Need more data to compute</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--colony-bg-elevated)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--colony-border)' }}>
              {['Bot', 'Runs', 'Decisions', 'Avg/run', 'Last 4 weeks', 'Trend'].map(h => (
                <th
                  key={h}
                  className={`px-4 py-2.5 text-xs font-semibold ${h === 'Bot' ? 'text-left' : 'text-right'}`}
                  style={{ color: 'var(--colony-text-secondary)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={row.bot_name}
                style={{ borderBottom: i < data.rows.length - 1 ? '1px solid var(--colony-border)' : undefined }}
              >
                <td className="px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--colony-text-primary)' }}>
                  {row.bot_name}
                </td>
                <td className="px-4 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>
                  {row.total_runs}
                </td>
                <td className="px-4 py-2.5 text-xs text-right tabular-nums font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                  {row.total_decisions.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-xs text-right tabular-nums" style={{ color: 'var(--colony-text-secondary)' }}>
                  {row.avg_decisions_per_run}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div style={{ display: 'inline-block' }}>
                    <Sparkline values={row.weekly_decisions} />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-right font-bold" style={{ color: TREND_COLOR[row.trend] }}>
                  {TREND_ICON[row.trend]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
