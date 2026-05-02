'use client';

import { useEffect, useRef, useState } from 'react';

type Row = {
  label: string;
  price: string;
  numeric: number; // for sorting / bar width
  brand?: boolean; // highlight LotPilot row in red
};

type Props = {
  title?: string;
  rows: Row[];
  saveBig: string;
  saveSmall: string;
};

export default function HeadToHeadBars({ title, rows, saveBig, saveSmall }: Props) {
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
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const max = Math.max(...rows.map((r) => r.numeric));

  return (
    <div className="lp-bars" ref={ref}>
      {title && <div className="lp-bars__title">{title}</div>}
      <div className="lp-bars__list">
        {rows.map((r, i) => {
          const pct = (r.numeric / max) * 100;
          return (
            <div className="lp-bars__row" key={r.label}>
              <div className="lp-bars__head">
                <span className="lp-bars__label">{r.label}</span>
                <span className={`lp-bars__price ${r.brand ? 'is-brand' : ''}`}>{r.price}</span>
              </div>
              <div className="lp-bars__track">
                <div
                  className={`lp-bars__fill ${r.brand ? 'is-brand' : ''}`}
                  style={{
                    width: active ? `${pct}%` : '0%',
                    transitionDelay: `${150 + i * 120}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="lp-bars__save">
        <div>
          <div className="lp-bars__save-big">{saveBig}</div>
          <div className="lp-bars__save-small">{saveSmall}</div>
        </div>
        <a className="lp-btn lp-btn--filled" href="#pricing-tiers">
          See pricing →
        </a>
      </div>
    </div>
  );
}
