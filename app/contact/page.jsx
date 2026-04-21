'use client';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactExperience from '@/components/ContactExperience';

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="contact-main" style={{
        background: '#080d18',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* bg gradient */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 60% at 80% 30%, rgba(37,99,235,.15) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,58,237,.1) 0%, transparent 60%)` }} />
        <ContactExperience standalone />
      </main>
      {/* Full footer: mobile only — hidden on desktop via .contact-footer-wrap CSS in ContactExperience */}
      <div className="contact-footer-wrap">
        <Footer />
      </div>
    </>
  );
}
