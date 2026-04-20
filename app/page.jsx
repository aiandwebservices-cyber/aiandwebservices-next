'use client';
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
import ChecklistTeaser from '@/components/panels/ChecklistTeaser';
import Modals      from '@/components/Modals';
import CookieBanner from '@/components/CookieBanner';
import ScrollInit  from '@/components/ScrollInit';
import PanelDots     from '@/components/PanelDots';
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
        <PanelDots />
        <div id="track">
          {/* p0 */ }<Hero />
          {/* p2 */ }<HowItWorks />
          {/* comparison */ }<Comparison />
          {/* services */ }<Services />
          {/* p3 */ }<About />
          {/* samples */ }<Work />
          {/* p7 */ }<FAQ />
          {/* checklist-teaser */ }<ChecklistTeaser />
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
