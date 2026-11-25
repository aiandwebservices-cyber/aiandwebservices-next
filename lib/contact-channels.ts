/** Contact details published on the contact page, footer, and Cal.com embeds. */
export const MEETING_PATH = 'aiandwebservices/30min';
export const MEETING_URL = 'https://cal.com/aiandwebservices/30min';
export const MEETING_MINUTES = 30;

export const CONTACT_EMAIL = 'david@aiandwebservices.com';
export const CONTACT_PHONE_DISPLAY = '(315) 572-0710';
export const CONTACT_PHONE_TEL = '+13155720710';

/** Telegram link on the contact page. */
export const CONTACT_TELEGRAM_URL = 'https://t.me/aiandwebservices';
export const CONTACT_TELEGRAM_HANDLE = '@aiandwebservices';

/** Telegram link in the site footer. The path differs from the contact page. */
export const FOOTER_TELEGRAM_URL = 'https://t.me/aiandwebservice';
export const FOOTER_TELEGRAM_LABEL = '@aiandwebservices on Telegram';

export const RESPONSE_GUARANTEE = 'David personally responds within 6 hours.';

export const CONTACT_SERVICE_OPTIONS = [
  'AI Automation (lead capture, chatbots, workflows)',
  'Website & Design (redesign, conversion optimization)',
  'SEO (rankings, traffic, visibility)',
  'Full Package (AI + Website + SEO)',
  'Strategy Consulting (roadmap, audit)',
  "Not sure yet (let's explore)",
] as const;

export type ContactServiceOption = (typeof CONTACT_SERVICE_OPTIONS)[number];
