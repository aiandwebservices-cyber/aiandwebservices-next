import type { MetadataRoute } from 'next';

const BASE = 'https://www.aiandwebservices.com';

const BLOG_SLUGS = [
  'how-ai-works-while-you-sleep',
  'ai-saves-small-businesses-500-2000-per-month',
  'ai-directly-boosts-revenue-91-percent-small-businesses',
  'global-ai-market-small-business-20-billion-2026',
  'businesses-cut-costs-35-percent-first-year-ai',
  'growing-businesses-use-ai-83-percent',
  'urgency-ai-adoption-8-in-10-companies',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/#services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/#pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/#contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/#about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/#faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/#blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/services/ai-automation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/ai-automation-starter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/services/presence`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/services/growth`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/services/revenue-engine`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    ...blogEntries,
  ];
}
