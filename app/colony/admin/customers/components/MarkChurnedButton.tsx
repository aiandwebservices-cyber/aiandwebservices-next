'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MarkChurnedButton({ cohortId, businessName }: { cohortId: string; businessName: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const router = useRouter()

  async function confirm() {
    setLoading(true)
    try {
      await fetch(`/api/colony/admin/customers/${cohortId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'mark_churned', notes }),
      })
      setShowConfirm(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs font-semibold px-3 py-1.5 rounded-md border transition-opacity"
        style={{ borderColor: 'var(--colony-danger)', color: 'var(--colony-danger)' }}
      >
        Mark churned
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => !loading && setShowConfirm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="rounded-xl p-6 max-w-md w-full"
            style={{ background: 'var(--colony-bg-content)', border: '1px solid var(--colony-border)' }}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--colony-text-primary)' }}>
              Mark {businessName} as churned?
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--colony-text-secondary)' }}>
              Writes to audit log. Does not delete data. Cohort can be reactivated later.
            </p>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--colony-text-secondary)' }}>
              Reason (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md px-3 py-2 text-sm mb-4"
              style={{
                background: 'var(--colony-bg-elevated)',
                border: '1px solid var(--colony-border)',
                color: 'var(--colony-text-primary)',
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="text-xs font-semibold px-3 py-1.5 rounded-md"
                style={{ color: 'var(--colony-text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={loading}
                className="text-xs font-semibold px-3 py-1.5 rounded-md disabled:opacity-50"
                style={{ background: 'var(--colony-danger)', color: '#fff' }}
              >
                {loading ? 'Applying…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
