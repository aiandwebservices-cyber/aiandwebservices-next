'use client'
import { ColonyErrorBoundary } from '../components/ColonyErrorBoundary'

export default function Page() {
  return (
    <ColonyErrorBoundary>
      <main className="p-8">
        <h1 className="text-3xl font-bold">Pipeline</h1>
        <p className="mt-2" style={{ color: 'var(--colony-text-secondary)' }}>Coming in Phase 4.</p>
      </main>
    </ColonyErrorBoundary>
  )
}
