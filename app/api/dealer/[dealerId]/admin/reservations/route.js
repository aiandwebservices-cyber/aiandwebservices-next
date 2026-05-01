// TODO: Add Clerk auth middleware for production
// Only authenticated dealer admins should access these routes

import {
  espoFetch,
  getDealerConfig,
  nowEspoDateTime,
} from '../../../_lib/espocrm.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const q = new URLSearchParams();
  q.set('where[0][type]', 'equals');
  q.set('where[0][attribute]', 'status');
  q.set('where[0][value]', 'Active');
  q.set('orderBy', 'reservedAt');
  q.set('order', 'desc');
  q.set('maxSize', '200');

  const result = await espoFetch(
    'GET',
    `/api/v1/CVehicleReservation?${q.toString()}`,
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return Response.json({ ok: true, reservations: list, total: result.data?.total ?? list.length });
}

export async function PUT(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }
  const { reservationId, action } = body || {};
  if (!reservationId) return bad('reservationId is required');
  if (!['confirm', 'extend', 'release'].includes(action)) {
    return bad('action must be confirm | extend | release');
  }

  let payload;
  if (action === 'confirm') {
    payload = { status: 'Confirmed' };
  } else if (action === 'extend') {
    const cur = await espoFetch(
      'GET',
      `/api/v1/CVehicleReservation/${encodeURIComponent(reservationId)}`,
      null,
      dealerConfig,
    );
    if (!cur.ok) {
      return Response.json({ ok: false, error: cur.error }, { status: 502 });
    }
    const baseStr = cur.data?.expiresAt;
    const baseTs = baseStr ? Date.parse(baseStr.replace(' ', 'T') + 'Z') : Date.now();
    const start = Number.isFinite(baseTs) ? baseTs : Date.now();
    const newDate = new Date(start + 24 * 3600 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const expiresAt =
      `${newDate.getUTCFullYear()}-${pad(newDate.getUTCMonth() + 1)}-${pad(newDate.getUTCDate())} ` +
      `${pad(newDate.getUTCHours())}:${pad(newDate.getUTCMinutes())}:${pad(newDate.getUTCSeconds())}`;
    payload = { expiresAt };
  } else {
    payload = { status: 'Released', releasedAt: nowEspoDateTime(0) };
  }

  const result = await espoFetch(
    'PUT',
    `/api/v1/CVehicleReservation/${encodeURIComponent(reservationId)}`,
    payload,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  if (action === 'release') {
    const vehicleId = result.data?.vehicleId;
    if (vehicleId) {
      const patch = await espoFetch(
        'PATCH',
        `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
        { status: 'Available' },
        dealerConfig,
      );
      if (!patch.ok) {
        return Response.json({
          ok: false,
          error: `Reservation released but vehicle status update failed: ${patch.error}`,
          reservation: result.data,
        }, { status: 502 });
      }
    }
  }

  return Response.json({ ok: true, reservation: result.data });
}
