// Local smoke test for the AI sales agent.
// Usage:  node lib/dealer-platform/ai/test-agent.js
//
// Pulls the Primo inventory from EspoCRM, builds the system prompt,
// and asks Claude: "Do you have any SUVs under 40K?"
// Prints the formatted prompt and Claude's reply.
//
// Requires:
//   ANTHROPIC_API_KEY  set in env (or in .env.local)
//   Primo EspoCRM reachable at http://localhost:8081

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

import { getCachedInventory } from './inventory-cache.js';
import { formatInventoryForAI } from './inventory-formatter.js';
import { buildSalesAgentPrompt, PRIMO_DEALER_CONFIG } from './system-prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..', '..', '..');

function loadDotEnvLocal() {
  const path = resolve(PROJECT_ROOT, '.env.local');
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key]) continue;
    let val = raw;
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const MODEL = 'claude-sonnet-4-6';
const TEST_QUERY = 'Do you have any SUVs under 40K?';

async function main() {
  loadDotEnvLocal();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set. Add it to .env.local or export it.');
    process.exit(1);
  }

  console.log('--- Fetching Primo inventory from EspoCRM…');
  const inv = await getCachedInventory('primo', { force: true });
  if (!inv.ok) {
    console.error('Inventory fetch failed:', inv.error);
    process.exit(1);
  }
  console.log(`    ${inv.vehicles.length} vehicles loaded`);

  const inventoryContext = formatInventoryForAI(inv.vehicles);
  const systemPrompt = buildSalesAgentPrompt(PRIMO_DEALER_CONFIG, inventoryContext);

  console.log('\n--- System prompt (first 1000 chars) ---');
  console.log(systemPrompt.slice(0, 1000));
  console.log('…\n');

  console.log(`--- Sending test query to ${MODEL}:`);
  console.log(`    "${TEST_QUERY}"\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: [
      { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: TEST_QUERY }],
  });

  const reply = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  console.log('--- Claude reply ---');
  console.log(reply);
  console.log('\n--- Usage ---');
  console.log(JSON.stringify(response.usage, null, 2));
}

main().catch((e) => {
  console.error('test-agent failed:', e);
  process.exit(1);
});
