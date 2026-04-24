import type { SequenceTemplate } from './types'
import { qdrantScrollTemplates, qdrantGetTemplate, qdrantUpsertTemplate } from './qdrant-store'

export const DEFAULT_BREAKUP_3: SequenceTemplate = {
  id: 'default_breakup_3',
  cohort_id: 'aiandwebservices',
  name: 'Default 3-step breakup',
  description: 'Cold outreach + 1 follow-up + breakup. Matches Phase 7 template.',
  default_for_cohort: true,
  active: true,
  steps: [
    {
      step_index: 0,
      name: 'Initial',
      delay_from_previous: { hours: 0 },
      halt_if_replied: true,
      subject_template: 'quick question about {{BUSINESS_NAME}}',
    },
    {
      step_index: 1,
      name: 'Follow-up 1',
      delay_from_previous: { days: 4 },
      halt_if_replied: true,
      subject_template: 'one more thing about {{BUSINESS_NAME}}',
      body_generator: 'bob',
    },
    {
      step_index: 2,
      name: 'Breakup',
      delay_from_previous: { days: 5 },
      halt_if_replied: true,
      subject_template: 'closing the loop',
      body_template: `Hey {{FIRST_NAME}},

Haven't heard back so I'll stop reaching out for now. If timing's bad, no worries.

If you ever want to chat about {{NICHE}} lead generation, here's my direct link: {{CAL_COM_LINK}}

Best,
David`,
    },
  ],
}

function builtInForCohort(cohortId: string, templateId: string): SequenceTemplate | null {
  if (templateId === 'default_breakup_3') {
    return { ...DEFAULT_BREAKUP_3, cohort_id: cohortId }
  }
  return null
}

export async function getTemplate(cohortId: string, templateId: string): Promise<SequenceTemplate | null> {
  const stored = await qdrantGetTemplate(cohortId, templateId)
  if (stored) return stored
  return builtInForCohort(cohortId, templateId)
}

export async function listTemplates(cohortId: string): Promise<SequenceTemplate[]> {
  const stored = await qdrantScrollTemplates(cohortId)
  const hasDefault = stored.some(t => t.id === 'default_breakup_3')
  if (!hasDefault) {
    stored.push({ ...DEFAULT_BREAKUP_3, cohort_id: cohortId })
  }
  return stored
}

export async function getDefaultTemplate(cohortId: string): Promise<SequenceTemplate | null> {
  const all = await listTemplates(cohortId)
  return all.find(t => t.default_for_cohort && t.active) ?? null
}

export async function upsertTemplate(template: SequenceTemplate): Promise<void> {
  await qdrantUpsertTemplate(template)
}
