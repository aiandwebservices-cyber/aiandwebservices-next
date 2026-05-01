import { defaultConfig } from '@/lib/dealer-platform/config/default-config';

export const config = {
  ...defaultConfig,
  dealerName: 'Sunshine Motors',
  dealerSlug: 'sunshine-motors',
  tagline:    "Tampa Bay's Trusted Pre-Owned Dealer",
  subtitle:   'Family-owned since 1998. No-haggle pricing.',
  phone:      '(813) 555-0299',
  email:      'sales@sunshinemotors.example',
  address:    { street: '456 Dale Mabry Hwy', city: 'Tampa', state: 'FL', zip: '33609' },
  hours: {
    monFri: '8:30 AM - 7:00 PM',
    sat:    '9:00 AM - 6:00 PM',
    sun:    'Closed',
  },
  colors: {
    ...defaultConfig.colors,
    primary: '#2196F3',  // sunny blue
    accent:  '#FF5722',  // sunset orange
    bgDark:  '#0F1419',
  },
  espocrm: {
    ...defaultConfig.espocrm,
    url:    '',
    apiKey: '',
  },
  features: {
    ...defaultConfig.features,
    chatWidget: false,  // disabled until they're ready
    blog:       false,
  },
  team: [
    { name: 'Tony Russo',     role: 'Sales' },
    { name: 'Sarah Whitman',  role: 'Finance' },
    { name: 'Diego Hernandez',role: 'Sales' },
    { name: 'Pat Lin',        role: 'Service Advisor' },
  ],
  poweredBy: {
    name: 'AIandWEBservices',
    url:  'https://www.aiandwebservices.com',
  },
};
