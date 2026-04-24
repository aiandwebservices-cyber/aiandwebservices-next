'use client'

import { useEffect } from 'react'
import { KanbanBoard } from './components/KanbanBoard'
import { ColonyErrorBoundary } from '../components/ColonyErrorBoundary'
import { capture } from '../lib/posthog'

export default function PipelinePage() {
  useEffect(() => { capture('colony_pipeline_viewed') }, [])

  return (
    <ColonyErrorBoundary>
      <main className="p-6 h-[calc(100vh-48px)] flex flex-col gap-4 overflow-hidden">
        <header>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Pipeline
          </h1>
          <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
            Drag deals between stages. Changes sync to EspoCRM.
          </p>
        </header>
        <KanbanBoard />
      </main>
    </ColonyErrorBoundary>
  )
}
