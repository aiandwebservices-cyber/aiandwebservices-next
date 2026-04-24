import type { SequenceStep, SequenceTemplate } from './types'
import type { Lead } from '@/app/colony/lib/types'

const CAL_COM_LINK = 'https://cal.com/david-pulis'

function replaceTokens(template: string, lead: Lead): string {
  return template
    .replace(/\{\{BUSINESS_NAME\}\}/g, lead.business_name)
    .replace(/\{\{FIRST_NAME\}\}/g, lead.first_name ?? 'there')
    .replace(/\{\{LAST_NAME\}\}/g, lead.last_name ?? '')
    .replace(/\{\{CITY\}\}/g, lead.city)
    .replace(/\{\{NICHE\}\}/g, lead.niche ?? 'your industry')
    .replace(/\{\{CAL_COM_LINK\}\}/g, CAL_COM_LINK)
}

export async function draftStepBody(params: {
  template: SequenceTemplate
  step: SequenceStep
  lead: Lead
  previousEmails: string[]
}): Promise<{ subject: string; body: string }> {
  const subject = replaceTokens(params.step.subject_template, params.lead)

  let body: string
  if (params.step.body_template) {
    body = replaceTokens(params.step.body_template, params.lead)
  } else if (params.step.body_generator === 'bob') {
    body = await generateWithBob(params)
  } else {
    throw new Error(`Step ${params.step.step_index} has no body source`)
  }

  return { subject, body }
}

async function generateWithBob(params: {
  template: SequenceTemplate
  step: SequenceStep
  lead: Lead
  previousEmails: string[]
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const fallback = fallbackFollowUp(params.lead)

  if (!apiKey) return fallback

  const systemPrompt = `You are Bob, an outreach drafter for David at AIandWEBservices.
Write a follow-up email to a prospect who hasn't responded.

Voice rules:
- Direct, contractions, short sentences
- No em-dashes, no "circle back", no "just checking in", no "hope this finds you well"
- Under 70 words total
- Reference the prior email briefly, then add ONE new useful observation
- Sign off as "David"`

  const userPrompt = `Prospect: ${params.lead.business_name} in ${params.lead.city}, ${params.lead.niche ?? 'unknown niche'}
First name: ${params.lead.first_name ?? 'there'}
Prior email subject: ${params.template.steps[0]?.subject_template ?? ''}
Step name: ${params.step.name}

Write the follow-up body only. No subject line. No signature block beyond "David".`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return fallback

    const json = await res.json() as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = json.content?.find(c => c.type === 'text')?.text
    return text?.trim() ?? fallback
  } catch {
    return fallback
  }
}

function fallbackFollowUp(lead: Lead): string {
  const first = lead.first_name ?? 'there'
  const niche = lead.niche ?? 'your industry'
  return `Hey ${first},

Sent you a note earlier about ${lead.business_name}. Didn't hear back so this'll be quick.

One thing I've been seeing with ${niche} practices in ${lead.city}: the ones who track every lead from first click to signed deal are finding 30-40% more closeable prospects they'd otherwise lose.

If that sounds like something worth 15 minutes, just reply "yes" and I'll send a link.

David`
}
