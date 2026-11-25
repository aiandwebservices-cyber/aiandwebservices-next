import { describe, it } from 'node:test';
import { expect } from './expect.ts';
import { isTestEmail, isTestIdentity, isTestPhone, NotifyBlocked, notify } from '../packages/agent-actions/src/index.ts';
import type { Ctx } from '../packages/agent-actions/src/types.ts';
import { checkInquiry, previewInquiry, submitInquiry, type Deps } from '../lib/agent/inquiry.ts';
import { handleMcp, toolList } from '../lib/agent/mcp.ts';
import { getContactChannels, getMeetingLink, getService, listServices } from '../lib/agent/facts.ts';
import { openapiDocument } from '../lib/agent/openapi.ts';
import { llmsText } from '../lib/agent/llms.ts';
import { discoveryDocs } from '../lib/agent/discovery.ts';
import { postContactForm, postContactConfirm } from '../lib/agent/forms.ts';
import { siteDayMax } from '../lib/agent/limits.ts';
import { notifyContactLead } from '../lib/contact-submit.ts';

const testId = {
  first_name: 'Agent',
  last_name: 'Test',
  phone: '315-555-0142',
  email: 'test@example.com',
  service: 'Not sure yet (let\'s explore)',
  message: 'Looking for a website and an AI assistant.',
  consent_to_contact: true,
};

const realId = {
  first_name: 'Pat',
  last_name: 'Example',
  phone: '315-555-2345',
  email: 'pat@mail.invalid',
  service: 'SEO (rankings, traffic, visibility)',
  message: 'We need local search help.',
  consent_to_contact: true,
};

const req = (body?: unknown, headers: Record<string, string> = {}) =>
  new Request('https://www.aiandwebservices.com/api/agent/v1/inquiries', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'vitest', 'x-forwarded-for': '203.0.113.9', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

function deps(over: Partial<Deps> = {}) {
  const sent: { lead?: Record<string, unknown> }[] = [];
  const logs: string[] = [];
  const hits = new Map<string, number>();
  const store = new Map<string, { status: number; body: Record<string, unknown> }>();
  const d: Deps = {
    rateHit: async (key, lim) => { const n = (hits.get(key) ?? 0) + 1; hits.set(key, n); return n <= lim.max; },
    send: async (m) => { sent.push(m as { lead?: Record<string, unknown> }); },
    to: 'contact-path',
    env: {},
    log: (l) => logs.push(l),
    confirmSecret: '',
    idempotencyGet: async (k) => store.get(k) ?? null,
    idempotencySet: async (k, v) => { store.set(k, v); },
    ...over,
  };
  return { d, sent, logs, hits, store };
}

describe('test mode identity', () => {
  it('flags 555-01xx phones and example.com emails', () => {
    expect(isTestPhone('315-555-0142')).toBe(true);
    expect(isTestPhone('315-555-2345')).toBe(false);
    expect(isTestEmail('test@example.com')).toBe(true);
    expect(isTestIdentity({ phone: '3155550142', email: 'test@example.com' })).toBe(true);
    expect(isTestIdentity({ phone: '315-555-2345', email: 'pat@mail.invalid' })).toBe(false);
  });

  it('notify is a no-op for test and hard-fails a preview send', async () => {
    const sent: unknown[] = [];
    const ctx: Ctx = {
      req: new Request('https://www.aiandwebservices.com/'),
      env: {},
      ip: '203.0.113.9',
      agent: 'vitest',
      rateHit: async () => true,
      send: async (m) => { sent.push(m); },
      to: 'x@y.z',
      log: () => {},
      vercelEnv: undefined,
    };
    expect(await notify(ctx, { to: 'x@y.z', subject: 't', html: '', text: '' }, { test: true })).toBe('sunk');
    expect(sent).toHaveLength(0);
    await expect(notify({ ...ctx, env: { VERCEL_ENV: 'preview' }, vercelEnv: 'preview' }, { to: 'x@y.z', subject: 't', html: '', text: '' }, { test: false }))
      .rejects.toBeInstanceOf(NotifyBlocked);
  });
});

describe('test-mode submit uses the sink only', () => {
  it('an inquiry with the reserved test identity never notifies and returns test:true', async () => {
    const { d, sent, logs } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const p = await previewInquiry(testId, req(testId), d);
    expect(p.status).toBe(200);
    const s = await submitInquiry({ ...testId, confirm_token: (p.body as { confirm_token: string }).confirm_token, user_confirmed: true }, req(testId), d);
    expect(s.status).toBe(200);
    expect((s.body as { test?: boolean }).test).toBe(true);
    expect(sent).toHaveLength(0);
    const audit = logs.map((l) => JSON.parse(l));
    expect(audit.some((a) => a.test === true && a.result === 'sent')).toBe(true);
    expect(JSON.stringify(audit)).not.toMatch(/555-0142|test@example.com/);
  });
});

describe('confirm and idempotency', () => {
  it('submit without a confirm token is rejected and does not notify', async () => {
    const { d, sent } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const r = await submitInquiry({ ...realId, user_confirmed: true }, req(realId), d);
    expect(r.status).toBeGreaterThanOrEqual(400);
    expect(sent).toHaveLength(0);
  });

  it('a confirm mismatch returns 409', async () => {
    const { d } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const p = await previewInquiry(realId, req(realId), d);
    const r = await submitInquiry({ ...realId, message: 'A different message.', confirm_token: (p.body as { confirm_token: string }).confirm_token, user_confirmed: true }, req(realId), d);
    expect(r.status).toBe(409);
  });

  it('Idempotency-Key replay returns the same ref and does not notify again', async () => {
    const { d, sent } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const p = await previewInquiry(realId, req(realId), d);
    const payload = { ...realId, confirm_token: (p.body as { confirm_token: string }).confirm_token, user_confirmed: true };
    const a = await submitInquiry(payload, req(payload, { 'idempotency-key': 'k-inq-1' }), d);
    const b = await submitInquiry(payload, req(payload, { 'idempotency-key': 'k-inq-1' }), d);
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect((b.body as { ref: string }).ref).toBe((a.body as { ref: string }).ref);
    expect(sent).toHaveLength(1);
  });

  it('a signed stateless receipt replays on an empty store without notifying again', async () => {
    const secret = 'unit-test-confirm-secret';
    const first = deps({ confirmSecret: secret });
    const p = await previewInquiry(realId, req(realId), first.d);
    const payload = { ...realId, confirm_token: (p.body as { confirm_token: string }).confirm_token, user_confirmed: true };
    const a = await submitInquiry(payload, req(payload, { 'idempotency-key': 'k-stateless' }), first.d);
    expect(a.status).toBe(200);
    const receipt = (a.body as { idempotency_receipt?: string }).idempotency_receipt;
    expect(receipt).toBeTruthy();
    const second = deps({ confirmSecret: secret });
    const b = await submitInquiry(payload, req(payload, { 'idempotency-key': 'k-stateless', 'idempotency-receipt': receipt! }), second.d);
    expect((b.body as { ref: string }).ref).toBe((a.body as { ref: string }).ref);
    expect(second.sent).toHaveLength(0);
  });
});

describe('422 validation', () => {
  it('rejects a missing consent, a bad phone, and an SSN in the message', () => {
    const noConsent = checkInquiry({ ...realId, consent_to_contact: false });
    expect(noConsent.ok).toBe(false);
    if (!noConsent.ok) expect(noConsent.status).toBe(422);

    const badPhone = checkInquiry({ ...realId, phone: '123' });
    expect(badPhone.ok).toBe(false);
    if (!badPhone.ok) expect(badPhone.status).toBe(422);

    const ssn = checkInquiry({ ...realId, message: 'My SSN is 123-45-6789' });
    expect(ssn.ok).toBe(false);
    if (!ssn.ok) expect(ssn.status).toBe(422);
    expect(JSON.stringify(ssn)).not.toMatch(/123-45-6789/);
  });
});

describe('owner notification uses the contact path', () => {
  it('notifyContactLead posts to HubSpot and CONTACT_WEBHOOK_URL and not an email API', async () => {
    const calls: string[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL) => {
      calls.push(String(url));
      return new Response('{}', { status: 201 });
    }) as typeof fetch;
    try {
      await notifyContactLead({
        first_name: 'Pat',
        last_name: 'Example',
        email: 'pat@mail.invalid',
        phone: '315-555-2345',
        message: 'Hello',
        service: 'SEO (rankings, traffic, visibility)',
      }, { HUBSPOT_TOKEN: 'test-token', CONTACT_WEBHOOK_URL: 'https://example.test/hook' } as unknown as NodeJS.ProcessEnv);
    } finally {
      globalThis.fetch = original;
    }
    expect(calls).toContain('https://api.hubapi.com/crm/v3/objects/contacts');
    expect(calls).toContain('https://example.test/hook');
    expect(calls.some((u) => /resend|mailgun|postmark|sendgrid/i.test(u))).toBe(false);
  });

  it('a non-test submit notifies once through send', async () => {
    const { d, sent } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const p = await previewInquiry(realId, req(realId), d);
    const s = await submitInquiry({ ...realId, confirm_token: (p.body as { confirm_token: string }).confirm_token, user_confirmed: true }, req(realId), d);
    expect(s.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].lead?.email).toBe('pat@mail.invalid');
    expect((s.body as { test?: boolean }).test).toBeUndefined();
  });
});

describe('agent surfaces', () => {
  it('lists the seven services and a meeting link from the published Cal path', () => {
    const slugs = listServices().services.map((s) => s.slug).sort();
    expect(slugs).toEqual(['add-ons', 'ai-automation-starter', 'ai-first', 'consulting', 'growth', 'presence', 'revenue-engine']);
    expect(getService('missing')).toMatchObject({ error: 'not_found' });
    const meeting = getMeetingLink();
    expect(meeting.url).toBe('https://cal.com/aiandwebservices/30min');
    expect(meeting.cal_link).toBe('aiandwebservices/30min');
  });

  it('advertises tools, skills, prompts, openapi, discovery, and llms.txt', async () => {
    const { d } = deps();
    const rpc = async (method: string, params: Record<string, unknown> = {}) => {
      const r = await handleMcp(new Request('https://www.aiandwebservices.com/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      }), d);
      return { status: r.status, body: await r.json() as { result: { tools?: { name: string; annotations: { readOnlyHint: boolean; destructiveHint: boolean; openWorldHint: boolean } }[]; skills?: unknown[]; prompts?: unknown[] } } };
    };
    const tools = await rpc('tools/list');
    const names = (tools.body.result.tools ?? []).map((t) => t.name);
    for (const n of ['list_services', 'get_service', 'get_comparison', 'get_pricing', 'get_offers', 'get_product', 'get_guarantee', 'search_faq', 'get_contact_channels', 'get_meeting_link', 'preview_inquiry', 'submit_inquiry']) {
      expect(names, n).toContain(n);
    }
    const submit = tools.body.result.tools?.find((t) => t.name === 'submit_inquiry');
    expect(submit?.annotations.readOnlyHint).toBe(false);
    expect(submit?.annotations.destructiveHint).toBe(false);
    expect(submit?.annotations.openWorldHint).toBe(true);
    expect((await rpc('skills/list')).body.result.skills?.length).toBeGreaterThan(0);
    expect((await rpc('prompts/list')).body.result.prompts?.length).toBeGreaterThan(0);
    expect(toolList().map((t) => t.name)).toEqual(names);
    const spec = openapiDocument();
    expect(spec.paths['/api/agent/v1/services']).toBeTruthy();
    expect(spec.paths['/api/agent/v1/inquiries']).toBeTruthy();
    expect(llmsText()).toMatch(/aiandwebservices\.com/);
    expect(llmsText()).toMatch(/\/mcp/);
    const docs = discoveryDocs();
    expect(docs['mcp.json'].url).toBe('https://www.aiandwebservices.com/mcp');
    expect(getContactChannels().email).toBe('david@aiandwebservices.com');
    expect(getContactChannels().phone_display).toBe('(315) 572-0710');
  });
});

describe('switches', () => {
  it('reads the daily cap from AIW_AGENT_DAILY_CAP and defaults to 30', () => {
    expect(siteDayMax({})).toBe(30);
    expect(siteDayMax({ AIW_AGENT_DAILY_CAP: '7' })).toBe(7);
  });

  it('AIW_AGENT_REQUESTS=off pauses preview and submit', async () => {
    const { d, sent } = deps({ env: { AIW_AGENT_REQUESTS: 'off' }, confirmSecret: 'unit-test-confirm-secret' });
    const p = await previewInquiry(testId, req(testId), d);
    expect(p.status).toBe(503);
    const s = await submitInquiry({ ...testId, user_confirmed: true }, req(testId), d);
    expect(s.status).toBe(503);
    expect(sent).toHaveLength(0);
  });
});

describe('no-JS contact form', () => {
  it('PRG confirm with the test identity does not notify', async () => {
    const { d, sent } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const body = new URLSearchParams({
      first_name: 'Agent',
      last_name: 'Test',
      email: 'test@example.com',
      phone: '315-555-0142',
      service: 'Not sure yet (let\'s explore)',
      message: 'Hello from the form.',
      consent_to_contact: 'true',
    });
    const posted = await postContactForm(new Request('https://www.aiandwebservices.com/forms/contact', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body }), d);
    expect(posted.status).toBe(303);
    const cookie = posted.headers.get('set-cookie') ?? '';
    expect(posted.headers.get('location')).toBe('/forms/contact/confirm');
    const confirmed = await postContactConfirm(new Request('https://www.aiandwebservices.com/forms/contact/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie },
      body: new URLSearchParams({ user_confirmed: 'true' }),
    }), d);
    expect(confirmed.status).toBe(303);
    expect(confirmed.headers.get('location')).toMatch(/^\/forms\/contact\/thanks\?ref=/);
    expect(sent).toHaveLength(0);
  });

  it('returns 422 when required fields are missing', async () => {
    const { d } = deps({ confirmSecret: 'unit-test-confirm-secret' });
    const posted = await postContactForm(new Request('https://www.aiandwebservices.com/forms/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ first_name: 'Agent' }),
    }), d);
    expect(posted.status).toBe(422);
  });
});
