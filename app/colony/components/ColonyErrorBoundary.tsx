'use client'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ColonyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Colony error boundary caught:', error, errorInfo)
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).posthog) {
      ;(window as unknown as { posthog: { capture: (e: string, p: object) => void } }).posthog.capture(
        'colony_error_boundary',
        { error: error.message, stack: error.stack?.slice(0, 500) }
      )
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-5xl mb-3">🛠️</div>
          <h2 className="text-lg font-semibold mb-2">Something broke on this screen</h2>
          <p className="text-sm max-w-md mb-4" style={{ color: 'var(--colony-text-secondary)' }}>
            The rest of Colony is still working. Try reloading this page, or head back to the feed.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded font-medium hover:opacity-90"
            style={{ background: 'var(--colony-accent)', color: '#000' }}
          >
            Reload screen
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
