/**
 * Seed activity log — 10 entries shown on Dashboard "Recent Activity" feed.
 * Auto-extended by addActivity() helper as the dealer makes mutations.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_ACTIVITY = [
  { id: 'act1',  type: 'lead-new',    title: 'New lead: Maria Rodriguez',                    sub: 'Get E-Price · 2023 BMW X5',                    when: isoDaysAgo(0.083), refTab: 'leads' },
  { id: 'act2',  type: 'price-drop',  title: 'Price changed on 2022 Mercedes-Benz GLE',      sub: '$41,500 → $38,750',                            when: isoDaysAgo(0.42),  refTab: 'inventory' },
  { id: 'act3',  type: 'lead-status', title: 'James Thompson lead marked Contacted',         sub: 'Pre-Approval',                                 when: isoDaysAgo(1),     refTab: 'leads' },
  { id: 'act4',  type: 'reservation', title: 'Reservation created: Ana Gutierrez',           sub: '2022 Porsche 911 · $500 deposit',              when: isoDaysAgo(0.5),   refTab: 'dashboard' },
  { id: 'act5',  type: 'sold',        title: '2021 Lexus RX 350 marked Sold to Mike Johnson',sub: 'Sale price: $31,500',                          when: isoDaysAgo(2),     refTab: 'sold' },
  { id: 'act6',  type: 'feature',     title: '2023 BMW X5 marked Featured',                  sub: 'Showcased on homepage',                        when: isoDaysAgo(3),     refTab: 'inventory' },
  { id: 'act7',  type: 'lead-new',    title: 'New lead: Sarah Kim',                          sub: 'Trade-In · 2023 Tesla Model Y',                when: isoDaysAgo(3.5),   refTab: 'leads' },
  { id: 'act8',  type: 'appointment', title: 'Service appointment confirmed',                sub: 'Mike Johnson · Oil Change · Mon 9 AM',         when: isoDaysAgo(4),     refTab: 'appointments' },
  { id: 'act9',  type: 'sold',        title: '2022 Cadillac Escalade marked Sold',           sub: 'Buyer: Roberto Diaz · $54,900',                when: isoDaysAgo(7),     refTab: 'sold' },
  { id: 'act10', type: 'review',      title: 'New 5★ review from Mike J.',                   sub: '"Best used car experience in Miami…"',         when: isoDaysAgo(3),     refTab: 'marketing' },
];
