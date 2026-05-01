/**
 * Seed activity log — 25 entries spread over last 7 days.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_ACTIVITY = [
  // Day 0 (today)
  { id: 'act1',  type: 'lead-new',    title: 'New lead: Marcus Williams',              sub: 'Get E-Price · 2021 Ford F-150 XLT',                 when: isoDaysAgo(0.042), user: 'System',        refTab: 'leads' },
  { id: 'act2',  type: 'lead-new',    title: 'New lead: Maria Rodriguez',              sub: 'Get E-Price · 2023 BMW X5',                         when: isoDaysAgo(0.083), user: 'System',        refTab: 'leads' },
  { id: 'act3',  type: 'lead-new',    title: 'New lead: Ana Gutierrez',                sub: 'Chat · 2022 Porsche Cayenne',                        when: isoDaysAgo(0.15),  user: 'System',        refTab: 'leads' },
  { id: 'act4',  type: 'ai-desc',     title: 'AI description generated',               sub: '2024 Toyota Camry SE · 147 words',                   when: isoDaysAgo(0.25),  user: 'AI Agent',      refTab: 'inventory' },
  { id: 'act5',  type: 'ai-desc',     title: 'AI description generated',               sub: '2021 Ford F-150 XLT · 159 words',                    when: isoDaysAgo(0.3),   user: 'AI Agent',      refTab: 'inventory' },

  // Day 1
  { id: 'act6',  type: 'appointment', title: 'Appointment confirmed',                  sub: 'Carlos Mendez · Test Drive · Sat 11 AM',             when: isoDaysAgo(0.9),   user: 'Carlos Rivera', refTab: 'appointments' },
  { id: 'act7',  type: 'lead-status', title: 'James Thompson lead marked Contacted',   sub: 'Pre-Approval',                                       when: isoDaysAgo(1),     user: 'James Mitchell',refTab: 'leads' },
  { id: 'act8',  type: 'email-sent',  title: 'Follow-up email sent',                   sub: 'David Chen · Audi Q5 E-Price offer',                 when: isoDaysAgo(1.1),   user: 'Carlos Rivera', refTab: 'leads' },
  { id: 'act9',  type: 'price-drop',  title: 'Price updated: Range Rover Sport',       sub: '$65,900 → $61,995',                                  when: isoDaysAgo(1.4),   user: 'Maria Santos',  refTab: 'inventory' },

  // Day 2
  { id: 'act10', type: 'vehicle-add', title: 'Vehicle added to inventory',             sub: '2024 Toyota Camry SE · Stock P10412',                when: isoDaysAgo(2.1),   user: 'Carlos Rivera', refTab: 'inventory' },
  { id: 'act11', type: 'email-sent',  title: 'Follow-up email sent',                   sub: 'Sarah Kim · Tesla Model Y options',                  when: isoDaysAgo(2.2),   user: 'James Mitchell',refTab: 'leads' },
  { id: 'act12', type: 'deal-move',   title: 'Deal moved to F&I',                      sub: 'Carlos Mendez · 2022 Mercedes-Benz GLE 350',         when: isoDaysAgo(2.3),   user: 'Maria Santos',  refTab: 'deals' },
  { id: 'act13', type: 'ai-review',   title: 'Review response drafted by AI',          sub: 'Angela Torres · 5★ · "No pressure at all..."',       when: isoDaysAgo(2.5),   user: 'AI Agent',      refTab: 'marketing' },

  // Day 3
  { id: 'act14', type: 'lead-new',    title: 'New lead: Jennifer Morales',             sub: 'Chat · 2024 Toyota Camry SE',                        when: isoDaysAgo(3),     user: 'System',        refTab: 'leads' },
  { id: 'act15', type: 'sold',        title: '2021 Toyota Camry SE sold',              sub: 'Buyer: Mike Johnson · $23,500',                      when: isoDaysAgo(3.2),   user: 'Carlos Rivera', refTab: 'sold' },
  { id: 'act16', type: 'email-sent',  title: 'Follow-up email sent',                   sub: 'Jennifer Morales · Camry SE pricing',                when: isoDaysAgo(3.3),   user: 'Carlos Rivera', refTab: 'leads' },
  { id: 'act17', type: 'ai-desc',     title: 'AI description generated',               sub: '2021 Jeep Grand Cherokee Laredo · 152 words',        when: isoDaysAgo(3.8),   user: 'AI Agent',      refTab: 'inventory' },

  // Day 4
  { id: 'act18', type: 'appointment', title: 'Appointment confirmed',                  sub: 'Mike Johnson · Oil Change · Today 9 AM',             when: isoDaysAgo(4),     user: 'Marco Esposito',refTab: 'appointments' },
  { id: 'act19', type: 'email-sent',  title: 'Follow-up email sent',                   sub: 'Kevin O\'Brien · Range Rover pricing comparison',    when: isoDaysAgo(4.9),   user: 'James Mitchell',refTab: 'leads' },
  { id: 'act20', type: 'deal-move',   title: 'Deal moved to Pending Paperwork',        sub: 'Robert Vasquez · 2021 Jeep Grand Cherokee',          when: isoDaysAgo(4.5),   user: 'Maria Santos',  refTab: 'deals' },

  // Day 5
  { id: 'act21', type: 'sold',        title: '2022 Honda CR-V EX sold',                sub: 'Buyer: Lisa Park · $28,750',                         when: isoDaysAgo(5.5),   user: 'James Mitchell',refTab: 'sold' },
  { id: 'act22', type: 'vehicle-add', title: 'Vehicle added to inventory',             sub: '2023 Hyundai Tucson Limited · Stock P10398',         when: isoDaysAgo(5.8),   user: 'James Mitchell',refTab: 'inventory' },
  { id: 'act23', type: 'ai-review',   title: 'Review response drafted by AI',          sub: 'Henry Nguyen · 5★ · "Saved me $80/month..."',        when: isoDaysAgo(5.9),   user: 'AI Agent',      refTab: 'marketing' },

  // Day 6–7
  { id: 'act24', type: 'vehicle-add', title: 'Vehicle added to inventory',             sub: '2019 Chevrolet Equinox LT · Stock P10278',           when: isoDaysAgo(6.2),   user: 'Carlos Rivera', refTab: 'inventory' },
  { id: 'act25', type: 'price-drop',  title: 'Price updated: 2022 Cadillac Escalade',  sub: '$57,900 → $54,900',                                  when: isoDaysAgo(7),     user: 'Maria Santos',  refTab: 'inventory' },
];
