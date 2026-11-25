import { notifyContactLead } from '../contact-submit.ts';
import { memoryRateHit, openReceipt } from './limits.ts';
import type { Deps, Json, Out } from './inquiry.ts';

const memory = new Map<string, { exp: number; value: Out }>();
const DAY = 24 * 60 * 60_000;

/**
 * Production wiring. Notify goes through notifyContactLead (HubSpot + CONTACT_WEBHOOK_URL).
 * Idempotency is a signed receipt plus a same-isolate cache. See limits.ts.
 */
export function liveDeps(req: Request): Deps {
  const secret = process.env.AIW_AGENT_CONFIRM_SECRET ?? '';
  return {
    rateHit: (key, limit) => memoryRateHit(key, limit),
    send: async (mail) => {
      const lead = (mail.lead ?? {}) as Json;
      await notifyContactLead({
        first_name: String(lead.first_name ?? ''),
        last_name: String(lead.last_name ?? ''),
        email: String(lead.email ?? ''),
        phone: String(lead.phone ?? ''),
        message: String(lead.message ?? ''),
        service: String(lead.service ?? ''),
      });
    },
    to: 'contact-path',
    env: process.env,
    log: (line) => console.log(line),
    confirmSecret: secret,
    idempotencyGet: async (key) => {
      const row = memory.get(key);
      if (row && row.exp > Date.now()) return row.value;
      const receipt = req.headers.get('idempotency-receipt') || req.headers.get('Idempotency-Receipt');
      if (!receipt) return null;
      const body = openReceipt(secret, key, receipt);
      return body ? { status: 200, body } : null;
    },
    idempotencySet: async (key, value) => {
      memory.set(key, { exp: Date.now() + DAY, value });
    },
  };
}
