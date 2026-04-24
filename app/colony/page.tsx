'use client'

import { useEffect } from 'react'
import { ActivityFeed } from './components/ActivityFeed'
import { RevenueMoves } from './components/RevenueMoves'
import { BillNyeHomeCard } from './components/BillNyeHomeCard'
import BotRoster from './components/BotRoster'
import { capture } from './lib/posthog'
import { ColonyErrorBoundary } from './components/ColonyErrorBoundary'

export default function Page() {
  useEffect(() => {
    capture('colony_feed_viewed')
  }, [])

  return (
    <ColonyErrorBoundary>
      <div style={{ position: 'relative', height: 'calc(100vh - 56px)' }}>
        {/* Ambient atmosphere — subtle teal orbs + dot pattern, matches homepage hero */}
        <div className="colony-orb-bg" aria-hidden="true" />
        <div className="colony-dot-pattern" aria-hidden="true" />

        <main
          className="p-6 flex flex-col gap-6 overflow-hidden"
          style={{ position: 'relative', zIndex: 1, height: '100%' }}
        >
          <BotRoster />
          <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
            <section className="flex-[3] min-w-0 overflow-y-auto">
              <ActivityFeed />
            </section>
            <aside
              className="flex-[2] min-w-0 overflow-y-auto md:border-l md:pl-6 flex flex-col gap-6"
              style={{ borderColor: 'rgba(255,255,255,.08)' }}
            >
              <BillNyeHomeCard />
              <RevenueMoves />
            </aside>
          </div>
        </main>
      </div>
    </ColonyErrorBoundary>
  )
}
