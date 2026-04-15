import Link from 'next/link';
import Script from 'next/script';

export default function ServicesLayout({ children }) {
  return (
    <>
      <header className="svc-page-nav">
        <Link href="/" className="svc-page-logo" aria-label="AIandWEBservices — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gradient-test.svg" alt="AIandWEBservices" width={200} height={40} />
        </Link>
        <nav className="svc-page-links" aria-label="Service page navigation">
          <Link href="/#services">Services</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <Link href="/#contact" className="svc-page-cta">Get a Free Audit</Link>
      </header>
      <main>{children}</main>
      <footer className="svc-page-footer">
        <p>© 2026 <Link href="/">AIandWEBservices</Link>. Built personally by David Pulis.</p>
      </footer>
      <Script
        id="calendly"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
