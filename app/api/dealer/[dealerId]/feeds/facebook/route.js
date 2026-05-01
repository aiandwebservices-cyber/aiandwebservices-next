import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function csvEsc(val) {
  const s = String(val == null ? '' : val);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

function stateOfVehicle(v) {
  if (v.history?.cleanTitle && v.history?.noAccidents && v.history?.oneOwner) return 'excellent';
  if (v.history?.cleanTitle && v.history?.noAccidents) return 'good';
  return 'fair';
}

const HEADERS = [
  'id', 'title', 'description', 'availability', 'condition', 'price',
  'link', 'image_link', 'additional_image_link', 'brand',
  'vehicle_registration_plate', 'mileage.value', 'mileage.unit',
  'year', 'make', 'model', 'trim', 'vin', 'body_style',
  'exterior_color', 'drivetrain', 'fuel_type', 'transmission', 'state_of_vehicle',
];

function buildFeed(vehicles, dealerId) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${dealerId}.example.com`;

  const rows = vehicles.map((v) => {
    const price = v.salePrice || v.listPrice || 0;
    const photos = Array.isArray(v.photos) ? v.photos : [];
    const title = `${v.year} ${v.make} ${v.model}${v.trim ? ' ' + v.trim : ''}`.trim();
    const additionalPhotos = photos.slice(1, 11).join(',');

    return [
      v.id || v.vin,
      title,
      v.description || title,
      'in stock',
      'used',
      `${price} USD`,
      `${baseUrl}/inventory/${v.id || v.vin}`,
      photos[0] || '',
      additionalPhotos,
      v.make,
      v.stockNumber || '',
      v.mileage || 0,
      'MI',
      v.year,
      v.make,
      v.model,
      v.trim || '',
      v.vin || '',
      v.bodyStyle || '',
      v.exteriorColor || '',
      v.drivetrain || '',
      v.fuelType || '',
      v.transmission || '',
      stateOfVehicle(v),
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

  return new Response(buildFeed(vehicles, dealerId), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${dealerId}-facebook-catalog.csv"`,
      'Cache-Control': 'public, max-age=3600',
      'X-Vehicle-Count': String(vehicles.length),
    },
  });
}
