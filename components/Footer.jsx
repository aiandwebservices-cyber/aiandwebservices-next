import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Column 1 — Brand */}
        <div className="footer-col">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gradient-test.svg" alt="AIandWEBservices" className="footer-logo" />
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
            <Link href="/blog">Blog</Link>
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
              <a href="mailto:david@aiandwebservices.com" className="footer-contact-link">
                david@aiandwebservices.com
              </a>
            </div>
            <div className="footer-contact-item">
              <a href="tel:+13155720710" className="footer-contact-link">
                (315) 572-0710
              </a>
            </div>
            <div className="footer-contact-item">
              <a href="https://t.me/aiandwebservice" className="footer-contact-link" target="_blank" rel="noopener noreferrer">
                @aiandwebservices on Telegram
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
