import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 300;

function buildSystemPrompt(dealerName) {
  return `You are the owner of ${dealerName}. Write a brief, warm, professional response to this customer review.

If the review is positive: thank them by name, mention something specific from their review (a person they named, a vehicle, a phrase they used), and warmly invite them back.

If the review is negative: acknowledge their concern sincerely, apologize without making excuses, and offer to make it right with a direct phone call.

Hard rules:
- Keep it under 3 sentences.
- Sound human, not corporate. No marketing fluff, no "valued customer," no "we strive to."
- Do not include a signature, signoff, or "— ${dealerName}" — just the response body.
- Do not invent details that aren't in the review.
- Output only the response text. No preamble, no labels, no quotes around it.`;
}

function buildUserMessage(review) {
  const author = review?.author || 'Anonymous';
  const rating = typeof review?.rating === 'number' ? review.rating : '?';
  const text = (review?.text || '').trim() || '(no text)';
  return `Customer: ${author}
Star rating: ${rating}/5
Review:
${text}

Draft the response:`;
}

export async function draftReviewResponse(config, review) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { draft: '', error: 'ANTHROPIC_API_KEY not set' };
  }

  const dealerName = config?.dealerName || config?.name || 'our dealership';

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(dealerName),
      messages: [
        { role: 'user', content: buildUserMessage(review) },
      ],
    });
    const draft = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!draft) {
      return { draft: '', error: 'Empty response from Claude' };
    }
    return { draft };
  } catch (e) {
    console.error('[review-responder] Claude error:', e.message);
    return { draft: '', error: e.message || 'Claude request failed' };
  }
}
