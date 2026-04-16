'use client';

import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';

export default function V1Comparison({ service }) {
  const prev = service.prevSlug ? SERVICES[service.prevSlug] : null;
  const next = service.nextSlug ? SERVICES[service.nextSlug] : null;

  return (
    <section style={{
      padding: '3rem 2rem',
      background: '#fff',
      maxWidth: 1100,
      margin: '0 auto',
      borderTop: '1px solid var(--border)',
    }}>
      <h3 style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Compare Tiers
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        {prev && (
          <Link href={`/v1/services/${prev.slug}`} style={{
            padding: '1.5rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            textAlign: 'center',
          }} onMouseEnter={e => e.target.style.borderColor = 'var(--blue)'} onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Previous
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
              {prev.tier}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--blue)', marginTop: '0.5rem' }}>
              ${prev.priceMonthly}/mo
            </div>
          </Link>
        )}
        <div style={{
          padding: '1.5rem',
          border: '2px solid var(--blue)',
          borderRadius: '8px',
          textAlign: 'center',
          background: 'rgba(42,165,160,0.05)',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--blue)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Current
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            {service.tier}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--blue)', marginTop: '0.5rem' }}>
            ${service.priceMonthly}/mo
          </div>
        </div>
        {next && (
          <Link href={`/v1/services/${next.slug}`} style={{
            padding: '1.5rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            textAlign: 'center',
          }} onMouseEnter={e => e.target.style.borderColor = 'var(--blue)'} onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Next
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
              {next.tier}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--blue)', marginTop: '0.5rem' }}>
              ${next.priceMonthly}/mo
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
