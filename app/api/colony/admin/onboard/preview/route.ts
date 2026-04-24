import { requireAdmin } from '@/lib/colony/admin'
import { buildPreview } from '@/lib/colony/onboarding'
import { getExistingCohortIds } from '@/lib/colony/onboarding-writers'
import type { OnboardingInput } from '@/lib/colony/onboarding'

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ status: 'unauthorized' }, { status: 401 })

  const input = await req.json() as Partial<OnboardingInput>

  if (!input.businessName || !input.primaryContactEmail || !input.plan) {
    return Response.json({ status: 'error', error: 'Missing required fields: businessName, primaryContactEmail, plan' }, { status: 400 })
  }

  const existingIds = await getExistingCohortIds()
  const preview = buildPreview(input as OnboardingInput, existingIds)
  return Response.json({ status: 'ok', data: preview })
}
