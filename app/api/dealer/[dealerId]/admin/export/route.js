// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

const CSV_FIELDS = [
  'id', 'year', 'make', 'model', 'trim', 'vin', 'mileage',
  'exteriorColor', 'interiorColor', 'transmission', 'drivetrain',
  'fuelType', 'bodyStyle', 'listPrice', 'salePrice', 'costBasis',
  'finalSalePrice', 'status', 'dateAdded', 'dateSold', 'description',
];

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(vehicles) {
  const header = CSV_FIELDS.join(',');
  const rows = vehicles.map((v) => CSV_FIELDS.map((f) => csvEscape(v[f])).join(','));
  return [header, ...rows].join('\n');
}

function toFacebook(vehicles) {
  const header = [
    'title', 'price', 'description', 'location', 'category',
    'condition', 'year', 'make', 'model', 'mileage',
    'transmission', 'fuel_type', 'body_style', 'exterior_color',
    'image_urls',
  ].join(',');
  const rows = vehicles.map((v) => {
    const title = `${v.year ?? ''} ${v.make ?? ''} ${v.model ?? ''} ${v.trim ?? ''}`.trim();
    const price = v.salePrice ?? v.listPrice ?? '';
    const images = Array.isArray(v.imageUrls) ? v.imageUrls.join('|') : (v.imageUrls ?? '');
    const cells = [
      title,
      price,
      v.description ?? '',
      v.location ?? '',
      'Vehicles',
      v.condition ?? 'Used',
      v.year ?? '',
      v.make ?? '',
      v.model ?? '',
      v.mileage ?? '',
      v.transmission ?? '',
      v.fuelType ?? '',
      v.bodyStyle ?? '',
      v.exteriorColor ?? '',
      images,
    ];
    return cells.map(csvEscape).join(',');
  });
  return [header, ...rows].join('\n');
}

function toCraigslist(vehicles) {
  return vehicles.map((v) => {
    const title = `${v.year ?? ''} ${v.make ?? ''} ${v.model ?? ''} ${v.trim ?? ''}`.trim();
    const price = v.salePrice ?? v.listPrice ?? 'Call for price';
    const lines = [
      title,
      `Price: $${price}`,
      `Mileage: ${v.mileage ?? 'N/A'}`,
      `VIN: ${v.vin ?? 'N/A'}`,
      `Color: ${v.exteriorColor ?? 'N/A'}`,
      `Transmission: ${v.transmission ?? 'N/A'}`,
      `Drivetrain: ${v.drivetrain ?? 'N/A'}`,
      '',
      v.description ?? '',
      '',
      '---',
      '',
    ];
    return lines.join('\n');
  }).join('\n');
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
  const { format, vehicleIds } = body || {};
  if (!['csv', 'facebook', 'craigslist'].includes(format)) {
    return bad('format must be csv | facebook | craigslist');
  }

  let vehicles = [];
  if (Array.isArray(vehicleIds) && vehicleIds.length > 0) {
    for (const id of vehicleIds) {
      const r = await espoFetch(
        'GET',
        `/api/v1/CVehicle/${encodeURIComponent(id)}`,
        null,
        dealerConfig,
      );
      if (r.ok && r.data) vehicles.push(r.data);
    }
  } else {
    const r = await espoFetch(
      'GET',
      '/api/v1/CVehicle?orderBy=dateAdded&order=desc&maxSize=500',
      null,
      dealerConfig,
    );
    if (!r.ok) return Response.json({ ok: false, error: r.error }, { status: 502 });
    vehicles = Array.isArray(r.data?.list) ? r.data.list : [];
  }

  let body_out;
  let contentType;
  let filename;
  if (format === 'csv') {
    body_out = toCsv(vehicles);
    contentType = 'text/csv; charset=utf-8';
    filename = 'inventory.csv';
  } else if (format === 'facebook') {
    body_out = toFacebook(vehicles);
    contentType = 'text/csv; charset=utf-8';
    filename = 'facebook-marketplace.csv';
  } else {
    body_out = toCraigslist(vehicles);
    contentType = 'text/plain; charset=utf-8';
    filename = 'craigslist.txt';
  }

  return new Response(body_out, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
