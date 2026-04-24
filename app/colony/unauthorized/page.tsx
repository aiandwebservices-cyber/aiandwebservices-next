import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

export default function ColonyUnauthorized() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#080d18', color: '#e2e8f0' }}
    >
      <div className="text-center max-w-md px-6">
        <div
          style={{ color: '#2aa5a0' }}
          className="text-xs font-bold tracking-widest uppercase mb-6"
        >
          Colony
        </div>
        <h1 className="text-2xl font-bold mb-3">Access Restricted</h1>
        <p style={{ color: '#94a3b8' }} className="text-sm mb-8 leading-relaxed">
          Colony is available to Revenue Engine ($249) and AI-First ($349) clients.
          Upgrade your plan to unlock access.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/#pricing"
            style={{
              background: '#2aa5a0',
              color: '#fff',
              padding: '0.625rem 1.5rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            View Plans
          </Link>
          <SignOutButton redirectUrl="/colony/sign-in">
            <button
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8',
                padding: '0.625rem 1.5rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                background: 'transparent',
              }}
            >
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
