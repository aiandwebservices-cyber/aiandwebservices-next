import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import type { ColonyRole } from './permissions'
import { mapClerkRoleToColony, hasPermission } from './permissions'
import type { ColonyPermission } from './permissions'

export const COLONY_ADMIN_EMAILS = [
  'david@aiandwebservices.com',
  'aiandwebservices@gmail.com',
]

export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (!email || !COLONY_ADMIN_EMAILS.includes(email.toLowerCase())) return null
  return { userId, email }
}

/**
 * Checks the current user's role within their active Clerk Organization.
 * Returns the role if the user has the required permission, null otherwise.
 */
export async function requireOrgRole(
  permission: ColonyPermission
): Promise<{ userId: string; orgId: string; role: ColonyRole } | null> {
  const { userId, orgId, orgRole } = await auth()
  if (!userId || !orgId) return null
  const role = mapClerkRoleToColony(orgRole)
  if (!hasPermission(role, permission)) return null
  return { userId, orgId, role }
}
