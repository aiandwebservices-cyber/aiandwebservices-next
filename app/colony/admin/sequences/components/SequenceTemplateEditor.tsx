'use client'

import { useState } from 'react'
import type { SequenceTemplate } from '@/lib/colony/sequences/types'

export default function SequenceTemplateEditor({ template }: { template: SequenceTemplate }) {
  const [active, setActive] = useState(template.active)
  const [loading, setLoading] = useState(false)

  async function toggleActive() {
    setLoading(true)
    try {
      // Note: Phase 15 does not expose a full template-write API. Toggle is surfaced
      // for UX; Phase 15B wires the write endpoint. This call is a no-op until then.
      await fetch('/api/colony/sequences/template/toggle', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: template.id, active: !active }),
      }).catch(() => null)
      setActive(!active)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            {template.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
            {template.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: active ? 'rgba(16,185,129,0.15)' : 'rgba(163,163,163,0.15)',
              color: active ? 'var(--colony-success)' : 'var(--colony-text-secondary)',
            }}
          >
            {active ? 'Active' : 'Paused'}
          </span>
          <button
            onClick={toggleActive}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1 rounded-md disabled:opacity-50"
            style={{ border: '1px solid var(--colony-border)', color: 'var(--colony-text-primary)' }}
          >
            {active ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {template.steps.map(step => (
          <li
            key={step.step_index}
            className="flex items-start gap-3 text-xs p-2 rounded-md"
            style={{ background: 'var(--colony-bg-content)', border: '1px solid var(--colony-border)' }}
          >
            <span
              className="font-mono font-bold shrink-0 w-5 text-right"
              style={{ color: 'var(--colony-accent)' }}
            >
              {step.step_index}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                {step.name}
                <span className="ml-2 font-normal" style={{ color: 'var(--colony-text-secondary)' }}>
                  {'days' in step.delay_from_previous
                    ? `+${step.delay_from_previous.days}d`
                    : `+${step.delay_from_previous.hours}h`}
                </span>
              </p>
              <p className="mt-0.5 truncate" style={{ color: 'var(--colony-text-secondary)' }}>
                {step.subject_template}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
                {step.body_generator === 'bob' ? 'Bob drafts the body' : step.body_template ? 'Static template' : 'No body source (step 0)'}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
