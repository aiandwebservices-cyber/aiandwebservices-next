import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer__grid">
          <div>
            <Logo />
            <p className="lp-footer__about">
              The all-in-one AI command center for independent auto dealers. A product
              by AIandWEBservices, built in Miami.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/lotpilot/features">Features</Link></li>
              <li><Link href="/lotpilot/pricing">Pricing</Link></li>
              <li>
                <a
                  href="https://lotpilot.ai/dealers/lotcrm?demo=true"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/lotpilot/about">About</Link></li>
              <li><Link href="/lotpilot/contact">Contact</Link></li>
              <li>
                <a
                  href="https://aiandwebservices.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AIandWEBservices
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:demo@lotpilot.ai">demo@lotpilot.ai</a></li>
              <li><a href="tel:+13155720710">315-572-0710</a></li>
              <li>Miami, FL</li>
            </ul>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <span>© {new Date().getFullYear()} LotPilot.ai · A product by AIandWEBservices.</span>
          <span>
            <Link href="/lotpilot/privacy" style={{ marginRight: 16 }}>Privacy</Link>
            <Link href="/lotpilot/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
