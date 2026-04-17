import Link from 'next/link';
import { Wallet, ShoppingCart, Eye, CheckCircle } from 'lucide-react';
import { BreadcrumbListSchema } from '@/components/Schema';

export const metadata = {
  title: 'Add-On Services — Crypto Payments, E-commerce, Accessibility | AIandWEBservices',
  description: 'Enhance any AIandWEBservices tier with crypto payment infrastructure, Shopify/WooCommerce integration, or WCAG accessibility compliance.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/add-ons' },
};

const ADDONS = [
  {
    Icon: Wallet,
    iconColor: '#00D9FF',
    name: 'Crypto Payment Infrastructure',
    price: '$29/mo',
    setup: '$499',
    perfectFor: 'Businesses that want to accept crypto from customers, or crypto-native companies that need payment infrastructure on their website.',
    desc: 'Tap crypto-native customers. Full integration: Bitcoin, stablecoins, multi-chain wallets, and seamless on/off ramps. Start accepting crypto payments in days.',
    includes: [
      'Payment gateway integration',
      'Multi-chain wallet setup',
      'Stablecoin checkout flows',
      'On/off ramp configuration',
      'Payment analytics & reconciliation',
    ],
  },
  {
    Icon: ShoppingCart,
    iconColor: '#00D9FF',
    name: 'E-commerce Integration',
    price: '$49/mo',
    setup: '$499',
    perfectFor: 'Businesses adding online sales to an existing service business, or anyone who needs a storefront connected to their AI and marketing systems.',
    desc: 'Turn service customers into product revenue. Shopify or WooCommerce store built, connected to your CRM, and integrated with your AI so customers can shop 24/7.',
    includes: [
      'Store setup & configuration',
      'Product catalog build',
      'Payment processing',
      'Basic inventory management',
      'Integration with AI assistant & CRM',
    ],
  },
  {
    Icon: Eye,
    iconColor: '#00D9FF',
    name: 'Accessibility Audit (WCAG)',
    price: '$0/mo',
    setup: '$299',
    perfectFor: 'Businesses that serve government clients, healthcare organizations, or anyone who wants their site usable by everyone and wants to reduce legal risk.',
    desc: 'Make your site accessible to everyone AND avoid legal liability. Full WCAG 2.1 AA audit with prioritized fixes and implementation guidance.',
    includes: [
      'Comprehensive WCAG 2.1 AA audit',
      'Prioritized issue report',
      'Specific remediation instructions',
      'Follow-up verification after fixes',
    ],
  },
];

export default function AddOnsPage() {
  return (
    <>
      <BreadcrumbListSchema serviceName="Add-Ons" serviceSlug="add-ons" />
      <div className="svc-page-wrap">

        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">Add-Ons</div>
          <h1 className="svc-page-h1">Extend Your System<br />With Specialized Tools</h1>
          <p className="svc-page-lead">Already working with us? Add crypto payments, e-commerce, or accessibility compliance to any tier.</p>
        </section>

        <section className="svc-page-section">
          <div className="svc-addon-list">
            {ADDONS.map(({ Icon, iconColor, name, price, setup, perfectFor, desc, includes }, i) => (
              <div key={i} className="svc-addon-block">
                <div className="svc-addon-header">
                  <div className="svc-addon-icon-wrap">
                    <Icon size={28} color={iconColor} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="svc-addon-name">{name}</h2>
                    <div className="svc-addon-price">{setup} setup + {price}</div>
                  </div>
                </div>
                <p className="svc-addon-desc">{desc}</p>
                <div className="svc-addon-callout">
                  <span className="svc-addon-callout-label">Perfect for:</span> {perfectFor}
                </div>
                <div className="svc-addon-includes-title">Includes:</div>
                <ul className="svc-check-list">
                  {includes.map((item, j) => (
                    <li key={j}>
                      <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="svc-page-cta-section">
          <div className="svc-cta-box">
            <h2>These add-ons work best alongside a core tier.</h2>
            <p>Not sure what you need? The free audit helps identify the right combination for your business.</p>
            <div className="svc-cta-btns">
              <Link href="/#contact" className="svc-btn-primary">Get a Free Audit →</Link>
              <Link href="/#services" className="svc-btn-ghost">View All Services</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
