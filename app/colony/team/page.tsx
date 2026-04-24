'use client'

import { useEffect } from 'react'
import { MemberList } from './components/MemberList'
import { InviteForm } from './components/InviteForm'
import { capture } from '../lib/posthog'

export default function TeamPage() {
  useEffect(() => { capture('colony_team_viewed') }, [])

  return (
    <main className="p-6 flex flex-col gap-6" style={{ maxWidth: 720 }}>
      <header>
        <h1
          className="colony-headline"
          style={{ fontSize: 24, fontWeight: 800, color: 'var(--colony-text-primary)', marginBottom: 6 }}
        >
          Team
        </h1>
        <p style={{ fontSize: 14, color: 'var(--colony-text-secondary)', margin: 0 }}>
          Invite your team to Colony. Everyone shares your business data with role-based permissions.
        </p>
      </header>

      <section
        style={{
          background: 'var(--colony-bg-elevated)',
          border: '1px solid var(--colony-border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}
      >
        <h2
          className="colony-headline"
          style={{ fontSize: 15, fontWeight: 700, color: 'var(--colony-text-primary)', marginBottom: 14 }}
        >
          Invite a team member
        </h2>
        <InviteForm />
      </section>

      <section>
        <h2
          className="colony-headline"
          style={{ fontSize: 15, fontWeight: 700, color: 'var(--colony-text-primary)', marginBottom: 12 }}
        >
          Members
        </h2>
        <MemberList />
      </section>

      <section
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--colony-border)',
          borderRadius: 10,
          padding: '14px 18px',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--colony-text-secondary)', margin: 0 }}>
          <strong style={{ color: 'var(--colony-text-primary)' }}>Roles:</strong>{' '}
          <span style={{ marginRight: 12 }}><strong>Owner</strong> — full access</span>
          <span style={{ marginRight: 12 }}><strong>Admin</strong> — full access except onboarding</span>
          <span style={{ marginRight: 12 }}><strong>Staff</strong> — view + send emails</span>
          <span><strong>Viewer</strong> — read-only</span>
        </p>
      </section>
    </main>
  )
}
