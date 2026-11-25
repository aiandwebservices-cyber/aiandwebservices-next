import { makeConfirmToken } from '../../packages/agent-actions/src/confirm.ts';
import { CONTACT_SERVICE_OPTIONS } from '../contact-channels.ts';
import { checkInquiry, submitInquiry, type Deps } from './inquiry.ts';
import { openReceipt, sealReceipt } from './limits.ts';

const COOKIE = 'aiw_inquiry';

function secretOf(deps: Deps): string {
  return deps.confirmSecret ?? '';
}

function readCookie(req: Request): string | null {
  const raw = req.headers.get('cookie') ?? '';
  const match = raw.match(/(?:^|;\s*)aiw_inquiry=([^;]+)/);
  if (!match) return null;
  try { return decodeURIComponent(match[1]); } catch { return match[1]; }
}

function formHtml(message = ''): string {
  const options = CONTACT_SERVICE_OPTIONS.map((option) => `<option>${escapeHtml(option)}</option>`).join('');
  const err = message ? `<p role="alert">${escapeHtml(message)}</p>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Contact</title></head><body>
<main>
<h1>Contact AIandWEBservices</h1>
${err}
<form method="post" action="/forms/contact">
<p><label>First name <input name="first_name" required></label></p>
<p><label>Last name <input name="last_name" required></label></p>
<p><label>Email <input name="email" type="email" required></label></p>
<p><label>Phone <input name="phone" required></label></p>
<p><label>What interests you most? <select name="service" required><option value="">Select one...</option>${options}</select></label></p>
<p><label>Your biggest challenge <textarea name="message" required></textarea></label></p>
<p><label><input type="checkbox" name="consent_to_contact" value="true" required> You may contact me about this inquiry.</label></p>
<button type="submit">Review inquiry</button>
</form>
</main></body></html>`;
}

function confirmHtml(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Confirm inquiry</title></head><body>
<main>
<h1>Confirm your inquiry</h1>
<p>David reviews inquiries within 6 hours.</p>
<form method="post" action="/forms/contact/confirm">
<input type="hidden" name="user_confirmed" value="true">
<button type="submit">Send this inquiry</button>
</form>
<p><a href="/forms/contact">Start over</a></p>
</main></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function getContactForm(): Response {
  return new Response(formHtml(), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export function getContactConfirm(): Response {
  return new Response(confirmHtml(), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export function getContactThanks(ref: string): Response {
  const safe = escapeHtml(ref.slice(0, 40));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Inquiry received</title></head><body><main><h1>Inquiry received</h1><p>Reference ${safe}. David reviews it within 6 hours.</p></main></body></html>`;
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function postContactForm(req: Request, deps: Deps): Promise<Response> {
  const params = new URLSearchParams(await req.text());
  const input = {
    first_name: params.get('first_name') ?? '',
    last_name: params.get('last_name') ?? '',
    email: params.get('email') ?? '',
    phone: params.get('phone') ?? '',
    service: params.get('service') ?? '',
    message: params.get('message') ?? '',
    consent_to_contact: params.get('consent_to_contact') === 'true',
  };
  const checked = checkInquiry(input);
  if (!checked.ok) {
    return new Response(formHtml(checked.message), { status: checked.status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  const secret = secretOf(deps);
  const confirm_token = makeConfirmToken(checked.value, secret);
  const sealed = sealReceipt(secret, 'form', { ...checked.value, confirm_token });
  return new Response(null, {
    status: 303,
    headers: {
      location: '/forms/contact/confirm',
      'set-cookie': `${COOKIE}=${encodeURIComponent(sealed)}; HttpOnly; Path=/forms/contact; SameSite=Lax`,
      'cache-control': 'no-store',
    },
  });
}

export async function postContactConfirm(req: Request, deps: Deps): Promise<Response> {
  const secret = secretOf(deps);
  const sealed = readCookie(req);
  const opened = sealed ? openReceipt(secret, 'form', sealed) : null;
  if (!opened || typeof opened.confirm_token !== 'string') {
    return new Response(formHtml('This confirmation expired. Start again.'), { status: 409, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  const params = new URLSearchParams(await req.text());
  if (params.get('user_confirmed') !== 'true') {
    return new Response(confirmHtml(), { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  const result = await submitInquiry({ ...opened, user_confirmed: true }, req, deps);
  if (result.status !== 200) {
    return new Response(formHtml(String(result.body.message ?? 'Could not send the inquiry.')), {
      status: result.status,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }
  const ref = String(result.body.ref ?? '');
  return new Response(null, {
    status: 303,
    headers: {
      location: `/forms/contact/thanks?ref=${encodeURIComponent(ref)}`,
      'set-cookie': `${COOKIE}=; HttpOnly; Path=/forms/contact; Max-Age=0`,
      'cache-control': 'no-store',
    },
  });
}
