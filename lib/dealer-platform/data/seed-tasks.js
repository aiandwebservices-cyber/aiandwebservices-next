/**
 * Seed tasks — 10 items spanning overdue, today, and upcoming.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0);
  return dt.toISOString();
};
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();
const isoDays = (d) => new Date(TODAY.getTime() + d * 86400000).toISOString();

export const SEED_TASKS = [
  // ── OVERDUE (3) ─────────────────────────────────────────────────────────
  {
    id: 'tk1', title: 'Follow up with Maria Rodriguez',
    dueAt: isoAt(-2, 10), assignedTo: 'Carlos Rivera', relatedTo: 'Maria Rodriguez',
    priority: 'High', status: 'Open',
    notes: 'She submitted Get E-Price on BMW X5. Hot lead — no contact yet. Call or text immediately.',
  },
  {
    id: 'tk2', title: 'Send docs to lender for Thompson deal',
    dueAt: isoAt(-1, 17), assignedTo: 'Maria Santos', relatedTo: 'James Thompson',
    priority: 'High', status: 'Open',
    notes: 'TD Auto Finance waiting on proof of insurance and last 2 paystubs. Deal on hold.',
  },
  {
    id: 'tk3', title: 'Order key fob for 2024 Camry (v9)',
    dueAt: isoAt(-1, 12), assignedTo: 'James Mitchell', relatedTo: '2024 Toyota Camry SE',
    priority: 'Medium', status: 'Open',
    notes: 'Came in from trade without second key. Need to order from dealer. ETA 5 business days.',
  },

  // ── TODAY / TOMORROW (4) ────────────────────────────────────────────────
  {
    id: 'tk4', title: 'Call Robert Vasquez re: F-150 trade value',
    dueAt: isoAt(0, 14), assignedTo: 'James Mitchell', relatedTo: 'Robert Vasquez',
    priority: 'Medium', status: 'Open',
    notes: 'He wants $31,500 trade for his F-150. Need to counter at $28,200 based on Manheim data.',
  },
  {
    id: 'tk5', title: 'Schedule detail for new 2024 Camry SE',
    dueAt: isoAt(0, 11), assignedTo: 'Carlos Rivera', relatedTo: '2024 Toyota Camry SE',
    priority: 'Medium', status: 'Open',
    notes: 'Listed but needs full detail before showing. Coordinator says Thursday earliest.',
  },
  {
    id: 'tk6', title: 'Reply to Google review from Angela Torres',
    dueAt: isoAt(0, 16), assignedTo: 'Maria Santos', relatedTo: 'Angela Torres',
    priority: 'Medium', status: 'Open',
    notes: 'AI draft sitting in Marketing tab — just needs review and one-click publish.',
  },
  {
    id: 'tk7', title: 'Update Lexus RX 350 listing photos',
    dueAt: isoAt(1, 10), assignedTo: 'James Mitchell', relatedTo: '2021 Lexus RX 350 F Sport',
    priority: 'Low', status: 'Open',
    notes: 'Current photos are blurry — shoot 8 new ones with the ring light. On lot now.',
  },

  // ── FUTURE (3) ──────────────────────────────────────────────────────────
  {
    id: 'tk8', title: 'Monthly inventory review with owner',
    dueAt: isoAt(7, 10), assignedTo: 'Carlos Rivera', relatedTo: 'Internal',
    priority: 'Medium', status: 'Open',
    notes: 'Pull aging report and pricing comparison before meeting. Focus on v4, v8, v13.',
  },
  {
    id: 'tk9', title: 'Send monthly market report to owner',
    dueAt: isoAt(10, 9), assignedTo: 'Maria Santos', relatedTo: 'Internal',
    priority: 'Low', status: 'Open',
    notes: 'Use Reporting tab export. Include 30-day sold, leads by source, and avg days-on-lot.',
  },
  {
    id: 'tk10', title: 'Renew Twilio number before expiry',
    dueAt: isoAt(14, 12), assignedTo: 'James Mitchell', relatedTo: 'Admin',
    priority: 'Low', status: 'Open',
    notes: 'Twilio +1 (305) 555-0800 renews May 15. Log into Twilio console to confirm auto-renewal is on.',
  },
];

export const SEED_RESERVATIONS = [
  {
    id: 'r1', vehicleId: 'v6', customerName: 'Ana Gutierrez',
    phone: '305-555-0177', email: 'ana.g@example.com',
    reservedAt: isoDaysAgo(0.5), expiresAt: isoDays(1.5),
    depositAmount: 500, leadId: 'l6',
  },
];

export const SEED_MESSAGES = {
  l3: [
    { id: 'm1', dir: 'out', channel: 'sms', text: "Hi Carlos, this is Maria from Primo Auto. Thanks for building out that deal on the Mercedes GLE — we're excited to meet you Saturday!", when: isoDaysAgo(1.1) },
    { id: 'm2', dir: 'in',  channel: 'sms', text: 'Great! Ill be there at 11. Bringing my Civic too.',                                                                                     when: isoDaysAgo(0.95) },
    { id: 'm3', dir: 'out', channel: 'sms', text: "Perfect, Carlos! Our appraiser will be here too. See you at 11 — ask for Carlos Rivera when you arrive.",                                when: isoDaysAgo(0.9) },
  ],
  l5: [
    { id: 'm4', dir: 'out', channel: 'sms', text: "Hi David, thanks for chatting with us about the Audi Q5. Did you want to schedule a test drive this week?",                             when: isoDaysAgo(1.8) },
    { id: 'm5', dir: 'in',  channel: 'sms', text: 'Yes, Thursday afternoon works for me.',                                                                                                  when: isoDaysAgo(1.7) },
    { id: 'm6', dir: 'out', channel: 'sms', text: "Thursday 2 PM is confirmed. We'll have the Q5 freshly detailed for you. See you then!",                                                  when: isoDaysAgo(1.65) },
  ],
};
