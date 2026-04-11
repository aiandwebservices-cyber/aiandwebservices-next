export default function Services() {
  return (
    <section className="panel" id="p1">
      <div className="svc-panel">
        <div className="panel-eyebrow">AI Automation · Web Development · SEO · Marketing</div>
        <h2 className="panel-h2">Pick one. Or let us connect all six.</h2>
        <p className="panel-sub">Each service works standalone — but they&apos;re designed to feed each other. Most clients start with one and expand as they see results.</p>
        <div className="svc-cols">
          <div className="svc-cat cat-ai" aria-label="AI automation systems and chatbot development services">
            <div className="cat-header"><div className="cat-icon">🤖</div><div><div className="cat-name">AI &amp; Automation</div><div className="cat-outcome">Stop answering the same questions manually</div></div></div>
            <ul className="cat-list">
              <li>AI agents &amp; custom chatbots</li>
              <li>Voice AI (answering, booking)</li>
              <li>Workflow automation (Zapier/Make)</li>
              <li>AI-powered CRM (HubSpot, Salesforce)</li>
              <li>Content generation pipelines</li>
              <li>AI data dashboards &amp; reporting</li>
            </ul>
          </div>
          <div className="svc-cat cat-web" aria-label="Web development and website design services">
            <div className="cat-header"><div className="cat-icon">🌐</div><div><div className="cat-name">Web Development</div><div className="cat-outcome">A site that ranks, loads fast, and converts</div></div></div>
            <ul className="cat-list">
              <li>Web app / SaaS MVP development</li>
              <li>E-commerce (Shopify, WooCommerce)</li>
              <li>Landing page optimization (CRO)</li>
              <li>Speed &amp; performance optimization</li>
              <li>Maintenance &amp; hosting management</li>
              <li>Accessibility compliance (WCAG)</li>
            </ul>
          </div>
          <div className="svc-cat cat-crypto" style={{borderColor:'rgba(37,99,235,.12)'}} aria-label="Crypto payment gateway integration services">
            <div className="cat-header"><div className="cat-icon">💳</div><div><div className="cat-name">Crypto Payments</div><div className="cat-outcome">Accept crypto without the technical headache</div></div></div>
            <ul className="cat-list">
              <li>Crypto payment gateway integration</li>
              <li>Multi-chain wallet support</li>
              <li>Stablecoin checkout flows</li>
              <li>On/off ramp implementation</li>
              <li>NFT gating &amp; token access</li>
              <li>Payment analytics &amp; reconciliation</li>
            </ul>
          </div>
          <div className="svc-cat cat-seo" aria-label="SEO and content marketing services">
            <div className="cat-header"><div className="cat-icon">📈</div><div><div className="cat-name">SEO &amp; Content</div><div className="cat-outcome">Show up when your customers search for you</div></div></div>
            <ul className="cat-list">
              <li>Technical SEO audits</li>
              <li>Local SEO &amp; Google Business Profile</li>
              <li>AI-assisted content strategy</li>
              <li>Programmatic SEO at scale</li>
              <li>YouTube &amp; video SEO</li>
              <li>Link building &amp; digital PR</li>
            </ul>
          </div>
          <div className="svc-cat cat-mkt" aria-label="Marketing automation and lead generation services">
            <div className="cat-header"><div className="cat-icon">🎯</div><div><div className="cat-name">Marketing &amp; Lead Gen</div><div className="cat-outcome">Turn strangers into paying customers automatically</div></div></div>
            <ul className="cat-list">
              <li>Email marketing automation</li>
              <li>Sales funnel design &amp; build</li>
              <li>Paid ads (Google, Meta)</li>
              <li>Social media AI scheduling</li>
              <li>Analytics setup (GA4, heatmaps)</li>
              <li>Attribution &amp; conversion tracking</li>
            </ul>
          </div>
          <div className="svc-cat cat-cs" aria-label="AI consulting and digital strategy services">
            <div className="cat-header"><div className="cat-icon">🧠</div><div><div className="cat-name">Consulting &amp; Strategy</div><div className="cat-outcome">Know exactly where AI fits before you spend a dollar</div></div></div>
            <ul className="cat-list">
              <li>AI readiness audits</li>
              <li>Digital transformation consulting</li>
              <li>AI tool stack recommendations</li>
              <li>Staff AI training &amp; workshops</li>
              <li>Full-funnel growth planning</li>
              <li>Fractional AI advisor (ongoing)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
