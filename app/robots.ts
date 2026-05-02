import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/preview/', '/api/', '/samples/', '/intro/', '/v2/', '/v3/', '/qr-test/', '/contactold/', '/checklist/'],
      },
    ],
    sitemap: [
      'https://www.aiandwebservices.com/sitemap.xml',
      'https://lotpilot.ai/dealers/lotcrm/sitemap.xml',
      'https://lotpilot.ai/dealers/sunshine-motors/sitemap.xml',
    ],
  };
}
