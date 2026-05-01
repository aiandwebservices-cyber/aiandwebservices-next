// Server-side file-based storage for push subscriptions.
// Writes to /tmp so it works on both VPS and serverless (/tmp is writable).
// On a VPS with a persistent process, subscriptions survive restarts only if you
// swap /tmp for a persistent path (e.g. process.cwd() + '/data/push-subscriptions').

import { promises as fs } from 'fs';
import path from 'path';

const DIR = '/tmp/lotpilot-push';

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

function filePath(dealerId) {
  // Sanitize: only allow alphanumeric, hyphens, underscores
  const safe = dealerId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(DIR, `${safe}.json`);
}

export async function loadSubscriptions(dealerId) {
  try {
    const raw = await fs.readFile(filePath(dealerId), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveSubscriptions(dealerId, subscriptions) {
  await ensureDir();
  await fs.writeFile(filePath(dealerId), JSON.stringify(subscriptions), 'utf8');
}

export async function addSubscription(dealerId, subscription) {
  const existing = await loadSubscriptions(dealerId);
  const filtered = existing.filter(s => s.endpoint !== subscription.endpoint);
  await saveSubscriptions(dealerId, [...filtered, subscription]);
}

export async function removeSubscription(dealerId, endpoint) {
  const existing = await loadSubscriptions(dealerId);
  await saveSubscriptions(dealerId, existing.filter(s => s.endpoint !== endpoint));
}
