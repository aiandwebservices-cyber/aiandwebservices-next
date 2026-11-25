import { createHmac, randomBytes } from 'node:crypto';
import { audit as writeAudit } from '../../packages/agent-actions/src/audit.ts';
import { checkConfirmToken, makeConfirmToken } from '../../packages/agent-actions/src/confirm.ts';
import { idempotencyKeyFrom } from '../../packages/agent-actions/src/idempotency.ts';
import { notify, NotifyBlocked } from '../../packages/agent-actions/src/notify.ts';
import { cleanText, phoneDigits, scanObject } from '../../packages/agent-actions/src/pii.ts';
import { isTestIdentity } from '../../packages/agent-actions/src/test-mode.ts';
import { CONTACT_SERVICE_OPTIONS, type ContactServiceOption } from '../contact-channels.ts';
import { AGENT_LIMITS, openReceipt, requestsOn, sealReceipt, siteDayMax, type Limit } from './limits.ts';

export type Json = Record<string, unknown>;
export type Out = { status: number; body: Json };
export type LimitSpec = Limit;

export type Inquiry = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: ContactServiceOption;
  message: string;
  consent_to_contact: true;
};

export type Deps = {
  rateHit: (key: string, limit: Limit) => Promise<boolean>;
  send: (m: { to: string; subject: string; html: string; text: string; lead?: Json }) => Promise<void>;
  to: string;
  env: Record<string, string | undefined>;
  log: (line: string) => void;
  confirmSecret?: string;
  idempotencyGet?: (key: string) => Promise<Out | null>;
  idempotencySet?: (key: string, value: Out) => Promise<void>;
};

const ALLOWED = ['first_name', 'last_name', 'email', 'phone', 'service', 'message', 'consent_to_contact'];
const SUBMIT_ONLY = ['confirm_token', 'user_confirmed'];

export type Checked = { ok: true; value: Inquiry } | { ok: false; status: number; error: string; message: string };

const fail = (status: number, error: string, message: string): Out => ({ status, body: { error, message } });

function secretOf(deps: Deps): string {
  return deps.confirmSecret ?? '';
}

export function checkInquiry(input: unknown, { submit = false } = {}): Checked {
  const bad = (error: string, message: string, status = 422): Checked => ({ ok: false, status, error, message });
  if (!input || typeof input !== 'object' || Array.isArray(input)) return bad('bad_request', 'Send a JSON object.', 400);
  const o = input as Json;
  const allowed = new Set(submit ? [...ALLOWED, ...SUBMIT_ONLY] : ALLOWED);
  const extra = Object.keys(o).filter((key) => !allowed.has(key));
  if (extra.length) return bad('field_not_allowed', `Fields not accepted: ${extra.slice(0, 5).join(', ')}.`);
  for (const key of ['first_name', 'last_name', 'message']) {
    if (typeof o[key] === 'string' && scanObject(o[key], ['ssn', 'payment', 'dl', 'dob', 'health'])) {
      return bad('personal_data_refused', 'Do not send a Social Security number, payment details, a driver\'s license number, or a date of birth.');
    }
  }
  const first_name = cleanText(o.first_name, 40);
  const last_name = cleanText(o.last_name, 40);
  if (!first_name || !last_name) return bad('contact_needed', 'First name and last name are required.');
  if (!/^[\p{L}][\p{L}' .-]{0,39}$/u.test(first_name) || !/^[\p{L}][\p{L}' .-]{0,39}$/u.test(last_name)) {
    return bad('bad_request', 'Names must be letters.', 400);
  }
  const digits = phoneDigits(o.phone);
  if (!digits) return bad('contact_needed', 'A phone number is required.');
  if (digits.length !== 10) return bad('bad_request', 'phone must be a 10-digit US number.', 422);
  const email = cleanText(o.email, 120).toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return bad('bad_request', 'email is not valid.', 422);
  const service = typeof o.service === 'string' ? o.service : '';
  if (!(CONTACT_SERVICE_OPTIONS as readonly string[]).includes(service)) {
    return bad('bad_request', 'service must be one of the contact form choices.', 422);
  }
  const message = cleanText(o.message, 2000);
  if (!message) return bad('contact_needed', 'A message is required.');
  if (o.consent_to_contact !== true && o.consent_to_contact !== 'true') {
    return bad('consent_needed', 'The person must agree to be contacted. Send consent_to_contact: true.');
  }
  return {
    ok: true,
    value: {
      first_name,
      last_name,
      email,
      phone: `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`,
      service: service as ContactServiceOption,
      message,
      consent_to_contact: true,
    },
  };
}

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
}

function agentName(req: Request): string {
  const ua = req.headers.get('user-agent') ?? '';
  const known = /ChatGPT|OpenAI|GPTBot|Claude|Anthropic|Perplexity|Gemini|Google|Copilot|curl|vitest/i.exec(ua);
  return (known?.[0] ?? (ua ? 'other' : 'none')).slice(0, 20);
}

function refFor(secret: string, idem: string | null): string {
  if (!idem) return `inq-${randomBytes(6).toString('hex')}`;
  return `inq-${createHmac('sha256', secret || 'stateless').update(idem).digest('hex').slice(0, 12)}`;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function previewOf(value: Inquiry, secret: string): Json {
  const summary = [
    { label: 'First name', value: value.first_name },
    { label: 'Last name', value: value.last_name },
    { label: 'Email', value: value.email },
    { label: 'Phone', value: value.phone },
    { label: 'Interest', value: value.service },
    { label: 'Message', value: value.message },
  ];
  return {
    preview: Object.fromEntries(summary.map((row) => [row.label, row.value])),
    summary,
    message: 'Show this summary to the person. After they agree, submit the same details with confirm_token and user_confirmed: true. David reviews inquiries within 6 hours.',
    confirm_token: makeConfirmToken(value, secret),
    missing_required: [],
  };
}

export async function previewInquiry(input: unknown, req: Request, deps: Deps): Promise<Out> {
  const secret = secretOf(deps);
  const ip = clientIp(req);
  const agent = agentName(req);
  if (!requestsOn(deps.env)) {
    writeAudit(deps, { route: 'preview', result: 'paused', agent, ip });
    return fail(503, 'paused', 'Agent inquiries are paused.');
  }
  try {
    if (!(await deps.rateHit(`agent-prev-ip:${ip}`, AGENT_LIMITS.previewIpHour))) {
      writeAudit(deps, { route: 'preview', result: 'rate_limited', agent, ip });
      return fail(429, 'rate_limited', 'Too many preview requests. Try again later.');
    }
  } catch {
    return fail(503, 'unavailable', 'Inquiry preview is temporarily unavailable.');
  }
  const checked = checkInquiry(input);
  writeAudit(deps, { route: 'preview', result: checked.ok ? 'ok' : checked.error, agent, ip });
  if (!checked.ok) return fail(checked.status, checked.error, checked.message);
  return { status: 200, body: previewOf(checked.value, secret) };
}

export async function submitInquiry(input: unknown, req: Request, deps: Deps): Promise<Out> {
  const secret = secretOf(deps);
  const ip = clientIp(req);
  const agent = agentName(req);
  const done = (out: Out, result: string) => {
    writeAudit(deps, { route: 'submit', result, agent, ip, test: Boolean(out.body.test) });
    return out;
  };
  if (!requestsOn(deps.env)) return done(fail(503, 'paused', 'Agent inquiries are paused.'), 'paused');
  const checked = checkInquiry(input, { submit: true });
  if (!checked.ok) return done(fail(checked.status, checked.error, checked.message), checked.error);
  const raw = input as Json;
  if (raw.user_confirmed !== true && raw.user_confirmed !== 'true') {
    return done(fail(400, 'not_confirmed', 'Show the preview to the person first. Send user_confirmed: true only after they agree.'), 'not_confirmed');
  }
  const tokenState = checkConfirmToken(checked.value, raw.confirm_token, secret);
  if (tokenState === 'expired') return done(fail(409, 'confirm_expired', 'This preview has expired. Preview the inquiry again.'), 'confirm_expired');
  if (tokenState !== 'ok') return done(fail(409, 'confirm_mismatch', 'These details differ from the preview. Preview the inquiry again.'), 'confirm_mismatch');

  const idem = idempotencyKeyFrom(req);
  const idemKey = idem ? `inquiry:${idem}` : null;
  if (idemKey && deps.idempotencyGet) {
    const prev = await deps.idempotencyGet(idemKey);
    if (prev) return done(prev, 'idempotent');
  }
  if (idemKey) {
    const receipt = req.headers.get('idempotency-receipt') || req.headers.get('Idempotency-Receipt');
    if (receipt) {
      const opened = openReceipt(secret, idemKey, receipt);
      if (opened) return done({ status: 200, body: opened }, 'idempotent');
    }
  }

  const value = checked.value;
  const test = isTestIdentity(value);
  try {
    const siteDay: Limit = { windowMs: 24 * 60 * 60_000, max: siteDayMax(deps.env) };
    const allowed = (await deps.rateHit(`agent-ip:${ip}`, AGENT_LIMITS.ipHour))
      && (await deps.rateHit(`agent-id:${agent}`, AGENT_LIMITS.agentHour))
      && (await deps.rateHit('agent-site', siteDay));
    if (!allowed) return done(fail(429, 'rate_limited', 'The daily inquiry limit has been reached.'), 'rate_limited');
  } catch {
    return done(fail(503, 'unavailable', 'Inquiry submit is temporarily unavailable.'), 'unavailable');
  }

  const ref = refFor(secret, idem);
  const body: Json = {
    ok: true,
    ref,
    message: 'Inquiry received. David reviews it within 6 hours.',
    ...(test ? { test: true } : {}),
  };
  if (idemKey) body.idempotency_receipt = sealReceipt(secret, idemKey, { ...body });
  const lead = {
    first_name: value.first_name,
    last_name: value.last_name,
    email: value.email,
    phone: value.phone,
    service: value.service,
    message: value.message,
  };
  const text = [
    'Inquiry sent by an AI agent. Details are as the agent sent them and are not verified.',
    `Name: ${value.first_name} ${value.last_name}`,
    `Email: ${value.email}`,
    `Phone: ${value.phone}`,
    `Interest: ${value.service}`,
    `Message: ${value.message}`,
    `Ref: ${ref}`,
  ].join('\n');
  try {
    await notify({
      req,
      env: deps.env,
      ip,
      agent,
      rateHit: deps.rateHit,
      send: deps.send,
      to: deps.to,
      log: deps.log,
      confirmSecret: secret,
      vercelEnv: deps.env.VERCEL_ENV,
    }, {
      to: deps.to,
      subject: `AI-agent inquiry: ${value.service} (${value.first_name})`,
      text,
      html: `<p>${esc(text).replace(/\n/g, '<br>')}</p>`,
      lead,
    }, { test });
  } catch (err) {
    if (err instanceof NotifyBlocked) return done(fail(503, 'unavailable', 'Inquiry submit is temporarily unavailable.'), 'notify_blocked');
    return done(fail(503, 'unavailable', 'Inquiry submit is temporarily unavailable.'), 'send_failed');
  }
  const out: Out = { status: 200, body };
  if (idemKey && deps.idempotencySet) await deps.idempotencySet(idemKey, out);
  return done(out, 'sent');
}
