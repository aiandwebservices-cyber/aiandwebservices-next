import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/colony/admin'
import { scanIdentityCandidates } from '@/lib/colony/admin-queries'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized', data: null }, { status: 401 })

  try {
    const data = await scanIdentityCandidates()
    return NextResponse.json({ status: 'ok', data, cached_at: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: err instanceof Error ? err.message : 'Scan failed',
    })
  }
}
