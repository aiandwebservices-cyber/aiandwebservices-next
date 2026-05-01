// AI vehicle description generator. Calls Claude Haiku to write a
// short, human-sounding listing description from a CVehicle record.

import Anthropic from '@anthropic-ai/sdk';
import { PRIMO_DEALER_CONFIG } from './system-prompt.js';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

function buildSystemPrompt(dealerConfig) {
  const c = dealerConfig || {};
  return `You are a professional automotive copywriter for ${c.dealerName || 'our dealership'}. Write a compelling 3-4 sentence vehicle listing description that makes a buyer want to schedule a test drive.

Rules:
- Lead with the most exciting feature (low miles, one owner, luxury trim, rare color, etc)
- Mention specific specs naturally — don't just list them
- Include the inspection/warranty badge if applicable
- End with a soft CTA (schedule a test drive, come see it)
- Sound human and enthusiastic, not generic or robotic
- Never use: 'well-maintained', 'runs great', 'must see', 'won't last long', or any cliché car ad phrases
- Keep it under 100 words
- Do NOT mention price — that's shown separately

Examples of GOOD descriptions:
'One-owner 2023 BMW X5 with the coveted M Sport package, panoramic roof, and just 28K highway miles. Finished in Alpine White over Black leather with every option checked. Passed our 150-point inspection with flying colors and comes with a clean CARFAX. Stop by for a test drive — this spec doesn't come up often.'

'This 2022 Mercedes GLE 350 just landed and it's already turning heads. Low miles, 4MATIC all-wheel drive, and that gorgeous Gray Metallic paint. Originally $51K new — now available at a fraction. Backed by our 90-day powertrain warranty.'

Output ONLY the description text — no preamble, no quotes, no labels.`;
}

function vehicleSummary(v) {
  const lines = [];
  const name = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ').trim();
  if (name) lines.push(`Vehicle: ${name}`);
  if (v.mileage !== undefined && v.mileage !== null && v.mileage !== '') {
    lines.push(`Mileage: ${Number(v.mileage).toLocaleString('en-US')} mi`);
  }
  if (v.exteriorColor) lines.push(`Exterior: ${v.exteriorColor}`);
  if (v.interiorColor) lines.push(`Interior: ${v.interiorColor}`);
  if (v.engine) lines.push(`Engine: ${v.engine}`);
  if (v.transmission) lines.push(`Transmission: ${v.transmission}`);
  if (v.drivetrain) lines.push(`Drivetrain: ${v.drivetrain}`);
  if (v.fuelType) lines.push(`Fuel: ${v.fuelType}`);
  if (v.bodyStyle) lines.push(`Body Style: ${v.bodyStyle}`);

  const badges = [];
  if (v.noAccidents) badges.push('No accidents reported');
  if (v.oneOwner) badges.push('One-owner');
  if (v.cleanTitle) badges.push('Clean title');
  if (v.serviceRecords) badges.push('Full service records');
  if (v.inspectionPassed) badges.push('Passed 150-point inspection');
  if (badges.length) lines.push(`Badges: ${badges.join(', ')}`);

  return lines.join('\n');
}

export async function generateVehicleDescription(vehicle, config) {
  if (!vehicle || typeof vehicle !== 'object') {
    throw new Error('vehicle is required');
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const dealerConfig = config || PRIMO_DEALER_CONFIG;
  const systemPrompt = buildSystemPrompt(dealerConfig);
  const userPrompt = `Write the listing description for this vehicle:\n\n${vehicleSummary(vehicle)}`;

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    // Cache the system prompt — it's identical across every vehicle.
    system: [
      { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const description = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
    .replace(/^["']|["']$/g, '');

  const tokens =
    (response.usage?.input_tokens ?? 0) +
    (response.usage?.output_tokens ?? 0);

  return { description, tokens };
}
