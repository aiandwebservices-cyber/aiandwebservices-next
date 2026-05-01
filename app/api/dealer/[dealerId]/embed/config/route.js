import { getDealerConfig } from '../../../_lib/espocrm.js';

// Public-facing dealer config consumed by the embedded widget. Anything
// returned here is visible to anyone who can hit the iframe — keep secrets out.
//
// To onboard a dealer, drop their public-safe config into this map. The
// EspoCRM credentials never leak because we only read from getDealerConfig
// to confirm the dealer exists; the response below is hand-shaped.

const DEALER_PUBLIC = {
  lotcrm: {
    dealerName: 'Primo Auto Group',
    phone:      '(305) 555-0199',
    email:      'sales@primoautogroup.com',
    address:    { city: 'Miami', state: 'FL' },
    colors:     { primary: '#D4AF37', accent: '#FF1F2D' },
    greeting:   "Hi! How can I help you find the right vehicle at Primo Auto Group?",
    features:   { chatWidget: true, leadReceiver: true },
    plan:       'professional',
  },
};

const ALLOW_ORIGIN_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=60',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: ALLOW_ORIGIN_HEADERS });
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;

  // Confirm the dealer exists in the EspoCRM client config (gates unknown slugs).
  if (!getDealerConfig(dealerId)) {
    return Response.json(
      { ok: false, error: `Unknown dealer: ${dealerId}` },
      { status: 404, headers: ALLOW_ORIGIN_HEADERS },
    );
  }

  const config = DEALER_PUBLIC[dealerId];
  if (!config) {
    return Response.json(
      { ok: false, error: 'No public widget config for this dealer' },
      { status: 404, headers: ALLOW_ORIGIN_HEADERS },
    );
  }

  return Response.json({ ok: true, config }, { headers: ALLOW_ORIGIN_HEADERS });
}
