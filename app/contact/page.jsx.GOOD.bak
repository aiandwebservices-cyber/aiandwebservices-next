'use client';
import { Suspense, useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Zap, MessageCircle } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CalContactEmbed from '@/components/CalContactEmbed';
import ContactForm from '@/components/ContactForm';

const TEAL = '#2AA5A0';

export default function Contact2() {
  const reduced = useReducedMotion();
  const formCellRef = useRef(null);
  const [calCardHeight, setCalCardHeight] = useState(null);

  useEffect(() => {
    const el = formCellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCalCardHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fade = (delay = 0) => ({
    initial:   { opacity: 0, y: reduced ? 0 : 16 },
    animate:   { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.22,1,0.36,1], delay },
  });

  return (
    <>
      <style>{`
        /* Desktop: lock to one viewport, hide global footer */
        @media(min-width:769px){
          .contact-main{
            margin-top:68px;
            height:calc(100vh - 68px);
            overflow:hidden;
            min-height:unset;
          }
          .cal-cell{ overflow:hidden; }
        }
        /* Desktop: hide full footer, show legal row only */
        @media(min-width:769px){
          .contact-footer-wrap{ display:none; }
          .contact-legal-row{ display:flex; }
        }
        @media(max-width:768px){
          .contact-legal-row{ display:none; }
        }
        /* Mobile: natural scroll */
        @media(max-width:768px){
          .contact-main{
            min-height:calc(100vh - 64px);
            height:auto;
            overflow:visible;
          }
          .contact-grid{ grid-template-columns:1fr!important; }
          .contact-strip{ grid-template-columns:1fr!important; }
          #cal-contact-embed{ height:clamp(340px,36vh,460px)!important; }
          form > div[style*="grid-template-columns"] > div{ min-width:0; }
        }
      `}</style>

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

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1200px', width: '100%', margin: '0 auto',
          padding: 'clamp(40px, 5vh, 60px) 6vw clamp(10px, 1.2vw, 16px)',
          display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between',
          overflow: 'hidden',
        }}>

          {/* Heading */}
          <motion.div {...fade(0)} style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: TEAL, marginBottom: 4 }}>GET IN TOUCH</div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(20px, 3.2vw, 38px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.08, color: '#fff', marginBottom: 6 }}>
              Get a free 30-minute audit.<br /><span style={{ color: TEAL }}>No pitch.</span>
            </h1>
            <p style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: 'rgba(255,255,255,.65)', lineHeight: 1.5, maxWidth: '560px', margin: '0 auto' }}>
              Share what you&apos;re working on. I&apos;ll personally review your business and identify exactly where AI, a better website, or SEO would move the needle.
            </p>
          </motion.div>

          {/* Two-column cards */}
          <motion.div {...fade(0.04)} className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 360px)',
            gap: 'clamp(12px, 2vw, 22px)',
            alignItems: 'start',
            maxWidth: '1300px',
            margin: '0 auto',
            width: '100%',
          }}>
            {/* Form card — measured to sync right card height */}
            <div ref={formCellRef}>
              <Suspense fallback={null}><ContactForm compact /></Suspense>
            </div>

            {/* Cal card — height locked to form card via JS measurement */}
            <div className="cal-cell" style={{
              height: calCardHeight ? `${calCardHeight}px` : 'auto',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'clamp(14px, 1.8vw, 22px)',
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column',
                height: '100%',
                boxSizing: 'border-box',
              }}>
                <div style={{ marginBottom: 10, textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 'clamp(13px, 1.6vw, 15px)', fontWeight: 800, color: '#fff', marginBottom: 3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Prefer to Talk First?</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
                    <div>30 minutes. No sales pitch.</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>David&apos;s timezone: EST</div>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  <CalContactEmbed />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact strip */}
          <motion.div {...fade(0.08)} style={{ flexShrink: 0 }}>
            <div className="contact-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(12px, 2vw, 24px)', alignItems: 'center' }}>
              <a href="mailto:david@aiandwebservices.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
                <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '10px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><Mail size={17} strokeWidth={1.75} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Email</div><div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 500, wordBreak: 'break-word' }}>david@aiandwebservices.com</div></div>
              </a>
              <a href="tel:+13155720710" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
                <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '10px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><Phone size={17} strokeWidth={1.75} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Phone</div><div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 500 }}>(315) 572-0710</div></div>
              </a>
              <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
                <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '10px', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><MessageCircle size={17} strokeWidth={1.75} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Telegram</div><div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 500 }}>@aiandwebservices</div></div>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '10px', background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Zap size={17} strokeWidth={1.75} /></div>
                <div><div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Response Guarantee</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.4 }}>David personally responds within <strong style={{ color: '#fff' }}>6 hours</strong>.</div></div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Legal row: desktop-only, sits below contact strip */}
        <div className="contact-legal-row" style={{
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          padding: '12px 0 10px',
          fontSize: '11px',
          color: 'rgba(255,255,255,.35)',
          marginTop: '16px',
        }}>
          <span>© 2026 AIandWEBservices</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <button onClick={() => window.openModal && window.openModal('privacy')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', fontSize: '11px', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Privacy</button>
          <span style={{ opacity: 0.4 }}>·</span>
          <button onClick={() => window.openModal && window.openModal('terms')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', fontSize: '11px', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Terms</button>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Built in Miami, FL</span>
        </div>
      </main>

      {/* Full footer: mobile only (hidden on desktop via .contact-footer-wrap display:none) */}
      <div className="contact-footer-wrap">
        <Footer />
      </div>
    </>
  );
}
