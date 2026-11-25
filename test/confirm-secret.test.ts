import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { expect } from './expect.ts';
import { checkConfirmToken } from '../packages/agent-actions/src/index.ts';
import { checkInquiry, previewInquiry, submitInquiry, type Deps } from '../lib/agent/inquiry.ts';

const ROOTS = ['lib/agent', 'app/api/agent', 'app/api/mcp', 'app/mcp', 'app/forms', 'packages/agent-actions/src'];
const CALL = /\b(makeConfirmToken|checkConfirmToken|sealReceipt|openReceipt)\s*\(([^;]*?)\)/g;

function walk(dir: string): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(name)) out.push(full);
  }
  return out;
}

function callsPassingSecret() {
  const hits: { file: string; name: string; args: string; ok: boolean }[] = [];
  for (const root of ROOTS) {
    for (const file of walk(path.resolve(root))) {
      const src = readFileSync(file, 'utf8');
      for (const match of src.matchAll(CALL)) {
        const name = match[1];
        const args = match[2].replace(/\s+/g, ' ').trim();
        const before = src.slice(Math.max(0, (match.index ?? 0) - 24), match.index ?? 0);
        if (/function\s*$/.test(before)) continue;
        const parts = args.split(',').map((p) => p.trim()).filter(Boolean);
        const needed = name === 'makeConfirmToken' ? 2 : name === 'checkConfirmToken' ? 3 : 2;
        const secretArg = parts.find((p) => /secret/i.test(p));
        const ok = parts.length >= needed && !!secretArg && !/^['"`]/.test(secretArg) && !/^\d/.test(secretArg);
        hits.push({ file: path.relative(process.cwd(), file), name, args, ok });
      }
    }
  }
  return hits;
}

describe('confirm tokens pass the secret at every mint and check', () => {
  it('every makeConfirmToken and checkConfirmToken call passes the secret', () => {
    const hits = callsPassingSecret();
    expect(hits.length).toBeGreaterThan(0);
    const bad = hits.filter((h) => !h.ok);
    expect(bad).toEqual([]);
  });

  it('a preview token does not verify with the empty-string fallback', async () => {
    const secret = 'unit-test-confirm-secret';
    const sent: unknown[] = [];
    const d: Deps = {
      rateHit: async () => true,
      send: async (m) => { sent.push(m); },
      to: 'contact-path',
      env: {},
      log: () => {},
      confirmSecret: secret,
      idempotencyGet: async () => null,
      idempotencySet: async () => {},
    };
    const body = {
      first_name: 'Agent', last_name: 'Test', phone: '315-555-0142', email: 'test@example.com',
      service: 'Not sure yet (let\'s explore)', message: 'Hello.', consent_to_contact: true as const,
    };
    const request = new Request('https://www.aiandwebservices.com/api/agent/v1/inquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const p = await previewInquiry(body, request, d);
    const token = (p.body as { confirm_token: string }).confirm_token;
    const value = (checkInquiry(body) as { ok: true; value: object }).value;
    expect(checkConfirmToken(value, token, '')).toBe('mismatch');
    expect(checkConfirmToken(value, token, secret)).toBe('ok');
    const s = await submitInquiry({ ...body, confirm_token: token, user_confirmed: true }, request, d);
    expect(s.status).toBe(200);
    expect(sent).toHaveLength(0);
  });
});
