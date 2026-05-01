// In-memory conversation session store with TTL.
// Used by chat (sessionId) and sms-agent (phone number).
// 24h inactivity expiry, 50-message cap per session.

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_MESSAGES = 50;
const stores = new Map(); // namespace -> Map(key -> session)

function getNamespace(ns) {
  if (!stores.has(ns)) stores.set(ns, new Map());
  return stores.get(ns);
}

function gc(map) {
  const cutoff = Date.now() - TTL_MS;
  for (const [k, v] of map) {
    if (v.lastMessageAt < cutoff) map.delete(k);
  }
}

export function getSession(namespace, key) {
  const map = getNamespace(namespace);
  gc(map);
  const s = map.get(key);
  if (!s) return null;
  return s;
}

export function ensureSession(namespace, key) {
  const map = getNamespace(namespace);
  gc(map);
  let s = map.get(key);
  if (!s) {
    s = {
      messages: [],
      customerInfo: { name: null, phone: null, email: null },
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    };
    map.set(key, s);
  }
  return s;
}

export function appendMessage(namespace, key, role, content) {
  const s = ensureSession(namespace, key);
  s.messages.push({ role, content, at: Date.now() });
  if (s.messages.length > MAX_MESSAGES) {
    s.messages = s.messages.slice(-MAX_MESSAGES);
  }
  s.lastMessageAt = Date.now();
  return s;
}

export function updateCustomerInfo(namespace, key, info) {
  const s = ensureSession(namespace, key);
  if (info.name && !s.customerInfo.name) s.customerInfo.name = info.name;
  if (info.phone && !s.customerInfo.phone) s.customerInfo.phone = info.phone;
  if (info.email && !s.customerInfo.email) s.customerInfo.email = info.email;
  s.lastMessageAt = Date.now();
  return s.customerInfo;
}

export function deleteSession(namespace, key) {
  const map = getNamespace(namespace);
  map.delete(key);
}
