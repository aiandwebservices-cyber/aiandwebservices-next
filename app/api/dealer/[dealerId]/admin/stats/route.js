// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import { espoFetch, getDealerConfig } from '../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function firstOfMonth() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

function buildQuery(parts) {
  const q = new URLSearchParams();
  q.set('select', 'id');
  q.set('maxSize', '0');
  parts.forEach((p, i) => {
    q.set(`where[${i}][type]`, p.type);
    q.set(`where[${i}][attribute]`, p.attribute);
    if (Array.isArray(p.value)) {
      p.value.forEach((v, j) => q.set(`where[${i}][value][${j}]`, v));
    } else if (p.value !== undefined) {
      q.set(`where[${i}][value]`, p.value);
    }
  });
  return q.toString();
}

async function count(entity, parts, cfg) {
  const r = await espoFetch('GET', `/api/v1/${entity}?${buildQuery(parts)}`, null, cfg);
  if (!r.ok) return { ok: false, error: r.error };
  return { ok: true, total: r.data?.total ?? 0 };
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const monthStart = firstOfMonth();

  const [
    totalVehicles,
    featured,
    onSale,
    soldThisMonth,
    activeLeads,
    activeReservations,
    inventoryList,
    soldList,
  ] = await Promise.all([
    count('CVehicle', [
      { type: 'notEquals', attribute: 'status', value: 'Sold' },
    ], dealerConfig),
    count('CVehicle', [
      { type: 'equals', attribute: 'status', value: 'Featured' },
    ], dealerConfig),
    count('CVehicle', [
      { type: 'equals', attribute: 'status', value: 'OnSale' },
    ], dealerConfig),
    count('CVehicle', [
      { type: 'equals', attribute: 'status', value: 'Sold' },
      { type: 'greaterThanOrEquals', attribute: 'dateSold', value: monthStart },
    ], dealerConfig),
    count('Lead', [
      { type: 'equals', attribute: 'status', value: 'New' },
    ], dealerConfig),
    count('CVehicleReservation', [
      { type: 'equals', attribute: 'status', value: 'Active' },
    ], dealerConfig),
    espoFetch(
      'GET',
      '/api/v1/CVehicle?' + (() => {
        const q = new URLSearchParams();
        q.set('select', 'id,dateAdded,status');
        q.set('maxSize', '500');
        q.set('where[0][type]', 'notEquals');
        q.set('where[0][attribute]', 'status');
        q.set('where[0][value]', 'Sold');
        return q.toString();
      })(),
      null,
      dealerConfig,
    ),
    espoFetch(
      'GET',
      '/api/v1/CVehicle?' + (() => {
        const q = new URLSearchParams();
        q.set('select', 'id,finalSalePrice,costBasis,dateSold');
        q.set('maxSize', '500');
        q.set('where[0][type]', 'equals');
        q.set('where[0][attribute]', 'status');
        q.set('where[0][value]', 'Sold');
        q.set('where[1][type]', 'greaterThanOrEquals');
        q.set('where[1][attribute]', 'dateSold');
        q.set('where[1][value]', monthStart);
        return q.toString();
      })(),
      null,
      dealerConfig,
    ),
  ]);

  const todayMs = Date.now();
  let avgDaysOnLot = 0;
  if (inventoryList.ok && Array.isArray(inventoryList.data?.list) && inventoryList.data.list.length) {
    const days = inventoryList.data.list
      .map((v) => v.dateAdded ? Math.floor((todayMs - Date.parse(v.dateAdded)) / 86400000) : null)
      .filter((d) => d !== null && Number.isFinite(d) && d >= 0);
    if (days.length) {
      avgDaysOnLot = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
    }
  }

  let totalRevenue = 0;
  let totalProfit = 0;
  if (soldList.ok && Array.isArray(soldList.data?.list)) {
    for (const v of soldList.data.list) {
      const sale = Number(v.finalSalePrice ?? 0);
      const cost = Number(v.costBasis ?? 0);
      if (Number.isFinite(sale)) totalRevenue += sale;
      if (Number.isFinite(sale) && Number.isFinite(cost)) totalProfit += sale - cost;
    }
  }

  return Response.json({
    ok: true,
    stats: {
      totalVehicles: totalVehicles.total ?? 0,
      featured: featured.total ?? 0,
      onSale: onSale.total ?? 0,
      soldThisMonth: soldThisMonth.total ?? 0,
      activeLeads: activeLeads.total ?? 0,
      activeReservations: activeReservations.total ?? 0,
      avgDaysOnLot,
      totalRevenue,
      totalProfit,
    },
  });
}
