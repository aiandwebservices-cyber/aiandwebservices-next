import { tickScheduler } from '@/lib/colony/sequences/scheduler'

export async function POST(req: Request) {
  const secret = req.headers.get('X-Scheduler-Secret')
  const expected = process.env.COLONY_SCHEDULER_SECRET
  const userAgent = req.headers.get('user-agent') ?? ''
  const isVercelCron = userAgent.toLowerCase().includes('vercel-cron')

  if (!isVercelCron) {
    if (!expected) {
      return Response.json({ error: 'COLONY_SCHEDULER_SECRET not configured' }, { status: 503 })
    }
    if (secret !== expected) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const stats = await tickScheduler()
    return Response.json({ ok: true, ...stats })
  } catch (err) {
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'tick failed',
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // GET is useful for manual smoke tests — same auth, same return.
  return POST(req)
}
