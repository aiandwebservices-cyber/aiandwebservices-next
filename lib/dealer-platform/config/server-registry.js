/**
 * Server-side dealer config registry.
 * Maps dealerSlug → full config object for use in Server Components and
 * API route handlers that need display data (name, address, features).
 *
 * Add new entries here when onboarding a new dealer.
 */
import { config as lotcrmConfig } from '@/app/dealers/lotcrm/config';
import { config as sunshinemotorsConfig } from '@/app/dealers/sunshine-motors/config';

const REGISTRY = {
  'lotcrm':          lotcrmConfig,
  'primo':           lotcrmConfig,  // primo redirects to lotcrm
  'sunshine-motors': sunshinemotorsConfig,
};

export function getFullDealerConfig(dealerId) {
  return REGISTRY[dealerId] ?? null;
}
