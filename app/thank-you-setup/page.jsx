import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Mail } from 'lucide-react';

export const metadata = {
  title: 'Thank You — Setup Complete | AIandWEBservices',
  description: 'Your setup payment has been received. Check your email for your subscription enrollment link.',
  robots: 'noindex',
};

export default function ThankYouSetup() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font-inter)' }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '3rem' }}>
        <Image src="/logo-dark.png" alt="AIandWEBservices" width={200} height={48} style={{ height: '48px', width: 'auto' }} priority />
      </Link>

      {/* Card */}
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: 'rgba(42,165,160,.06)',
        border: '1px solid rgba(42,165,160,.2)',
        borderRadius: '16px',
        padding: 'clamp(2rem, 6vw, 3rem)',
        textAlign: 'center',
      }}>
        <CheckCircle2 size={52} color="#2AA5A0" strokeWidth={1.5} style={{ marginBottom: '1.25rem' }} />

        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2AA5A0', marginBottom: '10px' }}>
          Setup Payment Received
        </div>

        <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#111827', marginBottom: '16px', lineHeight: 1.25 }}>
          Thank you — you&apos;re one step away!
        </h1>

        <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Your setup payment has been received. <strong style={{ color: '#111827' }}>Check your email</strong> — a subscription enrollment link is on its way to you within the next few minutes.
        </p>

        {/* Email callout */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '16px 18px',
          textAlign: 'left',
          marginBottom: '2rem',
        }}>
          <Mail size={20} color="#2AA5A0" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            Don&apos;t see it within 5 minutes? Check your spam folder, or email{' '}
            <a href="mailto:david@aiandwebservices.com" style={{ color: '#2AA5A0', textDecoration: 'none' }}>
              david@aiandwebservices.com
            </a>{' '}
            and we&apos;ll sort it out immediately.
          </p>
        </div>

        <Link href="/" className="btn-primary" style={{ fontSize: '16px', padding: '13px 28px' }}>
          Return to Home
        </Link>
      </div>

    </div>
  );
}
