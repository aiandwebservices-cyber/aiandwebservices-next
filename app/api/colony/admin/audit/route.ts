import { requireAdmin } from '@/lib/colony/admin'
import { readAuditLog } from '@/lib/colony/onboarding-writers'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ status: 'unauthorized' }, { status: 401 })

  const entries = await readAuditLog()
  return Response.json({ status: 'ok', data: entries })
}
