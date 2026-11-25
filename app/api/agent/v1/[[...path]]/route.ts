import { liveDeps } from '@/lib/agent/deps';
import {
  getComparison,
  getContactChannels,
  getGuarantee,
  getMeetingLink,
  getOffers,
  getPricing,
  getProduct,
  getService,
  listServices,
  searchFaq,
} from '@/lib/agent/facts';
import { previewInquiry, submitInquiry } from '@/lib/agent/inquiry';
import { CORS } from '@/lib/agent/mcp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { ...CORS, 'cache-control': status === 200 ? 'public, max-age=300' : 'no-store' } });
}

async function readJson(req: Request) {
  try { return await req.json(); } catch { return null; }
}

export async function GET(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  const key = path.join('/');
  const url = new URL(req.url);
  if (key === 'services') return json(listServices());
  if (key.startsWith('services/')) {
    const service = getService(key.slice('services/'.length));
    return json(service, 'error' in service ? 404 : 200);
  }
  if (key === 'comparison') return json(getComparison());
  if (key === 'pricing') return json(getPricing());
  if (key === 'offers') return json(getOffers());
  if (key === 'product') return json(getProduct());
  if (key === 'guarantee') return json(getGuarantee());
  if (key === 'faq') return json(searchFaq(url.searchParams.get('q') ?? ''));
  if (key === 'contact') return json(getContactChannels());
  if (key === 'meeting-link') return json(getMeetingLink());
  return json({ error: 'not_found' }, 404);
}

export async function POST(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  const key = path.join('/');
  const deps = liveDeps(req);
  const body = await readJson(req);
  if (key === 'inquiry-preview') {
    const result = await previewInquiry(body, req, deps);
    return json(result.body, result.status);
  }
  if (key === 'inquiries') {
    const result = await submitInquiry(body, req, deps);
    return json(result.body, result.status);
  }
  return json({ error: 'not_found' }, 404);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
