export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ChecklistForm from '@/components/ChecklistForm';
import AllowScroll from '@/components/AllowScroll';

export const metadata = {
  title: 'AI Readiness Assessment | AIandWEBservices',
  description: 'Answer 20 questions across 5 categories and get a personalised AI readiness score for your business.',
  alternates: { canonical: 'https://www.aiandwebservices.com/questionnaire' },
  openGraph: {
    title: 'AI Readiness Assessment | AIandWEBservices',
    description: 'Answer 20 questions across 5 categories and get a personalised AI readiness score for your business.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Assessment&description=Assess%20Your%20AI%20Automation%20Readiness', width: 1200, height: 630, alt: 'AI Readiness Assessment' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Assessment | AIandWEBservices',
    description: 'Answer 20 questions across 5 categories and get a personalised AI readiness score for your business.',
    images: ['https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Assessment&description=Assess%20Your%20AI%20Automation%20Readiness'],
  },
};

export default function QuestionnairePage() {
  return (
    <>
      <AllowScroll />
      <Nav />
      <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Suspense fallback={null}><ChecklistForm hideHero={false} defaultSource="site" /></Suspense>
      </main>
      <Footer />
    </>
  );
}
