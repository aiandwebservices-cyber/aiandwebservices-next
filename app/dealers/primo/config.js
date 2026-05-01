import { defaultConfig } from '@/lib/dealer-platform/config/default-config';

export const config = {
  ...defaultConfig,
  dealerName: 'Primo Auto Group',
  dealerSlug: 'primo',
  tagline:    "Miami's Premier Pre-Owned Dealership",
  subtitle:   'Luxury for Less. No Games. No Hidden Fees.',
  phone:      '(305) 555-0199',
  email:      'sales@primoautogroup.com',
  address:    { street: '8420 NW 27th Ave', city: 'Miami', state: 'FL', zip: '33147' },
  hours: {
    monFri: '9:00 AM - 8:00 PM',
    sat:    '10:00 AM - 6:00 PM',
    sun:    '11:00 AM - 5:00 PM',
  },
  colors: {
    ...defaultConfig.colors,
    primary: '#D4AF37',  // gold
    accent:  '#FF1F2D',  // racing red
    bgDark:  '#08080A',
  },
  espocrm: {
    ...defaultConfig.espocrm,
    url:    'http://localhost:8081',
    apiKey: '7190e14d23e6ca8d68a5d2b29c91e55e',
  },
  features: {
    ...defaultConfig.features,
    blog: false,  // blog hidden for Primo
  },
};
