const posts = [
  { emoji:'💰', tag:'AI ROI', title:'66% of Small Businesses Using AI Save $500–$2,000 Every Month', desc:"The numbers are in — AI automation pays for itself fast. Here's what small businesses are actually saving and how they're doing it.", date:'Uplyft Capital, 2026', url:'https://uplyftcapital.com/small-business-blog/small-businesses-using-ai-scale-2026' },
  { emoji:'📈', tag:'Revenue Growth', title:'91% of Small Businesses Say AI Directly Boosts Their Revenue', desc:"Nine out of ten SMB owners report measurable revenue growth after adopting AI. What are they doing differently — and how can you do the same?", date:'Neuwark, 2026', url:'https://neuwark.com/blog/ai-for-small-business-2026-complete-guide' },
  { emoji:'🌍', tag:'Market Trends', title:'The Global AI Market for Small Businesses Hit $20 Billion in 2026', desc:"AI for small business is no longer a niche — it's a $20 billion industry. What's driving the boom and what does it mean for your business?", date:'AllGreatThings, 2026', url:'https://allgreatthings.io/blog/ai-tools-marketing-automation/ai-agents-smb-2026-guide' },
  { emoji:'⚙️', tag:'Cost Savings', title:"Businesses Cut Operational Costs by 35% in Their First Year of AI", desc:"McKinsey's 2025 data shows AI automation delivers a 35% reduction in operational costs within 12 months. Here's where the savings come from.", date:'McKinsey, 2025', url:'https://adai.news/resources/statistics/ai-automation-statistics-2026/' },
  { emoji:'🚀', tag:'Growth vs Decline', title:'83% of Growing SMBs Use AI — Only 55% of Declining Ones Do', desc:"The data is stark: businesses that adopt AI grow. Businesses that don't, fall behind. Here's what separates the two groups in 2026.", date:'ADAI, 2026', url:'https://adai.news/resources/statistics/small-business-ai-statistics-2026/' },
  { emoji:'⏱️', tag:'Competitive Pressure', title:'8 in 10 Companies Feel Urgency to Speed Up AI Adoption Now', desc:"The window to get ahead of competitors with AI is closing. Four out of five businesses say they need to move faster — here's how to start today.", date:'GoCourant, 2026', url:'https://gocourant.com/how-ai-automation-for-business-can-transform/' },
];

export default function Blog() {
  return (
    <section className="panel" id="p6" aria-label="AIandWEBservices blog — AI automation and small business growth tips">
      <div className="blog-inner">
        <div className="blog-header">
          <div className="panel-eyebrow">Blog</div>
          <h2 className="panel-h2">AI &amp; growth tips for small businesses</h2>
          <p className="panel-sub">Plain-English guides on AI automation, SEO, and web strategy — written for business owners, not developers.</p>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <div key={post.title} className="blog-card">
              <div className="blog-card-img" aria-hidden="true">{post.emoji}</div>
              <div className="blog-card-body">
                <div className="blog-card-tag">{post.tag}</div>
                <div className="blog-card-title">{post.title}</div>
                <div className="blog-card-desc">{post.desc}</div>
                <div className="blog-card-footer">
                  <span className="blog-card-date">{post.date}</span>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="blog-card-link" aria-label={`Read: ${post.title} (opens in new tab)`}>Read →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="blog-cta">
          <div className="blog-cta-box">
            <div className="blog-cta-text"><strong>More articles on the way.</strong> Deep dives into AI automation, SEO, and growth strategies — all written for small business owners, not developers.</div>
            <a href="https://blog.aiandwebservices.com" target="_blank" rel="noopener noreferrer" className="blog-btn">Visit the Blog →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
