import { addOnsContent } from '../../content/tiers/add-ons.ts';
import { aiFirstContent } from '../../content/tiers/ai-first.ts';
import { consultingContent } from '../../content/tiers/consulting.ts';
import { growthContent } from '../../content/tiers/growth.ts';
import { presenceContent } from '../../content/tiers/presence.ts';
import { revenueEngineContent } from '../../content/tiers/revenue-engine.ts';
import { starterContent } from '../../content/tiers/ai-automation-starter.ts';
import { COMPARE_TIER_ORDER, FEATURE_ROWS, GROUP_ORDER } from '../comparison.ts';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_TELEGRAM_HANDLE,
  CONTACT_TELEGRAM_URL,
  FOOTER_TELEGRAM_LABEL,
  FOOTER_TELEGRAM_URL,
  MEETING_MINUTES,
  MEETING_PATH,
  MEETING_URL,
  RESPONSE_GUARANTEE,
} from '../contact-channels.ts';
import { GUARANTEE } from '../guarantee-content.ts';
import { HOMEPAGE_FAQS, SCHEMA_FAQS } from '../homepage-faq.ts';
import { getTier, TIERS } from '../pricing.ts';
import { COLONY_FAQS, COLONY_HERO, COLONY_INCLUDED, COLONY_STEPS, COLONY_VIEWS, COLONY_WHO } from '../product-colony.ts';

const ORIGIN = 'https://www.aiandwebservices.com';

type TierCopy = {
  metaTitle: string;
  metaDescription: string;
  deliveryTime?: string;
  hero: { eyebrow: string; headline: string; headlineAccent: string; subheadline: string };
  features: { name: string; description: string }[];
  setupIncludes: string[];
  monthlyIncludes: string[];
  builtForYouIf?: string[];
  faq?: { q: string; a: string }[];
  timeline?: { label?: string; heading?: string; description?: string }[];
};

const TIER_COPY: Record<string, TierCopy> = {
  'ai-automation-starter': starterContent,
  presence: presenceContent,
  growth: growthContent,
  'revenue-engine': revenueEngineContent,
  'ai-first': aiFirstContent,
  consulting: consultingContent,
};

const SERVICE_ORDER = ['ai-automation-starter', 'presence', 'growth', 'revenue-engine', 'ai-first', 'consulting', 'add-ons'] as const;

function page(path: string) {
  return `${ORIGIN}${path}`;
}

function tierPrice(slug: string) {
  const tier = getTier(slug);
  if (!tier) return {};
  return {
    setup_fee: tier.setupFee,
    monthly_fee: tier.monthlyFee,
    setup_url: tier.setupLinkLong,
    setup_url_short: tier.setupLinkShort,
    monthly_url: tier.monthlyLinkLong,
    monthly_url_short: tier.monthlyLinkShort,
    currency: 'USD',
  };
}

export function listServices() {
  return {
    services: SERVICE_ORDER.map((slug) => {
      const full = getService(slug);
      return {
        slug,
        name: full.name,
        summary: full.summary,
        url: full.url,
        setup_fee: full.setup_fee ?? null,
        monthly_fee: full.monthly_fee ?? null,
        starting_price: full.starting_price ?? null,
      };
    }),
  };
}

export function getService(slug: string): Record<string, unknown> {
  if (slug === 'add-ons') {
    return {
      slug,
      name: 'Add-Ons',
      summary: addOnsContent.hero.subheadline,
      url: page('/services/add-ons'),
      offers: addOnsContent.addOns.map((addon) => ({
        slug: addon.slug,
        name: addon.name,
        tagline: addon.tagline,
        description: addon.description,
        setup_fee: addon.setupFee,
        monthly_fee: addon.monthlyFee,
        includes: addon.includes,
        faq: addon.faq,
      })),
    };
  }
  const copy = TIER_COPY[slug];
  if (!copy) return { error: 'not_found', message: 'Unknown service.' };
  const price = tierPrice(slug);
  return {
    slug,
    name: copy.hero.eyebrow,
    summary: copy.hero.subheadline,
    headline: `${copy.hero.headline} ${copy.hero.headlineAccent}`.trim(),
    delivery_time: copy.deliveryTime ?? null,
    url: page(`/services/${slug}`),
    ...price,
    ...(slug === 'consulting' ? { starting_price: consultingContent.startingPrice } : {}),
    features: copy.features.map((f) => ({ name: f.name, description: f.description })),
    setup_includes: copy.setupIncludes,
    monthly_includes: copy.monthlyIncludes,
    fit: copy.builtForYouIf ?? [],
    timeline: copy.timeline ?? [],
    faq: copy.faq ?? [],
  };
}

export function getComparison() {
  return {
    url: page('/services/compare'),
    rows: FEATURE_ROWS,
    groups: GROUP_ORDER,
    tiers: COMPARE_TIER_ORDER.map((slug) => {
      const tier = getTier(slug);
      return {
        slug,
        name: tier?.name ?? slug,
        setup_fee: tier?.setupFee ?? null,
        monthly_fee: tier?.monthlyFee ?? null,
        url: page(`/services/${slug}`),
      };
    }),
  };
}

export function getPricing() {
  return {
    currency: 'USD',
    tiers: TIERS.map((tier) => ({
      slug: tier.slug,
      name: tier.name,
      tagline: tier.tagline,
      setup_fee: tier.setupFee,
      monthly_fee: tier.monthlyFee,
      setup_url: tier.setupLinkLong,
      setup_url_short: tier.setupLinkShort,
      monthly_url: tier.monthlyLinkLong,
      monthly_url_short: tier.monthlyLinkShort,
      popular: Boolean(tier.popular),
      features: tier.features,
      url: page(`/services/${tier.slug}`),
    })),
    add_ons: addOnsContent.addOns.map((addon) => ({
      slug: addon.slug,
      name: addon.name,
      setup_fee: addon.setupFee,
      monthly_fee: addon.monthlyFee,
      url: page('/services/add-ons'),
    })),
    consulting: {
      slug: 'consulting',
      name: consultingContent.hero.eyebrow,
      starting_price: consultingContent.startingPrice,
      url: page('/services/consulting'),
    },
  };
}

export function getOffers() {
  const pricing = getPricing();
  return {
    tiers: pricing.tiers.map((tier) => ({
      slug: tier.slug,
      name: tier.name,
      setup_fee: tier.setup_fee,
      monthly_fee: tier.monthly_fee,
      setup_url: tier.setup_url,
      monthly_url: tier.monthly_url,
    })),
    add_ons: pricing.add_ons,
    consulting: pricing.consulting,
  };
}

export function getProduct() {
  return {
    name: 'Colony',
    ...COLONY_HERO,
    who: COLONY_WHO,
    views: COLONY_VIEWS,
    steps: COLONY_STEPS,
    faqs: COLONY_FAQS,
    included_with: COLONY_INCLUDED.map((row) => ({
      plan: row.plan,
      slug: row.slug,
      monthly_fee_on_this_page: row.monthlyFee,
      monthly_fee_on_pricing_pages: getTier(row.slug)?.monthlyFee ?? null,
    })),
    meeting_url: MEETING_URL,
  };
}

export function getGuarantee() {
  return { ...GUARANTEE };
}

export function getContactChannels() {
  return {
    email: CONTACT_EMAIL,
    phone_display: CONTACT_PHONE_DISPLAY,
    phone_tel: CONTACT_PHONE_TEL,
    telegram_contact_page: CONTACT_TELEGRAM_URL,
    telegram_handle_contact_page: CONTACT_TELEGRAM_HANDLE,
    telegram_footer: FOOTER_TELEGRAM_URL,
    telegram_footer_label: FOOTER_TELEGRAM_LABEL,
    response: RESPONSE_GUARANTEE,
    contact_url: page('/contact'),
    form_url: page('/forms/contact'),
  };
}

export function getMeetingLink() {
  return {
    url: MEETING_URL,
    cal_link: MEETING_PATH,
    minutes: MEETING_MINUTES,
    note: '30 minutes. No sales pitch. Time zone on the contact page: EST.',
  };
}

type FaqHit = { question: string; answer: string; source: string };

function allFaqs(): FaqHit[] {
  const hits: FaqHit[] = [];
  for (const faq of HOMEPAGE_FAQS) hits.push({ question: faq.q, answer: faq.a, source: page('/#faq') });
  for (const faq of SCHEMA_FAQS) hits.push({ question: faq.q, answer: faq.a, source: page('/#faq') });
  for (const slug of Object.keys(TIER_COPY)) {
    for (const faq of TIER_COPY[slug].faq ?? []) {
      hits.push({ question: faq.q, answer: faq.a, source: page(`/services/${slug}`) });
    }
  }
  for (const addon of addOnsContent.addOns) {
    for (const faq of addon.faq) hits.push({ question: faq.q, answer: faq.a, source: page('/services/add-ons') });
  }
  for (const faq of COLONY_FAQS) hits.push({ question: faq.question, answer: faq.answer, source: page('/product/colony') });
  return hits;
}

export function searchFaq(q?: unknown) {
  const words = typeof q === 'string' ? q.toLowerCase().split(/\W+/).filter((w) => w.length > 2).slice(0, 8) : [];
  const all = allFaqs();
  const results = words.length
    ? all.filter((faq) => words.some((word) => `${faq.question} ${faq.answer}`.toLowerCase().includes(word)))
    : all;
  return { results, faq_url: page('/#faq') };
}

export const SITE = {
  name: 'AIandWEBservices',
  url: ORIGIN,
  summary: 'AI chatbots, automation, websites, and SEO for small business — built personally by David Pulis. No agency markup. Free audit in 30 minutes.',
};
