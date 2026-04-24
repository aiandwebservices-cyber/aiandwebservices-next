'use client'

import { useState } from 'react'
import { RoleSelect } from './RoleSelect'
import type { ColonyRole } from '@/lib/colony/permissions'
import { capture } from '../../lib/posthog'

interface Props {
  onInvited?: (email: string, role: ColonyRole) => void
}

export function InviteForm({ onInvited }: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<ColonyRole>('staff')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/colony/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), role }),
      })
      const json = await res.json()

      if (!res.ok || json.status !== 'ok') {
        setError(json.error ?? 'Invite failed')
        setStatus('error')
        return
      }

      capture('colony_team_invite_sent', { role })
      setStatus('success')
      onInvited?.(email, role)
      setEmail('')
      setRole('staff')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setError('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--colony-text-secondary)', marginBottom: 4 }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          required
          style={{
            width: '100%',
            background: 'var(--colony-bg-elevated)',
            border: `1px solid ${error ? 'var(--colony-danger)' : 'var(--colony-border)'}`,
            borderRadius: 8,
            color: 'var(--colony-text-primary)',
            fontSize: 13,
            padding: '8px 12px',
            outline: 'none',
          }}
        />
        {error && <p style={{ fontSize: 12, color: 'var(--colony-danger)', marginTop: 4 }}>{error}</p>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--colony-text-secondary)', marginBottom: 4 }}>
          Role
        </label>
        <RoleSelect value={role} onChange={setRole} allowOwner={false} />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="colony-btn-primary"
        style={{ padding: '8px 20px', fontSize: 13, flexShrink: 0 }}
      >
        {status === 'loading' ? 'Sending…' : status === 'success' ? 'Sent ✓' : 'Send invite'}
      </button>
    </form>
  )
}
