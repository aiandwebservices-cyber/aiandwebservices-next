import { requireAdmin } from '@/lib/colony/admin'
import { executeOnboarding } from '@/lib/colony/onboarding'
import type { OnboardingInput, OnboardingPreview } from '@/lib/colony/onboarding'

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ status: 'unauthorized' }, { status: 401 })

  const { input, preview } = await req.json() as { input: OnboardingInput; preview: OnboardingPreview }

  if (!input || !preview) {
    return Response.json({ status: 'error', error: 'Missing input or preview' }, { status: 400 })
  }

  const result = await executeOnboarding(input, preview, admin.email)
  return Response.json({ status: 'ok', data: result })
}
