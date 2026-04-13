'use client';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xzdknjde', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

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

        {/* ── LEFT: Form ── */}
        <div className="contact-left">
          {status === 'success' ? (
            <div className="contact-form" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px',minHeight:'300px',textAlign:'center'}} role="alert" aria-live="polite">
              <div style={{fontSize:'48px'}}>✅</div>
              <div style={{fontSize:'18px',fontWeight:'700',color:'#fff'}}>You&apos;re all set!</div>
              <div style={{fontSize:'14px',color:'rgba(255,255,255,.6)',lineHeight:'1.7'}}>David will review your details and get back to you personally — guaranteed within 24 hours, usually much sooner.</div>
            </div>
          ) : (
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              <div style={{marginBottom:'16px'}}>
                <div style={{fontSize:'15px',fontWeight:'700',color:'#fff',marginBottom:'4px'}}>Send a Message</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,.45)'}}>Takes 2 minutes. No credit card. No obligation.</div>
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label htmlFor="first_name">First Name <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                  <input type="text" id="first_name" name="first_name" placeholder="Jane" required aria-required="true" autoComplete="given-name"/>
                </div>
                <div className="form-row">
                  <label htmlFor="last_name">Last Name <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                  <input type="text" id="last_name" name="last_name" placeholder="Smith" required aria-required="true" autoComplete="family-name"/>
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="email">Business Email <span aria-hidden="true" style={{color:'#f87171'}}>*</span></label>
                <input type="email" id="email" name="email" placeholder="jane@company.com" required aria-required="true" autoComplete="email"/>
              </div>
              <div className="form-row">
                <label htmlFor="phone">Phone <span style={{color:'rgba(255,255,255,.35)',fontWeight:400}}>(optional)</span></label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 000-0000" autoComplete="tel"/>
              </div>
              <div className="form-row">
                <label htmlFor="service">What are you most interested in?</label>
                <select id="service" name="service">
                  <option value="" disabled defaultValue="">Select a service...</option>
                  <option>AI Automation Starter</option>
                  <option>Presence Package</option>
                  <option>Growth Package</option>
                  <option>Revenue Engine Package</option>
                  <option>Consulting &amp; AI Strategy</option>
                  <option>Custom / Let&apos;s Talk</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="message">Tell us about your business</label>
                <textarea id="message" name="message" placeholder="What does your business do, and what's your biggest challenge right now?"></textarea>
              </div>
              <button type="submit" className="form-submit" disabled={status === 'sending'} aria-busy={status === 'sending'} aria-live="polite">
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Error — email david@aiandwebservices.com' : 'Get My Free Audit'}
              </button>
              <p className="form-note" role="note">🔒 Your info is never shared or sold. Guaranteed response within 6 hours — usually within minutes.</p>
            </form>
          )}
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
                style={{minWidth:'280px',width:'100%',height:'100%',minHeight:'420px',borderRadius:'12px',overflow:'hidden'}}
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
            <div className="ci-icon">✈️</div>
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
