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
    const photoXml = photos.map((u) => `      <photo_url>${xmlEsc(u)}</photo_url>`).join('\n');
    return `  <listing>
    <vin>${xmlEsc(v.vin)}</vin>
    <stock_number>${xmlEsc(v.stockNumber)}</stock_number>
    <year>${xmlEsc(v.year)}</year>
    <make>${xmlEsc(v.make)}</make>
    <model>${xmlEsc(v.model)}</model>
    <trim>${xmlEsc(v.trim)}</trim>
    <body_type>${xmlEsc(v.bodyStyle)}</body_type>
    <ext_color>${xmlEsc(v.exteriorColor)}</ext_color>
    <int_color>${xmlEsc(v.interiorColor)}</int_color>
    <odometer>${xmlEsc(v.mileage || 0)}</odometer>
    <price>${xmlEsc(price)}</price>
    <engine_description>${xmlEsc(v.engine)}</engine_description>
    <transmission>${xmlEsc(v.transmission)}</transmission>
    <drive_type>${xmlEsc(v.drivetrain)}</drive_type>
    <fuel_type>${xmlEsc(v.fuelType)}</fuel_type>
    <comments>${xmlEsc(v.description)}</comments>
    <photos>
${photoXml}
    </photos>
  </listing>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<auto_inventory generated="${new Date().toISOString()}">
${items}
</auto_inventory>`;
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

  return new Response(buildFeed(vehicles), {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Vehicle-Count': String(vehicles.length),
    },
  });
}
