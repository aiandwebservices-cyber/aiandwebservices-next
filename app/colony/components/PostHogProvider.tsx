'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'

let booted = false

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!booted && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
        capture_pageview: false,
      })
      booted = true
    }
  }, [])

  useEffect(() => {
    if (isLoaded && user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      })
    }
  }, [isLoaded, user])

  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname])

  return <>{children}</>
}
