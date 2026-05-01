// In-memory rate limiter — resets per function instance (acceptable for Fluid Compute).
// For multi-instance shared limits, replace the Map with a Redis store.

const store = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now > val.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * @param {Request} request
 * @param {{ limit?: number, window?: number }} options - window is in seconds
 * @returns {Response | null} 429 Response if over limit, null if allowed
 */
export function rateLimit(request, { limit = 30, window: windowSeconds = 60 } = {}) {
  const ip = getIP(request);
  const path = new URL(request.url).pathname;
  const key = `${ip}:${path}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  store.set(key, entry);

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return Response.json(
      { error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  return null;
}
