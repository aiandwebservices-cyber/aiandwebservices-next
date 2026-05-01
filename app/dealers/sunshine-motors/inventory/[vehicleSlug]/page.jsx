/**
 * Thin wrapper — delegates to the generic vehicle detail page with dealerId='sunshine-motors'.
 */
import GenericPage, { generateMetadata as genMeta } from '@/app/dealers/[dealerId]/inventory/[vehicleSlug]/page';

export async function generateMetadata({ params }) {
  const resolved = await params;
  return genMeta({ params: Promise.resolve({ ...resolved, dealerId: 'sunshine-motors' }) });
}

export default async function Page({ params }) {
  const resolved = await params;
  return <GenericPage params={Promise.resolve({ ...resolved, dealerId: 'sunshine-motors' })} />;
}
