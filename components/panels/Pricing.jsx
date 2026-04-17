'use client';
import Link from 'next/link';
import { Bot, Sprout, TrendingUp, Zap, Brain, Target, Wallet, ShoppingCart, Eye } from 'lucide-react';
import { TIERS } from '@/lib/pricing';

// Icon + service anchor mappings — purely presentational, not pricing data
const TIER_META = {
  'presence':             { Icon: Sprout,      iconColor: '#34d399', serviceAnchor: '#service-presence',     pricingId: 'pricing-presence' },
  'growth':               { Icon: TrendingUp,  iconColor: '#34d399', serviceAnchor: '#service-growth',       pricingId: 'pricing-growth' },
  'revenue-engine':       { Icon: Zap,         iconColor: '#a78bfa', serviceAnchor: '#service-revenue-engine', pricingId: 'pricing-revenue-engine' },
  'ai-first':             { Icon: Brain,       iconColor: '#60a5fa', serviceAnchor: '#service-ai-first',     pricingId: 'pricing-ai-first' },
  'ai-automation-starter':{ Icon: Bot,         iconColor: '#60a5fa', serviceAnchor: '#service-ai-starter',   pricingId: 'pricing-ai-starter' },
  'consulting':           { Icon: Target,      iconColor: '#f87171', serviceAnchor: '#service-consulting',   pricingId: 'pricing-consulting' },
};

// Tiers shown in the main grid (all except ai-automation-starter which has its own solo card)
const MAIN_TIERS = TIERS.filter(t => t.slug !== 'ai-automation-starter');
const AI_STARTER = TIERS.find(t => t.slug === 'ai-automation-starter');

function PrCard({ tier }) {
  const meta = TIER_META[tier.slug] || {};
  const { Icon, iconColor, serviceAnchor, pricingId } = meta;
  const isConsulting = tier.slug === 'consulting';

  return (
    <div id={pricingId} className={`pr-card${tier.popular ? ' popular' : ''}`} style={{scrollMarginTop:'100px'}}>
      {tier.popular && <div className="pr-pop-badge">Most Popular</div>}
      <div className="pr-emoji">{Icon && <Icon size={20} color={iconColor || '#00D9FF'} strokeWidth={1.75} />}</div>
      <div className="pr-name">{tier.name}</div>
      <div className="pr-tagline">{tier.tagline}</div>

      {isConsulting ? (
        <>
          <div className="pr-price">
            <div className="pr-price-n"><sup>$</sup>{tier.setupFee}</div>
            <div className="pr-price-per"> once</div>
          </div>
          <div className="pr-setup-wrap">
            <span className="pr-setup">or ${tier.monthlyFee}/mo fractional</span>
          </div>
        </>
      ) : (
        <>
          <div className="pr-price">
            <div className="pr-price-n"><sup>$</sup>{tier.monthlyFee}</div>
            <div className="pr-price-per">/mo</div>
          </div>
          <div className="pr-setup-wrap">
            <span className="pr-setup">+ ${tier.setupFee} one-time setup</span>
          </div>
        </>
      )}

      <ul className="pr-list">
        {tier.features.map(f => <li key={f}>{f}</li>)}
      </ul>

      <div className="pr-best">{tier.tagline}</div>

      {serviceAnchor && (
        <a href={serviceAnchor} className="pr-whats-included">What&apos;s included? ↑</a>
      )}

      {isConsulting ? (
        <Link href="/services/consulting" className="pr-btn pr-btn-link">Get More Info</Link>
      ) : (
        <a href={tier.setupLinkLong || tier.setupLinkShort} className="pr-btn">
          Get Started
        </a>
      )}
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="panel" id="pricing" style={{scrollMarginTop:'100px'}} aria-label="AIandWEBservices pricing — AI automation and web development packages for small business">
      <div className="pricing-inner">
        <div className="pricing-header">
          <div className="panel-eyebrow">Pricing</div>
          <h2 className="panel-h2" style={{marginBottom:'24px'}}>Transparent pricing.<span className="pricing-br"><br/></span> No surprises.</h2>
          <div className="no-contract">No contracts — cancel or pause anytime</div>
          <p className="pricing-crosslinks">
            Scroll up to <a href="#services">Services</a> for detailed descriptions, or <a href="#contact">get a free audit</a> for a personalized recommendation.
          </p>
        </div>

        {/* AI Automation Starter — standalone chatbot card */}
        {AI_STARTER && (
          <div id="pricing-ai-starter" className="chatbot-solo" style={{scrollMarginTop:'100px'}}>
            <div className="cs-emoji"><Bot size={32} color="#60a5fa" strokeWidth={1.75} /></div>
            <div className="cs-body">
              <div className="cs-eyebrow">Standalone · Just the chatbot</div>
              <div className="cs-title">AI Automation Starter — Your First AI System</div>
              <div className="cs-desc">A custom AI automation and smart assistant system trained on your business, deployed on your website. Handles enquiries, qualifies leads, books calls, and answers FAQs — 24/7, without you.</div>
              <div className="cs-feats">
                {AI_STARTER.features.map(f => <span key={f} className="cs-feat">{f}</span>)}
              </div>
              <a href="#service-ai-starter" className="pr-whats-included" style={{display:'inline-block',marginTop:'8px'}}>What&apos;s included? ↑</a>
            </div>
            <div className="cs-price-block">
              <div className="cs-setup-lbl">One-time setup</div>
              <div className="cs-amount"><sup>$</sup>{AI_STARTER.setupFee}</div>
              <div className="cs-mo">then <strong>${AI_STARTER.monthlyFee}/month</strong></div>
              <a
                href={AI_STARTER.setupLinkLong || AI_STARTER.setupLinkShort}
                className="cs-btn"
                aria-label="Get started with AI Automation Starter"
              >
                Get Started
              </a>
            </div>
          </div>
        )}

        {/* Main 5 plan grid */}
        <div className="pricing-grid">
          {MAIN_TIERS.map(tier => <PrCard key={tier.slug} tier={tier} />)}
        </div>

        {/* Add-on Services */}
        <div id="pricing-addons" style={{scrollMarginTop:'100px'}}>
          <div className="pr-addons-lbl">Add-on Services</div>
          <div className="pr-addons-grid">
            <div className="pr-addon-card">
              <div className="pr-addon-icon"><Wallet size={28} color="#00D9FF" strokeWidth={1.75} /></div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">Crypto Payment Infrastructure</div>
                <div className="pr-addon-desc">Accept Bitcoin, stablecoins &amp; multi-chain payments on your site</div>
              </div>
              <div className="pr-addon-price">$499 setup</div>
            </div>
            <div className="pr-addon-card">
              <div className="pr-addon-icon"><ShoppingCart size={28} color="#00D9FF" strokeWidth={1.75} /></div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">E-commerce Integration</div>
                <div className="pr-addon-desc">Shopify or WooCommerce store built and connected to your site</div>
              </div>
              <div className="pr-addon-price">$499 setup</div>
            </div>
            <div className="pr-addon-card">
              <div className="pr-addon-icon"><Eye size={28} color="#00D9FF" strokeWidth={1.75} /></div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">Accessibility Audit (WCAG)</div>
                <div className="pr-addon-desc">Full WCAG 2.1 AA compliance audit and remediation report</div>
              </div>
              <div className="pr-addon-price">$299</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
