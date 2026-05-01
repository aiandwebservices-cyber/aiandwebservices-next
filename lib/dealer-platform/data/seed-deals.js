/**
 * Seed deals — 5 active deals across pipeline stages.
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();
const isoDaysOut = (d) => new Date(TODAY.getTime() + d * 86400000).toISOString();

export const SEED_DEALS = [
  // Negotiation — 2 pricing scenarios
  {
    id: 'd1', leadId: 'l1', customerName: 'Maria Rodriguez',
    email: 'maria.rod@example.com', phone: '305-555-0142',
    vehicleId: 'v1', vehicleLabel: '2023 BMW X5 xDrive40i',
    listPrice: 42995, salePrice: 41500,
    trade: null,
    downPayment: 4000, termMonths: 60, apr: 5.9,
    fees: { docFee: 399, tagTitle: 189, dealerPrep: 0 },
    fniProducts: { extWarranty: false, paintProtection: false, windowTint: false, gapInsurance: false, wheelLock: false, maintPlan: false },
    status: 'Negotiation',
    scenarios: [
      { label: 'Scenario A — Full Ask', salePrice: 42995, downPayment: 4000, termMonths: 60, apr: 5.9, monthlyPayment: 745 },
      { label: 'Scenario B — Meet in Middle', salePrice: 41200, downPayment: 4000, termMonths: 72, apr: 5.9, monthlyPayment: 645 },
    ],
    notes: 'Customer countered at $40,500. We have room to $41,200 while protecting margin. Pulled credit — approved tier 2.',
    createdAt: isoDaysAgo(0.5),
  },

  // F&I — approved financing + 3 F&I products
  {
    id: 'd2', leadId: 'l3', customerName: 'Carlos Mendez',
    email: 'carlos.mendez@example.com', phone: '305-555-0143',
    vehicleId: 'v2', vehicleLabel: '2022 Mercedes-Benz GLE 350 4MATIC',
    listPrice: 41500, salePrice: 38750,
    trade: { year: 2019, make: 'Honda', model: 'Civic', mileage: 62000, value: 12500 },
    downPayment: 5000, termMonths: 60, apr: 4.9,
    fees: { docFee: 399, tagTitle: 189, dealerPrep: 0 },
    fniProducts: { extWarranty: true, paintProtection: true, windowTint: false, gapInsurance: true, wheelLock: false, maintPlan: false },
    financing: { lender: 'Ally Financial', approved: true, approvedAmount: 35000, rate: 4.9, termMonths: 60 },
    fniTotal: 3850,
    status: 'F&I',
    notes: 'Ally approved at 4.9% for 60 months. Customer accepted 3-year extended warranty + gap. Strong F&I deal.',
    createdAt: isoDaysAgo(1.2),
  },

  // Pending Paperwork — DocuSign out
  {
    id: 'd3', leadId: 'l8', customerName: 'Robert Vasquez',
    email: 'r.vasquez@example.com', phone: '305-555-0388',
    vehicleId: 'v15', vehicleLabel: '2021 Jeep Grand Cherokee Laredo',
    listPrice: 28995, salePrice: 27800,
    trade: null,
    downPayment: 3000, termMonths: 72, apr: 6.99,
    fees: { docFee: 399, tagTitle: 189, dealerPrep: 0 },
    fniProducts: { extWarranty: true, paintProtection: false, windowTint: true, gapInsurance: false, wheelLock: false, maintPlan: false },
    financing: { lender: 'Capital One Auto Finance', approved: true, approvedAmount: 25500, rate: 6.99, termMonths: 72 },
    docusign: { status: 'sent', sentAt: isoDaysAgo(0.25), viewedAt: null, signedAt: null },
    status: 'Pending Paperwork',
    notes: 'DocuSign package emailed at 9:45 AM. Customer said he will sign tonight. Waiting on last 2 signatures.',
    createdAt: isoDaysAgo(2.5),
  },

  // Ready for Delivery — pickup date set
  {
    id: 'd4', leadId: 'l2', customerName: 'James Thompson',
    email: 'james.t@example.com', phone: '305-555-0173',
    vehicleId: 'v10', vehicleLabel: '2021 Ford F-150 XLT',
    listPrice: 32995, salePrice: 31500,
    trade: null,
    downPayment: 2500, termMonths: 60, apr: 5.49,
    fees: { docFee: 399, tagTitle: 189, dealerPrep: 0 },
    fniProducts: { extWarranty: true, paintProtection: false, windowTint: false, gapInsurance: false, wheelLock: true, maintPlan: false },
    financing: { lender: 'TD Auto Finance', approved: true, approvedAmount: 30000, rate: 5.49, termMonths: 60 },
    delivery: { pickupDate: isoDaysOut(3), advisorNote: 'Keys prepped, all docs signed, Spray-In Liner warranty card in glove box.' },
    status: 'Ready for Delivery',
    notes: 'All signed. James coming in Thursday 2 PM for pickup. Have F-150 detailed and tank topped off.',
    createdAt: isoDaysAgo(4),
  },

  // Original working deal
  {
    id: 'd5', leadId: 'l9', customerName: 'Marcus Williams',
    email: 'm.williams@example.com', phone: '305-555-0312',
    vehicleId: 'v10', vehicleLabel: '2021 Ford F-150 XLT',
    listPrice: 32995, salePrice: null,
    trade: null,
    downPayment: 5000, termMonths: 60, apr: 5.49,
    fees: { docFee: 399, tagTitle: 189, dealerPrep: 0 },
    fniProducts: { extWarranty: false, paintProtection: false, windowTint: false, gapInsurance: false, wheelLock: false, maintPlan: false },
    status: 'Working',
    notes: 'Capital One pre-approved for $28,000 at 5.49%. Customer wants $400/mo target — will need 72-month or stronger down.',
    createdAt: isoDaysAgo(0.042),
  },
];

// Historical F&I attach data — used by the Marketing tab to chart attach rates over time.
export const SEED_FNI_HISTORY = [
  { dealId: 'sold-h1', month: 'May', extWarranty: true,  paintProtection: true,  windowTint: false, gapInsurance: true,  wheelLock: false, maintPlan: false },
  { dealId: 'sold-h2', month: 'May', extWarranty: true,  paintProtection: false, windowTint: true,  gapInsurance: false, wheelLock: false, maintPlan: true  },
  { dealId: 'sold-h3', month: 'May', extWarranty: false, paintProtection: false, windowTint: true,  gapInsurance: true,  wheelLock: false, maintPlan: false },
  { dealId: 'sold-h4', month: 'Apr', extWarranty: true,  paintProtection: true,  windowTint: true,  gapInsurance: true,  wheelLock: true,  maintPlan: false },
  { dealId: 'sold-h5', month: 'Apr', extWarranty: true,  paintProtection: false, windowTint: false, gapInsurance: false, wheelLock: false, maintPlan: true  },
  { dealId: 'sold-h6', month: 'Apr', extWarranty: false, paintProtection: true,  windowTint: false, gapInsurance: false, wheelLock: false, maintPlan: false },
];
