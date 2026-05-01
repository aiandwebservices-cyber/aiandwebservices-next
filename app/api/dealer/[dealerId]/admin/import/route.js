// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

const CURRENCY_FIELDS = ['listPrice', 'salePrice', 'costBasis', 'finalSalePrice'];
const NUMERIC_FIELDS = new Set([
  'year', 'mileage', 'listPrice', 'salePrice', 'costBasis',
  'finalSalePrice', 'doors', 'cylinders',
]);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Minimal RFC4180-ish CSV parser supporting quoted fields, escaped quotes, CRLF.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell); cell = '';
      } else if (ch === '\n') {
        row.push(cell); cell = '';
        rows.push(row); row = [];
      } else if (ch === '\r') {
        // ignore — handled by \n
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 0 && !(r.length === 1 && r[0] === ''));
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
  const csv = body?.csv;
  if (!csv || typeof csv !== 'string') return bad('csv string is required');

  const rows = parseCsv(csv);
  if (rows.length < 2) return bad('CSV must have a header and at least one row');

  const headers = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  let imported = 0;
  let errors = 0;
  const details = [];

  for (let r = 0; r < dataRows.length; r++) {
    const cells = dataRows[r];
    const payload = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      let val = cells[c];
      if (val === undefined || val === '') continue;
      if (NUMERIC_FIELDS.has(key)) {
        const n = Number(String(val).replace(/[$,]/g, ''));
        if (!Number.isNaN(n)) val = n;
      }
      payload[key] = val;
    }
    for (const f of CURRENCY_FIELDS) {
      if (payload[f] !== undefined && payload[f] !== null && payload[f] !== '') {
        payload[`${f}Currency`] = 'USD';
      }
    }
    if (!payload.dateAdded) payload.dateAdded = today();
    if (!payload.status) payload.status = 'Available';

    const result = await espoFetch('POST', '/api/v1/CVehicle', payload, dealerConfig);
    if (result.ok) {
      imported++;
      details.push({ row: r + 2, ok: true, id: result.data?.id });
    } else {
      errors++;
      details.push({ row: r + 2, ok: false, error: result.error });
    }
  }

  return Response.json({ ok: true, imported, errors, details });
}
