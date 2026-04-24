import { clerkClient } from '@clerk/nextjs/server'
import type { ColonyRole } from './permissions'
import { mapClerkRoleToColony } from './permissions'

const COLONY_ROLE_TO_CLERK: Record<ColonyRole, string> = {
  owner:  'org:admin',
  admin:  'org:member',
  staff:  'org:staff',
  viewer: 'org:viewer',
}

export interface OrgMember {
  userId: string
  firstName: string | null
  lastName: string | null
  email: string
  role: ColonyRole
  joinedAt: string
}

export interface OrgInvitation {
  id: string
  email: string
  role: ColonyRole
  createdAt: string
  expiresAt: string | null
}

export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
  const client = await clerkClient()
  const memberships = await client.organizations.getOrganizationMembershipList({ organizationId: orgId })
  const members: OrgMember[] = []
  for (const m of memberships.data) {
    const user = await client.users.getUser(m.publicUserData?.userId ?? m.id)
    members.push({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      role: mapClerkRoleToColony(m.role),
      joinedAt: new Date(m.createdAt).toISOString(),
    })
  }
  return members
}

export async function getOrgInvitations(orgId: string): Promise<OrgInvitation[]> {
  const client = await clerkClient()
  const invites = await client.organizations.getOrganizationInvitationList({ organizationId: orgId })
  return invites.data.map(inv => ({
    id: inv.id,
    email: inv.emailAddress,
    role: mapClerkRoleToColony(inv.role),
    createdAt: new Date(inv.createdAt).toISOString(),
    expiresAt: null,
  }))
}

export async function inviteOrgMember(
  orgId: string,
  email: string,
  role: ColonyRole
): Promise<string> {
  const client = await clerkClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com'
  const inv = await client.organizations.createOrganizationInvitation({
    organizationId: orgId,
    emailAddress: email,
    role: COLONY_ROLE_TO_CLERK[role],
    redirectUrl: `${appUrl}/invite/accept`,
  })
  return inv.id
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: ColonyRole
): Promise<void> {
  const client = await clerkClient()
  await client.organizations.updateOrganizationMembership({
    organizationId: orgId,
    userId,
    role: COLONY_ROLE_TO_CLERK[role],
  })
}

export async function removeMember(orgId: string, userId: string): Promise<void> {
  const client = await clerkClient()
  await client.organizations.deleteOrganizationMembership({ organizationId: orgId, userId })
}
