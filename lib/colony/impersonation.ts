import { cookies } from 'next/headers'
import { randomUUID } from 'node:crypto'
import { writeAuditEntry } from './onboarding-writers'

export const IMPERSONATION_COOKIE = 'colony_impersonate_cohort'
const TTL_SECONDS = 60 * 60 * 2 // 2 hours

export async function startImpersonation(cohortId: string, admin: { userId: string; email: string }) {
  const jar = await cookies()
  jar.set(IMPERSONATION_COOKIE, cohortId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TTL_SECONDS,
    path: '/',
  })
  await writeAuditEntry({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    admin_email: admin.email,
    action: 'manual_edit',
    target_cohort_id: cohortId,
    input: { operation: 'impersonation_start', actor_user_id: admin.userId },
    result: { cookie_ttl_seconds: TTL_SECONDS },
    notes: `Admin ${admin.email} started impersonation of ${cohortId}`,
  })
}

export async function stopImpersonation(admin?: { userId: string; email: string }) {
  const jar = await cookies()
  const current = jar.get(IMPERSONATION_COOKIE)?.value
  jar.delete(IMPERSONATION_COOKIE)
  if (current && admin) {
    await writeAuditEntry({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      admin_email: admin.email,
      action: 'manual_edit',
      target_cohort_id: current,
      input: { operation: 'impersonation_stop', actor_user_id: admin.userId },
      result: {},
      notes: `Admin ${admin.email} stopped impersonation of ${current}`,
    })
  }
}

export async function getImpersonatedCohort(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(IMPERSONATION_COOKIE)?.value ?? null
}
