import { posts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPostingSchema, BreadcrumbSchema } from '@/components/Schema';

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

function cap(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const pageTitle = cap(`${post.title} | AIandWEBservices Blog`, 60);
  const pageDesc = cap(post.desc, 160);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedDesc = encodeURIComponent(post.desc);
  return {
    title: pageTitle,
    description: pageDesc,
    alternates: { canonical: `https://www.aiandwebservices.com/blog/${slug}` },
    openGraph: {
      title: cap(post.title, 60),
      description: pageDesc,
      url: `https://www.aiandwebservices.com/blog/${slug}`,
      siteName: 'AIandWEBservices',
      type: 'article',
      images: [{ url: `https://www.aiandwebservices.com/api/og?title=${encodedTitle}&description=${encodedDesc}&type=blog`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cap(post.title, 60),
      description: pageDesc,
      images: [`https://www.aiandwebservices.com/api/og?title=${encodedTitle}&description=${encodedDesc}&type=blog`],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <div style={{background:'#f8fafc',minHeight:'100vh'}}>
      <BlogPostingSchema post={post} slug={slug} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.aiandwebservices.com' },
        { name: 'Blog', url: 'https://www.aiandwebservices.com/#blog' },
        { name: cap(post.title, 60), url: `https://www.aiandwebservices.com/blog/${slug}` },
      ]} />
      {/* Nav */}
      <header style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid #e5e7eb',padding:'0 5vw',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{textDecoration:'none',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'17px',color:'#0D1B2E'}}>
          AI<span style={{color:'#2AA5A0'}}>and</span>WEB<span style={{color:'#2AA5A0',fontWeight:600,fontSize:'14px'}}>services</span>
        </Link>
        <Link href="/#blog" style={{fontSize:'13px',color:'#6b7280',textDecoration:'none',fontWeight:500}}>← Back to Blog</Link>
      </header>

      {/* Article */}
      <main style={{maxWidth:'720px',margin:'0 auto',padding:'48px 5vw 80px'}}>
        <div style={{display:'inline-block',background:'#eff6ff',color:'#2563eb',fontSize:'11px',fontWeight:800,letterSpacing:'1.5px',textTransform:'uppercase',padding:'4px 12px',borderRadius:'50px',marginBottom:'20px'}}>{post.tag}</div>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'clamp(26px,4vw,42px)',fontWeight:800,lineHeight:1.15,color:'#0D1B2E',marginBottom:'16px',letterSpacing:'-0.5px'}}>{post.title}</h1>
        <p style={{fontSize:'18px',color:'#6b7280',lineHeight:1.7,marginBottom:'32px',borderBottom:'1px solid #e5e7eb',paddingBottom:'32px'}}>{post.desc}</p>

        <div style={{fontSize:'15px',lineHeight:1.85,color:'#374151'}}>
          {paragraphs.map((block, i) => {
            if (block.startsWith('## ')) {
              return <h2 key={i} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',fontWeight:800,color:'#0D1B2E',marginTop:'40px',marginBottom:'12px'}}>{block.replace('## ','')}</h2>;
            }
            if (block.startsWith('**') && block.endsWith('**') && block.split('**').length === 3) {
              return <p key={i} style={{fontWeight:700,color:'#0D1B2E',marginBottom:'8px'}}>{block.replace(/\*\*/g,'')}</p>;
            }
            if (block.match(/^\*\*.*\*\*/)) {
              const parts = block.split(/(\*\*.*?\*\*)/g);
              return <p key={i} style={{marginBottom:'16px'}}>{parts.map((p,j) => p.startsWith('**') ? <strong key={j} style={{color:'#0D1B2E'}}>{p.replace(/\*\*/g,'')}</strong> : p)}</p>;
            }
            if (block.startsWith('- ') || block.startsWith('* ')) {
              const items = block.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '));
              return <ul key={i} style={{paddingLeft:'20px',marginBottom:'16px'}}>{items.map((item,j) => <li key={j} style={{marginBottom:'6px'}}>{item.replace(/^[-*] /,'')}</li>)}</ul>;
            }
            if (block.includes('[') && block.includes('](/')) {
              const parts = block.split(/(\[.*?\]\(.*?\))/g);
              return <p key={i} style={{marginBottom:'16px'}}>{parts.map((p,j) => {
                const m = p.match(/\[(.*?)\]\((.*?)\)/);
                return m ? <Link key={j} href={m[2]} style={{color:'#2563eb',fontWeight:600}}>{m[1]}</Link> : p;
              })}</p>;
            }
            return block.trim() ? <p key={i} style={{marginBottom:'16px'}}>{block}</p> : null;
          })}
        </div>

        {/* Source */}
        <div style={{marginTop:'48px',padding:'16px 20px',background:'#f1f5f9',borderRadius:'10px',fontSize:'13px',color:'#6b7280'}}>
          Source: <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb'}}>{post.source}</a>, {post.date}
        </div>

        {/* CTA */}
        <div style={{marginTop:'48px',background:'linear-gradient(135deg,#0D1B2E,#1e3a5f)',borderRadius:'20px',padding:'40px',textAlign:'center'}}>
          <div style={{fontSize:'13px',fontWeight:800,letterSpacing:'2px',textTransform:'uppercase',color:'#2AA5A0',marginBottom:'12px'}}>Ready to Take Action?</div>
          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',fontWeight:800,color:'#fff',marginBottom:'12px'}}>Find out what AI is worth for your business</h3>
          <p style={{color:'rgba(255,255,255,.6)',fontSize:'14px',marginBottom:'24px'}}>Free audit. No jargon. A straight answer about where to start.</p>
          <Link href="/#contact" style={{display:'inline-block',background:'#2AA5A0',color:'#fff',fontWeight:700,fontSize:'15px',padding:'14px 32px',borderRadius:'50px',textDecoration:'none'}}>Get Your Free AI Audit →</Link>
        </div>
      </main>
    </div>
  );
}
