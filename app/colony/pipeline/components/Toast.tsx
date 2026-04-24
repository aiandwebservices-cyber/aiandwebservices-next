'use client'

import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ToastProps {
  type: 'error' | 'success'
  message: string
  onClose: () => void
}

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm"
      style={{
        background: type === 'error' ? '#ef4444' : 'var(--colony-success)',
        color: '#fff',
        animation: 'slide-up-fade-in 200ms ease-out both',
      }}
      role="alert"
    >
      {type === 'error' && <AlertTriangle size={15} className="shrink-0" />}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
