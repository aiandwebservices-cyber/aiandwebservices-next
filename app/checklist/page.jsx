import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ChecklistForm from '@/components/ChecklistForm';
import AllowScroll from '@/components/AllowScroll';

export const metadata = {
  title: 'AI Readiness Assessment for Small Business | AIandWEBservices',
  description: 'Free 20-question AI readiness assessment. Get a personalised score and see exactly where AI automation would have the biggest impact on your business.',
  alternates: { canonical: 'https://www.aiandwebservices.com/checklist' },
  openGraph: {
    title: 'AI Readiness Assessment for Small Business',
    description: 'Free 20-question assessment: see exactly where AI automation would have the biggest impact on your business.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Assessment&description=Assess%20Your%20AI%20Automation%20Readiness', width: 1200, height: 630, alt: 'AI Readiness Assessment' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Assessment for Small Business',
    description: 'Free 20-question assessment: see exactly where AI automation would have the biggest impact on your business.',
    images: ['https://www.aiandwebservices.com/api/og?title=AI%20Readiness%20Assessment&description=Assess%20Your%20AI%20Automation%20Readiness'],
  },
};

export default function ChecklistPage() {
  return (
    <>
      <AllowScroll />
      <Nav />
      <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <ChecklistForm hideHero={false} defaultSource="site" />
      </main>
      <Footer />
    </>
  );
}
