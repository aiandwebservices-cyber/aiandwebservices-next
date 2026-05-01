/**
 * Thin wrapper — delegates to the generic vehicle detail page with dealerId='lotcrm'.
 * Required because Next.js routes /dealers/lotcrm/inventory/... through this static
 * directory rather than the [dealerId] dynamic catch-all at the same level.
 */
import GenericPage, { generateMetadata as genMeta } from '@/app/dealers/[dealerId]/inventory/[vehicleSlug]/page';

export async function generateMetadata({ params }) {
  const resolved = await params;
  return genMeta({ params: Promise.resolve({ ...resolved, dealerId: 'lotcrm' }) });
}

export default async function Page({ params }) {
  const resolved = await params;
  return <GenericPage params={Promise.resolve({ ...resolved, dealerId: 'lotcrm' })} />;
}
