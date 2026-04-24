import { NextRequest } from 'next/server'
import { requirePermission, okResponse, forbiddenResponse, unauthorizedResponse, degradedResponse } from '../../_shared/auth'
import { getOrgMembers, getOrgInvitations } from '@/lib/colony/organizations'

export async function GET(req: NextRequest) {
  const authed = await requirePermission('manage_team', req)
  if (!authed) return forbiddenResponse()

  if (authed.isDemo || !authed.orgId) {
    return okResponse({ members: [], invitations: [], currentUserRole: authed.role })
  }

  try {
    const [members, invitations] = await Promise.all([
      getOrgMembers(authed.orgId),
      getOrgInvitations(authed.orgId),
    ])
    return okResponse({ members, invitations, currentUserRole: authed.role })
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Failed to fetch team')
  }
}
