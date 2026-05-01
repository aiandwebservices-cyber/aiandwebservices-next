/**
 * generateDealerSitemap(dealerId) → XML string
 *
 * Fetches live inventory from EspoCRM and builds a sitemap that includes:
 *  - The main dealer page (priority 1.0, daily)
 *  - Each vehicle's individual URL (priority 0.8, weekly)
 */
import { espoFetch, getDealerConfig } from '@/app/api/dealer/_lib/espocrm';
import { mapEspoVehicle, ALLOWED_STATUSES } from '@/lib/dealer-platform/customer/InventoryGrid';
import { generateVehicleSlug } from '@/lib/dealer-platform/customer/utils';

const BASE_URL = 'https://lotpilot.ai';

function xmlEscape(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isoDate(d) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt)) return new Date().toISOString().slice(0, 10);
  return dt.toISOString().slice(0, 10);
}

export async function generateDealerSitemap(dealerId) {
  const apiCfg = getDealerConfig(dealerId);

  let vehicles = [];
  if (apiCfg) {
    const result = await espoFetch(
      'GET',
      '/api/v1/CVehicle?orderBy=dateAdded&order=desc',
      null,
      apiCfg,
    );
    if (result.ok) {
      const list = Array.isArray(result.data?.list) ? result.data.list : [];
      vehicles = list
        .map(mapEspoVehicle)
        .filter((v) => v && ALLOWED_STATUSES.has(v.status));
    }
  }

  const urls = [
    // Main dealer page
    `  <url>
    <loc>${xmlEscape(`${BASE_URL}/dealers/${dealerId}`)}</loc>
    <lastmod>${isoDate(null)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    // Vehicle pages
    ...vehicles.map((v) => {
      const slug = generateVehicleSlug(v);
      const lastmod = isoDate(v.updatedAt || v.createdAt || null);
      return `  <url>
    <loc>${xmlEscape(`${BASE_URL}/dealers/${dealerId}/inventory/${slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}
