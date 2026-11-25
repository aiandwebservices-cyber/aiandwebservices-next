import { liveDeps } from '@/lib/agent/deps';
import { CORS, handleMcp, preflight } from '@/lib/agent/mcp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 8000;

export async function POST(req: Request): Promise<Response> {
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) {
    return Response.json({ jsonrpc: '2.0', error: { code: -32600, message: 'Request too large' } }, { status: 413, headers: CORS });
  }
  return handleMcp(req, liveDeps(req));
}

export function OPTIONS(): Response {
  return preflight();
}
