import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';
import withPWAInit from '@ducanh2912/next-pwa';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  scope: '/colony/',
  sw: 'sw.js',
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^\/colony\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'colony-pages',
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.50.143', '*.local'],

  images: {
    formats: ['image/avif', 'image/webp'],
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
      // LotPilot moved to its own domain
      { source: '/dealers/:path*',                destination: 'https://lotpilot.ai/dealers/:path*',  permanent: true },
      { source: '/samples/primo-features/:path*', destination: 'https://lotpilot.ai/features',        permanent: true },
      { source: '/lotpilot/:path*',               destination: 'https://lotpilot.ai/:path*',          permanent: true },
      { source: '/embed/:path*',                  destination: 'https://lotpilot.ai/embed/:path*',    permanent: true },
      { source: '/api/dealer/:path*',             destination: 'https://lotpilot.ai/api/dealer/:path*', permanent: true },
    ];
  },
  headers() {
    return [
      {
        // Catch-all security headers; embed route overrides X-Frame-Options below.
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(self), microphone=(), geolocation=(self)' },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
