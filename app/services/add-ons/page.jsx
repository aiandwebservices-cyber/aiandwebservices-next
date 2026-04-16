import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';

export const metadata = {
  title: 'Add-On Services — Crypto Payments, E-commerce, Accessibility | AIandWEBservices',
  description: 'Enhance any AIandWEBservices tier with crypto payment infrastructure, Shopify/WooCommerce integration, or WCAG accessibility compliance.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/add-ons' },
};

const service = SERVICES['add-ons'];

export default function AddOnsPage() {
  if (!service) return <div style={{ padding: '3rem', textAlign: 'center' }}>Service not found.</div>;

  return (
    <>
      <V1Hero service={service} />
      <V1FeatureGrid features={service.features} />
      <V1FitCheck bullets={service.fitBullets} />
      <V1Timeline timeline={service.timeline} />
      <V1PriceCard service={service} />
      <V1Comparison service={service} />
    </>
  );
}
