/**
 * Schema.jsx — JSON-LD structured data components for AIandWEBservices
 *
 * Usage:
 *   import { OrganizationSchema, LocalBusinessSchema,
 *            HomepageFAQSchema, HomepageServiceSchema,
 *            BlogPostingSchema } from '@/components/Schema';
 *
 * All components render a <script type="application/ld+json"> tag.
 * Safe in both server components and 'use client' components.
 */

// ─── Shared data ──────────────────────────────────────────────────────────────

const ORG = {
  '@type': 'Organization',
  '@id': 'https://www.aiandwebservices.com/#organization',
  name: 'AIandWEBservices',
  url: 'https://www.aiandwebservices.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.aiandwebservices.com/logo-gradient-test.svg',
    width: 260,
    height: 52,
  },
  founder: { '@type': 'Person', name: 'David Pulis', jobTitle: 'Founder & AI Systems Specialist' },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'david@aiandwebservices.com',
    telephone: '+1-315-572-0710',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  sameAs: ['https://t.me/aiandwebservices'],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function SchemaScript({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── 1. Organization — include on every page via layout ───────────────────────

export function OrganizationSchema() {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        ...ORG,
      }}
    />
  );
}

// ─── 2. LocalBusiness — homepage only ─────────────────────────────────────────

export function LocalBusinessSchema() {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': 'https://www.aiandwebservices.com/#localbusiness',
        name: 'AIandWEBservices',
        url: 'https://www.aiandwebservices.com',
        description:
          'AIandWEBservices builds AI automation systems, intelligent chatbots, high-converting websites, SEO strategies, and automated marketing pipelines for small and mid-sized businesses. Personal service by David Pulis.',
        telephone: '+1-315-572-0710',
        email: 'david@aiandwebservices.com',
        founder: { '@type': 'Person', name: 'David Pulis' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Miami',
          addressRegion: 'FL',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '25.7617',
          longitude: '-80.1918',
        },
        areaServed: { '@type': 'Country', name: 'United States' },
        priceRange: '$$',
        slogan: 'Intelligent solutions. Personal service.',
        paymentAccepted: ['Credit Card', 'Bank Transfer', 'Cryptocurrency'],
        logo: 'https://www.aiandwebservices.com/logo-gradient-test.svg',
        image: 'https://www.aiandwebservices.com/og-image.jpg',
        sameAs: ['https://t.me/aiandwebservices'],
      }}
    />
  );
}

// ─── 3. Service schemas — one per pricing tier, homepage ──────────────────────

const SERVICES = [
  {
    name: 'AI Automation Starter',
    description:
      'A custom AI automation and smart assistant system trained on your business. Handles enquiries, qualifies leads, books calls, and answers FAQs — 24/7, without you.',
    url: 'https://www.aiandwebservices.com/services/ai-automation',
    offers: { price: '997', priceCurrency: 'USD', priceSpecification: 'One-time setup, then $97/month' },
  },
  {
    name: 'Presence Package',
    description:
      'Professional website, local SEO, Google Business Profile optimisation, and a basic AI inquiry assistant. The foundation every small business needs to get found online.',
    url: 'https://www.aiandwebservices.com/#pricing',
    offers: { price: '297', priceCurrency: 'USD', priceSpecification: '$297/month + $997 one-time setup' },
  },
  {
    name: 'Growth Package',
    description:
      'AI automation, email marketing, SEO content, and a conversion-optimised landing page. For established businesses ready to generate consistent leads.',
    url: 'https://www.aiandwebservices.com/#pricing',
    offers: { price: '597', priceCurrency: 'USD', priceSpecification: '$597/month + $2,497 one-time setup' },
  },
  {
    name: 'Revenue Engine Package',
    description:
      'Full sales funnel, workflow automation, paid ads setup, and AI-powered CRM integration. For businesses serious about scaling revenue without scaling headcount.',
    url: 'https://www.aiandwebservices.com/#pricing',
    offers: { price: '997', priceCurrency: 'USD', priceSpecification: '$997/month + $3,997 one-time setup' },
  },
  {
    name: 'AI-First Package',
    description:
      'Advanced AI automation pipelines, voice AI, programmatic SEO, social media AI scheduling, and a full analytics dashboard.',
    url: 'https://www.aiandwebservices.com/#pricing',
    offers: { price: '1497', priceCurrency: 'USD', priceSpecification: '$1,497/month + $5,497 one-time setup' },
  },
  {
    name: 'AI & Digital Strategy Consulting',
    description:
      'AI readiness audit, digital transformation roadmap, tool stack recommendations, and staff AI training. Know exactly where to start before committing to a full build.',
    url: 'https://www.aiandwebservices.com/services/consulting-strategy',
    offers: { price: '497', priceCurrency: 'USD', priceSpecification: '$497 one-time, or $1,497/month as fractional advisor' },
  },
];

export function HomepageServiceSchema() {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'AIandWEBservices — Packages & Services',
        url: 'https://www.aiandwebservices.com/#pricing',
        itemListElement: SERVICES.map((svc, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: svc.name,
            description: svc.description,
            url: svc.url,
            provider: { '@id': 'https://www.aiandwebservices.com/#organization' },
            offers: {
              '@type': 'Offer',
              price: svc.offers.price,
              priceCurrency: svc.offers.priceCurrency,
              description: svc.offers.priceSpecification,
            },
          },
        })),
      }}
    />
  );
}

// ─── 4. FAQ schema — homepage FAQ section ─────────────────────────────────────

const HOME_FAQS = [
  {
    q: 'How long does it take to build an AI automation system?',
    a: 'Most AI automation systems and chatbots are live within 7–14 days. The timeline depends on complexity — a basic inquiry bot is faster than a full CRM-integrated voice AI system. We discuss timelines during your free audit.',
  },
  {
    q: 'Do I need technical knowledge to work with you?',
    a: 'None at all. David handles everything from strategy to build to launch. You explain your business, we build the systems. Most clients have zero technical background.',
  },
  {
    q: 'What happens if I want to cancel my monthly retainer?',
    a: 'No lock-in, no penalties. Just give 30 days written notice and you\'re done. No contracts, no hoops to jump through.',
  },
  {
    q: 'Will the AI chatbot actually sound like a human?',
    a: 'Modern AI conversations are indistinguishable from human responses in most cases. Your chatbot is trained specifically on your business — your tone, your FAQs, your offers. It\'s not a generic bot.',
  },
  {
    q: 'How does SEO work and how long before I see results?',
    a: 'SEO is a long-term play — most clients see meaningful movement in 3–6 months. Technical fixes and Google Business Profile optimisation can show results faster.',
  },
  {
    q: 'Can you work with my existing website or do I need a new one?',
    a: 'Both. David can optimise and improve an existing site, or build a new one from scratch. The recommendation depends on what\'s holding you back — covered in the free audit.',
  },
  {
    q: "What's included in the free AI audit?",
    a: 'A plain-English breakdown of where your biggest opportunities are — whether that\'s SEO, a chatbot, automation, or your website. No pitch, no pressure. Just an honest assessment.',
  },
  {
    q: 'Do you offer crypto payment options?',
    a: 'Yes. We accept Bitcoin, stablecoins, and major cryptocurrencies for all services. We also build crypto payment infrastructure for businesses that want to accept crypto from their own customers.',
  },
];

export function HomepageFAQSchema() {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }}
    />
  );
}

// ─── 5. BlogPosting schema — individual blog article pages ────────────────────

export function BlogPostingSchema({ post, slug }) {
  return (
    <SchemaScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.desc,
        url: `https://www.aiandwebservices.com/blog/${slug}`,
        image: 'https://www.aiandwebservices.com/og-image.jpg',
        datePublished: post.dateISO ?? `${post.date}-01-01`,
        dateModified: post.dateISO ?? `${post.date}-01-01`,
        inLanguage: 'en-US',
        author: {
          '@type': 'Person',
          name: 'David Pulis',
          url: 'https://www.aiandwebservices.com',
        },
        publisher: {
          '@id': 'https://www.aiandwebservices.com/#organization',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.aiandwebservices.com/blog/${slug}`,
        },
        keywords: post.tag,
        articleSection: post.tag,
      }}
    />
  );
}
