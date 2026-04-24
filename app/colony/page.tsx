'use client'

import { useEffect } from 'react'
import { ActivityFeed } from './components/ActivityFeed'
import { RevenueMoves } from './components/RevenueMoves'
import BotRoster from './components/BotRoster'
import { capture } from './lib/posthog'

export default function Page() {
  useEffect(() => {
    capture('colony_feed_viewed')
  }, [])

  return (
    <main className="p-6 flex flex-col gap-6 overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>
      <BotRoster />
      <div className="flex gap-6 flex-1 overflow-hidden">
      <section className="flex-[3] min-w-0 overflow-y-auto">
        <ActivityFeed />
      </section>
      <aside
        className="flex-[2] min-w-0 overflow-y-auto border-l pl-6"
        style={{ borderColor: 'var(--colony-border)' }}
      >
        <RevenueMoves />
      </aside>
      </div>
    </main>
  )
}
