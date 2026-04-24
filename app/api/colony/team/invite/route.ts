import { NextRequest } from 'next/server'
import { requirePermission, okResponse, forbiddenResponse, degradedResponse } from '../../_shared/auth'
import { inviteOrgMember } from '@/lib/colony/organizations'
import { getProvider } from '@/lib/colony/email/provider'
import { buildInviteEmailHTML, buildInviteEmailText } from '@/lib/colony/email/templates/invite'
import { currentUser } from '@clerk/nextjs/server'
import type { ColonyRole } from '@/lib/colony/permissions'

const COLONY_ROLES: ColonyRole[] = ['viewer', 'staff', 'admin', 'owner']
const SENDER = 'david@aiandwebservices.com'

export async function POST(req: NextRequest) {
  const authed = await requirePermission('manage_team', req)
  if (!authed) return forbiddenResponse()

  if (authed.isDemo || !authed.orgId) {
    return okResponse({ inviteId: 'demo', demo: true })
  }

  let body: { email?: string; role?: string; orgName?: string }
  try {
    body = await req.json()
  } catch {
    return degradedResponse('Invalid JSON body')
  }

  const { email, role, orgName } = body
  if (!email || !role || !COLONY_ROLES.includes(role as ColonyRole)) {
    return degradedResponse('email and valid role required')
  }

  // Owner role can only be assigned by current owner
  if (role === 'owner' && authed.role !== 'owner') {
    return forbiddenResponse('Only an owner can assign the owner role')
  }

  try {
    const inviteId = await inviteOrgMember(authed.orgId, email, role as ColonyRole)

    // Send invite email (non-blocking — Clerk already sends one but ours is branded)
    const inviter = await currentUser()
    const inviterName = [inviter?.firstName, inviter?.lastName].filter(Boolean).join(' ') || 'Your team'
    const displayOrgName = orgName ?? 'Colony'
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com'}/invite/accept`

    try {
      const provider = getProvider()
      await provider.send({
        from: SENDER,
        replyTo: SENDER,
        to: email,
        subject: `You've been invited to ${displayOrgName} on Colony`,
        html: buildInviteEmailHTML({ inviterName, orgName: displayOrgName, role, acceptUrl }),
        text: buildInviteEmailText({ inviterName, orgName: displayOrgName, role, acceptUrl }),
        headers: {},
      })
    } catch (emailErr) {
      // Email failure shouldn't fail the invite — Clerk already sent theirs
      console.warn('[colony/team/invite] branded email failed:', emailErr)
    }

    return okResponse({ inviteId })
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Invite failed')
  }
}
