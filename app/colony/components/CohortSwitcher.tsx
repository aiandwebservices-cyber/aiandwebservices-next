'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Cohort } from '../lib/types'

type CohortCtx = { cohortId: Cohort; setCohortId: (id: Cohort) => void }

const CohortContext = createContext<CohortCtx>({
  cohortId: 'aiandwebservices',
  setCohortId: () => {},
})

export function useCohort() {
  return useContext(CohortContext)
}

export function CohortProvider({ children }: { children: React.ReactNode }) {
  const [cohortId, setId] = useState<Cohort>('aiandwebservices')

  useEffect(() => {
    const stored = localStorage.getItem('colony-cohort') as Cohort | null
    if (stored === 'aiandwebservices') setId(stored)
  }, [])

  const setCohortId = (id: Cohort) => {
    setId(id)
    localStorage.setItem('colony-cohort', id)
  }

  return (
    <CohortContext.Provider value={{ cohortId, setCohortId }}>
      {children}
    </CohortContext.Provider>
  )
}

export default function CohortSwitcher() {
  const { cohortId, setCohortId } = useCohort()

  return (
    <select
      value={cohortId}
      onChange={(e) => setCohortId(e.target.value as Cohort)}
      className="w-full text-xs px-2 py-1.5 rounded-md cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'var(--colony-text-chrome)',
        outline: 'none',
      }}
    >
      <option value="aiandwebservices">AIandWEBservices</option>
    </select>
  )
}
