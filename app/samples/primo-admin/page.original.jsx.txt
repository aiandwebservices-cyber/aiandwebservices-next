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
  Wrench, Activity, Gauge, Timer, Shield, Flag, Reply,
  TrendingDown, BadgeCheck, Smartphone, Monitor, Sun, Moon, HelpCircle, Bookmark, Camera
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
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true, noOpenRecalls: true },
    description: 'Luxurious BMW X5 with premium package, panoramic roof, and full service history. A standout xDrive40i in pristine condition.',
    photos: [], dateAdded: isoDaysAgo(12) },
  { id: 'v2', year: 2022, make: 'Mercedes-Benz', model: 'GLE 350', trim: '4MATIC', bodyStyle: 'SUV',
    cost: 32000, listPrice: 41500, salePrice: 38750, mileage: 34100, exteriorColor: 'Silver',
    interiorColor: 'Black', engine: '2.0L Turbo Inline-4', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 22, mpgHwy: 28, vin: '4JGFB4KB2NA123456',
    stockNumber: 'P10198', status: 'On Sale', daysOnLot: 38, views: 892,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false, noOpenRecalls: true },
    description: 'Recently reduced — Mercedes GLE 350 with MBUX infotainment, heated seats, and a flawless ride.',
    photos: [], dateAdded: isoDaysAgo(38) },
  { id: 'v3', year: 2024, make: 'Audi', model: 'Q5', trim: 'Premium Plus', bodyStyle: 'SUV',
    cost: 38200, listPrice: 44900, salePrice: null, mileage: 12300, exteriorColor: 'White',
    interiorColor: 'Black', engine: '2.0L TFSI', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 23, mpgHwy: 28, vin: 'WA1BNAFY8R2123456',
    stockNumber: 'P10301', status: 'Just Arrived', daysOnLot: 3, views: 412,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true, noOpenRecalls: true },
    description: 'Just arrived — Audi Q5 Premium Plus with virtual cockpit, Bang & Olufsen sound, and remaining factory warranty.',
    photos: [], dateAdded: isoDaysAgo(3) },
  { id: 'v4', year: 2021, make: 'Lexus', model: 'RX 350', trim: 'F Sport', bodyStyle: 'SUV',
    cost: 25800, listPrice: 31995, salePrice: null, mileage: 41200, exteriorColor: 'Gray',
    interiorColor: 'Red', engine: '3.5L V6', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 20, mpgHwy: 27, vin: '2T2BZMCA2MC123456',
    stockNumber: 'P10089', status: 'Available', daysOnLot: 52, views: 587,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false, noOpenRecalls: true },
    description: 'Lexus RX 350 F Sport with red interior package, Mark Levinson audio, and meticulous service records.',
    photos: [], dateAdded: isoDaysAgo(52) },
  { id: 'v5', year: 2023, make: 'Tesla', model: 'Model Y', trim: 'Long Range', bodyStyle: 'SUV',
    cost: 30100, listPrice: 36500, salePrice: null, mileage: 19800, exteriorColor: 'White',
    interiorColor: 'Black', engine: 'Dual Motor Electric', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Electric', mpgCity: 127, mpgHwy: 117, vin: '7SAYGDEE9PF123456',
    stockNumber: 'P10256', status: 'Featured', daysOnLot: 8, views: 1893,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true, noOpenRecalls: true },
    description: 'Tesla Model Y Long Range — Autopilot, premium connectivity, and Supercharger access. Range over 330 miles.',
    photos: [], dateAdded: isoDaysAgo(8) },
  { id: 'v6', year: 2022, make: 'Porsche', model: 'Cayenne', trim: 'Base', bodyStyle: 'SUV',
    cost: 44900, listPrice: 52800, salePrice: null, mileage: 22500, exteriorColor: 'Black',
    interiorColor: 'Black', engine: '3.0L V6 Turbo', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Gas', mpgCity: 19, mpgHwy: 23, vin: 'WP1AA2AY9NDA12345',
    stockNumber: 'P10167', status: 'Available', daysOnLot: 27, views: 1041,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: false, noOpenRecalls: true },
    description: 'Porsche Cayenne with sport chrono package, premium plus interior, and sport exhaust. A driver’s SUV.',
    photos: [], dateAdded: isoDaysAgo(27) },
  { id: 'v7', year: 2023, make: 'Land Rover', model: 'Range Rover Sport', trim: 'SE', bodyStyle: 'SUV',
    cost: 53200, listPrice: 65900, salePrice: 61995, mileage: 15700, exteriorColor: 'Silver',
    interiorColor: 'Black', engine: '3.0L Mild-Hybrid Inline-6', transmission: 'Automatic',
    drivetrain: 'AWD', fuelType: 'Hybrid', mpgCity: 21, mpgHwy: 26, vin: 'SAL1V9EU1PA123456',
    stockNumber: 'P10145', status: 'Price Drop', daysOnLot: 45, views: 723,
    history: { noAccidents: true, oneOwner: true, cleanTitle: true, serviceRecords: true, inspection: true, carfax: true, warranty: true, noOpenRecalls: true },
    description: 'Range Rover Sport SE with meridian sound, panoramic roof, and adaptive air suspension. Price drop — strong value.',
    photos: [], dateAdded: isoDaysAgo(45) },
  { id: 'v8', year: 2022, make: 'Cadillac', model: 'Escalade', trim: 'Premium Luxury', bodyStyle: 'SUV',
    cost: 46500, listPrice: 54900, salePrice: null, mileage: 31400, exteriorColor: 'Black',
    interiorColor: 'Beige', engine: '6.2L V8', transmission: 'Automatic',
    drivetrain: '4WD', fuelType: 'Gas', mpgCity: 14, mpgHwy: 19, vin: '1GYS4DKL9NR123456',
    stockNumber: 'P10067', status: 'Available', daysOnLot: 63, views: 951,
    history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: true, inspection: true, carfax: false, warranty: false, noOpenRecalls: true },
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

// CSS variables driving the theme system. Sidebar/topbar stay dark in both modes (handled via Tailwind bg-stone-900 directly).
const THEMES = {
  light: {
    '--bg-app':       '#FAFAF7',
    '--bg-card':      '#FFFFFF',
    '--bg-elevated':  '#F5F5F0',
    '--bg-input':     '#FFFFFF',
    '--text-primary': '#1C1917',
    '--text-secondary': '#57534E',
    '--text-muted':   '#A8A29E',
    '--border':       '#E7E5E4',
    '--border-strong':'#D6D3D1',
    '--table-header': '#F5F5F0',
    '--table-hover':  '#FAFAF8',
    '--table-stripe': '#FDFCFB'
  },
  dark: {
    '--bg-app':       '#0F0F0F',
    '--bg-card':      '#1A1A1A',
    '--bg-elevated':  '#252525',
    '--bg-input':     '#1F1F1F',
    '--text-primary': '#F5F5F0',
    '--text-secondary': '#A8A29E',
    '--text-muted':   '#78716C',
    '--border':       '#2A2A2A',
    '--border-strong':'#3A3A3A',
    '--table-header': '#1F1F1F',
    '--table-hover':  '#1A1A1A',
    '--table-stripe': '#151515'
  }
};

const SEED_ACTIVITY = [
  { id: 'act1',  type: 'lead-new',    title: 'New lead: Maria Rodriguez',                 sub: 'Get E-Price · 2023 BMW X5',                  when: isoDaysAgo(0.083), refTab: 'leads' },
  { id: 'act2',  type: 'price-drop',  title: 'Price changed on 2022 Mercedes-Benz GLE',   sub: '$41,500 → $38,750',                          when: isoDaysAgo(0.42),  refTab: 'inventory' },
  { id: 'act3',  type: 'lead-status', title: 'James Thompson lead marked Contacted',      sub: 'Pre-Approval',                               when: isoDaysAgo(1),     refTab: 'leads' },
  { id: 'act4',  type: 'reservation', title: 'Reservation created: Ana Gutierrez',        sub: '2022 Porsche 911 · $500 deposit',             when: isoDaysAgo(0.5),   refTab: 'dashboard' },
  { id: 'act5',  type: 'sold',        title: '2021 Lexus RX 350 marked Sold to Mike Johnson', sub: 'Sale price: $31,500',                    when: isoDaysAgo(2),     refTab: 'sold' },
  { id: 'act6',  type: 'feature',     title: '2023 BMW X5 marked Featured',               sub: 'Showcased on homepage',                      when: isoDaysAgo(3),     refTab: 'inventory' },
  { id: 'act7',  type: 'lead-new',    title: 'New lead: Sarah Kim',                       sub: 'Trade-In · 2023 Tesla Model Y',              when: isoDaysAgo(3.5),   refTab: 'leads' },
  { id: 'act8',  type: 'appointment', title: 'Service appointment confirmed',             sub: 'Mike Johnson · Oil Change · Mon 9 AM',       when: isoDaysAgo(4),     refTab: 'appointments' },
  { id: 'act9',  type: 'sold',        title: '2022 Cadillac Escalade marked Sold',        sub: 'Buyer: Roberto Diaz · $54,900',              when: isoDaysAgo(7),     refTab: 'sold' },
  { id: 'act10', type: 'review',      title: 'New 5★ review from Mike J.',                sub: '"Best used car experience in Miami…"',       when: isoDaysAgo(3),     refTab: 'marketing' }
];

const SEED_REVIEWS = [
  { id: 'rv1', author: 'Mike J.', rating: 5, text: "Best used car experience in Miami. Carlos made everything easy. Love my Camry!", date: isoDaysAgo(3), platform: 'Google', responded: false, response: '' },
  { id: 'rv2', author: 'Lisa P.', rating: 5, text: "No pressure, fair price, and they delivered to my door. Will buy here again.", date: isoDaysAgo(7), platform: 'Google', responded: false, response: '' },
  { id: 'rv3', author: 'David C.', rating: 4, text: "Great selection and pricing. Finance took a bit long but overall happy.", date: isoDaysAgo(14), platform: 'Google', responded: true, response: "Thanks David — appreciate the feedback. We've streamlined our finance team since then. Enjoy the Audi!" }
];

const TEAM_MEMBERS = [
  { name: 'Carlos Rivera',   role: 'Sales' },
  { name: 'Maria Santos',    role: 'Finance' },
  { name: 'James Mitchell',  role: 'Sales' },
  { name: 'Ana Gutierrez',   role: 'Service Advisor' }
];

const SEED_TASKS = [
  { id: 'tk1', title: 'Call Maria Rodriguez back',          dueAt: isoAt(0, 14),  assignedTo: 'Carlos Rivera',  relatedTo: 'Maria Rodriguez',  priority: 'High',   status: 'Open',      notes: 'Wants to know about BMW X5 financing options.' },
  { id: 'tk2', title: 'Follow up after test drive',         dueAt: isoAt(1, 11),  assignedTo: 'James Mitchell', relatedTo: 'Sarah Kim',        priority: 'Medium', status: 'Open',      notes: 'Test drove Tesla Model Y on Saturday. Loved it. Send pricing follow-up.' },
  { id: 'tk3', title: 'Send Carlos deal paperwork',         dueAt: isoAt(-1, 16), assignedTo: 'Maria Santos',   relatedTo: 'Carlos Mendez',    priority: 'High',   status: 'Open',      notes: 'GLE 350 deal. Buyer signed offer — needs final paperwork emailed.' },
  { id: 'tk4', title: "Check if Ana's financing approved", dueAt: isoAt(2, 10),  assignedTo: 'Carlos Rivera',  relatedTo: 'Ana Gutierrez',    priority: 'Low',    status: 'Open',      notes: 'Reservation on Porsche 911. Capital One pre-approval pending.' }
];

const SEED_MESSAGES = {
  // keyed by lead id; messages have {dir, channel, text, when}
  l5: [
    { id: 'm1', dir: 'out', channel: 'sms', text: "Hi Carlos, thanks for your interest in the Mercedes GLE. When works for a test drive?", when: isoDaysAgo(2.1) },
    { id: 'm2', dir: 'in',  channel: 'sms', text: "How about Saturday morning?",                                                              when: isoDaysAgo(2.0) },
    { id: 'm3', dir: 'out', channel: 'sms', text: "Perfect, I've got you down for Saturday 10AM. See you then!",                              when: isoDaysAgo(1.95) }
  ]
};

const SEED_SETTINGS = {
  adminTheme: 'light',
  savedViews: {
    inventory: [
      { id: 'sv-i-1', name: 'Aging 60+ days',     filter: { search: '', status: 'all', sort: 'daysOnLot-desc', minDays: 60 } },
      { id: 'sv-i-2', name: 'Featured vehicles',  filter: { search: '', status: 'Featured', sort: 'recent' } }
    ],
    leads: [
      { id: 'sv-l-1', name: 'New leads today',    filter: { search: '', status: 'New', source: 'all' } },
      { id: 'sv-l-2', name: 'Trade-ins',          filter: { search: '', status: 'all', source: 'Trade-In' } }
    ]
  },
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

// Module-level error handler — PrimoAdmin registers a flash() callback so storage failures surface as red toasts.
let _storageErrorHandler = null;
const setStorageErrorHandler = (fn) => { _storageErrorHandler = fn; };

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
    } catch (err) {
      if (_storageErrorHandler) _storageErrorHandler(err, key);
      else if (typeof console !== 'undefined') console.error('storage.set failed', key, err);
    }
  }
};

/* ------------------------------------------------------------------ */
/*  EXTERNAL APIs (NHTSA, FuelEconomy.gov, EspoCRM)                    */
/* ------------------------------------------------------------------ */

const NHTSA_TTL_MS = 30 * 24 * 3600 * 1000;
const POPULAR_MAKES = [
  'Toyota','Honda','Ford','Chevrolet','BMW','Mercedes-Benz','Audi','Lexus','Nissan','Hyundai',
  'Kia','Jeep','Subaru','Volkswagen','Porsche','Tesla','Ram','GMC','Cadillac','Land Rover'
];

const ESPO_BASE = 'http://localhost:8081';
const ESPO_API_KEY = '7190e14d23e6ca8d68a5d2b29c91e55e';
const ESPO_VEHICLE_ENTITY = 'CVehicle';

async function cachedFetch(cacheKey, fetcher) {
  const hit = await storage.get(cacheKey, null);
  if (hit && hit.ts && Date.now() - hit.ts < NHTSA_TTL_MS) return hit.data;
  const data = await fetcher();
  await storage.set(cacheKey, { ts: Date.now(), data });
  return data;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const mapBodyClass = (s) => {
  const x = String(s || '').toLowerCase();
  if (!x) return null;
  if (x.includes('sedan')) return 'Sedan';
  if (x.includes('suv') || x.includes('sport utility') || x.includes('cuv') || x.includes('crossover')) return 'SUV';
  if (x.includes('pickup') || x.includes('truck')) return 'Truck';
  if (x.includes('coupe')) return 'Coupe';
  if (x.includes('convertible') || x.includes('roadster') || x.includes('cabriolet')) return 'Convertible';
  if (x.includes('hatchback')) return 'Hatchback';
  if (x.includes('wagon')) return 'Wagon';
  if (x.includes('van') || x.includes('minivan')) return 'Van';
  return null;
};
const mapTransmission = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('cvt') || x.includes('continuously')) return 'CVT';
  if (x.includes('manual')) return 'Manual';
  if (x.includes('auto')) return 'Automatic';
  return null;
};
const mapDrivetrain = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('4wd') || x.includes('4x4') || x.includes('four-wheel') || x.includes('4-wheel')) return '4WD';
  if (x.includes('awd') || x.includes('all-wheel') || x.includes('all wheel')) return 'AWD';
  if (x.includes('rwd') || x.includes('rear-wheel') || x.includes('rear wheel')) return 'RWD';
  if (x.includes('fwd') || x.includes('front-wheel') || x.includes('front wheel')) return 'FWD';
  return null;
};
const mapFuelType = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('plug-in') || x.includes('phev')) return 'PHEV';
  if (x.includes('hybrid')) return 'Hybrid';
  if (x.includes('electric') || x.includes('bev')) return 'Electric';
  if (x.includes('diesel')) return 'Diesel';
  if (x.includes('gasoline') || x.includes('gas') || x.includes('petrol') || x.includes('flex')) return 'Gas';
  return null;
};

async function nhtsaDecodeVin(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
  const json = await fetchWithTimeout(url);
  const r = (json.Results && json.Results[0]) || {};
  if (!r.Make && !r.ModelYear) return null;
  const cylPrefix = r.EngineConfiguration ? String(r.EngineConfiguration).match(/^[A-Z]/i) : null;
  const engineParts = [
    r.DisplacementL ? `${parseFloat(r.DisplacementL).toFixed(1)}L` : '',
    mapFuelType(r.FuelTypePrimary) || (r.FuelTypePrimary || ''),
    r.EngineConfiguration && r.EngineCylinders
      ? `${cylPrefix ? cylPrefix[0] : ''}${r.EngineCylinders}`
      : (r.EngineCylinders ? `${r.EngineCylinders}cyl` : '')
  ].filter(Boolean).join(' ');
  return {
    raw: r,
    fields: {
      year: r.ModelYear || null,
      make: r.Make || null,
      model: r.Model || null,
      trim: r.Trim || null,
      bodyStyle: mapBodyClass(r.BodyClass),
      engine: engineParts || null,
      transmission: mapTransmission(r.TransmissionStyle),
      drivetrain: mapDrivetrain(r.DriveType),
      fuelType: mapFuelType(r.FuelTypePrimary),
    }
  };
}

async function nhtsaGetAllMakes() {
  return cachedFetch('nhtsa-makes', async () => {
    const json = await fetchWithTimeout('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json', {}, 8000);
    const names = (json.Results || []).map(m => m.Make_Name).filter(Boolean);
    return Array.from(new Set(names.map(n => n.replace(/\b\w/g, c => c.toUpperCase())))).sort();
  });
}

async function nhtsaGetModelsForMake(make) {
  const key = `nhtsa-models-${String(make).toLowerCase()}`;
  return cachedFetch(key, async () => {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
    const json = await fetchWithTimeout(url);
    const names = (json.Results || []).map(m => m.Model_Name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  });
}

async function fuelEconomyLookup(year, make, model) {
  const opts = await fetchWithTimeout(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
    { headers: { Accept: 'application/json' } }
  );
  const items = Array.isArray(opts.menuItem) ? opts.menuItem : (opts.menuItem ? [opts.menuItem] : []);
  if (!items.length) return null;
  const id = items[0].value;
  if (!id) return null;
  const ympg = await fetchWithTimeout(
    `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${encodeURIComponent(id)}`,
    { headers: { Accept: 'application/json' } }
  );
  const city = parseFloat(ympg.city);
  const hwy = parseFloat(ympg.highway);
  if (!Number.isFinite(city) && !Number.isFinite(hwy)) return null;
  return {
    mpgCity: Number.isFinite(city) ? Math.round(city) : 0,
    mpgHwy: Number.isFinite(hwy) ? Math.round(hwy) : 0
  };
}

async function nhtsaRecalls(year, make, model) {
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const json = await fetchWithTimeout(url);
  return (json.results || []).map(r => ({
    campaign: r.NHTSACampaignNumber || r.CampaignNumber || '—',
    summary: (r.Summary || r.Component || '').slice(0, 100)
  }));
}

async function espoSaveVehicle(formVehicle) {
  const payload = {
    name: `${formVehicle.year || ''} ${formVehicle.make || ''} ${formVehicle.model || ''}`.trim(),
    cYear: Number(formVehicle.year) || null,
    cMake: formVehicle.make || null,
    cModel: formVehicle.model || null,
    cTrim: formVehicle.trim || null,
    cBodyStyle: formVehicle.bodyStyle || null,
    cExteriorColor: formVehicle.exteriorColor || null,
    cInteriorColor: formVehicle.interiorColor || null,
    cEngine: formVehicle.engine || null,
    cTransmission: formVehicle.transmission || null,
    cDrivetrain: formVehicle.drivetrain || null,
    cFuelType: formVehicle.fuelType || null,
    cMpgCity: Number(formVehicle.mpgCity) || null,
    cMpgHwy: Number(formVehicle.mpgHwy) || null,
    cVin: formVehicle.vin || null,
    cStockNumber: formVehicle.stockNumber || null,
    cMileage: Number(formVehicle.mileage) || null,
    cListPrice: Number(formVehicle.listPrice) || null,
    cSalePrice: formVehicle.salePrice ? Number(formVehicle.salePrice) : null,
    cCost: Number(formVehicle.cost) || null,
    cStatus: formVehicle.status || null,
    cDescription: formVehicle.description || null,
    cHasOpenRecalls: !!formVehicle.hasOpenRecalls
  };
  const espoId = formVehicle.espoId || null;
  const url = espoId
    ? `${ESPO_BASE}/api/v1/${ESPO_VEHICLE_ENTITY}/${encodeURIComponent(espoId)}`
    : `${ESPO_BASE}/api/v1/${ESPO_VEHICLE_ENTITY}`;
  const method = espoId ? 'PUT' : 'POST';
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': ESPO_API_KEY },
      body: JSON.stringify(payload),
      signal: ctl.signal
    });
    if (!res.ok) throw new Error(`Espo HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data.id || espoId, raw: data };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  } finally {
    clearTimeout(t);
  }
}

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
    @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
    .anim-fade { animation: fade-in 120ms ease both; }
    @keyframes saved-pulse { 0% { background-color: rgba(16, 185, 129, 0); } 30% { background-color: rgba(16, 185, 129, 0.18); } 100% { background-color: rgba(16, 185, 129, 0); } }
    .saved-pulse { animation: saved-pulse 1.4s ease both; }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; }
      main, .print-area { padding: 0 !important; margin: 0 !important; }
      * { box-shadow: none !important; }
    }
    /* Theme-aware table surfaces */
    table thead { background-color: var(--table-header); }
    table tbody tr:hover { background-color: var(--table-hover); }
    .themed-row:hover { background-color: var(--table-hover); }
    /* Inputs lose stone borders in dark mode */
    input, select, textarea { color-scheme: light dark; }
  `}</style>
);

const StatusBadge = ({ status, size = 'sm' }) => {
  // Each entry: bg, fg, dot, plus optional `icon` (lucide component) for negative states
  // Goal: every status family gets a distinct hue. Negative states (No-Show, Lost, Cancelled, Expired) carry an icon.
  const map = {
    // Inventory
    'Available':     { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
    'Featured':      { bg: GOLD_SOFT, fg: '#7A5A0F', dot: GOLD, icon: Star },
    'On Sale':       { bg: '#FCE5E5', fg: '#9B1C1C', dot: '#C53030', icon: Tag },
    'Just Arrived':  { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
    'Price Drop':    { bg: '#FFEDD5', fg: '#9A3412', dot: '#EA580C' },
    'Pending':       { bg: '#FEF3C7', fg: '#92400E', dot: '#D97706' },
    'Sold':          { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' },
    'Reserved':      { bg: 'transparent', fg: '#7A5A0F', dot: GOLD, border: GOLD },
    // Lead pipeline
    'New':           { bg: '#FBE6E6', fg: '#A12B2B', dot: RED_ACCENT, pulse: true },
    'Contacted':     { bg: '#FEF9C3', fg: '#854D0E', dot: '#CA8A04' },
    'Appointment Set':{bg: '#E0E7FF', fg: '#3730A3', dot: '#4F46E5' },
    'Showed':        { bg: '#F3E8FF', fg: '#6B21A8', dot: '#9333EA' },
    'Lost':          { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X, strike: true },
    // Deal pipeline
    'New Deal':      { bg: '#DBEAFE', fg: '#1E40AF', dot: '#2563EB' },
    'Working':       { bg: '#BFDBFE', fg: '#1D4ED8', dot: '#3B82F6' },
    'Approved':      { bg: '#D1FAE5', fg: '#065F46', dot: '#059669' },
    'Delivered':     { bg: '#CCFBF1', fg: '#115E59', dot: '#0D9488' },
    // Appointments
    'Confirmed':     { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
    'In Progress':   { bg: '#CFFAFE', fg: '#155E75', dot: '#0891B2' },
    'Completed':     { bg: '#D1FAE5', fg: '#065F46', dot: '#059669', icon: Check },
    'No-Show':       { bg: '#FECDD3', fg: '#9F1239', dot: '#BE123C', icon: X },
    'Cancelled':     { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X },
    // Reservations
    'Expired':       { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', icon: X },
    'Released':      { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E' }
  };
  const s = map[status] || { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'} rounded-full font-semibold smallcaps ${s.strike ? 'line-through' : ''}`}
      style={{ backgroundColor: s.bg, color: s.fg, border: s.border ? `1px solid ${s.border}` : undefined }}>
      {Icon ? <Icon className="w-3 h-3" strokeWidth={2.5} style={{ color: s.dot }} fill={Icon === Star ? s.dot : 'none'} />
        : <span className={`w-1.5 h-1.5 rounded-full ${s.pulse ? 'pulse-dot' : ''}`} style={{ backgroundColor: s.dot }} />}
      {status}
    </span>
  );
};

// Lead source — colored left border per category, distinct from status badges.
const LEAD_SOURCE_BORDERS = {
  'Get E-Price':     '#D4AF37', // gold (money)
  'Build Your Deal': '#D4AF37',
  'Pre-Approval':    '#2563EB', // blue (finance)
  'Inventory Alert': '#2563EB',
  'Test Drive':      '#10B981', // green (action)
  'Reserve':         '#10B981',
  'Chat':            '#9333EA', // purple (comm)
  'Phone Call':      '#9333EA',
  'Trade-In':        '#EA580C', // orange (service)
  'Service':         '#EA580C',
  'Contact':         '#78716C'  // stone (general)
};
const LeadSourceBadge = ({ source }) => {
  const border = LEAD_SOURCE_BORDERS[source] || '#78716C';
  return (
    <span className="inline-block pl-2 pr-2.5 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-r-md"
      style={{ borderLeft: `3px solid ${border}` }}>
      {source}
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
      <label className="text-[11px] font-semibold smallcaps" style={{ color: 'var(--text-secondary)' }}>
        {label}{required && <span className="text-red-700 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <div className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>{hint}</div>}
  </div>
);

const Input = React.forwardRef(({ className = '', style, ...props }, ref) => (
  <input ref={ref} {...props}
    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
    className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold transition ${className}`} />
));

const Select = ({ children, className = '', style, ...props }) => (
  <div className="relative">
    <select {...props}
      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
      className={`w-full pl-3 pr-9 py-2 border rounded-md text-sm appearance-none ring-gold ${className}`}>
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
  </div>
);

const Textarea = ({ className = '', style, ...props }) => (
  <textarea {...props}
    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)', ...style }}
    className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold resize-y ${className}`} />
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
  <div className={`rounded-lg ${className}`}
    style={{ backgroundColor: 'var(--bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
    {children}
  </div>
);

const SectionHeader = ({ eyebrow, title, action, className = '' }) => (
  <div className={`flex items-end justify-between mb-4 ${className}`}>
    <div>
      {eyebrow && <div className="text-[10px] font-semibold smallcaps mb-1" style={{ color: 'var(--text-muted)' }}>{eyebrow}</div>}
      <h2 className="font-display text-2xl font-medium tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>{title}</h2>
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
      <span className={`absolute right-1 bottom-0.5 font-display font-medium ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.7)' }}>{initials}</span>
    </div>
  );
};

const StatCard = ({ label, value, sub, accent, icon: Icon }) => (
  <div className="rounded-lg p-4 relative"
    style={{ backgroundColor: 'var(--bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border)' }}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {Icon && <Icon className="w-4 h-4" style={{ color: accent || 'var(--text-muted)' }} strokeWidth={1.75} />}
    </div>
    <div className="font-display text-2xl font-medium tracking-tight tabular leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
    {sub && <div className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
);

/* Reusable confirmation dialog. Optional `inputs` for capturing data inline (e.g., buyer name on Mark Sold). */
const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', confirmColor = 'red', onConfirm, onCancel, inputs = [] }) => {
  const [values, setValues] = useState({});
  useEffect(() => {
    if (isOpen) {
      const init = {};
      inputs.forEach(i => { init[i.name] = i.defaultValue ?? ''; });
      setValues(init);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  if (!isOpen) return null;
  const colorMap = {
    red:  'bg-red-600 hover:bg-red-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    gold: 'text-stone-900 hover:brightness-95',
    dark: 'bg-stone-900 hover:bg-stone-800 text-white'
  };
  const goldStyle = confirmColor === 'gold' ? { backgroundColor: GOLD } : undefined;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 anim-fade no-print" onClick={onCancel}>
      <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {message && <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{message}</p>}
          {inputs.map((i, idx) => (
            <div key={i.name} className="mb-3">
              <label className="block text-[11px] font-semibold mb-1 smallcaps" style={{ color: 'var(--text-secondary)' }}>{i.label}</label>
              <input
                type={i.type || 'text'}
                value={values[i.name] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [i.name]: e.target.value }))}
                placeholder={i.placeholder || ''}
                autoFocus={idx === 0}
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
              {i.hint && <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{i.hint}</div>}
            </div>
          ))}
        </div>
        <div className="px-5 py-3 flex justify-end gap-2"
          style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md transition hover:bg-stone-200/40"
            style={{ color: 'var(--text-secondary)' }}>{cancelLabel}</button>
          <button onClick={() => onConfirm(values)} style={goldStyle}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${colorMap[confirmColor] || colorMap.red}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

/* Loading skeleton — gray-shimmer rows */
const Skeleton = ({ rows = 4, className = '' }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-stone-200/70 rounded-md" />
    ))}
  </div>
);

/* Paginator — per-page selector + prev/next + count label. Pass pageSize=Infinity for "All". */
const Paginator = ({ total, page, pageSize, onPage, onPageSize, label = 'item' }) => {
  const isAll = pageSize === Infinity || pageSize === 'all';
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const start = isAll ? (total === 0 ? 0 : 1) : (total === 0 ? 0 : Math.min(total, (page - 1) * pageSize + 1));
  const end = isAll ? total : Math.min(total, page * pageSize);
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 text-xs flex-wrap"
      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
      <div className="flex items-center gap-1 tabular">
        Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{start}–{end}</span>
        of <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{total}</span> {label}{total === 1 ? '' : 's'}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          Per page:
          <select value={isAll ? 'all' : pageSize}
            onChange={(e) => { const v = e.target.value; onPageSize(v === 'all' ? Infinity : Number(v)); onPage(1); }}
            className="px-1.5 py-1 rounded text-xs"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
            <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="all">All</option>
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1 || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition">Prev</button>
          <span className="tabular px-2 text-stone-700">{isAll ? 1 : page}/{totalPages}</span>
          <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition">Next</button>
        </div>
      </div>
    </div>
  );
};

/* Help slide-out — contact info + 5 FAQ accordions */
const HELP_FAQ = [
  { q: 'How to add a vehicle', a: 'Click "Add Vehicle" in the sidebar (or the + button). Enter a VIN to auto-decode 9 fields, or fill the form manually. Photos and pricing can be edited any time after.' },
  { q: 'How to respond to leads', a: 'Open the Leads tab, expand a lead row to see their timeline, then use Quick Actions to call, text, or email. The lead status auto-advances when you change it.' },
  { q: 'How to run a sale', a: 'Select vehicles in Inventory (table or grid view), click "Sale" in the bulk action bar, and apply a percentage or dollar discount. Apply to one vehicle via the kebab menu (⋯).' },
  { q: 'How to export to Facebook', a: 'In Inventory, select vehicles and choose "Export FB" from the bulk bar — this generates a Facebook Marketplace catalog CSV that uploads directly to Commerce Manager.' },
  { q: 'How to request Google reviews', a: 'On the Sold tab, click the gold star icon next to a customer to send a review request. Email or SMS templates are pre-set in Settings → Marketing.' }
];

const HelpPanel = ({ onClose }) => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 anim-fade no-print" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 shadow-2xl anim-slide overflow-y-auto no-print"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <div className="px-5 py-4 flex items-center justify-between sticky top-0"
          style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-stone-600" />
            <h2 className="font-display text-xl font-semibold">Need Help?</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-stone-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="space-y-2 text-sm">
            <a href="mailto:david@aiandwebservices.com" className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-stone-100 transition" style={{ color: 'var(--text-secondary)' }}>
              <Mail className="w-4 h-4" /><span>david@aiandwebservices.com</span>
            </a>
            <a href="tel:3155720710" className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-stone-100 transition" style={{ color: 'var(--text-secondary)' }}>
              <Phone className="w-4 h-4" /><span>Call/Text: 315-572-0710</span>
            </a>
          </div>
          <div>
            <div className="text-[11px] font-semibold smallcaps mb-2" style={{ color: 'var(--text-muted)' }}>Quick Tips</div>
            <div className="space-y-1.5">
              {HELP_FAQ.map((item, i) => (
                <div key={i} className="rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-stone-50 transition">
                    <span className="text-sm font-medium">{item.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openIdx === i && (
                    <div className="px-3 py-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 text-center text-[11px] sticky bottom-0"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
          Powered by <span className="font-semibold" style={{ color: GOLD }}>AIand</span><span className="font-semibold">WEB</span>services
        </div>
      </aside>
    </>
  );
};

/* Global search palette (Cmd+K) — searches vehicles, leads, deals, appointments */
const SearchPalette = ({ onClose, inventory, leads, deals, appointments, onJump }) => {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    storage.get('primo-recent-searches', []).then(r => setRecent(Array.isArray(r) ? r : []));
  }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      vehicles: inventory.filter(v => [v.year, v.make, v.model, v.trim, v.vin, v.stockNumber].join(' ').toLowerCase().includes(q)).slice(0, 5),
      leads:    leads.filter(l => [l.name, l.email, l.phone].join(' ').toLowerCase().includes(q)).slice(0, 5),
      deals:    deals.filter(d => (d.customerName || '').toLowerCase().includes(q)).slice(0, 5),
      appts:    appointments.filter(a => (a.customerName || '').toLowerCase().includes(q)).slice(0, 5)
    };
  }, [query, inventory, leads, deals, appointments]);

  const recordSearch = (q) => {
    if (!q || !q.trim()) return;
    const next = [q, ...recent.filter(r => r !== q)].slice(0, 5);
    setRecent(next);
    storage.set('primo-recent-searches', next);
  };

  const Section = ({ icon: Icon, label, items, render }) => items && items.length > 0 ? (
    <div className="py-1">
      <div className="px-4 py-1.5 text-[10px] font-semibold smallcaps flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
        <Icon className="w-3 h-3" /> {label}
      </div>
      {items.map(render)}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 px-4 anim-fade no-print" onClick={onClose}>
      <div className="rounded-lg shadow-2xl max-w-xl w-full max-h-[70vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles, leads, deals, appointments…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Esc</kbd>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!query.trim() && recent.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>Recent</div>
              {recent.map(r => (
                <button key={r} onClick={() => setQuery(r)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 transition">{r}</button>
              ))}
            </div>
          )}
          {!query.trim() && recent.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Start typing to search across the admin
            </div>
          )}
          {results && (
            <>
              <Section icon={Car} label="Vehicles" items={results.vehicles} render={v => (
                <button key={'v' + v.id} onClick={() => { recordSearch(query); onJump('inventory'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{v.year} {v.make} {v.model}</div>
                  <div className="text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>· {v.stockNumber}</div>
                </button>
              )} />
              <Section icon={Users} label="Leads" items={results.leads} render={l => (
                <button key={'l' + l.id} onClick={() => { recordSearch(query); onJump('leads'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {l.email}</div>
                </button>
              )} />
              <Section icon={Calculator} label="Deals" items={results.deals} render={d => (
                <button key={'d' + d.id} onClick={() => { recordSearch(query); onJump('deals'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{d.customerName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {d.status}</div>
                </button>
              )} />
              <Section icon={Calendar} label="Appointments" items={results.appts} render={a => (
                <button key={'a' + a.id} onClick={() => { recordSearch(query); onJump('appointments'); }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-100 transition flex items-center gap-3">
                  <div className="text-sm font-medium">{a.customerName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>· {a.serviceType}</div>
                </button>
              )} />
              {results.vehicles.length + results.leads.length + results.deals.length + results.appts.length === 0 && (
                <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No results for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ROOT COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'inventory',    label: 'Inventory',      icon: Car },
  { id: 'addVehicle',   label: 'Add Vehicle',    icon: Plus },
  { id: 'leads',        label: 'Leads',          icon: Users },
  { id: 'customers',    label: 'Customers',      icon: BadgeCheck },
  { id: 'tasks',        label: 'Tasks',          icon: CheckSquare },
  { id: 'deals',        label: 'Deal Builder',   icon: Calculator },
  { id: 'appointments', label: 'Service',        icon: Wrench },
  { id: 'sold',         label: 'Sold Vehicles',  icon: Archive },
  { id: 'marketing',    label: 'Marketing',      icon: Megaphone },
  { id: 'reporting',    label: 'Reporting',      icon: BarChart3 },
  { id: 'performance',  label: 'Performance',    icon: Activity },
  { id: 'settings',     label: 'Settings',       icon: SettingsIcon }
];

export default function PrimoAdmin() {
  /* ---------- state ---------- */
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState('light');
  const [loaded, setLoaded] = useState(false);

  const [inventory, setInventory] = useState(SEED_INVENTORY);
  const [leads, setLeads] = useState(SEED_LEADS);
  const [deals, setDeals] = useState(SEED_DEALS);
  const [sold, setSold] = useState(SEED_SOLD);
  const [settings, setSettings] = useState(SEED_SETTINGS);
  const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);
  const [reservations, setReservations] = useState(SEED_RESERVATIONS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [activity, setActivity] = useState(SEED_ACTIVITY);
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [pwaDismissed, setPwaDismissed] = useState(false);

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [toast, setToast] = useState(null);

  /* ---------- load on mount ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [inv, lds, dls, sld, st, apts, rsvs, rvws, act, tks, msgs] = await Promise.all([
        storage.get('primo-inventory', null),
        storage.get('primo-leads', null),
        storage.get('primo-deals', null),
        storage.get('primo-sold', null),
        storage.get('primo-settings', null),
        storage.get('primo-appointments', null),
        storage.get('primo-reservations', null),
        storage.get('primo-reviews', null),
        storage.get('primo-activity', null),
        storage.get('primo-tasks', null),
        storage.get('primo-messages', null)
      ]);
      if (!mounted) return;
      if (inv) setInventory(inv); else await storage.set('primo-inventory', SEED_INVENTORY);
      if (lds) setLeads(lds); else await storage.set('primo-leads', SEED_LEADS);
      if (dls) setDeals(dls); else await storage.set('primo-deals', SEED_DEALS);
      if (sld) setSold(sld); else await storage.set('primo-sold', SEED_SOLD);
      if (st) { setSettings(st); if (st.adminTheme === 'dark' || st.adminTheme === 'light') setAdminTheme(st.adminTheme); }
      else await storage.set('primo-settings', SEED_SETTINGS);
      if (apts) setAppointments(apts); else await storage.set('primo-appointments', SEED_APPOINTMENTS);
      if (rsvs) setReservations(rsvs); else await storage.set('primo-reservations', SEED_RESERVATIONS);
      if (rvws) setReviews(rvws); else await storage.set('primo-reviews', SEED_REVIEWS);
      if (act) setActivity(act); else await storage.set('primo-activity', SEED_ACTIVITY);
      if (tks) setTasks(tks); else await storage.set('primo-tasks', SEED_TASKS);
      if (msgs) setMessages(msgs); else await storage.set('primo-messages', SEED_MESSAGES);
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
  useEffect(() => { if (loaded) storage.set('primo-activity', activity); }, [activity, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-tasks', tasks); }, [tasks, loaded]);
  useEffect(() => { if (loaded) storage.set('primo-messages', messages); }, [messages, loaded]);

  // Append a single activity entry, capped at 200 most recent
  const addActivity = useCallback((entry) => {
    setActivity(arr => [{
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      when: new Date().toISOString(),
      ...entry
    }, ...arr].slice(0, 200));
  }, []);

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

  /* ---------- toast ----------
     flash(msg)                       — default 2.4s
     flash(msg, 'error')              — error tone, 2.4s (back-compat)
     flash(msg, { tone, duration, undo }) — full control; destructive tone defaults to 5s
  */
  const flash = useCallback((msg, opts = {}) => {
    const cfg = typeof opts === 'string' ? { tone: opts } : opts;
    const { tone = 'default', duration, undo } = cfg;
    const ms = duration ?? (tone === 'destructive' ? 5000 : 2400);
    const id = Date.now() + Math.random();
    setToast({ msg, tone, undo, id });
    setTimeout(() => setToast(t => (t?.id === id ? null : t)), ms);
  }, []);

  // Surface storage failures via toast
  useEffect(() => {
    setStorageErrorHandler((err, key) => {
      flash(`Failed to save (${key}) — changes may not persist`, { tone: 'error', duration: 5000 });
    });
    return () => setStorageErrorHandler(null);
  }, [flash]);

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
    addActivity({
      type: 'sold',
      title: `${v.year} ${v.make} ${v.model} marked Sold to ${sale.buyerName}`,
      sub: `Sale price: $${(sale.salePrice || 0).toLocaleString()}`,
      refTab: 'sold'
    });
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
      history: { noAccidents: true, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false, noOpenRecalls: true },
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
  const taskStats = useMemo(() => {
    const now = new Date(TODAY);
    const today0 = new Date(now); today0.setUTCHours(0, 0, 0, 0);
    const today1 = new Date(today0); today1.setUTCDate(today1.getUTCDate() + 1);
    const open = tasks.filter(t => t.status !== 'Completed');
    const overdue = open.filter(t => new Date(t.dueAt) < today0);
    const dueToday = open.filter(t => { const d = new Date(t.dueAt); return d >= today0 && d < today1; });
    return { overdue: overdue.length, dueToday: dueToday.length, open: open.length };
  }, [tasks]);

  /* ---------- reservation helpers ---------- */
  const releaseReservation = (id) => {
    const released = reservations.find(r => r.id === id);
    setReservations(arr => arr.filter(r => r.id !== id));
    flash('Reservation released', {
      tone: 'destructive',
      undo: () => released && setReservations(arr => [released, ...arr])
    });
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
    tasks: taskStats.overdue,
    appointments: pendingAppts
  };

  // Cmd/Ctrl+K opens the global search palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- theme ---------- */
  const toggleTheme = useCallback(() => {
    setAdminTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      setSettings(s => ({ ...s, adminTheme: next }));
      return next;
    });
  }, []);

  /* ---------- render ---------- */
  return (
    <div className="font-ui min-h-screen transition-colors duration-200"
      style={{ ...THEMES[adminTheme], backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <FontStyles />

      {/* PWA install prompt — mobile only, dismissible */}
      {!pwaDismissed && (
        <div className="md:hidden no-print" style={{ background: `linear-gradient(to right, ${GOLD}22, ${GOLD}11)`, borderBottom: `1px solid ${GOLD}55` }}>
          <div className="px-4 py-2.5 flex items-center gap-3">
            <Smartphone className="w-5 h-5 shrink-0" style={{ color: '#7A5A0F' }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold leading-tight">Install Primo Dashboard</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Add to home screen — works offline, manage your lot from anywhere</div>
            </div>
            <button onClick={() => { flash('Add to Home Screen — use your browser menu'); setPwaDismissed(true); }}
              className="text-[11px] font-bold px-3 py-1.5 rounded shrink-0"
              style={{ backgroundColor: GOLD, color: '#1A1612' }}>Install</button>
            <button onClick={() => setPwaDismissed(true)} aria-label="Dismiss"
              className="p-1 text-stone-500 hover:text-stone-900 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 no-print">
        <div className="flex items-center h-14 px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)}
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

          <button onClick={() => setSearchOpen(true)}
            title="Search (⌘K)"
            className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-stone-200 hover:bg-stone-100 text-xs text-stone-500 transition">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-flex items-center px-1 py-0.5 ml-1 rounded text-[9px] font-mono bg-stone-100 text-stone-500 border border-stone-200">⌘K</kbd>
          </button>

          <button onClick={toggleTheme}
            title={adminTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="p-2 rounded hover:bg-stone-100 transition">
            {adminTheme === 'light'
              ? <Moon className="w-4 h-4 text-stone-700" strokeWidth={2} />
              : <Sun className="w-4 h-4 text-amber-400" strokeWidth={2} />}
          </button>

          <button onClick={() => setHelpOpen(true)}
            title="Help"
            className="p-2 rounded hover:bg-stone-100 transition">
            <HelpCircle className="w-4 h-4 text-stone-700" strokeWidth={2} />
          </button>

          <div className="relative">
            <button className="relative p-2 rounded hover:bg-stone-100" onClick={() => setNotifOpen(o => !o)}
              title="Notifications">
              <Bell className="w-4 h-4 text-stone-700" strokeWidth={2} />
              {(unreadLeads + reservationCount) > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center pulse-dot"
                  style={{ backgroundColor: RED_ACCENT }}>{unreadLeads + reservationCount}</span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-80 max-h-80 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-xl z-40 anim-fade">
                  <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">Notifications</span>
                    {unreadLeads > 0 && (
                      <button onClick={() => { setLeads(arr => arr.map(l => ({ ...l, read: true }))); flash(`Marked ${unreadLeads} as read`); }}
                        className="text-[11px] text-blue-600 hover:underline font-semibold">Mark all read</button>
                    )}
                  </div>
                  {(() => {
                    const items = [
                      ...leads.filter(l => !l.read).map(l => ({
                        type: 'lead', id: l.id,
                        when: l.createdAt,
                        title: l.name,
                        sub: l.source + ' · ' + l.vehicleLabel,
                        icon: Users,
                        accent: RED_ACCENT,
                        onClick: () => { setActiveTab('leads'); setNotifOpen(false); }
                      })),
                      ...reservations.map(r => ({
                        type: 'reservation', id: r.id,
                        when: r.reservedAt,
                        title: r.customerName,
                        sub: 'Reserved · expires soon',
                        icon: Clock,
                        accent: GOLD,
                        onClick: () => { setActiveTab('dashboard'); setNotifOpen(false); }
                      })),
                      ...appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').slice(0, 3).map(a => ({
                        type: 'appointment', id: a.id,
                        when: a.when,
                        title: a.customerName,
                        sub: a.serviceType + ' · ' + new Date(a.when).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' }),
                        icon: Calendar,
                        accent: '#0284C7',
                        onClick: () => { setActiveTab('appointments'); setNotifOpen(false); }
                      }))
                    ].sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 5);

                    if (items.length === 0) return (
                      <div className="px-4 py-10 text-center text-sm text-stone-500">
                        <Bell className="w-6 h-6 mx-auto mb-2 text-stone-300" />
                        You're all caught up
                      </div>
                    );

                    const fmtAgo = (iso) => {
                      const ms = Date.now() - new Date(iso).getTime();
                      if (ms < 0) return new Date(iso).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
                      const m = Math.floor(ms / 60000);
                      if (m < 1) return 'just now';
                      if (m < 60) return m + 'm ago';
                      const h = Math.floor(m / 60);
                      if (h < 24) return h + 'h ago';
                      return Math.floor(h / 24) + 'd ago';
                    };

                    return (
                      <div className="divide-y divide-stone-100">
                        {items.map(it => {
                          const Icon = it.icon;
                          return (
                            <button key={it.type + ':' + it.id} onClick={it.onClick}
                              className="w-full text-left px-4 py-3 hover:bg-stone-50 transition flex gap-3 items-start">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: it.accent + '22' }}>
                                <Icon className="w-3.5 h-3.5" style={{ color: it.accent }} strokeWidth={2} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-stone-900 truncate">{it.title}</div>
                                <div className="text-[11px] text-stone-500 truncate">{it.sub}</div>
                                <div className="text-[10px] text-stone-400 mt-0.5">{fmtAgo(it.when)}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>

          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-semibold text-stone-700">
            {(settings.dealerName || 'M E').split(' ').map(p => p[0]).slice(0, 2).join('')}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        {/* Sidebar */}
        <aside className={`bg-white border-r border-stone-200 transition-all duration-200 no-print
          fixed inset-y-0 left-0 z-50 h-screen transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:top-14 lg:self-start lg:h-[calc(100vh-3.5rem)] lg:z-20 lg:translate-x-0
          ${sidebarCollapsed ? 'w-14' : 'w-48'}`}>
          <nav className="py-3 px-2 flex flex-col gap-1.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const badgeCount = navBadges[item.id] || 0;
              const showBadge = badgeCount > 0;
              const badgeColor = item.id === 'appointments' ? '#C8970F' : RED_ACCENT;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`group flex items-center gap-3 px-2.5 py-2.5 rounded-md text-sm transition relative ${isActive ? 'bg-stone-900 text-white hover:bg-stone-800' : 'text-stone-700 hover:bg-stone-100'}`}>
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
              className="w-full hidden lg:flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition">
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
            <button onClick={() => setSidebarOpen(false)}
              className="w-full lg:hidden flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {!loaded ? (
            <div className="p-6 lg:p-8">
              <Skeleton rows={6} />
            </div>
          ) : (
            <div key={activeTab} className="anim-fade">
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
                activity={activity}
                onJump={(tab) => setActiveTab(tab)}
                taskStats={taskStats}
              />}
              {activeTab === 'inventory' && <InventoryTab
                inventory={inventory} setInventory={setInventory} updateVehicle={updateVehicle}
                removeVehicle={removeVehicle} markSold={markSoldVehicle}
                reservations={reservations} onReleaseReservation={releaseReservation}
                onEdit={(id) => { setEditingVehicleId(id); setActiveTab('addVehicle'); }}
                onAdd={() => { setEditingVehicleId(null); setActiveTab('addVehicle'); }}
                flash={flash}
                settings={settings} setSettings={setSettings}
              />}
              {activeTab === 'addVehicle' && <VehicleFormTab
                vehicle={editingVehicleId ? inventory.find(v => v.id === editingVehicleId) : null}
                flash={flash}
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
                messages={messages} setMessages={setMessages}
                onCreateTask={(lead) => {
                  const tomorrow = isoAt(1, 10);
                  setTasks(arr => [{
                    id: 'tk-' + Date.now(),
                    title: `Follow up with ${lead.name}`,
                    dueAt: tomorrow,
                    assignedTo: TEAM_MEMBERS[0].name,
                    relatedTo: lead.name,
                    priority: 'Medium', status: 'Open',
                    notes: `Lead from ${lead.source} on ${lead.vehicleLabel}`
                  }, ...arr]);
                  flash('Follow-up task created for tomorrow');
                }}
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
              {activeTab === 'tasks' && <TasksTab
                tasks={tasks} setTasks={setTasks} leads={leads} sold={sold} flash={flash}
              />}
              {activeTab === 'customers' && <CustomersTab
                leads={leads} sold={sold} appointments={appointments} deals={deals} flash={flash}
              />}
              {activeTab === 'reporting' && <ReportingTab
                inventory={inventory} sold={sold} leads={leads}
              />}
              {activeTab === 'settings' && <SettingsTab
                settings={settings} setSettings={setSettings} flash={flash}
              />}
            </div>
          )}
        </main>
      </div>

      {/* Help slide-out panel */}
      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}

      {/* Global search palette */}
      {searchOpen && <SearchPalette
        onClose={() => setSearchOpen(false)}
        inventory={inventory} leads={leads} deals={deals} appointments={appointments}
        onJump={(tab) => { setActiveTab(tab); setSearchOpen(false); }}
      />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 anim-slide no-print">
          <div className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-3 text-sm text-white ${
            toast.tone === 'error' ? 'bg-red-700' : toast.tone === 'destructive' ? 'bg-stone-800' : 'bg-stone-900'
          }`}>
            <div className="w-1.5 h-1.5 rounded-full" style={{
              backgroundColor: toast.tone === 'error' ? '#FBBF24' : toast.tone === 'destructive' ? '#F87171' : GOLD
            }} />
            <span>{toast.msg}</span>
            {toast.undo && (
              <button onClick={() => { toast.undo(); setToast(null); }}
                className="ml-2 px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-amber-200 font-bold text-xs uppercase tracking-wider transition">
                Undo
              </button>
            )}
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
  onAdd, onEdit, soldThisMonth, featuredCount, onSaleCount, unreadLeads, flash, onOpenLeads,
  activity = [], onJump, taskStats = { overdue: 0, dueToday: 0, open: 0 } }) {
  const [activityExpanded, setActivityExpanded] = useState(false);

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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Hero */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[10px] font-semibold smallcaps text-stone-500 mb-1.5">
            {new Date(TODAY).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 leading-tight">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 mb-6">
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

      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <button onClick={() => onJump && onJump('tasks')}
          className={`text-left rounded-lg p-4 relative transition lg:col-span-2 ${taskStats.overdue > 0 ? 'border-2' : 'border'}`}
          style={{ backgroundColor: taskStats.overdue > 0 ? '#FEF2F2' : 'var(--bg-card)', borderColor: taskStats.overdue > 0 ? '#DC2626' : 'var(--border)' }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-semibold smallcaps" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-muted)' }}>
              {taskStats.overdue > 0 ? '⚠ Overdue Tasks' : 'Overdue Tasks'}
            </span>
            <AlertCircle className="w-4 h-4" style={{ color: taskStats.overdue > 0 ? '#DC2626' : '#a8a39a' }} strokeWidth={1.75} />
          </div>
          <div className="font-display text-3xl font-medium tracking-tight tabular leading-none" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-primary)' }}>
            {taskStats.overdue}
          </div>
          <div className="text-[11px] mt-2" style={{ color: taskStats.overdue > 0 ? '#991B1B' : 'var(--text-muted)' }}>
            {taskStats.overdue > 0 ? 'Action needed — review now' : 'You\'re all caught up'}
          </div>
        </button>
        <button onClick={() => onJump && onJump('tasks')}
          className="text-left rounded-lg p-4 relative border transition lg:col-span-2 hover:bg-stone-50"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>Tasks Due Today</span>
            <CheckSquare className="w-4 h-4" style={{ color: taskStats.dueToday > 0 ? GOLD : '#a8a39a' }} strokeWidth={1.75} />
          </div>
          <div className="font-display text-3xl font-medium tracking-tight tabular leading-none">{taskStats.dueToday}</div>
          <div className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{taskStats.open} open total</div>
        </button>
        <StatCard label="Website Views" value={websiteViews.toLocaleString()} icon={Eye} sub="last 30 days" />
        <StatCard label="Avg Days to Sell" value="22 days" icon={Clock} sub="industry avg: 38" />
      </div>
      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
        <StatCard label="Lead → Sale Rate" value="14.2%" icon={TrendingUp} accent="#2F7A4A" sub="↑ 2.4% MoM" />
        <StatCard label="Avg Gross Profit" value="$4,475" icon={DollarSign} accent={GOLD} />
      </div>

      {/* MARKET PRICING INTELLIGENCE */}
      <Card className="overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"
          style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.06), transparent)' }}>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-stone-700" />
            <h3 className="font-display text-lg font-semibold tracking-tight">Market Pricing Intelligence</h3>
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
                <th className="px-5 py-3 text-left">Vehicle</th>
                <th className="px-3 py-3 text-right">Your Price</th>
                <th className="px-3 py-3 text-right">Market Avg</th>
                <th className="px-3 py-3 text-right">Variance</th>
                <th className="px-5 py-3 text-left">Recommendation</th>
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
                    <td className="px-5 py-3">
                      <button onClick={() => onEdit(v.id)} className="font-medium text-sm hover:underline text-left">
                        {v.year} {v.make} {v.model}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-right tabular font-semibold">{fmtMoney(yours)}</td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{fmtMoney(mkt)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular"
                        style={above ? { backgroundColor: '#FBE6E6', color: '#A12B2B' } : { backgroundColor: '#E8F2EC', color: '#256B40' }}>
                        {above ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(pct).toFixed(1)}% {above ? 'above' : 'below'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px]">
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
                <h3 className="font-display text-lg font-semibold tracking-tight">Aging Inventory Alerts</h3>
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
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-stone-600" strokeWidth={2} />
                <h3 className="font-display text-lg font-semibold tracking-tight">Price Autopilot Rules</h3>
              </div>
              <span className="text-[10px] smallcaps font-semibold text-stone-500">AI-POWERED</span>
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
                <h3 className="font-display text-lg font-semibold tracking-tight">Most Viewed Vehicles</h3>
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
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Timer className="w-4 h-4 text-stone-600" />
                  <h3 className="font-display text-lg font-semibold tracking-tight">Active Reservations</h3>
                </div>
                <span className="text-[10px] smallcaps font-semibold text-stone-500">48-HR HOLDS</span>
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
                <h3 className="font-display text-lg font-semibold tracking-tight">Recent Leads</h3>
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
                    <LeadSourceBadge source={l.source} />
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

      {/* Recent Activity Feed */}
      <Card className="mt-6 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-stone-600" strokeWidth={2} />
            <h3 className="font-display text-lg font-semibold tracking-tight">Recent Activity</h3>
          </div>
          {activity.length > 8 && (
            <button onClick={() => setActivityExpanded(e => !e)}
              className="text-[11px] font-semibold text-blue-600 hover:underline">
              {activityExpanded ? 'Show less' : `View all (${activity.length})`}
            </button>
          )}
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {(activityExpanded ? activity : activity.slice(0, 8)).map(a => {
            const accent = {
              'lead-new':     { color: '#BE123C', icon: Users },
              'lead-status':  { color: '#0369A1', icon: Users },
              'sold':         { color: '#059669', icon: Award },
              'price-drop':   { color: '#EA580C', icon: TrendingDown },
              'reservation':  { color: GOLD,     icon: Clock },
              'feature':      { color: GOLD,     icon: Star },
              'appointment':  { color: '#0284C7', icon: Calendar },
              'review':       { color: '#9333EA', icon: Star },
              'restore':      { color: '#0891B2', icon: RefreshCw }
            }[a.type] || { color: '#78716C', icon: Activity };
            const Icon = accent.icon;
            const fmtAgo = (iso) => {
              const ms = Date.now() - new Date(iso).getTime();
              const m = Math.floor(ms / 60000);
              if (m < 1) return 'just now';
              if (m < 60) return m + 'm ago';
              const h = Math.floor(m / 60);
              if (h < 24) return h + 'h ago';
              const d = Math.floor(h / 24);
              if (d < 7) return d + 'd ago';
              return new Date(iso).toLocaleDateString();
            };
            return (
              <button key={a.id}
                onClick={() => a.refTab && onJump && onJump(a.refTab)}
                className="w-full text-left px-5 py-3 themed-row transition flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent.color + '22' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: accent.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                  {a.sub && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{a.sub}</div>}
                </div>
                <div className="text-[10px] shrink-0 tabular" style={{ color: 'var(--text-muted)' }}>{fmtAgo(a.when)}</div>
              </button>
            );
          })}
          {activity.length === 0 && (
            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No activity yet — actions will appear here as they happen.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ====================== INVENTORY TAB ============================ */

function InventoryTab({ inventory, setInventory, updateVehicle, removeVehicle, markSold, onEdit, onAdd, flash, reservations = [], onReleaseReservation, settings, setSettings }) {
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
  const [openKebab, setOpenKebab] = useState(null);  // vehicle id with open kebab
  const [sellRequest, setSellRequest] = useState(null); // vehicle awaiting Mark Sold confirm
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [savedOpen, setSavedOpen] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const savedViews = settings?.savedViews?.inventory || [];

  const applyView = (v) => {
    setSearch(v.filter.search || '');
    setSortKey(v.filter.sort?.split('-')[0] || 'dateAdded');
    setSortDir(v.filter.sort?.split('-')[1] || 'desc');
    setFilterStatus(v.filter.status || 'all');
    setSavedOpen(false);
    flash(`Loaded view: ${v.name}`);
  };
  const saveCurrentView = (name) => {
    if (!name || !name.trim()) return;
    const view = {
      id: 'sv-i-' + Date.now(),
      name: name.trim(),
      filter: { search, status: filterStatus, sort: sortKey + '-' + sortDir }
    };
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), inventory: [...(s.savedViews?.inventory || []), view] } }));
    flash(`Saved view: ${view.name}`);
  };
  const deleteView = (id) => {
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), inventory: (s.savedViews?.inventory || []).filter(v => v.id !== id) } }));
  };

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

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [search, sortKey, sortDir, filterStatus, filterMake, filterBody, priceRange]);

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
      const removed = inventory.filter(item => ids.includes(item.id));
      setInventory(arr => arr.filter(item => !ids.includes(item.id)));
      flash(`${ids.length} vehicle${ids.length === 1 ? '' : 's'} deleted`, {
        tone: 'destructive',
        undo: () => setInventory(arr => [...removed, ...arr])
      });
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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900">Inventory</h1>
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
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, VIN, stock #…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="relative">
            <button onClick={() => setSavedOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md hover:bg-stone-100 transition"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' }}>
              <Bookmark className="w-3.5 h-3.5" /> Views
              <ChevronDown className="w-3 h-3" />
            </button>
            {savedOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSavedOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg z-40 py-1 anim-fade"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {savedViews.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-center" style={{ color: 'var(--text-muted)' }}>No saved views yet</div>
                  ) : savedViews.map(v => (
                    <div key={v.id} className="flex items-center group">
                      <button onClick={() => applyView(v)}
                        className="flex-1 px-3 py-2 text-left text-xs hover:bg-stone-50 truncate">{v.name}</button>
                      <button onClick={() => deleteView(v.id)} title="Delete view"
                        className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                  <button onClick={() => { setSavedOpen(false); setShowSaveView(true); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50"
                    style={{ color: 'var(--text-primary)' }}>
                    <Plus className="w-3 h-3" /> Save current view…
                  </button>
                </div>
              </>
            )}
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
        <>
          {/* Desktop bulk bar */}
          <div className="mb-4 anim-slide bg-stone-900 text-white rounded-lg p-3 hidden md:flex items-center gap-3 flex-wrap">
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
          {/* Mobile bulk dropdown */}
          <details className="mb-4 anim-slide bg-stone-900 text-white rounded-lg md:hidden">
            <summary className="cursor-pointer p-3 flex items-center justify-between text-sm font-semibold list-none">
              <span>{selected.size} selected · Actions</span>
              <ChevronDown className="w-4 h-4" />
            </summary>
            <div className="px-3 pb-3 flex flex-col gap-1 border-t border-stone-700">
              <button onClick={() => setBulkAction('sale')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left"
                style={{ color: GOLD }}>
                <Tag className="w-3 h-3" /> Mark On Sale
              </button>
              <button onClick={() => { setBulkAction('removeSale'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 text-left">
                Remove Sale
              </button>
              <button onClick={() => setBulkAction('sold')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Award className="w-3 h-3" /> Mark as Sold
              </button>
              <button onClick={() => { setBulkAction('feature'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Star className="w-3 h-3" /> Feature
              </button>
              <button onClick={() => { setBulkAction('csv'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button onClick={() => { setBulkAction('fb'); setTimeout(applyBulk, 0); }}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-stone-800 inline-flex items-center gap-1.5 text-left">
                <Share2 className="w-3 h-3" /> Export to FB
              </button>
              <button onClick={() => setBulkAction('delete')}
                className="px-3 py-2 rounded text-xs font-semibold hover:bg-red-900/30 text-red-300 inline-flex items-center gap-1.5 text-left">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              <button onClick={() => setSelected(new Set())}
                className="px-3 py-2 rounded text-xs hover:bg-stone-800 text-stone-400 text-left">
                Clear Selection
              </button>
            </div>
          </details>
        </>
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
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                    </button>
                  </th>
                  <th className="px-3 py-3 w-20 text-left">Photo</th>
                  <th className="px-3 py-3 w-14 text-left">Year</th>
                  <th className="px-3 py-3 text-left">Make / Model</th>
                  <th className="px-3 py-3 text-left">Trim</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Mileage</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-right">Days</th>
                  <th className="px-3 py-3 text-right">Views</th>
                  <th className="px-4 py-3 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-16 px-4">
                    <Car className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                    <div className="font-display text-lg font-semibold text-stone-900 mb-1">No vehicles match</div>
                    <div className="text-sm text-stone-500 mb-4 max-w-xs mx-auto">Try adjusting your filters, or add your first vehicle to get started.</div>
                    <button onClick={onAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white"
                      style={{ backgroundColor: GOLD, color: '#1A1714' }}>
                      <Plus className="w-3.5 h-3.5" /> Add Vehicle
                    </button>
                  </td></tr>
                ) : paged.map(v => (
                  <tr key={v.id} className={`group hover:bg-stone-50 transition ${selected.has(v.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleOne(v.id)} className="flex items-center justify-center">
                        {selected.has(v.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />}
                      </button>
                    </td>
                    <td className="px-3 py-3"><VehiclePhoto vehicle={v} size="sm" /></td>
                    <td className="px-3 py-3 font-medium tabular">{v.year}</td>
                    <td className="px-3 py-3">
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
                    <td className="px-3 py-3 text-stone-600">{v.trim}</td>
                    <td className="px-3 py-3 text-right tabular">
                      {v.salePrice ? (
                        <>
                          <div className="font-semibold" style={{ color: RED_ACCENT }}>{fmtMoney(v.salePrice)}</div>
                          <div className="text-[11px] text-stone-400 line-through">{fmtMoney(v.listPrice)}</div>
                        </>
                      ) : (
                        <div className="font-semibold">{fmtMoney(v.listPrice)}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular text-stone-600">{Number(v.mileage).toLocaleString()}</td>
                    <td className="px-3 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-3 text-right tabular">
                      <span className={`font-semibold ${v.daysOnLot >= 60 ? 'text-red-700' : v.daysOnLot >= 45 ? 'text-orange-700' : v.daysOnLot >= 30 ? 'text-amber-700' : 'text-stone-600'}`}>
                        {v.daysOnLot}d
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular text-stone-500">{(v.views || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 relative">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(v.id); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setSellRequest(v); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition">
                          <Check className="w-3 h-3" /> Sold
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenKebab(o => o === v.id ? null : v.id); }}
                          title="More actions"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-stone-500 hover:bg-stone-100 transition">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openKebab === v.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpenKebab(null); }} />
                            <div className="absolute right-2 top-full mt-1 w-44 bg-white border border-stone-200 rounded-md shadow-lg z-40 py-1 anim-fade">
                              <button onClick={(e) => { e.stopPropagation(); updateVehicle(v.id, { status: v.status === 'Featured' ? 'Available' : 'Featured' }); flash(v.status === 'Featured' ? 'Unfeatured' : 'Vehicle featured'); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Star className="w-3 h-3" /> {v.status === 'Featured' ? 'Unfeature' : 'Feature'}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); const sale = Math.round(v.listPrice * 0.93 / 5) * 5; updateVehicle(v.id, { salePrice: sale, status: 'On Sale' }); flash(`${v.year} ${v.make} ${v.model} put on sale`); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Tag className="w-3 h-3" /> Put on Sale
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); flash(`Export queued: ${v.year} ${v.make} ${v.model}`); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-stone-50 flex items-center gap-2 text-stone-700">
                                <Share2 className="w-3 h-3" /> Export to Facebook
                              </button>
                              <div className="border-t border-stone-100 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(v.id); setOpenKebab(null); }}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-700 flex items-center gap-2 font-semibold">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="vehicle" />
        </Card>
      ) : (
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {paged.map(v => (
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
                  {selected.has(v.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-500" />}
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
        <Card className="mt-4">
          <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="vehicle" />
        </Card>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete vehicle?"
        message="This permanently removes the vehicle from inventory. This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="red"
        onConfirm={() => {
          const id = confirmDelete;
          const v = inventory.find(x => x.id === id);
          removeVehicle(id);
          setConfirmDelete(null);
          flash(`${v ? `${v.year} ${v.make} ${v.model}` : 'Vehicle'} deleted`,
            { tone: 'destructive', undo: () => v && setInventory(arr => [v, ...arr]) });
        }}
        onCancel={() => setConfirmDelete(null)} />

      <ConfirmDialog
        isOpen={showSaveView}
        title="Save current view"
        message="Give this filter combination a name to load it later."
        confirmLabel="Save view"
        confirmColor="dark"
        inputs={[{ name: 'name', label: 'View name', placeholder: 'e.g., New listings under $30k' }]}
        onConfirm={(vals) => { saveCurrentView(vals.name); setShowSaveView(false); }}
        onCancel={() => setShowSaveView(false)} />

      <ConfirmDialog
        isOpen={!!sellRequest}
        title={sellRequest ? `Mark ${sellRequest.year} ${sellRequest.make} ${sellRequest.model} as sold?` : ''}
        message={sellRequest ? `Stock #${sellRequest.stockNumber || sellRequest.id}. This moves the vehicle from inventory to Sold.` : ''}
        confirmLabel="Mark Sold"
        confirmColor="dark"
        inputs={sellRequest ? [
          { name: 'buyer', label: 'Buyer Name', placeholder: 'e.g., Walk-in Buyer' },
          { name: 'finalPrice', label: 'Final Sale Price ($)', type: 'number',
            defaultValue: String(sellRequest.salePrice ?? sellRequest.listPrice),
            hint: `List: $${(sellRequest.listPrice||0).toLocaleString()}${sellRequest.salePrice ? ` · Sale: $${sellRequest.salePrice.toLocaleString()}` : ''}` }
        ] : []}
        onConfirm={(vals) => {
          const buyer = (vals.buyer || '').trim() || 'Walk-in Buyer';
          const final = parseFloat(vals.finalPrice) || (sellRequest.salePrice ?? sellRequest.listPrice);
          markSold(sellRequest.id, buyer, final);
          setSellRequest(null);
        }}
        onCancel={() => setSellRequest(null)} />
    </div>
  );
}

/* ====================== VEHICLE FORM TAB ========================= */

function SearchableSelect({ value, onChange, items, popular = [], loading, placeholder, error, disabled, allLabel = 'All' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const filteredAll = q ? items.filter(i => i.toLowerCase().includes(q)) : items;
  const popularFiltered = q ? popular.filter(i => i.toLowerCase().includes(q)) : popular;
  const showPopular = !q && popular.length > 0;

  return (
    <div ref={ref} className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`w-full pl-3 pr-9 py-2 bg-white border rounded-md text-sm text-left ring-gold transition ${error ? 'border-red-400' : 'border-stone-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className={value ? 'text-stone-900' : 'text-stone-400'}>{value || placeholder || 'Select…'}</span>
        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-stone-200 rounded-md shadow-lg max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-stone-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading…
              </div>
            ) : (
              <>
                {showPopular && popularFiltered.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-[10px] smallcaps font-semibold text-stone-500 bg-stone-50">Popular</div>
                    {popularFiltered.map(item => (
                      <button key={`p-${item}`} type="button"
                        onClick={() => { onChange(item); setOpen(false); setQuery(''); }}
                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-amber-50 ${value === item ? 'font-semibold' : ''}`}>
                        {item}
                      </button>
                    ))}
                    <div className="border-t border-stone-200 my-1" />
                    <div className="px-3 py-1 text-[10px] smallcaps font-semibold text-stone-500 bg-stone-50">{allLabel}</div>
                  </>
                )}
                {filteredAll.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400">No matches</div>
                ) : filteredAll.map(item => (
                  <button key={item} type="button"
                    onClick={() => { onChange(item); setOpen(false); setQuery(''); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-amber-50 ${value === item ? 'font-semibold' : ''}`}>
                    {item}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const BLANK_VEHICLE = {
  year: new Date(TODAY).getFullYear(), make: 'Toyota', model: '', trim: '', bodyStyle: 'Sedan',
  cost: '', listPrice: '', salePrice: '', mileage: '',
  exteriorColor: 'Black', interiorColor: 'Black',
  engine: '', transmission: 'Automatic', drivetrain: 'FWD', fuelType: 'Gas',
  mpgCity: '', mpgHwy: '', vin: '', stockNumber: '',
  status: 'Available',
  history: { noAccidents: false, oneOwner: false, cleanTitle: true, serviceRecords: false, inspection: false, carfax: false, warranty: false, noOpenRecalls: true },
  description: '', photos: [],
  daysOnLot: 0, views: 0, dateAdded: new Date(TODAY).toISOString(),
  hasOpenRecalls: false, espoId: null
};

function VehicleFormTab({ vehicle, onSave, onCancel, flash }) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState(() => vehicle ? { ...BLANK_VEHICLE, ...vehicle } : { ...BLANK_VEHICLE });
  const [photoInput, setPhotoInput] = useState((vehicle?.photos || []).join(', '));
  const [errors, setErrors] = useState({});
  const [autoFilled, setAutoFilled] = useState(new Set());
  const [vinInput, setVinInput] = useState(vehicle?.vin || '');
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinSummary, setVinSummary] = useState(null);
  const [allMakes, setAllMakes] = useState([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [makesError, setMakesError] = useState(false);
  const [modelsForMake, setModelsForMake] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState(false);
  const [mpgLoading, setMpgLoading] = useState(false);
  const [mpgUnavailable, setMpgUnavailable] = useState(false);
  const [recalls, setRecalls] = useState([]);
  const [recallsLoading, setRecallsLoading] = useState(false);
  const [recallsChecked, setRecallsChecked] = useState(false);
  const [savingEspo, setSavingEspo] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setForm({ ...BLANK_VEHICLE, ...vehicle });
      setPhotoInput((vehicle.photos || []).join(', '));
      setVinInput(vehicle.vin || '');
    } else {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
      setVinInput('');
    }
    setAutoFilled(new Set());
    setVinSummary(null);
    setRecalls([]);
    setRecallsChecked(false);
    setMpgUnavailable(false);
  }, [vehicle?.id]);

  // Load all makes once on mount
  useEffect(() => {
    let cancel = false;
    (async () => {
      setMakesLoading(true);
      try {
        const list = await nhtsaGetAllMakes();
        if (!cancel) { setAllMakes(list); setMakesError(false); }
      } catch {
        if (!cancel) setMakesError(true);
      } finally {
        if (!cancel) setMakesLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (!form.make) { setModelsForMake([]); return; }
    let cancel = false;
    (async () => {
      setModelsLoading(true);
      try {
        const list = await nhtsaGetModelsForMake(form.make);
        if (!cancel) { setModelsForMake(list); setModelsError(false); }
      } catch {
        if (!cancel) { setModelsForMake([]); setModelsError(true); }
      } finally {
        if (!cancel) setModelsLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [form.make]);

  // Auto-fetch MPG + recalls when Year + Make + Model are all set
  useEffect(() => {
    if (!form.year || !form.make || !form.model) return;
    let cancel = false;
    (async () => {
      setMpgLoading(true);
      setMpgUnavailable(false);
      try {
        const data = await fuelEconomyLookup(form.year, form.make, form.model);
        if (cancel) return;
        if (data) {
          setForm(f => ({ ...f, mpgCity: data.mpgCity, mpgHwy: data.mpgHwy }));
          setAutoFilled(s => new Set([...s, 'mpgCity', 'mpgHwy']));
        } else {
          setMpgUnavailable(true);
        }
      } catch {
        if (!cancel) setMpgUnavailable(true);
      } finally {
        if (!cancel) setMpgLoading(false);
      }
      setRecallsLoading(true);
      try {
        const list = await nhtsaRecalls(form.year, form.make, form.model);
        if (cancel) return;
        setRecalls(list);
        setRecallsChecked(true);
        setForm(f => ({
          ...f,
          hasOpenRecalls: list.length > 0,
          history: { ...(f.history || {}), noOpenRecalls: list.length === 0 }
        }));
      } catch {
        if (!cancel) { setRecalls([]); setRecallsChecked(true); }
      } finally {
        if (!cancel) setRecallsLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [form.year, form.make, form.model]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (autoFilled.has(k)) setAutoFilled(s => { const n = new Set(s); n.delete(k); return n; });
  };
  const setHist = (k, v) => setForm(f => ({ ...f, history: { ...f.history, [k]: v } }));

  const filledClass = (k) => autoFilled.has(k) ? 'border-blue-400 bg-blue-50/40' : '';

  const decodeVin = async () => {
    const v = String(vinInput || '').trim().toUpperCase();
    if (!validVin(v)) {
      setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
      flash && flash('VIN must be 17 chars (no I, O, Q)', 'error');
      return;
    }
    setErrors(e => { const { vin: _, ...rest } = e; return rest; });
    setVinDecoding(true);
    setVinSummary(null);
    try {
      const result = await nhtsaDecodeVin(v);
      if (!result || !result.fields.make) {
        flash && flash('VIN not found — enter details manually', 'error');
        setVinDecoding(false);
        return;
      }
      const f = result.fields;
      const filled = [];
      const next = { ...form, vin: v };
      const apply = (key, val, label) => {
        if (val !== null && val !== undefined && val !== '') { next[key] = val; filled.push(label); }
      };
      apply('year', f.year ? Number(f.year) : null, 'Year');
      apply('make', f.make, 'Make');
      apply('model', f.model, 'Model');
      apply('trim', f.trim, 'Trim');
      if (f.bodyStyle && BODY_STYLES.includes(f.bodyStyle)) { next.bodyStyle = f.bodyStyle; filled.push('Body Style'); }
      apply('engine', f.engine, 'Engine');
      if (f.transmission && TRANSMISSIONS.includes(f.transmission)) { next.transmission = f.transmission; filled.push('Transmission'); }
      if (f.drivetrain && DRIVETRAINS.includes(f.drivetrain)) { next.drivetrain = f.drivetrain; filled.push('Drivetrain'); }
      if (f.fuelType && FUEL_TYPES.includes(f.fuelType)) { next.fuelType = f.fuelType; filled.push('Fuel Type'); }
      filled.push('VIN');
      setForm(next);
      const filledKeys = new Set();
      if (next.year !== form.year) filledKeys.add('year');
      if (next.make !== form.make) filledKeys.add('make');
      if (next.model !== form.model) filledKeys.add('model');
      if (next.trim !== form.trim) filledKeys.add('trim');
      if (next.bodyStyle !== form.bodyStyle) filledKeys.add('bodyStyle');
      if (next.engine !== form.engine) filledKeys.add('engine');
      if (next.transmission !== form.transmission) filledKeys.add('transmission');
      if (next.drivetrain !== form.drivetrain) filledKeys.add('drivetrain');
      if (next.fuelType !== form.fuelType) filledKeys.add('fuelType');
      filledKeys.add('vin');
      setAutoFilled(filledKeys);
      setVinSummary({ count: filled.length, fields: filled });
      flash && flash(`VIN decoded — ${filled.length} fields auto-filled`, 'success');
    } catch (err) {
      flash && flash('VIN decoder unavailable — enter details manually', 'error');
    } finally {
      setVinDecoding(false);
    }
  };

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

  const handleSave = async (addAnother = false) => {
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
    setSavingEspo(true);
    const espo = await espoSaveVehicle(cleaned);
    setSavingEspo(false);
    if (espo.ok) {
      cleaned.espoId = espo.id || cleaned.espoId || null;
      flash && flash(`Saved to EspoCRM (${ESPO_VEHICLE_ENTITY})`, 'success');
    } else {
      flash && flash(`EspoCRM save failed: ${espo.error}. Saved locally only.`, 'error');
    }
    onSave(cleaned, addAnother);
    if (addAnother) {
      setForm({ ...BLANK_VEHICLE });
      setPhotoInput('');
      setVinInput('');
      setAutoFilled(new Set());
      setVinSummary(null);
      setRecalls([]);
      setRecallsChecked(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const photoUrls = photoInput.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs mb-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
        <button onClick={onCancel} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Inventory</button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? `Edit: ${form.year} ${form.make} ${form.model}` : 'Add New Vehicle'}
        </span>
      </nav>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
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
        {/* VIN DECODER (HERO) */}
        <Card className="p-5 border-2" style={{ borderColor: `${GOLD}80`, background: `linear-gradient(135deg, ${GOLD}10 0%, transparent 60%)` }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: '#7A5A0F' }} />
            <h3 className="font-display text-lg font-semibold">VIN Decoder</h3>
            <span className="text-[10px] smallcaps font-semibold ml-auto px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>Free · NHTSA</span>
          </div>
          <p className="text-sm text-stone-600 mb-4">Enter a VIN to auto-fill 9 vehicle details in one click.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Input value={vinInput} maxLength={17}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                onBlur={() => {
                  const v = vinInput.trim();
                  if (v && !validVin(v)) setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
                  else setErrors(e => { const { vin: _, ...rest } = e; return rest; });
                }}
                placeholder="Enter 17-character VIN to auto-fill vehicle details"
                className={`font-mono text-sm tracking-wider ${errors.vin ? 'border-red-400' : ''}`} />
            </div>
            <Btn variant="gold" icon={vinDecoding ? RefreshCw : Sparkles} disabled={vinDecoding || !vinInput}
              onClick={decodeVin} className={vinDecoding ? '[&>svg]:animate-spin' : ''}>
              {vinDecoding ? 'Decoding…' : 'Decode VIN'}
            </Btn>
          </div>
          {errors.vin && <div className="text-[11px] text-red-600 mt-1.5">{errors.vin}</div>}
          {vinSummary && (
            <div className="mt-3 p-3 rounded-md bg-white border border-stone-200 text-[12px] text-stone-700">
              <div className="flex items-center gap-1.5 mb-1 font-semibold" style={{ color: '#256B40' }}>
                <Check className="w-3.5 h-3.5" />
                {vinSummary.count} fields auto-filled
              </div>
              <div className="text-stone-500">{vinSummary.fields.join(' · ')}</div>
            </div>
          )}
          <div className="mt-3 text-[10px] smallcaps text-stone-400">Powered by NHTSA Open Data</div>
        </Card>

        {/* RECALLS BANNER */}
        {recallsLoading && (
          <div className="p-3 rounded-md border border-stone-200 bg-white text-sm text-stone-600 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking NHTSA recalls…
          </div>
        )}
        {!recallsLoading && recallsChecked && recalls.length > 0 && (
          <div className="p-4 rounded-md border-l-4 bg-amber-50 border border-amber-200" style={{ borderLeftColor: '#D97706' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-amber-900">⚠️ {recalls.length} open recall{recalls.length === 1 ? '' : 's'} found for this vehicle</div>
                <ul className="mt-2 space-y-1.5 text-[12px] text-amber-900/90">
                  {recalls.slice(0, 5).map((r, i) => (
                    <li key={i}><span className="font-mono font-semibold">{r.campaign}</span>{r.summary ? <> — {r.summary}</> : null}</li>
                  ))}
                  {recalls.length > 5 && <li className="italic text-amber-700">+{recalls.length - 5} more…</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
        {!recallsLoading && recallsChecked && recalls.length === 0 && (
          <div className="p-3 rounded-md border border-emerald-200 bg-emerald-50 text-sm flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" /> ✓ No open recalls found
          </div>
        )}

        {/* VEHICLE INFO */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-stone-500" />
            <h3 className="font-display text-lg font-semibold">Vehicle Info</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Year" required>
              <Select value={form.year} onChange={(e) => set('year', Number(e.target.value))}
                className={`${errors.year ? 'border-red-400' : ''} ${filledClass('year')}`}>
                {(() => {
                  const cy = new Date().getFullYear();
                  const years = [];
                  for (let y = cy + 1; y >= 1950; y--) years.push(y);
                  return years.map(y => <option key={y} value={y}>{y}</option>);
                })()}
              </Select>
            </Field>
            <Field label="Make" required hint={makesError ? 'NHTSA list unavailable — using free text' : undefined}>
              {makesError ? (
                <Input value={form.make} onChange={(e) => set('make', e.target.value)}
                  className={`${errors.make ? 'border-red-400' : ''} ${filledClass('make')}`} />
              ) : (
                <div className={filledClass('make') ? 'rounded-md ring-1 ring-blue-300' : ''}>
                  <SearchableSelect value={form.make}
                    onChange={(v) => { set('make', v); set('model', ''); }}
                    items={allMakes} popular={POPULAR_MAKES}
                    loading={makesLoading} error={!!errors.make}
                    placeholder="Select make" allLabel="All Makes" />
                </div>
              )}
            </Field>
            <Field label="Model" required hint={modelsError ? 'NHTSA models unavailable — using free text' : (modelsLoading ? 'Loading models…' : undefined)}>
              {modelsError || modelsForMake.length === 0 ? (
                <Input value={form.model} onChange={(e) => set('model', e.target.value)}
                  className={`${errors.model ? 'border-red-400' : ''} ${filledClass('model')}`}
                  placeholder="e.g. X5" />
              ) : (
                <div className={filledClass('model') ? 'rounded-md ring-1 ring-blue-300' : ''}>
                  <SearchableSelect value={form.model} onChange={(v) => set('model', v)}
                    items={modelsForMake} loading={modelsLoading}
                    error={!!errors.model} placeholder="Select model" allLabel="Models" />
                </div>
              )}
            </Field>
            <Field label="Trim">
              <Input value={form.trim} onChange={(e) => set('trim', e.target.value)}
                className={filledClass('trim')} placeholder="e.g. xDrive40i" />
            </Field>
            <Field label="Body Style">
              <Select value={form.bodyStyle} onChange={(e) => set('bodyStyle', e.target.value)}
                className={filledClass('bodyStyle')}>
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
              <h3 className="font-display text-lg font-semibold">Pricing</h3>
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
            <h3 className="font-display text-lg font-semibold">Specifications</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Input value={form.engine} onChange={(e) => set('engine', e.target.value)}
                className={filledClass('engine')} placeholder="3.0L Turbo Inline-6" />
            </Field>
            <Field label="Transmission">
              <Select value={form.transmission} onChange={(e) => set('transmission', e.target.value)}
                className={filledClass('transmission')}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Drivetrain">
              <Select value={form.drivetrain} onChange={(e) => set('drivetrain', e.target.value)}
                className={filledClass('drivetrain')}>
                {DRIVETRAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Fuel Type">
              <Select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)}
                className={filledClass('fuelType')}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="MPG City" hint={mpgLoading ? 'Fetching…' : (mpgUnavailable ? 'MPG data not available for this vehicle' : undefined)}>
                <Input type="number" value={form.mpgCity} onChange={(e) => set('mpgCity', e.target.value)}
                  className={filledClass('mpgCity')} />
              </Field>
              <Field label="MPG Hwy" hint={mpgLoading ? 'Fetching…' : undefined}>
                <Input type="number" value={form.mpgHwy} onChange={(e) => set('mpgHwy', e.target.value)}
                  className={filledClass('mpgHwy')} />
              </Field>
            </div>
            <Field label="VIN" hint={errors.vin || '17 characters · no I, O, Q'}>
              <Input value={form.vin}
                onChange={(e) => { const v = e.target.value.toUpperCase(); set('vin', v); setVinInput(v); }}
                onBlur={() => {
                  const v = String(form.vin || '').trim();
                  if (v && !validVin(v)) setErrors(e => ({ ...e, vin: 'VIN must be 17 alphanumeric chars (no I, O, Q)' }));
                  else setErrors(e => { const { vin: _, ...rest } = e; return rest; });
                }}
                maxLength={17}
                className={`font-mono text-xs ${errors.vin ? 'border-red-400' : ''} ${filledClass('vin')}`} />
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
            <h3 className="font-display text-lg font-semibold">Vehicle History</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ['noAccidents','No Accidents'], ['oneOwner','1 Owner'], ['cleanTitle','Clean Title'],
              ['serviceRecords','Service Records Available'], ['inspection','150-Point Inspection Passed'],
              ['carfax','CARFAX Available'], ['warranty','Manufacturer Warranty Remaining'],
              ['noOpenRecalls','No Open Recalls']
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-stone-200 hover:border-stone-300 cursor-pointer">
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
              <h3 className="font-display text-lg font-semibold">Description</h3>
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
              <h3 className="font-display text-lg font-semibold">Photos</h3>
            </div>
            <span className="text-[10px] smallcaps text-stone-500">{photoUrls.length} of 20 photos · First = hero</span>
          </div>

          {/* Drag-drop zone */}
          <button type="button"
            onClick={() => {
              const url = window.prompt('Paste image URL (in production: drag photos to upload to Cloudflare R2)');
              if (url && url.trim()) {
                setPhotoInput(prev => prev ? prev + ', ' + url.trim() : url.trim());
              }
            }}
            className="w-full rounded-lg p-8 text-center transition hover:bg-stone-50/60"
            style={{ border: '2px dashed var(--border-strong)', backgroundColor: 'var(--bg-elevated)' }}>
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
            <div className="text-sm font-semibold mb-1">Drag photos here or click to browse</div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG, HEIC — up to 20 photos per vehicle</div>
            <div className="text-[10px] smallcaps font-semibold mt-3 inline-flex items-center gap-1" style={{ color: GOLD }}>
              <Sparkles className="w-3 h-3" /> Cloud photo storage included — unlimited photos
            </div>
          </button>

          {/* Thumbnail grid */}
          {photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={url} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-stone-400">Invalid URL</div>'; }} />
                  </div>
                  {i === 0 ? (
                    <span className="absolute top-1 left-1 text-[9px] font-bold smallcaps px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                      style={{ backgroundColor: GOLD, color: '#1A1612' }}><Star className="w-2.5 h-2.5" fill="currentColor" /> HERO</span>
                  ) : (
                    <button type="button" title="Set as hero" onClick={() => {
                      const arr = [...photoUrls]; const [moved] = arr.splice(i, 1); arr.unshift(moved);
                      setPhotoInput(arr.join(', '));
                    }} className="absolute top-1 left-1 w-6 h-6 bg-white/85 rounded text-stone-600 hover:text-amber-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button type="button" title="Remove" onClick={() => {
                    const arr = photoUrls.filter((_, j) => j !== i);
                    setPhotoInput(arr.join(', '));
                  }} className="absolute top-1 right-1 w-6 h-6 bg-white/85 rounded text-stone-600 hover:text-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-white/90 rounded text-[10px] font-bold flex items-center justify-center text-stone-700">{i + 1}</span>
                  {i > 0 && (
                    <button type="button" title="Move left" onClick={() => {
                      const arr = [...photoUrls]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      setPhotoInput(arr.join(', '));
                    }} className="absolute bottom-1 left-1 w-5 h-5 bg-white/90 rounded text-[10px] font-bold flex items-center justify-center text-stone-600 opacity-0 group-hover:opacity-100 transition">
                      ◀
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* URL fallback toggle */}
          <details className="mt-4">
            <summary className="text-[11px] smallcaps font-semibold cursor-pointer hover:text-stone-900" style={{ color: 'var(--text-muted)' }}>
              Or paste image URLs manually
            </summary>
            <Textarea value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} rows={2} className="mt-2 text-xs"
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg" />
          </details>
        </Card>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-stone-50/95 backdrop-blur py-4 -mx-6 px-6 lg:-mx-8 lg:px-8 border-t border-stone-200">
          {savingEspo && (
            <span className="text-[11px] text-stone-500 flex items-center gap-1.5 mr-2">
              <RefreshCw className="w-3 h-3 animate-spin" /> Syncing to EspoCRM…
            </span>
          )}
          <Btn variant="ghost" onClick={onCancel} disabled={savingEspo}>Cancel</Btn>
          {!isEdit && <Btn variant="default" icon={Plus} disabled={savingEspo} onClick={() => handleSave(true)}>Save & Add Another</Btn>}
          <Btn variant="gold" icon={savingEspo ? RefreshCw : Save} disabled={savingEspo}
            onClick={() => handleSave(false)}
            className={savingEspo ? '[&>svg]:animate-spin' : ''}>
            {savingEspo ? 'Saving…' : (isEdit ? 'Save Changes' : 'Save Vehicle')}
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

function LeadsTab({ leads, setLeads, inventory, settings, setSettings, onConvertToDeal, flash, messages, setMessages, onCreateTask }) {
  const [showLicense, setShowLicense] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('info'); // 'info' | 'messages'
  const [msgChannel, setMsgChannel] = useState('sms');
  const [msgDraft, setMsgDraft] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [bulkAction, setBulkAction] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [savedOpen, setSavedOpen] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const savedViews = settings?.savedViews?.leads || [];

  const applyView = (v) => {
    setSearch(v.filter.search || '');
    setFilterStatus(v.filter.status || 'all');
    setFilterSource(v.filter.source || 'all');
    setSavedOpen(false);
    flash(`Loaded view: ${v.name}`);
  };
  const saveCurrentView = (name) => {
    if (!name || !name.trim()) return;
    const view = {
      id: 'sv-l-' + Date.now(),
      name: name.trim(),
      filter: { search, status: filterStatus, source: filterSource }
    };
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), leads: [...(s.savedViews?.leads || []), view] } }));
    flash(`Saved view: ${view.name}`);
  };
  const deleteView = (id) => {
    setSettings(s => ({ ...s, savedViews: { ...(s.savedViews || {}), leads: (s.savedViews?.leads || []).filter(v => v.id !== id) } }));
  };

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

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterSource, filterDate]);

  const allSelected = filtered.length > 0 && filtered.every(l => selectedLeads.has(l.id));
  const toggleAll = () => {
    if (allSelected) { const n = new Set(selectedLeads); filtered.forEach(l => n.delete(l.id)); setSelectedLeads(n); }
    else { const n = new Set(selectedLeads); filtered.forEach(l => n.add(l.id)); setSelectedLeads(n); }
  };
  const toggleOne = (id) => { const n = new Set(selectedLeads); n.has(id) ? n.delete(id) : n.add(id); setSelectedLeads(n); };
  const bulkApply = (action) => {
    const ids = Array.from(selectedLeads);
    if (ids.length === 0) return;
    if (action === 'contacted')   { setLeads(arr => arr.map(l => ids.includes(l.id) ? { ...l, status: 'Contacted' } : l)); flash(`${ids.length} marked Contacted`); }
    else if (action === 'lost')   { setLeads(arr => arr.map(l => ids.includes(l.id) ? { ...l, status: 'Lost' } : l)); flash(`${ids.length} marked Lost`); }
    else if (action === 'delete') {
      const removed = leads.filter(l => ids.includes(l.id));
      setLeads(arr => arr.filter(l => !ids.includes(l.id)));
      flash(`${ids.length} lead${ids.length === 1 ? '' : 's'} deleted`, { tone: 'destructive', undo: () => setLeads(arr => [...removed, ...arr]) });
    }
    else if (action === 'csv') {
      const headers = ['name','email','phone','source','vehicleLabel','status','createdAt'];
      const rows = leads.filter(l => ids.includes(l.id));
      downloadFile('primo-leads.csv', buildCSV(headers, rows));
      flash(`Exported ${ids.length} leads to CSV`);
    }
    setSelectedLeads(new Set());
    setBulkAction(null);
  };

  const updateLead = (id, patch) => setLeads(arr => arr.map(l => l.id === id ? { ...l, ...patch } : l));

  const expandLead = (id) => {
    setExpanded(expanded === id ? null : id);
    if (!leads.find(l => l.id === id)?.read) updateLead(id, { read: true });
  };

  const unread = leads.filter(l => !l.read).length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Leads</h1>
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
              <h3 className="font-display text-lg font-semibold">Lead Automation</h3>
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

          {/* Follow-up sequence preview */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" style={{ color: GOLD }} /> Follow-Up Sequence Preview
              </div>
              <Toggle checked={settings.notifications.autoFollowupEmail || settings.notifications.autoFollowupSms}
                onChange={() => {}} disabled />
            </div>
            <div className="space-y-1.5">
              {[
                { time: 'Hour 4', kind: 'Email', text: 'Thanks for your interest in [vehicle]', icon: Mail },
                { time: 'Hour 24', kind: 'Text', text: "Still interested in the [vehicle]? It's still available.", icon: MessageSquare },
                { time: 'Day 3', kind: 'Email', text: '[Vehicle] update + 2 similar vehicles to consider', icon: Mail },
                { time: 'Day 7', kind: 'Email', text: 'Final follow-up — last chance before we feature it', icon: Mail }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-md border border-stone-100">
                    <span className="text-[10px] smallcaps font-bold tabular text-stone-500 w-14">{s.time}</span>
                    <Icon className="w-3.5 h-3.5 text-stone-500" />
                    <span className="text-[10px] smallcaps font-semibold w-10" style={{ color: '#7A5A0F' }}>{s.kind}</span>
                    <span className="text-[12px] text-stone-700 flex-1 italic">"{s.text}"</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-stone-500 leading-relaxed">
              <strong className="text-stone-700">AI-powered follow-up</strong> — included free.
              <span style={{ color: GOLD }}> Competitors charge $500+/mo for this.</span>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
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
          <div className="relative">
            <button onClick={() => setSavedOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md hover:bg-stone-100 transition"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' }}>
              <Bookmark className="w-3.5 h-3.5" /> Views <ChevronDown className="w-3 h-3" />
            </button>
            {savedOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSavedOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg z-40 py-1 anim-fade"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {savedViews.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-center" style={{ color: 'var(--text-muted)' }}>No saved views yet</div>
                  ) : savedViews.map(v => (
                    <div key={v.id} className="flex items-center group">
                      <button onClick={() => applyView(v)}
                        className="flex-1 px-3 py-2 text-left text-xs hover:bg-stone-50 truncate">{v.name}</button>
                      <button onClick={() => deleteView(v.id)} title="Delete view"
                        className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                  <button onClick={() => { setSavedOpen(false); setShowSaveView(true); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50"
                    style={{ color: 'var(--text-primary)' }}>
                    <Plus className="w-3 h-3" /> Save current view…
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {selectedLeads.size > 0 && (
        <div className="mb-3 p-3 rounded-lg flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold mr-2" style={{ color: 'var(--text-primary)' }}>{selectedLeads.size} selected</span>
          <Btn size="sm" variant="default" onClick={() => bulkApply('contacted')}>Mark Contacted</Btn>
          <Btn size="sm" variant="default" onClick={() => bulkApply('lost')}>Mark Lost</Btn>
          <Btn size="sm" variant="default" icon={Download} onClick={() => bulkApply('csv')}>Export CSV</Btn>
          <Btn size="sm" variant="default" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100" onClick={() => bulkApply('delete')}>Delete</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setSelectedLeads(new Set())}>Clear</Btn>
        </div>
      )}

      {/* Leads table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={toggleAll} className="flex items-center justify-center">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
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
                <tr><td colSpan={8} className="text-center py-16 px-4">
                  <Users className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No leads yet</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Leads appear here when customers submit forms on your website. Try clearing your filters above.</div>
                </td></tr>
              ) : paged.map(l => (
                <React.Fragment key={l.id}>
                  <tr onClick={() => expandLead(l.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${!l.read ? 'bg-amber-50/30' : ''} ${expanded === l.id ? 'bg-stone-50' : ''} ${selectedLeads.has(l.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOne(l.id)} className="flex items-center justify-center">
                        {selectedLeads.has(l.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                      </button>
                    </td>
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
                      <LeadSourceBadge source={l.source} />
                    </td>
                    <td className="px-2 py-3 text-stone-700">{l.vehicleLabel}</td>
                    <td className="px-2 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-2 py-3 text-right text-xs text-stone-500 tabular">{relTime(l.createdAt)}</td>
                  </tr>
                  {expanded === l.id && (
                    <tr>
                      <td colSpan={8} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="md:hidden flex justify-end mb-3">
                          <button onClick={() => setExpanded(null)}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-100">
                            Close
                          </button>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-6 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
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
                              <div className="flex space-x-2 mb-2">
                                <a href={`tel:${l.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Phone className="w-4 h-4 text-stone-700" />
                                  <span>Call</span>
                                </a>
                                <a href={`sms:${l.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <MessageSquare className="w-4 h-4 text-stone-700" />
                                  <span>Text</span>
                                </a>
                                <a href={`mailto:${l.email}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Mail className="w-4 h-4 text-stone-700" />
                                  <span>Email</span>
                                </a>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setShowLicense(true)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <Camera className="w-3.5 h-3.5" /> Scan License
                                </button>
                                <button onClick={() => onCreateTask && onCreateTask(l)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition text-xs font-medium">
                                  <CheckSquare className="w-3.5 h-3.5" /> Follow-Up
                                </button>
                              </div>
                              <button onClick={() => setActiveDetailTab(activeDetailTab === 'messages' ? 'info' : 'messages')}
                                className={`w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md transition text-xs font-medium ${activeDetailTab === 'messages' ? 'border-2 border-amber-500 bg-amber-50 text-amber-900' : 'bg-white border border-stone-200 hover:border-stone-400'}`}>
                                <MessageSquare className="w-3.5 h-3.5" />
                                {activeDetailTab === 'messages' ? 'Hide Messages' : `Messages (${(messages?.[l.id] || []).length})`}
                              </button>
                            </div>

                            {expanded === l.id && activeDetailTab === 'messages' && (
                              <div className="rounded-md p-3 bg-white border-2 border-amber-200">
                                <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Conversation Thread</div>
                                <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                                  {(messages?.[l.id] || []).length === 0 ? (
                                    <div className="text-xs text-center text-stone-400 py-4">No messages yet — send the first one below.</div>
                                  ) : (messages[l.id] || []).map(m => {
                                    const isOut = m.dir === 'out';
                                    return (
                                      <div key={m.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs`}
                                          style={{ backgroundColor: isOut ? GOLD_SOFT : '#F5F5F0', color: isOut ? '#1A1612' : '#1C1917' }}>
                                          <div>{m.text}</div>
                                          <div className="text-[9px] mt-0.5 opacity-60 flex items-center gap-1.5">
                                            {m.channel === 'sms' ? <MessageSquare className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                                            {new Date(m.when).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-1 mb-2">
                                  <button onClick={() => setMsgChannel('sms')}
                                    className={`flex-1 px-2 py-1 text-[10px] font-bold rounded ${msgChannel === 'sms' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>SMS</button>
                                  <button onClick={() => setMsgChannel('email')}
                                    className={`flex-1 px-2 py-1 text-[10px] font-bold rounded ${msgChannel === 'email' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>EMAIL</button>
                                </div>
                                <Textarea rows={2} value={msgDraft} onChange={(e) => setMsgDraft(e.target.value)}
                                  placeholder={msgChannel === 'sms' ? 'Type SMS…' : 'Type email…'} className="text-xs" />
                                <Btn variant="gold" size="sm" className="w-full mt-2" icon={Send}
                                  disabled={!msgDraft.trim()}
                                  onClick={() => {
                                    const m = { id: 'm-' + Date.now(), dir: 'out', channel: msgChannel, text: msgDraft.trim(), when: new Date().toISOString() };
                                    setMessages(prev => ({ ...prev, [l.id]: [...(prev[l.id] || []), m] }));
                                    setMsgDraft('');
                                    flash(`${msgChannel === 'sms' ? 'Text' : 'Email'} sent (demo)`);
                                  }}>
                                  Send {msgChannel === 'sms' ? 'Text' : 'Email'}
                                </Btn>
                                <div className="text-[9px] text-stone-400 mt-1.5 text-center">In production: wired to Twilio (SMS) and Resend (email)</div>
                              </div>
                            )}

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
        <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="lead" />
      </Card>

      <ConfirmDialog
        isOpen={showSaveView}
        title="Save current view"
        message="Give this filter combination a name to load it later."
        confirmLabel="Save view"
        confirmColor="dark"
        inputs={[{ name: 'name', label: 'View name', placeholder: 'e.g., Hot leads this week' }]}
        onConfirm={(vals) => { saveCurrentView(vals.name); setShowSaveView(false); }}
        onCancel={() => setShowSaveView(false)} />

      {/* Driver's License Scanner placeholder */}
      {showLicense && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 anim-fade no-print" onClick={() => setShowLicense(false)}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-stone-700" />
                <h3 className="font-display text-lg font-semibold">Scan Driver's License</h3>
              </div>
              {/* Viewfinder placeholder */}
              <div className="relative aspect-[1.6/1] rounded-md overflow-hidden mb-4"
                style={{ backgroundColor: '#0F0F0F' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-14 h-14 text-stone-600" strokeWidth={1.25} />
                </div>
                {/* corner crosshairs */}
                {[
                  { top: 12, left: 12, br: ['t','l'] },
                  { top: 12, right: 12, br: ['t','r'] },
                  { bottom: 12, left: 12, br: ['b','l'] },
                  { bottom: 12, right: 12, br: ['b','r'] }
                ].map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 26, height: 26,
                    borderTop:    p.br.includes('t') ? `2px solid ${GOLD}` : 'none',
                    borderBottom: p.br.includes('b') ? `2px solid ${GOLD}` : 'none',
                    borderLeft:   p.br.includes('l') ? `2px solid ${GOLD}` : 'none',
                    borderRight:  p.br.includes('r') ? `2px solid ${GOLD}` : 'none',
                    ...p
                  }} />
                ))}
                <div className="absolute inset-0 flex items-end justify-center pb-3">
                  <span className="text-[11px] font-semibold smallcaps tracking-wider" style={{ color: GOLD }}>
                    Position license in frame
                  </span>
                </div>
              </div>
              <div className="text-sm space-y-1.5 mb-3" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Auto-fills name + address</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Date of birth, license number</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> State + expiration</div>
              </div>
              <div className="rounded-md p-3 text-[12px]" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                Available on mobile devices — uses your phone's camera. In production: powered by Microblink BlinkID OCR.
              </div>
            </div>
            <div className="px-5 py-3 flex justify-end" style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={() => setShowLicense(false)}>Close</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== DEAL BUILDER TAB ========================= */

function DealsTab({ deals, setDeals, inventory, onMarkSold, flash }) {
  const [expanded, setExpanded] = useState(deals[0]?.id || null);
  const [filter, setFilter] = useState('active');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [creditDeal, setCreditDeal] = useState(null);   // deal awaiting credit pre-qual
  const [creditForm, setCreditForm] = useState({ ssn: '', dob: '', address: '', income: '' });
  const [creditState, setCreditState] = useState('idle'); // idle | loading | result
  const [creditResult, setCreditResult] = useState(null);

  const runSoftPull = () => {
    setCreditState('loading');
    setTimeout(() => {
      const result = {
        approved: true,
        tier: 'Tier 1 — Excellent',
        apr: 4.9,
        maxAmount: 45000,
        lender: 'Capital One Auto Finance'
      };
      setCreditResult(result);
      setCreditState('result');
    }, 2000);
  };
  const applyCreditResult = () => {
    if (creditResult && creditDeal) {
      setDeals(arr => arr.map(d => d.id === creditDeal.id ? { ...d, apr: creditResult.apr, lender: creditResult.lender, preApproved: true } : d));
      flash(`Pre-approved at ${creditResult.apr}% — APR auto-filled`);
    }
    closeCredit();
  };
  const openCredit = (deal) => {
    setCreditDeal(deal);
    setCreditForm({ ssn: '', dob: '', address: '', income: '' });
    setCreditState('idle');
    setCreditResult(null);
  };
  const closeCredit = () => { setCreditDeal(null); setCreditState('idle'); setCreditResult(null); };

  const fniStats = useMemo(() => {
    const all = SEED_FNI_HISTORY.concat(deals.filter(d => d.fniProducts).map(d => ({
      ...d.fniProducts, dealId: d.id
    })));
    const totals = FNI_PRODUCT_CATALOG.reduce((acc, p) => {
      acc[p.key] = all.filter(d => d[p.key]).length;
      return acc;
    }, {});
    const dealsCount = all.length || 1;
    const monthRevenue = FNI_PRODUCT_CATALOG.reduce((sum, p) => sum + (totals[p.key] || 0) * p.price, 0);
    const avgPerDeal = monthRevenue / dealsCount;
    const penetration = FNI_PRODUCT_CATALOG.map(p => ({
      ...p, count: totals[p.key], rate: (totals[p.key] / dealsCount * 100)
    }));
    return { monthRevenue, avgPerDeal, penetration, dealsCount };
  }, [deals]);

  const filtered = useMemo(() => {
    if (filter === 'active') return deals.filter(d => !['Delivered','Lost'].includes(d.status));
    if (filter === 'won') return deals.filter(d => d.status === 'Delivered');
    if (filter === 'lost') return deals.filter(d => d.status === 'Lost');
    return deals;
  }, [deals, filter]);

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [filter]);

  const updateDeal = (id, patch) => setDeals(arr => arr.map(d => d.id === id ? { ...d, ...patch } : d));

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Deal Builder</h1>
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

      {/* F&I Revenue Summary */}
      <Card className="overflow-hidden mb-6">
        <div className="grid md:grid-cols-3 gap-0 divide-x divide-stone-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">F&I Revenue This Month</div>
            </div>
            <div className="font-display tabular text-3xl font-medium" style={{ color: GOLD }}>
              {fmtMoney(fniStats.monthRevenue)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1.5">
              from {fniStats.dealsCount} deal{fniStats.dealsCount === 1 ? '' : 's'}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Avg F&I Per Deal</div>
            </div>
            <div className="font-display tabular text-3xl font-medium">{fmtMoney(fniStats.avgPerDeal)}</div>
            <div className="text-[11px] text-stone-500 mt-1.5">industry avg: $1,452</div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <div className="text-[10px] smallcaps font-semibold text-stone-500">Product Penetration</div>
            </div>
            <div className="space-y-1">
              {fniStats.penetration.slice(0, 3).map(p => (
                <div key={p.key} className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-600 flex-1 truncate">{p.label}</span>
                  <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: p.rate + '%', backgroundColor: GOLD }} />
                  </div>
                  <span className="text-[10px] tabular text-stone-500 w-9 text-right">{p.rate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Calculator className="w-10 h-10 mx-auto text-stone-300 mb-3" strokeWidth={1.25} />
          <h3 className="font-display text-lg font-semibold mb-1">No deals here yet</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Customers who use "Build Your Deal" on your website appear here.
            You can also convert any lead into a deal from the Leads tab.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {paged.map(deal => {
            const fees = (deal.fees?.docFee || 0) + (deal.fees?.tagTitle || 0) + (deal.fees?.dealerPrep || 0);
            const fniRev = FNI_PRODUCT_CATALOG.reduce((s, p) => s + (deal.fniProducts?.[p.key] ? p.price : 0), 0);
            const financed = Math.max(0, dealFinanced(deal) + fniRev);
            const monthly = calcPayment(financed, deal.apr, deal.termMonths);
            const totalCost = (deal.salePrice || 0) + fees + fniRev;
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
                          <h3 className="font-display text-lg font-semibold">Deal Worksheet</h3>
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
                          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {deal.preApproved
                                ? <span className="text-emerald-700 font-semibold">✓ Pre-approved · {deal.lender}</span>
                                : 'Run a soft credit inquiry — no impact to score'}
                            </div>
                            <Btn size="sm" variant="outlineGold" icon={ShieldCheck} onClick={() => openCredit(deal)}>
                              Run Soft Pull
                            </Btn>
                          </div>
                        </div>

                        {/* F&I Products */}
                        <div className="bg-white border border-stone-200 rounded-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] smallcaps font-semibold text-stone-500 flex items-center gap-1.5">
                              <Shield className="w-3 h-3" /> F&I Products Selected
                            </div>
                            {(() => {
                              const fniRevenue = FNI_PRODUCT_CATALOG.reduce((s, p) =>
                                s + (deal.fniProducts?.[p.key] ? p.price : 0), 0);
                              return (
                                <span className="font-display tabular text-sm font-semibold" style={{ color: GOLD }}>
                                  +{fmtMoney(fniRevenue)}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {FNI_PRODUCT_CATALOG.map(p => {
                              const selected = !!(deal.fniProducts?.[p.key]);
                              return (
                                <button key={p.key} type="button"
                                  onClick={() => updateDeal(deal.id, {
                                    fniProducts: { ...(deal.fniProducts || {}), [p.key]: !selected }
                                  })}
                                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md border text-left transition ${selected ? 'border-2' : 'border-stone-200 hover:border-stone-300'}`}
                                  style={selected ? { borderColor: GOLD, backgroundColor: '#FFFCF2' } : {}}>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0`}
                                    style={selected ? { backgroundColor: GOLD } : { border: '1.5px solid #d6d2c8' }}>
                                    {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-medium">{p.label}</div>
                                  </div>
                                  <span className={`text-[12px] font-semibold tabular ${selected ? '' : 'text-stone-400'}`}
                                    style={selected ? { color: '#7A5A0F' } : {}}>
                                    {fmtMoney(p.price)}
                                  </span>
                                </button>
                              );
                            })}
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
                      <div className="bg-stone-900 text-white p-6 lg:rounded-bl-lg lg:sticky lg:top-16 lg:self-start">
                        <div className="text-[10px] smallcaps font-semibold mb-4" style={{ color: GOLD }}>Deal Summary</div>

                        <div className="space-y-3 mb-5 text-sm">
                          <div className="flex justify-between"><span className="text-stone-400">Sale Price</span><span className="tabular">{fmtMoney(deal.salePrice)}</span></div>
                          <div className="flex justify-between"><span className="text-stone-400">+ Fees</span><span className="tabular">{fmtMoney(fees)}</span></div>
                          {fniRev > 0 && (
                            <div className="flex justify-between"><span style={{ color: GOLD }}>+ F&I Products</span><span className="tabular" style={{ color: GOLD }}>{fmtMoney(fniRev)}</span></div>
                          )}
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
          <Card><Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="deal" /></Card>
        </div>
      )}

      {/* Credit Pre-Qualification modal */}
      {creditDeal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-16 anim-fade no-print" onClick={closeCredit}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                <h3 className="font-display text-lg font-semibold">Credit Pre-Qualification</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Soft inquiry — <strong>no impact to credit score</strong>.
              </p>
              {creditState === 'idle' && (
                <>
                  <Field label="Customer">
                    <Input value={creditDeal.customerName || 'Customer'} readOnly className="bg-stone-50" />
                  </Field>
                  <Field label="SSN" className="mt-3">
                    <Input value={creditForm.ssn} maxLength={11}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 9);
                        if (v.length > 5) v = v.slice(0, 3) + '-' + v.slice(3, 5) + '-' + v.slice(5);
                        else if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
                        setCreditForm(f => ({ ...f, ssn: v }));
                      }}
                      placeholder="●●●-●●-●●●●" className="font-mono" />
                  </Field>
                  <Field label="Date of Birth" className="mt-3">
                    <Input type="date" value={creditForm.dob} onChange={(e) => setCreditForm(f => ({ ...f, dob: e.target.value }))} />
                  </Field>
                  <Field label="Address" className="mt-3">
                    <Input value={creditForm.address} onChange={(e) => setCreditForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="123 Main St, Miami, FL 33101" />
                  </Field>
                  <Field label="Monthly Income ($)" className="mt-3">
                    <Input type="number" value={creditForm.income} onChange={(e) => setCreditForm(f => ({ ...f, income: e.target.value }))} placeholder="6500" />
                  </Field>
                </>
              )}
              {creditState === 'loading' && (
                <div className="py-12 text-center">
                  <RefreshCw className="w-10 h-10 mx-auto animate-spin" style={{ color: GOLD }} />
                  <div className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>Pulling credit profile…</div>
                </div>
              )}
              {creditState === 'result' && creditResult && (
                <div className="space-y-3">
                  <div className="rounded-md p-4" style={{ backgroundColor: '#D1FAE5', border: '1px solid #10B981' }}>
                    <div className="text-2xl font-display font-bold text-emerald-800 mb-1">✓ PRE-APPROVED</div>
                    <div className="text-xs text-emerald-700">{creditResult.lender}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><div className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>Tier</div><div className="font-semibold">{creditResult.tier.split(' — ')[0]}</div></div>
                    <div><div className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>APR</div><div className="font-semibold tabular" style={{ color: GOLD }}>{creditResult.apr}%</div></div>
                    <div><div className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>Max Approved</div><div className="font-semibold tabular">${creditResult.maxAmount.toLocaleString()}</div></div>
                  </div>
                  <p className="text-[10px] mt-3" style={{ color: 'var(--text-muted)' }}>
                    In production, connected to <strong>700Credit / RouteOne</strong> for real-time lender decisions.
                  </p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              {creditState === 'idle' && (
                <>
                  <Btn variant="ghost" onClick={closeCredit}>Cancel</Btn>
                  <Btn variant="gold" icon={ShieldCheck} onClick={runSoftPull}>Check Rate</Btn>
                </>
              )}
              {creditState === 'loading' && <Btn variant="ghost" disabled>Working…</Btn>}
              {creditState === 'result' && (
                <>
                  <Btn variant="ghost" onClick={closeCredit}>Close</Btn>
                  <Btn variant="gold" icon={Check} onClick={applyCreditResult}>Apply to Deal</Btn>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== SOLD VEHICLES TAB ======================== */

function SoldTab({ sold, setSold, onRestore, flash }) {
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewMethod, setReviewMethod] = useState('email');
  const [confirmRestore, setConfirmRestore] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedSold, setSelectedSold] = useState(new Set());

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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sold Vehicles</h1>
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
        {selectedSold.size > 0 && (
          <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
            <span className="text-sm font-semibold mr-2">{selectedSold.size} selected</span>
            <Btn size="sm" variant="outlineGold" icon={Star}
              onClick={() => { selectedSold.forEach(id => { const s = sold.find(x => x.id === id); if (s) setReviewModal(s); }); flash(`Review requests sent to ${selectedSold.size}`); setSelectedSold(new Set()); }}>
              Request Reviews
            </Btn>
            <Btn size="sm" variant="default" icon={Download}
              onClick={() => {
                const headers = ['year','make','model','trim','saleDate','salePrice','cost','buyerName'];
                const rows = sold.filter(s => selectedSold.has(s.id));
                downloadFile('primo-sold.csv', buildCSV(headers, rows));
                flash(`Exported ${selectedSold.size} sold vehicles`);
                setSelectedSold(new Set());
              }}>Export CSV</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSelectedSold(new Set())}>Clear</Btn>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={() => {
                    if (sold.every(s => selectedSold.has(s.id))) setSelectedSold(new Set());
                    else setSelectedSold(new Set(sold.map(s => s.id)));
                  }} className="flex items-center justify-center">
                    {sold.length > 0 && sold.every(s => selectedSold.has(s.id))
                      ? <CheckSquare className="w-4 h-4 text-blue-600" />
                      : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
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
                <tr><td colSpan={11} className="text-center py-16 px-4">
                  <Archive className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No sold vehicles</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Vehicles you mark as sold from inventory will appear here with full sale history.</div>
                </td></tr>
              ) : (pageSize === Infinity ? sold : sold.slice((page - 1) * pageSize, page * pageSize)).map(s => {
                const gross = s.salePrice - s.cost;
                const grossPct = (gross / s.salePrice) * 100;
                const r = s.review || { status: 'not-sent' };
                return (
                  <tr key={s.id} className={`hover:bg-stone-50 ${selectedSold.has(s.id) ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => { const n = new Set(selectedSold); n.has(s.id) ? n.delete(s.id) : n.add(s.id); setSelectedSold(n); }}
                        className="flex items-center justify-center">
                        {selectedSold.has(s.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                      </button>
                    </td>
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
                        <Btn size="sm" variant="ghost" icon={RefreshCw} onClick={() => setConfirmRestore(s)}>
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
        <Paginator total={sold.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="sold vehicle" />
      </Card>

      {/* Review request modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 flex items-center justify-center p-4 anim-slide">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[85vh] overflow-y-auto">
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

      <ConfirmDialog
        isOpen={!!confirmRestore}
        title={confirmRestore ? `Restore ${confirmRestore.year} ${confirmRestore.make} ${confirmRestore.model}?` : ''}
        message="This moves the vehicle back to active inventory. The original sale record will be removed."
        confirmLabel="Restore"
        confirmColor="dark"
        onConfirm={() => { onRestore(confirmRestore.id); setConfirmRestore(null); }}
        onCancel={() => setConfirmRestore(null)} />
    </div>
  );
}

/* ====================== MARKETING TAB ============================ */

function MarketingTab({ inventory, setInventory, settings, setSettings, sold, reviews = [], setReviews = () => {}, flash }) {
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Marketing</h1>
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

      {/* Reputation Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ThumbsUp className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Reputation Management</h2>
        </div>
        <p className="text-sm text-stone-500 mb-5">Reviews drive 89% of luxury car shoppers. Automate the ask, then respond fast.</p>

        {/* Google Reviews Connection */}
        <div className="mb-6 p-4 rounded-md border border-stone-200 bg-stone-50">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="text-[11px] smallcaps font-semibold text-stone-600 mb-0.5">Google Reviews Connection</div>
              <div className="text-[12px] text-stone-500">Pull live reviews from your Google Business Profile.</div>
            </div>
            {settings.marketing?.googlePlaceId && settings.marketing?.googleApiKey ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
                <Check className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-600">
                Not Connected
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Google Place ID"
              hint={<>Find at <a className="underline hover:text-stone-900" target="_blank" rel="noopener noreferrer"
                href="https://developers.google.com/maps/documentation/places/web-service/place-id">developers.google.com/maps/documentation/places/web-service/place-id</a></>}>
              <Input value={settings.marketing?.googlePlaceId || ''}
                onChange={(e) => setSettings(s => ({ ...s, marketing: { ...s.marketing, googlePlaceId: e.target.value } }))}
                placeholder="ChIJ…" className="font-mono text-xs" />
            </Field>
            <Field label="Google Places API Key" hint="Stored locally — used server-side in production">
              <Input type="password" value={settings.marketing?.googleApiKey || ''}
                onChange={(e) => setSettings(s => ({ ...s, marketing: { ...s.marketing, googleApiKey: e.target.value } }))}
                placeholder="AIza…" className="font-mono text-xs" />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="text-[11px] text-stone-500">
              <AlertCircle className="w-3 h-3 inline -mt-0.5 mr-1" />
              Google Places blocks browser CORS — in production, reviews are fetched server-side via API route.
            </div>
            <Btn size="sm" variant="outlineGold"
              disabled={!settings.marketing?.googlePlaceId || !settings.marketing?.googleApiKey}
              onClick={() => flash('Google Reviews configured — server-side integration included in setup', 'success')}>
              Connect Google Reviews
            </Btn>
          </div>
        </div>

        {/* Hero rating */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 100%)', border: `1px solid ${GOLD}40` }}>
            <div className="flex items-baseline gap-3">
              <div className="font-display tabular text-5xl font-medium" style={{ color: '#7A5A0F' }}>4.9</div>
              <div className="flex-1">
                <div className="flex items-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4" fill={GOLD} stroke={GOLD} />)}
                </div>
                <div className="text-[11px] smallcaps text-stone-600">847 Google reviews</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: '#E8F2EC', color: '#256B40' }}>
              <TrendingUp className="w-3 h-3" />
              Above market average (4.2)
            </div>
          </div>

          <div className="p-5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-3">Review Request Pipeline</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none">3</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Pending requests</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none">12</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Sent this month</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: '#256B40' }}>8</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Reviews received</div>
              </div>
              <div>
                <div className="font-display tabular text-2xl font-medium leading-none" style={{ color: GOLD }}>67%</div>
                <div className="text-[10px] smallcaps text-stone-500 mt-1">Conversion rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent reviews feed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] smallcaps font-semibold text-stone-500">Recent Reviews</div>
            <a href="#" className="text-[11px] smallcaps font-semibold text-stone-500 hover:text-stone-900">
              View all on Google <ArrowUpRight className="w-3 h-3 inline" />
            </a>
          </div>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="border border-stone-200 rounded-md p-4 bg-white">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold"
                      style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>
                      {r.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.author}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(n => (
                            <Star key={n} className="w-3 h-3"
                              fill={n <= r.rating ? GOLD : 'transparent'}
                              stroke={n <= r.rating ? GOLD : '#d6d2c8'} strokeWidth={1.5} />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400 tabular">· {r.platform} · {relTime(r.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconBtn icon={Reply} title="Respond" tone="gold"
                      onClick={() => { setRespondingTo(r.id); setResponseText(r.response || ''); }} />
                    <IconBtn icon={Flag} title="Flag inappropriate" tone="danger"
                      onClick={() => flash('Review flagged for moderation')} />
                    <IconBtn icon={Share2} title="Share"
                      onClick={() => flash('Review link copied')} />
                  </div>
                </div>
                <p className="text-[13px] text-stone-700 leading-relaxed mb-2">{r.text}</p>

                {r.response && respondingTo !== r.id && (
                  <div className="mt-3 border-t border-stone-100 pt-3 pl-4 border-l-2 rounded-l-sm bg-stone-50 p-3 text-[12px] text-stone-700"
                    style={{ borderColor: GOLD }}>
                    <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: '#7A5A0F' }}>Owner response</div>
                    {r.response}
                  </div>
                )}

                {respondingTo === r.id && (
                  <div className="mt-3 border-t border-stone-100 pt-3 anim-slide">
                    <Textarea rows={3} value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Thanks for the kind words…" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Btn size="sm" variant="ghost" onClick={() => { setRespondingTo(null); setResponseText(''); }}>Cancel</Btn>
                      <Btn size="sm" variant="gold" icon={Send}
                        onClick={() => {
                          setReviews(arr => arr.map(x => x.id === r.id ? { ...x, response: responseText, responded: true } : x));
                          setRespondingTo(null);
                          setResponseText('');
                          flash('Response posted to Google');
                        }}>Post Response</Btn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auto-toggles */}
        <div className="pt-5 border-t border-stone-100 space-y-3">
          <div className="text-[10px] smallcaps font-semibold text-stone-500 mb-2">Automation</div>
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
  const [savedPulse, setSavedPulse] = useState(false);
  const isInitialRef = useRef(true);
  useEffect(() => {
    if (isInitialRef.current) { isInitialRef.current = false; return; }
    setSavedPulse(true);
    const t = setTimeout(() => setSavedPulse(false), 1400);
    return () => clearTimeout(t);
  }, [settings]);
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Configure your dealership profile, notifications, and integrations.</p>
      </div>

      {/* Dealership Info */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-stone-500" />
          <h2 className="font-display text-xl font-medium">Dealership Info</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="space-y-2.5 divide-y divide-stone-100">
            {days.map(d => (
              <div key={d} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap pt-2.5">
                <div className="w-12 text-sm font-semibold smallcaps text-stone-600">{d}</div>
                <Toggle checked={!settings.dealership.hours[d].closed}
                  onChange={(v) => set(`dealership.hours.${d}.closed`, !v)} />
                {settings.dealership.hours[d].closed ? (
                  <span className="text-xs text-stone-400 italic">Closed</span>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input type="time" value={settings.dealership.hours[d].open}
                      onChange={(e) => set(`dealership.hours.${d}.open`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                    <span className="text-stone-400 text-xs">to</span>
                    <input type="time" value={settings.dealership.hours[d].close}
                      onChange={(e) => set(`dealership.hours.${d}.close`, e.target.value)}
                      className="px-2 py-1 border border-stone-200 rounded text-sm tabular ring-gold" />
                  </div>
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

      {/* Locations */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-stone-500" />
          <h3 className="font-display text-lg font-semibold">Locations</h3>
        </div>
        <div className="rounded-md p-4 mb-3" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold">Primo Auto Group — Main Lot</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>123 Biscayne Blvd, Miami, FL 33132</div>
              <div className="text-sm tabular" style={{ color: 'var(--text-secondary)' }}>(305) 555-0199</div>
            </div>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full smallcaps"
              style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Active</span>
          </div>
        </div>
        <button disabled
          className="w-full p-4 rounded-md flex items-center gap-3 cursor-not-allowed opacity-70"
          style={{ border: '2px dashed var(--border-strong)', backgroundColor: 'var(--bg-card)' }}>
          <Shield className="w-4 h-4 text-stone-400" />
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add Location
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: GOLD_SOFT, color: '#7A5A0F' }}>Growth</span>
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Multi-location management available on Growth plan ($349/mo)
            </div>
          </div>
        </button>
      </Card>

      <div className={`flex justify-end items-center gap-2 pt-2 px-3 py-2 rounded-md transition ${savedPulse ? 'saved-pulse' : ''}`}>
        <Check className={`w-4 h-4 ${savedPulse ? 'text-emerald-600' : 'text-stone-400'}`} strokeWidth={2.5} />
        <span className={`text-sm font-medium ${savedPulse ? 'text-emerald-700' : 'text-stone-500'}`}>
          {savedPulse ? 'Saved' : 'All changes saved automatically'}
        </span>
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
  const [confirmTransition, setConfirmTransition] = useState(null); // { id, target, label }
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedAppts, setSelectedAppts] = useState(new Set());

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

  const paged = useMemo(() => pageSize === Infinity ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  useEffect(() => { setPage(1); }, [filter, search]);
  const allApptsSelected = filtered.length > 0 && filtered.every(a => selectedAppts.has(a.id));
  const toggleAllAppts = () => {
    if (allApptsSelected) { const n = new Set(selectedAppts); filtered.forEach(a => n.delete(a.id)); setSelectedAppts(n); }
    else { const n = new Set(selectedAppts); filtered.forEach(a => n.add(a.id)); setSelectedAppts(n); }
  };
  const toggleOneAppt = (id) => { const n = new Set(selectedAppts); n.has(id) ? n.delete(id) : n.add(id); setSelectedAppts(n); };
  const bulkApplyAppts = (action) => {
    const ids = Array.from(selectedAppts);
    if (ids.length === 0) return;
    if (action === 'confirm')      { setAppointments(arr => arr.map(a => ids.includes(a.id) ? { ...a, status: 'Confirmed' } : a)); flash(`${ids.length} confirmed`); }
    else if (action === 'cancel')  { setAppointments(arr => arr.map(a => ids.includes(a.id) ? { ...a, status: 'Cancelled' } : a)); flash(`${ids.length} cancelled`); }
    else if (action === 'csv') {
      const headers = ['customerName','phone','email','vehicleYear','vehicleMake','vehicleModel','serviceType','when','status','estimate','advisor'];
      downloadFile('primo-appointments.csv', buildCSV(headers, appointments.filter(a => ids.includes(a.id))));
      flash(`Exported ${ids.length} appointments`);
    }
    setSelectedAppts(new Set());
  };

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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Service Appointments</h1>
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

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
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

      {selectedAppts.size > 0 && (
        <div className="mb-3 p-3 rounded-lg flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold mr-2">{selectedAppts.size} selected</span>
          <Btn size="sm" variant="default" onClick={() => bulkApplyAppts('confirm')}>Confirm</Btn>
          <Btn size="sm" variant="default" onClick={() => bulkApplyAppts('cancel')}>Cancel</Btn>
          <Btn size="sm" variant="default" icon={Download} onClick={() => bulkApplyAppts('csv')}>Export CSV</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setSelectedAppts(new Set())}>Clear</Btn>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] smallcaps font-semibold text-stone-500">
              <tr>
                <th className="px-4 py-2.5 w-8">
                  <button onClick={toggleAllAppts} className="flex items-center justify-center">
                    {allApptsSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                </th>
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
                <tr><td colSpan={8} className="text-center py-16 px-4">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold text-stone-900 mb-1">No appointments</div>
                  <div className="text-sm text-stone-500 max-w-xs mx-auto">Service appointments will appear here once scheduled.</div>
                </td></tr>
              ) : paged.map(a => (
                <React.Fragment key={a.id}>
                  <tr onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${expanded === a.id ? 'bg-stone-50' : ''} ${selectedAppts.has(a.id) ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOneAppt(a.id)} className="flex items-center justify-center">
                        {selectedAppts.has(a.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                      </button>
                    </td>
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
                      <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                          <IconBtn icon={X} title="Cancel" tone="danger" onClick={() => setConfirmTransition({ appt: a, target: 'Cancelled', label: 'Cancel appointment' })} />
                        )}
                        {a.status === 'Confirmed' && (
                          <IconBtn icon={AlertCircle} title="No-Show" tone="danger" onClick={() => setConfirmTransition({ appt: a, target: 'No-Show', label: 'Mark as no-show' })} />
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr>
                      <td colSpan={8} className="bg-stone-50 px-6 py-5 anim-slide">
                        <div className="md:hidden flex justify-end mb-3">
                          <button onClick={() => setExpanded(null)}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-100">
                            Close
                          </button>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-5 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
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
        <Paginator total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} label="appointment" />
      </Card>

      <ConfirmDialog
        isOpen={!!confirmTransition}
        title={confirmTransition ? `${confirmTransition.label}?` : ''}
        message={confirmTransition ? `${confirmTransition.appt.customerName} · ${confirmTransition.appt.serviceType} · ${new Date(confirmTransition.appt.when).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : ''}
        confirmLabel={confirmTransition?.target === 'No-Show' ? 'Mark No-Show' : 'Cancel Appointment'}
        cancelLabel="Keep"
        confirmColor="red"
        onConfirm={() => { transition(confirmTransition.appt.id, confirmTransition.target); setConfirmTransition(null); }}
        onCancel={() => setConfirmTransition(null)} />
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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Website Performance</h1>
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
          <div className="flex items-end gap-3 h-64 mt-6">
            {traffic.map((v, i) => {
              const h = (v / maxTraffic) * 100;
              const isToday = i === traffic.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="font-display tabular text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition">{v}</div>
                  <div className="w-full bg-stone-100 rounded-t-md relative overflow-hidden" style={{ height: '224px' }}>
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

/* ====================== TASKS TAB ================================ */

function TasksTab({ tasks, setTasks, leads, sold, flash }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(null);

  const filtered = useMemo(() => {
    const now = new Date(TODAY);
    const today0 = new Date(now); today0.setUTCHours(0, 0, 0, 0);
    return tasks
      .map(t => {
        const due = new Date(t.dueAt);
        const overdue = t.status !== 'Completed' && due < today0;
        return { ...t, _overdue: overdue };
      })
      .filter(t => {
        if (search) {
          const q = search.toLowerCase();
          const hay = [t.title, t.assignedTo, t.relatedTo, t.notes].join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filter === 'open') return t.status === 'Open';
        if (filter === 'overdue') return t._overdue;
        if (filter === 'today') {
          const today1 = new Date(today0); today1.setUTCDate(today1.getUTCDate() + 1);
          const due = new Date(t.dueAt);
          return t.status !== 'Completed' && due >= today0 && due < today1;
        }
        if (filter === 'completed') return t.status === 'Completed';
        return true;
      })
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [tasks, search, filter]);

  const startAdd = () => {
    setDraft({
      title: '', dueAt: isoAt(1, 10), assignedTo: TEAM_MEMBERS[0].name,
      relatedTo: '', priority: 'Medium', status: 'Open', notes: ''
    });
    setShowAdd(true);
  };
  const saveDraft = () => {
    if (!draft.title.trim()) return;
    setTasks(arr => [{ ...draft, id: 'tk-' + Date.now() }, ...arr]);
    setShowAdd(false);
    setDraft(null);
    flash('Task created');
  };
  const completeTask = (id) => {
    setTasks(arr => arr.map(t => t.id === id ? { ...t, status: 'Completed', completedAt: new Date().toISOString() } : t));
  };
  const reopenTask = (id) => {
    setTasks(arr => arr.map(t => t.id === id ? { ...t, status: 'Open', completedAt: null } : t));
  };
  const deleteTask = (id) => {
    const removed = tasks.find(t => t.id === id);
    setTasks(arr => arr.filter(t => t.id !== id));
    flash('Task deleted', { tone: 'destructive', undo: () => removed && setTasks(arr => [removed, ...arr]) });
  };

  const fmtDue = (iso) => {
    const d = new Date(iso);
    const today = new Date(TODAY); today.setUTCHours(0, 0, 0, 0);
    const dd = new Date(d); dd.setUTCHours(0, 0, 0, 0);
    const diff = Math.round((dd - today) / 86400000);
    const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    if (diff === 0) return `Today ${time}`;
    if (diff === 1) return `Tomorrow ${time}`;
    if (diff === -1) return `Yesterday ${time}`;
    if (diff > 0 && diff < 7) return `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${time}`;
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${time}`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Tasks &amp; Follow-Ups</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Stay on top of leads, deal paperwork, and customer follow-ups.</p>
        </div>
        <Btn variant="gold" icon={Plus} onClick={startAdd}>Add Task</Btn>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
          </div>
          <div className="flex bg-stone-100 rounded-md p-0.5 flex-wrap">
            {[['all','All'],['today','Today'],['overdue','Overdue'],['open','Open'],['completed','Done']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded smallcaps ${filter === k ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-[10px] smallcaps font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2.5 w-10"></th>
                <th className="px-3 py-2.5 text-left">Task</th>
                <th className="px-3 py-2.5 text-left">Due</th>
                <th className="px-3 py-2.5 text-left">Assigned</th>
                <th className="px-3 py-2.5 text-left">Related</th>
                <th className="px-3 py-2.5 text-left">Priority</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 px-4">
                  <CheckSquare className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold mb-1">No tasks</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Create a task to track follow-ups, paperwork, and to-dos.</div>
                </td></tr>
              ) : filtered.map(t => {
                const isDone = t.status === 'Completed';
                const priColors = { High: '#DC2626', Medium: '#D97706', Low: '#65A30D' };
                return (
                  <tr key={t.id} className={`themed-row transition ${isDone ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => isDone ? reopenTask(t.id) : completeTask(t.id)}
                        title={isDone ? 'Reopen' : 'Mark complete'}
                        className="flex items-center justify-center">
                        {isDone ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-stone-400 hover:text-emerald-600 transition" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`font-medium ${isDone ? 'line-through' : ''}`}>{t.title}</div>
                      {t.notes && <div className="text-[11px] mt-0.5 truncate max-w-md" style={{ color: 'var(--text-muted)' }}>{t.notes}</div>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[12px] tabular ${t._overdue ? 'font-bold' : ''}`}
                        style={{ color: t._overdue ? '#DC2626' : 'var(--text-secondary)' }}>
                        {t._overdue && '⚠ '}
                        {fmtDue(t.dueAt)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[12px]">{t.assignedTo}</td>
                    <td className="px-3 py-3 text-[12px]">{t.relatedTo || <span className="text-stone-400">—</span>}</td>
                    <td className="px-3 py-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded smallcaps"
                        style={{ backgroundColor: priColors[t.priority] + '22', color: priColors[t.priority] }}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => deleteTask(t.id)} title="Delete"
                        className="p-1.5 text-stone-400 hover:text-red-600 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && draft && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-20 anim-fade no-print" onClick={() => setShowAdd(false)}>
          <div className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold mb-4">Create Task</h3>
              <Field label="Title" required>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g., Call buyer about financing" autoFocus />
              </Field>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Due Date">
                  <Input type="date" value={draft.dueAt.slice(0, 10)}
                    onChange={(e) => {
                      const t = draft.dueAt.slice(11, 19);
                      setDraft({ ...draft, dueAt: e.target.value + 'T' + t + '.000Z' });
                    }} />
                </Field>
                <Field label="Due Time">
                  <Input type="time" value={draft.dueAt.slice(11, 16)}
                    onChange={(e) => {
                      const d = draft.dueAt.slice(0, 10);
                      setDraft({ ...draft, dueAt: d + 'T' + e.target.value + ':00.000Z' });
                    }} />
                </Field>
              </div>
              <Field label="Assigned To" className="mt-3">
                <Select value={draft.assignedTo} onChange={(e) => setDraft({ ...draft, assignedTo: e.target.value })}>
                  {TEAM_MEMBERS.map(m => <option key={m.name} value={m.name}>{m.name} — {m.role}</option>)}
                </Select>
              </Field>
              <Field label="Related to (optional)" className="mt-3" hint="Lead or customer name">
                <Input value={draft.relatedTo} onChange={(e) => setDraft({ ...draft, relatedTo: e.target.value })}
                  placeholder="e.g., Maria Rodriguez" />
              </Field>
              <Field label="Priority" className="mt-3">
                <Select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </Select>
              </Field>
              <Field label="Notes" className="mt-3">
                <Textarea rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </Field>
            </div>
            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
              <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn variant="gold" onClick={saveDraft} disabled={!draft.title.trim()}>Create Task</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== CUSTOMERS TAB ============================ */

function CustomersTab({ leads, sold, appointments, deals, flash }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const customers = useMemo(() => {
    const map = new Map();
    const keyFor = (rec) => (rec.email || '').toLowerCase().trim() || (rec.phone || '').replace(/\D/g, '') || (rec.name || rec.customerName || '').toLowerCase().trim();
    const upsert = (key, data) => {
      const cur = map.get(key) || {
        id: 'cu-' + key.slice(0, 12),
        name: data.name || data.customerName || data.buyerName || 'Unknown',
        email: data.email || data.buyerEmail || '',
        phone: data.phone || data.buyerPhone || '',
        leads: [], sold: [], service: [], deals: [],
        firstSeen: data.when || data.createdAt || data.saleDate || new Date().toISOString(),
        lastSeen:  data.when || data.createdAt || data.saleDate || new Date().toISOString(),
        notes: ''
      };
      if (!cur.email && (data.email || data.buyerEmail)) cur.email = data.email || data.buyerEmail;
      if (!cur.phone && (data.phone || data.buyerPhone)) cur.phone = data.phone || data.buyerPhone;
      const stamp = data.when || data.createdAt || data.saleDate;
      if (stamp) {
        if (new Date(stamp) < new Date(cur.firstSeen)) cur.firstSeen = stamp;
        if (new Date(stamp) > new Date(cur.lastSeen))  cur.lastSeen = stamp;
      }
      map.set(key, cur);
      return cur;
    };
    leads.forEach(l => { const k = keyFor(l); if (!k) return; const c = upsert(k, { name: l.name, email: l.email, phone: l.phone, createdAt: l.createdAt }); c.leads.push(l); });
    sold.forEach(s => { const k = keyFor({ name: s.buyerName, email: s.buyerEmail, phone: s.buyerPhone }); if (!k) return; const c = upsert(k, { name: s.buyerName, email: s.buyerEmail, phone: s.buyerPhone, saleDate: s.saleDate }); c.sold.push(s); });
    appointments.forEach(a => { const k = keyFor(a); if (!k) return; const c = upsert(k, { name: a.customerName, email: a.email, phone: a.phone, when: a.when }); c.service.push(a); });
    deals.forEach(d => { const k = keyFor({ name: d.customerName, email: d.customerEmail, phone: d.customerPhone }); if (!k) return; const c = upsert(k, { name: d.customerName, email: d.customerEmail, phone: d.customerPhone }); c.deals.push(d); });
    return Array.from(map.values()).map(c => ({
      ...c,
      ltv: c.sold.reduce((s, x) => s + (x.salePrice || 0), 0),
      status: c.sold.length > 0 ? 'Active' : (c.leads.length > 0 ? 'Prospect' : (c.service.length > 0 ? 'Service Customer' : 'Other'))
    }));
  }, [leads, sold, appointments, deals]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => [c.name, c.email, c.phone].join(' ').toLowerCase().includes(q));
  }, [customers, search]);

  const fmt$ = (n) => '$' + Math.round(n).toLocaleString();
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const statusColors = {
    'Active':           { bg: '#D1FAE5', fg: '#065F46' },
    'Prospect':         { bg: '#FEF3C7', fg: '#92400E' },
    'Service Customer': { bg: '#E0E7FF', fg: '#3730A3' },
    'Other':            { bg: '#E7E5E4', fg: '#57534E' }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Unified profiles across leads, deals, sales, and service. {customers.length} total.
          </p>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm ring-gold" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-[10px] smallcaps font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2.5 text-left">Name</th>
                <th className="px-3 py-2.5 text-left">Contact</th>
                <th className="px-3 py-2.5 text-right">Vehicles</th>
                <th className="px-3 py-2.5 text-right">Service</th>
                <th className="px-3 py-2.5 text-right">Lifetime $</th>
                <th className="px-3 py-2.5 text-left">First Contact</th>
                <th className="px-3 py-2.5 text-left">Last Activity</th>
                <th className="px-3 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 px-4">
                  <BadgeCheck className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />
                  <div className="font-display text-lg font-semibold mb-1">No customers found</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Customers are auto-built from leads, deals, sales, and service appointments.</div>
                </td></tr>
              ) : filtered.map(c => {
                const sc = statusColors[c.status];
                return (
                  <React.Fragment key={c.id}>
                    <tr onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                      className={`cursor-pointer transition themed-row ${expanded === c.id ? 'bg-stone-50' : ''}`}>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-3 py-3">
                        <div className="text-[12px]">{c.email || <span className="text-stone-400">no email</span>}</div>
                        <div className="text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{c.phone}</div>
                      </td>
                      <td className="px-3 py-3 text-right tabular">{c.sold.length}</td>
                      <td className="px-3 py-3 text-right tabular">{c.service.length}</td>
                      <td className="px-3 py-3 text-right tabular font-semibold" style={{ color: c.ltv > 0 ? GOLD : 'var(--text-muted)' }}>
                        {c.ltv > 0 ? fmt$(c.ltv) : '—'}
                      </td>
                      <td className="px-3 py-3 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{fmtDate(c.firstSeen)}</td>
                      <td className="px-3 py-3 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>{fmtDate(c.lastSeen)}</td>
                      <td className="px-3 py-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full smallcaps"
                          style={{ backgroundColor: sc.bg, color: sc.fg }}>{c.status}</span>
                      </td>
                    </tr>
                    {expanded === c.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-5" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <div className="grid lg:grid-cols-3 gap-4">
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Vehicles purchased</div>
                              {c.sold.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No purchases yet.</div> : c.sold.map(s => (
                                <div key={s.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{s.year} {s.make} {s.model}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(s.saleDate)} · {fmt$(s.salePrice)}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Lead history</div>
                              {c.leads.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No leads.</div> : c.leads.map(l => (
                                <div key={l.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{l.source}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(l.createdAt)} · {l.vehicleLabel}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4">
                              <div className="text-[10px] smallcaps font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Service history</div>
                              {c.service.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No appointments.</div> : c.service.map(s => (
                                <div key={s.id} className="text-sm py-1 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                                  <div className="font-medium">{s.serviceType}</div>
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fmtDate(s.when)} · ${s.estimate}</div>
                                </div>
                              ))}
                            </Card>
                            <Card className="p-4 lg:col-span-3">
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Lifetime Value</div>
                                  <div className="font-display text-2xl tabular font-semibold" style={{ color: GOLD }}>{fmt$(c.ltv)}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Touchpoints</div>
                                  <div className="font-display text-2xl tabular font-semibold">{c.leads.length + c.sold.length + c.service.length + c.deals.length}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] smallcaps font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Customer Since</div>
                                  <div className="font-display text-2xl tabular font-semibold">{fmtDate(c.firstSeen)}</div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ====================== REPORTING TAB ============================ */

function ReportingTab({ inventory, sold, leads }) {
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  const monthlyUnits = [8, 6, 9, 7, 11, 10];
  const monthlyGross = [38400, 28200, 41700, 32500, 52400, 47200];
  const maxUnits = Math.max(...monthlyUnits);
  const maxGross = Math.max(...monthlyGross);

  const ageBuckets = useMemo(() => {
    const a = { fresh: 0, mid: 0, old: 0 };
    inventory.forEach(v => {
      if (v.daysOnLot < 31) a.fresh++;
      else if (v.daysOnLot < 61) a.mid++;
      else a.old++;
    });
    return a;
  }, [inventory]);
  const totalAge = ageBuckets.fresh + ageBuckets.mid + ageBuckets.old || 1;

  const salespeople = [
    { name: 'Carlos Rivera',  sold: 5, gross: 24500, close: 0.22 },
    { name: 'James Mitchell', sold: 3, gross: 14100, close: 0.15 },
    { name: 'Maria Santos',   sold: 2, gross: 13800, close: 0.10, note: '(F&I)' }
  ];

  const fmt$ = (n) => '$' + Math.round(n).toLocaleString();

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Reporting</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sales performance, gross profit, inventory aging, and team metrics.</p>
        </div>
        <Btn variant="default" icon={Download} onClick={() => alert('PDF export — wired in production via @react-pdf/renderer.')}>Export PDF</Btn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Avg Days to Sell" value="28d" icon={Clock} sub="industry avg: 38" />
        <StatCard label="Avg Gross / Unit" value={fmt$(4850)} icon={DollarSign} accent={GOLD} />
        <StatCard label="Lead → Sale Rate" value="18%" icon={TrendingUp} accent="#2F7A4A" sub="↑ 2.4% MoM" />
        <StatCard label="Avg Response Time" value="12 min" icon={Zap} sub="industry avg: 47 min" />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-display text-lg font-semibold">Sales Performance — Last 6 Months</h3>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1" style={{ backgroundColor: GOLD }} /> Units
            <span className="inline-block w-3 h-3 rounded-sm align-middle ml-3 mr-1" style={{ backgroundColor: '#2F7A4A' }} /> Gross profit
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end gap-3 h-56" style={{ borderBottom: '1px solid var(--border)' }}>
            {months.map((m, i) => {
              const u = monthlyUnits[i];
              const g = monthlyGross[i];
              const uH = Math.round((u / maxUnits) * 200);
              const gY = 200 - Math.round((g / maxGross) * 200);
              return (
                <div key={m} className="flex-1 flex flex-col items-center justify-end relative">
                  <div className="absolute text-[10px] font-bold tabular -translate-y-5"
                    style={{ bottom: uH + 'px', color: GOLD }}>{u}</div>
                  <div className="w-full rounded-t" style={{ height: uH + 'px', backgroundColor: GOLD }} />
                  <div className="absolute w-2 h-2 rounded-full"
                    style={{ bottom: (200 - gY) + 'px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2F7A4A' }} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2 text-[11px] tabular" style={{ color: 'var(--text-muted)' }}>
            {months.map(m => <div key={m} className="flex-1 text-center">{m}</div>)}
          </div>
          <div className="mt-4 p-3 rounded-md text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <strong>Best month: March</strong> — 11 units, $52,400 gross
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-display text-lg font-semibold">By Salesperson — This Month</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] smallcaps font-semibold" style={{ color: 'var(--text-muted)' }}>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-right">Sold</th>
                <th className="px-3 py-2 text-right">Gross</th>
                <th className="px-3 py-2 text-right">Close Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {salespeople.map(p => (
                <tr key={p.name}>
                  <td className="px-4 py-3 font-medium">{p.name} {p.note && <span className="text-[10px] text-stone-400">{p.note}</span>}</td>
                  <td className="px-3 py-3 text-right tabular">{p.sold}</td>
                  <td className="px-3 py-3 text-right tabular font-semibold">{fmt$(p.gross)}</td>
                  <td className="px-3 py-3 text-right tabular">{(p.close * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold mb-4">Inventory Age Distribution</h3>
          <div className="flex items-center gap-6 flex-wrap">
            <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E7E5E4" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.fresh / totalAge) * 100} 100`} strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#D97706" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.mid / totalAge) * 100} 100`}
                strokeDashoffset={`${-((ageBuckets.fresh / totalAge) * 100)}`} />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#DC2626" strokeWidth="4"
                strokeDasharray={`${(ageBuckets.old / totalAge) * 100} 100`}
                strokeDashoffset={`${-(((ageBuckets.fresh + ageBuckets.mid) / totalAge) * 100)}`} />
            </svg>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10B981' }} /> 0–30 days: <strong>{ageBuckets.fresh}</strong></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D97706' }} /> 31–60 days: <strong>{ageBuckets.mid}</strong></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#DC2626' }} /> 60+ days: <strong>{ageBuckets.old}</strong></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

