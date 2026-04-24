'use client'

import { useEffect } from 'react'
import { ColonyErrorBoundary } from '../components/ColonyErrorBoundary'
import { FunnelChart } from './components/FunnelChart'
import { VelocityPanel } from './components/VelocityPanel'
import { SourcePerformance } from './components/SourcePerformance'
import { NichePerformance } from './components/NichePerformance'
import { BotPerformance } from './components/BotPerformance'
import { CohortComparison } from './components/CohortComparison'
import { capture } from '../lib/posthog'

export default function AnalyticsPage() {
  useEffect(() => { capture('colony_analytics_viewed') }, [])

  return (
    <ColonyErrorBoundary>
      <main className="p-6 flex flex-col gap-6 h-[calc(100vh-48px)] overflow-y-auto">
        <header>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
            Your AI workforce&apos;s output, measured.
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Funnel</h2>
          <FunnelChart />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Velocity</h2>
            <VelocityPanel />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Cohort Comparison</h2>
            <CohortComparison />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Performance by Source</h2>
          <SourcePerformance />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Performance by Niche</h2>
          <NichePerformance />
        </section>

        <section className="pb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>Bot Performance</h2>
          <BotPerformance />
        </section>
      </main>
    </ColonyErrorBoundary>
  )
}
