'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard, Car, Plus, Users, FileText, Archive, Megaphone,
  Settings as SettingsIcon, Bell, Search, Edit3, Trash2, Eye, EyeOff,
  ChevronDown, ChevronRight, ChevronUp, Filter, Download, Upload,
  ExternalLink, Calculator, Calendar, MapPin, Globe, Facebook, Instagram,
  Youtube, Check, X, AlertTriangle, AlertCircle, TrendingUp, Hash, Award,
  ShieldCheck, Zap, Save, Star, Tag, Clock, Phone, Mail, MessageSquare,
  DollarSign, BarChart3, Image as ImageIcon, GripVertical, Send, Printer,
  Sparkles, ArrowUpRight, ArrowDownRight, RefreshCw, Share2, Menu,
  MoreHorizontal, FileSpreadsheet, ThumbsUp, Languages, Receipt, Layers,
  PlusCircle, MinusCircle, ChevronLeft, Power, CircleDot, Square, CheckSquare,
  Wrench, Activity, Gauge, Timer, MessageCircle, Shield, Flag, Reply,
  TrendingDown, BadgeCheck, Smartphone, Monitor, ChartLine, MoveRight
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const GOLD = '#D4AF37';
const GOLD_SOFT = '#F5E9C4';
const RED_ACCENT = '#C33B3B';

const MAKES = [
  'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford',
  'Genesis','GMC','Honda','Hyundai','Infiniti','Jaguar','Jeep','Kia','Land Rover',
  'Lexus','Lincoln','Maserati','Mazda','Mercedes-Benz','Nissan','Porsche','Ram',
  'Subaru','Tesla','Toyota','Volkswagen','Volvo'
];
const COLORS = ['Black','White','Silver','Gray','Red','Blue','Green','Brown','Beige','Gold','Yellow','Orange','Burgundy'];
const BODY_STYLES = ['Sedan','SUV','Truck','Coupe','Van','Convertible','Hatchback','Wagon'];
const TRANSMISSIONS = ['Automatic','Manual','CVT'];
const DRIVETRAINS = ['FWD','RWD','AWD','4WD'];
const FUEL_TYPES = ['Gas','Diesel','Electric','Hybrid','PHEV'];
const STATUSES = ['Available','Featured','On Sale','Just Arrived','Price Drop','Pending','Sold'];
const LEAD_SOURCES = ['Get E-Price','Pre-Approval','Trade-In','Test Drive','Contact','Build Your Deal','Inventory Alert','Chat','Phone Call'];
const LEAD_STATUSES = ['New','Contacted','Appointment Set','Showed','Sold','Lost'];
const DEAL_STATUSES = ['New Deal','Working','Approved','Delivered','Lost'];
const APPT_STATUSES = ['Pending','Confirmed','In Progress','Completed','No-Show','Cancelled'];
const SERVICE_TYPES = [
  'Oil Change','Brake Inspection','Brake Service','Tire Rotation','State Inspection',
  'A/C Service','Battery Replacement','Multi-Point Inspection','Diagnostic',
  'Transmission Service','Detailing','Other'
];
const SERVICE_RATES = {
  'Oil Change': 89, 'Brake Inspection': 49, 'Brake Service': 425, 'Tire Rotation': 39,
  'State Inspection': 35, 'A/C Service': 189, 'Battery Replacement': 215,
  'Multi-Point Inspection': 79, 'Diagnostic': 149, 'Transmission Service': 380,
  'Detailing': 249, 'Other': 150
};
const FNI_PRODUCT_CATALOG = [
  { key: 'extWarranty', label: 'Extended Warranty', price: 1200 },
  { key: 'paintProtection', label: 'Paint Protection', price: 599 },
  { key: 'windowTint', label: 'Window Tint', price: 299 },
  { key: 'gapInsurance', label: 'GAP Insurance', price: 695 },
  { key: 'wheelLock', label: 'Wheel & Tire Protection', price: 449 },
  { key: 'maintPlan', label: 'Pre-Paid Maintenance', price: 875 }
];

/* ------------------------------------------------------------------ */
/*  SEED DATA                                                          */
/* ------------------------------------------------------------------ */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

const SEED_INVENTORY = [
  { id: 'v1', year: 2023, make: 'BMW', model: 'X5', trim: 'xDrive40i', bodyStyle: 'SUV',
    cost: 36500, listPrice: 42995, salePrice: null, mileage: 28400, exteriorColor: 'Black',
    interiorColor: 'Beige', engine: '3.0L Turbo Inline-6', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 21, mpgHwy: 26, vin: '5UXCR6C09P9N12345',
    stockNumber: 'P10234', status: 'Featured', daysOnLot: 12, views: 1247,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true },
    description: 'Luxurious BMW X5 with premium package, panoramic roof, and full service history. A standout xDrive40i in pristine condition.',
    photos: [], dateAdded: isoDaysAgo(12) },
  { id: 'v2', year: 2022, make: 'Mercedes-Benz', model: 'GLE 350', trim: '4MATIC', bodyStyle: 'SUV',
    cost: 32000, listPrice: 41500, salePrice: 38750, mileage: 34100, exteriorColor: 'Silver',
    interiorColor: 'Black', engine: '2.0L Turbo Inline-4', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 22, mpgHwy: 28, vin: '4JGFB4KB2NA123456',
    stockNumber: 'P10198', status: 'On Sale', daysOnLot: 38, views: 892,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false },
    description: 'Recently reduced — Mercedes GLE 350 with MBUX infotainment, heated seats, and a flawless ride.',
    photos: [], dateAdded: isoDaysAgo(38) },
  { id: 'v3', year: 2024, make: 'Audi', model: 'Q5', trim: 'Premium Plus', bodyStyle: 'SUV',
    cost: 38200, listPrice: 44900, salePrice: null, mileage: 12300, exteriorColor: 'White',
    interiorColor: 'Black', engine: '2.0L TFSI', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 23, mpgHwy: 28, vin: 'WA1BNAFY8R2123456',
    stockNumber: 'P10301', status: 'Just Arrived', daysOnLot: 3, views: 412,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true },
    description: 'Just arrived — Audi Q5 Premium Plus with virtual cockpit, Bang & Olufsen sound, and remaining factory warranty.',
    photos: [], dateAdded: isoDaysAgo(3) },
  { id: 'v4', year: 2021, make: 'Lexus', model: 'RX 350', trim: 'F Sport', bodyStyle: 'SUV',
    cost: 25800, listPrice: 31995, salePrice: null, mileage: 41200, exteriorColor: 'Gray',
    interiorColor: 'Red', engine: '3.5L V6', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 20, mpgHwy: 27, vin: '2T2BZMCA2MC123456',
    stockNumber: 'P10089', status: 'Available', daysOnLot: 52, views: 587,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false },
    description: 'Lexus RX 350 F Sport with red interior package, Mark Levinson audio, and meticulous service records.',
    photos: [], dateAdded: isoDaysAgo(52) },
  { id: 'v5', year: 2023, make: 'Tesla', model: 'Model Y', trim: 'Long Range', bodyStyle: 'SUV',
    cost: 30100, listPrice: 36500, salePrice: null, mileage: 19800, exteriorColor: 'White',
    interiorColor: 'Black', engine: 'Dual Motor Electric', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Electric', mpgCity: 127, mpgHwy: 117, vin: '7SAYGDEE9PF123456',
    stockNumber: 'P10256', status: 'Featured', daysOnLot: 8, views: 1893,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true },
    description: 'Tesla Model Y Long Range — Autopilot, premium connectivity, and Supercharger access. Range over 330 miles.',
    photos: [], dateAdded: isoDaysAgo(8) },
  { id: 'v6', year: 2022, make: 'Porsche', model: 'Cayenne', trim: 'Base', bodyStyle: 'SUV',
    cost: 44900, listPrice: 52800, salePrice: null, mileage: 22500, exteriorColor: 'Black',
    interiorColor: 'Black', engine: '3.0L V6 Turbo', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 19, mpgHwy: 23, vin: 'WP1AA2AY9NDA12345',
    stockNumber: 'P10167', status: 'Available', daysOnLot: 27, views: 1041,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false },
    description: 'Porsche Cayenne with sport chrono package, premium plus interior, and sport exhaust. A driver’s SUV.',
    photos: [], dateAdded: isoDaysAgo(27) },
  { id: 'v7', year: 2023, make: 'Land Rover', model: 'Range Rover Sport', trim: 'SE', bodyStyle: 'SUV',
    cost: 53200, listPrice: 65900, salePrice: 61995, mileage: 15700, exteriorColor: 'Silver',
    interiorColor: 'Black', engine: '3.0L Mild-Hybrid Inline-6', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Hybrid', mpgCity: 21, mpgHwy: 26, vin: 'SAL1V9EU1PA123456',
    stockNumber: 'P10145', status: 'Price Drop', daysOnLot: 45, views: 723,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true },
    description: 'Range Rover Sport SE with meridian sound, panoramic roof, and adaptive air suspension. Price drop — strong value.',
    photos: [], dateAdded: isoDaysAgo(45) },
  { id: 'v8', year: 2022, make: 'Cadillac', model: 'Escalade', trim: 'Premium Luxury', bodyStyle: 'SUV',
    cost: 46500, listPrice: 54900, salePrice: null, mileage: 31400, exteriorColor: 'Black',
    interiorColor: 'Beige', engine: '6.2L V8', transmission: 'Automatic',
    drivetrain: '4WD', fuelType: 'Gas', mpgCity: 14, mpgHwy: 19, vin: '1GYS4DKL9NR123456',
    stockNumber: 'P10067', status: 'Available', daysOnLot: 63, views: 951,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: false, warranty: false },
    description: 'Three-row Cadillac Escalade Premium Luxury with curved OLED display, AKG audio, and Super Cruise.',
    photos: [], dateAdded: isoDaysAgo(63) }
];

const SEED_LEADS = [
  { id: 'l1', name: 'Maria Rodriguez', email: 'maria.rod@example.com', phone: '305-555-0142',
    source: 'Get E-Price', vehicleId: 'v1', vehicleLabel: '2023 BMW X5',
    status: 'New', read: false, createdAt: isoDaysAgo(0.083),
    notes: '', preApproval: null, tradeInfo: null,
    timeline: [
      { t: isoDaysAgo(0.42), event: 'Viewed 2023 BMW X5 listing' },
      { t: isoDaysAgo(0.31), event: 'Added 2023 BMW X5 to favorites' },
      { t: isoDaysAgo(0.21), event: 'Viewed financing calculator' },
      { t: isoDaysAgo(0.083), event: 'Submitted Get E-Price form' }
    ] },
  { id: 'l2', name: 'James Thompson', email: 'james.t@example.com', phone: '305-555-0173',
    source: 'Pre-Approval', vehicleId: null, vehicleLabel: 'No specific vehicle',
    status: 'Contacted', read: true, createdAt: isoDaysAgo(1),
    notes: 'Called back at 4:30 — interested in trucks under $35k. Sending links.',
    preApproval: { creditScore: '700-749', monthlyIncome: 7500, employer: 'FedEx' },
    timeline: [
      { t: isoDaysAgo(1.1), event: 'Visited inventory page' },
      { t: isoDaysAgo(1), event: 'Submitted Pre-Approval application' },
      { t: isoDaysAgo(0.85), event: 'Dealer phone outreach — connected' }
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
      { t: isoDaysAgo(0.9), event: 'Dealer text outreach — appointment confirmed' }
    ] },
  { id: 'l4', name: 'Sarah Kim', email: 'sarah.kim@example.com', phone: '305-555-0118',
    source: 'Trade-In', vehicleId: 'v5', vehicleLabel: '2023 Tesla Model Y',
    status: 'New', read: false, createdAt: isoDaysAgo(0.125),
    notes: '',
    tradeInfo: { year: 2018, make: 'Toyota', model: 'RAV4', mileage: 78000, condition: 'Excellent' },
    timeline: [
      { t: isoDaysAgo(0.5), event: 'Viewed 2023 Tesla Model Y' },
      { t: isoDaysAgo(0.125), event: 'Submitted Trade-In appraisal request' }
    ] },
  { id: 'l5', name: 'David Chen', email: 'd.chen@example.com', phone: '305-555-0199',
    source: 'Test Drive', vehicleId: 'v3', vehicleLabel: '2024 Audi Q5',
    status: 'Showed', read: true, createdAt: isoDaysAgo(2),
    notes: 'Test drove Tuesday. Comparing against X3. Following up Friday with E-Price match offer.',
    timeline: [
      { t: isoDaysAgo(3), event: 'Viewed 2024 Audi Q5' },
      { t: isoDaysAgo(2), event: 'Booked test drive' },
      { t: isoDaysAgo(0.5), event: 'Showed for test drive' },
      { t: isoDaysAgo(0.4), event: 'Dealer email follow-up sent' }
    ] },
  { id: 'l6', name: 'Ana Gutierrez', email: 'ana.g@example.com', phone: '305-555-0177',
    source: 'Chat', vehicleId: 'v6', vehicleLabel: '2022 Porsche Cayenne',
    status: 'New', read: false, createdAt: isoDaysAgo(0.042),
    notes: '',
    timeline: [
      { t: isoDaysAgo(0.083), event: 'Viewed 2022 Porsche Cayenne' },
      { t: isoDaysAgo(0.042), event: 'Started live chat — transcript saved' }
    ] }
];

const SEED_DEALS = [
  { id: 'd1', leadId: 'l3', customerName: 'Carlos Mendez',
    email: 'carlos.mendez@example.com', phone: '305-555-0143',
    vehicleId: 'v2', vehicleLabel: '2022 Mercedes-Benz GLE 350',
    listPrice: 41500, salePrice: 38750,
    trade: { year: 2019, make: 'Honda', model: 'Civic', mileage: 62000, value: 12500 },
    downPayment: 5000, termMonths: 60, apr: 4.9,
    fees: { docFee: 0, tagTitle: 0, dealerPrep: 0 },
    fniProducts: { extWarranty: true, paintProtection: false, windowTint: true, gapInsurance: false, wheelLock: false, maintPlan: false },
    status: 'Working', notes: 'Pulled credit — approved tier 2. Customer wants $400/mo target.',
    createdAt: isoDaysAgo(1.2) }
];

const SEED_FNI_HISTORY = [
  { dealId: 'sold-h1', month: 'May', extWarranty: true, paintProtection: true, windowTint: false, gapInsurance: true, wheelLock: false, maintPlan: false },
  { dealId: 'sold-h2', month: 'May', extWarranty: true, paintProtection: false, windowTint: true, gapInsurance: false, wheelLock: false, maintPlan: true },
  { dealId: 'sold-h3', month: 'May', extWarranty: false, paintProtection: false, windowTint: true, gapInsurance: true, wheelLock: false, maintPlan: false }
];

const SEED_SOLD = [
  { id: 's1', year: 2021, make: 'Toyota', model: 'Camry', trim: 'SE',
    saleDate: '2026-04-28', listedPrice: 24995, salePrice: 23500, cost: 19200,
    daysOnLotAtSale: 18, buyerName: 'Mike Johnson', buyerEmail: 'mike.j@example.com', buyerPhone: '305-555-0234',
    review: { status: 'received', stars: 5, method: 'email', sentAt: isoDaysAgo(2) } },
  { id: 's2', year: 2022, make: 'Honda', model: 'CR-V', trim: 'EX',
    saleDate: '2026-04-25', listedPrice: 29995, salePrice: 28750, cost: 24100,
    daysOnLotAtSale: 22, buyerName: 'Lisa Park', buyerEmail: 'lisa.park@example.com', buyerPhone: '305-555-0291',
    review: { status: 'sent', stars: null, method: 'sms', sentAt: isoDaysAgo(4) } }
];

const isoDays = (d) => new Date(TODAY.getTime() + d * 86400000).toISOString();
const isoAt = (d, h, m = 0) => {
  const dt = new Date(TODAY.getTime() + d * 86400000);
  dt.setUTCHours(h - 4, m, 0, 0); // EDT offset for Miami-ish display
  return dt.toISOString();
};

const SEED_APPOINTMENTS = [
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
    history: 'Purchased here 2026-01' }
];

const SEED_APPT_HISTORY = [
  { id: 'ah1', date: isoAt(-3, 10), customer: 'Robert Diaz', service: 'Oil Change', amount: 89, status: 'Completed' },
  { id: 'ah2', date: isoAt(-5, 9), customer: 'Jennifer Wilson', service: 'Brake Service', amount: 425, status: 'Completed' },
  { id: 'ah3', date: isoAt(-7, 11), customer: 'Tom Reyes', service: 'Transmission Service', amount: 380, status: 'Completed' },
  { id: 'ah4', date: isoAt(-9, 14), customer: 'Priya Patel', service: 'A/C Service', amount: 189, status: 'Completed' },
  { id: 'ah5', date: isoAt(-12, 10), customer: 'Marcus Lee', service: 'Multi-Point Inspection', amount: 79, status: 'No-Show' },
  { id: 'ah6', date: isoAt(-14, 9), customer: 'Elena Vasquez', service: 'Tire Rotation', amount: 39, status: 'Completed' },
  { id: 'ah7', date: isoAt(-16, 11), customer: 'Kevin Wright', service: 'Detailing', amount: 249, status: 'Completed' },
  { id: 'ah8', date: isoAt(-18, 13), customer: 'Aisha Brown', service: 'Diagnostic', amount: 149, status: 'Completed' },
  { id: 'ah9', date: isoAt(-21, 10), customer: 'Diego Santos', service: 'Battery Replacement', amount: 215, status: 'Completed' },
  { id: 'ah10', date: isoAt(-25, 14), customer: 'Hannah Cole', service: 'Brake Inspection', amount: 49, status: 'Completed' },
  { id: 'ah11', date: isoAt(-28, 9), customer: 'Vincent Park', service: 'Oil Change', amount: 89, status: 'No-Show' }
];

const SEED_RESERVATIONS = [
  { id: 'r1', vehicleId: 'v6', customerName: 'Ana Gutierrez',
    phone: '305-555-0177', email: 'ana.g@example.com',
    reservedAt: isoDaysAgo(0.5), expiresAt: isoDays(1.5),
    depositAmount: 500, leadId: 'l6' }
];

const MARKET_PRICES = {
  v1: 44200, v2: 39100, v3: 43800, v4: 30800, v5: 37200, v6: 51400, v7: 60500, v8: 56300
};

const SEED_REVIEWS = [
  { id: 'rv1', author: 'Mike J.', rating: 5, text: "Best used car experience in Miami. Carlos made everything easy. Love my Camry!", date: isoDaysAgo(3), platform: 'Google', responded: false, response: '' },
  { id: 'rv2', author: 'Lisa P.', rating: 5, text: "No pressure, fair price, and they delivered to my door. Will buy here again.", date: isoDaysAgo(7), platform: 'Google', responded: false, response: '' },
  { id: 'rv3', author: 'David C.', rating: 4, text: "Great selection and pricing. Finance took a bit long but overall happy.", date: isoDaysAgo(14), platform: 'Google', responded: true, response: "Thanks David — appreciate the feedback. We've streamlined our finance team since then. Enjoy the Audi!" }
];

const SEED_SETTINGS = {
  dealership: {
    name: 'Primo Auto Group', address: '8420 NW 27th Ave', city: 'Miami', state: 'FL', zip: '33147',
    phone: '305-555-0100', email: 'sales@primoautogroup.com', website: 'primoautogroup.com',
    logoUrl: '',
    hours: {
      Mon: { open: '09:00', close: '20:00', closed: false },
      Tue: { open: '09:00', close: '20:00', closed: false },
      Wed: { open: '09:00', close: '20:00', closed: false },
      Thu: { open: '09:00', close: '20:00', closed: false },
      Fri: { open: '09:00', close: '20:00', closed: false },
      Sat: { open: '10:00', close: '18:00', closed: false },
      Sun: { open: '11:00', close: '17:00', closed: false }
    }
  },
  notifications: {
    emailAlerts: true, alertEmail: 'sales@primoautogroup.com',
    smsAlerts: true, alertPhone: '305-555-0100',
    speedToLead: '15 min',
    autoFollowupEmail: true, autoFollowupSms: false
  },
  pricing: {
    autoDrop3At30: false, autoDrop5At45: true, autoSaleAt60: true
  },
  branding: {
    primaryColor: '#D4AF37', accentColor: '#E8272C', theme: 'Light',
    hablamosEspanol: true
  },
  social: {
    facebook: 'facebook.com/primoautogroup', instagram: 'instagram.com/primoautogroup',
    tiktok: 'tiktok.com/@primoautogroup', youtube: '', google: 'g.page/primoautogroup'
  },
  marketing: {
    autoReviewRequest: true, reviewReminderText: true,
    autoPostFacebook: false, autoPostInstagram: false
  },
  dealerName: 'Marco Esposito'
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const storage = {
  async get(key, fallback) {
    try {
      if (typeof window === 'undefined' || !window.storage) return fallback;
      const raw = await window.storage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch { return fallback; }
  },
  async set(key, value) {
    try {
      if (typeof window === 'undefined' || !window.storage) return;
      await window.storage.setItem(key, JSON.stringify(value));
    } catch {}
  }
};

const fmtMoney = (n, fractionDigits = 0) =>
  n == null || n === '' ? '—'
  : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });

const fmtMiles = (n) =>
  n == null || n === '' ? '—' : Number(n).toLocaleString('en-US') + ' mi';

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const relTime = (iso) => {
  if (!iso) return '—';
  const ms = TODAY.getTime() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`;
  return fmtDate(iso);
};

const calcPayment = (principal, apr, months) => {
  if (!principal || principal <= 0 || !months) return 0;
  const r = (Number(apr) || 0) / 12 / 100;
  if (r === 0) return principal / months;
  return (r * principal) / (1 - Math.pow(1 + r, -months));
};

const dealFinanced = (deal) => {
  const fees = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
  return Math.max(0, (deal.salePrice || 0) + fees - (deal.trade?.value || 0) - (deal.downPayment || 0));
};

const validVin = (v) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(String(v || '').trim());

const downloadFile = (filename, content, mime = 'text/csv') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

const csvEscape = (s) => {
  const v = s == null ? '' : String(s);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
};

const buildCSV = (headers, rows) =>
  [headers.join(','), ...rows.map(r => headers.map(h => csvEscape(r[h])).join(','))].join('\n');

const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const parseLine = (line) => {
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ',') { out.push(cur); cur = ''; }
        else if (c === '"') inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(l => {
    const cells = parseLine(l);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cells[i] ?? ''; });
    return obj;
  });
  return { headers, rows };
};

const newId = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 9);

/* ------------------------------------------------------------------ */
/*  SHARED UI ATOMS                                                    */
/* ------------------------------------------------------------------ */

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
    .font-display { font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif; font-feature-settings: "ss01", "ss02"; }
    .font-ui { font-family: 'Manrope', system-ui, -apple-system, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace; }
    .tabular { font-variant-numeric: tabular-nums; }
    .smallcaps { font-variant: all-small-caps; letter-spacing: 0.08em; }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #d6d2c8; border-radius: 3px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .ring-gold:focus { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px ${GOLD}; }
    @keyframes slide-in { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    .anim-slide { animation: slide-in 240ms cubic-bezier(.2,.8,.2,1) both; }
    @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(195,59,59,0.7) } 50% { box-shadow: 0 0 0 6px rgba(195,59,59,0) } }
    .pulse-dot { animation: pulse-dot 2s infinite; }
  `}</style>
);

const StatusBadge = ({ status, size = 'sm' }) => {
  const map = {
    'Available':     { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'Featured':      { bg: GOLD_SOFT, fg: '#7A5A0F', dot: GOLD },
    'On Sale':       { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT },
    'Just Arrived':  { bg: '#E5EEFB', fg: '#1F4E8C', dot: '#2563A6' },
    'Price Drop':    { bg: '#FCEBDB', fg: '#9C4F1A', dot: '#C66B2D' },
    'Pending':       { bg: '#FBF1D6', fg: '#8A6912', dot: '#C8970F' },
    'Sold':          { bg: '#EDEBE6', fg: '#5C5750', dot: '#8A847A' },
    'New':           { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT },
    'Contacted':     { bg: '#FBF1D6', fg: '#8A6912', dot: '#C8970F' },
    'Appointment Set':{bg: '#E5EEFB', fg: '#1F4E8C', dot: '#2563A6' },
    'Showed':        { bg: '#EFE5F5', fg: '#5E2C82', dot: '#7B3FAA' },
    'Lost':          { bg: '#EDEBE6', fg: '#5C5750', dot: '#8A847A' },
    'New Deal':      { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT },
    'Working':       { bg: GOLD_SOFT, fg: '#7A5A0F', dot: GOLD },
    'Approved':      { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'Delivered':     { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'Confirmed':     { bg: '#E5EEFB', fg: '#1F4E8C', dot: '#2563A6' },
    'In Progress':   { bg: '#FCEBDB', fg: '#9C4F1A', dot: '#C66B2D' },
    'Completed':     { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'No-Show':       { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT },
    'Cancelled':     { bg: '#EDEBE6', fg: '#5C5750', dot: '#8A847A' }
  };
  const s = map[status] || { bg: '#EDEBE6', fg: '#5C5750', dot: '#8A847A' };
  const isFeatured = status === 'Featured';
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'} rounded-full font-semibold smallcaps`}
      style={{ backgroundColor: s.bg, color: s.fg }}>
      {isFeatured ? <Star className="w-3 h-3" fill={s.dot} stroke={s.dot} />
        : <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />}
      {status}
    </span>
  );
};

const Toggle = ({ checked, onChange, label, description, disabled }) => (
  <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <button type="button" disabled={disabled} onClick={() => !disabled && onChange(!checked)}
      className={`relative shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors duration-200`}
      style={{ backgroundColor: checked ? GOLD : '#D6D2C8' }}>
      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
        style={{ left: checked ? '18px' : '2px' }} />
    </button>
    {(label || description) && (
      <div className="flex-1 min-w-0">
        {label && <div className="text-sm font-medium text-stone-900">{label}</div>}
        {description && <div className="text-xs text-stone-500 mt-0.5">{description}</div>}
      </div>
    )}
  </label>
);

const Field = ({ label, hint, required, children, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-[11px] font-semibold smallcaps text-stone-600">
        {label}{required && <span className="text-red-700 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <div className="text-[11px] text-stone-500 leading-snug">{hint}</div>}
  </div>
);

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input ref={ref} {...props}
    className={`w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 ring-gold transition ${className}`} />
));

const Select = ({ children, className = '', ...props }) => (
  <div className="relative">
    <select {...props}
      className={`w-full pl-3 pr-9 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 appearance-none ring-gold ${className}`}>
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
  </div>
);

const Textarea = ({ className = '', ...props }) => (
  <textarea {...props}
    className={`w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 ring-gold resize-y ${className}`} />
);

const Btn = ({ variant = 'default', size = 'md', icon: Icon, children, className = '', ...props }) => {
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2'
  };
  const variants = {
    default: 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50',
    gold: 'text-stone-900 border border-transparent hover:brightness-95',
    dark: 'bg-stone-900 text-white border border-stone-900 hover:bg-stone-800',
    ghost: 'bg-transparent border border-transparent text-stone-700 hover:bg-stone-100',
    outlineGold: 'bg-white border text-stone-900 hover:bg-amber-50',
    danger: 'bg-white border border-red-300 text-red-700 hover:bg-red-50',
    soft: 'bg-stone-100 border border-transparent text-stone-800 hover:bg-stone-200'
  };
  const goldStyle = variant === 'gold' ? { backgroundColor: GOLD } : (variant === 'outlineGold' ? { borderColor: GOLD, color: '#7A5A0F' } : undefined);
  return (
    <button {...props}
      style={goldStyle}
      className={`inline-flex items-center justify-center font-semibold rounded-md transition ring-gold ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} strokeWidth={2.25} />}
      {children}
    </button>
  );
};

const IconBtn = ({ icon: Icon, title, onClick, tone = 'default' }) => {
  const tones = {
    default: 'text-stone-500 hover:text-stone-900 hover:bg-stone-100',
    gold: 'hover:bg-amber-50',
    danger: 'text-stone-500 hover:text-red-700 hover:bg-red-50',
    blue: 'text-stone-500 hover:text-blue-700 hover:bg-blue-50'
  };
  const goldStyle = tone === 'gold' ? { color: '#7A5A0F' } : undefined;
  return (
    <button onClick={onClick} title={title} aria-label={title} style={goldStyle}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition ${tones[tone] || tones.default}`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-stone-200 rounded-lg ${className}`}>{children}</div>
);

const SectionHeader = ({ eyebrow, title, action, className = '' }) => (
  <div className={`flex items-end justify-between mb-4 ${className}`}>
    <div>
      {eyebrow && <div className="text-[10px] font-semibold smallcaps text-stone-500 mb-1">{eyebrow}</div>}
      <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 leading-none">{title}</h2>
    </div>
    {action}
  </div>
);

const VehiclePhoto = ({ vehicle, size = 'md' }) => {
  const sizes = { xs: 'w-12 h-9', sm: 'w-16 h-12', md: 'w-24 h-16', lg: 'w-full aspect-[4/3]' };
  const initials = (vehicle?.make || '?').slice(0, 2).toUpperCase();
  const color = vehicle?.exteriorColor?.toLowerCase() || 'gray';
  const palette = {
    black: 'linear-gradient(135deg,#2c2a26 0%,#1a1815 100%)',
    white: 'linear-gradient(135deg,#fafaf7 0%,#e8e5dd 100%)',
    silver: 'linear-gradient(135deg,#e0ddd5 0%,#b8b3a8 100%)',
    gray: 'linear-gradient(135deg,#9a958a 0%,#6b655b 100%)',
    red: 'linear-gradient(135deg,#a12b2b 0%,#6b1a1a 100%)',
    blue: 'linear-gradient(135deg,#2a4a7a 0%,#1a2e4a 100%)',
    green: 'linear-gradient(135deg,#3a6b4a 0%,#234430 100%)',
    brown: 'linear-gradient(135deg,#7a5a3a 0%,#4a3a25 100%)',
    beige: 'linear-gradient(135deg,#d8cdb8 0%,#b3a48a 100%)',
    gold: `linear-gradient(135deg,${GOLD} 0%,#9a7d28 100%)`
  };
  const bg = palette[color] || palette.gray;
  const isLight = ['white','silver','beige','gold'].includes(color);
  if (vehicle?.photos?.[0]) {
    return (
      <div className={`${sizes[size]} rounded-md overflow-hidden bg-stone-100 shrink-0`}>
        <img src={vehicle.photos[0]} alt="" className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
    );
  }
  return (
    <div className={`${sizes[size]} rounded-md overflow-hidden shrink-0 relative flex items-center justify-center`}
      style={{ background: bg }}>
      <Car className={`${size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.6)' }} strokeWidth={1.5} />
      <span className={`absolute right-1 bottom-0.5 font-display font-medium ${size === 'lg' ? 'text-sm' : 'text-[9px]'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.7)' }}>{initials}</span>
    </div>
  );
};

const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div className="bg-white border border-stone-200 rounded-lg p-4 relative">
    <div className="flex items-start justify-between mb-3">
      <span className="text-[10px] font-semibold smallcaps text-stone-500">{label}</span>
      {Icon && <Icon className="w-4 h-4" style={{ color: accent || '#a8a39a' }} strokeWidth={1.75} />}
    </div>
    <div className="font-display text-3xl font-medium tracking-tight text-stone-900 tabular leading-none">{value}</div>
    {sub && <div className="text-[11px] text-stone-500 mt-2">{sub}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  ROOT COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'inventory',    label: 'Inventory',      icon: Car },
  { id: 'addVehicle',   label: 'Add Vehicle',    icon: Plus },
  { id: 'leads',        label: 'Leads',          icon: Users },
  { id: 'deals',        label: 'Deal Builder',   icon: Calculator },
  { id: 'appointments', label: 'Service',        icon: Wrench },
  { id: 'sold',         label: 'Sold Vehicles',  icon: Archive },
  { id: 'marketing',    label: 'Marketing',      icon: Megaphone },
  { id: 'performance',  label: 'Performance',    icon: Activity },
  { id: 'settings',     label: 'Settings',       icon: SettingsIcon }
];

export default function PrimoAdmin() {
  /* ---------- state ---------- */
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [inventory, setInventory] = useState(SEED_INVENTORY);
  const [leads, setLeads] = useState(SEED_LEADS);
  const [deals, setDeals] = useState(SEED_DEALS);
  const [sold, setSold] = useState(SEED_SOLD);
  const [settings, setSettings] = useState(SEED_SETTINGS);
  const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);
  const [reservations, setReservations] = useState(SEED_RESERVATIONS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [toast, setToast] = useState(null);

  /* ---------- load on mount ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [inv, lds, dls, sld, st, apts, rsvs, rvws] = await Promise.all([
        storage.get('primo-inventory', null),
        storage.get('primo-leads', null),
        storage.get('primo-deals', null),
        storage.get('primo-sold', null),
        storage.get('primo-settings', null),
        storage.get('primo-appointments', null),
        storage.get('primo-reservations', null),
        storage.get('primo-reviews', null)
      ]);
      if (!mounted) return;
      if (inv) setInventory(inv); else await storage.set('primo-inventory', SEED_INVENTORY);
      if (lds) setLeads(lds); else await storage.set('primo-leads', SEED_LEADS);
      if (dls) setDeals(dls); else await storage.set('primo-deals', SEED_DEALS);
      if (sld) setSold(sld); else await storage.set('primo-sold', SEED_SOLD);
      if (st) setSettings(st); else await storage.set('primo-settings', SEED_SETTINGS);
      if (apts) setAppointments(apts); else await storage.set('primo-appointments', SEED_APPOINTMENTS);
      if (rsvs) setReservations(rsvs); else await storage.set('primo-reservations', SEED_RESERVATIONS);
      if (rvws) setReviews(rvws); else await storage.set('primo-reviews', SEED_REVIEWS);
      setLoaded(true);
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- save effects ---------- */
  useEffect(() => { if (loaded) storage.set('primo-inventory', inventory); }, [inventory, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-leads', leads); }, [leads, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-deals', deals); }, [deals, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-sold', sold); }, [sold, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-settings', settings); }, [settings, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-appointments', appointments); }, [appointments, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-reservations', reservations); }, [reservations, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-reviews', reviews); }, [reviews, loaded]);

  /* ---------- reservation auto-expire (runs every 30s) ---------- */
  useEffect(() => {
    if (!loaded) return;
    const tick = () => {
      const now = Date.now();
      const expired = reservations.filter(r => new Date(r.expiresAt).getTime() < now);
      if (expired.length > 0) {
        setReservations(arr => arr.filter(r => new Date(r.expiresAt).getTime() >= now));
        flash(`${expired.length} reservation${expired.length === 1 ? '' : 's'} expired — vehicles released`);
      }
    };
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [reservations, loaded]);

  /* ---------- toast ---------- */
  const flash = useCallback((msg, tone = 'default') => {
    setToast({ msg, tone, id: Date.now() });
    setTimeout(() => setToast(t => (t?.msg === msg ? null : t)), 2400);
  }, []);

  /* ---------- mutations ---------- */
  const updateVehicle = (id, patch) => setInventory(arr => arr.map(v => v.id === id ? { ...v, ...patch } : v));
  const removeVehicle = (id) => setInventory(arr => arr.filter(v => v.id !== id));
  const addVehicle = (v) => setInventory(arr => [{ ...v, id: newId('v') }, ...arr]);

  const markSoldVehicle = (id, buyerName, finalSalePrice) => {
    const v = inventory.find(x => x.id === id);
    if (!v) return;
    const sale = {
      id: newId('s'),
      year: v.year, make: v.make, model: v.model, trim: v.trim,
      saleDate: new Date(TODAY).toISOString().slice(0, 10),
      listedPrice: v.listPrice,
      salePrice: finalSalePrice ?? (v.salePrice ?? v.listPrice),
      cost: v.cost,
      daysOnLotAtSale: v.daysOnLot,
      buyerName: buyerName || 'Walk-in Buyer',
      buyerEmail: '', buyerPhone: '',
      review: { status: 'not-sent', stars: null, method: 'email', sentAt: null }
    };
    setSold(arr => [sale, ...arr]);
    removeVehicle(id);
    flash('Vehicle marked as sold');
  };

  const restoreSold = (id) => {
    const s = sold.find(x => x.id === id);
    if (!s) return;
    const v = {
      id: newId('v'),
      year: s.year, make: s.make, model: s.model, trim: s.trim, bodyStyle: 'SUV',
      cost: s.cost, listPrice: s.listedPrice, salePrice: null, mileage: 0,
      exteriorColor: 'Gray', interiorColor: 'Black', engine: '', transmission: 'Automatic',
      drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 0, mpgHwy: 0, vin: '',
      stockNumber: 'R-' + Math.floor(Math.random()*9999), status: 'Available',
      daysOnLot: 0, views: 0,
      history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false },
      description: '', photos: [], dateAdded: new Date(TODAY).toISOString()
    };
    setInventory(arr => [v, ...arr]);
    setSold(arr => arr.filter(x => x.id !== id));
    flash('Sold vehicle restored to inventory');
  };

  /* ---------- derived ---------- */
  const unreadLeads = useMemo(() => leads.filter(l => !l.read).length, [leads]);
  const featuredCount = useMemo(() => inventory.filter(v => v.status === 'Featured').length, [inventory]);
  const onSaleCount = useMemo(() => inventory.filter(v => v.status === 'On Sale' || v.status === 'Price Drop').length, [inventory]);
  const soldThisMonth = useMemo(() => {
    const m = TODAY.getMonth(), y = TODAY.getFullYear();
    return sold.filter(s => { const d = new Date(s.saleDate); return d.getMonth() === m && d.getFullYear() === y; }).length;
  }, [sold]);
  const pendingAppts = useMemo(() => appointments.filter(a => a.status === 'Pending').length, [appointments]);
  const reservationCount = reservations.length;

  /* ---------- reservation helpers ---------- */
  const releaseReservation = (id) => {
    setReservations(arr => arr.filter(r => r.id !== id));
    flash('Reservation released');
  };
  const extendReservation = (id) => {
    setReservations(arr => arr.map(r => r.id === id
      ? { ...r, expiresAt: new Date(new Date(r.expiresAt).getTime() + 24 * 3600 * 1000).toISOString() }
      : r));
    flash('Hold extended by 24 hours');
  };
  const confirmReservation = (id) => {
    const r = reservations.find(x => x.id === id);
    if (!r) return;
    setLeads(arr => arr.map(l => l.id === r.leadId ? { ...l, status: 'Appointment Set' } : l));
    setReservations(arr => arr.filter(x => x.id !== id));
    flash(`${r.customerName} confirmed — moved to Appointments Set`);
  };

  /* ---------- nav badge map ---------- */
  const navBadges = {
    leads: unreadLeads,
    appointments: pendingAppts
  };

  /* ---------- render ---------- */
  return (
    <div className="font-ui bg-stone-50 text-stone-900 min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <FontStyles />

      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="flex items-center h-14 px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarCollapsed(c => !c)}
            className="p-1.5 rounded hover:bg-stone-100 lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-sm flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #9a7d28 100%)` }}>
              <span className="font-display font-bold text-[13px] text-white">P</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[15px] font-semibold tracking-tight">Primo Auto Group</span>
                <span className="text-stone-300 hidden sm:inline">/</span>
                <span className="text-[12px] smallcaps text-stone-500 hidden sm:inline">Dealer Dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 text-xs text-stone-600">
            <span className="smallcaps text-stone-400">Signed in as</span>
            <span className="font-medium text-stone-900">{settings.dealerName || 'Dealer'}</span>
          </div>

          <button className="relative p-2 rounded hover:bg-stone-100" onClick={() => setActiveTab('leads')}
            title="Notifications">
            <Bell className="w-4 h-4 text-stone-700" strokeWidth={2} />
            {unreadLeads > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center pulse-dot"
                style={{ backgroundColor: RED_ACCENT }}>{unreadLeads}</span>
            )}
          </button>

          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-semibold text-stone-700">
            {(settings.dealerName || 'M E').split(' ').map(p => p[0]).slice(0, 2).join('')}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`sticky top-14 self-start h-[calc(100vh-3.5rem)] bg-white border-r border-stone-200 z-20 transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-56'}`}>
          <nav className="py-3 px-2 flex flex-col gap-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const badgeCount = navBadges[item.id] || 0;
              const showBadge = badgeCount > 0;
              const badgeColor = item.id === 'appointments' ? '#C8970F' : RED_ACCENT;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition relative ${isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'}`}>
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.25 : 1.85}
                    style={isActive ? { color: GOLD } : {}} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {showBadge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: badgeColor, color: 'white' }}>{badgeCount}</span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && showBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: badgeColor }} />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-stone-200 p-3">
            <button onClick={() => setSidebarCollapsed(c => !c)}
              className="w-full flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition">
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {!loaded ? (
            <div className="p-12 text-center text-stone-500 text-sm">Loading dashboard…</div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab
                inventory={inventory} leads={leads} sold={sold} settings={settings}
                setSettings={setSettings} updateVehicle={updateVehicle}
                reservations={reservations}
                onConfirmReservation={confirmReservation}
                onExtendReservation={extendReservation}
                onReleaseReservation={releaseReservation}
                onAdd={() => { setEditingVehicleId(null); setActiveTab('addVehicle'); }}
                onEdit={(id) => { setEditingVehicleId(id); setActiveTab('addVehicle'); }}
                soldThisMonth={soldThisMonth} featuredCount={featuredCount}
                onSaleCount={onSaleCount} unreadLeads={unreadLeads}
                reservationCount={reservationCount}
                flash={flash}
                onOpenLeads={() => setActiveTab('leads')}
              />}
              {activeTab === 'inventory' && <InventoryTab
                inventory={inventory} setInventory={setInventory} updateVehicle={updateVehicle}
                removeVehicle={removeVehicle} markSold={markSoldVehicle}
                reservations={reservations} onReleaseReservation={releaseReservation}
                onEdit={(id) => { setEditingVehicleId(id); setActiveTab('addVehicle'); }}
                onAdd={() => { setEditingVehicleId(null); setActiveTab('addVehicle'); }}
                flash={flash}
              />}
              {activeTab === 'addVehicle' && <VehicleFormTab
                vehicle={editingVehicleId ? inventory.find(v => v.id === editingVehicleId) : null}
                onSave={(v, addAnother) => {
                  if (editingVehicleId) {
                    updateVehicle(editingVehicleId, v);
                    flash('Vehicle updated');
                    if (!addAnother) { setEditingVehicleId(null); setActiveTab('inventory'); }
                  } else {
                    addVehicle(v);
                    flash('Vehicle added');
                    if (!addAnother) setActiveTab('inventory');
                  }
                  if (addAnother) setEditingVehicleId(null);
                }}
                onCancel={() => { setEditingVehicleId(null); setActiveTab('inventory'); }}
              />}
              {activeTab === 'leads' && <LeadsTab
                leads={leads} setLeads={setLeads} inventory={inventory}
                settings={settings} setSettings={setSettings}
                onConvertToDeal={(lead) => {
                  const veh = inventory.find(v => v.id === lead.vehicleId);
                  const deal = {
                    id: newId('d'), leadId: lead.id, customerName: lead.name,
                    email: lead.email, phone: lead.phone,
                    vehicleId: lead.vehicleId, vehicleLabel: lead.vehicleLabel,
                    listPrice: veh?.listPrice || 0, salePrice: veh?.salePrice || veh?.listPrice || 0,
                    trade: lead.tradeInfo
                      ? { ...lead.tradeInfo, value: 0 }
                      : { year: '', make: '', model: '', mileage: 0, value: 0 },
                    downPayment: 0, termMonths: 60, apr: 6.9,
                    fees: { docFee: 599, tagTitle: 350, dealerPrep: 299 },
                    status: 'New Deal', notes: '',
                    createdAt: new Date(TODAY).toISOString()
                  };
                  setDeals(arr => [deal, ...arr]);
                  setActiveTab('deals');
                  flash('Lead converted to deal');
                }}
                flash={flash}
              />}
              {activeTab === 'deals' && <DealsTab
                deals={deals} setDeals={setDeals} inventory={inventory}
                onMarkSold={(deal) => {
                  if (deal.vehicleId) markSoldVehicle(deal.vehicleId, deal.customerName, deal.salePrice);
                  setDeals(arr => arr.map(d => d.id === deal.id ? { ...d, status: 'Delivered' } : d));
                }}
                flash={flash}
              />}
              {activeTab === 'appointments' && <AppointmentsTab
                appointments={appointments} setAppointments={setAppointments}
                flash={flash}
              />}
              {activeTab === 'sold' && <SoldTab
                sold={sold} setSold={setSold}
                onRestore={restoreSold}
                flash={flash}
              />}
              {activeTab === 'marketing' && <MarketingTab
                inventory={inventory} setInventory={setInventory}
                settings={settings} setSettings={setSettings}
                sold={sold}
                reviews={reviews} setReviews={setReviews}
                flash={flash}
              />}
              {activeTab === 'performance' && <PerformanceTab inventory={inventory} />}
              {activeTab === 'settings' && <SettingsTab
                settings={settings} setSettings={setSettings} flash={flash}
              />}
            </>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 anim-slide">
          <div className="bg-stone-900 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 text-sm">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

/* ====================== DASHBOARD TAB ============================ */

function DashboardTab({ inventory, leads, sold, settings, setSettings, updateVehicle,
  reservations, onConfirmReservation, onExtendReservation, onReleaseReservation,
  reservationCount,
  onAdd, onEdit, soldThisMonth, featuredCount, onSaleCount, unreadLeads, flash, onOpenLeads }) {

  const websiteViews = useMemo(() => 14728 + inventory.reduce((s, v) => s + (v.views || 0), 0), [inventory]);

  const aging = useMemo(() => {
    return inventory
      .filter(v => v.status !== 'Sold' && v.daysOnLot >= 30)
      .sort((a, b) => b.daysOnLot - a.daysOnLot);
  }, [inventory]);

  const mostViewed = useMemo(() =>
    [...inventory].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [inventory]);

  const recentLeads = useMemo(() =>
    [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [leads]);

  const tier = (days) => {
    if (days >= 60) return { color: '#A12B2B', bg: '#FBE6E6', label: 'ACTION NEEDED' };
    if (days >= 45) return { color: '#9C4F1A', bg: '#FCEBDB', label: 'AGING' };
    if (days >= 30) return { color: '#8A6912', bg: '#FBF1D6', label: 'WATCH' };
    return null;
  };

  const dropPrice = (v, pct) => {
    const newPrice = Math.round(v.listPrice * (1 - pct / 100) / 5) * 5;
    updateVehicle(v.id, { listPrice: newPrice, status: 'Price Drop' });
    flash(`Price dropped on ${v.year} ${v.make} ${v.model}`);
  };
  const putOnSale = (v) => {
    const sale = Math.round(v.listPrice * 0.93 / 5) * 5;
    updateVehicle(v.id, { salePrice: sale, status: 'On Sale' });
    flash(`${v.year} ${v.make} ${v.model} put on sale`);
  };
  const featureIt = (v) => {
    updateVehicle(v.id, { status: 'Featured' });
    flash(`${v.year} ${v.make} ${v.model} featured`);
  };
  const exportToFB = (v) => {
    flash(`Export queued: ${v.year} ${v.make} ${v.model} → Facebook Marketplace`);
  };

  const ruleAffected = {
    rule30: inventory.filter(v => v.daysOnLot >= 30 && v.daysOnLot < 45).length,
    rule45: inventory.filter(v => v.daysOnLot >= 45 && v.daysOnLot < 60).length,
    rule60: inventory.filter(v => v.daysOnLot >= 60).length
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[10px] font-semibold smallcaps text-stone-500 mb-1.5">
            {new Date(TODAY).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-stone-900 leading-[1.05]">
            Welcome back, <em className="not-italic" style={{ color: GOLD }}>{(settings.dealerName || 'Dealer').split(' ')[0]}</em>.
          </h1>
          <p className="text-stone-500 mt-2 text-sm">
            {unreadLeads > 0
              ? `You have ${unreadLeads} new lead${unreadLeads === 1 ? '' : 's'} and ${aging.filter(v => v.daysOnLot >= 60).length} vehicle${aging.filter(v => v.daysOnLot >= 60).length === 1 ? '' : 's'} that need attention.`
              : 'Your lot is in good shape today.'}
          </p>
        </div>
        <Btn variant="gold" size="lg" icon={Plus} onClick={onAdd}>Add New Vehicle</Btn>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total Vehicles" value={inventory.length} icon={Car} />
        <StatCard label="Featured" value={featuredCount} icon={Star} accent={GOLD} />
        <StatCard label="On Sale" value={onSaleCount} icon={Tag} accent={RED_ACCENT} />
        <StatCard label="Sold This Month" value={soldThisMonth} icon={Award} accent="#2F7A4A" />
        <StatCard label="Active Leads"
          value={<span>{unreadLeads}<span className="text-stone-400 text-xl"> / {leads.length}</span></span>}
          icon={Users} accent={unreadLeads ? RED_ACCENT : '#a8a39a'}
          sub={unreadLeads ? `${unreadLeads} unread` : 'all read'} />
        <StatCard label="Reservations" value={reservationCount}
          icon={Timer} accent={reservationCount ? GOLD : '#a8a39a'}
          sub={reservationCount ? 'on 48-hr hold' : 'none active'} />
      </div>

      <div className="mb-8 grid lg:grid-cols-4 gap-3">
        <StatCard label="Website Views" value={websiteViews.toLocaleString()} icon={Eye} sub="last 30 days" />
        <StatCard label="Avg Days to Sell" value="22 days" icon={Clock} sub="industry avg: 38" />
        <StatCard label="Lead → Sale Rate" value="14.2%" icon={TrendingUp} accent="#2F7A4A" sub="↑ 2.4% MoM" />
        <StatCard label="Avg Gross Profit" value="$4,475" icon={DollarSign} accent={GOLD} />
      </div>

      {/* MARKET PRICING INTELLIGENCE */}
      <Card className="overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"
          style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.06), transparent)' }}>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-stone-700" />
            <h3 className="font-display text-lg font-medium tracking-tight">Market Pricing Intelligence</h3>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold smallcaps"
              style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Live Data</span>
          </div>
          <div className="flex items-center gap-3">
            {(() => {
              const above = inventory.filter(v => MARKET_PRICES[v.id] && (v.salePrice || v.listPrice) > MARKET_PRICES[v.id]).length;
              const score = Math.max(0, Math.min(100, 100 - above * 4));
              return (
                <>
                  <div className="text-right">
                    <div className="text-[9px] smallcaps text-stone-500">Competitiveness</div>
                    <div className="font-display tabular text-lg font-semibold" style={{ color: score >= 80 ? '#2F7A4A' : score >= 60 ? GOLD : RED_ACCENT }}>
                      {score}<span className="text-xs text-stone-400">/100</span>
                    </div>
                  </div>
                  {above > 0 && (
                    <span className="text-[10px] font-semibold smallcaps px-2 py-1 rounded-full" style={{ backgroundColor: '#FBE6E6', color: '#A12B2B' }}>
                      {above} above market
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-5 py-2.5 text-left">Vehicle</th>
                <th className="px-2 py-2.5 text-right">Your Price</th>
                <th className="px-2 py-2.5 text-right">Market Avg</th>
                <th className="px-2 py-2.5 text-right">Variance</th>
                <th className="px-5 py-2.5 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventory.filter(v => MARKET_PRICES[v.id]).map(v => {
                const yours = v.salePrice || v.listPrice;
                const mkt = MARKET_PRICES[v.id];
                const diff = yours - mkt;
                const pct = (diff / mkt) * 100;
                const above = pct > 0;
                return (
                  <tr key={v.id} className="hover:bg-stone-50 transition">
                    <td className="px-5 py-2.5">
                      <button onClick={() => onEdit(v.id)} className="font-medium text-sm hover:underline text-left">
                        {v.year} {v.make} {v.model}
                      </button>
                    </td>
                    <td className="px-2 py-2.5 text-right tabular font-semibold">{fmtMoney(yours)}</td>
                    <td className="px-2 py-2.5 text-right tabular text-stone-500">{fmtMoney(mkt)}</td>
                    <td className="px-2 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular"
                        style={above ? { backgroundColor: '#FBE6E6', color: '#A12B2B' } : { backgroundColor: '#E8F2EC', color: '#256B40' }}>
                        {above ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(pct).toFixed(1)}% {above ? 'above' : 'below'}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-[12px]">
                      {above && pct > 3 ? (
                        <span className="text-stone-700">Consider price drop — currently {Math.abs(pct).toFixed(1)}% over market</span>
                      ) : above ? (
                        <span className="text-stone-500">Slightly above — monitor</span>
                      ) : pct < -3 ? (
                        <span className="text-stone-700" style={{ color: '#256B40' }}>Strong value — consider featuring</span>
                      ) : (
                        <span className="text-stone-500">Competitively priced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          Market data updates daily from Cars.com, AutoTrader & CarGurus aggregates. Powered by <strong className="text-stone-700">AIandWEBservices</strong>.
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — aging + autopilot (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aging Inventory */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h3 className="font-display text-lg font-medium tracking-tight">Aging Inventory Alerts</h3>
                <span className="text-xs text-stone-500">{aging.length} vehicle{aging.length === 1 ? '' : 's'}</span>
              </div>
              <span className="text-[10px] smallcaps text-stone-400">30+ days on lot</span>
            </div>
            {aging.length === 0 ? (
              <div className="p-8 text-center text-sm text-stone-500">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-stone-300" />
                Nothing aging — your lot is moving.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {aging.map(v => {
                  const t = tier(v.daysOnLot);
                  return (
                    <div key={v.id} className="px-5 py-4 flex items-center gap-4 hover:bg-stone-50 transition">
                      <VehiclePhoto vehicle={v} size="sm" />
                      <div className="flex-1 min-w-0">
                        <button onClick={() => onEdit(v.id)} className="font-medium text-sm text-stone-900 hover:underline text-left">
                          {v.year} {v.make} {v.model} <span className="text-stone-400 font-normal">— {v.trim}</span>
                        </button>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 tabular">
                          <span className="font-medium text-stone-700">{fmtMoney(v.salePrice || v.listPrice)}</span>
                          <span>·</span>
                          <span>{fmtMiles(v.mileage)}</span>
                          <span>·</span>
                          <span>Stock {v.stockNumber}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: t.color }}>
                          {v.daysOnLot}<span className="text-xs ml-0.5">d</span>
                        </div>
                        <div className="text-[10px] font-bold smallcaps mt-1" style={{ color: t.color }}>{t.label}</div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <div className="flex gap-1.5">
                          <Btn size="sm" variant="default" onClick={() => dropPrice(v, 5)}>−5%</Btn>
                          <Btn size="sm" variant="outlineGold" onClick={() => putOnSale(v)} icon={Tag}>Sale</Btn>
                        </div>
                        <div className="flex gap-1.5">
                          <Btn size="sm" variant="ghost" onClick={() => featureIt(v)} icon={Star}>Feature</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => exportToFB(v)} icon={Share2}>FB</Btn>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Price Autopilot */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.06), transparent)' }}>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4" style={{ color: GOLD }} fill={GOLD} strokeWidth={2} />
                <h3 className="font-display text-lg font-medium tracking-tight">Price Autopilot Rules</h3>
              </div>
              <span className="text-[10px] smallcaps font-semibold" style={{ color: GOLD }}>AI-POWERED</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'autoDrop3At30', label: 'Auto-drop 3% at 30 days', count: ruleAffected.rule30, desc: 'Gentle nudge for vehicles starting to age' },
                { key: 'autoDrop5At45', label: 'Auto-drop 5% at 45 days', count: ruleAffected.rule45, desc: 'Stronger reduction to drive interest' },
                { key: 'autoSaleAt60',  label: 'Auto-mark On Sale at 60 days', count: ruleAffected.rule60, desc: 'Apply 7% sale discount and add red banner' }
              ].map(rule => (
                <div key={rule.key} className="flex items-center gap-4 p-3 rounded-md hover:bg-stone-50 transition">
                  <Toggle checked={!!settings.pricing[rule.key]}
                    onChange={(v) => setSettings(s => ({ ...s, pricing: { ...s.pricing, [rule.key]: v } }))} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-900">{rule.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{rule.desc}</div>
                  </div>
                  <div className="text-right shrink-0 px-3">
                    <div className="font-display tabular text-xl font-medium" style={{ color: rule.count > 0 ? GOLD : '#a8a39a' }}>
                      {rule.count}
                    </div>
                    <div className="text-[10px] smallcaps text-stone-500">vehicle{rule.count === 1 ? '' : 's'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Most Viewed */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-stone-700" />
                <h3 className="font-display text-lg font-medium tracking-tight">Most Viewed Vehicles</h3>
              </div>
              <span className="text-[10px] smallcaps text-stone-400">last 30 days</span>
            </div>
            <div className="divide-y divide-stone-100">
              {mostViewed.map((v, i) => {
                const max = mostViewed[0]?.views || 1;
                const pct = ((v.views || 0) / max) * 100;
                return (
                  <div key={v.id} className="px-5 py-3 flex items-center gap-4 hover:bg-stone-50">
                    <span className="font-display tabular text-sm w-5 text-stone-400">{i + 1}</span>
                    <VehiclePhoto vehicle={v} size="xs" />
                    <button onClick={() => onEdit(v.id)} className="flex-1 min-w-0 text-left text-sm font-medium hover:underline">
                      {v.year} {v.make} {v.model}
                    </button>
                    <div className="hidden md:block w-32">
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: pct + '%', backgroundColor: GOLD }} />
                      </div>
                    </div>
                    <div className="font-display tabular text-sm font-medium w-16 text-right">
                      {(v.views || 0).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT — recent leads (1/3) */}
        <div className="space-y-6">
          {/* Active Reservations */}
          {reservations && reservations.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between"
                style={{ background: `linear-gradient(to right, ${GOLD}15, transparent)` }}>
                <div className="flex items-center gap-2.5">
                  <Timer className="w-4 h-4" style={{ color: GOLD }} />
                  <h3 className="font-display text-lg font-medium tracking-tight">Active Reservations</h3>
                </div>
                <span className="text-[10px] smallcaps font-semibold" style={{ color: GOLD }}>48-HR HOLDS</span>
              </div>
              <div className="divide-y divide-stone-100">
                {reservations.map(r => {
                  const veh = inventory.find(v => v.id === r.vehicleId);
                  const remaining = new Date(r.expiresAt).getTime() - Date.now();
                  const totalHold = 48 * 3600 * 1000;
                  const elapsed = totalHold - remaining;
                  const pct = Math.max(0, Math.min(100, (elapsed / totalHold) * 100));
                  const hours = Math.floor(remaining / 3600000);
                  const mins = Math.floor((remaining % 3600000) / 60000);
                  const urgent = hours < 12;
                  return (
                    <div key={r.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{veh ? `${veh.year} ${veh.make} ${veh.model}` : 'Vehicle removed'}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{r.customerName} · {r.phone}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display tabular text-base font-semibold" style={{ color: urgent ? RED_ACCENT : GOLD }}>
                            {hours}h {mins}m
                          </div>
                          <div className="text-[9px] smallcaps text-stone-400">remaining</div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: pct + '%', backgroundColor: urgent ? RED_ACCENT : GOLD }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-3">
                        <DollarSign className="w-3 h-3" />
                        <span className="tabular">{fmtMoney(r.depositAmount)}</span>
                        <span>deposit · reserved {relTime(r.reservedAt)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <Btn size="sm" variant="gold" onClick={() => onConfirmReservation(r.id)}>Confirm</Btn>
                        <Btn size="sm" variant="default" onClick={() => onExtendReservation(r.id)}>+24h</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => onReleaseReservation(r.id)}>Release</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-stone-700" />
                <h3 className="font-display text-lg font-medium tracking-tight">Recent Leads</h3>
              </div>
              <button onClick={onOpenLeads} className="text-[11px] smallcaps font-semibold text-stone-500 hover:text-stone-900">
                View all <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>
            <div className="divide-y divide-stone-100">
              {recentLeads.map(l => (
                <button key={l.id} onClick={onOpenLeads}
                  className="w-full text-left px-5 py-3.5 hover:bg-stone-50 transition flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${l.read ? 'font-medium' : 'font-bold'} text-stone-900 truncate`}>{l.name}</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="smallcaps font-semibold" style={{ color: GOLD }}>{l.source}</span>
                    <span>·</span>
                    <span className="truncate">{l.vehicleLabel}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 tabular">{relTime(l.createdAt)}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick stats sidebar */}
          <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
            <div className="relative">
              <div className="text-[10px] font-semibold smallcaps mb-2" style={{ color: GOLD }}>Speed to Lead</div>
              <div className="font-display text-3xl font-medium tracking-tight leading-none">
                4<span className="text-base text-stone-400 ml-1">min avg</span>
              </div>
              <div className="text-xs text-stone-300 mt-3 leading-relaxed">
                Industry average is <span className="text-white font-medium">47 minutes</span>. You're responding 12× faster — that's why your close rate is up.
              </div>
              <div className="mt-4 pt-4 border-t border-stone-700 flex items-center justify-between">
                <div>
                  <div className="font-display tabular text-xl font-medium">73%</div>
                  <div className="text-[10px] smallcaps text-stone-400">close rate</div>
                </div>
                <div>
                  <div className="font-display tabular text-xl font-medium">{leads.length}</div>
                  <div className="text-[10px] smallcaps text-stone-400">leads MTD</div>
                </div>
                <div>
                  <div className="font-display tabular text-xl font-medium">$4,475</div>
                  <div className="text-[10px] smallcaps text-stone-400">avg gross</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ====================== INVENTORY TAB ============================ */

function InventoryTab({ inventory, setInventory, updateVehicle, removeVehicle, markSold, onEdit, onAdd, flash, reservations = [], onReleaseReservation }) {
  const reservedMap = useMemo(() => {
    const m = new Map();
    reservations.forEach(r => m.set(r.vehicleId, r));
    return m;
  }, [reservations]);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('dateAdded');
  const [sortDir, setSortDir] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMake, setFilterMake] = useState('all');
  const [filterBody, setFilterBody] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null);
  const [bulkValue, setBulkValue] = useState('');
  const [bulkBuyer, setBulkBuyer] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let arr = inventory.filter(v => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [v.make, v.model, v.trim, v.vin, v.stockNumber, String(v.year)].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (filterMake !== 'all' && v.make !== filterMake) return false;
      if (filterBody !== 'all' && v.bodyStyle !== filterBody) return false;
      const price = v.salePrice || v.listPrice;
      if (priceRange === '<25k' && price >= 25000) return false;
      if (priceRange === '25-40k' && (price < 25000 || price >= 40000)) return false;
      if (priceRange === '40-55k' && (price < 40000 || price >= 55000)) return false;
      if (priceRange === '55k+' && price < 55000) return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      const ka = sortKey === 'price' ? (a.salePrice || a.listPrice) :
                 sortKey === 'dateAdded' ? new Date(a.dateAdded).getTime() :
                 sortKey === 'mileage' ? a.mileage :
                 sortKey === 'daysOnLot' ? a.daysOnLot :
                 sortKey === 'views' ? (a.views || 0) :
                 sortKey === 'status' ? STATUSES.indexOf(a.status) :
                 0;
      const kb = sortKey === 'price' ? (b.salePrice || b.listPrice) :
                 sortKey === 'dateAdded' ? new Date(b.dateAdded).getTime() :
                 sortKey === 'mileage' ? b.mileage :
                 sortKey === 'daysOnLot' ? b.daysOnLot :
                 sortKey === 'views' ? (b.views || 0) :
                 sortKey === 'status' ? STATUSES.indexOf(b.status) :
                 0;
      return (ka - kb) * dir;
    });
    return arr;
  }, [inventory, search, sortKey, sortDir, filterStatus, filterMake, filterBody, priceRange]);

  const allSelected = filtered.length > 0 && filtered.every(v => selected.has(v.id));
  const toggleAll = () => {
    if (allSelected) {
      const ns = new Set(selected); filtered.forEach(v => ns.delete(v.id)); setSelected(ns);
    } else {
      const ns = new Set(selected); filtered.forEach(v => ns.add(v.id)); setSelected(ns);
    }
  };
  const toggleOne = (id) => {
    const ns = new Set(selected);
    if (ns.has(id)) ns.delete(id); else ns.add(id);
    setSelected(ns);
  };

  const applyBulk = () => {
    const ids = Array.from(selected);
    if (bulkAction === 'sale') {
      const v = parseFloat(bulkValue) || 0;
      const isPct = bulkValue.toString().includes('%') || (bulkValue && parseFloat(bulkValue) <= 100 && !bulkValue.includes('$'));
      setInventory(arr => arr.map(item => {
        if (!ids.includes(item.id)) return item;
        const sale = isPct
          ? Math.round(item.listPrice * (1 - v / 100) / 5) * 5
          : Math.max(0, item.listPrice - v);
        return { ...item, salePrice: sale, status: 'On Sale' };
      }));
      flash(`${ids.length} vehicles marked on sale`);
    } else if (bulkAction === 'removeSale') {
      setInventory(arr => arr.map(item => ids.includes(item.id) ? { ...item, salePrice: null, status: item.status === 'On Sale' || item.status === 'Price Drop' ? 'Available' : item.status } : item));
      flash(`Sale removed from ${ids.length} vehicles`);
    } else if (bulkAction === 'sold') {
      const list = inventory.filter(v => ids.includes(v.id));
      list.forEach(v => markSold(v.id, bulkBuyer || 'Walk-in Buyer'));
    } else if (bulkAction === 'feature') {
      setInventory(arr => arr.map(item => ids.includes(item.id) ? { ...item, status: 'Featured' } : item));
      flash(`${ids.length} vehicles featured`);
    } else if (bulkAction === 'delete') {
      setInventory(arr => arr.filter(item => !ids.includes(item.id)));
      flash(`${ids.length} vehicles deleted`);
    } else if (bulkAction === 'csv') {
      const headers = ['year','make','model','trim','listPrice','salePrice','mileage','vin','stockNumber','status','daysOnLot'];
      const rows = inventory.filter(v => ids.includes(v.id));
      downloadFile('primo-inventory.csv', buildCSV(headers, rows));
      flash(`Exported ${ids.length} vehicles to CSV`);
    } else if (bulkAction === 'fb') {
      const headers = ['title','price','description','condition','availability','category','image_url','vehicle_year','vehicle_make','vehicle_model','vehicle_trim','vehicle_mileage','vehicle_vin','address'];
      const rows = inventory.filter(v => ids.includes(v.id)).map(v => ({
        title: `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim(),
        price: v.salePrice || v.listPrice,
        description: v.description,
        condition: 'used', availability: 'in stock', category: 'vehicles',
        image_url: v.photos?.[0] || '',
        vehicle_year: v.year, vehicle_make: v.make, vehicle_model: v.model,
        vehicle_trim: v.trim, vehicle_mileage: v.mileage, vehicle_vin: v.vin,
        address: 'Miami, FL'
      }));
      downloadFile('primo-facebook-marketplace.csv', buildCSV(headers, rows));
      flash(`Exported ${ids.length} vehicles to Facebook format`);
    }
    setSelected(new Set());
    setBulkAction(null);
    setBulkValue('');
    setBulkBuyer('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1500px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-stone-900">Inventory</h1>
          <p className="text-sm text-stone-500 mt-1">
            {filtered.length} of {inventory.length} vehicles · {fmtMoney(filtered.reduce((s, v) => s + (v.salePrice || v.listPrice), 0))} total value
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-stone-100 rounded-md p-0.5">
            <button onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${view === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              List
            </button>
            <button onClick={() => setView('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded ${view === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              Grid
            </button>
          </div>
          <Btn variant="gold" icon={Plus} onClick={onAdd}>Add Vehicle</Btn>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, VIN, stock #…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs w-32">
            <option value="all">All status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterMake} onChange={(e) => setFilterMake(e.target.value)} className="text-xs w-32">
            <option value="all">All makes</option>
            {Array.from(new Set(inventory.map(v => v.make))).sort().map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select value={filterBody} onChange={(e) => setFilterBody(e.target.value)} className="text-xs w-32">
            <option value="all">All body styles</option>
            {BODY_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="text-xs w-32">
            <option value="all">Any price</option>
            <option value="<25k">Under $25k</option>
            <option value="25-40k">$25k–$40k</option>
            <option value="40-55k">$40k–$55k</option>
            <option value="55k+">$55k+</option>
          </Select>
          <div className="w-px h-6 bg-stone-200 mx-1" />
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="text-xs w-36">
            <option value="dateAdded">Sort: Date Added</option>
            <option value="price">Sort: Price</option>
            <option value="mileage">Sort: Mileage</option>
            <option value="daysOnLot">Sort: Days on Lot</option>
            <option value="status">Sort: Status</option>
            <option value="views">Sort: Views</option>
          </Select>
          <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-2 border border-stone-300 rounded-md hover:bg-stone-50">
            {sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </Card>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-4 anim-slide bg-stone-900 text-white rounded-lg p-3 flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-sm px-2">
            {selected.size} selected
          </span>
          <span className="text-stone-500">·</span>
          <button onClick={() => setBulkAction('sale')}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5"
            style={{ color: GOLD }}>
            <Tag className="w-3 h-3" /> Mark On Sale
          </button>
          <button onClick={() => { setBulkAction('removeSale'); setTimeout(applyBulk, 0); }}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800">
            Remove Sale
          </button>
          <button onClick={() => setBulkAction('sold')}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
            <Award className="w-3 h-3" /> Mark as Sold
          </button>
          <button onClick={() => { setBulkAction('feature'); setTimeout(applyBulk, 0); }}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
            <Star className="w-3 h-3" /> Feature
          </button>
          <button onClick={() => { setBulkAction('csv'); setTimeout(applyBulk, 0); }}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Export CSV
          </button>
          <button onClick={() => { setBulkAction('fb'); setTimeout(applyBulk, 0); }}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5">
            <Share2 className="w-3 h-3" /> Export to FB
          </button>
          <div className="flex-1" />
          <button onClick={() => setBulkAction('delete')}
            className="px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-900/30 text-red-300 inline-flex items-center gap-1.5">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
          <button onClick={() => setSelected(new Set())}
            className="px-2 py-1.5 rounded text-xs hover:bg-stone-800 text-stone-400">
            Clear
          </button>
        </div>
      )}

      {/* Bulk action prompts */}
      {bulkAction === 'sale' && (
        <div className="mb-4 p-4 border-2 rounded-lg flex items-center gap-3 anim-slide" style={{ borderColor: GOLD, backgroundColor: '#FFFCF2' }}>
          <Tag className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-sm font-medium">Apply discount to {selected.size} vehicles:</span>
          <input value={bulkValue} onChange={(e) => setBulkValue(e.target.value)}
            placeholder="e.g. 7% or $2000" autoFocus
            className="px-3 py-1.5 border border-stone-300 rounded-md text-sm w-32 ring-gold" />
          <Btn variant="gold" size="sm" onClick={applyBulk}>Apply Sale</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setBulkAction(null); setBulkValue(''); }}>Cancel</Btn>
        </div>
      )}
      {bulkAction === 'sold' && (
        <div className="mb-4 p-4 border-2 border-green-300 bg-green-50 rounded-lg flex items-center gap-3 anim-slide">
          <Award className="w-4 h-4 text-green-700" />
          <span className="text-sm font-medium">Mark {selected.size} as sold to:</span>
          <input value={bulkBuyer} onChange={(e) => setBulkBuyer(e.target.value)}
            placeholder="Buyer name" autoFocus
            className="px-3 py-1.5 border border-stone-300 rounded-md text-sm w-48 ring-gold" />
          <Btn variant="dark" size="sm" onClick={applyBulk}>Mark Sold</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setBulkAction(null); setBulkBuyer(''); }}>Cancel</Btn>
        </div>
      )}
      {bulkAction === 'delete' && (
        <div className="mb-4 p-4 border-2 border-red-300 bg-red-50 rounded-lg flex items-center gap-3 anim-slide">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span className="text-sm font-medium">Delete {selected.size} vehicles permanently? This cannot be undone.</span>
          <Btn variant="dark" size="sm" onClick={applyBulk} className="bg-red-700 border-red-700 hover:bg-red-800">Delete</Btn>
          <Btn variant="ghost" size="sm" onClick={() => setBulkAction(null)}>Cancel</Btn>
        </div>
      )}

      {/* Inventory table or grid */}
      {view === 'list' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
                <tr>
                  <th className="px-3 py-2.5 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="w-4 h-4" style={{ color: GOLD }} /> : <Square className="w-4 h-4 text-stone-400" />}
                    </button>
                  </th>
                  <th className="px-2 py-2.5 w-20 text-left">Photo</th>
                  <th className="px-2 py-2.5 w-14 text-left">Year</th>
                  <th className="px-2 py-2.5 text-left">Make / Model</th>
                  <th className="px-2 py-2.5 text-left">Trim</th>
                  <th className="px-2 py-2.5 text-right">Price</th>
                  <th className="px-2 py-2.5 text-right">Mileage</th>
                  <th className="px-2 py-2.5 text-left">Status</th>
                  <th className="px-2 py-2.5 text-right">Days</th>
                  <th className="px-2 py-2.5 text-right">Views</th>
                  <th className="px-3 py-2.5 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center text-stone-500 py-12 text-sm">No vehicles match your filters.</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className={`group hover:bg-stone-50 transition ${selected.has(v.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleOne(v.id)} className="flex items-center justify-center">
                        {selected.has(v.id) ? <CheckSquare className="w-4 h-4" style={{ color: GOLD }} /> : <Square className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />}
                      </button>
                    </td>
                    <td className="px-2 py-2"><VehiclePhoto vehicle={v} size="sm" /></td>
                    <td className="px-2 py-3 font-medium tabular">{v.year}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => onEdit(v.id)} className="font-semibold hover:underline text-left">
                          {v.make} {v.model}
                        </button>
                        {reservedMap.has(v.id) && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded smallcaps"
                            style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                            <Timer className="w-2.5 h-2.5" /> RESERVED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 tabular">
                        VIN ··{v.vin.slice(-6)} · Stock {v.stockNumber}
                        {reservedMap.has(v.id) && (
                          <>
                            <span> · </span>
                            <span style={{ color: '#7A5A0F' }}>{reservedMap.get(v.id).customerName}</span>
                            <button onClick={(e) => { e.stopPropagation(); onReleaseReservation(reservedMap.get(v.id).id); }}
                              className="ml-2 text-[10px] underline hover:text-stone-700">Release Hold</button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-stone-600">{v.trim}</td>
                    <td className="px-2 py-3 text-right tabular">
                      {v.salePrice ? (
                        <>
                          <div className="font-semibold" style={{ color: RED_ACCENT }}>{fmtMoney(v.salePrice)}</div>
                          <div className="text-[11px] text-stone-400 line-through">{fmtMoney(v.listPrice)}</div>
                        </>
                      ) : (
                        <div className="font-semibold">{fmtMoney(v.listPrice)}</div>
                      )}
                    </td>
                    <td className="px-2 py-3 text-right tabular text-stone-600">{Number(v.mileage).toLocaleString()}</td>
                    <td className="px-2 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-2 py-3 text-right tabular">
                      <span className={`font-semibold ${v.daysOnLot >= 60 ? 'text-red-700' : v.daysOnLot >= 45 ? 'text-orange-700' : v.daysOnLot >= 30 ? 'text-amber-700' : 'text-stone-600'}`}>
                        {v.daysOnLot}d
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right tabular text-stone-500">{(v.views || 0).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition">
                        <IconBtn icon={Edit3} title="Edit" onClick={() => onEdit(v.id)} />
                        <IconBtn icon={Star} title={v.status === 'Featured' ? 'Unfeature' : 'Feature'}
                          tone="gold"
                          onClick={() => updateVehicle(v.id, { status: v.status === 'Featured' ? 'Available' : 'Featured' })} />
                        <IconBtn icon={Tag} title="Put on Sale"
                          onClick={() => {
                            const sale = Math.round(v.listPrice * 0.93 / 5) * 5;
                            updateVehicle(v.id, { salePrice: sale, status: 'On Sale' });
                            flash(`${v.year} ${v.make} ${v.model} put on sale`);
                          }} />
                        <IconBtn icon={Award} title="Mark Sold" tone="blue"
                          onClick={() => {
                            const buyer = window.prompt(`Buyer name for ${v.year} ${v.make} ${v.model}?`, '');
                            if (buyer !== null) markSold(v.id, buyer || 'Walk-in Buyer');
                          }} />
                        <IconBtn icon={Share2} title="Export to Facebook"
                          onClick={() => flash(`Export queued: ${v.year} ${v.make} ${v.model}`)} />
                        <IconBtn icon={Trash2} title="Delete" tone="danger"
                          onClick={() => setConfirmDelete(v.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(v => (
            <Card key={v.id} className="overflow-hidden group hover:shadow-md transition cursor-pointer"
              onClick={() => onEdit(v.id)}>
              <div className="relative">
                <VehiclePhoto vehicle={v} size="lg" />
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                  <StatusBadge status={v.status} />
                  {reservedMap.has(v.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full smallcaps"
                      style={{ backgroundColor: GOLD, color: '#1A1612' }}>
                      <Timer className="w-2.5 h-2.5" /> RESERVED · {reservedMap.get(v.id).customerName.split(' ')[0]}
                    </span>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleOne(v.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-md flex items-center justify-center hover:bg-white">
                  {selected.has(v.id) ? <CheckSquare className="w-4 h-4" style={{ color: GOLD }} /> : <Square className="w-4 h-4 text-stone-500" />}
                </button>
              </div>
              <div className="p-3.5">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="font-display text-base font-medium leading-tight truncate">
                    {v.year} {v.make} {v.model}
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 mb-2.5">{v.trim}</div>
                <div className="flex items-baseline justify-between mb-2.5">
                  {v.salePrice ? (
                    <div className="tabular">
                      <span className="font-display text-lg font-semibold" style={{ color: RED_ACCENT }}>{fmtMoney(v.salePrice)}</span>
                      <span className="text-[11px] text-stone-400 line-through ml-1.5">{fmtMoney(v.listPrice)}</span>
                    </div>
                  ) : (
                    <span className="font-display text-lg font-semibold tabular">{fmtMoney(v.listPrice)}</span>
                  )}
                  <span className="text-[11px] text-stone-500 tabular">{fmtMiles(v.mileage)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] smallcaps text-stone-400 pt-2 border-t border-stone-100">
                  <span>Stock {v.stockNumber}</span>
                  <span className={`font-semibold ${v.daysOnLot >= 60 ? 'text-red-700' : v.daysOnLot >= 45 ? 'text-orange-700' : v.daysOnLot >= 30 ? 'text-amber-700' : ''}`}>
                    {v.daysOnLot}d on lot
                  </span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(v.views || 0).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 anim-slide">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-700" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold leading-none">Delete vehicle?</h3>
                <p className="text-xs text-stone-500 mt-1">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Btn variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Btn>
              <Btn variant="dark" className="bg-red-700 border-red-700 hover:bg-red-800"
                onClick={() => { removeVehicle(confirmDelete); setConfirmDelete(null); flash('Vehicle deleted'); }}>
                Delete
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== VEHICLE FORM TAB ========================= */

const BLANK_VEHICLE = {
  year: new Date(TODAY).getFullYear(), make: 'Toyota', model: '', trim: '', bodyStyle: 'Sedan',
  cost: '', listPrice: '', salePrice: '', mileage: '',
  exteriorColor: 'Black', interiorColor: 'Black',
  engine: '', transmission: 'Automatic', drivetrain: 'FWD', fuelType: 'Gas',
  mpgCity: '', mpgHwy: '', vin: '', stockNumber: '',
  status: 'Available',
  history: { noAccidents: false, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false },
  description: '', photos: [],
  daysOnLot: 0, views: 0, dateAdded: new Date(TODAY).toISOString()
};

function VehicleFormTab({ vehicle, onSave, onCancel }) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState(() => vehicle ? { ...vehicle } : { ...BLANK_VEHICLE });
  const [photoInput, setPhotoInput] = useState((vehicle?.photos || []).join(', '));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setForm({ ...vehicle });
      setPhotoInput((vehicle.photos || []).join(', '));
    } else {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
    }
  }, [vehicle?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setHist = (k, v) => setForm(f => ({ ...f, history: { ...f.history, [k]: v } }));

  const margin = useMemo(() => {
    const sale = parseFloat(form.salePrice) || parseFloat(form.listPrice) || 0;
    const cost = parseFloat(form.cost) || 0;
    if (!sale || !cost) return null;
    return { gross: sale - cost, pct: ((sale - cost) / sale * 100) };
  }, [form.cost, form.listPrice, form.salePrice]);

  const validate = () => {
    const e = {};
    if (!form.year) e.year = 'Required';
    if (!form.make) e.make = 'Required';
    if (!form.model) e.model = 'Required';
    if (!form.listPrice) e.listPrice = 'Required';
    if (!form.mileage && form.mileage !== 0) e.mileage = 'Required';
    if (form.vin && !validVin(form.vin)) e.vin = 'VIN must be 17 alphanumeric chars (no I, O, Q)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (addAnother = false) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const photos = photoInput.split(',').map(s => s.trim()).filter(Boolean);
    const cleaned = {
      ...form,
      year: Number(form.year), cost: Number(form.cost) || 0,
      listPrice: Number(form.listPrice), salePrice: form.salePrice ? Number(form.salePrice) : null,
      mileage: Number(form.mileage), mpgCity: Number(form.mpgCity) || 0, mpgHwy: Number(form.mpgHwy) || 0,
      photos
    };
    onSave(cleaned, addAnother);
    if (addAnother) {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const photoUrls = photoInput.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <button onClick={onCancel} className="text-[11px] smallcaps text-stone-500 hover:text-stone-900 mb-1 inline-flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" /> Back to inventory
          </button>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            {isEdit ? `Edit ${form.year} ${form.make} ${form.model}` : 'Add New Vehicle'}
          </h1>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Please fix the highlighted errors below before saving.
        </div>
      )}

      <div className="space-y-6">
        {/* VEHICLE INFO */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-medium">Vehicle Info</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Year" required>
              <Input type="number" value={form.year} onChange={(e) => set('year', e.target.value)}
                className={errors.year ? 'border-red-400' : ''} />
            </Field>
            <Field label="Make" required>
              <Select value={form.make} onChange={(e) => set('make', e.target.value)} className={errors.make ? 'border-red-400' : ''}>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </Field>
            <Field label="Model" required>
              <Input value={form.model} onChange={(e) => set('model', e.target.value)} className={errors.model ? 'border-red-400' : ''} placeholder="e.g. X5" />
            </Field>
            <Field label="Trim">
              <Input value={form.trim} onChange={(e) => set('trim', e.target.value)} placeholder="e.g. xDrive40i" />
            </Field>
            <Field label="Body Style">
              <Select value={form.bodyStyle} onChange={(e) => set('bodyStyle', e.target.value)}>
                {BODY_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {['Available','Featured','On Sale','Just Arrived','Price Drop','Pending'].map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        {/* PRICING */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-medium">Pricing</h3>
            </div>
            {margin && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-50 border border-stone-200">
                <span className="text-[10px] smallcaps text-stone-500">Margin</span>
                <span className="font-display tabular text-sm font-semibold" style={{ color: margin.gross > 0 ? '#2F7A4A' : '#A12B2B' }}>
                  {fmtMoney(margin.gross)}
                </span>
                <span className="text-xs text-stone-500 tabular">({margin.pct.toFixed(1)}%)</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Field label="Purchase Price (cost)" hint="Hidden from customer site — for margin tracking only">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.cost} onChange={(e) => set('cost', e.target.value)} className="pl-7" />
              </div>
            </Field>
            <Field label="List Price" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.listPrice} onChange={(e) => set('listPrice', e.target.value)} className={`pl-7 ${errors.listPrice ? 'border-red-400' : ''}`} />
              </div>
            </Field>
            <Field label="Sale Price (optional)" hint="Shows strikethrough on customer site">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <Input type="number" value={form.salePrice || ''} onChange={(e) => set('salePrice', e.target.value)} className="pl-7" />
              </div>
            </Field>
          </div>
        </Card>

        {/* SPECS */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-medium">Specifications</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Mileage" required>
              <Input type="number" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className={errors.mileage ? 'border-red-400' : ''} />
            </Field>
            <Field label="Exterior Color">
              <Select value={form.exteriorColor} onChange={(e) => set('exteriorColor', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Interior Color">
              <Select value={form.interiorColor} onChange={(e) => set('interiorColor', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Engine">
              <Input value={form.engine} onChange={(e) => set('engine', e.target.value)} placeholder="3.0L Turbo Inline-6" />
            </Field>
            <Field label="Transmission">
              <Select value={form.transmission} onChange={(e) => set('transmission', e.target.value)}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Drivetrain">
              <Select value={form.drivetrain} onChange={(e) => set('drivetrain', e.target.value)}>
                {DRIVETRAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Fuel Type">
              <Select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="MPG City"><Input type="number" value={form.mpgCity} onChange={(e) => set('mpgCity', e.target.value)} /></Field>
              <Field label="MPG Hwy"><Input type="number" value={form.mpgHwy} onChange={(e) => set('mpgHwy', e.target.value)} /></Field>
            </div>
            <Field label="VIN" hint={errors.vin || '17 characters'}>
              <Input value={form.vin} onChange={(e) => set('vin', e.target.value.toUpperCase())} maxLength={17}
                className={`font-mono text-xs ${errors.vin ? 'border-red-400' : ''}`} />
            </Field>
            <Field label="Stock Number">
              <Input value={form.stockNumber} onChange={(e) => set('stockNumber', e.target.value)} className="font-mono text-xs" />
            </Field>
          </div>
        </Card>

        {/* HISTORY */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-medium">Vehicle History</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ['noAccidents','No Accidents'], ['oneOwner','1 Owner'], ['cleanTitle','Clean Title'],
              ['serviceRecords','Service Records Available'], ['inspection','150-Point Inspection Passed'],
              ['carfax','CARFAX Available'], ['warranty','Manufacturer Warranty Remaining']
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 cursor-pointer">
                <input type="checkbox" checked={!!form.history?.[k]} onChange={(e) => setHist(k, e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-600" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* DESCRIPTION */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-medium">Description</h3>
            </div>
            <span className={`text-[11px] tabular ${(form.description?.length || 0) > 500 ? 'text-red-600' : 'text-stone-500'}`}>
              {form.description?.length || 0} / 500
            </span>
          </div>
          <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4}
            placeholder="Highlight key features, condition, and what makes this vehicle a great buy…" maxLength={500} />
        </Card>

        {/* PHOTOS */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-stone-500" />
              <h3 className="font-display text-lg font-medium">Photos</h3>
            </div>
            <span className="text-[10px] smallcaps text-stone-500">First photo = hero image</span>
          </div>
          <Field label="Photo URLs (comma-separated)" hint="In production: drag-and-drop upload to cloud storage">
            <Textarea value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} rows={2}
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg" />
          </Field>
          {photoUrls.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-thin pb-2">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative shrink-0 w-32">
                  <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={url} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-stone-400">Invalid URL</div>'; }} />
                  </div>
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[9px] font-bold smallcaps px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: GOLD }}>Hero</span>
                  )}
                  <span className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-stone-50/95 backdrop-blur py-4 -mx-6 px-6 border-t border-stone-200">
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          {!isEdit && <Btn variant="default" icon={Plus} onClick={() => handleSave(true)}>Save & Add Another</Btn>}
          <Btn variant="gold" icon={Save} onClick={() => handleSave(false)}>
            {isEdit ? 'Save Changes' : 'Save Vehicle'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ====================== LEADS TAB ================================ */

function deriveFollowupLog(lead) {
  const events = [];
  const created = new Date(lead.createdAt).getTime();
  const ageMs = TODAY.getTime() - created;
  const ageHours = ageMs / 3600000;
  const ageDays = ageHours / 24;

  if (ageHours >= 4) {
    events.push({ t: new Date(created + 4 * 3600000).toISOString(), kind: 'auto', done: true,
      label: `Auto-email: "Thanks for your interest in ${lead.vehicleLabel || 'our inventory'}"` });
  }
  if (ageHours >= 24 && lead.status === 'New') {
    events.push({ t: new Date(created + 24 * 3600000).toISOString(), kind: 'auto', done: true,
      label: `Auto-text: "Still interested in the ${lead.vehicleLabel || 'vehicle'}? It's still available."` });
  }
  if (lead.status === 'Contacted' || lead.status === 'Appointment Set' || lead.status === 'Showed') {
    events.push({ t: new Date(created + Math.min(ageHours, 30) * 3600000).toISOString(), kind: 'manual', done: true,
      label: `Manual call by dealer — connected with ${lead.name.split(' ')[0]}` });
  }
  if (ageDays >= 3 && lead.status !== 'Sold' && lead.status !== 'Lost') {
    events.push({ t: new Date(created + 3 * 86400000).toISOString(), kind: 'auto', done: true,
      label: `Auto-email #2: ${lead.vehicleLabel || 'Vehicle'} update + 2 similar vehicles to consider` });
  }
  if (ageDays >= 7 && (lead.status === 'New' || lead.status === 'Contacted')) {
    events.push({ t: new Date(created + 7 * 86400000).toISOString(), kind: 'auto', done: true,
      label: 'Auto-email: Final follow-up — last chance before we feature it' });
  }
  return events;
}

function LeadsTab({ leads, setLeads, inventory, settings, setSettings, onConvertToDeal, flash }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [l.name, l.email, l.phone, l.vehicleLabel].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (filterSource !== 'all' && l.source !== filterSource) return false;
      if (filterDate !== 'all') {
        const days = (TODAY.getTime() - new Date(l.createdAt).getTime()) / 86400000;
        if (filterDate === 'today' && days > 1) return false;
        if (filterDate === 'week' && days > 7) return false;
        if (filterDate === 'month' && days > 30) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [leads, search, filterStatus, filterSource, filterDate]);

  const updateLead = (id, patch) => setLeads(arr => arr.map(l => l.id === id ? { ...l, ...patch } : l));

  const expandLead = (id) => {
    setExpanded(expanded === id ? null : id);
    if (!leads.find(l => l.id === id)?.read) updateLead(id, { read: true });
  };

  const unread = leads.filter(l => !l.read).length;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Leads</h1>
          <p className="text-sm text-stone-500 mt-1">
            {filtered.length} of {leads.length} · {unread > 0 && <span className="font-semibold" style={{ color: RED_ACCENT }}>{unread} unread</span>}
            {unread > 0 && <span> · </span>}
            <span>4 min average response time</span>
          </p>
        </div>
        <Btn variant="default" icon={Bell} onClick={() => setShowNotifs(s => !s)}>
          Notification Settings
        </Btn>
      </div>

      {/* Notification settings panel */}
      {showNotifs && (
        <Card className="p-5 mb-4 anim-slide" style={{ borderColor: GOLD }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
              <Sparkles className="w-4 h-4" style={{ color: '#7A5A0F' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-medium">Lead Automation</h3>
              <p className="text-xs text-stone-500 mt-1">
                Powered by AI automation — <span className="font-semibold" style={{ color: GOLD }}>included at no extra cost</span>
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <Toggle checked={settings.notifications.emailAlerts}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, emailAlerts: v } }))}
                label="Email me on new leads"
                description="Instant notification with full lead details" />
              <Field label="Notification email">
                <Input value={settings.notifications.alertEmail}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, alertEmail: e.target.value } }))} />
              </Field>
              <Toggle checked={settings.notifications.smsAlerts}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, smsAlerts: v } }))}
                label="Text me on new leads"
                description="SMS within 30 seconds of submission" />
              <Field label="Notification phone">
                <Input value={settings.notifications.alertPhone}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, alertPhone: e.target.value } }))} />
              </Field>
            </div>
            <div className="space-y-4">
              <Toggle checked={settings.notifications.autoFollowupEmail}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, autoFollowupEmail: v } }))}
                label="Auto-send follow-up email after 24h"
                description="If no contact yet, send personalized follow-up" />
              <Toggle checked={settings.notifications.autoFollowupSms}
                onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, autoFollowupSms: v } }))}
                label="Auto-send text after 4h if uncontacted"
                description="Speed-to-lead is the #1 predictor of close rate" />
              <Field label="Speed-to-lead target">
                <Select value={settings.notifications.speedToLead}
                  onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, speedToLead: e.target.value } }))}>
                  {['5 min','15 min','30 min','1 hour'].map(t => <option key={t}>{t}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, vehicle…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs w-36">
            <option value="all">All status</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="text-xs w-40">
            <option value="all">All sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="text-xs w-32">
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </Select>
        </div>
      </Card>

      {/* Leads table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-6"></th>
                <th className="px-2 py-2.5 text-left">Name</th>
                <th className="px-2 py-2.5 text-left">Contact</th>
                <th className="px-2 py-2.5 text-left">Source</th>
                <th className="px-2 py-2.5 text-left">Vehicle of Interest</th>
                <th className="px-2 py-2.5 text-left">Status</th>
                <th className="px-2 py-2.5 text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-stone-500 py-12 text-sm">No leads match your filters.</td></tr>
              ) : filtered.map(l => (
                <React.Fragment key={l.id}>
                  <tr onClick={() => expandLead(l.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${!l.read ? 'bg-amber-50/30' : ''} ${expanded === l.id ? 'bg-stone-50' : ''}`}>
                    <td className="px-4 py-3">
                      {!l.read && <div className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: RED_ACCENT }} />}
                    </td>
                    <td className="px-2 py-3">
                      <div className={`${l.read ? 'font-medium' : 'font-bold'} text-stone-900`}>{l.name}</div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-[12px] text-stone-700">{l.email}</div>
                      <div className="text-[11px] text-stone-500 tabular">{l.phone}</div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-block px-2 py-0.5 text-[11px] rounded-full font-medium"
                        style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                        {l.source}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-stone-700">{l.vehicleLabel}</td>
                    <td className="px-2 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-2 py-3 text-right text-xs text-stone-500 tabular">{relTime(l.createdAt)}</td>
                  </tr>
                  {expanded === l.id && (
                    <tr>
                      <td colSpan={7} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="grid lg:grid-cols-3 gap-6">
                          {/* Detail */}
                          <div className="lg:col-span-2 space-y-5">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Submitted Information</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="font-medium">{l.name}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Email</span><span className="font-mono text-[12px]">{l.email}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Phone</span><span className="font-mono tabular">{l.phone}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Source</span><span>{l.source}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Vehicle of interest</span><span>{l.vehicleLabel}</span></div>
                                {l.preApproval && (
                                  <>
                                    <div className="border-t border-stone-100 pt-2 mt-2 text-[10px] smallcaps font-semibold text-stone-500">Pre-Approval</div>
                                    <div className="flex justify-between"><span className="text-stone-500">Credit score range</span><span>{l.preApproval.creditScore}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Monthly income</span><span className="tabular">{fmtMoney(l.preApproval.monthlyIncome)}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Employer</span><span>{l.preApproval.employer}</span></div>
                                  </>
                                )}
                                {l.tradeInfo && (
                                  <>
                                    <div className="border-t border-stone-100 pt-2 mt-2 text-[10px] smallcaps font-semibold text-stone-500">Trade-In</div>
                                    <div className="flex justify-between"><span className="text-stone-500">Vehicle</span><span>{l.tradeInfo.year} {l.tradeInfo.make} {l.tradeInfo.model}</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Mileage</span><span className="tabular">{Number(l.tradeInfo.mileage).toLocaleString()} mi</span></div>
                                    <div className="flex justify-between"><span className="text-stone-500">Condition</span><span>{l.tradeInfo.condition}</span></div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Timeline */}
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Customer Engagement Timeline</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4">
                                <div className="space-y-3">
                                  {l.timeline.map((t, i) => (
                                    <div key={i} className="flex gap-3">
                                      <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: i === l.timeline.length - 1 ? GOLD : '#d6d2c8' }} />
                                        {i < l.timeline.length - 1 && <div className="w-px flex-1 bg-stone-200" />}
                                      </div>
                                      <div className="flex-1 pb-2">
                                        <div className="text-sm">{t.event}</div>
                                        <div className="text-[11px] text-stone-400 tabular mt-0.5">{relTime(t.t)}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Internal Notes</div>
                              <Textarea value={l.notes || ''}
                                onChange={(e) => updateLead(l.id, { notes: e.target.value })}
                                placeholder="Called back, coming Saturday at 11am..."
                                rows={3} />
                            </div>

                            {/* Follow-Up Log */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> AI Follow-Up Log
                                </div>
                                <span className="text-[9px] smallcaps font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                                  AUTOMATED
                                </span>
                              </div>
                              <div className="bg-white border border-stone-200 rounded-md p-4">
                                {(() => {
                                  const log = deriveFollowupLog(l);
                                  if (log.length === 0) {
                                    return (
                                      <div className="text-[12px] text-stone-500 italic flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        First automated touchpoint scheduled for 4 hours after lead capture.
                                      </div>
                                    );
                                  }
                                  return (
                                    <div className="space-y-2.5">
                                      {log.map((e, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                          <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: e.kind === 'auto' ? GOLD_SOFT : '#E8F2EC' }}>
                                            {e.kind === 'auto'
                                              ? <Sparkles className="w-2.5 h-2.5" style={{ color: '#7A5A0F' }} />
                                              : <Phone className="w-2.5 h-2.5" style={{ color: '#256B40' }} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-[12px] text-stone-800">{e.label}</div>
                                            <div className="text-[10px] text-stone-400 tabular mt-0.5">{relTime(e.t)}</div>
                                          </div>
                                          {e.done && <Check className="w-3.5 h-3.5 text-green-700 mt-0.5 shrink-0" strokeWidth={2.5} />}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                                <Sparkles className="w-2.5 h-2.5 inline mr-0.5" style={{ color: GOLD }} />
                                AI-powered follow-up included free — competitors charge $500+/mo for this.
                              </div>
                            </div>
                          </div>

                          {/* Actions sidebar */}
                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Quick Actions</div>
                              <div className="grid grid-cols-3 gap-2">
                                <a href={`tel:${l.phone}`} className="flex flex-col items-center gap-1 py-3 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                  <Phone className="w-4 h-4 text-stone-700" />
                                  <span className="text-[11px] font-medium">Call</span>
                                </a>
                                <a href={`sms:${l.phone}`} className="flex flex-col items-center gap-1 py-3 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                  <MessageSquare className="w-4 h-4 text-stone-700" />
                                  <span className="text-[11px] font-medium">Text</span>
                                </a>
                                <a href={`mailto:${l.email}`} className="flex flex-col items-center gap-1 py-3 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                  <Mail className="w-4 h-4 text-stone-700" />
                                  <span className="text-[11px] font-medium">Email</span>
                                </a>
                              </div>
                            </div>

                            <Field label="Update Status">
                              <Select value={l.status} onChange={(e) => updateLead(l.id, { status: e.target.value })}>
                                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <Btn variant="gold" className="w-full" icon={Calculator}
                              onClick={() => onConvertToDeal(l)}>
                              Convert to Deal
                            </Btn>

                            <div className="text-[10px] smallcaps text-stone-400 pt-2 border-t border-stone-200">
                              Lead ID: {l.id} · Received {fmtDate(l.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ====================== DEAL BUILDER TAB ========================= */

function DealsTab({ deals, setDeals, inventory, onMarkSold, flash }) {
  const [expanded, setExpanded] = useState(deals[0]?.id || null);
  const [filter, setFilter] = useState('active');

  const filtered = useMemo(() => {
    if (filter === 'active') return deals.filter(d => !['Delivered','Lost'].includes(d.status));
    if (filter === 'won') return deals.filter(d => d.status === 'Delivered');
    if (filter === 'lost') return deals.filter(d => d.status === 'Lost');
    return deals;
  }, [deals, filter]);

  const updateDeal = (id, patch) => setDeals(arr => arr.map(d => d.id === id ? { ...d, ...patch } : d));

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Deal Builder</h1>
          <p className="text-sm text-stone-500 mt-1">
            Full desking tool — built into your dealership platform.
          </p>
        </div>
        <div className="flex bg-stone-100 rounded-md p-0.5">
          {['active','won','lost','all'].map(k => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-xs font-semibold rounded smallcaps ${filter === k ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
              {k === 'active' ? `Active (${deals.filter(d => !['Delivered','Lost'].includes(d.status)).length})` : k}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Calculator className="w-10 h-10 mx-auto text-stone-300 mb-3" strokeWidth={1.25} />
          <h3 className="font-display text-lg font-medium mb-1">No deals here yet</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Customers who use "Build Your Deal" on your website appear here.
            You can also convert any lead into a deal from the Leads tab.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(deal => {
            const fees = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
            const financed = dealFinanced(deal);
            const monthly = calcPayment(financed, deal.apr, deal.termMonths);
            const totalCost = (deal.salePrice || 0) + fees;
            const isOpen = expanded === deal.id;
            return (
              <Card key={deal.id} className="overflow-hidden">
                {/* Card header */}
                <button onClick={() => setExpanded(isOpen ? null : deal.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-stone-50 transition text-left">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
                    <Calculator className="w-4 h-4" style={{ color: '#7A5A0F' }} />
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-display font-medium text-base leading-tight">{deal.customerName}</div>
                      <div className="text-[11px] text-stone-500 tabular mt-0.5">{deal.phone}</div>
                    </div>
                    <div>
                      <div className="text-[10px] smallcaps text-stone-400">Vehicle</div>
                      <div className="text-sm font-medium truncate">{deal.vehicleLabel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] smallcaps text-stone-400">Monthly Payment</div>
                      <div className="font-display tabular text-lg font-semibold" style={{ color: GOLD }}>
                        {fmtMoney(monthly, 0)}<span className="text-xs text-stone-400 font-normal">/mo</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <StatusBadge status={deal.status} />
                      <ChevronDown className={`w-4 h-4 text-stone-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded worksheet */}
                {isOpen && (
                  <div className="border-t border-stone-200 bg-stone-50 anim-slide">
                    <div className="grid lg:grid-cols-3 gap-0">
                      {/* Worksheet */}
                      <div className="lg:col-span-2 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-lg font-medium">Deal Worksheet</h3>
                          <Btn size="sm" variant="default" icon={Printer}
                            onClick={() => { window.print(); flash('Print dialog opened'); }}>
                            Print Sheet
                          </Btn>
                        </div>

                        {/* Vehicle pricing */}
                        <div className="bg-white border border-stone-200 rounded-md p-4">
                          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Vehicle Pricing</div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-stone-600">List Price</span>
                              <div className="flex items-center gap-2">
                                <span className="text-stone-400 text-sm">$</span>
                                <input type="number" value={deal.listPrice}
                                  onChange={(e) => updateDeal(deal.id, { listPrice: Number(e.target.value) })}
                                  className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between" style={{ color: GOLD }}>
                              <span className="text-sm font-semibold">Negotiated Sale Price</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">$</span>
                                <input type="number" value={deal.salePrice}
                                  onChange={(e) => updateDeal(deal.id, { salePrice: Number(e.target.value) })}
                                  className="w-28 text-right tabular px-2 py-1 border-2 rounded text-sm font-semibold ring-gold"
                                  style={{ borderColor: GOLD }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Trade */}
                        <div className="bg-white border border-stone-200 rounded-md p-4">
                          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Trade-In</div>
                          {deal.trade?.make ? (
                            <>
                              <div className="text-sm font-medium mb-3">
                                {deal.trade.year} {deal.trade.make} {deal.trade.model}
                                <span className="text-stone-400 text-xs ml-2 tabular">
                                  {Number(deal.trade.mileage || 0).toLocaleString()} mi
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">Trade Allowance</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-stone-400 text-sm">$</span>
                                  <input type="number" value={deal.trade.value || 0}
                                    onChange={(e) => updateDeal(deal.id, { trade: { ...deal.trade, value: Number(e.target.value) } })}
                                    className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-stone-400 italic">No trade-in on this deal</div>
                          )}
                        </div>

                        {/* Dealer fees */}
                        <div className="bg-white border border-stone-200 rounded-md p-4">
                          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Dealer Fees</div>
                          <div className="space-y-2.5">
                            {[
                              ['docFee','Documentation Fee'],
                              ['tagTitle','Tag, Title & Registration'],
                              ['dealerPrep','Dealer Prep']
                            ].map(([k, label]) => (
                              <div key={k} className="flex items-center justify-between">
                                <span className="text-sm text-stone-600">{label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-stone-400 text-sm">$</span>
                                  <input type="number" value={deal.fees?.[k] || 0}
                                    onChange={(e) => updateDeal(deal.id, { fees: { ...deal.fees, [k]: Number(e.target.value) } })}
                                    className="w-28 text-right tabular px-2 py-1 border border-stone-200 rounded text-sm ring-gold" />
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                              <span className="text-xs smallcaps text-stone-500">Total Fees</span>
                              <span className="text-sm font-semibold tabular">{fmtMoney(fees)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financing */}
                        <div className="bg-white border border-stone-200 rounded-md p-4">
                          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Financing Terms</div>
                          <div className="grid grid-cols-3 gap-3">
                            <Field label="Down Payment">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                                <Input type="number" value={deal.downPayment}
                                  onChange={(e) => updateDeal(deal.id, { downPayment: Number(e.target.value) })} className="pl-7" />
                              </div>
                            </Field>
                            <Field label="Term">
                              <Select value={deal.termMonths}
                                onChange={(e) => updateDeal(deal.id, { termMonths: Number(e.target.value) })}>
                                {[36, 48, 60, 72, 84].map(t => <option key={t} value={t}>{t} months</option>)}
                              </Select>
                            </Field>
                            <Field label="APR">
                              <div className="relative">
                                <Input type="number" step="0.1" value={deal.apr}
                                  onChange={(e) => updateDeal(deal.id, { apr: Number(e.target.value) })} className="pr-7" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">%</span>
                              </div>
                            </Field>
                          </div>
                        </div>

                        {/* Notes */}
                        <Field label="Deal Notes">
                          <Textarea value={deal.notes || ''} rows={2}
                            onChange={(e) => updateDeal(deal.id, { notes: e.target.value })}
                            placeholder="Approval tier, customer requests, contingencies..." />
                        </Field>
                      </div>

                      {/* Right rail: summary + actions */}
                      <div className="bg-stone-900 text-white p-6 lg:rounded-bl-lg">
                        <div className="text-[10px] smallcaps font-semibold mb-4" style={{ color: GOLD }}>Deal Summary</div>

                        <div className="space-y-3 mb-5 text-sm">
                          <div className="flex justify-between"><span className="text-stone-400">Sale Price</span><span className="tabular">{fmtMoney(deal.salePrice)}</span></div>
                          <div className="flex justify-between"><span className="text-stone-400">+ Fees</span><span className="tabular">{fmtMoney(fees)}</span></div>
                          <div className="flex justify-between border-t border-stone-700 pt-3"><span className="font-medium">Total Cost</span><span className="font-semibold tabular">{fmtMoney(totalCost)}</span></div>
                          <div className="flex justify-between"><span className="text-stone-400">− Trade Allowance</span><span className="tabular">{fmtMoney(deal.trade?.value || 0)}</span></div>
                          <div className="flex justify-between"><span className="text-stone-400">− Down Payment</span><span className="tabular">{fmtMoney(deal.downPayment)}</span></div>
                          <div className="flex justify-between border-t border-stone-700 pt-3"><span className="font-semibold">Amount Financed</span><span className="font-display text-base font-semibold tabular" style={{ color: GOLD }}>{fmtMoney(financed)}</span></div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-md p-4 mb-5">
                          <div className="text-[10px] smallcaps text-stone-400 mb-1">Customer Pays</div>
                          <div className="font-display tabular text-4xl font-medium" style={{ color: GOLD }}>
                            {fmtMoney(monthly, 0)}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-1 tabular">
                            for {deal.termMonths} months @ {deal.apr}% APR
                          </div>
                          <div className="text-[10px] text-stone-500 mt-2 pt-2 border-t border-white/10 tabular">
                            Total of payments: {fmtMoney(monthly * deal.termMonths)}
                          </div>
                        </div>

                        <Field label="Status" className="mb-3">
                          <select value={deal.status}
                            onChange={(e) => updateDeal(deal.id, { status: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 text-white rounded-md text-sm">
                            {DEAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </Field>

                        <div className="space-y-2">
                          <Btn variant="gold" className="w-full" icon={Send}
                            onClick={() => flash('Deal sheet sent to ' + deal.email)}>
                            Send to Customer
                          </Btn>
                          <Btn variant="default" className="w-full bg-stone-800 border-stone-700 text-white hover:bg-stone-700" icon={Award}
                            onClick={() => onMarkSold(deal)}>
                            Mark Delivered
                          </Btn>
                        </div>

                        <div className="mt-5 pt-4 border-t border-stone-700 text-[10px] smallcaps text-stone-500">
                          Deal #{deal.id.slice(-6).toUpperCase()} · Created {fmtDate(deal.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ====================== SOLD VEHICLES TAB ======================== */

function SoldTab({ sold, setSold, onRestore, flash }) {
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewMethod, setReviewMethod] = useState('email');

  const stats = useMemo(() => {
    const m = TODAY.getMonth(), y = TODAY.getFullYear();
    const thisMonth = sold.filter(s => {
      const d = new Date(s.saleDate);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const totalSold = thisMonth.length;
    const grosses = thisMonth.map(s => s.salePrice - s.cost);
    const avgGross = grosses.length ? grosses.reduce((a, b) => a + b, 0) / grosses.length : 0;
    const avgDays = thisMonth.length ? thisMonth.reduce((a, s) => a + s.daysOnLotAtSale, 0) / thisMonth.length : 0;
    const revenue = thisMonth.reduce((a, s) => a + s.salePrice, 0);
    const profit = thisMonth.reduce((a, s) => a + (s.salePrice - s.cost), 0);
    return { totalSold, avgGross, avgDays, revenue, profit };
  }, [sold]);

  const sendReviewRequest = (saleId) => {
    setSold(arr => arr.map(s => s.id === saleId ? {
      ...s, review: { ...(s.review || {}), status: 'sent', method: reviewMethod, sentAt: new Date(TODAY).toISOString() }
    } : s));
    flash('Review request sent');
    setReviewModal(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium tracking-tight">Sold Vehicles</h1>
        <p className="text-sm text-stone-500 mt-1">Archive of delivered units with profit reporting and review tracking.</p>
      </div>

      {/* Monthly summary */}
      <Card className="p-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(to right, white 0%, white 50%, #FFFCF2 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">
            {new Date(TODAY).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Monthly Performance
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{stats.totalSold}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Sold This Month</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{fmtMoney(stats.avgGross)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Avg Gross Profit</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{Math.round(stats.avgDays)}<span className="text-base text-stone-400 ml-1">d</span></div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Avg Days to Sell</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none">{fmtMoney(stats.revenue)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Total Revenue</div>
            </div>
            <div>
              <div className="font-display tabular text-3xl font-medium leading-none" style={{ color: GOLD }}>{fmtMoney(stats.profit)}</div>
              <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Total Profit</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sold table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Vehicle</th>
                <th className="px-3 py-2.5 text-left">Sale Date</th>
                <th className="px-3 py-2.5 text-right">Listed</th>
                <th className="px-3 py-2.5 text-right">Final Price</th>
                <th className="px-3 py-2.5 text-right">Cost</th>
                <th className="px-3 py-2.5 text-right">Gross</th>
                <th className="px-3 py-2.5 text-right">Days</th>
                <th className="px-3 py-2.5 text-left">Buyer</th>
                <th className="px-3 py-2.5 text-left">Review</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sold.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-stone-500 text-sm">No sold vehicles yet.</td></tr>
              ) : sold.map(s => {
                const gross = s.salePrice - s.cost;
                const grossPct = (gross / s.salePrice) * 100;
                const r = s.review || { status: 'not-sent' };
                return (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.year} {s.make} {s.model}</div>
                      <div className="text-[11px] text-stone-500">{s.trim}</div>
                    </td>
                    <td className="px-3 py-3 text-stone-600 tabular">{fmtDate(s.saleDate)}</td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(s.listedPrice)}</td>
                    <td className="px-3 py-3 text-right tabular font-semibold">{fmtMoney(s.salePrice)}</td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(s.cost)}</td>
                    <td className="px-3 py-3 text-right tabular">
                      <div className="font-semibold" style={{ color: gross > 0 ? '#2F7A4A' : '#A12B2B' }}>{fmtMoney(gross)}</div>
                      <div className="text-[10px] text-stone-400">{grossPct.toFixed(1)}%</div>
                    </td>
                    <td className="px-3 py-3 text-right tabular">{s.daysOnLotAtSale}d</td>
                    <td className="px-3 py-3 text-stone-700">{s.buyerName}</td>
                    <td className="px-3 py-3">
                      {r.status === 'received' ? (
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(n => (
                            <Star key={n} className="w-3 h-3"
                              fill={n <= (r.stars || 0) ? GOLD : 'transparent'}
                              stroke={n <= (r.stars || 0) ? GOLD : '#d6d2c8'} strokeWidth={1.5} />
                          ))}
                        </div>
                      ) : r.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400">Not sent</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.status === 'not-sent' && (
                          <Btn size="sm" variant="outlineGold" icon={Star}
                            onClick={() => setReviewModal(s)}>
                            Request Review
                          </Btn>
                        )}
                        <Btn size="sm" variant="ghost" icon={RefreshCw} onClick={() => onRestore(s.id)}>
                          Restore
                        </Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review request modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 flex items-center justify-center p-4 anim-slide">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: GOLD_SOFT }}>
                <Star className="w-4 h-4" style={{ color: '#7A5A0F' }} fill={GOLD} />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium leading-none">Request Google Review</h3>
                <p className="text-xs text-stone-500 mt-1">Send to {reviewModal.buyerName}</p>
              </div>
            </div>
            <div className="mb-4 p-3 bg-stone-50 rounded-md">
              <div className="text-sm">{reviewModal.year} {reviewModal.make} {reviewModal.model} {reviewModal.trim}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Sold {fmtDate(reviewModal.saleDate)} for {fmtMoney(reviewModal.salePrice)}</div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Send via</div>
              <div className="grid grid-cols-3 gap-2">
                {['email','sms','both'].map(m => (
                  <button key={m} onClick={() => setReviewMethod(m)}
                    className={`px-3 py-2.5 border-2 rounded-md text-sm font-medium transition ${reviewMethod === m ? '' : 'border-stone-200 hover:border-stone-300'}`}
                    style={reviewMethod === m ? { borderColor: GOLD, backgroundColor: '#FFFCF2' } : {}}>
                    {m === 'email' ? 'Email' : m === 'sms' ? 'SMS' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mb-5 leading-relaxed">
              <Sparkles className="w-3 h-3 inline mr-1" style={{ color: GOLD }} />
              Automated review requests boost your Google rating — included with all Primo plans.
            </p>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setReviewModal(null)}>Cancel</Btn>
              <Btn variant="gold" icon={Send} onClick={() => sendReviewRequest(reviewModal.id)}>Send Request</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== MARKETING TAB ============================ */

function MarketingTab({ inventory, setInventory, settings, setSettings, sold, flash }) {
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState(null);

  const exportAllCSV = () => {
    const headers = ['year','make','model','trim','listPrice','salePrice','mileage','exteriorColor','interiorColor','transmission','drivetrain','vin','stockNumber','status'];
    downloadFile('primo-inventory-all.csv', buildCSV(headers, inventory));
    flash('Exported full inventory to CSV');
  };

  const exportFB = () => {
    const headers = ['title','price','description','condition','availability','category','image_url','vehicle_year','vehicle_make','vehicle_model','vehicle_trim','vehicle_mileage','vehicle_vin','address'];
    const rows = inventory.filter(v => v.status !== 'Sold').map(v => ({
      title: `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim(),
      price: v.salePrice || v.listPrice,
      description: v.description,
      condition: 'used', availability: 'in stock', category: 'vehicles',
      image_url: v.photos?.[0] || '',
      vehicle_year: v.year, vehicle_make: v.make, vehicle_model: v.model,
      vehicle_trim: v.trim, vehicle_mileage: v.mileage, vehicle_vin: v.vin,
      address: `${settings.dealership.city}, ${settings.dealership.state}`
    }));
    downloadFile('primo-facebook-marketplace.csv', buildCSV(headers, rows));
    flash(`${rows.length} vehicles exported to Facebook format`);
  };

  const exportCraigslist = () => {
    const lines = inventory.filter(v => v.status !== 'Sold').map(v => {
      const price = v.salePrice || v.listPrice;
      return [
        `${v.year} ${v.make} ${v.model} ${v.trim || ''} — ${fmtMoney(price)}`,
        '='.repeat(60),
        `Mileage: ${Number(v.mileage).toLocaleString()} miles`,
        `Color: ${v.exteriorColor} exterior, ${v.interiorColor} interior`,
        `Drivetrain: ${v.drivetrain}, Transmission: ${v.transmission}`,
        `VIN: ${v.vin}`, `Stock #: ${v.stockNumber}`,
        '',
        v.description,
        '',
        `Call ${settings.dealership.phone} or visit ${settings.dealership.website}`,
        `Located at ${settings.dealership.address}, ${settings.dealership.city}, ${settings.dealership.state} ${settings.dealership.zip}`,
        '\n\n'
      ].join('\n');
    }).join('\n\n');
    downloadFile('primo-craigslist-listings.txt', lines, 'text/plain');
    flash('Craigslist listings generated');
  };

  const previewImport = () => {
    if (!importText.trim()) return;
    const { headers, rows } = parseCSV(importText);
    setImportPreview({ headers, rows: rows.slice(0, 10), totalRows: rows.length });
  };

  const confirmImport = () => {
    if (!importPreview) return;
    const { rows } = parseCSV(importText);
    const mapped = rows.map(r => ({
      ...BLANK_VEHICLE,
      id: newId('v'),
      year: Number(r.year || r.Year) || new Date(TODAY).getFullYear(),
      make: r.make || r.Make || 'Toyota',
      model: r.model || r.Model || '',
      trim: r.trim || r.Trim || '',
      bodyStyle: r.bodyStyle || r.BodyStyle || 'Sedan',
      cost: Number(r.cost) || 0,
      listPrice: Number(r.listPrice || r.price || r.Price) || 0,
      salePrice: r.salePrice ? Number(r.salePrice) : null,
      mileage: Number(r.mileage || r.Mileage) || 0,
      exteriorColor: r.exteriorColor || r.color || 'Black',
      interiorColor: r.interiorColor || 'Black',
      vin: r.vin || r.VIN || '',
      stockNumber: r.stockNumber || r.stock || newId('S').slice(-6).toUpperCase(),
      status: r.status || 'Just Arrived',
      description: r.description || ''
    }));
    setInventory(arr => [...mapped, ...arr]);
    flash(`Imported ${mapped.length} vehicles`);
    setImportText('');
    setImportPreview(null);
  };

  const reviewsCount = sold.filter(s => s.review?.status === 'received').length;
  const pendingReviews = sold.filter(s => s.review?.status === 'sent').length;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Marketing</h1>
        <p className="text-sm text-stone-500 mt-1">Distribute your inventory everywhere — and reel customers back.</p>
      </div>

      {/* Inventory Export */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Inventory Export</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Push your lot to every channel customers shop on.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={exportAllCSV}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group">
            <FileSpreadsheet className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">Export All to CSV</div>
            <div className="text-[11px] text-stone-500 mt-1">Standard CSV with all vehicle fields</div>
          </button>
          <button onClick={exportFB}
            className="text-left p-4 border-2 rounded-md hover:bg-amber-50 transition group" style={{ borderColor: GOLD }}>
            <Facebook className="w-5 h-5 mb-2" style={{ color: '#1877F2' }} />
            <div className="font-semibold text-sm">Facebook Marketplace</div>
            <div className="text-[11px] text-stone-500 mt-1">FB-formatted CSV ready to upload</div>
          </button>
          <button onClick={exportCraigslist}
            className="text-left p-4 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition group">
            <FileText className="w-5 h-5 mb-2 text-stone-700" />
            <div className="font-semibold text-sm">Craigslist Listings</div>
            <div className="text-[11px] text-stone-500 mt-1">Pre-formatted text per vehicle</div>
          </button>
          <button disabled
            className="text-left p-4 border border-stone-200 rounded-md bg-stone-50/50 opacity-60 cursor-not-allowed">
            <ExternalLink className="w-5 h-5 mb-2 text-stone-400" />
            <div className="font-semibold text-sm text-stone-500">AutoTrader Sync</div>
            <div className="text-[11px] text-stone-400 mt-1">Coming soon — Q3 2026</div>
          </button>
        </div>
      </Card>

      {/* Inventory Import */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Upload className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Inventory Import</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Onboard your entire lot in 5 minutes — paste CSV from any DMS.</p>

        <Field label="CSV content" hint="Header row required. Recognized columns: year, make, model, trim, listPrice, salePrice, mileage, vin, stockNumber, status, description">
          <Textarea rows={5} value={importText} onChange={(e) => setImportText(e.target.value)} className="font-mono text-xs"
            placeholder="year,make,model,trim,listPrice,mileage,vin&#10;2023,Honda,Accord,Sport,28500,15400,1HGCV1F30PA123456" />
        </Field>

        <div className="flex gap-2 mt-3">
          <Btn variant="default" onClick={previewImport} icon={Eye}>Preview</Btn>
          {importPreview && (
            <Btn variant="gold" icon={Check} onClick={confirmImport}>
              Import {importPreview.totalRows} Vehicle{importPreview.totalRows === 1 ? '' : 's'}
            </Btn>
          )}
        </div>

        {importPreview && (
          <div className="mt-4 border border-stone-200 rounded-md overflow-hidden">
            <div className="px-4 py-2 bg-stone-50 text-[10px] smallcaps font-semibold text-stone-500 border-b border-stone-200">
              Preview — first 10 of {importPreview.totalRows} rows
            </div>
            <div className="overflow-x-auto max-h-64 scrollbar-thin">
              <table className="text-xs w-full">
                <thead className="bg-stone-50">
                  <tr>{importPreview.headers.map(h => <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {importPreview.rows.map((r, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      {importPreview.headers.map(h => <td key={h} className="px-3 py-1.5 text-stone-700">{r[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Review Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ThumbsUp className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Review Management</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Reviews drive 89% of luxury car shoppers. Automate the ask.</p>

        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-md" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 100%)', border: `1px solid ${GOLD}40` }}>
            <div className="flex items-center gap-2 mb-1">
              {[1,2,3,4,5].map(n => <Star key={n} className="w-3.5 h-3.5" fill={GOLD} stroke={GOLD} />)}
            </div>
            <div className="font-display tabular text-3xl font-medium">4.9</div>
            <div className="text-[11px] smallcaps text-stone-500 mt-1">Google Rating · 847 reviews</div>
          </div>
          <div className="p-4 rounded-md bg-stone-50">
            <div className="font-display tabular text-3xl font-medium leading-none">{reviewsCount}</div>
            <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Reviews Received This Year</div>
          </div>
          <div className="p-4 rounded-md bg-stone-50">
            <div className="font-display tabular text-3xl font-medium leading-none">{pendingReviews}</div>
            <div className="text-[11px] smallcaps text-stone-500 mt-1.5">Pending Review Requests</div>
          </div>
        </div>

        <div className="space-y-3">
          <Toggle checked={settings.marketing.autoReviewRequest}
            onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoReviewRequest: v } }))}
            label="Auto-send review request 3 days after sale"
            description="Buyer receives a friendly email with a one-tap review link" />
          <Toggle checked={settings.marketing.reviewReminderText}
            onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, reviewReminderText: v } }))}
            label="Send reminder text 5 days after sale if no review"
            description="Soft nudge — proven to lift response rate by 38%" />
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Social Media Automation</h2>
          <span className="text-[10px] smallcaps font-semibold ml-2 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Coming Soon</span>
        </div>
        <p className="text-sm text-stone-500 mb-5">Post every new arrival to your social channels — automatically.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <Facebook className="w-5 h-5 mt-0.5" style={{ color: '#1877F2' }} />
            <div className="flex-1">
              <Toggle checked={settings.marketing.autoPostFacebook}
                onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoPostFacebook: v } }))}
                label="Auto-post new inventory to Facebook"
                description="Hero image + price + key specs, posted to your business page" />
            </div>
          </div>
          <div className="p-4 border border-stone-200 rounded-md flex items-start gap-3">
            <Instagram className="w-5 h-5 mt-0.5" style={{ color: '#E1306C' }} />
            <div className="flex-1">
              <Toggle checked={settings.marketing.autoPostInstagram}
                onChange={(v) => setSettings(s => ({ ...s, marketing: { ...s.marketing, autoPostInstagram: v } }))}
                label="Auto-post new inventory to Instagram"
                description="Carousel post with all photos + first-comment specs" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ====================== SETTINGS TAB ============================= */

function SettingsTab({ settings, setSettings, flash }) {
  const set = (path, value) => {
    setSettings(s => {
      const next = JSON.parse(JSON.stringify(s));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] = cur[keys[i]] || {};
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Configure your dealership profile, notifications, and integrations.</p>
      </div>

      {/* Dealership Info */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Dealership Info</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Dealership Name"><Input value={settings.dealership.name} onChange={(e) => set('dealership.name', e.target.value)} /></Field>
          <Field label="Logo URL"><Input value={settings.dealership.logoUrl || ''} onChange={(e) => set('dealership.logoUrl', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Street Address" className="md:col-span-2"><Input value={settings.dealership.address} onChange={(e) => set('dealership.address', e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-3 md:col-span-2">
            <Field label="City"><Input value={settings.dealership.city} onChange={(e) => set('dealership.city', e.target.value)} /></Field>
            <Field label="State"><Input value={settings.dealership.state} onChange={(e) => set('dealership.state', e.target.value)} maxLength={2} /></Field>
            <Field label="ZIP"><Input value={settings.dealership.zip} onChange={(e) => set('dealership.zip', e.target.value)} /></Field>
          </div>
          <Field label="Phone"><Input value={settings.dealership.phone} onChange={(e) => set('dealership.phone', e.target.value)} /></Field>
          <Field label="Email"><Input value={settings.dealership.email} onChange={(e) => set('dealership.email', e.target.value)} /></Field>
          <Field label="Website URL" className="md:col-span-2"><Input value={settings.dealership.website} onChange={(e) => set('dealership.website', e.target.value)} /></Field>
        </div>

        <div className="mt-5">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Hours of Operation</div>
          <div className="space-y-1.5">
            {days.map(d => (
              <div key={d} className="flex items-center gap-3">
                <div className="w-12 text-sm font-semibold smallcaps text-stone-600">{d}</div>
                <Toggle checked={!settings.dealership.hours[d].closed}
                  onChange={(v) => set(`dealership.hours.${d}.closed`, !v)} />
                {settings.dealership.hours[d].closed ? (
                  <span className="text-xs text-stone-400 italic">Closed</span>
                ) : (
                  <>
                    <input type="time" value={settings.dealership.hours[d].open}
                      onChange={(e) => set(`dealership.hours.${d}.open`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                    <span className="text-stone-400 text-xs">to</span>
                    <input type="time" value={settings.dealership.hours[d].close}
                      onChange={(e) => set(`dealership.hours.${d}.close`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Lead Notifications</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <Toggle checked={settings.notifications.emailAlerts}
              onChange={(v) => set('notifications.emailAlerts', v)} label="Email alerts on new leads" />
            <Field label="Alert email"><Input value={settings.notifications.alertEmail}
              onChange={(e) => set('notifications.alertEmail', e.target.value)} /></Field>
          </div>
          <div className="space-y-4">
            <Toggle checked={settings.notifications.smsAlerts}
              onChange={(v) => set('notifications.smsAlerts', v)} label="SMS alerts on new leads" />
            <Field label="Alert phone"><Input value={settings.notifications.alertPhone}
              onChange={(e) => set('notifications.alertPhone', e.target.value)} /></Field>
          </div>
          <Field label="Speed-to-lead target" className="md:col-span-2 max-w-xs">
            <Select value={settings.notifications.speedToLead}
              onChange={(e) => set('notifications.speedToLead', e.target.value)}>
              {['5 min','15 min','30 min','1 hour'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      {/* Website Customization */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Website Customization</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Colors sync to your customer-facing website automatically.</p>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input type="color" value={settings.branding.primaryColor}
                  onChange={(e) => set('branding.primaryColor', e.target.value)}
                  className="w-10 h-10 rounded border border-stone-300 cursor-pointer" />
                <Input value={settings.branding.primaryColor} onChange={(e) => set('branding.primaryColor', e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Accent Color">
              <div className="flex items-center gap-2">
                <input type="color" value={settings.branding.accentColor}
                  onChange={(e) => set('branding.accentColor', e.target.value)}
                  className="w-10 h-10 rounded border border-stone-300 cursor-pointer" />
                <Input value={settings.branding.accentColor} onChange={(e) => set('branding.accentColor', e.target.value)} className="font-mono text-xs" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Background Theme">
              <div className="flex bg-stone-100 rounded-md p-0.5">
                {['Light','Dark'].map(t => (
                  <button key={t} onClick={() => set('branding.theme', t)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded ${settings.branding.theme === t ? 'bg-white shadow-sm' : 'text-stone-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
        <div className="mt-5 p-4 rounded-md flex items-center gap-3"
          style={{ background: `linear-gradient(135deg, ${settings.branding.primaryColor}15 0%, ${settings.branding.accentColor}15 100%)` }}>
          <div className="w-10 h-10 rounded-md" style={{ backgroundColor: settings.branding.primaryColor }} />
          <div className="w-10 h-10 rounded-md" style={{ backgroundColor: settings.branding.accentColor }} />
          <div className="flex-1 text-xs text-stone-600">
            Live preview — your site uses these colors as soon as you save.
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-stone-100">
          <Toggle checked={settings.branding.hablamosEspanol}
            onChange={(v) => set('branding.hablamosEspanol', v)}
            label={<span className="flex items-center gap-2"><Languages className="w-3.5 h-3.5" /> Hablamos Español</span>}
            description="Enables full Spanish translation toggle on your customer site" />
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Social Links</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['facebook', Facebook, 'Facebook', '#1877F2'],
            ['instagram', Instagram, 'Instagram', '#E1306C'],
            ['tiktok', MessageSquare, 'TikTok', '#000000'],
            ['youtube', Youtube, 'YouTube', '#FF0000'],
            ['google', MapPin, 'Google Business Profile', '#4285F4']
          ].map(([key, Icon, label, color]) => (
            <Field key={key} label={label}>
              <div className="relative">
                <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color }} />
                <Input value={settings.social[key] || ''}
                  onChange={(e) => set('social.' + key, e.target.value)}
                  placeholder={`${label.toLowerCase()}.com/yourpage`}
                  className="pl-9" />
              </div>
            </Field>
          ))}
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Integrations</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">
          Available on the <span className="font-semibold" style={{ color: GOLD }}>Revenue Engine plan</span> ($249/mo).
        </p>

        <div className="space-y-5">
          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect CRM</div>
            <div className="grid md:grid-cols-3 gap-2">
              {[['Salesforce','#00A1E0'],['HubSpot','#FF7A59'],['EspoCRM','#3B5998']].map(([name, color]) => (
                <button key={name}
                  className="p-3 border border-stone-200 rounded-md hover:border-stone-400 transition flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-display font-bold text-sm" style={{ backgroundColor: color }}>
                    {name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-500">Connect</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect DMS</div>
            <div className="grid md:grid-cols-2 gap-2">
              {['DealerSocket','CDK Global'].map(name => (
                <div key={name} className="p-3 border border-stone-200 rounded-md flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-md bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-sm">{name[0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-400">Enterprise plan</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Connect Lending</div>
            <div className="grid md:grid-cols-3 gap-2">
              {['Capital One','Ally Financial','Chase Auto'].map(name => (
                <div key={name} className="p-3 border border-stone-200 rounded-md flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-md bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-sm">{name[0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-[10px] smallcaps text-stone-400">Coming soon</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Branding footer */}
      <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: GOLD }}>Powered by</div>
            <div className="font-display text-2xl font-medium tracking-tight leading-none">
              AI<span style={{ color: GOLD }}>and</span>WEB<span className="text-stone-400">services</span>
            </div>
            <div className="text-xs text-stone-400 mt-2 max-w-md">
              Custom dealership platforms — websites, lead automation, deal builders, and review management.
              Built for high-volume independent dealers.
            </div>
          </div>
          <a href="https://aiandwebservices.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm font-semibold transition">
            Visit AIandWEBservices <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>

      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="gold" icon={Save} onClick={() => flash('All settings saved')}>Save Settings</Btn>
      </div>
    </div>
  );
}

/* ====================== SERVICE APPOINTMENTS TAB ================= */

function AppointmentsTab({ appointments, setAppointments, flash }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reschedFor, setReschedFor] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [a.customerName, a.phone, a.vehicleMake, a.vehicleModel, a.serviceType].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(a.when) - new Date(b.when));
  }, [appointments, filter, search]);

  const stats = useMemo(() => {
    const today = new Date(TODAY);
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);
    const weekEnd = new Date(today.getTime() + 7 * 86400000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = appointments.filter(a => {
      const d = new Date(a.when);
      return d >= today && d < tomorrow;
    }).length;
    const weekCount = appointments.filter(a => {
      const d = new Date(a.when);
      return d >= today && d < weekEnd;
    }).length;
    const completedMonth = SEED_APPT_HISTORY.filter(h =>
      h.status === 'Completed' && new Date(h.date) >= monthStart
    ).length + appointments.filter(a => a.status === 'Completed').length;

    const allMonth = SEED_APPT_HISTORY.concat(
      appointments.map(a => ({ ...a, date: a.when, amount: a.estimate }))
    ).filter(h => new Date(h.date) >= monthStart);
    const noShows = allMonth.filter(h => h.status === 'No-Show').length;
    const noShowRate = allMonth.length ? (noShows / allMonth.length * 100) : 0;

    const completedThisMonthRevenue = SEED_APPT_HISTORY
      .filter(h => h.status === 'Completed')
      .reduce((s, h) => s + (h.amount || 0), 0)
      + appointments.filter(a => a.status === 'Completed').reduce((s, a) => s + (a.estimate || 0), 0);

    return { todayCount, weekCount, completedMonth, noShowRate, revenue: completedThisMonthRevenue };
  }, [appointments]);

  const update = (id, patch) => setAppointments(arr => arr.map(a => a.id === id ? { ...a, ...patch } : a));

  const transition = (id, status) => {
    update(id, { status });
    flash(`Appointment ${status.toLowerCase()}`);
  };

  const reschedule = () => {
    if (!reschedFor || !reschedDate || !reschedTime) return;
    const iso = new Date(`${reschedDate}T${reschedTime}:00`).toISOString();
    update(reschedFor, { when: iso, status: 'Pending' });
    flash('Appointment rescheduled');
    setReschedFor(null); setReschedDate(''); setReschedTime('');
  };

  const fmtApptTime = (iso) => {
    const d = new Date(iso);
    const today = new Date(TODAY);
    const sameDay = d.toDateString() === today.toDateString();
    const tomorrow = new Date(today.getTime() + 86400000);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (sameDay) return `Today, ${time}`;
    if (isTomorrow) return `Tomorrow, ${time}`;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ', ' + time;
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Service Appointments</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your service bay schedule and customer service history.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Today's Appointments" value={stats.todayCount} icon={Calendar} accent={GOLD} />
        <StatCard label="This Week" value={stats.weekCount} icon={Clock} />
        <StatCard label="Completed This Month" value={stats.completedMonth} icon={Check} accent="#2F7A4A" />
        <StatCard label="No-Show Rate" value={stats.noShowRate.toFixed(1) + '%'}
          icon={AlertTriangle} accent={stats.noShowRate > 10 ? RED_ACCENT : '#a8a39a'}
          sub={stats.noShowRate > 10 ? 'industry avg: 8%' : 'below industry avg'} />
        <StatCard label="Service Revenue" value={fmtMoney(stats.revenue)}
          icon={DollarSign} accent={GOLD} sub={`${new Date(TODAY).toLocaleDateString('en-US', { month: 'long' })} estimated`} />
      </div>

      <Card className="p-3 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, vehicle, service…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="flex bg-stone-100 rounded-md p-0.5 flex-wrap">
            {['all', ...APPT_STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded smallcaps ${filter === s ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Customer</th>
                <th className="px-2 py-2.5 text-left">Vehicle</th>
                <th className="px-2 py-2.5 text-left">Service</th>
                <th className="px-2 py-2.5 text-left">Scheduled</th>
                <th className="px-2 py-2.5 text-right">Est.</th>
                <th className="px-2 py-2.5 text-left">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-stone-500 text-sm">No appointments match your filter.</td></tr>
              ) : filtered.map(a => (
                <React.Fragment key={a.id}>
                  <tr onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${expanded === a.id ? 'bg-stone-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{a.customerName}</div>
                      <div className="text-[11px] text-stone-500 tabular">{a.phone}</div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="font-medium text-[13px]">{a.vehicleYear} {a.vehicleMake} {a.vehicleModel}</div>
                      <div className="text-[10px] text-stone-400 font-mono">VIN ··{(a.vehicleVin || '').slice(-6)}</div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] rounded-full font-medium"
                        style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                        <Wrench className="w-3 h-3" />{a.serviceType}
                      </span>
                    </td>
                    <td className="px-2 py-3 tabular text-stone-700">{fmtApptTime(a.when)}</td>
                    <td className="px-2 py-3 text-right tabular font-medium">{fmtMoney(a.estimate)}</td>
                    <td className="px-2 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {a.status === 'Pending' && (
                          <Btn size="sm" variant="default" onClick={() => transition(a.id, 'Confirmed')}>Confirm</Btn>
                        )}
                        {a.status === 'Confirmed' && (
                          <Btn size="sm" variant="outlineGold" onClick={() => transition(a.id, 'In Progress')}>Start</Btn>
                        )}
                        {a.status === 'In Progress' && (
                          <Btn size="sm" variant="dark" onClick={() => transition(a.id, 'Completed')}>Complete</Btn>
                        )}
                        {(a.status === 'Pending' || a.status === 'Confirmed') && (
                          <IconBtn icon={X} title="Cancel" tone="danger" onClick={() => transition(a.id, 'Cancelled')} />
                        )}
                        {a.status === 'Confirmed' && (
                          <IconBtn icon={AlertCircle} title="No-Show" tone="danger" onClick={() => transition(a.id, 'No-Show')} />
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr>
                      <td colSpan={7} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="grid lg:grid-cols-3 gap-5">
                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Customer Details</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="font-medium">{a.customerName}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">Phone</span><a href={`tel:${a.phone}`} className="font-mono tabular hover:underline">{a.phone}</a></div>
                                <div className="flex justify-between"><span className="text-stone-500">Email</span><a href={`mailto:${a.email}`} className="font-mono text-[12px] hover:underline">{a.email}</a></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Vehicle</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-stone-500">Year/Make/Model</span><span className="font-medium">{a.vehicleYear} {a.vehicleMake} {a.vehicleModel}</span></div>
                                <div className="flex justify-between"><span className="text-stone-500">VIN</span><span className="font-mono text-[12px]">{a.vehicleVin}</span></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Service Notes</div>
                              <Textarea value={a.notes || ''}
                                onChange={(e) => update(a.id, { notes: e.target.value })}
                                rows={3} placeholder="Tech notes, customer concerns, parts needed…" />
                            </div>
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Service History</div>
                              <div className="bg-white border border-stone-200 rounded-md p-4 text-sm text-stone-600">
                                {a.history || 'No prior service records.'}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Reschedule</div>
                              {reschedFor === a.id ? (
                                <div className="bg-white border border-stone-200 rounded-md p-4 space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={reschedDate} onChange={(e) => setReschedDate(e.target.value)}
                                      className="px-2 py-1.5 border border-stone-200 rounded text-sm tabular ring-gold" />
                                    <input type="time" value={reschedTime} onChange={(e) => setReschedTime(e.target.value)}
                                      className="px-2 py-1.5 border border-stone-200 rounded text-sm tabular ring-gold" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Btn size="sm" variant="gold" onClick={reschedule}>Save</Btn>
                                    <Btn size="sm" variant="ghost" onClick={() => setReschedFor(null)}>Cancel</Btn>
                                  </div>
                                </div>
                              ) : (
                                <Btn variant="default" icon={Calendar} className="w-full"
                                  onClick={() => {
                                    const d = new Date(a.when);
                                    setReschedDate(d.toISOString().slice(0, 10));
                                    setReschedTime(d.toISOString().slice(11, 16));
                                    setReschedFor(a.id);
                                  }}>
                                  Reschedule
                                </Btn>
                              )}
                            </div>

                            <Field label="Service Type">
                              <Select value={a.serviceType}
                                onChange={(e) => update(a.id, { serviceType: e.target.value, estimate: SERVICE_RATES[e.target.value] || a.estimate })}>
                                {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <Field label="Service Advisor">
                              <Input value={a.advisor || ''} onChange={(e) => update(a.id, { advisor: e.target.value })}
                                placeholder="Assign advisor…" />
                            </Field>

                            <Field label="Status">
                              <Select value={a.status} onChange={(e) => update(a.id, { status: e.target.value })}>
                                {APPT_STATUSES.map(s => <option key={s}>{s}</option>)}
                              </Select>
                            </Field>

                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <a href={`tel:${a.phone}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <Phone className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Call</span>
                              </a>
                              <a href={`sms:${a.phone}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Text</span>
                              </a>
                              <a href={`mailto:${a.email}`} className="flex flex-col items-center gap-1 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition">
                                <Mail className="w-3.5 h-3.5 text-stone-700" />
                                <span className="text-[10px] font-medium">Email</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ====================== PERFORMANCE TAB ========================== */

function PerformanceTab() {
  const traffic = [180, 210, 195, 220, 240, 190, 230];
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const maxTraffic = Math.max(...traffic);

  const topPages = [
    { page: 'Homepage', pct: 45 },
    { page: 'Inventory', pct: 32 },
    { page: 'Finance', pct: 12 },
    { page: 'Trade-In', pct: 6 },
    { page: 'Service', pct: 5 }
  ];

  const sources = [
    { name: 'Google Search', pct: 52, color: '#4285F4' },
    { name: 'Direct', pct: 18, color: '#a8a39a' },
    { name: 'Facebook', pct: 14, color: '#1877F2' },
    { name: 'Google My Business', pct: 9, color: '#34A853' },
    { name: 'Cars.com referral', pct: 4, color: GOLD },
    { name: 'Other', pct: 3, color: '#d6d2c8' }
  ];

  const cwv = [
    { metric: 'LCP', label: 'Largest Contentful Paint', value: '1.1s', threshold: '2.5s', desc: 'How fast main content appears' },
    { metric: 'INP', label: 'Interaction to Next Paint', value: '45ms', threshold: '200ms', desc: 'Responsiveness to user input' },
    { metric: 'CLS', label: 'Cumulative Layout Shift', value: '0.02', threshold: '0.10', desc: 'Visual stability during load' }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Website Performance</h1>
          <p className="text-sm text-stone-500 mt-1">
            How your customer-facing site is performing — speed, traffic, and engagement.
          </p>
        </div>
        <div className="text-[10px] smallcaps text-stone-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
          Live data · last 30 days
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Page Load Time" value="1.2s" icon={Zap} accent="#2F7A4A" sub="↓ 0.3s vs last month" />
        <StatCard label="Mobile Score" value={<span>94<span className="text-stone-400 text-base">/100</span></span>} icon={Smartphone} accent="#2F7A4A" />
        <StatCard label="Desktop Score" value={<span>98<span className="text-stone-400 text-base">/100</span></span>} icon={Monitor} accent="#2F7A4A" />
        <StatCard label="Bounce Rate" value="32%" icon={TrendingDown} accent="#2F7A4A" sub="industry avg: 58%" />
        <StatCard label="Avg Session" value="3:42" icon={Clock} sub="48% above industry" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-stone-500" />
                <h2 className="font-display text-xl font-medium">Core Web Vitals</h2>
              </div>
              <p className="text-xs text-stone-500">Google's three key page-experience metrics</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold smallcaps flex items-center gap-1.5"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
              <BadgeCheck className="w-3 h-3" /> All Passing
            </div>
          </div>
          <div className="space-y-4">
            {cwv.map(m => (
              <div key={m.metric} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <div className="font-display text-2xl font-medium tabular leading-none" style={{ color: '#2F7A4A' }}>{m.value}</div>
                  <div className="text-[10px] smallcaps text-stone-400 mt-1">{m.metric}</div>
                </div>
                <div className="col-span-7">
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{m.desc}</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-[11px] text-stone-500 tabular">good ≤ {m.threshold}</div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F2EC' }}>
                    <Check className="w-3.5 h-3.5" style={{ color: '#256B40' }} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-md text-xs leading-relaxed flex items-start gap-2"
            style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.08), transparent)', borderLeft: `3px solid ${GOLD}` }}>
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: GOLD }} />
            <div>
              <strong>Your site passes Google's Core Web Vitals — most dealer sites DON'T.</strong>
              <span className="text-stone-600"> Sites that pass rank higher in search results and convert 24% more visitors.</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Smartphone className="w-4 h-4 text-stone-500" />
            <h2 className="font-display text-xl font-medium">Device Split</h2>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-stone-600 flex items-center gap-2"><Smartphone className="w-3.5 h-3.5" />Mobile</span>
                <span className="font-display tabular text-2xl font-medium">72%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: GOLD }} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-stone-600 flex items-center gap-2"><Monitor className="w-3.5 h-3.5" />Desktop</span>
                <span className="font-display tabular text-2xl font-medium">28%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: '#a8a39a' }} />
              </div>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
            Most car shoppers research on mobile. Your site is optimized for both — many dealers' sites fail mobile usability tests.
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-stone-500" />
              <h2 className="font-display text-xl font-medium">Daily Traffic — Last 7 Days</h2>
            </div>
            <span className="font-display tabular text-2xl font-medium">
              {traffic.reduce((a,b) => a+b, 0).toLocaleString()} <span className="text-xs text-stone-400 font-normal">visitors</span>
            </span>
          </div>
          <div className="flex items-end gap-3 h-48 mt-6">
            {traffic.map((v, i) => {
              const h = (v / maxTraffic) * 100;
              const isToday = i === traffic.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="font-display tabular text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition">{v}</div>
                  <div className="w-full bg-stone-100 rounded-t-md relative overflow-hidden" style={{ height: '160px' }}>
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all"
                      style={{ height: h + '%', background: isToday ? `linear-gradient(to top, ${GOLD}, #E8C97A)` : 'linear-gradient(to top, #6b655b, #a8a39a)' }} />
                  </div>
                  <div className="text-[10px] smallcaps text-stone-500">{dayLabels[i]}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-stone-500" />
            <h2 className="font-display text-xl font-medium">Top Pages</h2>
          </div>
          <div className="space-y-3">
            {topPages.map((p, i) => (
              <div key={p.page}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-medium">{p.page}</span>
                  <span className="font-display tabular text-sm font-semibold">{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: p.pct + '%', backgroundColor: i === 0 ? GOLD : '#a8a39a' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Traffic Sources</h2>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {sources.map(s => (
            <div key={s.name} title={s.name} style={{ width: s.pct + '%', backgroundColor: s.color }} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sources.map(s => (
            <div key={s.name} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-sm flex-1">{s.name}</span>
              <span className="font-display tabular text-sm font-semibold">{s.pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-stone-900 text-white border-stone-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 -translate-y-1/2 translate-x-1/3"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
        <div className="relative flex items-center gap-3">
          <Activity className="w-5 h-5" style={{ color: GOLD }} />
          <div className="flex-1">
            <div className="text-[10px] smallcaps font-semibold mb-0.5" style={{ color: GOLD }}>Performance Monitoring</div>
            <div className="text-sm">Live performance tracking powered by <strong>AIandWEBservices</strong> — included free with every Primo platform subscription.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

