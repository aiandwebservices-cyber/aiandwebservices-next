'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  small?: boolean;
};

const STATS: Stat[] = [
  { value: 6, label: 'AI Agents' },
  { value: 10, suffix: '+', label: 'Tools Replaced' },
  { value: 3, suffix: 's', label: 'Lead Response' },
  { value: 24, suffix: '/7', label: 'Always On', small: true },
];

const DURATION = 1400;

function CountUp({ stat, active }: { stat: Stat; active: boolean }) {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(stat.value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, stat.value]);

  return (
    <span className={`lp-stat__num ${stat.small ? 'lp-stat__num--small' : ''}`}>
      {stat.prefix ?? ''}
      {n}
      {stat.suffix ?? ''}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-container lp-stats" ref={ref}>
      <div className="lp-stats__grid">
        {STATS.map((s) => (
          <div className="lp-stat" key={s.label}>
            <CountUp stat={s} active={active} />
            <div className="lp-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
