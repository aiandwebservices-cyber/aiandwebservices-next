import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function csvEsc(val) {
  const s = String(val == null ? '' : val);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

const HEADERS = [
  'VIN', 'StockNumber', 'Year', 'Make', 'Model', 'Trim', 'Price',
  'Mileage', 'ExteriorColor', 'InteriorColor', 'BodyStyle', 'Drivetrain',
  'Transmission', 'Engine', 'FuelType', 'Description', 'PhotoURLs',
];

function buildFeed(vehicles) {
  const rows = vehicles.map((v) => {
    const price = v.salePrice || v.listPrice || 0;
    const photos = Array.isArray(v.photos) ? v.photos.join('|') : '';
    return [
      v.vin, v.stockNumber, v.year, v.make, v.model, v.trim, price,
      v.mileage || 0, v.exteriorColor, v.interiorColor, v.bodyStyle,
      v.drivetrain, v.transmission, v.engine, v.fuelType, v.description, photos,
    ].map(csvEsc).join(',');
  });
  return [HEADERS.join(','), ...rows].join('\n');
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
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${dealerId}-cargurus.csv"`,
      'Cache-Control': 'public, max-age=3600',
      'X-Vehicle-Count': String(vehicles.length),
    },
  });
}
