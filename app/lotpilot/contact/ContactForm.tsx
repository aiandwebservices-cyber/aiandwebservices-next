'use client';

import { useState, type FormEvent } from 'react';
import Button from '../components/Button';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'err'; msg: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/lotpilot/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Request failed');
      }
      setStatus({ kind: 'ok' });
      form.reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setStatus({ kind: 'err', msg });
    }
  }

  const sending = status.kind === 'sending';

  return (
    <form className="lp-form" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="name">Your name</label>
        <input className="lp-input" id="name" name="name" required autoComplete="name" />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div>
          <label htmlFor="email">Email</label>
          <input className="lp-input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input className="lp-input" id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div>
        <label htmlFor="dealership">Dealership name</label>
        <input className="lp-input" id="dealership" name="dealership" required autoComplete="organization" />
      </div>

      <div>
        <label htmlFor="message">What can we help with?</label>
        <textarea className="lp-textarea" id="message" name="message" required />
      </div>

      <Button type="submit" variant="filled" size="lg">
        {sending ? 'Sending…' : 'Send message →'}
      </Button>

      {status.kind === 'ok' && (
        <div className="lp-form-status lp-form-status--ok">
          Got it. We&apos;ll be in touch within one business day.
        </div>
      )}
      {status.kind === 'err' && (
        <div className="lp-form-status lp-form-status--err">
          Couldn&apos;t send: {status.msg}. Email demo@lotpilot.ai instead.
        </div>
      )}
    </form>
  );
}
