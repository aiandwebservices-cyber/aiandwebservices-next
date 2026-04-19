'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Zap, MessageCircle } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CalContactEmbed from '@/components/CalContactEmbed';
import ContactForm from '@/components/ContactForm';

const TEAL = '#2AA5A0';

export default function Contact2() {
  const reduced = useReducedMotion();

  const fade = (delay = 0) => ({
    initial:   { opacity: 0, y: reduced ? 0 : 24 },
    animate:   { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: [0.22,1,0.36,1], delay },
  });

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: '#080d18', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media(max-width:768px){
          form > div[style*="grid-template-columns"] > div{min-width:0}
          div[style*="repeat(3, minmax"]{grid-template-columns:1fr!important}
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 60% at 80% 30%, rgba(37,99,235,.15) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,58,237,.1) 0%, transparent 60%)` }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '90px 6vw clamp(20px, 3vw, 44px)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          <motion.div {...fade(0)} style={{ marginBottom: 'clamp(12px, 2vw, 20px)', maxWidth: '700px', margin: '0 auto clamp(12px, 2vw, 20px)', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: TEAL, marginBottom: 6 }}>GET IN TOUCH</div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3.8vw, 46px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, color: '#fff', marginBottom: 10 }}>
              Get a free 30-minute audit.<br /><span style={{ color: TEAL }}>No pitch.</span>
            </h1>
            <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, maxWidth: '580px', margin: '10px auto 10px' }}>
              Share what you&apos;re working on. I&apos;ll personally review your business and identify exactly where AI, a better website, or SEO would move the needle.
            </p>
          </motion.div>

          <motion.div {...fade(0.04)} className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 380px)', gap: 'clamp(24px, 4vw, 40px)', alignItems: 'stretch', maxWidth: '1300px', margin: '0 auto', marginTop: '0px', marginBottom: '-15px' }}>

            <div><ContactForm /></div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '28px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Prefer to Talk First?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                    <div>30 minutes. No sales pitch.</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>David&apos;s timezone: EST</div>
                  </div>
                </div>
                <CalContactEmbed />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...fade(0.08)} style={{ marginTop: 'clamp(28px, 4vw, 48px)', paddingTop: 'clamp(24px, 3vw, 40px)', paddingBottom: 'clamp(20px, 3vw, 32px)', borderTop: '1px solid rgba(255,255,255,.08)', maxWidth: '1200px', margin: 'clamp(28px, 4vw, 48px) auto 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(28px, 4vw, 44px)', justifyItems: 'center' }}>
            <a href="mailto:david@aiandwebservices.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '12px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><Mail size={20} strokeWidth={1.75} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Email</div><div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500, wordBreak: 'break-word' }}>david@aiandwebservices.com</div></div>
            </a>
            <a href="tel:+13155720710" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '12px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><Phone size={20} strokeWidth={1.75} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Phone</div><div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500 }}>(315) 572-0710</div></div>
            </a>
            <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '12px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><MessageCircle size={20} strokeWidth={1.75} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Telegram</div><div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500 }}>@aiandwebservices</div></div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', gridColumn: '1 / -1', justifyContent: 'center' }}>
              <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '12px', background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Zap size={20} strokeWidth={1.75} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Response Guarantee</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>David personally responds within <strong style={{ color: '#fff' }}>6 hours</strong>.</div></div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`@media(max-width:1024px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </main>
    <div style={{ marginTop: '-15px' }}><Footer /></div>
    </>
  );
}
