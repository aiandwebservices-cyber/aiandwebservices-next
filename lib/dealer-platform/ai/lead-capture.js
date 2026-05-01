// Auto-create a Lead in EspoCRM by POSTing to the dealer's lead route.
// Returns the leadId on success, or null on any failure (best-effort).

import { splitName } from './contact-extractor.js';

export async function captureLeadFromChat(dealerConfig, customerInfo, vehicleOfInterest, conversationSummary, opts = {}) {
  if (!dealerConfig?.dealerId) return null;
  if (!customerInfo) return null;
  // Need at minimum an email or phone to be a useful lead.
  if (!customerInfo.email && !customerInfo.phone) return null;

  const { firstName, lastName } = splitName(customerInfo.name);
  const source = opts.source || 'Chat';

  const baseUrl = opts.baseUrl
    || process.env.DEALER_API_BASE_URL
    || (typeof window === 'undefined' ? 'http://localhost:3000' : '');

  const url = `${baseUrl.replace(/\/$/, '')}/api/dealer/${encodeURIComponent(dealerConfig.dealerId)}/lead`;

  const body = {
    source,
    firstName: firstName || customerInfo.name || 'Chat',
    lastName: lastName || '',
    email: customerInfo.email || `${(customerInfo.phone || 'unknown')}@chat.placeholder`,
    phone: customerInfo.phone || '',
    vehicleOfInterest: vehicleOfInterest || '',
    message: (conversationSummary || '').slice(0, 500),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('[lead-capture] POST /lead failed', res.status);
      return null;
    }
    const json = await res.json();
    return json?.leadId || null;
  } catch (e) {
    console.error('[lead-capture] error:', e.message);
    return null;
  }
}
