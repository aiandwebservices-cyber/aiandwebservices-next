import { discoveryDocs } from '@/lib/agent/discovery';

export function GET() {
  return Response.json(discoveryDocs()['ai-catalog.json'], {
    headers: { 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' },
  });
}
