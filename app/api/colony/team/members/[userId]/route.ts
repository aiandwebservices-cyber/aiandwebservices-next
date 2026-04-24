import { NextRequest } from 'next/server'
import { requirePermission, okResponse, forbiddenResponse, degradedResponse } from '../../../_shared/auth'
import { updateMemberRole, removeMember } from '@/lib/colony/organizations'
import type { ColonyRole } from '@/lib/colony/permissions'

const COLONY_ROLES: ColonyRole[] = ['viewer', 'staff', 'admin', 'owner']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authed = await requirePermission('manage_team', req)
  if (!authed) return forbiddenResponse()

  if (authed.isDemo || !authed.orgId) {
    return okResponse({ updated: true, demo: true })
  }

  const { userId } = await params
  let body: { role?: string }
  try {
    body = await req.json()
  } catch {
    return degradedResponse('Invalid JSON body')
  }

  const { role } = body
  if (!role || !COLONY_ROLES.includes(role as ColonyRole)) {
    return degradedResponse('Valid role required')
  }

  if (role === 'owner' && authed.role !== 'owner') {
    return forbiddenResponse('Only an owner can assign the owner role')
  }

  try {
    await updateMemberRole(authed.orgId, userId, role as ColonyRole)
    return okResponse({ userId, role })
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Role update failed')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authed = await requirePermission('manage_team', req)
  if (!authed) return forbiddenResponse()

  if (authed.isDemo || !authed.orgId) {
    return okResponse({ removed: true, demo: true })
  }

  const { userId } = await params

  // Can't remove yourself
  if (userId === authed.userId) {
    return forbiddenResponse('Cannot remove yourself from the organization')
  }

  try {
    await removeMember(authed.orgId, userId)
    return okResponse({ userId, removed: true })
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Remove member failed')
  }
}
