import Link from 'next/link';
import Image from 'next/image';
import { posts } from '@/lib/posts';

export default function Blog() {
  return (
    <section className="panel" id="p6" aria-label="AIandWEBservices blog — AI automation and small business growth tips">
      <div className="blog-inner">
        <div className="blog-header">
          <div className="panel-eyebrow">Blog</div>
          <h2 className="panel-h2">AI &amp; growth tips for small businesses</h2>
          <p className="panel-sub">Easy to understand guides on AI automation, SEO, and web strategy — written for business owners, not developers.</p>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <div key={post.title} className={`blog-card${post.source === 'AIandWEBservices' ? ' blog-card--ours' : ''}`}>
              <div className="blog-card-img" aria-hidden="true">
                {post.source === 'AIandWEBservices'
                  ? <Image src="/logo-icon.jpg" alt="AIandWEBservices" width={180} height={180} style={{objectFit:'contain',height:'100%',width:'auto'}} />
                  : post.emoji}
              </div>
              <div className="blog-card-body">
                <div className="blog-card-tag">{post.tag}</div>
                <div className="blog-card-title">{post.title}</div>
                <div className="blog-card-desc">{post.desc}</div>
                <div className="blog-card-footer">
                  <span className="blog-card-date">{post.date}</span>
                  <Link href={`/blog/${post.slug}`} className="blog-card-link" aria-label={`Read: ${post.title}`}>Read →</Link>
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
