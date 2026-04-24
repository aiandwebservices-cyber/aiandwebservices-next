'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useOrganizationList } from '@clerk/nextjs'

export default function AcceptInvitePage() {
  const router = useRouter()
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  const { userInvitations, isLoaded: invitesLoaded } = useOrganizationList({
    userInvitations: { pageSize: 10 },
  })
  const [status, setStatus] = useState<'loading' | 'accepting' | 'done' | 'no-invite'>('loading')

  useEffect(() => {
    if (!userLoaded) return

    if (!isSignedIn) {
      router.replace('/colony/sign-in?redirect_url=/invite/accept')
      return
    }

    if (!invitesLoaded) return

    const pending = userInvitations?.data?.filter(inv => inv.status === 'pending') ?? []

    if (pending.length === 0) {
      setStatus('no-invite')
      setTimeout(() => router.replace('/colony'), 2000)
      return
    }

    setStatus('accepting')
    pending[0]
      .accept()
      .then(() => {
        setStatus('done')
        setTimeout(() => router.replace('/colony'), 1500)
      })
      .catch(() => {
        setStatus('done')
        setTimeout(() => router.replace('/colony'), 1500)
      })
  }, [userLoaded, isSignedIn, invitesLoaded, userInvitations, router])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080d18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          padding: 40,
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--colony-font-headline, "Plus Jakarta Sans", sans-serif)',
            fontSize: 24,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 12,
            letterSpacing: '-0.5px',
          }}
        >
          Colony
        </div>

        {status === 'loading' && (
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>Loading…</p>
        )}
        {status === 'accepting' && (
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>Accepting your invitation…</p>
        )}
        {status === 'done' && (
          <>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
              You're in!
            </p>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>
              Redirecting to Colony…
            </p>
          </>
        )}
        {status === 'no-invite' && (
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>
            No pending invitation found. Redirecting…
          </p>
        )}
      </div>
    </div>
  )
}
