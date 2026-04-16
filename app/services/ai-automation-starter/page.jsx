import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';

export const metadata = {
  title: 'AI Automation Starter — Custom AI Chatbot for Your Business | AIandWEBservices',
  description: 'Deploy a custom AI chatbot trained on your business in 7-14 days. Handles inquiries, qualifies leads, books calls 24/7. $997 setup + $97/mo. No contracts.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-automation-starter' },
};

const service = SERVICES['ai-automation-starter'];

export default function AIAutomationStarterPage() {
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
