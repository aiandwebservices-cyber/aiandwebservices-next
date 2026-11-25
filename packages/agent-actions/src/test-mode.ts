import { createHmac } from "node:crypto";
import { phoneDigits } from "./pii.ts";

const TEST_DOMAINS = /@(example\.com|example\.org)$/i;
const TEST_DOT_TEST = /@[^@]+\.test$/i;
const TEST_PHONE = /(?:^|1)?\d{3}55501\d{2}$/;

export function isTestPhone(phone: unknown): boolean {
  const d = phoneDigits(phone);
  return d.length === 10 && TEST_PHONE.test(d);
}

export function isTestEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const e = email.trim();
  return TEST_DOMAINS.test(e) || TEST_DOT_TEST.test(e);
}

export function isTestIdentity(input: { phone?: unknown; email?: unknown; first_name?: unknown; name?: unknown }): boolean {
  return isTestPhone(input.phone) || isTestEmail(input.email);
}

export function agentTestMac(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function isSignedTest(req: Request, rawBody: string, secret?: string): boolean {
  if (!secret) return false;
  const sent = req.headers.get("agent-test") || req.headers.get("Agent-Test");
  if (!sent) return false;
  const expect = agentTestMac(rawBody, secret);
  return sent.length === expect.length && sent.toLowerCase() === expect;
}

export function isTestRequest(req: Request, input: { phone?: unknown; email?: unknown }, rawBody = "", secret?: string): boolean {
  return isTestIdentity(input) || isSignedTest(req, rawBody, secret);
}

export function isPreviewEnv(env: Record<string, string | undefined> = {}): boolean {
  return (env.VERCEL_ENV ?? "").trim().toLowerCase() === "preview";
}
