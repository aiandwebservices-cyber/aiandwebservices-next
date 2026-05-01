import { espoFetch, getDealerConfig } from '../../../../_lib/espocrm.js';
import { scoreLeadSync, scoreToDealTier } from '../../../../../../../lib/dealer-platform/ai/lead-scorer.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

async function applyScore(leadId, dealerConfig) {
  const lead = await espoFetch(
    'GET',
    `/api/v1/Lead/${encodeURIComponent(leadId)}`,
    null,
    dealerConfig,
  );
  if (!lead.ok) {
    return { ok: false, leadId, error: `Lead fetch failed: ${lead.error}` };
  }

  const result = scoreLeadSync(lead.data || {});
  const dealTier = scoreToDealTier(result.score);

  const patch = await espoFetch(
    'PATCH',
    `/api/v1/Lead/${encodeURIComponent(leadId)}`,
    { cDealTier: dealTier, cTemperature: result.tier },
    dealerConfig,
  );
  if (!patch.ok) {
    return { ok: false, leadId, error: `Lead patch failed: ${patch.error}`, ...result };
  }

  const note = await espoFetch(
    'POST',
    '/api/v1/Note',
    {
      type: 'Post',
      parentType: 'Lead',
      parentId: leadId,
      post: `AI Score: ${result.score}/100 (${result.tier}) — ${result.recommendation}`,
    },
    dealerConfig,
  );

  return {
    ok: true,
    leadId,
    score: result.score,
    tier: result.tier,
    emoji: result.emoji,
    topSignals: result.topSignals,
    recommendation: result.recommendation,
    dealTier,
    noteOk: note.ok,
    noteError: note.ok ? undefined : note.error,
  };
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { leadIds } = body || {};
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return bad('leadIds must be a non-empty array');
  }

  const results = [];
  for (const id of leadIds) {
    if (!id) {
      results.push({ ok: false, leadId: id, error: 'empty leadId' });
      continue;
    }
    results.push(await applyScore(id, dealerConfig));
  }

  return Response.json({
    ok: true,
    scored: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    total: results.length,
    results,
  });
}
