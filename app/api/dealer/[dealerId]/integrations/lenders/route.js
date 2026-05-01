import { getDealerConfig } from '../../../_lib/espocrm.js';

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === 'submit') {
    const { platform, dealId, customerInfo, vehicleInfo, financeTerms, selectedLenders = [] } = body;

    if (!platform || !['routeone', 'dealertrack'].includes(platform)) {
      return Response.json({ ok: false, error: 'platform must be routeone or dealertrack' }, { status: 400 });
    }

    // TODO: Wire to RouteOne/DealerTrack partner API
    // RouteOne:    POST https://www.routeone.net/api/v1/creditapplication
    //              Headers: Authorization: Bearer {token}, Dealer-Id: {dealerConfig.integrations?.routeone?.dealerId}
    // DealerTrack: POST https://api.dealertrack.com/v1/applications
    //              Headers: Authorization: Bearer {token}, Dealer-Id: {dealerConfig.integrations?.dealertrack?.dealerId}
    const { name, income } = customerInfo || {};
    const { year, make, model } = vehicleInfo || {};
    const { amount } = financeTerms || {};
    console.log(
      `Would submit to ${platform}: ${name} for ${year} ${make} ${model} at $${amount} — ` +
      `lenders: ${selectedLenders.join(', ')} — deal ${dealId}`,
    );

    const lenderPool = [
      { lender: 'Capital One Auto', status: 'approved', tier: 'Tier 1', apr: 4.9, maxAmount: 45000, conditions: 'None', responseTime: 'Instant' },
      { lender: 'Ally Financial',   status: 'approved', tier: 'Tier 2', apr: 6.9, maxAmount: 38000, conditions: 'Proof of income required', responseTime: 'Instant' },
      { lender: 'Chase Auto',       status: 'declined', reason: 'Insufficient credit history', responseTime: 'Instant' },
      { lender: 'Local Credit Union', status: 'pending', note: 'Manual review — response in 2-4 hours', responseTime: '2-4 hours' },
    ];

    const results = selectedLenders.length > 0
      ? lenderPool.filter(l => selectedLenders.some(s => l.lender.toLowerCase().includes(s.toLowerCase())))
      : lenderPool;

    return Response.json({
      ok: true,
      platform,
      submissions: results.length || lenderPool.length,
      results: results.length > 0 ? results : lenderPool,
    });
  }

  return Response.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
}
