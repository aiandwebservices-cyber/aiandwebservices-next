const BASE_HEADERS = [
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'X-XSS-Protection',        value: '1; mode=block' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'camera=(self), microphone=(), geolocation=(self)' },
];

// Returns the Next.js headers() array.
// Rules are applied in order; later rules override earlier ones for duplicate keys,
// so the embed override must come after the catch-all.
export function getSecurityHeaders() {
  return [
    {
      // Catch-all: apply all security headers with SAMEORIGIN framing restriction.
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ...BASE_HEADERS,
      ],
    },
    {
      // Embed routes must be iframeable by dealer websites — override X-Frame-Options.
      source: '/api/dealer/:dealerId/embed/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOWALL' },
      ],
    },
  ];
}
