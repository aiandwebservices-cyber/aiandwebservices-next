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
  primo: PRIMO_DEALER_CONFIG,
};

function fallbackReply(phone) {
  return `I'm having trouble right now. Please call us at ${phone || '(305) 555-0199'} for immediate help!`;
}

function genericInventoryDownReply(name) {
  const greet = name ? `Hi ${name}, ` : '';
  return `${greet}thanks for reaching out! Our team will get back to you shortly.`;
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = DEALER_CONFIGS[dealerId];
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }
  if (!getDealerConfig(dealerId)) {
    return Response.json({ ok: false, error: 'EspoCRM dealer not configured' }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, conversationHistory = [], sessionId } = body || {};
  if (!message || typeof message !== 'string') {
    return Response.json({ ok: false, error: 'message is required' }, { status: 400 });
  }
  if (!sessionId) {
    return Response.json({ ok: false, error: 'sessionId is required' }, { status: 400 });
  }

  // Pull inventory (cached). On hard failure, fall back gracefully.
  const inv = await getCachedInventory(dealerId);
  if (!inv.ok) {
    return Response.json({
      ok: true,
      reply: genericInventoryDownReply(),
      leadCaptured: false,
      degraded: 'inventory_unavailable',
    });
  }

  const inventoryContext = formatInventoryForAI(inv.vehicles);
  const systemPrompt = buildSalesAgentPrompt(dealerConfig, inventoryContext);

  // Persist user turn before calling Claude so we never lose it.
  appendMessage('chat', sessionId, 'user', message);

  // Cap context window: prefer caller-supplied history if provided, else session.
  const session = ensureSession('chat', sessionId);
  const historySource = Array.isArray(conversationHistory) && conversationHistory.length
    ? conversationHistory
    : session.messages;
  const trimmedHistory = historySource
    .slice(-HISTORY_LIMIT)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');

  // Ensure last message is the current user message exactly once.
  const messages = [...trimmedHistory];
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || last.content !== message) {
    messages.push({ role: 'user', content: message });
  }

  let reply;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Cache the system + inventory block for 5 min so repeat
      // turns within the same window only pay full input cost once.
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
    console.error('[chat] Claude error:', e.message);
    return Response.json({
      ok: true,
      reply: fallbackReply(dealerConfig.phone),
      leadCaptured: false,
      degraded: 'llm_unavailable',
    });
  }

  appendMessage('chat', sessionId, 'assistant', reply);

  // Look for new contact info in the latest user message and merge
  // it into the session. If we now have a phone OR email AND we
  // haven't yet captured a lead this session, fire one off.
  const extracted = extractContactInfo(message);
  const merged = updateCustomerInfo('chat', sessionId, extracted);

  let leadCaptured = false;
  if (!session.leadId && (merged.phone || merged.email)) {
    const summary = session.messages
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    const leadId = await captureLeadFromChat(
      dealerConfig,
      merged,
      /* vehicleOfInterest */ '',
      summary,
      { source: 'Chat' },
    );
    if (leadId) {
      session.leadId = leadId;
      leadCaptured = true;
    }
  }

  return Response.json({ ok: true, reply, leadCaptured });
}
