'use client';
import Link from 'next/link';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, FOOTER_TELEGRAM_LABEL, FOOTER_TELEGRAM_URL } from '@/lib/contact-channels';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Column 1 — Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-final/logoFINAL-aiandweb-transparent-whitetext.svg" alt="AIandWEBservices" width="700" height="240" className="footer-logo" />
          </div>
          <p className="footer-tagline">AI automation, agents & chatbots for small business</p>
        </div>

        {/* Column 2 — Services */}
        <div className="footer-col">
          <h4 className="footer-heading">Services</h4>
          <nav className="footer-links">
            <Link href="/services/presence">Presence</Link>
            <Link href="/services/growth">Growth</Link>
            <Link href="/services/revenue-engine">Revenue Engine</Link>
            <Link href="/services/ai-first">AI-First</Link>
            <Link href="/services/consulting">A La Carte</Link>
            <Link href="/services/ai-automation-starter">AI Automation Starter</Link>
          </nav>
        </div>

        {/* Column 3 — Resources */}
        <div className="footer-col">
          <h4 className="footer-heading">Resources</h4>
          <nav className="footer-links">
            <a href="https://blog.aiandwebservices.com" target="_blank" rel="noopener noreferrer">Blog <span aria-hidden="true" style={{fontSize:'0.75em',opacity:0.6}}>↗</span></a>
            <Link href="/intro">Free 30-Min Intro Call</Link>
            <Link href="/checklist">AI Readiness Checklist</Link>
            <a href="#faq" onClick={() => window.go && window.go(5)}>FAQ</a>
          </nav>
        </div>

        {/* Column 4 — Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <a href={`mailto:${CONTACT_EMAIL}`} className="footer-contact-link">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="footer-contact-item">
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="footer-contact-link">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div className="footer-contact-item">
              <a href={FOOTER_TELEGRAM_URL} className="footer-contact-link" target="_blank" rel="noopener noreferrer">
                {FOOTER_TELEGRAM_LABEL}
              </a>
            </div>
            <p className="footer-promise">6-hour response guarantee</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 AIandWEBservices. Built by David Pulis in Miami, FL.</p>
        <div className="footer-legal">
          <button
            className="footer-legal-link"
            onClick={() => window.openModal && window.openModal('privacy')}
          >
            Privacy Policy
          </button>
          <span className="footer-legal-divider">|</span>
          <button
            className="footer-legal-link"
            onClick={() => window.openModal && window.openModal('terms')}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}
