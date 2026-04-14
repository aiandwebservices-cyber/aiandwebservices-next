'use client';
import { useEffect } from 'react';

export default function Contact() {
  useEffect(() => {
    const w = 'https://tally.so/widgets/embed.js';
    if (typeof window.Tally !== 'undefined') {
      window.Tally.loadEmbeds();
    } else if (!document.querySelector(`script[src="${w}"]`)) {
      const s = document.createElement('script');
      s.src = w;
      s.onload = () => window.Tally?.loadEmbeds();
      s.onerror = () => window.Tally?.loadEmbeds();
      document.body.appendChild(s);
    }
  }, []);

  return (
    <section className="panel" id="p8" aria-label="Contact David Pulis — Get a Free AI Audit">
      <div className="contact-bg"></div>
      <div className="contact-inner">

        {/* ── HEADER ── */}
        <div className="contact-header">
          <div className="panel-eyebrow">
            Free AI Audit
          </div>
          <h2 className="panel-h2" style={{fontSize:'clamp(20px,2.4vw,30px)',marginBottom:'6px',color:'#2AA5A0'}}>Tell me about your business. I&apos;ll tell you exactly where AI can help.</h2>
          <p className="panel-sub" style={{fontSize:'14px',lineHeight:'1.6',maxWidth:'680px'}}>Fill in your details or book a call — David personally responds within 6 hours, no pitch, no obligation.</p>
        </div>

        {/* ── STEPS 2×2 ── */}
        <div className="contact-steps">
          {[
            { n:'1', cls:'csn-1', title:'Fill out the form — takes 2 minutes', desc:"Tell David about your business, your biggest challenge, and what you're looking to achieve." },
            { n:'2', cls:'csn-2', title:'Get your free audit — within 6 hours', desc:'David personally reviews your business and identifies where AI, SEO, or a better website would have the biggest revenue impact.' },
            { n:'3', cls:'csn-3', title:'Decide with zero pressure', desc:"You get real, actionable advice — whether you work with David or not. No hard sell, ever." },
            { n:'4', cls:'csn-4', title:'Book a call to talk it through', desc:"Prefer to discuss live? Use the calendar to pick a time that works — 30 minutes, your questions answered." },
          ].map(({ n, cls, title, desc }) => (
            <div key={n} className="contact-step">
              <div className={`contact-step-n ${cls}`}>{n}</div>
              <div>
                <div className="contact-step-title">{title}</div>
                <div className="contact-step-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── LEFT: Tally Form ── */}
        <div className="contact-left">
          <div className="contact-form" style={{padding:'0',overflow:'hidden'}}>
            <iframe
              data-tally-src="https://tally.so/embed/9qEV1Q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="821"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Contact David Pulis — Get a Free AI Audit"
            />
          </div>
        </div>

        {/* ── RIGHT: Calendly ── */}
        <div className="contact-right">
          <div className="contact-form calendly-wrap" style={{display:'flex',flexDirection:'column'}}>
            <div style={{textAlign:'center',marginBottom:'12px'}}>
              <div style={{fontSize:'20px',fontWeight:'800',color:'#fff',marginBottom:'4px'}}>Let&apos;s Talk!</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,.5)'}}>Pick a time that works — 30 minutes, no pressure.</div>
            </div>
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/aiandwebservices/30min?primary_color=2aa5a0&hide_event_type_details=1&hide_gdpr_banner=1&background_color=111827&text_color=ffffff"
                style={{minWidth:'280px',width:'100%',height:'100%',minHeight:'0',borderRadius:'12px',overflow:'hidden'}}
              />
            </div>
          </div>
        </div>

        {/* ── FOOTER: contact info centered ── */}
        <div className="contact-footer">
          <a href="mailto:david@aiandwebservices.com" className="ci-row" style={{textDecoration:'none'}}>
            <div className="ci-icon">📧</div>
            <span style={{color:'#60A5FA',fontWeight:500}}>david@aiandwebservices.com</span>
          </a>
          <a href="tel:+13155720710" className="ci-row" style={{textDecoration:'none'}}>
            <div className="ci-icon">📞</div>
            <span style={{color:'#60A5FA',fontWeight:500}}>(315) 572-0710</span>
          </a>
          <a href="https://t.me/aiandwebservices" target="_blank" rel="noopener noreferrer" className="ci-row" style={{textDecoration:'none'}} aria-label="@aiandwebservices on Telegram (opens in new tab)">
            <div className="ci-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.668l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.957.891z" fill="#29B6F6"/></svg></div>
            <span style={{color:'#60A5FA',fontWeight:500}}>@aiandwebservices</span>
          </a>
          <div className="ci-row">
            <div className="ci-icon">⚡</div>
            <span style={{textAlign:'center'}}>Guaranteed response <strong style={{color:'#fff'}}>within 6 hours</strong><br/><span className="ci-minutes">— usually within minutes</span></span>
          </div>
        </div>

      </div>
    </section>
  );
}
