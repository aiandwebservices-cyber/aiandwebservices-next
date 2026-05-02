import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'filled' | 'outline' | 'ghost';

type CommonProps = {
  variant?: Variant;
  size?: 'md' | 'lg';
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
  type?: never;
  onClick?: never;
};

type AsButton = CommonProps & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  external?: never;
};

type ButtonProps = AsLink | AsButton;

export default function Button({
  variant = 'filled',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = `lp-btn lp-btn--${variant}${size === 'lg' ? ' lp-btn--lg' : ''} ${className}`.trim();

  if ('href' in rest && rest.href) {
    if (rest.external || rest.href.startsWith('http')) {
      return (
        <a className={cls} href={rest.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={rest.href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type={rest.type ?? 'button'} onClick={rest.onClick}>
      {children}
    </button>
  );
}
