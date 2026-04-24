'use client'

import { useState } from 'react'
import type { IdentityCandidatePair } from '@/lib/colony/admin-queries'
import MergeCandidateRow from './MergeCandidateRow'

export default function IdentityQueueClient({ initial }: { initial: IdentityCandidatePair[] }) {
  const [pairs, setPairs] = useState(initial)

  function resolve(id: string) {
    setPairs(prev => prev.filter(p => p.id !== id))
  }

  if (pairs.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
          No duplicate candidates
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Scanner will re-check on next page load.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {pairs.map(p => (
        <MergeCandidateRow key={p.id} pair={p} onResolved={resolve} />
      ))}
    </div>
  )
}
