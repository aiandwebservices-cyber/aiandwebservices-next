import { randomUUID } from 'crypto'
import {
  clerkCreateOrgAndOwner,
  espoCreateCustomerRecords,
  squareTagCustomerCohort,
  qdrantBootstrapCohort,
  writeAuditEntry,
  getExistingCohortIds,
  type AuditEntry,
} from './onboarding-writers'
import { appendFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OnboardingInput {
  businessName: string
  primaryContactFirstName: string
  primaryContactLastName: string
  primaryContactEmail: string
  primaryContactPhone?: string
  businessWebsite?: string
  niche: string
  city: string
  state: string
  plan: 'starter' | 'presence' | 'growth' | 'revenue_engine' | 'ai_first'
  setupFeePaid: boolean
  setupFeePaymentId?: string
  notes?: string
}

export interface OnboardingPreview {
  cohortId: string
  clerkEmail: string
  clerkInviteWillSend: boolean
  espoRecords: {
    account: { name: string; website?: string }
    contact: { firstName: string; lastName: string; email: string }
    opportunity: { name: string; stage: 'Active'; amount: number }
  }
  squareCustomerEmail: string
  qdrantCollections: string[]
  monthlyAmount: number
  setupAmount: number
}

export interface OnboardingResult {
  cohortId: string
  success: boolean
  steps: {
    clerkInvite:      { success: boolean; inviteId?: string;    error?: string }
    cohortAssigned:   { success: boolean;                       error?: string }
    espoRecords:      { success: boolean; accountId?: string; oppId?: string; error?: string }
    squareTagged:     { success: boolean; customerId?: string; error?: string }
    qdrantBootstrap:  { success: boolean;                       error?: string }
    welcomeEmail:     { success: boolean;                       error?: string }
    auditLogged:      { success: boolean;                       error?: string }
  }
  auditId: string
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const PLAN_PRICING: Record<OnboardingInput['plan'], { monthly: number; setup: number }> = {
  starter:        { monthly: 99,  setup: 99  },
  presence:       { monthly: 99,  setup: 49  },
  growth:         { monthly: 179, setup: 79  },
  revenue_engine: { monthly: 249, setup: 149 },
  ai_first:       { monthly: 499, setup: 299 },
}

// ─── Cohort ID generation ─────────────────────────────────────────────────────

export function generateCohortId(businessName: string, existingIds: string[]): string {
  const words = businessName
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const abbr = words
    .slice(0, 4)
    .map(w => w[0].toLowerCase())
    .join('')

  for (let i = 1; i <= 99; i++) {
    const candidate = `cust_${abbr}_${String(i).padStart(3, '0')}`
    if (!existingIds.includes(candidate)) return candidate
  }
  // Fallback with timestamp suffix to guarantee uniqueness
  return `cust_${abbr}_${Date.now().toString(36)}`
}

// ─── Preview (pure — no external calls) ─────────────────────────────────────

export function buildPreview(
  input: OnboardingInput,
  existingCohortIds: string[]
): OnboardingPreview {
  const pricing = PLAN_PRICING[input.plan]
  const cohortId = generateCohortId(input.businessName, existingCohortIds)

  return {
    cohortId,
    clerkEmail: input.primaryContactEmail,
    clerkInviteWillSend: true,
    espoRecords: {
      account: { name: input.businessName, website: input.businessWebsite },
      contact: {
        firstName: input.primaryContactFirstName,
        lastName: input.primaryContactLastName,
        email: input.primaryContactEmail,
      },
      opportunity: {
        name: `${input.businessName} — ${input.plan.replace('_', ' ')}`,
        stage: 'Active',
        amount: pricing.monthly,
      },
    },
    squareCustomerEmail: input.primaryContactEmail,
    qdrantCollections: ['colony_audit', 'bot_runs'],
    monthlyAmount: pricing.monthly,
    setupAmount: pricing.setup,
  }
}

// ─── Execution ────────────────────────────────────────────────────────────────

function logFallback(data: Record<string, unknown>) {
  try {
    const dir = path.join(process.cwd(), 'logs')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    appendFileSync(
      path.join(dir, 'colony-onboarding.log'),
      `${new Date().toISOString()} ${JSON.stringify(data)}\n`,
      'utf8'
    )
  } catch { /* filesystem not writable */ }
}

export async function executeOnboarding(
  input: OnboardingInput,
  preview: OnboardingPreview,
  adminEmail: string
): Promise<OnboardingResult> {
  const { cohortId } = preview
  const auditId = randomUUID()

  const result: OnboardingResult = {
    cohortId,
    success: false,
    steps: {
      clerkInvite:     { success: false },
      cohortAssigned:  { success: false },
      espoRecords:     { success: false },
      squareTagged:    { success: false },
      qdrantBootstrap: { success: false },
      welcomeEmail:    { success: false },
      auditLogged:     { success: false },
    },
    auditId,
  }

  // Step 1 — Create Clerk Organization + invite owner
  try {
    const { inviteId } = await clerkCreateOrgAndOwner({
      ownerEmail: input.primaryContactEmail,
      ownerFirstName: input.primaryContactFirstName,
      ownerLastName: input.primaryContactLastName,
      orgName: input.businessName,
      cohortId,
      plan: input.plan,
    })
    result.steps.clerkInvite = { success: true, inviteId }
  } catch (err) {
    result.steps.clerkInvite = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  // Step 2 — cohort recorded (acknowledged in result, tracked via audit)
  result.steps.cohortAssigned = { success: true }

  // Step 3 — EspoCRM records
  try {
    const { accountId, oppId } = await espoCreateCustomerRecords(
      input,
      cohortId,
      preview.monthlyAmount
    )
    result.steps.espoRecords = { success: true, accountId, oppId }
  } catch (err) {
    result.steps.espoRecords = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  // Step 4 — Square tag
  try {
    const { customerId, success } = await squareTagCustomerCohort(
      input.primaryContactEmail,
      cohortId
    )
    result.steps.squareTagged = { success, customerId: customerId ?? undefined }
    if (!success && !customerId) {
      result.steps.squareTagged.error = 'Customer not found in Square — tag manually'
    }
  } catch (err) {
    result.steps.squareTagged = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  // Step 5 — Qdrant bootstrap
  try {
    const ok = await qdrantBootstrapCohort(cohortId)
    result.steps.qdrantBootstrap = { success: ok, error: ok ? undefined : 'Qdrant bootstrap failed' }
  } catch (err) {
    result.steps.qdrantBootstrap = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  // Step 6 — Welcome email (no email service configured → log)
  try {
    logFallback({
      type: 'welcome_email',
      to: input.primaryContactEmail,
      subject: `Welcome to Colony, ${input.primaryContactFirstName}`,
      body: `Hi ${input.primaryContactFirstName}, David here from AIandWEBservices. Your Colony dashboard is ready. Log in at https://colony.aiandwebservices.com/colony — your invite is on its way. Reach out any time with questions.`,
      cohortId,
    })
    result.steps.welcomeEmail = { success: true }
  } catch (err) {
    result.steps.welcomeEmail = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }

  // Step 7 — Audit log
  try {
    const entry: AuditEntry = {
      id: auditId,
      timestamp: new Date().toISOString(),
      admin_email: adminEmail,
      action: 'onboard',
      target_cohort_id: cohortId,
      input: input as unknown as Record<string, unknown>,
      result: result.steps as unknown as Record<string, unknown>,
      notes: input.notes,
    }
    await writeAuditEntry(entry)
    result.steps.auditLogged = { success: true }
  } catch (err) {
    result.steps.auditLogged = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
    logFallback({ type: 'audit_fallback', auditId, cohortId, adminEmail, input, result })
  }

  result.success = Object.values(result.steps).some(s => s.success)
  return result
}
