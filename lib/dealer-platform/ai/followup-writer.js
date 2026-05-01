// AI-generated personalized follow-up messages for leads.
// One Claude Haiku call per stage returns both SMS and email in a single
// JSON payload. The full 4-stage sequence runs the 4 stages in parallel.

import Anthropic from '@anthropic-ai/sdk';
import { PRIMO_DEALER_CONFIG } from './system-prompt.js';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

const STAGES = ['4h', '24h', 'day3', 'day7'];

const STAGE_GUIDANCE = {
  '4h': "Warm acknowledgment. Confirm we got their inquiry and we're glad they're interested. No pressure — this is the 'we hear you' touch.",
  '24h': "Gentle nudge. Let them know the vehicle is still available and we'd love to set up a time. Helpful, not pushy.",
  day3: "Value add. Mention something useful — a similar vehicle, a price update, or an answer to a likely question. Keep it informative, not salesy.",
  day7: "Graceful close. Low pressure. 'If timing isn't right, no worries — we'll be here when you're ready.' Leaves the door open.",
};

function vehicleDescription(vehicle) {
  if (!vehicle) return null;
  if (typeof vehicle === 'string') return vehicle.trim() || null;
  const name = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || vehicle.cVehicleOfInterest || null;
}

function vehicleDetailLines(vehicle) {
  if (!vehicle || typeof vehicle !== 'object') return null;
  const lines = [];
  if (vehicle.exteriorColor) lines.push(`Color: ${vehicle.exteriorColor}`);
  if (vehicle.mileage !== undefined && vehicle.mileage !== null && vehicle.mileage !== '') {
    lines.push(`Mileage: ${Number(vehicle.mileage).toLocaleString('en-US')} mi`);
  }
  if (vehicle.salePrice || vehicle.listPrice) {
    const price = Number(vehicle.salePrice || vehicle.listPrice);
    if (Number.isFinite(price) && price > 0) lines.push(`Price: $${price.toLocaleString('en-US')}`);
  }
  if (vehicle.bodyStyle) lines.push(`Body: ${vehicle.bodyStyle}`);
  return lines.length ? lines.join('\n') : null;
}

function buildSystemPrompt({ dealerName, dealerPhone, salesRepName }) {
  return `You are writing personalized follow-up messages on behalf of ${salesRepName}, a salesperson at ${dealerName}. The customer expressed interest in a specific vehicle and you are sending a multi-channel follow-up.

You will receive: the customer name, the vehicle they were interested in, the dealer phone number, and the stage of the sequence. Write a brief, natural SMS and a short email for that stage.

Rules:
- Sound like a real salesperson writing on their phone, not a marketing bot.
- Use the customer's first name.
- Reference the specific vehicle they were interested in (year/make/model — pick the natural shorthand).
- SMS: under 160 characters total. One segment. Include the dealer phone number naturally.
- Email body: under 100 words. Include the dealer phone number naturally.
- No exclamation-mark spam. At most one exclamation mark across the whole message.
- Use contractions naturally (I'm, we'd, you'll, it's).
- Sign with ${salesRepName} (first name only) — never sign as the dealership.
- Match the stage tone exactly as described.
- Banned phrases — never use any of these:
  * "I hope this email finds you well"
  * "Don't miss out"
  * "Act now"
  * "valued customer"
  * "we strive to"
  * "circling back"
  * "touching base"

Output format — return ONLY a single JSON object, no preamble, no code fences:
{
  "sms": "...",
  "email_subject": "...",
  "email_body": "..."
}`;
}

function buildUserPrompt({ customerName, vehicleDesc, vehicleDetails, dealerPhone, stage }) {
  const guidance = STAGE_GUIDANCE[stage] || STAGE_GUIDANCE['24h'];
  const lines = [
    `Customer: ${customerName}`,
    `Vehicle of interest: ${vehicleDesc || '(not specified)'}`,
  ];
  if (vehicleDetails) lines.push(`Vehicle details:\n${vehicleDetails}`);
  lines.push(`Dealer phone: ${dealerPhone}`);
  lines.push(`Stage: ${stage}`);
  lines.push(`Stage tone: ${guidance}`);
  lines.push('');
  lines.push('Write the SMS and email for this stage. Return only the JSON object.');
  return lines.join('\n');
}

function extractJson(text) {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function firstName(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'there';
  return fullName.trim().split(/\s+/)[0] || 'there';
}

export async function writeFollowUp(lead, vehicle, config, stage) {
  if (!STAGES.includes(stage)) {
    throw new Error(`Invalid stage: ${stage}. Expected one of ${STAGES.join(', ')}`);
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const dealerConfig = config || PRIMO_DEALER_CONFIG;
  const dealerName = dealerConfig.dealerName || 'our dealership';
  const dealerPhone = dealerConfig.phone || '';
  const salesRepName = dealerConfig.salesRepName || 'the team';

  const customerName = firstName(
    [lead?.firstName, lead?.lastName].filter(Boolean).join(' ') || lead?.name || ''
  );
  const vehicleDesc = vehicleDescription(vehicle) || vehicleDescription(lead?.cVehicleOfInterest);
  const vehicleDetails = vehicleDetailLines(vehicle);

  const systemPrompt = buildSystemPrompt({ dealerName, dealerPhone, salesRepName });
  const userPrompt = buildUserPrompt({
    customerName,
    vehicleDesc,
    vehicleDetails,
    dealerPhone,
    stage,
  });

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const parsed = extractJson(raw);
  if (!parsed || typeof parsed.sms !== 'string' || typeof parsed.email_body !== 'string') {
    throw new Error('Claude returned malformed JSON for follow-up');
  }

  const tokens =
    (response.usage?.input_tokens ?? 0) +
    (response.usage?.output_tokens ?? 0);

  return {
    sms: parsed.sms.trim(),
    email: {
      subject: (parsed.email_subject || '').trim(),
      body: parsed.email_body.trim(),
    },
    stage,
    tokens,
  };
}

export async function writeFollowUpSequence(lead, vehicle, config) {
  const results = await Promise.all(
    STAGES.map((stage) =>
      writeFollowUp(lead, vehicle, config, stage).then(
        (r) => [stage, { sms: r.sms, email: r.email, tokens: r.tokens }],
        (err) => [stage, { error: err.message || String(err) }]
      )
    )
  );
  return Object.fromEntries(results);
}
