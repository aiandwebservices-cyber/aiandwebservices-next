'use client'

import type { APIResponse } from '@/lib/colony/contracts'
import type { Lead } from './types'

const API_BASE = '/api/colony'

interface FetchOptions {
  cohortId?: string
  query?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

export async function colonyFetch<T>(
  endpoint: 'feed' | 'leads' | 'deals' | 'reports' | 'ping' | 'mrr' | 'bots' | 'replies' | 'analytics/funnel' | 'analytics/velocity' | 'analytics/sources' | 'analytics/niches' | 'analytics/bots',
  options: FetchOptions = {}
): Promise<APIResponse<T>> {
  const url = new URL(`${API_BASE}/${endpoint}`, window.location.origin)

  if (options.cohortId === 'demo') {
    url.searchParams.set('cohort', 'demo')
  }

  for (const [k, v] of Object.entries(options.query ?? {})) {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v))
    }
  }

  try {
    const res = await fetch(url.toString(), {
      signal: options.signal,
      credentials: 'include',
      cache: 'no-store',
    })

    if (res.status === 401) {
      return { status: 'unauthorized', data: null }
    }

    const body = (await res.json()) as APIResponse<T>
    return body
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err
    return {
      status: 'degraded',
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}

export async function colonyFetchLead(
  leadId: string,
  options: { cohortId?: string; signal?: AbortSignal } = {}
): Promise<APIResponse<Lead>> {
  const url = new URL(`${API_BASE}/leads/${encodeURIComponent(leadId)}`, window.location.origin)
  if (options.cohortId === 'demo') url.searchParams.set('cohort', 'demo')

  try {
    const res = await fetch(url.toString(), {
      signal: options.signal,
      credentials: 'include',
      cache: 'no-store',
    })
    if (res.status === 401) return { status: 'unauthorized', data: null }
    return await res.json() as APIResponse<Lead>
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err
    return { status: 'degraded', data: null, error: err instanceof Error ? err.message : 'Network error' }
  }
}
