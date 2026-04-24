import { requireAdmin } from '@/lib/colony/admin'
import { pollImapOnce } from '@/lib/colony/email/inbound/imap'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ status: 'unauthorized' }, { status: 401 })

  if (process.env.COLONY_EMAIL_INBOUND !== 'imap') {
    return Response.json(
      { status: 'error', error: 'COLONY_EMAIL_INBOUND is not set to imap' },
      { status: 400 }
    )
  }

  const result = await pollImapOnce()
  return Response.json({ status: 'ok', data: result })
}
