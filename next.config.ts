import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.50.143', '*.local'],

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  async redirects() {
    return [
      {
        source: '/contact2',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/services/ai-automation',
        destination: '/services/compare',
        permanent: true,
      },
      // Blog → Hashnode (permanent 301 for SEO authority transfer)
      {
        source: '/blog',
        destination: 'https://blog.aiandwebservices.com',
        permanent: true,
      },
      {
        source: '/blog/how-ai-works-while-you-sleep',
        destination: 'https://blog.aiandwebservices.com/how-ai-works-while-you-sleep',
        permanent: true,
      },
      {
        source: '/blog/ai-saves-small-businesses-500-2000-per-month',
        destination: 'https://blog.aiandwebservices.com/ai-saves-small-businesses-500-2000-per-month',
        permanent: true,
      },
      {
        source: '/blog/growing-businesses-use-ai-83-percent',
        destination: 'https://blog.aiandwebservices.com/growing-businesses-use-ai-83-percent',
        permanent: true,
      },
      {
        source: '/blog/ai-directly-boosts-revenue-91-percent-small-businesses',
        destination: 'https://blog.aiandwebservices.com/ai-directly-boosts-revenue-91-percent-small-businesses',
        permanent: true,
      },
      {
        source: '/blog/businesses-cut-costs-35-percent-first-year-ai',
        destination: 'https://blog.aiandwebservices.com/businesses-cut-costs-35-percent-first-year-ai',
        permanent: true,
      },
      {
        source: '/blog/urgency-ai-adoption-8-in-10-companies',
        destination: 'https://blog.aiandwebservices.com/urgency-ai-adoption-8-in-10-companies',
        permanent: true,
      },
      {
        source: '/blog/global-ai-market-small-business-20-billion-2026',
        destination: 'https://blog.aiandwebservices.com/global-ai-market-small-business-20-billion-2026',
        permanent: true,
      },
      // Catch-all — must be last
      {
        source: '/blog/:slug*',
        destination: 'https://blog.aiandwebservices.com/:slug*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
