import Anthropic from '@anthropic-ai/sdk'
import type { ReplyClassification } from './types'

const CLASSIFIER_PROMPT = `You are an email reply classifier for a B2B outreach system.

Classify the following reply into ONE of these categories:
- INTERESTED: Wants to continue the conversation, book a call, learn more, or explicitly expresses interest
- NOT_INTERESTED: Politely declines, says not now, wrong person, etc.
- QUESTION: Asks a clarifying question before committing either way
- UNSUBSCRIBE: Explicitly asks to stop, remove from list, unsubscribe
- AUTOMATED: Auto-reply, out-of-office, bounce, vacation responder
- UNKNOWN: None of the above or unclear

Respond in JSON only:
{"classification": "...", "confidence": 0-1, "reasoning": "one sentence"}

Reply to classify:
---
From: {{FROM}}
Subject: {{SUBJECT}}

{{BODY}}
---`

const VALID: ReplyClassification[] = [
  'INTERESTED',
  'NOT_INTERESTED',
  'QUESTION',
  'UNSUBSCRIBE',
  'AUTOMATED',
  'UNKNOWN',
]

export async function classifyReply(reply: {
  from_email: string
  subject: string
  body_text: string
}): Promise<{
  classification: ReplyClassification
  confidence: number
  reasoning: string
}> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      classification: 'UNKNOWN',
      confidence: 0,
      reasoning: 'ANTHROPIC_API_KEY not set — classifier skipped',
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = CLASSIFIER_PROMPT
    .replace('{{FROM}}', reply.from_email)
    .replace('{{SUBJECT}}', reply.subject)
    .replace('{{BODY}}', (reply.body_text ?? '').slice(0, 2000))

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const block = response.content[0]
    const text = block && block.type === 'text' ? block.text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in classifier response')

    const parsed = JSON.parse(match[0]) as {
      classification?: string
      confidence?: number
      reasoning?: string
    }

    const classification = VALID.includes(parsed.classification as ReplyClassification)
      ? (parsed.classification as ReplyClassification)
      : 'UNKNOWN'

    const confidence = typeof parsed.confidence === 'number'
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0.5

    return {
      classification,
      confidence,
      reasoning: parsed.reasoning ?? 'No reasoning provided',
    }
  } catch (err) {
    return {
      classification: 'UNKNOWN',
      confidence: 0,
      reasoning: `Classifier error: ${err instanceof Error ? err.message : 'unknown'}`,
    }
  }
}
