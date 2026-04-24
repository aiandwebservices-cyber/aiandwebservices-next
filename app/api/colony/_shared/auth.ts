import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { Cohort } from '@/app/colony/lib/types'
import type { APIResponse } from '@/lib/colony/contracts'

export interface AuthedCohort {
  userId: string
  cohortId: Cohort
  isDemo: boolean
}

/**
 * Resolves the current request's cohort from Clerk session.
 * Returns null if unauthenticated.
 * cohort_id is read from Clerk publicMetadata; falls back to 'aiandwebservices'.
 * ?cohort=demo query param is allowed for the demo cohort only — UI toggle convenience.
 * Any other cohort value from query params is ignored (security boundary).
 */
export async function resolveCohort(req: Request): Promise<AuthedCohort | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const metaCohort = user?.publicMetadata?.cohort_id as string | undefined

  const url = new URL(req.url)
  const isDemoRequest = url.searchParams.get('cohort') === 'demo'

  const cohortId: Cohort = isDemoRequest
    ? 'demo'
    : ((metaCohort as Cohort | undefined) ?? 'aiandwebservices')

  return { userId, cohortId, isDemo: cohortId === 'demo' }
}

const CACHE_HEADERS = { 'Cache-Control': 'private, max-age=30' } as const

export function okResponse<T>(data: T): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    { status: 'ok', data, cached_at: new Date().toISOString() },
    { status: 200, headers: CACHE_HEADERS }
  )
}

export function unauthorizedResponse(): NextResponse<APIResponse<null>> {
  return NextResponse.json(
    { status: 'unauthorized', data: null },
    { status: 401 }
  )
}

export function degradedResponse(error: string): NextResponse<APIResponse<null>> {
  return NextResponse.json(
    { status: 'degraded', data: null, error, last_success: undefined },
    { status: 200 }
  )
}
