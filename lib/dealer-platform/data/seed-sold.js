/**
 * Seed sold-vehicle history — 2 vehicles delivered this month.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_SOLD = [
  { id: 's1', year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE',
    saleDate: '2026-04-28', listedPrice: 24995, salePrice: 23500, cost: 19200,
    daysOnLotAtSale: 18, buyerName: 'Mike Johnson', buyerEmail: 'mike.j@example.com', buyerPhone: '305-555-0234',
    review: { status: 'received', stars: 5, method: 'email', sentAt: isoDaysAgo(2) } },
  { id: 's2', year: 2022, make: 'Honda', model: 'CR-V', trim: 'EX',
    saleDate: '2026-04-25', listedPrice: 29995, salePrice: 28750, cost: 24100,
    daysOnLotAtSale: 22, buyerName: 'Lisa Park', buyerEmail: 'lisa.park@example.com', buyerPhone: '305-555-0291',
    review: { status: 'sent', stars: null, method: 'sms', sentAt: isoDaysAgo(4) } },
];
