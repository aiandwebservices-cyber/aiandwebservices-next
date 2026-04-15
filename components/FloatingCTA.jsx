'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (dismissed) return;

    // Don't show if page is shorter than viewport
    if (document.body.scrollHeight <= window.innerHeight) return;

    const THRESHOLD = 0.4;

    function handleScroll() {
      if (dismissed) return;
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);

      // Hide when contact section is visible
      const contact = document.getElementById('p8');
      if (contact) {
        const rect = contact.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setVisible(false);
          return;
        }
      }

      if (scrolled >= THRESHOLD) {
        setVisible(true);
      }
    }

    // 4-second timer fallback
    timerRef.current = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 4000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timerRef.current);
    };
  }, [dismissed]);

  function dismiss(e) {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        left: 'auto',
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: visible ? 'opacity 300ms ease, transform 300ms ease' : 'opacity 200ms ease, transform 200ms ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="floating-cta-wrap"
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <Link
          href="#contact"
          onClick={() => {
            const el = document.getElementById('p8');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 48px 14px 24px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #2AA5A0 0%, #1e40af 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(42,165,160,.4)',
            whiteSpace: 'nowrap',
            minHeight: '48px',
          }}
        >
          Get Your Free Audit
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(15,23,42,.9)',
            border: '1px solid rgba(255,255,255,.2)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
