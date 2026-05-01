// Run once to generate keys:
//   npx web-push generate-vapid-keys
// Then add to .env.local:
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
//   VAPID_PRIVATE_KEY=...
//   VAPID_MAILTO=mailto:admin@lotpilot.ai

import webPush from 'web-push';
import { loadSubscriptions, saveSubscriptions } from './push-storage.js';

function getVapidConfig() {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const mailto = process.env.VAPID_MAILTO || 'mailto:admin@lotpilot.ai';
  if (!pub || !priv) return null;
  return { pub, priv, mailto };
}

export function buildPayload(type, data = {}) {
  const dealerId = data.dealerId || 'primo';
  const base = `/dealers/${dealerId}/admin`;

  const templates = {
    new_lead: {
      title: 'New Lead!',
      body: `${data.name || 'Someone'} is interested in ${data.vehicle || 'a vehicle'}`,
      icon: '/icons/lotpilot-192.svg',
      url: `${base}?tab=leads`,
      tag: `lead-${data.id || Date.now()}`,
    },
    new_appointment: {
      title: 'New Appointment',
      body: `${data.name || 'Customer'} booked ${data.type || 'an appointment'} for ${data.date || 'soon'}`,
      icon: '/icons/lotpilot-192.svg',
      url: `${base}?tab=appointments`,
      tag: `appt-${data.id || Date.now()}`,
    },
    new_chat: {
      title: 'Customer Chat',
      body: `${data.preview ? data.preview.slice(0, 80) + '...' : 'New message from a customer'}`,
      icon: '/icons/lotpilot-192.svg',
      url: `${base}?tab=leads`,
      tag: `chat-${data.id || Date.now()}`,
    },
    new_reservation: {
      title: 'Vehicle Reserved',
      body: `${data.name || 'Customer'} reserved ${data.vehicle || 'a vehicle'}`,
      icon: '/icons/lotpilot-192.svg',
      url: `${base}?tab=inventory`,
      tag: `res-${data.id || Date.now()}`,
    },
    daily_summary: {
      title: 'Daily Summary',
      body: `${data.leadCount ?? 0} new leads, ${data.appointmentCount ?? 0} appointments today`,
      icon: '/icons/lotpilot-192.svg',
      url: base,
      tag: 'daily-summary',
    },
  };

  return templates[type] || {
    title: 'LotPilot',
    body: data.body || 'New notification',
    icon: '/icons/lotpilot-192.svg',
    url: base,
    tag: 'lotpilot-general',
  };
}

export async function sendPushToDealer(dealerId, type, data = {}) {
  const vapid = getVapidConfig();
  if (!vapid) {
    console.warn('[push] VAPID keys not configured — skipping push');
    return;
  }

  webPush.setVapidDetails(vapid.mailto, vapid.pub, vapid.priv);

  const subscriptions = await loadSubscriptions(dealerId);
  if (!subscriptions.length) return;

  const payload = JSON.stringify(buildPayload(type, { ...data, dealerId }));
  const expired = [];

  await Promise.allSettled(
    subscriptions.map(async sub => {
      try {
        await webPush.sendNotification(sub, payload);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          expired.push(sub.endpoint);
        } else {
          console.warn('[push] send failed:', err.message);
        }
      }
    })
  );

  if (expired.length) {
    const cleaned = subscriptions.filter(s => !expired.includes(s.endpoint));
    await saveSubscriptions(dealerId, cleaned);
  }
}
