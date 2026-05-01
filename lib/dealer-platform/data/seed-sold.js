/**
 * Seed sold-vehicle history — 8 vehicles delivered in the last 30 days.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_SOLD = [
  {
    id: 's1', year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE',
    saleDate: '2026-04-28', listedPrice: 24995, salePrice: 23500, cost: 19200,
    grossProfit: 4300, daysOnLotAtSale: 18,
    buyerName: 'Mike Johnson', buyerEmail: 'mike.j@example.com', buyerPhone: '305-555-0234',
    salesperson: 'Carlos Rivera', financingType: 'Bank',
    commissionPaid: 412,
    review: { status: 'received', stars: 5, method: 'email', sentAt: isoDaysAgo(2) },
  },
  {
    id: 's2', year: 2022, make: 'Honda', model: 'CR-V', trim: 'EX',
    saleDate: '2026-04-25', listedPrice: 29995, salePrice: 28750, cost: 24100,
    grossProfit: 4650, daysOnLotAtSale: 22,
    buyerName: 'Lisa Park', buyerEmail: 'lisa.park@example.com', buyerPhone: '305-555-0291',
    salesperson: 'James Mitchell', financingType: 'Bank',
    commissionPaid: 448,
    review: { status: 'sent', stars: null, method: 'sms', sentAt: isoDaysAgo(4) },
  },
  {
    id: 's3', year: 2020, make: 'Ram', model: '1500', trim: 'Big Horn',
    saleDate: '2026-04-22', listedPrice: 34500, salePrice: 33200, cost: 28900,
    grossProfit: 4300, daysOnLotAtSale: 31,
    buyerName: 'Roberto Diaz', buyerEmail: 'rdiaz@example.com', buyerPhone: '305-555-0621',
    salesperson: 'Maria Santos', financingType: 'BHPH',
    tradeIn: { year: 2016, make: 'Chevrolet', model: 'Silverado', mileage: 118000, value: 9500 },
    commissionPaid: 400,
    review: { status: 'received', stars: 4, method: 'email', sentAt: isoDaysAgo(8) },
  },
  {
    id: 's4', year: 2023, make: 'Kia', model: 'Telluride', trim: 'EX',
    saleDate: '2026-04-18', listedPrice: 41800, salePrice: 40500, cost: 35200,
    grossProfit: 5300, daysOnLotAtSale: 14,
    buyerName: 'Angela Torres', buyerEmail: 'a.torres@example.com', buyerPhone: '305-555-0892',
    salesperson: 'Carlos Rivera', financingType: 'Bank',
    commissionPaid: 540,
    review: { status: 'received', stars: 5, method: 'sms', sentAt: isoDaysAgo(12) },
  },
  {
    id: 's5', year: 2021, make: 'Subaru', model: 'Outback', trim: 'Premium',
    saleDate: '2026-04-14', listedPrice: 26900, salePrice: 25800, cost: 22100,
    grossProfit: 3700, daysOnLotAtSale: 26,
    buyerName: 'Danielle Ruiz', buyerEmail: 'd.ruiz@example.com', buyerPhone: '305-555-0754',
    salesperson: 'James Mitchell', financingType: 'Cash',
    tradeIn: { year: 2017, make: 'Honda', model: 'Fit', mileage: 84000, value: 8200 },
    commissionPaid: 356,
    review: { status: 'not-sent', stars: null, method: null, sentAt: null },
  },
  {
    id: 's6', year: 2022, make: 'GMC', model: 'Sierra 1500', trim: 'SLE',
    saleDate: '2026-04-09', listedPrice: 37500, salePrice: 36200, cost: 30800,
    grossProfit: 5400, daysOnLotAtSale: 19,
    buyerName: 'Henry Nguyen', buyerEmail: 'h.nguyen@example.com', buyerPhone: '305-555-0421',
    salesperson: 'Maria Santos', financingType: 'Bank',
    tradeIn: { year: 2019, make: 'Ford', model: 'F-150', mileage: 71000, value: 22000 },
    commissionPaid: 552,
    review: { status: 'received', stars: 5, method: 'email', sentAt: isoDaysAgo(20) },
  },
  {
    id: 's7', year: 2019, make: 'BMW', model: '3 Series', trim: '330i xDrive',
    saleDate: '2026-04-04', listedPrice: 28900, salePrice: 27500, cost: 23200,
    grossProfit: 4300, daysOnLotAtSale: 41,
    buyerName: 'Patricia Vega', buyerEmail: 'p.vega@example.com', buyerPhone: '305-555-0558',
    salesperson: 'Carlos Rivera', financingType: 'Lease',
    commissionPaid: 400,
    review: { status: 'received', stars: 4, method: 'email', sentAt: isoDaysAgo(26) },
  },
  {
    id: 's8', year: 2022, make: 'Dodge', model: 'Charger', trim: 'R/T',
    saleDate: '2026-04-01', listedPrice: 36200, salePrice: 34900, cost: 29500,
    grossProfit: 5400, daysOnLotAtSale: 11,
    buyerName: 'Damien Cross', buyerEmail: 'dcross@example.com', buyerPhone: '305-555-0677',
    salesperson: 'James Mitchell', financingType: 'BHPH',
    commissionPaid: 540,
    review: { status: 'sent', stars: null, method: 'sms', sentAt: isoDaysAgo(29) },
  },
];
