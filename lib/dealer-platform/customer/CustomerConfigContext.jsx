'use client';
import { createContext, useContext } from 'react';

/**
 * CustomerConfigContext — provides the merged dealer config to every
 * customer-site component without prop drilling. Anywhere in the tree, call
 * useCustomerConfig() to read dealer name, phone, address, colors, features,
 * etc.
 *
 * Default value matches the shape of `defaultConfig` from
 * lib/dealer-platform/config/default-config.js so consumers can safely
 * destructure even if rendered without a provider.
 */
export const CustomerConfigContext = createContext({
  dealerName: 'Demo Auto Group',
  phone: '(555) 555-0100',
  email: 'sales@demo.example',
  address: { street: '', city: '', state: '', zip: '' },
  colors: { primary: '#D4AF37', accent: '#FF1F2D' },
  features: {},
  poweredBy: { name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
});

export const useCustomerConfig = () => useContext(CustomerConfigContext);
