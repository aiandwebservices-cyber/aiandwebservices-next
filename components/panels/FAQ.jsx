'use client';

const faqs = [
  { q: 'How long does it take to build an AI automation system?', a: 'Most AI automation systems and chatbots are live within 7–14 days. The timeline depends on complexity — a basic inquiry bot is faster than a full CRM-integrated voice AI system. We discuss timelines during your free audit.' },
  { q: 'Do I need technical knowledge to work with you?', a: 'None at all. I handle everything from strategy to build to launch. You explain your business, I build the systems. Most clients have zero technical background.' },
  { q: 'What happens if I want to cancel my monthly retainer?', a: 'No lock-in, no penalties. Just give 30 days written notice and you\'re done. No contracts, no hoops to jump through.' },
  { q: 'Will the AI chatbot actually sound like a human?', a: 'Modern AI conversations are indistinguishable from human responses in most cases. Your chatbot is trained specifically on your business — your tone, your FAQs, your offers. It\'s not a generic bot.' },
  { q: 'How does SEO work and how long before I see results?', a: 'SEO is a long-term play — most clients see meaningful movement in 3–6 months. Technical fixes and Google Business Profile optimisation can show results faster. I focus on sustainable rankings, not tricks that get penalised.' },
  { q: 'Can you work with my existing website or do I need a new one?', a: 'Both. I can optimise and improve an existing site, or build a new one from scratch. The recommendation depends on what\'s holding you back — we cover this in the free audit.' },
  { q: 'What\'s included in the free AI audit?', a: 'A plain-English breakdown of where your biggest opportunities are — whether that\'s SEO, a chatbot, automation, or your website. No pitch, no pressure. Just an honest assessment from David.' },
  { q: 'Do you offer crypto payment options?', a: 'Yes. I accept Bitcoin, stablecoins, and major cryptocurrencies for all services. I also build crypto payment infrastructure for businesses that want to accept crypto from their own customers.' },
];

export default function FAQ() {
  function toggleFaq(item) {
    item.classList.toggle('open');
  }

  return (
    <section className="panel" id="p7" aria-label="Frequently asked questions about AIandWEBservices">
      <div className="faq-inner">
        <div className="panel-eyebrow">FAQ</div>
        <h2 className="panel-h2">Questions people always ask</h2>
        <div className="faq-cols">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" onClick={(e) => toggleFaq(e.currentTarget)}>
              <div className="faq-q">
                {faq.q}
                <span className="faq-icon" aria-hidden="true">+</span>
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
        <div className="faq-cta-strip">
          <p><strong>Still have questions?</strong> The free audit is the easiest way to get real answers for your specific situation.</p>
          <button className="blog-btn" onClick={() => window.go(7)}>Get a Free Audit →</button>
        </div>
      </div>
    </section>
  );
}
