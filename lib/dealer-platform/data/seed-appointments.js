/**
 * Seed appointments — 8 upcoming/recent + 11 entries of service history.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0); // EDT offset for Miami-ish display
  return dt.toISOString();
};
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_APPOINTMENTS = [
  // Completed (2 past)
  {
    id: 'a1', type: 'Test Drive',
    customerName: 'David Chen', phone: '305-555-0199', email: 'd.chen@example.com',
    vehicleId: 'v3', vehicleYear: 2024, vehicleMake: 'Audi', vehicleModel: 'Q5',
    when: isoAt(-3, 11), durationMin: 60,
    status: 'Completed', estimate: 0, advisor: 'Carlos Rivera',
    notes: 'Test drove 30 min. Customer very interested — comparing against BMW X3.',
    leadId: 'l5',
  },
  {
    id: 'a2', type: 'Service',
    customerName: 'Lisa Park', phone: '305-555-0291', email: 'lisa.park@example.com',
    vehicleYear: 2022, vehicleMake: 'Honda', vehicleModel: 'CR-V', vehicleVin: '5J6RW2H89NL234567',
    when: isoAt(-2, 14), durationMin: 60,
    status: 'Completed', estimate: 49, advisor: 'Marco Esposito',
    notes: 'Front brake pads replaced. Squealing resolved.',
    history: 'New customer — purchased 2026-04-25',
    leadId: 'l10',
  },

  // No-Show (yesterday)
  {
    id: 'a3', type: 'Appraisal',
    customerName: 'Tony Rivera', phone: '305-555-0618', email: 'tonyrivera99@example.com',
    vehicleYear: 2020, vehicleMake: 'GMC', vehicleModel: 'Yukon',
    when: isoAt(-1, 10), durationMin: 45,
    status: 'No-Show', estimate: 0, advisor: 'James Mitchell',
    notes: 'Did not show. Called twice — no answer. Will follow up.',
    leadId: 'l14',
  },

  // Today
  {
    id: 'a4', type: 'Service',
    customerName: 'Mike Johnson', phone: '305-555-0234', email: 'mike.j@example.com',
    vehicleYear: 2021, vehicleMake: 'Toyota', vehicleModel: 'Camry', vehicleVin: 'JT2BG22K1Y0123456',
    when: isoAt(0, 9), durationMin: 45,
    status: 'Confirmed', estimate: 89, advisor: 'Marco Esposito',
    notes: 'Synthetic blend oil change. Customer mentioned slow leak — inspect seals.',
    history: 'Last service: 2026-01-14 (oil + filter)',
  },

  // Tomorrow (Confirmed)
  {
    id: 'a5', type: 'Test Drive',
    customerName: 'Carlos Mendez', phone: '305-555-0143', email: 'carlos.mendez@example.com',
    vehicleId: 'v2', vehicleYear: 2022, vehicleMake: 'Mercedes-Benz', vehicleModel: 'GLE 350',
    when: isoAt(1, 11), durationMin: 60,
    status: 'Confirmed', estimate: 0, advisor: 'Carlos Rivera',
    notes: 'Bringing 2019 Civic for trade appraisal after the drive.',
    leadId: 'l3',
  },

  // Tomorrow (Pending)
  {
    id: 'a6', type: 'Finance Meeting',
    customerName: 'Robert Vasquez', phone: '305-555-0388', email: 'r.vasquez@example.com',
    vehicleId: 'v15', vehicleYear: 2021, vehicleMake: 'Jeep', vehicleModel: 'Grand Cherokee',
    when: isoAt(1, 10), durationMin: 90,
    status: 'Pending', estimate: 0, advisor: 'Maria Santos',
    notes: '$3,000 down, 72-month. Capital One pre-approval in hand.',
    leadId: 'l8',
  },

  // Future +3 days
  {
    id: 'a7', type: 'Delivery',
    customerName: 'James Thompson', phone: '305-555-0173', email: 'james.t@example.com',
    vehicleId: 'v10', vehicleYear: 2021, vehicleMake: 'Ford', vehicleModel: 'F-150',
    when: isoAt(3, 14), durationMin: 120,
    status: 'Confirmed', estimate: 0, advisor: 'James Mitchell',
    notes: 'Delivery appointment. Have keys, floor mats, and owner manual ready.',
    leadId: 'l2',
  },

  // Future +5 days
  {
    id: 'a8', type: 'Service',
    customerName: 'Sarah Kim', phone: '305-555-0118', email: 'sarah.kim@example.com',
    vehicleYear: 2023, vehicleMake: 'Tesla', vehicleModel: 'Model Y', vehicleVin: '7SAYGDEE9PF234567',
    when: isoAt(5, 10), durationMin: 30,
    status: 'Pending', estimate: 35, advisor: '',
    notes: 'State inspection due.',
    history: 'No prior service records',
    leadId: 'l4',
  },
];

export const SEED_APPT_HISTORY = [
  { id: 'ah1',  date: isoAt(-3,  10), customer: 'David Chen',      service: 'Test Drive',              amount: 0,   status: 'Completed' },
  { id: 'ah2',  date: isoAt(-2,  14), customer: 'Lisa Park',       service: 'Brake Service',           amount: 425, status: 'Completed' },
  { id: 'ah3',  date: isoAt(-5,  9),  customer: 'Jennifer Wilson', service: 'Brake Service',           amount: 425, status: 'Completed' },
  { id: 'ah4',  date: isoAt(-7,  11), customer: 'Tom Reyes',       service: 'Transmission Service',    amount: 380, status: 'Completed' },
  { id: 'ah5',  date: isoAt(-9,  14), customer: 'Priya Patel',     service: 'A/C Service',             amount: 189, status: 'Completed' },
  { id: 'ah6',  date: isoAt(-12, 10), customer: 'Marcus Lee',      service: 'Multi-Point Inspection',  amount: 79,  status: 'No-Show'   },
  { id: 'ah7',  date: isoAt(-14, 9),  customer: 'Elena Vasquez',   service: 'Tire Rotation',           amount: 39,  status: 'Completed' },
  { id: 'ah8',  date: isoAt(-16, 11), customer: 'Kevin Wright',    service: 'Detailing',               amount: 249, status: 'Completed' },
  { id: 'ah9',  date: isoAt(-18, 13), customer: 'Aisha Brown',     service: 'Diagnostic',              amount: 149, status: 'Completed' },
  { id: 'ah10', date: isoAt(-21, 10), customer: 'Diego Santos',    service: 'Battery Replacement',     amount: 215, status: 'Completed' },
  { id: 'ah11', date: isoAt(-25, 14), customer: 'Hannah Cole',     service: 'Oil Change',              amount: 89,  status: 'Completed' },
];
