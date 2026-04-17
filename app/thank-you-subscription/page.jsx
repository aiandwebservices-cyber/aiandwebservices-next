import Link from 'next/link';
import { CheckCircle2, Zap } from 'lucide-react';

export const metadata = {
  title: 'Welcome to AIandWEBservices — Subscription Confirmed',
  description: 'Your subscription is confirmed. We\'ll be in touch within 24 hours to begin your onboarding.',
  robots: 'noindex',
};

export default function ThankYouSubscription() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font-inter)' }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'var(--font-plus-jakarta)', fontWeight: 800, fontSize: '20px', letterSpacing: '-.3px' }}>
          <span style={{ color: '#fff' }}>AI</span>
          <span style={{ color: '#2AA5A0', fontWeight: 600, fontSize: '16px', margin: '0 2px' }}>and</span>
          <span style={{ color: '#fff' }}>WEB</span>
          <span style={{ color: '#2AA5A0', fontWeight: 600 }}>services</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{
        maxWidth: '580px',
        width: '100%',
        background: 'rgba(42,165,160,.07)',
        border: '1px solid rgba(42,165,160,.25)',
        borderRadius: '16px',
        padding: 'clamp(2rem, 6vw, 3rem)',
        textAlign: 'center',
      }}>
        <CheckCircle2 size={52} color="#10b981" strokeWidth={1.5} style={{ marginBottom: '1.25rem' }} />

        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2AA5A0', marginBottom: '10px' }}>
          Subscription Confirmed
        </div>

        <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.25 }}>
          Welcome aboard — you&apos;re all set!
        </h1>

        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
          Your subscription is confirmed. David will be in touch <strong style={{ color: '#fff' }}>within 24 hours</strong> to kick off your onboarding. Your next charge will be exactly one month from today.
        </p>

        {/* Details list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem', textAlign: 'left' }}>
          {[
            <>You&apos;ll receive monthly receipts via email automatically.</>,
            <>Cancel anytime — just reply to any invoice email or contact <a href="mailto:david@aiandwebservices.com" style={{ color: '#60A5FA', textDecoration: 'none' }}>david@aiandwebservices.com</a>.</>,
            <>Questions? Reach David at <a href="mailto:david@aiandwebservices.com" style={{ color: '#60A5FA', textDecoration: 'none' }}>david@aiandwebservices.com</a> or <a href="tel:+13155720710" style={{ color: '#60A5FA', textDecoration: 'none' }}>(315) 572-0710</a>.</>,
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Zap size={15} color="#2AA5A0" strokeWidth={2} style={{ flexShrink: 0, marginTop: '3px' }} />
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        <Link href="/" className="btn-primary" style={{ fontSize: '16px', padding: '13px 28px' }}>
          Return to Home
        </Link>
      </div>

    </div>
  );
}
