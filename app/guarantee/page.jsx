import Link from 'next/link';
import { Clock, Shield, AlertCircle } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/Schema';

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
          ——— OUR PROMISE ———
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
          6-Hour Response Guarantee
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '40px' }}>
          David personally reviews every inquiry within 6 hours, 24/7 EST. No bots, no waiting. If he misses it, you get upgraded to a Premium Audit at no cost.
        </p>
      </section>

      {/* ── WHAT COUNTS AS A RESPONSE ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={32} color="#2AA5A0" strokeWidth={1.5} />
          What Counts as a Response
        </h2>

        <div style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' }}>
            <strong>A response is a personalized message from David</strong> — not an automated confirmation email or chatbot reply.
          </p>
          <ul style={{ fontSize: '15px', lineHeight: 1.8, marginLeft: '20px', color: 'rgba(255,255,255,0.85)' }}>
            <li>✓ A direct email or message addressing your specific business</li>
            <li>✓ Calendar link to book a call with David personally</li>
            <li>✓ Your free audit report with personalized recommendations</li>
            <li>✗ Auto-reply confirmations ("we got your message")</li>
            <li>✗ Chatbot or template responses</li>
          </ul>
        </div>

        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
          The guarantee clock starts when your message is received and stops when David sends his first personalized reply. That's it.
        </p>
      </section>

      {/* ── TIMEZONE & HOURS ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={32} color="#60A5FA" strokeWidth={1.5} />
          Time Zone &amp; Hours
        </h2>

        <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)', borderRadius: '8px', padding: '24px' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
            Eastern Standard Time (EST) — 24/7 Coverage
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
            David monitors inquiries <strong>24 hours a day, 7 days a week</strong> in EST. Whether you submit at 3am or Sunday evening, the 6-hour countdown starts immediately.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '16px', fontStyle: 'italic' }}>
            In practice, most responses arrive within minutes — but the formal guarantee is 6 hours, any time, any day.
          </p>
        </div>
      </section>

      {/* ── WHAT HAPPENS IF DAVID MISSES IT ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="#10B981" strokeWidth={1.5} />
          If David Misses the 6-Hour Window
        </h2>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', color: 'rgba(255,255,255,0.85)' }}>
          This has never happened, but if it does, you get automatically upgraded to a <strong>Premium Audit</strong> at no extra cost.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {/* Standard Audit */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#999' }}>Standard Audit</div>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
              <li>✓ Written audit report</li>
              <li>✓ 30-minute debrief call</li>
              <li>✓ Personalized recommendations</li>
              <li>✓ No obligation to hire</li>
            </ul>
          </div>

          {/* Premium Audit (Triggered by Missed Deadline) */}
          <div style={{ backgroundColor: 'rgba(42, 165, 160, 0.15)', border: '2px solid rgba(42, 165, 160, 0.5)', borderRadius: '8px', padding: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '16px', backgroundColor: '#2AA5A0', color: '#111827', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
              YOU GET THIS
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', marginTop: '8px' }}>Premium Audit Upgrade</div>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
              <li>✓ Enhanced written audit report</li>
              <li>✓ <strong>60-minute strategy call</strong> (instead of 30)</li>
              <li>✓ Competitor analysis included</li>
              <li>✓ Personalized recommendations</li>
              <li>✓ No obligation to hire</li>
            </ul>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', padding: '20px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
          <p style={{ marginBottom: '0' }}>
            The Premium Audit is <strong>automatically triggered</strong> if your inquiry doesn't receive a personalized response within 6 hours EST. You don't need to ask for it — David includes it in his reply. This is his commitment to you.
          </p>
        </div>
      </section>

      {/* ── WHY THIS GUARANTEE ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>
          Why This Guarantee
        </h2>

        <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
          <p style={{ marginBottom: '20px' }}>
            Speed matters when you're deciding where to invest in your business. A slow response feels like rejection — even if it's just a timing issue.
          </p>
          <p style={{ marginBottom: '20px' }}>
            David personally responds to every inquiry because:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li>✓ He reads your specific business context, not a form.</li>
            <li>✓ He gives honest feedback, even if you're not the right fit.</li>
            <li>✓ He respects your time — no fluff, no sales spin.</li>
          </ul>
          <p>
            The 6-hour guarantee backs that up. You're not waiting days for a response. You're not left in the dark.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
          Ready to Talk
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.7 }}>
          Fill out the contact form. Tell David about your business. He'll get back to you within 6 hours with personalized advice — guaranteed.
        </p>
        <Link href="/#contact" style={{ display: 'inline-block', backgroundColor: '#2AA5A0', color: '#111827', padding: '14px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', cursor: 'pointer' }}>
          Get Your Free Audit →
        </Link>
      </section>

      {/* ── FOOTER SPACING ── */}
      <div style={{ height: '40px' }}></div>
    </main>
  );
}
