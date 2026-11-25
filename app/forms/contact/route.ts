import { liveDeps } from '@/lib/agent/deps';
import { getContactForm, postContactForm } from '@/lib/agent/forms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return getContactForm();
}

export async function POST(req: Request) {
  return postContactForm(req, liveDeps(req));
}
