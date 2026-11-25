import { getContactThanks } from '@/lib/agent/forms';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get('ref') ?? '';
  return getContactThanks(ref);
}
