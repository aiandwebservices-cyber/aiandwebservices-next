'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidePanelContent {
  title: string
  subtitle?: string
  children: React.ReactNode
  width?: 'narrow' | 'medium' | 'wide'
}

interface SidePanelCtx {
  open: (content: SidePanelContent) => void
  close: () => void
}

const WIDTH_PX = { narrow: 360, medium: 480, wide: 640 } as const

// ─── Context ──────────────────────────────────────────────────────────────────

const SidePanelContext = createContext<SidePanelCtx>({
  open: () => {},
  close: () => {},
})

export function useSidePanel() {
  return useContext(SidePanelContext)
}

// ─── Panel UI ─────────────────────────────────────────────────────────────────

interface SidePanelProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  width?: 'narrow' | 'medium' | 'wide'
}

export default function SidePanel({ open, onClose, title, subtitle, children, width = 'medium' }: SidePanelProps) {
  const px = WIDTH_PX[width]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease-out',
        }}
      />

      {/* Panel — desktop: slides from right; mobile: slides from bottom */}
      <div
        style={{
          position: 'fixed',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--colony-bg-content)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.24)',
          transition: 'transform 250ms ease-out',
          // Desktop
          top: 0,
          right: 0,
          bottom: 0,
          width: px,
          maxWidth: '100vw',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
        className="md:translate-y-0"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--colony-border)' }}
        >
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--colony-text-primary)' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--colony-text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: 'var(--colony-text-secondary)' }}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<SidePanelContent | null>(null)
  // Keep last content during close animation so panel doesn't flash empty
  const lastContent = useRef<SidePanelContent | null>(null)

  const open = useCallback((c: SidePanelContent) => {
    lastContent.current = c
    setContent(c)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  const displayed = content ?? lastContent.current

  return (
    <SidePanelContext.Provider value={{ open, close }}>
      {children}
      {displayed && (
        <SidePanel
          open={isOpen}
          onClose={close}
          title={displayed.title}
          subtitle={displayed.subtitle}
          width={displayed.width}
        >
          {displayed.children}
        </SidePanel>
      )}
    </SidePanelContext.Provider>
  )
}
