/**
 * Seed deals — 1 active deal in the worksheet.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_DEALS = [
  { id: 'd1', leadId: 'l3', customerName: 'Carlos Mendez',
    email: 'carlos.mendez@example.com', phone: '305-555-0143',
    vehicleId: 'v2', vehicleLabel: '2022 Mercedes-Benz GLE 350',
    listPrice: 41500, salePrice: 38750,
    trade: { year: 2019, make: 'Honda', model: 'Civic', mileage: 62000, value: 12500 },
    downPayment: 5000, termMonths: 60, apr: 4.9,
    fees: { docFee: 0, tagTitle: 0, dealerPrep: 0 },
    fniProducts: { extWarranty: true, paintProtection: false, windowTint: true, gapInsurance: false, wheelLock: false, maintPlan: false },
    status: 'Working', notes: 'Pulled credit — approved tier 2. Customer wants $400/mo target.',
    createdAt: isoDaysAgo(1.2) },
];

// Historical F&I attach data — used by the Marketing tab to chart attach rates over time.
export const SEED_FNI_HISTORY = [
  { dealId: 'sold-h1', month: 'May', extWarranty: true,  paintProtection: true,  windowTint: false, gapInsurance: true,  wheelLock: false, maintPlan: false },
  { dealId: 'sold-h2', month: 'May', extWarranty: true,  paintProtection: false, windowTint: true,  gapInsurance: false, wheelLock: false, maintPlan: true  },
  { dealId: 'sold-h3', month: 'May', extWarranty: false, paintProtection: false, windowTint: true,  gapInsurance: true,  wheelLock: false, maintPlan: false },
];
