/**
 * Seed service appointments + 11 entries of recent service history.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0); // EDT offset for Miami-ish display
  return dt.toISOString();
};

export const SEED_APPOINTMENTS = [
  { id: 'a1', customerName: 'Mike Johnson', phone: '305-555-0234', email: 'mike.j@example.com',
    vehicleYear: 2021, vehicleMake: 'Toyota', vehicleModel: 'Camry', vehicleVin: 'JT2BG22K1Y0123456',
    serviceType: 'Oil Change', when: isoAt(1, 9), durationMin: 45,
    status: 'Confirmed', estimate: 89, advisor: 'Marco Esposito',
    notes: 'Synthetic blend. Customer mentioned slow leak — please inspect.',
    history: 'Last service: 2026-01-14 (oil + filter)' },
  { id: 'a2', customerName: 'Lisa Park', phone: '305-555-0291', email: 'lisa.park@example.com',
    vehicleYear: 2022, vehicleMake: 'Honda', vehicleModel: 'CR-V', vehicleVin: '5J6RW2H89NL234567',
    serviceType: 'Brake Inspection', when: isoAt(0, 14), durationMin: 60,
    status: 'In Progress', estimate: 49, advisor: 'Marco Esposito',
    notes: 'Squealing on cold starts. Possible front pad replacement.',
    history: 'New customer — purchased 2026-04-25' },
  { id: 'a3', customerName: 'Sarah Kim', phone: '305-555-0118', email: 'sarah.kim@example.com',
    vehicleYear: 2023, vehicleMake: 'Tesla', vehicleModel: 'Model Y', vehicleVin: '7SAYGDEE9PF234567',
    serviceType: 'State Inspection', when: isoAt(4, 10), durationMin: 30,
    status: 'Pending', estimate: 35, advisor: '',
    notes: '',
    history: 'No prior service records' },
  { id: 'a4', customerName: 'Carlos Mendez', phone: '305-555-0143', email: 'carlos.mendez@example.com',
    vehicleYear: 2022, vehicleMake: 'Mercedes-Benz', vehicleModel: 'GLE 350', vehicleVin: '4JGFB4KB2NA234567',
    serviceType: 'A/C Service', when: isoAt(7, 11), durationMin: 90,
    status: 'Pending', estimate: 189, advisor: '',
    notes: 'Blowing warm. Likely refrigerant + compressor diagnostic.',
    history: 'Purchased here 2026-01' },
];

export const SEED_APPT_HISTORY = [
  { id: 'ah1',  date: isoAt(-3,  10), customer: 'Robert Diaz',     service: 'Oil Change',              amount: 89,  status: 'Completed' },
  { id: 'ah2',  date: isoAt(-5,  9),  customer: 'Jennifer Wilson', service: 'Brake Service',           amount: 425, status: 'Completed' },
  { id: 'ah3',  date: isoAt(-7,  11), customer: 'Tom Reyes',       service: 'Transmission Service',    amount: 380, status: 'Completed' },
  { id: 'ah4',  date: isoAt(-9,  14), customer: 'Priya Patel',     service: 'A/C Service',             amount: 189, status: 'Completed' },
  { id: 'ah5',  date: isoAt(-12, 10), customer: 'Marcus Lee',      service: 'Multi-Point Inspection',  amount: 79,  status: 'No-Show'   },
  { id: 'ah6',  date: isoAt(-14, 9),  customer: 'Elena Vasquez',   service: 'Tire Rotation',           amount: 39,  status: 'Completed' },
  { id: 'ah7',  date: isoAt(-16, 11), customer: 'Kevin Wright',    service: 'Detailing',               amount: 249, status: 'Completed' },
  { id: 'ah8',  date: isoAt(-18, 13), customer: 'Aisha Brown',     service: 'Diagnostic',              amount: 149, status: 'Completed' },
  { id: 'ah9',  date: isoAt(-21, 10), customer: 'Diego Santos',    service: 'Battery Replacement',     amount: 215, status: 'Completed' },
  { id: 'ah10', date: isoAt(-25, 14), customer: 'Hannah Cole',     service: 'Brake Inspection',        amount: 49,  status: 'Completed' },
  { id: 'ah11', date: isoAt(-28, 9),  customer: 'Vincent Park',    service: 'Oil Change',              amount: 89,  status: 'No-Show'   },
];
