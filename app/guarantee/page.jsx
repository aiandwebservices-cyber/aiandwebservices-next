import Link from 'next/link';
import { Clock, Shield, AlertCircle } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/Schema';
import { GUARANTEE } from '@/lib/guarantee-content';

export const metadata = {
  title: 'Our Guarantee | AIandWEBservices',
  description: 'No lock-in contracts. Cancel anytime. 6-hour response time. What you get when you work with David Pulis at AIandWEBservices.',
  alternates: { canonical: 'https://www.aiandwebservices.com/guarantee' },
  openGraph: {
    title: 'Our Guarantee | AIandWEBservices',
    description: 'No lock-in contracts. Cancel anytime. 6-hour response time. What you get when you work with David Pulis.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=Our%20Guarantee&description=No%20lock-in%2C%20cancel%20anytime', width: 1200, height: 630, alt: 'Our Guarantee' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Guarantee | AIandWEBservices',
    description: 'No lock-in contracts. Cancel anytime. 6-hour response time. What you get when you work with David Pulis.',
    images: ['https://www.aiandwebservices.com/api/og?title=Our%20Guarantee&description=No%20lock-in%2C%20cancel%20anytime'],
  },
};

const BASE = 'https://www.aiandwebservices.com';
const BREADCRUMB_ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Our Guarantee', url: `${BASE}/guarantee` },
];

export default function GuaranteePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#111827', color: '#fff' }}>
      <BreadcrumbSchema items={BREADCRUMB_ITEMS} />
      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#2AA5A0', marginBottom: '16px' }}>
          {GUARANTEE.eyebrow}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
          {GUARANTEE.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '40px' }}>
          {GUARANTEE.summary}
        </p>
      </section>

      {/* ── WHAT COUNTS AS A RESPONSE ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={32} color="#2AA5A0" strokeWidth={1.5} />
          {GUARANTEE.countsHeading}
        </h2>

        <div style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' }}>
            <strong>{GUARANTEE.countsLead.split(' — ')[0]}</strong> — {GUARANTEE.countsLead.split(' — ')[1]}
          </p>
          <ul style={{ fontSize: '15px', lineHeight: 1.8, marginLeft: '20px', color: 'rgba(255,255,255,0.85)' }}>
            {GUARANTEE.counts.map((item) => <li key={item}>✓ {item}</li>)}
            {GUARANTEE.doesNotCount.map((item) => <li key={item}>✗ {item}</li>)}
          </ul>
        </div>

        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
          {GUARANTEE.clock}
        </p>
      </section>

      {/* ── TIMEZONE & HOURS ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={32} color="#60A5FA" strokeWidth={1.5} />
          {GUARANTEE.hoursHeading}
        </h2>

        <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)', borderRadius: '8px', padding: '24px' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
            {GUARANTEE.hoursTitle}
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
            {GUARANTEE.hoursBody.split('24 hours a day, 7 days a week')[0]}
            <strong>24 hours a day, 7 days a week</strong>
            {GUARANTEE.hoursBody.split('24 hours a day, 7 days a week')[1]}
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '16px', fontStyle: 'italic' }}>
            {GUARANTEE.hoursNote}
          </p>
        </div>
      </section>

      {/* ── WHAT HAPPENS IF DAVID MISSES IT ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="#10B981" strokeWidth={1.5} />
          {GUARANTEE.missHeading}
        </h2>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', color: 'rgba(255,255,255,0.85)' }}>
          {GUARANTEE.missLead.split('Premium Audit')[0]}<strong>Premium Audit</strong>{GUARANTEE.missLead.split('Premium Audit')[1]}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {/* Standard Audit */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#999' }}>Standard Audit</div>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
              {GUARANTEE.standardAudit.map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>

          {/* Premium Audit (Triggered by Missed Deadline) */}
          <div style={{ backgroundColor: 'rgba(42, 165, 160, 0.15)', border: '2px solid rgba(42, 165, 160, 0.5)', borderRadius: '8px', padding: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: '#2AA5A0', color: '#111827', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
              YOU GET THIS
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', marginTop: '8px' }}>Premium Audit Upgrade</div>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
              {GUARANTEE.premiumAudit.map((item) => item.startsWith('60-minute strategy call')
                ? <li key={item}>✓ <strong>60-minute strategy call</strong> (instead of 30)</li>
                : <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', padding: '20px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
          <p style={{ marginBottom: '0' }}>
            {GUARANTEE.missNote.split('automatically triggered')[0]}<strong>automatically triggered</strong>{GUARANTEE.missNote.split('automatically triggered')[1]}
          </p>
        </div>
      </section>

      {/* ── WHY THIS GUARANTEE ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>
          {GUARANTEE.whyHeading}
        </h2>

        <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
          <p style={{ marginBottom: '20px' }}>
            {GUARANTEE.why[0]}
          </p>
          <p style={{ marginBottom: '20px' }}>
            {GUARANTEE.why[1]}
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            {GUARANTEE.why.slice(2, 5).map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
          <p>
            {GUARANTEE.why[5]}
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
          {GUARANTEE.ctaHeading}
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.7 }}>
          {GUARANTEE.ctaBody}
        </p>
        <Link href={GUARANTEE.ctaHref} style={{ display: 'inline-block', backgroundColor: '#2AA5A0', color: '#111827', padding: '14px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', cursor: 'pointer' }}>
          {GUARANTEE.ctaLabel}
        </Link>
      </section>

      {/* ── FOOTER SPACING ── */}
      <div style={{ height: '40px' }}></div>
    </main>
  );
}
