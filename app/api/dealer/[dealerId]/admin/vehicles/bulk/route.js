// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../../_lib/espocrm.js';

const VALID_ACTIONS = new Set([
  'markOnSale',
  'removeSale',
  'markSold',
  'feature',
  'unfeature',
  'delete',
  'priceDrop',
]);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function buildPatch(action, body, vehicleId, dealerConfig) {
  switch (action) {
    case 'markOnSale': {
      if (body.salePrice === undefined || body.salePrice === null || body.salePrice === '') {
        throw new Error('salePrice required for markOnSale');
      }
      return {
        status: 'OnSale',
        salePrice: Number(body.salePrice),
        salePriceCurrency: 'USD',
      };
    }
    case 'removeSale':
      return { status: 'Available', salePrice: null };
    case 'markSold':
      return {
        status: 'Sold',
        dateSold: today(),
        ...(body.buyerName ? { buyerName: body.buyerName } : {}),
      };
    case 'feature':
      return { status: 'Featured' };
    case 'unfeature':
      return { status: 'Available' };
    case 'priceDrop': {
      const pct = Number(body.discountPercent);
      if (!pct || pct <= 0 || pct >= 100) {
        throw new Error('discountPercent must be between 0 and 100');
      }
      const cur = await espoFetch(
        'GET',
        `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
        null,
        dealerConfig,
      );
      if (!cur.ok) throw new Error(`fetch current failed: ${cur.error}`);
      const base = Number(cur.data?.listPrice ?? cur.data?.salePrice ?? 0);
      if (!base) throw new Error('vehicle has no listPrice');
      const newPrice = Math.round(base * (1 - pct / 100));
      return {
        status: 'PriceDrop',
        salePrice: newPrice,
        salePriceCurrency: 'USD',
      };
    }
    default:
      throw new Error(`unsupported action: ${action}`);
  }
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

  const { action, vehicleIds } = body || {};
  if (!action || !VALID_ACTIONS.has(action)) return bad('Invalid or missing action');
  if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
    return bad('vehicleIds must be a non-empty array');
  }

  let updated = 0;
  let errorCount = 0;
  const details = [];

  for (const vehicleId of vehicleIds) {
    try {
      let result;
      if (action === 'delete') {
        result = await espoFetch(
          'DELETE',
          `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
          null,
          dealerConfig,
        );
      } else {
        const patch = await buildPatch(action, body, vehicleId, dealerConfig);
        result = await espoFetch(
          'PATCH',
          `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
          patch,
          dealerConfig,
        );
      }
      if (result.ok) {
        updated++;
        details.push({ vehicleId, ok: true });
      } else {
        errorCount++;
        details.push({ vehicleId, ok: false, error: result.error });
      }
    } catch (e) {
      errorCount++;
      details.push({ vehicleId, ok: false, error: e.message });
    }
  }

  return Response.json({ ok: true, updated, errors: errorCount, details });
}
