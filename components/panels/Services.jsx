'use client';
import Link from 'next/link';
import { Bot, Sprout, TrendingUp, Zap, Brain, Target, Wallet, ShoppingCart, Eye } from 'lucide-react';

const MAIN_PLANS = [
  { Icon: Sprout, iconColor:'#34d399', name:'Presence', tagline:'Get found online', price:'99', setup:'$39', features:['Professional website (5 pages)','Local SEO + Google Business Profile','Basic AI inquiry assistant','Monthly performance report'], best:'Brand new businesses that need a professional foundation', serviceHref:'/services/presence', pricingId:'pricing-presence' },
  { Icon: TrendingUp, iconColor:'#34d399', name:'Growth', tagline:'Turn visitors into leads', price:'149', setup:'$59', features:['Everything in Presence','AI automation & smart assistant','Email marketing + welcome sequence','SEO content (2 articles/month)','Conversion-optimized landing page'], best:'Established businesses ready to generate consistent leads', serviceHref:'/services/growth', pricingId:'pricing-growth' },
  { Icon: Zap, iconColor:'#a78bfa', name:'Revenue Engine', tagline:'Automate your sales process', price:'249', setup:'$99', popular:true, features:['Everything in Growth','Full sales funnel design & build','Workflow automation & integration','Paid ads setup (Google or Meta)','AI-powered CRM integration','Monthly strategy call with David'], best:'Businesses serious about scaling revenue without scaling headcount', serviceHref:'/services/revenue-engine', pricingId:'pricing-revenue-engine' },
  { Icon: Brain, iconColor:'#60a5fa', name:'AI-First', tagline:'Replace manual work with AI', price:'349', setup:'$199', features:['Everything in Revenue Engine','Advanced AI automation pipelines','Voice AI (answering + booking)','Programmatic SEO at scale','Social media AI scheduling','Full analytics dashboard'], best:'Owners who want to run a bigger business with the same size team', serviceHref:'/services/ai-first', pricingId:'pricing-ai-first' },
  { Icon: Target, iconColor:'#f87171', name:'Consulting', tagline:'Know exactly where to start', price:'99', priceLabel:' once', setup:'or $99/mo', features:['AI readiness audit','Digital transformation roadmap','Tool stack recommendations','Staff AI training & workshops','Fractional AI advisor (ongoing)'], best:'Businesses that want expert guidance before committing to a full build', serviceHref:'/services/consulting', pricingId:'pricing-consulting', consultingLink:'/services/consulting' },
];

function PrCard({ plan }) {
  const { Icon, iconColor } = plan;
  return (
    <div id={plan.pricingId} className={`pr-card${plan.popular ? ' popular' : ''}`} style={{scrollMarginTop:'100px'}}>
      {plan.popular && <div className="pr-pop-badge">Most Popular</div>}
      <div className="pr-emoji"><Icon size={20} color={iconColor || '#00D9FF'} strokeWidth={1.75} /></div>
      <div className="pr-name">{plan.name}</div>
      <div className="pr-tagline">{plan.tagline}</div>
      <div className="pr-price">
        <div className="pr-price-n"><sup>$</sup>{plan.price}</div>
        <div className="pr-price-per">{plan.priceLabel || '/mo'}</div>
      </div>
      <div className="pr-setup-wrap">
        <span className="pr-setup">+ {plan.setup}{plan.priceLabel ? '' : ' one-time setup'}</span>
      </div>
      <ul className="pr-list">
        {plan.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <div className="pr-best">Best for: {plan.best}</div>
      <Link href={plan.serviceHref} className="pr-btn pr-btn-link">Get More Info</Link>
    </div>
  );
}

export default function Services() {
  return (
    <section className="panel" id="services" style={{scrollMarginTop:'100px'}} aria-label="AIandWEBservices pricing — AI automation and web development packages for small business">
      <div className="pricing-inner">
        <div className="pricing-header">
          <div className="panel-eyebrow">Services</div>
          <h2 className="panel-h2" style={{marginBottom:'24px'}}>Transparent pricing.<span className="pricing-br"><br/></span> No surprises.</h2>
          <div className="no-contract">No contracts — cancel or pause anytime</div>
          <p className="pricing-crosslinks">
            <a href="/services/consulting">Not sure which plan fits?</a> Get a <a href="#contact">free audit</a> for a personalized recommendation.
          </p>
        </div>

        {/* AI Automation Starter — standalone chatbot card */}
        <div id="pricing-ai-starter" className="chatbot-solo" style={{scrollMarginTop:'100px'}}>
          <div className="cs-emoji"><Bot size={32} color="#60a5fa" strokeWidth={1.75} /></div>
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
            <Link href="/services/ai-automation-starter" className="pr-whats-included" style={{display:'inline-block',marginTop:'8px'}}>What&apos;s included? →</Link>
          </div>
          <div className="cs-price-block">
            <div className="cs-setup-lbl">One-time setup</div>
            <div className="cs-amount"><sup>$</sup>99</div>
            <div className="cs-mo">then <strong>$99/month</strong></div>
            <Link href="/services/ai-automation-starter" className="cs-btn cs-btn-link" aria-label="Get more info about AI Automation Starter">Get More Info</Link>
          </div>
        </div>

        {/* All 5 main plans — always visible */}
        <div className="pricing-grid">
          {MAIN_PLANS.map(plan => <PrCard key={plan.name} plan={plan} />)}
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
