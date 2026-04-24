'use client'
import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import type { BillNyeReport } from '@/app/colony/lib/types'

interface ReportModalProps {
  report: BillNyeReport
  onClose: () => void
}

export function ReportModal({ report, onClose }: ReportModalProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSanitizedHTML(DOMPurify.sanitize(report.html_content, {
        ADD_TAGS: ['iframe', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'marker', 'use'],
        ADD_ATTR: ['viewBox', 'xmlns', 'd', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'points'],
      }))
    }
  }, [report.html_content])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        style={{ background: 'var(--colony-bg-content)' }}
        onClick={e => e.stopPropagation()}
      >
        <header
          className="sticky top-0 p-4 flex items-center justify-between z-10"
          style={{
            background: 'var(--colony-bg-elevated)',
            borderBottom: '1px solid var(--colony-border)',
          }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
              {report.title}
            </h2>
            <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
              Generated {new Date(report.generated_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl hover:opacity-70 transition-opacity w-8 h-8 flex items-center justify-center"
            style={{ color: 'var(--colony-text-secondary)' }}
          >
            ×
          </button>
        </header>
        <div
          className="p-6 colony-report-content"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </div>
    </div>
  )
}
