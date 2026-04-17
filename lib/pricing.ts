/**
 * pricing.ts — Central source of truth for all tier metadata and Square payment links.
 * Update this file whenever pricing changes or Square links are regenerated.
 *
 * Architecture: pricing.ts is the single source of truth for PRICING + SQUARE LINKS only.
 * lib/services-data.ts holds marketing copy (features, timeline, includes, fitBullets) keyed
 * by the same slugs. Both files coexist — components can import from either as needed.
 * Do NOT duplicate copy from services-data.ts here.
 *
 * Note: Monthly links were created via Square UI and are not returned by the
 * Payment Links API — long URLs resolved by following redirects on short URLs.
 */

export type Tier = {
  slug: string;
  name: string;
  tagline: string;
  setupFee: number;
  monthlyFee: number;
  setupLinkShort: string;
  setupLinkLong: string;
  setupLinkId: string;       // only available for API-created links
  monthlyLinkShort: string;
  monthlyLinkLong: string;
  monthlyLinkId: string;     // only available for API-created links
  popular?: boolean;
  features: string[];
};

export const TIERS: Tier[] = [
  {
    slug: 'presence',
    name: 'Presence',
    tagline: 'Get found online',
    setupFee: 39,
    monthlyFee: 99,
    setupLinkShort: 'https://square.link/u/vIhHdVt7',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/4ZAIDGQR5MAIVCZWWGKODOM6',
    setupLinkId: '',
    monthlyLinkShort: 'https://square.link/u/w7cNLsU1',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/V3YMPG3KCU2WBR6TVKHRG3ZZ',
    monthlyLinkId: '',
    features: [
      'Professional website (5 pages)',
      'Local SEO + Google Business Profile',
      'Basic AI inquiry assistant',
      'Monthly performance report',
    ],
  },
  {
    slug: 'growth',
    name: 'Growth',
    tagline: 'Turn visitors into leads',
    setupFee: 59,
    monthlyFee: 149,
    setupLinkShort: 'https://square.link/u/6XdMcNz1',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/order/tttbgN76YnwABZm68iUQnONxBITZY',
    setupLinkId: 'VLZVJSYXKN3B3KD4',
    monthlyLinkShort: 'https://square.link/u/HA9aJUJ3',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/AAU7Z73OQAID3NKACN3NRREY',
    monthlyLinkId: '',
    features: [
      'Everything in Presence',
      'AI automation & smart assistant',
      'Email marketing + welcome sequence',
      'SEO content (2 articles/month)',
      'Conversion-optimized landing page',
    ],
  },
  {
    slug: 'revenue-engine',
    name: 'Revenue Engine',
    tagline: 'Automate your sales process',
    setupFee: 99,
    monthlyFee: 299,
    setupLinkShort: 'https://square.link/u/nS2lnfhf',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/order/TIrGr9kjnSvHZUmpbonpPb5njMfZY',
    setupLinkId: 'R5TCDCXYIUABP3TA',
    monthlyLinkShort: 'https://square.link/u/LtnBQwkx',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/DJDCDH57E74WKIXDU62MKAZE',
    monthlyLinkId: '',
    popular: true,
    features: [
      'Everything in Growth',
      'Full sales funnel design & build',
      'Workflow automation & integration',
      'Paid ads setup (Google or Meta)',
      'AI-powered CRM integration',
      'Monthly strategy call with David',
    ],
  },
  {
    slug: 'ai-first',
    name: 'AI-First',
    tagline: 'Replace manual work with AI',
    setupFee: 199,
    monthlyFee: 349,
    setupLinkShort: 'https://square.link/u/SX61e3sM',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/order/FXgds7Q5ShNwhZ3EJh4bFiVot2GZY',
    setupLinkId: 'CALS4LNOOOIRKJGH',
    monthlyLinkShort: 'https://square.link/u/rLr5EylX',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/OU4GK2ZLA55RKCKBSSHQYJUY',
    monthlyLinkId: '',
    features: [
      'Everything in Revenue Engine',
      'Advanced AI automation pipelines',
      'Voice AI (answering + booking)',
      'Programmatic SEO at scale',
      'Social media AI scheduling',
      'Full analytics dashboard',
    ],
  },
  {
    slug: 'ai-automation-starter',
    name: 'AI Automation Starter',
    tagline: 'Your first AI system — handle inquiries 24/7',
    setupFee: 99,
    monthlyFee: 99,
    setupLinkShort: 'https://square.link/u/jmjUQOOc',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/order/Z7RtPJIifuJBOT3VdkmOHWDrHeGZY',
    setupLinkId: '4VUKHAXKQEC2EAFO',
    monthlyLinkShort: 'https://square.link/u/yXsIx0aS',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/JLUTDJWBJVGMSRT3UIUXPQKD',
    monthlyLinkId: '',
    features: [
      'Custom AI chatbot trained on your business',
      'Books calls to your calendar',
      'Lead qualification via AI',
      'CRM integration',
      'Monthly updates included',
    ],
  },
  {
    slug: 'consulting',
    name: 'Consulting',
    tagline: 'Know exactly where to start',
    setupFee: 99,
    monthlyFee: 199,
    setupLinkShort: 'https://square.link/u/QBiFkWgk',
    setupLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/order/3iP48Rm06IOJz4eJ4rQ8D3S99FMZY',
    setupLinkId: 'KHQJJWZ4JZMDT7JW',
    monthlyLinkShort: 'https://square.link/u/PL0z3B2T',
    monthlyLinkLong: 'https://checkout.square.site/merchant/MLTDBEPZS805X/checkout/2A27LH5ZQGWEDG5YPZF27DHH',
    monthlyLinkId: '',
    features: [
      'AI readiness audit',
      'Digital transformation roadmap',
      'Tool stack recommendations',
      'Staff AI training & workshops',
      'Fractional AI advisor (ongoing)',
    ],
  },
];

/** Helper: look up a tier by slug */
export function getTier(slug: string): Tier | undefined {
  return TIERS.find(t => t.slug === slug);
}
