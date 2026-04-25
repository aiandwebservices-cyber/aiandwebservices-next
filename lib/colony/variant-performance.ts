/**
 * Variant performance — joins emails_sent (with subject_variant_id)
 * against colony_email_replies (with classification) to compute
 * reply rate per subject variant.
 */

export interface VariantStats {
  variant_id: string;
  variant_label: string;
  sends: number;
  replies: number;
  interested_replies: number;
  reply_rate_pct: number | null;
  interested_rate_pct: number | null;
  is_winner: boolean;
  is_loser: boolean;
}

export interface VariantPerformance {
  total_sends: number;
  total_tagged_sends: number;
  total_replies: number;
  baseline_reply_rate_pct: number | null;
  variants: VariantStats[];
  has_data: boolean;
}

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';

async function scrollAll(collection: string, filter?: Record<string, unknown>): Promise<Array<{ payload: Record<string, unknown> }>> {
  const out: Array<{ payload: Record<string, unknown> }> = [];
  let nextOffset: string | number | null = null;
  let safety = 0;
  while (safety < 50) {
    const body: Record<string, unknown> = { limit: 500, with_payload: true, with_vector: false };
    if (filter) body.filter = filter;
    if (nextOffset !== null) body.offset = nextOffset;

    let resp;
    try {
      resp = await fetch(`${QDRANT_URL}/collections/${collection}/points/scroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      break;
    }
    if (!resp.ok) break;
    const data = await resp.json();
    const points = data.result?.points || [];
    for (const p of points) out.push({ payload: p.payload || {} });
    nextOffset = data.result?.next_page_offset ?? null;
    if (nextOffset === null) break;
    safety += 1;
  }
  return out;
}

export async function fetchVariantPerformance(cohortId = 'aiandwebservices'): Promise<VariantPerformance> {
  const cohortFilter = {
    must: [{ key: 'cohort_id', match: { value: cohortId } }],
  };

  // Pull all emails_sent with variant tags (plus untagged for denominator)
  const emailsSent = await scrollAll('emails_sent', cohortFilter);
  const replies = await scrollAll('colony_email_replies', cohortFilter);

  if (emailsSent.length === 0) {
    return {
      total_sends: 0,
      total_tagged_sends: 0,
      total_replies: 0,
      baseline_reply_rate_pct: null,
      variants: [],
      has_data: false,
    };
  }

  // Index replies by original_email_id for quick lookup
  const repliesByOriginalId: Record<string, Array<{ classification: string }>> = {};
  for (const r of replies) {
    const origId = (r.payload.original_email_id as string) || '';
    if (!origId) continue;
    if (!repliesByOriginalId[origId]) repliesByOriginalId[origId] = [];
    repliesByOriginalId[origId].push({ classification: (r.payload.classification as string) || 'OTHER' });
  }

  // Aggregate by variant
  const byVariant: Record<string, { label: string; sends: number; replies: number; interested: number }> = {};
  let totalTagged = 0;
  let totalReplies = 0;
  const totalSends = emailsSent.length;

  for (const e of emailsSent) {
    const vId = (e.payload.subject_variant_id as string) || '';
    const vLabel = (e.payload.subject_variant_label as string) || vId;
    const msgId = (e.payload.resend_message_id as string) || (e.payload.message_id as string) || (e.payload.email_id as string) || '';

    if (vId) totalTagged += 1;

    const repliesForThis = repliesByOriginalId[msgId] || [];
    const hasReply = repliesForThis.length > 0;
    const hasInterested = repliesForThis.some((r) => r.classification === 'INTERESTED');

    if (hasReply) totalReplies += 1;

    const key = vId || '(untagged)';
    if (!byVariant[key]) byVariant[key] = { label: vLabel || key, sends: 0, replies: 0, interested: 0 };
    byVariant[key].sends += 1;
    if (hasReply) byVariant[key].replies += 1;
    if (hasInterested) byVariant[key].interested += 1;
  }

  const baselineReplyRate = totalSends === 0 ? null : (totalReplies / totalSends) * 100;

  const variants: VariantStats[] = Object.entries(byVariant).map(([vId, v]) => {
    const replyRate = v.sends === 0 ? null : (v.replies / v.sends) * 100;
    const interestedRate = v.sends === 0 ? null : (v.interested / v.sends) * 100;

    let isWinner = false;
    let isLoser = false;
    if (baselineReplyRate !== null && replyRate !== null && v.sends >= 5) {
      if (replyRate > baselineReplyRate * 1.5) isWinner = true;
      if (replyRate < baselineReplyRate * 0.5) isLoser = true;
    }

    return {
      variant_id: vId,
      variant_label: v.label,
      sends: v.sends,
      replies: v.replies,
      interested_replies: v.interested,
      reply_rate_pct: replyRate === null ? null : Math.round(replyRate * 10) / 10,
      interested_rate_pct: interestedRate === null ? null : Math.round(interestedRate * 10) / 10,
      is_winner: isWinner,
      is_loser: isLoser,
    };
  });

  // Sort: winners first, then by sends desc
  variants.sort((a, b) => {
    if (a.is_winner !== b.is_winner) return a.is_winner ? -1 : 1;
    if (a.is_loser !== b.is_loser) return a.is_loser ? 1 : -1;
    return b.sends - a.sends;
  });

  return {
    total_sends: totalSends,
    total_tagged_sends: totalTagged,
    total_replies: totalReplies,
    baseline_reply_rate_pct: baselineReplyRate === null ? null : Math.round(baselineReplyRate * 10) / 10,
    variants,
    has_data: totalSends > 0,
  };
}
