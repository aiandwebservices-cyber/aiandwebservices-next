const STRIP_HTML = /<[^>]*>/g;
const MAX_LEN = 10_000;

export function sanitizeInput(obj) {
  if (typeof obj === 'string') {
    return obj.replace(STRIP_HTML, '').trim().slice(0, MAX_LEN);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }
  if (obj !== null && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$')) continue;
      if (k.includes('__proto__') || k.includes('constructor')) continue;
      out[k] = sanitizeInput(v);
    }
    return out;
  }
  return obj;
}

export async function sanitizeRequest(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return null;
  }
  return sanitizeInput(body);
}
