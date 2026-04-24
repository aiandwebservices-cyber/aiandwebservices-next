'use client'
import { useState } from 'react'
import { Send, X, AlertTriangle, Check } from 'lucide-react'
import { capture } from '../lib/posthog'
import type { Lead } from '../lib/types'

interface SendDraftModalProps {
  lead: Lead
  draft: { subject: string; body: string }
  onClose: () => void
}

type SendState = 'idle' | 'sending' | 'success' | 'error'

export function SendDraftModal({ lead, draft, onClose }: SendDraftModalProps) {
  const [toEmail, setToEmail] = useState(lead.email)
  const [state, setState] = useState<SendState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [enrollInSequence, setEnrollInSequence] = useState(true)

  const emailMatches = toEmail.trim().toLowerCase() === lead.email.toLowerCase()
  const canSend = emailMatches && state === 'idle'

  async function handleSend() {
    if (!canSend) return
    setState('sending')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/colony/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          leadId: lead.id,
          toEmail: toEmail.trim(),
          subject: draft.subject,
          bodyText: draft.body,
          draftSource: 'bob_generated',
          generatedBy: 'bob',
        }),
      })
      const json = await res.json() as { status: string; data?: unknown; error?: string }

      if (json.status === 'ok') {
        setState('success')
        capture('colony_email_sent', { lead_id: lead.id, temperature: lead.temperature })

        if (enrollInSequence) {
          const data = (json.data ?? {}) as { providerMessageId?: string; sendId?: string }
          const originalSendId = data.providerMessageId ?? data.sendId ?? ''
          if (originalSendId) {
            fetch('/api/colony/sequences/enroll', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                leadId: lead.id,
                templateId: 'default_breakup_3',
                originalSendId,
              }),
            }).catch(() => null)
          }
        }
      } else {
        setState('error')
        setErrorMsg(json.error ?? 'Send failed. Check RESEND_API_KEY and try again.')
      }
    } catch {
      setState('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={state !== 'sending' ? onClose : undefined}
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{ background: 'var(--colony-bg-content)', border: '1px solid var(--colony-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--colony-border)', background: 'var(--colony-bg-elevated)' }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--colony-text-primary)' }}>
              Send Draft Email
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
              Sending from david@aiandwebservices.com via Resend
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={state === 'sending'}
            className="hover:opacity-70 transition-opacity"
            style={{ color: 'var(--colony-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Recipient verification */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--colony-text-secondary)' }}>
              To (must match lead&apos;s email to enable send)
            </label>
            <input
              type="email"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              disabled={state !== 'idle'}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{
                background: 'var(--colony-bg-elevated)',
                border: `1px solid ${emailMatches ? 'var(--colony-success)' : 'var(--colony-border)'}`,
                color: 'var(--colony-text-primary)',
              }}
              placeholder={lead.email}
            />
            {toEmail && !emailMatches && (
              <p className="text-xs mt-1" style={{ color: 'var(--colony-danger)' }}>
                Must match {lead.email}
              </p>
            )}
          </div>

          {/* Email preview */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--colony-text-secondary)' }}>
              Subject
            </p>
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'var(--colony-bg-elevated)', color: 'var(--colony-text-primary)' }}>
              {draft.subject}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--colony-text-secondary)' }}>
              Body
            </p>
            <div
              className="text-sm px-3 py-2 rounded-lg max-h-48 overflow-y-auto"
              style={{
                background: 'var(--colony-bg-elevated)',
                color: 'var(--colony-text-primary)',
                lineHeight: 1.7,
                border: '1px solid var(--colony-border)',
              }}
            >
              {draft.body.split('\n').map((line, i) => (
                <span key={i}>
                  {line || <br />}
                  {i < draft.body.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
              An unsubscribe link will be appended automatically.
            </p>
          </div>

          {/* Sequence enrollment toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={enrollInSequence}
              onChange={e => setEnrollInSequence(e.target.checked)}
              disabled={state !== 'idle'}
            />
            <span style={{ color: 'var(--colony-text-primary)' }}>
              Enroll in 3-step follow-up sequence after send
            </span>
            <span style={{ color: 'var(--colony-text-secondary)' }}>
              (Day 4 follow-up, Day 9 breakup)
            </span>
          </label>

          {/* Error banner */}
          {state === 'error' && errorMsg && (
            <div
              className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--colony-danger)' }}
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {errorMsg}
            </div>
          )}

          {/* Success state */}
          {state === 'success' && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--colony-success)' }}
            >
              <Check size={14} />
              Email sent successfully to {toEmail}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex items-center justify-end gap-3"
          style={{ borderTop: '1px solid var(--colony-border)', background: 'var(--colony-bg-elevated)' }}
        >
          {state === 'success' ? (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--colony-accent)', color: '#000' }}
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={state === 'sending'}
                className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--colony-text-secondary)', border: '1px solid var(--colony-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
                style={{
                  background: canSend ? 'var(--colony-accent)' : 'rgba(163,163,163,0.2)',
                  color: canSend ? '#000' : 'var(--colony-text-secondary)',
                  cursor: canSend ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={13} />
                {state === 'sending' ? 'Sending…' : 'Send Email'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
