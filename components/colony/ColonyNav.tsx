'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useColonyTheme } from './ThemeProvider';

const NAV_LINKS = [
  { href: '/colony/dashboard', label: 'Dashboard' },
];

export function ColonyNav() {
  const pathname = usePathname();
  const { theme, toggle } = useColonyTheme();
  const { user } = useUser();

  return (
    <nav
      style={{
        background: 'var(--col-surface)',
        borderBottom: '1px solid var(--col-border)',
      }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14"
    >
      <div className="flex items-center gap-8">
        <span style={{ color: 'var(--col-accent)' }} className="font-bold text-sm tracking-widest uppercase">
          Colony
        </span>
        <div className="flex gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: pathname.startsWith(href) ? 'var(--col-accent)' : 'var(--col-muted)',
                fontSize: '0.875rem',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          style={{ color: 'var(--col-muted)', fontSize: '1rem', lineHeight: 1 }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <span style={{ color: 'var(--col-muted)', fontSize: '0.8125rem' }}>
          {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
        </span>
        <SignOutButton redirectUrl="/colony/sign-in">
          <button style={{ color: 'var(--col-muted)', fontSize: '0.8125rem' }}>
            Sign out
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
}
