import { liveDeps } from '@/lib/agent/deps';
import { getContactConfirm, postContactConfirm } from '@/lib/agent/forms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return getContactConfirm();
}

export async function POST(req: Request) {
  return postContactConfirm(req, liveDeps(req));
}
