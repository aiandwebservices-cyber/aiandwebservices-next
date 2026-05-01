/**
 * Seed tasks — 4 follow-up items + reservation seed.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDays = (d) => new Date(TODAY.getTime() + d * 86400000).toISOString();
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();
const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0);
  return dt.toISOString();
};

export const SEED_TASKS = [
  { id: 'tk1', title: 'Call Maria Rodriguez back',          dueAt: isoAt(0, 14),  assignedTo: 'Carlos Rivera',  relatedTo: 'Maria Rodriguez',  priority: 'High',   status: 'Open',      notes: 'Wants to know about BMW X5 financing options.' },
  { id: 'tk2', title: 'Follow up after test drive',         dueAt: isoAt(1, 11),  assignedTo: 'James Mitchell', relatedTo: 'Sarah Kim',        priority: 'Medium', status: 'Open',      notes: 'Test drove Tesla Model Y on Saturday. Loved it. Send pricing follow-up.' },
  { id: 'tk3', title: 'Send Carlos deal paperwork',         dueAt: isoAt(-1, 16), assignedTo: 'Maria Santos',   relatedTo: 'Carlos Mendez',    priority: 'High',   status: 'Open',      notes: 'GLE 350 deal. Buyer signed offer — needs final paperwork emailed.' },
  { id: 'tk4', title: "Check if Ana's financing approved", dueAt: isoAt(2, 10),  assignedTo: 'Carlos Rivera',  relatedTo: 'Ana Gutierrez',    priority: 'Low',    status: 'Open',      notes: 'Reservation on Porsche 911. Capital One pre-approval pending.' },
];

export const SEED_RESERVATIONS = [
  { id: 'r1', vehicleId: 'v6', customerName: 'Ana Gutierrez',
    phone: '305-555-0177', email: 'ana.g@example.com',
    reservedAt: isoDaysAgo(0.5), expiresAt: isoDays(1.5),
    depositAmount: 500, leadId: 'l6' },
];

// Pre-populated demo SMS thread keyed by lead id
export const SEED_MESSAGES = {
  l5: [
    { id: 'm1', dir: 'out', channel: 'sms', text: "Hi Carlos, thanks for your interest in the Mercedes GLE. When works for a test drive?", when: isoDaysAgo(2.1) },
    { id: 'm2', dir: 'in',  channel: 'sms', text: "How about Saturday morning?",                                                              when: isoDaysAgo(2.0) },
    { id: 'm3', dir: 'out', channel: 'sms', text: "Perfect, I've got you down for Saturday 10AM. See you then!",                              when: isoDaysAgo(1.95) },
  ],
};
