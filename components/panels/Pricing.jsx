'use client';
import { useState } from 'react';
import Link from 'next/link';

const ALWAYS_VISIBLE = [
  { emoji:'🚀', name:'Growth', tagline:'Turn visitors into leads', price:'597', setup:'$2,497', features:['Everything in Presence','AI automation & smart assistant','Email marketing + welcome sequence','SEO content (2 articles/month)','Conversion-optimized landing page'], best:'Established businesses ready to generate consistent leads', serviceAnchor:'#service-growth' },
  { emoji:'⚡', name:'Revenue Engine', tagline:'Automate your sales process', price:'997', setup:'$3,997', popular:true, features:['Everything in Growth','Full sales funnel design & build','Workflow automation (Zapier/Make)','Paid ads setup (Google or Meta)','AI-powered CRM integration','Monthly strategy call with David'], best:'Businesses serious about scaling revenue without scaling headcount', serviceAnchor:'#service-revenue-engine' },
  { emoji:'🧠', name:'AI-First', tagline:'Replace manual work with AI', price:'1,497', setup:'$5,497', features:['Everything in Revenue Engine','Advanced AI automation pipelines','Voice AI (answering + booking)','Programmatic SEO at scale','Social media AI scheduling','Full analytics dashboard'], best:'Owners who want to run a bigger business with the same size team', serviceAnchor:'#service-ai-first' },
];

const EXTRA_PLANS = [
  { emoji:'🌱', name:'Presence', tagline:'Get found online', price:'297', setup:'$997', features:['Professional website (5 pages)','Local SEO + Google Business Profile','Basic AI inquiry assistant','Monthly performance report'], best:'Brand new businesses that need a professional foundation', serviceAnchor:'#service-presence' },
];

function PrCard({ plan }) {
  const idMap = {
    'Growth': 'pricing-growth',
    'Revenue Engine': 'pricing-revenue-engine',
    'AI-First': 'pricing-ai-first',
    'Presence': 'pricing-presence',
  };
  return (
    <div id={idMap[plan.name]} className={`pr-card${plan.popular ? ' popular' : ''}`} style={{scrollMarginTop:'100px'}}>
      {plan.popular && <div className="pr-pop-badge">Most Popular</div>}
      <div className="pr-emoji">{plan.emoji}</div>
      <div className="pr-name">{plan.name}</div>
      <div className="pr-tagline">{plan.tagline}</div>
      <div className="pr-price"><div className="pr-price-n"><sup>$</sup>{plan.price}</div><div className="pr-price-per">/mo</div></div>
      <div className="pr-setup-wrap">
        <span className="pr-setup">+ {plan.setup} one-time setup</span>
      </div>
      <ul className="pr-list">
        {plan.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <div className="pr-best">Best for: {plan.best}</div>
      <a href={plan.serviceAnchor} className="pr-whats-included">What&apos;s included? ↑</a>
      <button className="pr-btn" onClick={() => window.go && window.go(7)}>Get Started</button>
    </div>
  );
}

export default function Pricing() {
  const [showAll, setShowAll] = useState(false);

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

        {/* Toggle link */}
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <button className="pricing-toggle-link" onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Show fewer plans ↑' : 'Looking for something different? See all plans ↓'}
          </button>
        </div>

        {/* Expanded: AI Starter (chatbot-solo style) + Presence */}
        {showAll && (
          <>
            <div id="pricing-ai-starter" className="chatbot-solo" style={{scrollMarginTop:'100px'}}>
              <div className="cs-emoji">🤖</div>
              <div className="cs-body">
                <div className="cs-eyebrow">Standalone · Just the chatbot</div>
                <div className="cs-title">AI Automation Starter — Your First AI System</div>
                <div className="cs-desc">A custom AI automation and smart assistant system trained on your business, deployed on your website. Handles enquiries, qualifies leads, books calls, and answers FAQs — 24/7, without you.</div>
                <div className="cs-feats">
                  <span className="cs-feat">Trained on your business</span>
                  <span className="cs-feat">Books calls to your calendar</span>
                  <span className="cs-feat">CRM integration</span>
                  <span className="cs-feat">FAQ handling</span>
                  <span className="cs-feat">Monthly updates included</span>
                </div>
                <a href="#service-ai-starter" className="pr-whats-included" style={{display:'inline-block',marginTop:'8px'}}>What&apos;s included? ↑</a>
              </div>
              <div className="cs-price-block">
                <div className="cs-setup-lbl">One-time setup</div>
                <div className="cs-amount"><sup>$</sup>997</div>
                <div className="cs-mo">then <strong>$97/month</strong></div>
                <Link href="/services/ai-automation" className="cs-btn cs-btn-link" aria-label="Get more info about AI Automation Starter">Get More Info</Link>
              </div>
            </div>

            <div className="pricing-grid" style={{marginBottom:'24px'}}>
              {EXTRA_PLANS.map(plan => <PrCard key={plan.name} plan={plan} />)}
            </div>
          </>
        )}

        {/* Always visible: Growth, Revenue Engine, AI-First */}
        <div className="pricing-grid">
          {ALWAYS_VISIBLE.map(plan => <PrCard key={plan.name} plan={plan} />)}
        </div>

        {/* Consulting — always visible */}
        <div className="pricing-grid" style={{marginTop:'0'}}>
          <div id="pricing-consulting" className="pr-card" style={{scrollMarginTop:'100px'}}>
            <div className="pr-emoji">🎯</div>
            <div className="pr-name">Consulting</div>
            <div className="pr-tagline">Know exactly where to start</div>
            <div className="pr-price"><div className="pr-price-n"><sup>$</sup>497</div><div className="pr-price-per"> once</div></div>
            <div className="pr-setup" style={{fontSize:'10px',color:'var(--muted)',marginBottom:'8px'}}>or $1,497/mo as fractional advisor</div>
            <ul className="pr-list">
              <li>AI readiness audit</li>
              <li>Digital transformation roadmap</li>
              <li>Tool stack recommendations</li>
              <li>Staff AI training &amp; workshops</li>
              <li>Fractional AI advisor (ongoing)</li>
            </ul>
            <div className="pr-best">Best for: Businesses that want expert guidance before committing to a full build</div>
            <a href="#service-consulting" className="pr-whats-included">What&apos;s included? ↑</a>
            <Link href="/services/consulting-strategy" className="pr-btn pr-btn-link">Get More Info</Link>
          </div>
        </div>

        {/* Add-ons */}
        <div id="pricing-addons" style={{scrollMarginTop:'100px'}}>
          <div className="pr-addons-lbl">Add-on Services</div>
          <div className="pr-addons-grid">
            <div className="pr-addon-card">
              <div className="pr-addon-icon">💳</div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">Crypto Payment Infrastructure</div>
                <div className="pr-addon-desc">Accept Bitcoin, stablecoins &amp; multi-chain payments on your site</div>
              </div>
              <div className="pr-addon-price">$997 setup</div>
            </div>
            <div className="pr-addon-card">
              <div className="pr-addon-icon">🛒</div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">E-commerce Integration</div>
                <div className="pr-addon-desc">Shopify or WooCommerce store built and connected to your site</div>
              </div>
              <div className="pr-addon-price">from $1,497</div>
            </div>
            <div className="pr-addon-card">
              <div className="pr-addon-icon">♿</div>
              <div className="pr-addon-body">
                <div className="pr-addon-name">Accessibility Audit (WCAG)</div>
                <div className="pr-addon-desc">Full WCAG 2.1 AA compliance audit and remediation report</div>
              </div>
              <div className="pr-addon-price">$497</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
