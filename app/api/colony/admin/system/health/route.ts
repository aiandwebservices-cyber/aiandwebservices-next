import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/colony/admin'

export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'not_configured'

export interface HealthCheck {
  service: string
  status: HealthStatus
  latency_ms?: number
  detail?: string
}

async function timed<T>(fn: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const start = Date.now()
  const value = await fn()
  return { value, ms: Date.now() - start }
}

async function checkEspoCRM(): Promise<HealthCheck> {
  const url = process.env.COLONY_ESPOCRM_URL
  const key = process.env.COLONY_ESPOCRM_API_KEY
  if (!url || !key) return { service: 'EspoCRM', status: 'not_configured', detail: 'URL or API key missing' }

  try {
    const { value: res, ms } = await timed(() =>
      fetch(`${url.replace(/\/$/, '')}/api/v1/App/user`, {
        headers: { 'X-Api-Key': key },
        signal: AbortSignal.timeout(5000),
      })
    )
    if (res.ok) return { service: 'EspoCRM', status: 'healthy', latency_ms: ms, detail: `HTTP ${res.status}` }
    if (res.status === 401) return { service: 'EspoCRM', status: 'degraded', latency_ms: ms, detail: 'HTTP 401 — API key rejected' }
    return { service: 'EspoCRM', status: 'degraded', latency_ms: ms, detail: `HTTP ${res.status}` }
  } catch (err) {
    return { service: 'EspoCRM', status: 'down', detail: err instanceof Error ? err.message : 'unknown error' }
  }
}

async function checkQdrant(): Promise<HealthCheck> {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) return { service: 'Qdrant', status: 'not_configured', detail: 'COLONY_QDRANT_URL not set' }

  try {
    const { value: res, ms } = await timed(() =>
      fetch(`${url.replace(/\/$/, '')}/collections`, { signal: AbortSignal.timeout(5000) })
    )
    if (!res.ok) return { service: 'Qdrant', status: 'degraded', latency_ms: ms, detail: `HTTP ${res.status}` }
    const json = await res.json() as { result?: { collections?: unknown[] } }
    const count = json.result?.collections?.length ?? 0
    return { service: 'Qdrant', status: 'healthy', latency_ms: ms, detail: `${count} collections` }
  } catch (err) {
    return { service: 'Qdrant', status: 'down', detail: err instanceof Error ? err.message : 'unknown error' }
  }
}

async function checkTailscaleTunnel(): Promise<HealthCheck> {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) return { service: 'Tailscale tunnel', status: 'not_configured', detail: 'no tunnel URL detected' }
  try {
    const { value: res, ms } = await timed(() =>
      fetch(url.replace(/\/$/, ''), { signal: AbortSignal.timeout(5000), redirect: 'manual' })
    )
    return { service: 'Tailscale tunnel', status: res.status < 500 ? 'healthy' : 'degraded', latency_ms: ms, detail: `HTTP ${res.status}` }
  } catch (err) {
    return { service: 'Tailscale tunnel', status: 'down', detail: err instanceof Error ? err.message : 'unknown' }
  }
}

async function checkSquare(): Promise<HealthCheck> {
  const env = process.env.SQUARE_ENVIRONMENT ?? 'sandbox'
  const token = env === 'production'
    ? process.env.SQUARE_PRODUCTION_ACCESS_TOKEN
    : process.env.SQUARE_SANDBOX_ACCESS_TOKEN
  if (!token) return { service: 'Square', status: 'not_configured', detail: 'access token missing' }

  const base = env === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
  try {
    const { value: res, ms } = await timed(() =>
      fetch(`${base}/v2/locations`, {
        headers: { Authorization: `Bearer ${token}`, 'Square-Version': '2024-10-17' },
        signal: AbortSignal.timeout(5000),
      })
    )
    if (res.ok) return { service: 'Square', status: 'healthy', latency_ms: ms, detail: `${env} mode, HTTP ${res.status}` }
    return { service: 'Square', status: 'degraded', latency_ms: ms, detail: `HTTP ${res.status}` }
  } catch (err) {
    return { service: 'Square', status: 'down', detail: err instanceof Error ? err.message : 'unknown error' }
  }
}

async function checkClerk(): Promise<HealthCheck> {
  const hasKey = Boolean(process.env.CLERK_SECRET_KEY)
  if (!hasKey) return { service: 'Clerk', status: 'not_configured', detail: 'CLERK_SECRET_KEY missing' }
  return { service: 'Clerk', status: 'healthy', detail: 'SDK configured' }
}

async function checkPostHog(): Promise<HealthCheck> {
  const hasKey = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
  if (!hasKey) return { service: 'PostHog', status: 'not_configured', detail: 'NEXT_PUBLIC_POSTHOG_KEY missing' }
  return { service: 'PostHog', status: 'healthy', detail: 'key configured' }
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized', data: null }, { status: 401 })

  const checks = await Promise.all([
    checkTailscaleTunnel(),
    checkEspoCRM(),
    checkQdrant(),
    checkSquare(),
    checkClerk(),
    checkPostHog(),
  ])

  const overall: HealthStatus = checks.some(c => c.status === 'down')
    ? 'down'
    : checks.some(c => c.status === 'degraded')
      ? 'degraded'
      : 'healthy'

  return NextResponse.json({
    status: 'ok',
    data: { overall, checks, checked_at: new Date().toISOString() },
  })
}
