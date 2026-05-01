'use client';
import { useState } from 'react';
import Link from 'next/link';

const SAMPLES = [
  {
    id: 'example005',
    label: '05',
    name: 'LotCRM',
    industry: 'Dealer CRM Platform',
    tagline: 'The CRM built for car dealers.',
    accent: '#D4AF37',
    bg: '#0a0a0a',
    desc: 'Full dealer CRM demo with inventory management, lead tracking, AI follow-up, and finance tools — powered by LotPilot.',
    tags: ['CRM', 'Dealership', 'LotPilot'],
    href: '/samples/example005',
  },
  {
    id: 'example001',
    label: '01',
    name: 'Ember & Oak',
    industry: 'Fine Dining Restaurant',
    tagline: 'Luxury. Atmosphere. Unforgettable dining.',
    accent: '#C9A84C',
    bg: '#0D0D0D',
    desc: 'Dark, moody elegance with parallax hero, animated menu reveals, and reservation flow.',
    tags: ['Restaurant', 'Luxury', 'Parallax'],
    href: '/samples/example001',
  },
  {
    id: 'example002',
    name: 'Aria Realty',
    label: '02',
    industry: 'Real Estate Agent',
    tagline: 'Homes that match the life you deserve.',
    accent: '#10B981',
    bg: '#0F1923',
    desc: 'Clean luxury property showcase with animated counters, listing cards, and lead capture.',
    tags: ['Real Estate', 'Listings', 'Lead Gen'],
    href: '/samples/example002',
  },
  {
    id: 'example003',
    name: 'The Blade Room',
    label: '03',
    industry: 'Barber Shop',
    tagline: 'Sharp cuts. Clean fades. Every time.',
    accent: '#D4A843',
    bg: '#0C0C0C',
    desc: 'Bold barber brand with animated service cards, stylist profiles, and online booking CTA.',
    tags: ['Barber', 'Booking', 'Local Business'],
    href: '/samples/example003',
    centerHero: true,
  },
];

export default function SamplesPage() {
  const [idx, setIdx] = useState(0);
  const s = SAMPLES[idx];

  const prev = () => setIdx(i => (i - 1 + SAMPLES.length) % SAMPLES.length);
  const next = () => setIdx(i => (i + 1) % SAMPLES.length);

  return (
    <div style={{ background: '#080810', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>
            AI<span style={{ color: '#2AA5A0' }}>and</span>WEB<span style={{ color: '#2AA5A0' }}>services</span>
          </span>
        </Link>
        <Link href="/contact" style={{
          background: 'linear-gradient(135deg,#2AA5A0,#059669)',
          color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8,
          fontWeight: 700, fontSize: 13, textDecoration: 'none',
        }}>
          Get Your Site →
        </Link>
      </nav>

      {/* HERO */}
      <header style={{ paddingTop: 120, paddingBottom: 64, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(42,165,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(42,165,160,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(42,165,160,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(42,165,160,0.12)', border: '1px solid rgba(42,165,160,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: '1.5rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2AA5A0', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#2AA5A0', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Live Sample Work</span>
          </div>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1.5rem',
          }}>
            Websites that<br />
            <span style={{ background: 'linear-gradient(135deg, #2AA5A0, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              actually convert.
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Browse 4 fully-built sample sites across different industries. Each one is custom-designed, scroll-animated, and ready to deploy for your business.
          </p>
          {/* Sample selector pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {SAMPLES.map((sample, i) => (
              <button
                key={sample.id}
                onClick={() => setIdx(i)}
                style={{
                  padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: i === idx
                    ? sample.accent
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: i === idx ? `0 0 20px ${sample.accent}50` : 'none',
                  color: i === idx ? '#000' : 'rgba(255,255,255,0.7)',
                  fontSize: 13, fontWeight: 700,
                  transition: 'all 0.25s',
                  outline: 'none',
                }}
              >
                {sample.industry}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* SAMPLE CARD CAROUSEL */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem 8rem' }}>

        {/* Arrow + card + arrow row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous sample"
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', outline: 'none',
            }}
          >
            ←
          </button>

          {/* Card */}
          <div
            key={s.id}
            className="sample-card-enter"
            style={{ flex: 1, minWidth: 0 }}
          >
            {/* number + label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: '-4px', lineHeight: 1, userSelect: 'none' }}>
                {s.label}
              </span>
              <div>
                <div style={{ color: s.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{s.industry}</div>
                <div style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.5px' }}>{s.name}</div>
              </div>
            </div>

            {/* main card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, overflow: 'hidden',
              boxShadow: `0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px ${s.accent}10`,
            }}>
              {/* top bar */}
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${s.bg}, #0D0D20)`,
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41', display: 'block' }} />
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '4px 16px',
                  color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace',
                }}>
                  aiandwebservices.com/samples/{s.id}
                </div>
                <div style={{ width: 60 }} />
              </div>

              {/* device mockup area */}
              <div style={{
                padding: '2.5rem',
                background: `linear-gradient(160deg, ${s.bg}ee 0%, #080810 100%)`,
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '2rem',
                alignItems: 'center',
              }}>
                {/* Desktop mockup */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    background: '#1a1a2e', borderRadius: 12,
                    border: `1px solid ${s.accent}30`,
                    boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${s.accent}15`,
                    overflow: 'hidden', aspectRatio: '16/10',
                  }}>
                    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                      {s.centerHero ? (
                        <>
                          <div style={{ height: '27.5%', background: s.bg }} />
                          <div style={{
                            height: '45%',
                            background: `linear-gradient(160deg, ${s.bg} 0%, ${s.accent}18 100%)`,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            alignItems: 'center', gap: 6, padding: '0 10%',
                          }}>
                            <div style={{ width: '60%', height: 8, borderRadius: 4, background: s.accent, opacity: 0.9 }} />
                            <div style={{ width: '45%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }} />
                            <div style={{ width: '30%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ marginTop: 8, width: '22%', height: 18, borderRadius: 4, background: s.accent }} />
                          </div>
                          <div style={{ height: '27.5%', background: s.bg }} />
                        </>
                      ) : (
                        <>
                          <div style={{
                            height: '12%',
                            background: s.bg,
                            borderBottom: `1px solid ${s.accent}20`,
                            display: 'flex', alignItems: 'center', padding: '0 8%', gap: '5%',
                          }}>
                            <div style={{ width: '15%', height: 6, borderRadius: 3, background: s.accent }} />
                            {[1,2,3].map(n => <div key={n} style={{ width: '8%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />)}
                            <div style={{ marginLeft: 'auto', width: '12%', height: 20, borderRadius: 4, background: s.accent, opacity: 0.8 }} />
                          </div>
                          <div style={{
                            height: '45%',
                            background: `linear-gradient(160deg, ${s.bg} 0%, ${s.accent}18 100%)`,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            alignItems: 'center', gap: 6, padding: '0 10%',
                          }}>
                            <div style={{ width: '60%', height: 8, borderRadius: 4, background: s.accent, opacity: 0.9 }} />
                            <div style={{ width: '45%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }} />
                            <div style={{ width: '30%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ marginTop: 8, width: '22%', height: 18, borderRadius: 4, background: s.accent }} />
                          </div>
                          <div style={{
                            height: '43%',
                            padding: '6% 8%',
                            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4%',
                            background: '#0d0d18',
                          }}>
                            {[1,2,3].map(n => (
                              <div key={n} style={{
                                background: `${s.accent}12`, borderRadius: 6,
                                border: `1px solid ${s.accent}25`,
                                display: 'flex', flexDirection: 'column', gap: 4, padding: '8% 8%',
                              }}>
                                <div style={{ width: 14, height: 14, borderRadius: 3, background: s.accent, marginBottom: 2 }} />
                                <div style={{ width: '80%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.5)' }} />
                                <div style={{ width: '60%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ width: '70%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '3%', height: 16, background: '#333', margin: '0 auto' }} />
                    <div style={{ width: '25%', height: 4, borderRadius: 2, background: '#333' }} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                    color: s.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1,
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>Desktop</div>
                </div>

                {/* Tablet mockup */}
                <div style={{ position: 'relative', width: 110 }}>
                  <div style={{
                    background: '#111', borderRadius: 12,
                    border: '3px solid #2a2a3a',
                    boxShadow: `0 12px 40px rgba(0,0,0,0.5)`,
                    overflow: 'hidden', aspectRatio: '3/4',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 20, height: 3, borderRadius: 2, background: '#2a2a3a' }} />
                    <div style={{ width: '100%', height: '100%', paddingTop: 12, background: s.bg, overflow: 'hidden' }}>
                      <div style={{ height: '12%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '40%', height: 4, borderRadius: 2, background: s.accent }} />
                      </div>
                      <div style={{ height: '40%', background: `linear-gradient(160deg, ${s.bg}, ${s.accent}18)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, padding: '0 10%' }}>
                        <div style={{ width: '70%', height: 5, borderRadius: 3, background: s.accent, opacity: 0.9 }} />
                        <div style={{ width: '50%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ marginTop: 6, width: '35%', height: 14, borderRadius: 4, background: s.accent }} />
                      </div>
                      <div style={{ padding: '8%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[1,2,3].map(n => <div key={n} style={{ height: 10, borderRadius: 4, background: `${s.accent}18`, border: `1px solid ${s.accent}20` }} />)}
                      </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', border: '2px solid #2a2a3a' }} />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 10, color: s.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Tablet</div>
                </div>

                {/* Phone mockup */}
                <div style={{ position: 'relative', width: 70 }}>
                  <div style={{
                    background: '#111', borderRadius: 16,
                    border: '3px solid #2a2a3a',
                    boxShadow: `0 12px 40px rgba(0,0,0,0.5)`,
                    overflow: 'hidden', aspectRatio: '9/19',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 18, height: 4, borderRadius: 2, background: '#2a2a3a', zIndex: 2 }} />
                    <div style={{ width: '100%', height: '100%', paddingTop: 14, background: s.bg, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '8%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '40%', height: 3, borderRadius: 2, background: s.accent }} />
                      </div>
                      <div style={{ height: '38%', background: `linear-gradient(160deg, ${s.bg}, ${s.accent}18)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, padding: '0 8%' }}>
                        <div style={{ width: '80%', height: 4, borderRadius: 2, background: s.accent }} />
                        <div style={{ width: '60%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ marginTop: 4, width: '50%', height: 12, borderRadius: 4, background: s.accent }} />
                      </div>
                      <div style={{ flex: 1, padding: '6%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[1,2,3,4].map(n => <div key={n} style={{ flex: 1, borderRadius: 4, background: `${s.accent}15`, border: `1px solid ${s.accent}18` }} />)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 10, color: s.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Mobile</div>
                </div>
              </div>

              {/* bottom info strip */}
              <div className="sample-info-strip" style={{
                padding: '1.5rem 2.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem',
                background: 'rgba(0,0,0,0.3)',
              }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 8 }}>{s.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {s.tags.map(t => (
                      <span key={t} style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                        background: `${s.accent}18`, border: `1px solid ${s.accent}30`, color: s.accent,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <Link href={s.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0.75rem 1.75rem', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: s.accent, color: '#000', textDecoration: 'none',
                  boxShadow: `0 0 24px ${s.accent}40`,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                  View Live Site →
                </Link>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next sample"
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', outline: 'none',
            }}
          >
            →
          </button>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '1.75rem', alignItems: 'center' }}>
          {SAMPLES.map((sample, i) => (
            <button
              key={sample.id}
              onClick={() => setIdx(i)}
              aria-label={`Go to ${sample.name}`}
              style={{
                width: i === idx ? 28 : 8, height: 8, borderRadius: 4,
                background: i === idx ? s.accent : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s', outline: 'none',
              }}
            />
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{
        textAlign: 'center', padding: '5rem 1.5rem',
        background: 'linear-gradient(180deg, #080810 0%, #0d1a2e 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
          Want one of these for<br />
          <span style={{ background: 'linear-gradient(135deg,#2AA5A0,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            your business?
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 460, margin: '0 auto 2rem' }}>
          Every site is built custom. No templates, no page builders — just fast, beautiful, conversion-focused design.
        </p>
        <Link href="/contact" style={{
          display: 'inline-block', padding: '1rem 2.5rem', borderRadius: 12,
          background: 'linear-gradient(135deg,#2AA5A0,#059669)',
          color: '#fff', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none',
          boxShadow: '0 0 40px rgba(42,165,160,0.35)',
        }}>
          Start My Project →
        </Link>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes cardEnter { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .sample-card-enter { animation: cardEnter 0.4s ease both; }
        @media(max-width:768px){ .sample-info-strip{ padding-top: calc(1.5rem + 10px); } }
      `}</style>
    </div>
  );
}
