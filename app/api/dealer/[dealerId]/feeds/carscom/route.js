import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function xmlEsc(val) {
  return String(val == null ? '' : val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildFeed(vehicles) {
  const items = vehicles.map((v) => {
    const price = v.salePrice || v.listPrice || 0;
    const photos = Array.isArray(v.photos) ? v.photos : [];
    const photoXml = photos.map((u) => `      <url>${xmlEsc(u)}</url>`).join('\n');
    return `  <vehicle>
    <vin>${xmlEsc(v.vin)}</vin>
    <stock_number>${xmlEsc(v.stockNumber)}</stock_number>
    <year>${xmlEsc(v.year)}</year>
    <make>${xmlEsc(v.make)}</make>
    <model>${xmlEsc(v.model)}</model>
    <trim>${xmlEsc(v.trim)}</trim>
    <body_style>${xmlEsc(v.bodyStyle)}</body_style>
    <exterior_color>${xmlEsc(v.exteriorColor)}</exterior_color>
    <interior_color>${xmlEsc(v.interiorColor)}</interior_color>
    <mileage>${xmlEsc(v.mileage || 0)}</mileage>
    <price>${xmlEsc(price)}</price>
    <engine>${xmlEsc(v.engine)}</engine>
    <transmission>${xmlEsc(v.transmission)}</transmission>
    <drivetrain>${xmlEsc(v.drivetrain)}</drivetrain>
    <fuel_type>${xmlEsc(v.fuelType)}</fuel_type>
    <description>${xmlEsc(v.description)}</description>
    <photo_urls>
${photoXml}
    </photo_urls>
  </vehicle>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<inventory generated="${new Date().toISOString()}">
${items}
</inventory>`;
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return new Response('Unknown dealer', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }

  let vehicles = [];
  const result = await espoFetch(
    'GET',
    '/api/v1/CVehicle?where[0][type]=equals&where[0][attribute]=status&where[0][value]=Available&orderBy=dateAdded&order=desc&maxSize=500',
    null,
    dealerConfig,
  );
  if (result.ok && Array.isArray(result.data?.list)) {
    vehicles = result.data.list.filter((v) => v.status !== 'Sold');
  }

  const xml = buildFeed(vehicles);
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Vehicle-Count': String(vehicles.length),
    },
  });
}
