import { llmsText } from '@/lib/agent/llms';

export function GET() {
  return new Response(llmsText(), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
}
