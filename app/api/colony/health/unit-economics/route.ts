import { NextRequest, NextResponse } from 'next/server'
import { fetchUnitEconomics, type TimeWindow } from '@/lib/colony/unit-economics'

const VALID_WINDOWS: TimeWindow[] = ['1d', '7d', '30d', '90d', 'all']

export async function GET(req: NextRequest) {
  try {
    const windowParam = (req.nextUrl.searchParams.get('window') || '30d') as TimeWindow
    const window: TimeWindow = VALID_WINDOWS.includes(windowParam) ? windowParam : '30d'

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

    const data = await fetchUnitEconomics(window, cohortId)
    return NextResponse.json(data)
  } catch (e) {
    console.error('[health/unit-economics]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
