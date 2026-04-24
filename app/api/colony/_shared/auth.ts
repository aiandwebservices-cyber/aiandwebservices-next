import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { Cohort } from '@/app/colony/lib/types'
import type { APIResponse } from '@/lib/colony/contracts'
import { getImpersonatedCohort } from '@/lib/colony/impersonation'
import { requireAdmin } from '@/lib/colony/admin'
import type { ColonyRole, ColonyPermission } from '@/lib/colony/permissions'
import { mapClerkRoleToColony, hasPermission } from '@/lib/colony/permissions'

export interface AuthedCohort {
  userId: string
  cohortId: Cohort
  role: ColonyRole
  orgId?: string
  isDemo: boolean
  isImpersonating: boolean
}

/**
 * Resolves the current request's cohort and role from Clerk session.
 * Returns null if unauthenticated.
 *
 * Resolution order:
 *   1. Admin impersonation cookie (platform admins only)
 *   2. ?cohort=demo query param (UI toggle)
 *   3. Active Clerk Organization → org.publicMetadata.cohort_id
 *   4. Fallback: user.publicMetadata.cohort_id (backward compat — pre-Phase 18 accounts)
 *   5. Default: demo as viewer
 */
export async function resolveCohort(req: Request): Promise<AuthedCohort | null> {
  const { userId, orgId, orgRole } = await auth()
  if (!userId) return null

  // 1. Platform admin impersonation
  const impersonated = await getImpersonatedCohort()
  if (impersonated) {
    const admin = await requireAdmin()
    if (admin) {
      return {
        userId,
        cohortId: impersonated as Cohort,
        role: 'owner',
        isDemo: impersonated === 'demo',
        isImpersonating: true,
      }
    }
  }

  // 2. Demo override
  const url = new URL(req.url)
  if (url.searchParams.get('cohort') === 'demo') {
    return { userId, cohortId: 'demo', role: 'viewer', isDemo: true, isImpersonating: false }
  }

  // 3. Active Clerk Organization
  if (orgId) {
    try {
      const client = await clerkClient()
      const org = await client.organizations.getOrganization({ organizationId: orgId })
      const cohortId = (org.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined
      if (cohortId) {
        const role = mapClerkRoleToColony(orgRole)
        return {
          userId,
          cohortId: cohortId as Cohort,
          role,
          orgId,
          isDemo: cohortId === 'demo',
          isImpersonating: false,
        }
      }
    } catch {
      // Org lookup failed — fall through to user metadata
    }
  }

  // 4. Backward compat: user metadata (pre-Phase 18 accounts)
  const user = await currentUser()
  const metaCohort = user?.publicMetadata?.cohort_id as string | undefined
  if (metaCohort) {
    return {
      userId,
      cohortId: metaCohort as Cohort,
      role: 'owner',
      isDemo: metaCohort === 'demo',
      isImpersonating: false,
    }
  }

  // 5. No cohort found → demo as viewer
  return { userId, cohortId: 'demo', role: 'viewer', isDemo: true, isImpersonating: false }
}

/**
 * Resolve cohort + enforce a specific permission. Returns null if unauthenticated or lacks permission.
 */
export async function requirePermission(
  permission: ColonyPermission,
  req: Request
): Promise<AuthedCohort | null> {
  const authed = await resolveCohort(req)
  if (!authed) return null
  if (!hasPermission(authed.role, permission)) return null
  return authed
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

export function forbiddenResponse(error = 'Insufficient permissions'): NextResponse<APIResponse<null>> {
  return NextResponse.json(
    { status: 'unauthorized', data: null, error },
    { status: 403 }
  )
}

export function degradedResponse(error: string): NextResponse<APIResponse<null>> {
  return NextResponse.json(
    { status: 'degraded', data: null, error, last_success: undefined },
    { status: 200 }
  )
}
