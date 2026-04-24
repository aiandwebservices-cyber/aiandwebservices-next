'use client'
import { useState } from 'react'
import OnboardForm from './components/OnboardForm'
import OnboardPreview from './components/OnboardPreview'
import OnboardResult from './components/OnboardResult'
import type { OnboardingInput, OnboardingPreview, OnboardingResult } from '@/lib/colony/onboarding'

type Step = 'form' | 'preview' | 'result'

const STEP_LABELS: Record<Step, string> = {
  form:    '1. Details',
  preview: '2. Preview',
  result:  '3. Result',
}

export default function OnboardPage() {
  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<Partial<OnboardingInput>>({})
  const [preview, setPreview] = useState<OnboardingPreview | null>(null)
  const [result, setResult] = useState<OnboardingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFormSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/colony/admin/onboard/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = await res.json() as { status: string; data?: OnboardingPreview; error?: string }
      if (!res.ok || json.status !== 'ok' || !json.data) {
        setError(json.error ?? 'Preview failed')
        return
      }
      setPreview(json.data)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    if (!preview) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/colony/admin/onboard/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: formData, preview }),
      })
      const json = await res.json() as { status: string; data?: OnboardingResult; error?: string }
      if (!res.ok || json.status !== 'ok' || !json.data) {
        setError(json.error ?? 'Execute failed')
        return
      }
      setResult(json.data)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep('form')
    setFormData({})
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        {(Object.keys(STEP_LABELS) as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-6 h-px" style={{ background: 'var(--colony-border)' }} />}
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                background: step === s ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: step === s ? 'var(--colony-accent)' : 'var(--colony-text-secondary)',
                border: step === s ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              }}
            >
              {STEP_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      )}

      {step === 'form' && (
        <OnboardForm
          value={formData}
          onChange={setFormData}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}

      {step === 'preview' && preview && (
        <OnboardPreview
          preview={preview}
          onConfirm={handleConfirm}
          onBack={() => setStep('form')}
          loading={loading}
        />
      )}

      {step === 'result' && result && (
        <OnboardResult result={result} onReset={reset} />
      )}
    </div>
  )
}
