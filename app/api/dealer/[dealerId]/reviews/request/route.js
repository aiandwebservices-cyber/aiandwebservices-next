import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  nowEspoDateTime,
} from '../../../_lib/espocrm.js';

const DEALER_REVIEW_CONFIG = {
  lotcrm: {
    dealerName: 'Primo Auto Group',
    twilioNumberEnv: 'PRIMO_TWILIO_NUMBER',
    placeIdEnv: 'GOOGLE_PLACE_ID_PRIMO',
    fromEmail: 'reviews@primoautogroup.com',
    fromName: 'Primo Auto Group',
    accentColor: '#0b5fff',
  },
};

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function buildReviewLink(placeId) {
  if (!placeId) return 'https://www.google.com/business';
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

function buildSmsBody({ name, dealerName, vehicle, link }) {
  return `Hi ${name}! Thanks for choosing ${dealerName} for your ${vehicle}. If you had a great experience, we'd really appreciate a quick Google review: ${link} — The ${dealerName.split(' ')[0]} Team`;
}

function buildEmailHtml({ name, dealerName, vehicle, link, accentColor }) {
  const stars = '★★★★★';
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
        <tr><td style="background:${accentColor};padding:24px 32px;color:#ffffff;font-size:18px;font-weight:600;">
          ${dealerName}
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;">Thanks for your ${vehicle}, ${name}!</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:#333;">
            We hope you're loving the new ride. If we earned it, would you mind sharing your experience on Google? It only takes a minute and means the world to our team.
          </p>
          <div style="font-size:36px;letter-spacing:6px;color:#fbbf24;line-height:1;margin:8px 0 24px;">${stars}</div>
          <p style="margin:0 0 28px;">
            <a href="${link}" style="display:inline-block;background:${accentColor};color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:8px;">Leave a Google review</a>
          </p>
          <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
            If anything fell short, please reply to this email — we'd rather hear from you directly so we can make it right.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafbff;font-size:12px;color:#888;">
          ${dealerName} · This message was sent because you recently purchased a vehicle from us.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildEmailText({ name, dealerName, vehicle, link }) {
  return `Hi ${name},

Thanks for your new ${vehicle}! If you had a great experience with ${dealerName}, we'd really appreciate a quick Google review:

${link}

If anything fell short, just reply to this email and we'll make it right.

— The ${dealerName} team`;
}

async function sendTwilioSms({ to, from, body, accountSid, authToken }) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
  const form = new URLSearchParams({ To: to, From: from, Body: body });
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio ${res.status}: ${text}`);
  }
  return res.json();
}

async function sendResendEmail({ apiKey, from, to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend ${res.status}: ${t}`);
  }
  return res.json();
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const reviewCfg = DEALER_REVIEW_CONFIG[dealerId];
  if (!reviewCfg) return bad(`No review config for dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const {
    customerName,
    customerPhone,
    customerEmail,
    vehiclePurchased,
    method,
  } = body || {};

  if (!customerName || typeof customerName !== 'string') {
    return bad('customerName is required');
  }
  if (!vehiclePurchased || typeof vehiclePurchased !== 'string') {
    return bad('vehiclePurchased is required');
  }

  const methods = new Set();
  if (method === 'sms' || method === 'both') methods.add('sms');
  if (method === 'email' || method === 'both') methods.add('email');
  if (methods.size === 0) {
    return bad('method must be "sms", "email", or "both"');
  }

  const phoneDigits = methods.has('sms') ? normalizePhone(customerPhone) : null;
  if (methods.has('sms') && !phoneDigits) {
    return bad('Valid customerPhone is required for SMS');
  }
  if (methods.has('email') && !isValidEmail(customerEmail)) {
    return bad('Valid customerEmail is required for email');
  }

  const placeId = process.env[reviewCfg.placeIdEnv] || '';
  const link = buildReviewLink(placeId);
  const firstName = customerName.trim().split(/\s+/)[0];
  const sent = [];
  const errors = [];

  if (methods.has('sms')) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env[reviewCfg.twilioNumberEnv];
    if (!sid || !token || !fromNumber) {
      errors.push('SMS skipped: Twilio env vars missing');
    } else {
      try {
        const toE164 = `+${phoneDigits}`.startsWith('+1') || phoneDigits.length === 11
          ? `+${phoneDigits}`
          : `+1${phoneDigits}`;
        await sendTwilioSms({
          to: toE164,
          from: fromNumber,
          body: buildSmsBody({
            name: firstName,
            dealerName: reviewCfg.dealerName,
            vehicle: vehiclePurchased,
            link,
          }),
          accountSid: sid,
          authToken: token,
        });
        sent.push('sms');
      } catch (e) {
        console.error('[reviews/request] Twilio error:', e.message);
        errors.push(`SMS failed: ${e.message}`);
      }
    }
  }

  if (methods.has('email')) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      errors.push('Email skipped: RESEND_API_KEY missing');
    } else {
      try {
        await sendResendEmail({
          apiKey,
          from: `${reviewCfg.fromName} <${reviewCfg.fromEmail}>`,
          to: customerEmail.trim(),
          subject: `How's the new ${vehiclePurchased}, ${firstName}?`,
          html: buildEmailHtml({
            name: firstName,
            dealerName: reviewCfg.dealerName,
            vehicle: vehiclePurchased,
            link,
            accentColor: reviewCfg.accentColor,
          }),
          text: buildEmailText({
            name: firstName,
            dealerName: reviewCfg.dealerName,
            vehicle: vehiclePurchased,
            link,
          }),
        });
        sent.push('email');
      } catch (e) {
        console.error('[reviews/request] Resend error:', e.message);
        errors.push(`Email failed: ${e.message}`);
      }
    }
  }

  const noteBody = `[Review request — ${nowEspoDateTime()}]

Customer: ${customerName}
Phone:    ${customerPhone || '—'}
Email:    ${customerEmail || '—'}
Vehicle:  ${vehiclePurchased}

Requested via: ${[...methods].join(', ')}
Sent:          ${sent.length ? sent.join(', ') : 'none'}
Errors:        ${errors.length ? errors.join(' | ') : 'none'}
Link:          ${link}`;

  const noteRes = await espoFetch(
    'POST',
    '/api/v1/Note',
    { type: 'Post', post: noteBody },
    dealerConfig
  );
  if (!noteRes.ok) {
    console.warn('[reviews/request] EspoCRM Note failed:', noteRes.error);
  }

  return Response.json({
    ok: sent.length > 0 || errors.length === 0,
    sent,
    errors: errors.length ? errors : undefined,
    noteId: noteRes.ok ? noteRes.data?.id : undefined,
    link,
  });
}
