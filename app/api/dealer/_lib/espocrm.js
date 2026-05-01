const LOTCRM_CONFIG = {
  url: 'https://lotcrm.lotpilot.ai',
  apiKey: '7190e14d23e6ca8d68a5d2b29c91e55e',
  embedAllowedOrigins: ['*'],
};

export function getDealerConfig(dealerId) {
  if (dealerId === 'lotcrm') return LOTCRM_CONFIG;
  return null;
}

export async function espoFetch(method, path, body, dealerConfig) {
  if (!dealerConfig || !dealerConfig.url || !dealerConfig.apiKey) {
    return { ok: false, error: 'Missing or invalid dealer config' };
  }

  const url = `${dealerConfig.url.replace(/\/$/, '')}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const init = {
      method,
      headers: {
        'X-Api-Key': dealerConfig.apiKey,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };
    if (body !== undefined && body !== null) {
      init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const res = await fetch(url, init);
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const err =
        (data && typeof data === 'object' && (data.message || data.error)) ||
        (typeof data === 'string' && data) ||
        `EspoCRM ${res.status} ${res.statusText}`;
      return { ok: false, error: err, status: res.status };
    }

    return { ok: true, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, error: 'EspoCRM request timed out after 5s' };
    }
    return { ok: false, error: err.message || String(err) };
  } finally {
    clearTimeout(timer);
  }
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return digits;
}

export function phoneNumberData(phone, type = 'Mobile') {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  return [{ phoneNumber: digits, type }];
}

export function nowEspoDateTime(offsetHours = 0) {
  const d = new Date(Date.now() + offsetHours * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}
