/**
 * Seed leads — 6 demo lead submissions across all source channels.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_LEADS = [
  { id: 'l1', name: 'Maria Rodriguez', email: 'maria.rod@example.com', phone: '305-555-0142',
    source: 'Get E-Price', vehicleId: 'v1', vehicleLabel: '2023 BMW X5',
    status: 'New', read: false, createdAt: isoDaysAgo(0.083),
    notes: '', preApproval: null, tradeInfo: null,
    timeline: [
      { t: isoDaysAgo(0.42),  event: 'Viewed 2023 BMW X5 listing' },
      { t: isoDaysAgo(0.31),  event: 'Added 2023 BMW X5 to favorites' },
      { t: isoDaysAgo(0.21),  event: 'Viewed financing calculator' },
      { t: isoDaysAgo(0.083), event: 'Submitted Get E-Price form' },
    ] },
  { id: 'l2', name: 'James Thompson', email: 'james.t@example.com', phone: '305-555-0173',
    source: 'Pre-Approval', vehicleId: null, vehicleLabel: 'No specific vehicle',
    status: 'Contacted', read: true, createdAt: isoDaysAgo(1),
    notes: 'Called back at 4:30 — interested in trucks under $35k. Sending links.',
    preApproval: { creditScore: '700-749', monthlyIncome: 7500, employer: 'FedEx' },
    timeline: [
      { t: isoDaysAgo(1.1),  event: 'Visited inventory page' },
      { t: isoDaysAgo(1),    event: 'Submitted Pre-Approval application' },
      { t: isoDaysAgo(0.85), event: 'Dealer phone outreach — connected' },
    ] },
  { id: 'l3', name: 'Carlos Mendez', email: 'carlos.mendez@example.com', phone: '305-555-0143',
    source: 'Build Your Deal', vehicleId: 'v2', vehicleLabel: '2022 Mercedes-Benz GLE 350',
    status: 'Appointment Set', read: true, createdAt: isoDaysAgo(1.2),
    notes: 'Coming in Saturday at 11am. Bringing 2019 Civic for trade appraisal.',
    preApproval: null,
    tradeInfo: { year: 2019, make: 'Honda', model: 'Civic', mileage: 62000, condition: 'Good' },
    timeline: [
      { t: isoDaysAgo(2.5), event: 'Viewed 2022 Mercedes-Benz GLE 350' },
      { t: isoDaysAgo(1.5), event: 'Used trade calculator on 2019 Honda Civic' },
      { t: isoDaysAgo(1.2), event: 'Submitted Build Your Deal package' },
      { t: isoDaysAgo(0.9), event: 'Dealer text outreach — appointment confirmed' },
    ] },
  { id: 'l4', name: 'Sarah Kim', email: 'sarah.kim@example.com', phone: '305-555-0118',
    source: 'Trade-In', vehicleId: 'v5', vehicleLabel: '2023 Tesla Model Y',
    status: 'New', read: false, createdAt: isoDaysAgo(0.125),
    notes: '',
    tradeInfo: { year: 2018, make: 'Toyota', model: 'RAV4', mileage: 78000, condition: 'Excellent' },
    timeline: [
      { t: isoDaysAgo(0.5),   event: 'Viewed 2023 Tesla Model Y' },
      { t: isoDaysAgo(0.125), event: 'Submitted Trade-In appraisal request' },
    ] },
  { id: 'l5', name: 'David Chen', email: 'd.chen@example.com', phone: '305-555-0199',
    source: 'Test Drive', vehicleId: 'v3', vehicleLabel: '2024 Audi Q5',
    status: 'Showed', read: true, createdAt: isoDaysAgo(2),
    notes: 'Test drove Tuesday. Comparing against X3. Following up Friday with E-Price match offer.',
    timeline: [
      { t: isoDaysAgo(3),   event: 'Viewed 2024 Audi Q5' },
      { t: isoDaysAgo(2),   event: 'Booked test drive' },
      { t: isoDaysAgo(0.5), event: 'Showed for test drive' },
      { t: isoDaysAgo(0.4), event: 'Dealer email follow-up sent' },
    ] },
  { id: 'l6', name: 'Ana Gutierrez', email: 'ana.g@example.com', phone: '305-555-0177',
    source: 'Chat', vehicleId: 'v6', vehicleLabel: '2022 Porsche Cayenne',
    status: 'New', read: false, createdAt: isoDaysAgo(0.042),
    notes: '',
    timeline: [
      { t: isoDaysAgo(0.083), event: 'Viewed 2022 Porsche Cayenne' },
      { t: isoDaysAgo(0.042), event: 'Started live chat — transcript saved' },
    ] },
];
