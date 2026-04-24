import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { Cohort } from '@/app/colony/lib/types'
import type { APIResponse } from '@/lib/colony/contracts'
import { getImpersonatedCohort } from '@/lib/colony/impersonation'
import { requireAdmin } from '@/lib/colony/admin'

export interface AuthedCohort {
  userId: string
  cohortId: Cohort
  isDemo: boolean
  isImpersonating: boolean
}

/**
 * Resolves the current request's cohort from Clerk session.
 * Returns null if unauthenticated.
 *
 * Resolution order:
 *   1. Admin impersonation cookie (admin-only; other users' cookies are ignored)
 *   2. ?cohort=demo query param (UI toggle convenience)
 *   3. Clerk publicMetadata.cohort_id
 *   4. Fallback: 'aiandwebservices'
 */
export async function resolveCohort(req: Request): Promise<AuthedCohort | null> {
  const { userId } = await auth()
  if (!userId) return null

  const impersonatedCohort = await getImpersonatedCohort()
  if (impersonatedCohort) {
    const admin = await requireAdmin()
    if (admin) {
      return {
        userId,
        cohortId: impersonatedCohort as Cohort,
        isDemo: impersonatedCohort === 'demo',
        isImpersonating: true,
      }
    }
    // Non-admin with cookie (shouldn't happen, but defensive) — ignore the cookie.
  }

  const user = await currentUser()
  const metaCohort = user?.publicMetadata?.cohort_id as string | undefined

  const url = new URL(req.url)
  const isDemoRequest = url.searchParams.get('cohort') === 'demo'

  const cohortId: Cohort = isDemoRequest
    ? 'demo'
    : ((metaCohort as Cohort | undefined) ?? 'aiandwebservices')

  return { userId, cohortId, isDemo: cohortId === 'demo', isImpersonating: false }
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
