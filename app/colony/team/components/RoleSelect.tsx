'use client'

import type { ColonyRole } from '@/lib/colony/permissions'

const ROLES: { value: ColonyRole; label: string; description: string }[] = [
  { value: 'viewer',  label: 'Viewer',  description: 'Read-only access' },
  { value: 'staff',   label: 'Staff',   description: 'View + send emails' },
  { value: 'admin',   label: 'Admin',   description: 'Full access except onboarding' },
  { value: 'owner',   label: 'Owner',   description: 'Full access' },
]

interface Props {
  value: ColonyRole
  onChange: (role: ColonyRole) => void
  disabled?: boolean
  allowOwner?: boolean
}

export function RoleSelect({ value, onChange, disabled, allowOwner }: Props) {
  const options = allowOwner ? ROLES : ROLES.filter(r => r.value !== 'owner')

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as ColonyRole)}
      disabled={disabled}
      style={{
        background: 'var(--colony-bg-elevated)',
        border: '1px solid var(--colony-border)',
        borderRadius: 8,
        color: 'var(--colony-text-primary)',
        fontSize: 13,
        padding: '6px 10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {options.map(r => (
        <option key={r.value} value={r.value}>
          {r.label} — {r.description}
        </option>
      ))}
    </select>
  )
}
