/**
 * Default configuration template for any dealer using the platform.
 * Each dealer creates their own config that spreads ...defaultConfig and overrides.
 *
 * Every component in lib/dealer-platform/ accepts a `config` prop or reads from
 * a context, so all dealer-specific values live here — never hardcoded.
 */
export const defaultConfig = {
  // ---------- Dealer identity ----------
  dealerName: 'Demo Auto Group',
  dealerSlug: 'demo',
  tagline: 'Your trusted pre-owned dealer',
  subtitle: 'Quality vehicles. Fair prices. No surprises.',
  phone: '(555) 555-0100',
  email: 'sales@demo.example',
  address: { street: '', city: '', state: '', zip: '', lat: 25.7617, lng: -80.1918 },
  hours: {
    monFri: '9:00 AM - 8:00 PM',
    sat: '9:00 AM - 8:00 PM',
    sun: '10:00 AM - 6:00 PM',
  },

  // ---------- Branding ----------
  colors: {
    primary: '#D4AF37',  // gold
    accent:  '#E8272C',  // red
    bgDark:  '#0a0a0a',
    bgLight: '#FFFFFF',
  },
  logo: null,

  // ---------- Feature toggles ----------
  features: {
    chatWidget:         true,
    buildYourDeal:      true,
    tradeIn:            true,
    financePreApproval: true,
    serviceScheduling:  true,
    reserveVehicle:     true,
    comparison:         true,
    savedVehicles:      true,
    inventoryAlerts:    true,
    priceMatch:         true,
    homeDelivery:       true,
    espanol:            true,
    darkMode:           true,
    accessibility:      true,
    videoWalkaround:    true,
    qrCodes:            true,
    blog:               false,
  },

  // ---------- EspoCRM integration ----------
  espocrm: {
    url:               '',
    apiKey:            '',
    vehicleEntity:     'CVehicle',
    leadEntity:        'Lead',
    serviceEntity:     'CServiceAppointment',
    reservationEntity: 'CVehicleReservation',
  },

  // ---------- Third-party integrations ----------
  integrations: {
    twilioEnabled: false,
    resendEnabled: false,
    googlePlaceId: '',
    googleApiKey:  '',
    googleMapsKey: '',
    marketcheckKey: '',
    marketcheck: {
      enabled:         false,
      apiKey:          '',
      refreshInterval: 'daily', // 'daily' | 'weekly' | 'manual'
      radius:          100,     // miles for comp search
    },
  },

  // ---------- Warranty tiers ----------
  warranty: {
    standard:  { name: 'Standard',                duration: '90 days / 3,000 miles',   price: 0    },
    certified: { name: 'Certified Pre-Owned',     duration: '1 year / 12,000 miles',   price: 999  },
    extended:  { name: 'Extended',                duration: '3 years / 36,000 miles',  price: 1899 },
  },

  // ---------- Team members (Sales / Finance / Service) ----------
  team: [
    { name: 'Carlos Rivera',  role: 'Sales' },
    { name: 'Maria Santos',   role: 'Finance' },
    { name: 'James Mitchell', role: 'Sales' },
    { name: 'Ana Gutierrez',  role: 'Service Advisor' },
  ],

  // ---------- F&I products ----------
  fiProducts: [
    { key: 'extWarranty',     name: 'Extended Warranty', price: 1200, monthly: 22 },
    { key: 'paint',           name: 'Paint Protection',  price: 599,  monthly: 11 },
    { key: 'tint',            name: 'Window Tint',       price: 299,  monthly: 5  },
    { key: 'gap',             name: 'GAP Insurance',     price: 495,  monthly: 9  },
    { key: 'wheelLock',       name: 'Wheel & Tire',      price: 449,  monthly: 8  },
    { key: 'maintPlan',       name: 'Pre-Paid Maintenance', price: 875, monthly: 16 },
  ],

  // ---------- Credit tiers (APR % by tier) ----------
  creditTiers: {
    Excellent:   3.9,
    Good:        5.9,
    Fair:        8.9,
    Rebuilding: 12.9,
  },

  // ---------- Powered-by branding (white-label this only when relevant) ----------
  poweredBy: {
    name: 'AIandWEBservices',
    url:  'https://www.aiandwebservices.com',
  },
};
