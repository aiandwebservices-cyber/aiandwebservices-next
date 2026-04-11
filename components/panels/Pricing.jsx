'use client';

function toggleSetup(btn) {
  const detail = btn.nextElementSibling;
  const isOpen = detail.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
  btn.textContent = isOpen ? 'Hide ↑' : "What's included?";
}

export default function Pricing() {
  return (
    <section className="panel" id="p5" aria-label="AIandWEBservices pricing — AI automation and web development packages for small business">
      <div className="pricing-inner">
        <div className="pricing-header">
          <div>
            <div className="panel-eyebrow">Pricing</div>
            <h2 className="panel-h2" style={{marginBottom:0}}>Transparent pricing. No surprises.</h2>
          </div>
          <div className="no-contract">No contracts — cancel or pause anytime</div>
        </div>

        <div className="chatbot-solo">
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
          </div>
          <div className="cs-price-block">
            <div className="cs-setup-lbl">One-time setup</div>
            <div className="cs-amount"><sup>$</sup>997</div>
            <div className="cs-mo">then <strong>$97/month</strong></div>
            <button className="cs-btn" onClick={() => window.go(7)} aria-label="Get started with standalone AI Chatbot">Get Started →</button>
          </div>
        </div>

        <div className="pricing-grid">
          {[
            { emoji:'🌱', name:'Presence', tagline:'Get found online', price:'297', setup:'$997', features:['Professional website (5 pages)','Local SEO + Google Business Profile','Basic AI inquiry assistant','Monthly performance report'], best:'Brand new businesses that need a professional foundation' },
            { emoji:'🚀', name:'Growth', tagline:'Turn visitors into leads', price:'597', setup:'$2,497', features:['Everything in Presence','AI automation & smart assistant','Email marketing + welcome sequence','SEO content (2 articles/month)','Conversion-optimized landing page'], best:'Established businesses ready to generate consistent leads' },
            { emoji:'⚡', name:'Revenue Engine', tagline:'Automate your sales process', price:'997', setup:'$3,997', popular:true, features:['Everything in Growth','Full sales funnel design & build','Workflow automation (Zapier/Make)','Paid ads setup (Google or Meta)','AI-powered CRM integration','Monthly strategy call with David'], best:'Businesses serious about scaling revenue without scaling headcount' },
            { emoji:'🧠', name:'AI-First', tagline:'Replace manual work with AI', price:'1,497', setup:'$5,497', features:['Everything in Revenue Engine','Advanced AI automation pipelines','Voice AI (answering + booking)','Programmatic SEO at scale','Social media AI scheduling','Full analytics dashboard'], best:'Owners who want to run a bigger business with the same size team' },
          ].map((plan) => (
            <div key={plan.name} className={`pr-card${plan.popular ? ' popular' : ''}`}>
              {plan.popular && <div className="pr-pop-badge">Most Popular</div>}
              <div className="pr-emoji">{plan.emoji}</div>
              <div className="pr-name">{plan.name}</div>
              <div className="pr-tagline">{plan.tagline}</div>
              <div className="pr-price"><div className="pr-price-n"><sup>$</sup>{plan.price}</div><div className="pr-price-per">/mo</div></div>
              <div className="pr-setup-wrap">
                <span className="pr-setup">+ {plan.setup} one-time setup</span>
                <button className="pr-setup-toggle" onClick={(e) => toggleSetup(e.currentTarget)} aria-expanded="false">What&apos;s included?</button>
                <div className="pr-setup-detail">Setup includes: discovery call, custom build, full integration, launch support, and 30 days of post-launch assistance.</div>
              </div>
              <ul className="pr-list">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="pr-best">Best for: {plan.best}</div>
              <button className="pr-btn" onClick={() => window.go(7)}>Get Started →</button>
            </div>
          ))}
          <div className="pr-card">
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
            <button className="pr-btn" onClick={() => window.go(7)}>Get Started →</button>
          </div>
        </div>

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
    </section>
  );
}
