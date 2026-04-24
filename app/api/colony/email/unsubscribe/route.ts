import { validateUnsubscribeToken } from '@/lib/colony/email/unsubscribe'
import { qdrantMarkUnsubscribed } from '@/lib/colony/qdrant'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const parsed = validateUnsubscribeToken(token)

  if (!parsed) {
    return NextResponse.redirect(
      new URL(`/unsubscribe?error=invalid`, process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com')
    )
  }

  return NextResponse.redirect(
    new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com')
  )
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const parsed = validateUnsubscribeToken(token)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com'

  if (!parsed) {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid', base))
  }

  try {
    await qdrantMarkUnsubscribed(parsed.cohortId, parsed.leadId)
  } catch (err) {
    console.error('[Colony Unsubscribe] Failed to mark unsubscribed:', err)
    return NextResponse.redirect(new URL('/unsubscribe?error=failed', base))
  }

  return NextResponse.redirect(new URL('/unsubscribe?success=1', base))
}
