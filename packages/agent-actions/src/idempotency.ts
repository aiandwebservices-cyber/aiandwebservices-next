import type { IdempotencyStore, Out } from "./types.ts";

export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60_000;

export function memoryIdempotency(): IdempotencyStore {
  const map = new Map<string, { exp: number; value: Out }>();
  return {
    async get(key) {
      const row = map.get(key);
      if (!row) return null;
      if (row.exp < Date.now()) { map.delete(key); return null; }
      return row.value;
    },
    async set(key, value, ttlMs) {
      map.set(key, { exp: Date.now() + ttlMs, value });
    },
  };
}

export function idempotencyKeyFrom(req: Request, meta?: Record<string, unknown>): string | null {
  const h = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key");
  if (h && h.trim()) return h.trim().slice(0, 200);
  const m = meta && typeof meta["idempotency-key"] === "string" ? String(meta["idempotency-key"]).trim() : "";
  return m ? m.slice(0, 200) : null;
}
