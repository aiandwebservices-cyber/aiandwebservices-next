import { NextRequest, NextResponse } from 'next/server'
import { fetchBotStatuses } from '@/lib/colony/bot-status'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    let cohortFromSession: string | undefined
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const { sessionClaims } = await auth()
      cohortFromSession = (sessionClaims?.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined
    } catch {
      // Clerk not yet wired; fallback
    }

    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id') ?? undefined
    const cohortId = cohortFromSession || cohortFromQuery || 'aiandwebservices'
    const statuses = await fetchBotStatuses(cohortId)

    const running = Object.values(statuses).filter((b) => b.status_tier === 'running')
    const live = Object.values(statuses).filter((b) => b.status_tier === 'live')
    const failed = Object.values(statuses).filter((b) => b.status_tier === 'failed')

    return NextResponse.json({
      bots: statuses,
      summary: {
        running: running.length,
        live: live.length,
        failed: failed.length,
        total: Object.keys(statuses).length,
      },
    })
  } catch (e) {
    console.error('[crew/status]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
