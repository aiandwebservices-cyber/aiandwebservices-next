/**
 * Seed reviews — Google review feed used by the Marketing tab.
 * In production, replaced by live Google Places API call (server-side).
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_REVIEWS = [
  { id: 'rv1', author: 'Mike J.', rating: 5,
    text: 'Best used car experience in Miami. Carlos made everything easy. Love my Camry!',
    date: isoDaysAgo(3),  platform: 'Google', responded: false, response: '' },
  { id: 'rv2', author: 'Lisa P.', rating: 5,
    text: 'No pressure, fair price, and they delivered to my door. Will buy here again.',
    date: isoDaysAgo(7),  platform: 'Google', responded: false, response: '' },
  { id: 'rv3', author: 'David C.', rating: 4,
    text: 'Great selection and pricing. Finance took a bit long but overall happy.',
    date: isoDaysAgo(14), platform: 'Google', responded: true,
    response: "Thanks David — appreciate the feedback. We've streamlined our finance team since then. Enjoy the Audi!" },
];
