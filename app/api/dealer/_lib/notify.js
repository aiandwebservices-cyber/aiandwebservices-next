// Fire-and-forget webhook helper for dealer notification routing (n8n).
// Never throws; failures are logged and swallowed so the calling route
// can return success to the customer regardless of n8n availability.

export async function notifyDealer(data) {
  const url = process.env.PRIMO_N8N_WEBHOOK_URL;
  if (!url) {
    console.warn('[notify] PRIMO_N8N_WEBHOOK_URL not set — skipping');
    return;
  }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('[notify] webhook failed:', e.message);
  }
}

export function nowDealerTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}
