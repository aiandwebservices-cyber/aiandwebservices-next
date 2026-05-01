// 5-minute in-memory inventory cache, keyed by dealerId. Survives
// across requests within a single Node process (warm Lambda / dev server).

import { espoFetch, getDealerConfig } from '../../../app/api/dealer/_lib/espocrm.js';

const TTL_MS = 5 * 60 * 1000;
const cache = new Map(); // dealerId -> { ts, vehicles }

export async function getCachedInventory(dealerId, { force = false } = {}) {
  const now = Date.now();
  const hit = cache.get(dealerId);
  if (!force && hit && now - hit.ts < TTL_MS) {
    return { ok: true, vehicles: hit.vehicles, cached: true };
  }

  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return { ok: false, error: `Unknown dealer: ${dealerId}` };

  const q = new URLSearchParams();
  q.set('orderBy', 'dateAdded');
  q.set('order', 'desc');
  q.set('maxSize', '200');
  q.set('where[0][type]', 'in');
  q.set('where[0][attribute]', 'status');
  ['Available', 'Featured', 'OnSale', 'JustArrived', 'PriceDrop'].forEach((s, i) => {
    q.set(`where[0][value][${i}]`, s);
  });

  const r = await espoFetch('GET', `/api/v1/CVehicle?${q.toString()}`, null, dealerConfig);
  if (!r.ok) {
    if (hit) {
      // Serve stale on error rather than nothing.
      return { ok: true, vehicles: hit.vehicles, cached: true, stale: true };
    }
    return { ok: false, error: r.error };
  }

  const vehicles = Array.isArray(r.data?.list) ? r.data.list : [];
  cache.set(dealerId, { ts: now, vehicles });
  return { ok: true, vehicles, cached: false };
}

export function clearInventoryCache(dealerId) {
  if (dealerId) cache.delete(dealerId);
  else cache.clear();
}
