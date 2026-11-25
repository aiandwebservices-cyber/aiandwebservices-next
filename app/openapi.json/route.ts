import { openapiDocument } from '@/lib/agent/openapi';

export function GET() {
  return Response.json(openapiDocument(), {
    headers: { 'cache-control': 'public, max-age=300', 'access-control-allow-origin': '*' },
  });
}
