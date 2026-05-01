import Anthropic from '@anthropic-ai/sdk';
import { getDealerConfig } from '../../_lib/espocrm.js';
import { getCachedInventory } from '../../../../../lib/dealer-platform/ai/inventory-cache.js';
import { formatInventoryForAI } from '../../../../../lib/dealer-platform/ai/inventory-formatter.js';
import { buildSalesAgentPrompt, PRIMO_DEALER_CONFIG } from '../../../../../lib/dealer-platform/ai/system-prompt.js';
import { extractContactInfo } from '../../../../../lib/dealer-platform/ai/contact-extractor.js';
import { captureLeadFromChat } from '../../../../../lib/dealer-platform/ai/lead-capture.js';
import {
  appendMessage,
  ensureSession,
  updateCustomerInfo,
} from '../../../../../lib/dealer-platform/ai/session-store.js';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 500;
const HISTORY_LIMIT = 10;

const DEALER_CONFIGS = {
  primo: {
    ...PRIMO_DEALER_CONFIG,
    twilioNumberEnv: 'PRIMO_TWILIO_NUMBER',
  },
};

function emptyTwiml() {
  return new Response('<?xml version="1.0" encoding="UTF-8"?><Response/>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
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

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = DEALER_CONFIGS[dealerId];
  if (!dealerConfig) return emptyTwiml();
  if (!getDealerConfig(dealerId)) return emptyTwiml();

  // Twilio sends application/x-www-form-urlencoded.
  let from = '';
  let smsBody = '';
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const j = await req.json();
      from = j.From || j.from || '';
      smsBody = j.Body || j.body || '';
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      from = params.get('From') || '';
      smsBody = params.get('Body') || '';
    }
  } catch (e) {
    console.error('[sms-agent] parse error:', e.message);
    return emptyTwiml();
  }

  if (!from || !smsBody) return emptyTwiml();

  const sessionKey = from; // namespace per phone
  appendMessage('sms', sessionKey, 'user', smsBody);

  // Inventory + system prompt
  const inv = await getCachedInventory(dealerId);
  let reply;
  if (!inv.ok) {
    reply = `Hi! Thanks for reaching out to ${dealerConfig.dealerName}. Our team will get back to you shortly.`;
  } else {
    const inventoryContext = formatInventoryForAI(inv.vehicles);
    const systemPrompt = buildSalesAgentPrompt(dealerConfig, inventoryContext);

    const session = ensureSession('sms', sessionKey);
    const messages = session.messages
      .slice(-HISTORY_LIMIT)
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(({ role, content }) => ({ role, content }));

    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
        ],
        messages,
      });
      reply = response.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();
      if (!reply) throw new Error('Empty response from Claude');
    } catch (e) {
      console.error('[sms-agent] Claude error:', e.message);
      reply = `I'm having trouble right now. Please call us at ${dealerConfig.phone} for immediate help!`;
    }
  }

  appendMessage('sms', sessionKey, 'assistant', reply);

  // Send the SMS reply via Twilio (best-effort).
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const dealerNumber = process.env[dealerConfig.twilioNumberEnv];
    if (sid && token && dealerNumber) {
      await sendTwilioSms({
        to: from,
        from: dealerNumber,
        body: reply,
        accountSid: sid,
        authToken: token,
      });
    } else {
      console.warn('[sms-agent] Twilio env vars missing — skipping send');
    }
  } catch (e) {
    console.error('[sms-agent] Twilio send error:', e.message);
  }

  // Lead capture: pre-seed phone from the SMS sender, merge any
  // extracted name/email, and create a Lead once per phone.
  const session = ensureSession('sms', sessionKey);
  const phoneDigits = from.replace(/\D/g, '').slice(-10);
  const extracted = extractContactInfo(smsBody);
  const merged = updateCustomerInfo('sms', sessionKey, {
    phone: extracted.phone || phoneDigits || null,
    name: extracted.name,
    email: extracted.email,
  });

  if (!session.leadId && merged.phone) {
    const summary = session.messages
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    const leadId = await captureLeadFromChat(
      dealerConfig,
      merged,
      '',
      summary,
      { source: 'PhoneCall' },
    );
    if (leadId) session.leadId = leadId;
  }

  return emptyTwiml();
}
