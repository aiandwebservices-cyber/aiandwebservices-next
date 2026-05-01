import { generateDealerSitemap } from '@/lib/dealer-platform/sitemap-utils';

export async function GET() {
  try {
    const xml = await generateDealerSitemap('sunshine-motors');
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[sitemap] dealer=sunshine-motors', err);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}
