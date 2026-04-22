'use client';
import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { LocalBusinessSchema, HomepageFAQSchema, HomepageServiceSchema } from '@/components/Schema';
import Hero        from '@/components/panels/Hero';
import HowItWorks  from '@/components/panels/HowItWorks';
import Comparison  from '@/components/panels/Comparison';
import Services    from '@/components/panels/Services';
import About       from '@/components/panels/About';
import Work        from '@/components/panels/Work';
import FAQ         from '@/components/panels/FAQ';
import Contact          from '@/components/panels/Contact';
import ChecklistForm   from '@/components/ChecklistForm';
import Modals      from '@/components/Modals';
import CookieBanner from '@/components/CookieBanner';
import ScrollInit  from '@/components/ScrollInit';
import PanelsMode    from '@/components/PanelsMode';

export default function Home() {
  return (
    <>
      {/* ── Structured data ── */}
      <LocalBusinessSchema />
      <HomepageFAQSchema />
      <HomepageServiceSchema />

      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <Nav />

      <main id="main-content">
        <div id="track">
          {/* p0 */ }<Hero />
          {/* p2 */ }<HowItWorks />
          {/* comparison */ }<Comparison />
          {/* services */ }<Services />
          {/* p3 */ }<About />
          {/* samples */ }<Work />
          {/* p7 */ }<FAQ />
          {/* checklist-teaser */ }
          <section className="panel" id="checklist-teaser" aria-label="AI Readiness Assessment">
            <Suspense fallback={null}><ChecklistForm redirectOnStart="/questionnaire" /></Suspense>
          </section>
          {/* p8 */ }<Contact />
        </div>
      </main>

      <Footer />

      <div id="progress-bar"></div>
      <Modals />
      <CookieBanner />
      <ScrollInit />
      <PanelsMode />
    </>
  );
}
