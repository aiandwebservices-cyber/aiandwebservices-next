'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Me {
  isAdmin: boolean
  isImpersonating: boolean
  impersonatedCohort: string | null
}

export default function ImpersonationBanner() {
  const [me, setMe] = useState<Me | null>(null)
  const [exiting, setExiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/colony/admin/me', { credentials: 'include', cache: 'no-store' })
      .then(r => r.json())
      .then(setMe)
      .catch(() => setMe(null))
  }, [])

  if (!me?.isImpersonating || !me.impersonatedCohort) return null

  async function exitImpersonation() {
    setExiting(true)
    await fetch('/api/colony/admin/impersonate', {
      method: 'DELETE',
      credentials: 'include',
    })
    router.refresh()
    setTimeout(() => setExiting(false), 800)
  }

  return (
    <div
      className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium sticky top-0 z-40"
      style={{
        background: 'var(--colony-warning)',
        color: '#0a0a0a',
      }}
    >
      <div>
        <strong>Impersonating {me.impersonatedCohort}.</strong>{' '}
        Your actions may affect their data.
      </div>
      <button
        onClick={exitImpersonation}
        disabled={exiting}
        className="px-3 py-1 rounded-md text-xs font-semibold transition-opacity disabled:opacity-50"
        style={{ background: '#0a0a0a', color: '#fff' }}
      >
        {exiting ? 'Exiting…' : 'Exit impersonation'}
      </button>
    </div>
  )
}
