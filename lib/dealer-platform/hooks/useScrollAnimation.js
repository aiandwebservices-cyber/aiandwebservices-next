'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation — IntersectionObserver-based reveal hook.
 *
 * Returns [ref, seen] — attach `ref` to a DOM element, then `seen` flips to
 * true the first time it enters the viewport. Use it to trigger fade-in /
 * slide-up animations on scroll without a third-party library.
 *
 * Usage:
 *   const [ref, seen] = useScrollAnimation();
 *   <div ref={ref} style={{ opacity: seen ? 1 : 0, transition: 'opacity 600ms' }}>...</div>
 */
export function useScrollAnimation(opts = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      // No IO support (very old browser or SSR) — flip immediately so content shows
      setSeen(true);
      return;
    }
    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.unobserve(el);
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, seen];
}
