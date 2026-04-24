'use client'

import { useState } from 'react'
import type { IdentityCandidatePair } from '@/lib/colony/admin-queries'

export default function MergeCandidateRow({ pair, onResolved }: {
  pair: IdentityCandidatePair
  onResolved: (id: string) => void
}) {
  const [loading, setLoading] = useState<null | 'merge' | 'dismiss'>(null)
  const [canonical, setCanonical] = useState<'left' | 'right'>('left')

  async function submit(dismiss: boolean) {
    setLoading(dismiss ? 'dismiss' : 'merge')
    try {
      const canonicalSide = canonical === 'left' ? pair.left : pair.right
      const duplicateSide = canonical === 'left' ? pair.right : pair.left
      await fetch('/api/colony/admin/identity/merge', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: pair.id,
          canonical: canonicalSide,
          duplicate: duplicateSide,
          dismiss,
        }),
      })
      onResolved(pair.id)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--colony-warning)', color: '#0a0a0a' }}
          >
            {pair.reason.replace('_', ' ')}
          </span>
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
            {(pair.confidence * 100).toFixed(0)}% confidence
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(['left', 'right'] as const).map(side => {
          const entity = pair[side]
          const selected = canonical === side
          return (
            <button
              key={side}
              onClick={() => setCanonical(side)}
              className="text-left rounded-md p-3 transition-all"
              style={{
                border: `2px solid ${selected ? 'var(--colony-accent)' : 'var(--colony-border)'}`,
                background: 'var(--colony-bg-content)',
              }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                {entity.display}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
                {entity.cohort_id} · {entity.entity_type} · {entity.entity_id}
              </p>
              {entity.email && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>{entity.email}</p>
              )}
              {entity.phone && (
                <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>{entity.phone}</p>
              )}
              {selected && (
                <p className="text-xs font-semibold mt-1" style={{ color: 'var(--colony-accent)' }}>
                  canonical
                </p>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => submit(true)}
          disabled={loading !== null}
          className="text-xs font-semibold px-3 py-1.5 rounded-md disabled:opacity-50"
          style={{ color: 'var(--colony-text-secondary)' }}
        >
          {loading === 'dismiss' ? '…' : 'Not a match'}
        </button>
        <button
          onClick={() => submit(false)}
          disabled={loading !== null}
          className="text-xs font-semibold px-3 py-1.5 rounded-md disabled:opacity-50"
          style={{ background: 'var(--colony-accent)', color: '#fff' }}
        >
          {loading === 'merge' ? '…' : 'Merge (dry-run)'}
        </button>
      </div>
    </div>
  )
}
