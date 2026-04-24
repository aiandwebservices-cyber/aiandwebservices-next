'use client'

import { useEffect } from 'react'
import { ActivityFeed } from './components/ActivityFeed'
import { RevenueMoves } from './components/RevenueMoves'
import { capture } from './lib/posthog'

export default function Page() {
  useEffect(() => {
    capture('colony_feed_viewed')
  }, [])

  return (
    <main className="flex gap-6 p-6 overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>
      <section className="flex-[3] min-w-0 overflow-y-auto">
        <ActivityFeed />
      </section>
      <aside
        className="flex-[2] min-w-0 overflow-y-auto border-l pl-6"
        style={{ borderColor: 'var(--colony-border)' }}
      >
        <RevenueMoves />
      </aside>
    </main>
  )
}
