import { espoFetch, getDealerConfig } from '../../_lib/espocrm.js';
import { withErrorHandling } from '../../../../../lib/dealer-platform/utils/error-handler.js';
import { rateLimit } from '../../../../../lib/dealer-platform/middleware/rate-limit.js';

const VALID_STATUSES = new Set([
  'Available',
  'Featured',
  'OnSale',
  'JustArrived',
  'PriceDrop',
]);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export const GET = withErrorHandling(async (req, { params }) => {
  const limited = rateLimit(req, { limit: 60, window: 60 });
  if (limited) return limited;
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status');
  const statuses = (statusParam ? statusParam.split(',') : [])
    .map((s) => s.trim())
    .filter((s) => s && VALID_STATUSES.has(s));

  const query = new URLSearchParams();
  query.set('orderBy', 'dateAdded');
  query.set('order', 'desc');

  if (statuses.length > 0) {
    query.set('where[0][type]', 'in');
    query.set('where[0][attribute]', 'status');
    statuses.forEach((s, i) => {
      query.set(`where[0][value][${i}]`, s);
    });
  }

  const result = await espoFetch(
    'GET',
    `/api/v1/CVehicle?${query.toString()}`,
    null,
    dealerConfig,
  );
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return Response.json({ ok: true, vehicles: list });
});
