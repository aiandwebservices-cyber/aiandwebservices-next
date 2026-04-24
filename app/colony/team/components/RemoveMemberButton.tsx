'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface Props {
  userId: string
  name: string
  onRemoved: (userId: string) => void
}

export function RemoveMemberButton({ userId, name, onRemoved }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    setLoading(true)
    try {
      const res = await fetch(`/api/colony/team/members/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        onRemoved(userId)
      }
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 12, color: 'var(--colony-text-secondary)' }}>
          Remove {name}?
        </span>
        <button
          onClick={handleRemove}
          disabled={loading}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--colony-danger)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 8px',
          }}
        >
          {loading ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            fontSize: 12,
            color: 'var(--colony-text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 8px',
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Remove ${name}`}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--colony-text-secondary)',
        padding: 4,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        opacity: 0.6,
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')}
    >
      <Trash2 size={14} />
    </button>
  )
}
