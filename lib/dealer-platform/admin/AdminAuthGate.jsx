'use client';
import { ClerkProvider, useUser, SignIn } from '@clerk/nextjs';
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

const TEAL = '#2AA5A0';

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0f1117',
    gap: '24px',
  },
  branding: {
    textAlign: 'center',
  },
  logo: {
    fontSize: '32px',
    fontWeight: 800,
    color: TEAL,
    letterSpacing: '-0.5px',
    fontFamily: 'var(--font-inter, sans-serif)',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginTop: '6px',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0f1117',
    color: '#fff',
    gap: '16px',
    textAlign: 'center',
    padding: '24px',
  },
  errorHeading: {
    fontSize: '18px',
    fontWeight: 600,
  },
  errorLink: {
    color: TEAL,
    textDecoration: 'underline',
    fontSize: '14px',
  },
  demoBanner: {
    background: TEAL,
    color: '#fff',
    padding: '10px 20px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 500,
    position: 'sticky',
    top: 0,
    zIndex: 9999,
  },
  demoBannerLink: {
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'underline',
    marginLeft: '4px',
  },
};

function DemoBanner() {
  return (
    <div style={styles.demoBanner}>
      You&apos;re viewing a demo.
      <a href="/contact" style={styles.demoBannerLink}>
        Sign up to get your own dashboard →
      </a>
    </div>
  );
}

function GateInner({ dealerId, children }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  const isDemo =
    searchParams.get('demo') === 'true' && dealerId === 'primo';

  if (isDemo) {
    return (
      <>
        <DemoBanner />
        {children}
      </>
    );
  }

  if (!isLoaded) {
    return <div style={{ ...styles.page, background: '#0f1117' }} />;
  }

  if (!isSignedIn) {
    const returnUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    return (
      <div style={styles.page}>
        <div style={styles.branding}>
          <div style={styles.logo}>LotPilot</div>
          <div style={styles.subtitle}>Sign in to your dealer dashboard</div>
        </div>
        <SignIn fallbackRedirectUrl={returnUrl} />
      </div>
    );
  }

  const userDealerId = user?.publicMetadata?.dealerId;
  if (userDealerId && userDealerId !== dealerId) {
    return (
      <div style={styles.error}>
        <div style={styles.errorHeading}>
          You don&apos;t have access to this dealership.
        </div>
        <a href={`/dealers/${userDealerId}/admin`} style={styles.errorLink}>
          Go to your dashboard
        </a>
      </div>
    );
  }

  return children;
}

export default function AdminAuthGate({ dealerId, children }) {
  return (
    <ClerkProvider>
      <Suspense>
        <GateInner dealerId={dealerId}>{children}</GateInner>
      </Suspense>
    </ClerkProvider>
  );
}
