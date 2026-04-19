import ChecklistForm from '@/components/ChecklistForm';

export const metadata = {
  title: 'AI Readiness Checklist for Small Business | AIandWEBservices',
  description: 'Free checklist: Is your business ready for AI automation? 20 questions to assess your readiness and identify quick wins.',
  alternates: { canonical: 'https://www.aiandwebservices.com/checklist' },
  openGraph: {
    title: 'AI Readiness Checklist for Small Business',
    description: 'Free checklist: 20 questions to assess your AI automation readiness.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Checklist&description=Assess%20Your%20AI%20Automation%20Readiness', width: 1200, height: 630, alt: 'AI Readiness Checklist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Checklist for Small Business',
    description: 'Free checklist: 20 questions to assess your AI automation readiness.',
    images: ['https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Checklist&description=Assess%20Your%20AI%20Automation%20Readiness'],
  },
};

export default function ChecklistPage() {
  return (
    <main className="standalone-page" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <ChecklistForm />
    </main>
  );
}
