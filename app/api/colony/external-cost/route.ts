import { NextRequest, NextResponse } from 'next/server'
import { getExternalCostSummary } from '@/lib/colony/external-cost'
import type { TimeWindow } from '@/lib/colony/time-window'

const VALID_WINDOWS: TimeWindow[] = ['1d', '7d', '30d', '90d', 'all']

export async function GET(req: NextRequest) {
  try {
    const windowParam = (req.nextUrl.searchParams.get('window') || '1d') as TimeWindow
    const window: TimeWindow = VALID_WINDOWS.includes(windowParam) ? windowParam : '1d'

    let cohortFromSession: string | undefined
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const { sessionClaims } = await auth()
      cohortFromSession = (sessionClaims?.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined
    } catch {
      // Clerk not yet configured — graceful fallback
    }

    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id') ?? undefined
    const cohortId = cohortFromSession || cohortFromQuery || 'aiandwebservices'

    const data = await getExternalCostSummary(window, cohortId)
    return NextResponse.json(data)
  } catch (e) {
    console.error('[external-cost]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
