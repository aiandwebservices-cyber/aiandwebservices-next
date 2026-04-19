'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';

const LIGHT_PAGES = ['/services/presence', '/services/revenue-engine', '/services/consulting'];

export default function ServicesLayout({ children }) {
  const pathname = usePathname();
  const isLight = LIGHT_PAGES.includes(pathname);

  return (
    <>
      <Nav />
      <main className={`svc-page-main${isLight ? ' svc-page-main--light' : ''}`}>{children}</main>
      <footer className="svc-page-footer">
        <p>© 2026 <a href="/">AIandWEBservices</a>. Built personally by David Pulis.</p>
      </footer>
    </>
  );
}
