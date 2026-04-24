'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { RoleSelect } from './RoleSelect'
import { RemoveMemberButton } from './RemoveMemberButton'
import type { OrgMember, OrgInvitation } from '@/lib/colony/organizations'
import type { ColonyRole } from '@/lib/colony/permissions'
import { hasPermission } from '@/lib/colony/permissions'

interface TeamData {
  members: OrgMember[]
  invitations: OrgInvitation[]
  currentUserRole: ColonyRole
}

function initials(m: OrgMember) {
  return [(m.firstName ?? '')[0], (m.lastName ?? '')[0]].filter(Boolean).join('').toUpperCase() || '?'
}

function hoursAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  return h < 1 ? 'just now' : `${h}h ago`
}

export function MemberList() {
  const { user } = useUser()
  const [data, setData] = useState<TeamData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/colony/team/members')
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(() => setError('Could not load team'))
  }, [])

  async function handleRoleChange(userId: string, role: ColonyRole) {
    if (!data) return
    setUpdatingRole(userId)
    try {
      await fetch(`/api/colony/team/members/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      setData(prev => prev
        ? { ...prev, members: prev.members.map(m => m.userId === userId ? { ...m, role } : m) }
        : prev
      )
    } finally {
      setUpdatingRole(null)
    }
  }

  function handleRemoved(userId: string) {
    setData(prev => prev
      ? { ...prev, members: prev.members.filter(m => m.userId !== userId) }
      : prev
    )
  }

  if (error) {
    return <p style={{ color: 'var(--colony-danger)', fontSize: 13 }}>{error}</p>
  }

  if (!data) {
    return <p style={{ color: 'var(--colony-text-secondary)', fontSize: 13 }}>Loading…</p>
  }

  const canManage = hasPermission(data.currentUserRole, 'manage_team')
  const isOwner = data.currentUserRole === 'owner'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.members.map(m => {
        const isMe = m.userId === user?.id
        const isThisOwner = m.role === 'owner'
        const canRemove = canManage && !isMe && !isThisOwner
        const canEditRole = canManage && !isMe

        return (
          <div
            key={m.userId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--colony-bg-elevated)',
              border: '1px solid var(--colony-border)',
              borderRadius: 10,
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(42,165,160,0.2)',
              border: '1px solid rgba(42,165,160,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(42,165,160,1)',
              flexShrink: 0,
            }}>
              {initials(m)}
            </div>

            {/* Name + email */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--colony-text-primary)' }}>
                {[m.firstName, m.lastName].filter(Boolean).join(' ') || m.email}
                {isMe && <span style={{ fontSize: 11, color: 'var(--colony-text-secondary)', marginLeft: 6 }}>(you)</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--colony-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.email}
              </div>
            </div>

            {/* Role */}
            {canEditRole ? (
              <RoleSelect
                value={m.role}
                onChange={role => handleRoleChange(m.userId, role)}
                disabled={updatingRole === m.userId}
                allowOwner={isOwner}
              />
            ) : (
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--colony-text-secondary)',
                textTransform: 'capitalize',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 6,
              }}>
                {m.role}
              </span>
            )}

            {/* Remove */}
            {canRemove && (
              <RemoveMemberButton
                userId={m.userId}
                name={[m.firstName, m.lastName].filter(Boolean).join(' ') || m.email}
                onRemoved={handleRemoved}
              />
            )}
          </div>
        )
      })}

      {/* Pending invitations */}
      {data.invitations.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--colony-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Pending invitations
          </p>
          {data.invitations.map(inv => (
            <div
              key={inv.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--colony-border)',
                borderRadius: 10,
                marginBottom: 4,
              }}
            >
              <div style={{ flex: 1, fontSize: 13, color: 'var(--colony-text-secondary)' }}>
                {inv.email}
              </div>
              <span style={{ fontSize: 12, color: 'var(--colony-text-secondary)', textTransform: 'capitalize' }}>
                {inv.role}
              </span>
              <span style={{ fontSize: 11, color: 'var(--colony-text-secondary)' }}>
                Invited {hoursAgo(inv.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {data.members.length === 0 && data.invitations.length === 0 && (
        <p style={{ color: 'var(--colony-text-secondary)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
          No team members yet. Invite someone below.
        </p>
      )}
    </div>
  )
}
