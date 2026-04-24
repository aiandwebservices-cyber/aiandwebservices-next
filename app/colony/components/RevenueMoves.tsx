'use client'

import { useState, useEffect } from 'react'
import { useCohort } from './CohortSwitcher'
import { getLeadsForCohort, getDealsForCohort } from '../lib/mock-data'
import { deriveRevenueMoves } from '../lib/revenue-helpers'
import RevenueMoveCard from './RevenueMoveCard'

export function RevenueMoves() {
  const { cohortId } = useCohort()
  const [refreshedAt, setRefreshedAt] = useState<string>('')

  useEffect(() => {
    setRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [])

  const leads = getLeadsForCohort(cohortId)
  const deals = getDealsForCohort(cohortId)
  const moves = deriveRevenueMoves(leads, deals)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Today&apos;s Revenue Moves
        </h2>
        {refreshedAt && (
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }}>
            as of {refreshedAt}
          </span>
        )}
      </div>

      {moves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3" style={{ color: 'var(--colony-success)' }}>✓</div>
          <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
            You&apos;re ahead of everything.
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>Nice.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {moves.map(move => (
            <RevenueMoveCard key={move.id} move={move} />
          ))}
        </div>
      )}
    </div>
  )
}
