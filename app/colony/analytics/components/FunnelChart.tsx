'use client'

import { useEffect } from 'react'
import { useFunnel } from '../hooks/useFunnel'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { capture } from '../../lib/posthog'

function EmptyFunnel() {
  return (
    <div className="flex items-center justify-center h-48 rounded-xl" style={{ background: 'rgba(163,163,163,0.04)', border: '1px dashed var(--colony-border)' }}>
      <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Need more data to compute</p>
    </div>
  )
}

export function FunnelChart() {
  const { data, status } = useFunnel()

  useEffect(() => {
    if (status === 'ok') capture('colony_analytics_section_viewed', { section: 'funnel' })
  }, [status])

  if (status === 'loading') return <LoadingSkeleton variant="list-row" count={6} />
  if (status === 'error' || !data) return <EmptyFunnel />

  const maxCount = Math.max(...data.stages.map(s => s.count), 1)

  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--colony-bg-elevated)' }}>
      <div className="flex flex-col gap-3">
        {data.stages.map((stage, i) => {
          const barWidth = (stage.count / maxCount) * 100
          const opacity = Math.max(0.25, 1 - i * 0.07)
          return (
            <div key={stage.name}>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs shrink-0 text-right"
                  style={{ width: 132, color: 'var(--colony-text-secondary)' }}
                >
                  {stage.name}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="flex-1 rounded-full overflow-hidden"
                    style={{ height: 18, background: 'rgba(163,163,163,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        background: `rgba(42,165,160,${opacity})`,
                        minWidth: stage.count > 0 ? 4 : 0,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold tabular-nums shrink-0"
                    style={{ width: 28, color: 'var(--colony-text-primary)', textAlign: 'right' }}
                  >
                    {stage.count}
                  </span>
                </div>
              </div>
              {stage.conversion_from_previous !== null && (
                <div style={{ paddingLeft: 144 }}>
                  <span className="text-[10px]" style={{ color: 'var(--colony-text-secondary)', opacity: 0.55 }}>
                    ↓ {stage.conversion_from_previous}% conversion
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs mt-4" style={{ color: 'var(--colony-text-secondary)', opacity: 0.45 }}>
        {data.total_leads} total leads · {data.period.replace(/_/g, ' ')}
      </p>
    </div>
  )
}
