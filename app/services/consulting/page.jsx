import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';

export const metadata = {
  title: 'AI Consulting & Strategy — Roadmap, Training, and Fractional Advisory | AIandWEBservices',
  description: 'Get expert guidance on where AI fits in your business. AI readiness audit, digital transformation roadmap, tool recommendations, and staff training. $497 one-time or $1,497/mo.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/consulting' },
};

const service = SERVICES['consulting'];

export default function ConsultingPage() {
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
