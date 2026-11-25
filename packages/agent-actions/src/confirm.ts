import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import type { Json } from "./types.ts";

export const TOKEN_TTL_MS = 30 * 60_000;

export function canonical(v: object): string {
  const keys = Object.keys(v as Json).sort();
  return JSON.stringify(keys.map((k) => [k, (v as Json)[k]]));
}

function mac(secret: string, msg: string): string {
  if (secret) return createHmac("sha256", secret).update(msg).digest("base64url").slice(0, 32);
  return createHash("sha256").update(msg).digest("base64url").slice(0, 32);
}

function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}

// c2.{exp}.{mac} — 30-minute token bound to the canonical input.
export function makeConfirmToken(v: object, secret = "", now = Date.now()): string {
  const exp = Math.floor((now + TOKEN_TTL_MS) / 1000);
  const sig = mac(secret, `${exp}:${canonical(v)}`);
  return `c2.${exp}.${sig}`;
}

export function checkConfirmToken(v: object, token: unknown, secret = "", now = Date.now()): "ok" | "mismatch" | "expired" {
  if (typeof token !== "string" || !token.startsWith("c2.")) return "mismatch";
  const parts = token.split(".");
  if (parts.length !== 3) return "mismatch";
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp)) return "mismatch";
  if (exp * 1000 < now) return "expired";
  const expect = mac(secret, `${exp}:${canonical(v)}`);
  return safeEq(parts[2], expect) ? "ok" : "mismatch";
}
