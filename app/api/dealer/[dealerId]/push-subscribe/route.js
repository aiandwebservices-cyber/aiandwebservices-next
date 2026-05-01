import {
  loadSubscriptions,
  addSubscription,
  removeSubscription,
} from '@/lib/dealer-platform/utils/push-storage.js';

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const subs = await loadSubscriptions(dealerId);
  return Response.json({ ok: true, count: subs.length });
}

export async function POST(req, { params }) {
  const { dealerId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { endpoint, keys } = body || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ ok: false, error: 'Missing endpoint or keys' }, { status: 400 });
  }

  await addSubscription(dealerId, { endpoint, keys });
  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { dealerId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { endpoint } = body || {};
  if (!endpoint) {
    return Response.json({ ok: false, error: 'Missing endpoint' }, { status: 400 });
  }

  await removeSubscription(dealerId, endpoint);
  return Response.json({ ok: true });
}
