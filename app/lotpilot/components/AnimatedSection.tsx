'use client';

import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from 'react';

type Animation = 'fade' | 'slide-l' | 'slide-r' | 'scale';

type Props = {
  children: ReactNode;
  as?: ElementType;
  animation?: Animation;
  delay?: number;
  className?: string;
  threshold?: number;
  style?: CSSProperties;
};

const CLASS_MAP: Record<Animation, string> = {
  fade: 'lp-fade',
  'slide-l': 'lp-slide-l',
  'slide-r': 'lp-slide-r',
  scale: 'lp-scale',
};

export default function AnimatedSection({
  children,
  as: Tag = 'div',
  animation = 'fade',
  delay = 0,
  className = '',
  threshold = 0.15,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  const mergedStyle: CSSProperties | undefined =
    delay || style ? { ...(delay ? { transitionDelay: `${delay}ms` } : {}), ...(style ?? {}) } : undefined;

  return (
    <Tag
      ref={ref}
      className={`${CLASS_MAP[animation]} ${shown ? 'lp-in' : ''} ${className}`.trim()}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
