import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * This site has no durable store for agent requests (no Redis, KV, or table).
 * Confirm tokens and idempotency receipts are HMAC-signed and carry their own
 * expiry or payload, so they survive a new serverless isolate.
 *
 * The daily cap is a per-isolate counter. A new isolate does not see earlier
 * counts. Set AIW_AGENT_REQUESTS=off to stop intake. AIW_AGENT_DAILY_CAP
 * defaults to 30.
 *
 * Idempotent replays send Idempotency-Key plus the Idempotency-Receipt from
 * the first response. The receipt is an HMAC of the result. Without the
 * receipt, a different isolate cannot prove the first submit already ran.
 */

export type Limit = { windowMs: number; max: number };

export function siteDayMax(env: Record<string, string | undefined>): number {
  const raw = env.AIW_AGENT_DAILY_CAP;
  if (raw == null || raw.trim() === '') return 30;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 30;
}

export function requestsOn(env: Record<string, string | undefined>): boolean {
  return (env.AIW_AGENT_REQUESTS ?? 'on').trim().toLowerCase() !== 'off';
}

export const AGENT_LIMITS = {
  ipHour: { windowMs: 60 * 60_000, max: 5 },
  agentHour: { windowMs: 60 * 60_000, max: 20 },
  previewIpHour: { windowMs: 60 * 60_000, max: 30 },
};

function mac(secret: string, msg: string): string {
  if (secret) return createHmac('sha256', secret).update(msg).digest('base64url');
  return createHash('sha256').update(msg).digest('base64url');
}

function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}

export function sealReceipt(secret: string, key: string, body: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify(body)).toString('base64url');
  const sig = mac(secret, `${key}.${payload}`);
  return `r2.${payload}.${sig}`;
}

export function openReceipt(secret: string, key: string, receipt: string): Record<string, unknown> | null {
  const parts = receipt.split('.');
  if (parts.length !== 3 || parts[0] !== 'r2') return null;
  if (!safeEq(parts[2], mac(secret, `${key}.${parts[1]}`))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

const localHits = new Map<string, { n: number; reset: number }>();

/** Per-isolate counter. Not shared across serverless instances. */
export async function memoryRateHit(key: string, limit: Limit, now = Date.now()): Promise<boolean> {
  const row = localHits.get(key);
  if (!row || row.reset < now) {
    localHits.set(key, { n: 1, reset: now + limit.windowMs });
    return true;
  }
  row.n += 1;
  return row.n <= limit.max;
}
