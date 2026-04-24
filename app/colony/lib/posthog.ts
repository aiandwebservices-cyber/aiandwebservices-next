'use client'

import posthog from 'posthog-js'

export function capture(event: string, properties?: Record<string, unknown>) {
  if (!event.startsWith('colony_')) {
    event = `colony_${event}`
  }
  posthog.capture(event, properties)
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  posthog.identify(userId, traits)
}
