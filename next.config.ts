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
        source: '/blog',
        destination: '/',
        permanent: false,
      },
      {
        source: '/services/ai-automation',
        destination: '/services/compare',
        permanent: true,
      },
      {
        source: '/blog/ai-saves-small-businesses-500-2000-per-month',
        destination: '/blog/ai-directly-boosts-revenue-91-percent-small-businesses',
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
