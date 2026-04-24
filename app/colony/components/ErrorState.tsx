'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg my-2 mx-4"
      style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}
    >
      <AlertTriangle size={15} style={{ color: 'var(--colony-danger)', flexShrink: 0 }} />
      <p className="flex-1 text-sm" style={{ color: 'var(--colony-danger)' }}>
        {message ?? 'Something went wrong. Data may be unavailable.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80 shrink-0"
          style={{
            background: 'rgba(239,68,68,0.15)',
            color: 'var(--colony-danger)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <RefreshCw size={11} />
          Retry
        </button>
      )}
    </div>
  )
}
