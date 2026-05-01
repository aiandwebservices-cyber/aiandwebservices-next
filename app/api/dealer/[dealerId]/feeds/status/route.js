import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const origin = new URL(req.url).origin;
  const base = `${origin}/api/dealer/${dealerId}/feeds`;

  let vehicleCount = 0;
  const result = await espoFetch(
    'GET',
    '/api/v1/CVehicle?where[0][type]=equals&where[0][attribute]=status&where[0][value]=Available&maxSize=1&offset=0',
    null,
    dealerConfig,
  );
  if (result.ok) {
    vehicleCount = result.data?.total ?? (Array.isArray(result.data?.list) ? result.data.list.length : 0);
  }

  const now = new Date().toISOString();
  const configured = vehicleCount > 0;

  const feeds = [
    {
      platform: 'carscom',
      label: 'Cars.com',
      format: 'xml',
      url: `${base}/carscom`,
      vehicleCount,
      lastGenerated: now,
      configured,
    },
    {
      platform: 'autotrader',
      label: 'AutoTrader',
      format: 'xml',
      url: `${base}/autotrader`,
      vehicleCount,
      lastGenerated: now,
      configured,
    },
    {
      platform: 'cargurus',
      label: 'CarGurus',
      format: 'csv',
      url: `${base}/cargurus`,
      vehicleCount,
      lastGenerated: now,
      configured,
    },
    {
      platform: 'facebook',
      label: 'Facebook Marketplace',
      format: 'csv',
      url: `${base}/facebook`,
      vehicleCount,
      lastGenerated: now,
      configured,
    },
  ];

  return Response.json({ ok: true, feeds });
}
