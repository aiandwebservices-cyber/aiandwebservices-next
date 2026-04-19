'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, Zap, CheckCircle2, Lock, MessageCircle, ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CalContactEmbed from '@/components/CalContactEmbed';

const TEAL = '#2AA5A0';

export default function Contact2() {
  const [status, setStatus] = useState('idle');
  const [messageLength, setMessageLength] = useState(0);
  const reduced = useReducedMotion();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const fade = (delay = 0) => ({
    initial:     { opacity: 0, y: reduced ? 0 : 24 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1], delay } },
    viewport:    { once: true, amount: 0.05 },
  });

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: '#080d18', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        /* Mobile input font-size override — prevents iOS Safari auto-zoom on focus.
           !important required because inputs use inline fontSize: 14 styles.
           TODO: refactor to CSS classes in a future cleanup pass. */
        @media(max-width:768px){
          input,textarea,select{font-size:16px!important}
        }
      `}</style>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 60% at 80% 30%, rgba(37,99,235,.15) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,58,237,.1) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '120px 6vw clamp(20px, 3vw, 44px)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ── HEADER ── */}
          <motion.div {...fade(0)} style={{ marginBottom: 'clamp(12px, 2vw, 20px)', maxWidth: '700px', margin: '0 auto clamp(12px, 2vw, 20px)', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: TEAL, marginBottom: 6 }}>GET IN TOUCH</div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3.8vw, 46px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, color: '#fff', marginBottom: 10 }}>
              Let's find where AI creates <span style={{ color: TEAL }}>the biggest impact.</span>
            </h1>
            <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, maxWidth: '580px', margin: '10px auto 10px' }}>
              Share what you're working on. I'll personally review your business and identify exactly where AI, a better website, or SEO would move the needle.
            </p>
          </motion.div>

          {/* ── MAIN CONTENT: FORM PRIMARY ── */}
          <motion.div {...fade(0.04)} className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 380px)',
            gap: 'clamp(24px, 4vw, 40px)',
            alignItems: 'stretch',
            maxWidth: '1300px',
            margin: '0 auto',
            marginTop: '0px',
            marginBottom: '-15px',
          }}>

          {/* ── LEFT: FORM (PRIMARY) ── */}
          <div>
            {status === 'success' ? (
              <div style={{
                padding: '38px 40px',
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center',
                minHeight: '455px',
              }} role="alert" aria-live="polite">
                <CheckCircle2 size={52} color="#10b981" strokeWidth={1.5} />
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Got it!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.8, maxWidth: '360px' }}>
                  David personally reviews every request and will reach out within <strong style={{ color: '#fff' }}>6 hours</strong>.
                </div>
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(42, 165, 160, .1)', borderRadius: '8px', fontSize: 12, color: TEAL }}>
                  Check your email for confirmation
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                padding: 'clamp(10px, 2.5vw, 20px)',
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
              }}>
                {/* Form Header */}
                <div style={{ marginBottom: 'clamp(18px, 2.5vw, 24px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Details</div>
                  <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>
                    All fields required. 2 minutes. <span style={{ color: 'rgba(255,255,255,.4)' }}>No credit card.</span>
                  </div>
                </div>

                {/* Name Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>
                      First Name <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Jane"
                      required
                      autoComplete="given-name"
                      style={{
                        width: '100%',
                        padding: '10px 13px',
                        background: 'rgba(255,255,255,.06)',
                        border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        transition: 'all .2s',
                        outline: 'none',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 6 }}>
                      Last Name <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Smith"
                      required
                      autoComplete="family-name"
                      style={{
                        width: '100%',
                        padding: '10px 13px',
                        background: 'rgba(255,255,255,.06)',
                        border: '1px solid rgba(255,255,255,.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        transition: 'all .2s',
                        outline: 'none',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                  <label style={{ display: 'block', fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>
                    Email <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@company.com"
                    required
                    autoComplete="email"
                    style={{
                      width: '100%',
                      padding: '10px 13px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all .2s',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                  <label style={{ display: 'block', fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>
                    Phone <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(555) 000-0000"
                    required
                    autoComplete="tel"
                    style={{
                      width: '100%',
                      padding: '10px 13px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all .2s',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                  />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Best way to reach you</div>
                </div>

                {/* Service Interest */}
                <div style={{ marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                  <label style={{ display: 'block', fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>
                    What interests you most? <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <select
                    name="service"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 13px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                  >
                    <option value="">Select one...</option>
                    <option>AI Automation (lead capture, chatbots, workflows)</option>
                    <option>Website & Design (redesign, conversion optimization)</option>
                    <option>SEO (rankings, traffic, visibility)</option>
                    <option>Full Package (AI + Website + SEO)</option>
                    <option>Strategy Consulting (roadmap, audit)</option>
                    <option>Not sure yet (let's explore)</option>
                  </select>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Helps us prepare for the audit</div>
                </div>

                {/* Business Challenge */}
                <div style={{ marginBottom: 'clamp(16px, 2.5vw, 20px)' }}>
                  <label style={{ display: 'block', fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>
                    Your biggest challenge <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="E.g. Lost leads to competitors, website is outdated, can't keep up with demand, need automation..."
                    required
                    onChange={(e) => setMessageLength(e.target.value.length)}
                    style={{
                      width: '100%',
                      padding: '10px 13px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'all .2s',
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,.1)'}
                  />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Be specific — helps David prepare</span>
                    <span>{messageLength} characters</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: status === 'sending' ? 'rgba(42,165,160,.6)' : '#2AA5A0',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '50px',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'all .25s',
                    boxShadow: '0 4px 18px rgba(42,165,160,.4)',
                    opacity: status === 'sending' ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => !status === 'sending' && (e.target.style.background = '#1e9a96')}
                  onMouseLeave={(e) => !status === 'sending' && (e.target.style.background = '#2AA5A0')}
                >
                  {status === 'sending' ? (
                    <>Sending...</>
                  ) : status === 'error' ? (
                    <>Error — email david@aiandwebservices.com</>
                  ) : (
                    <>Get My Free Audit <ArrowRight size={16} /></>
                  )}
                </button>

                {/* Privacy Note */}
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 16, lineHeight: 1.5 }}>
                  <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Your information is never shared or sold.
                </p>
              </form>
            )}
          </div>

          {/* ── RIGHT: CALENDAR (SECONDARY) ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '28px',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '20px',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}>
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Prefer to Talk First?</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                  <div>30 minutes. No sales pitch.</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>David's timezone: EST</div>
                </div>
              </div>
              <CalContactEmbed />
            </div>
          </div>
        </motion.div>
        </div>

        {/* ── FOOTER: Contact Options (ONLY location for detailed contact info) ── */}
        <motion.div {...fade(0.08)} style={{
          marginTop: 'clamp(28px, 4vw, 48px)',
          paddingTop: 'clamp(24px, 3vw, 40px)',
          paddingBottom: 'clamp(20px, 3vw, 32px)',
          borderTop: '1px solid rgba(255,255,255,.08)',
          maxWidth: '1200px',
          margin: 'clamp(28px, 4vw, 48px) auto 0',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(28px, 4vw, 44px)', justifyItems: 'center' }}>
            {/* Email */}
            <a href="mailto:david@aiandwebservices.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                borderRadius: '12px',
                background: 'rgba(37,99,235,.15)',
                border: '1px solid rgba(37,99,235,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}>
                <Mail size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Email</div>
                <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500, wordBreak: 'break-word' }}>david@aiandwebservices.com</div>
              </div>
            </a>

            {/* Phone */}
            <a href="tel:+13155720710" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                borderRadius: '12px',
                background: 'rgba(37,99,235,.15)',
                border: '1px solid rgba(37,99,235,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}>
                <Phone size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Phone</div>
                <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500 }}>(315) 572-0710</div>
              </div>
            </a>

            {/* Telegram */}
            <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
              <div style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                borderRadius: '12px',
                background: 'rgba(37,99,235,.15)',
                border: '1px solid rgba(37,99,235,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}>
                <MessageCircle size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Telegram</div>
                <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 500 }}>@aiandwebservices</div>
              </div>
            </a>

            {/* Response Guarantee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', gridColumn: '1 / -1', justifyContent: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                borderRadius: '12px',
                background: 'rgba(245,158,11,.15)',
                border: '1px solid rgba(245,158,11,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}>
                <Zap size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Response Guarantee</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>David personally responds within <strong style={{ color: '#fff' }}>6 hours</strong>.</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
    <div style={{ marginTop: '-15px' }}>
      <Footer />
    </div>
    </>
  );
}
