'use client';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { LocalBusinessSchema, HomepageFAQSchema, HomepageServiceSchema } from '@/components/Schema';
import Hero from '@/components/panels/Hero';
import Services from '@/components/panels/Services';
import HowItWorks from '@/components/panels/HowItWorks';
import About from '@/components/panels/About';
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
          <Comparison />
          <Testimonials />
          <Services />
          <About />
          <FAQ />
          <Blog />


          <Contact />
        </div>
      </main>

      <Footer />

      <div id="progress-bar"></div>
      <Modals />
      <CookieBanner />
      <ScrollInit />
    </>
  );
}
