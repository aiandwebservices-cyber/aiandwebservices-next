'use client';
import { useEffect } from 'react';

export default function Modals() {
  useEffect(() => {
    window.openModal = (id) => {
      const el = document.getElementById('modal-' + id);
      if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };
    window.closeModal = (id) => {
      const el = document.getElementById('modal-' + id);
      if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
    };
    const handler = (e) => {
      if (e.key === 'Escape') { window.closeModal('privacy'); window.closeModal('terms'); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div id="modal-privacy" className="modal-overlay" role="dialog" aria-modal="true" aria-label="Privacy Policy"
        onClick={(e) => { if (e.target === e.currentTarget) window.closeModal('privacy'); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => window.closeModal('privacy')} aria-label="Close">✕</button>
          <h2 className="modal-title">Privacy Policy</h2>
          <p className="modal-date">Last updated: April 2026</p>
          <div className="modal-body">
            <p>AIandWEBservices (&quot;we&quot;, &quot;I&quot;, &quot;our&quot;) operates the website at aiandwebservices.com. This policy explains what information we collect and how we use it.</p>
            <h3>Information We Collect</h3>
            <p>When you submit the contact form, we collect your name, email address, phone number (optional), and any message you write. We only use this to respond to your enquiry.</p>
            <h3>Google Analytics</h3>
            <p>With your consent, we use Google Analytics (GA4) to understand how visitors use the site. No personally identifiable information is sent to Google Analytics.</p>
            <h3>Cookies</h3>
            <p>This site uses a single cookie to remember your analytics consent preference. No advertising or tracking cookies are set without your explicit consent.</p>
            <h3>Third-Party Services</h3>
            <p>Contact form submissions are processed by Formspree (formspree.io). We do not sell, trade, or share your information with any other third parties.</p>
            <h3>Data Retention</h3>
            <p>Contact form submissions are retained only as long as necessary to respond to your enquiry. You may request deletion at any time by emailing AIandWEBservices@gmail.com.</p>
            <h3>Contact</h3>
            <p>Questions? Email <a href="mailto:AIandWEBservices@gmail.com">AIandWEBservices@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div id="modal-terms" className="modal-overlay" role="dialog" aria-modal="true" aria-label="Terms of Service"
        onClick={(e) => { if (e.target === e.currentTarget) window.closeModal('terms'); }}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => window.closeModal('terms')} aria-label="Close">✕</button>
          <h2 className="modal-title">Terms of Service</h2>
          <p className="modal-date">Last updated: April 2026</p>
          <div className="modal-body">
            <p>By using aiandwebservices.com or engaging AIandWEBservices for services, you agree to the following terms.</p>
            <h3>Services</h3>
            <p>AIandWEBservices provides AI automation, chatbot development, web design, SEO, and digital marketing services to small businesses and startups.</p>
            <h3>Payments</h3>
            <p>Setup fees are due prior to project start. Monthly retainers are billed in advance. All payments are non-refundable once work has commenced unless otherwise agreed in writing.</p>
            <h3>Intellectual Property</h3>
            <p>Upon full payment, the client owns all deliverables produced specifically for their project.</p>
            <h3>No Guarantees</h3>
            <p>AIandWEBservices cannot guarantee specific search rankings, revenue outcomes, or lead volumes.</p>
            <h3>Cancellation</h3>
            <p>Monthly retainers may be cancelled with 30 days written notice. No contracts or lock-in periods apply unless specified in a separate service agreement.</p>
            <h3>Governing Law</h3>
            <p>These terms are governed by the laws of the State of New York, United States.</p>
            <h3>Contact</h3>
            <p>Questions? Email <a href="mailto:AIandWEBservices@gmail.com">AIandWEBservices@gmail.com</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
