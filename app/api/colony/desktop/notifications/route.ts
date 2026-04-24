export async function GET(req: Request) {
  const url = new URL(req.url)
  const _since = url.searchParams.get('since')
  // Phase 19B: query feed-builder for reply_interested / lead_hot / bill_nye_finding
  // events that occurred after `since`, authenticate via session cookie.
  return Response.json([])
}
