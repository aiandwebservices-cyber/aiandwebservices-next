'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ImpersonateButton({ cohortId }: { cohortId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function impersonate() {
    setLoading(true)
    try {
      const res = await fetch('/api/colony/admin/impersonate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId }),
      })
      if (res.ok) {
        router.push('/colony')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={impersonate}
      disabled={loading}
      className="text-xs font-semibold px-3 py-1.5 rounded-md transition-opacity disabled:opacity-50"
      style={{ background: 'var(--colony-accent)', color: '#fff' }}
    >
      {loading ? '…' : 'Impersonate'}
    </button>
  )
}
