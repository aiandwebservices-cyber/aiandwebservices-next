import { getDealerConfig } from '../../../_lib/espocrm.js';

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === 'pull') {
    const { type = 'soft', customerName, ssn, dob, address, monthlyIncome } = body;

    if (!customerName || !ssn || !dob) {
      return Response.json({ ok: false, error: 'customerName, ssn, and dob are required' }, { status: 400 });
    }

    // TODO: Wire to 700Credit API when dealer provides their account credentials
    // POST https://api.700credit.com/creditpull/v3/submit
    // Headers: X-Api-Key: {dealerConfig.integrations?.credit?.apiKey}
    //          X-Dealer-Id: {dealerConfig.integrations?.credit?.dealerId}
    // Body: { type, applicant: { name, ssn, dob, address }, income: monthlyIncome }
    console.log(`Would submit to 700Credit: ${type} pull for ${customerName}`);

    const pullId = `CR-${Date.now()}`;
    const score = type === 'hard' ? 738 : 742;

    return Response.json({
      ok: true,
      provider: '700credit',
      type,
      result: {
        approved: true,
        creditScore: score,
        tier: 'Tier 1',
        bureau: 'Experian',
        maxAmount: 45000,
        estimatedApr: 4.9,
        factors: [
          'Length of credit history: Excellent',
          'Payment history: No late payments',
          `Credit utilization: 23% (Good)`,
          'Recent inquiries: 1 in last 6 months',
        ],
        pullDate: new Date().toISOString().split('T')[0],
        pullId,
      },
    });
  }

  return Response.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
}
