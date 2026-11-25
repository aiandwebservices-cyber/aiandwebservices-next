import type { PiiClass } from "./types.ts";

const SSN_SHAPE = /\b\d{3}[- .]\d{2}[- .]\d{4}\b|\b(?<!\d)\d{9}(?!\d)\b/;
const SSN_WORD = /\b(ssn|social security|s\.s\.n)\b/i;
const DOB_WORD = /\b(dob|date of birth|birth ?date|born on)\b/i;
const DATE = /\b(0?[1-9]|1[0-2])[/.\-](0?[1-9]|[12]\d|3[01])[/.\-](19|20)\d{2}\b/;
const DL_WORD = /\bdriver'?s? ?licen[cs]e|\blicen[cs]e (no|number|#)|\bDL ?#/i;
const POLICY = /\bpolicy ?(no|number|#)|\bclaim ?(no|number|#)/i;
const VIN_WORD = /\bvin\b/i;
const VIN_SHAPE = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
const LOAN = /\bloan ?(no|number|#)|\blicen[cs]e plate/i;
const PAYMENT = /\b(?:\d[ -]?){13,19}\b|\b(cvv|card number|routing|account number|bank account)\b/i;
const HEALTH = /\b(ssn|medical record|diagnos[ie]s|prescription)\b/i;

export const ssnIn = (s: string) => SSN_SHAPE.test(s) || SSN_WORD.test(s);

const CHECKS: [PiiClass, (s: string) => boolean][] = [
  ["ssn", ssnIn],
  ["dob", (s) => DOB_WORD.test(s) || DATE.test(s)],
  ["dl", (s) => DL_WORD.test(s)],
  ["policy_no", (s) => POLICY.test(s)],
  ["vin", (s) => VIN_WORD.test(s) || VIN_SHAPE.test(s)],
  ["loan_no", (s) => LOAN.test(s)],
  ["payment", (s) => PAYMENT.test(s)],
  ["health", (s) => HEALTH.test(s) && !ssnIn(s)],
];

export function piiIn(s: string, forbid: PiiClass[], { allowDates = false } = {}): PiiClass | null {
  for (const [cls, fn] of CHECKS) {
    if (!forbid.includes(cls)) continue;
    if (allowDates && cls === "dob") continue;
    if (fn(s)) return cls;
  }
  return null;
}

export function scanObject(o: unknown, forbid: PiiClass[], skipKeys: string[] = []): PiiClass | null {
  if (o == null) return null;
  if (typeof o === "string") return piiIn(o, forbid);
  if (Array.isArray(o)) {
    for (const v of o) { const hit = scanObject(v, forbid, skipKeys); if (hit) return hit; }
    return null;
  }
  if (typeof o === "object") {
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (skipKeys.includes(k)) continue;
      const hit = scanObject(v, forbid, skipKeys);
      if (hit) return hit;
    }
  }
  return null;
}

export const cleanText = (v: unknown, max: number) =>
  (typeof v === "string" ? v.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/https?:\/\/\S+/gi, "[link removed]").replace(/\s+/g, " ").trim().slice(0, max) : "");

export const phoneDigits = (v: unknown) => {
  if (typeof v !== "string") return "";
  return v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
};

export const formatUsPhone = (d: string) => `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
