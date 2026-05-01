import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  nowEspoDateTime,
} from '../../../../_lib/espocrm.js';
import { PRIMO_DEALER_CONFIG } from '../../../../../../../lib/dealer-platform/ai/system-prompt.js';

const DEALER_CONFIGS = {
  lotcrm: {
    ...PRIMO_DEALER_CONFIG,
    twilioNumberEnv: 'PRIMO_TWILIO_NUMBER',
    fromEmail: 'sales@primoautogroup.com',
    fromName: 'Primo Auto Group',
  },
};

const VALID_STAGES = new Set(['4h', '24h', 'day3', 'day7']);
const VALID_CHANNELS = new Set(['sms', 'email']);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

async function fetchLead(leadId, espoConfig) {
  const res = await espoFetch(
    'GET',
    `/api/v1/Lead/${encodeURIComponent(leadId)}`,
    null,
    espoConfig
  );
  if (!res.ok) return null;
  return res.data;
}

function leadPhone(lead) {
  if (!lead) return null;
  if (Array.isArray(lead.phoneNumberData)) {
    const primary = lead.phoneNumberData.find((p) => p && p.phoneNumber);
    if (primary) return primary.phoneNumber;
  }
  return lead.phoneNumber || null;
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function plainBodyToHtml(body) {
  return escapeHtml(body).replace(/\n/g, '<br/>');
}

function toE164(digits) {
  if (!digits) return null;
  if (digits.startsWith('+')) return digits;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const espoConfig = getDealerConfig(dealerId);
  if (!espoConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const dealerCfg = DEALER_CONFIGS[dealerId];
  if (!dealerCfg) return bad(`No follow-up config for dealer: ${dealerId}`, 404);

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { leadId, stage, channel, message, subject } = body || {};
  if (!leadId || typeof leadId !== 'string') return bad('leadId is required');
  if (!stage || !VALID_STAGES.has(stage)) return bad('stage must be one of 4h,24h,day3,day7');
  if (!channel || !VALID_CHANNELS.has(channel)) return bad('channel must be sms or email');
  if (!message || typeof message !== 'string' || !message.trim()) {
    return bad('message text is required');
  }

  const lead = await fetchLead(leadId, espoConfig);
  if (!lead) return bad('Lead not found', 404);

  let sentChannel = null;

  if (channel === 'sms') {
    const phoneRaw = leadPhone(lead);
    const digits = normalizePhone(phoneRaw);
    if (!digits) return bad('Lead has no valid phone number');

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env[dealerCfg.twilioNumberEnv];
    if (!sid || !token || !fromNumber) {
      return Response.json(
        { ok: false, error: 'Twilio env vars missing on server' },
        { status: 500 }
      );
    }
    try {
      await sendTwilioSms({
        to: toE164(digits),
        from: fromNumber,
        body: message.trim(),
        accountSid: sid,
        authToken: token,
      });
      sentChannel = 'sms';
    } catch (e) {
      console.error('[ai/followup/send] Twilio error:', e.message);
      return Response.json({ ok: false, error: e.message }, { status: 502 });
    }
  } else {
    const email = lead.emailAddress;
    if (!isValidEmail(email)) return bad('Lead has no valid email address');
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json(
        { ok: false, error: 'RESEND_API_KEY missing on server' },
        { status: 500 }
      );
    }
    const trimmed = message.trim();
    const subjectLine = (subject && typeof subject === 'string' && subject.trim())
      || `Following up on your ${dealerCfg.dealerName} inquiry`;
    try {
      await sendResendEmail({
        apiKey,
        from: `${dealerCfg.fromName} <${dealerCfg.fromEmail}>`,
        to: email.trim(),
        subject: subjectLine,
        html: plainBodyToHtml(trimmed),
        text: trimmed,
      });
      sentChannel = 'email';
    } catch (e) {
      console.error('[ai/followup/send] Resend error:', e.message);
      return Response.json({ ok: false, error: e.message }, { status: 502 });
    }
  }

  const preview = message.trim().slice(0, 100);
  const noteBody = `Auto follow-up (${stage}, ${sentChannel}): ${preview}${message.trim().length > 100 ? '…' : ''}\n\nSent at: ${nowEspoDateTime()}`;
  const noteRes = await espoFetch(
    'POST',
    '/api/v1/Note',
    { type: 'Post', parentType: 'Lead', parentId: leadId, post: noteBody },
    espoConfig
  );
  if (!noteRes.ok) {
    console.warn('[ai/followup/send] EspoCRM Note failed:', noteRes.error);
  }

  return Response.json({
    ok: true,
    sent: true,
    channel: sentChannel,
    stage,
    noteId: noteRes.ok ? noteRes.data?.id : undefined,
  });
}
