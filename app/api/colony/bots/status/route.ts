import { NextRequest, NextResponse } from 'next/server'
import { fetchBotStatuses } from '@/lib/colony/bot-status'

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
    return NextResponse.json(statuses)
  } catch (e) {
    console.error('[bots/status]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
