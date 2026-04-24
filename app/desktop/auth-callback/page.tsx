'use client'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function DesktopAuthCallback() {
  const { getToken, userId } = useAuth()

  useEffect(() => {
    if (userId) {
      getToken().then(token => {
        window.location.href = `colony://auth?token=${encodeURIComponent(token ?? '')}`
      })
    }
  }, [userId, getToken])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#080d18] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Signing you into Colony desktop...</h1>
        <p className="text-sm opacity-60">You&apos;ll be redirected automatically.</p>
      </div>
    </main>
  )
}
