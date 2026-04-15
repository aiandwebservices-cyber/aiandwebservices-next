'use client';
import Nav from '@/components/Nav';
import { LocalBusinessSchema, HomepageFAQSchema, HomepageServiceSchema } from '@/components/Schema';
import Hero from '@/components/panels/Hero';
import Services from '@/components/panels/Services';
import HowItWorks from '@/components/panels/HowItWorks';
import About from '@/components/panels/About';
import Pricing from '@/components/panels/Pricing';
import Blog from '@/components/panels/Blog';
import FAQ from '@/components/panels/FAQ';
import Contact from '@/components/panels/Contact';
import Modals from '@/components/Modals';
import CookieBanner from '@/components/CookieBanner';
import ScrollInit from '@/components/ScrollInit';
import Testimonials from '@/components/panels/Testimonials';
import Comparison from '@/components/panels/Comparison';

export default function Home() {
  return (
    <>
      {/* ── Structured data: homepage-specific schemas ── */}
      <LocalBusinessSchema />
      <HomepageFAQSchema />
      <HomepageServiceSchema />

      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <Nav />

      <main id="main-content">
        <div id="track">
          <Hero />
          <HowItWorks />
          <Testimonials />
          <Services />
          <Pricing />
          <About />
          <Comparison />
          <FAQ />
          <Blog />
          <Contact />
        </div>
      </main>

      <footer id="site-footer" role="contentinfo">
        <p>© 2026 AIandWEBservices. Built by David Pulis.</p>
        <p className="footer-links">
          <button style={{background:'none',border:'none',color:'inherit',textDecoration:'underline',cursor:'pointer',fontSize:'inherit',padding:0}} onClick={() => window.openModal('privacy')}>Privacy Policy</button>
          &nbsp;|&nbsp;
          <button style={{background:'none',border:'none',color:'inherit',textDecoration:'underline',cursor:'pointer',fontSize:'inherit',padding:0}} onClick={() => window.openModal('terms')}>Terms</button>
        </p>
      </footer>

      <div id="progress-bar"></div>
      <Modals />
      <CookieBanner />
      <ScrollInit />
    </>
  );
}
