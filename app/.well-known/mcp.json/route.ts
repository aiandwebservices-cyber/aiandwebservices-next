import { discoveryDocs } from '@/lib/agent/discovery';

export function GET() {
  return Response.json(discoveryDocs()['mcp.json'], {
    headers: { 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' },
  });
}
