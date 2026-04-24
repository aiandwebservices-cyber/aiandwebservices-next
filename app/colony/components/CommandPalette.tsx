'use client'
import { useEffect, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCommandPalette } from './CommandPaletteProvider'
import { useCohort } from './CohortSwitcher'
import { buildCommandIndex, type CommandItem } from '../lib/command-index'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { capture } from '../lib/posthog'

export function CommandPalette() {
  const { close } = useCommandPalette()
  const { cohortId } = useCohort()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [items, setItems] = useState<CommandItem[]>([])

  useEffect(() => {
    buildCommandIndex(cohortId).then(setItems)
    inputRef.current?.focus()
    capture('colony_command_palette_opened')
  }, [cohortId])

  const results = useFuzzySearch(items, query, { limit: 10 })

  useEffect(() => { setActiveIndex(0) }, [query])

  const executeItem = useCallback(
    (item: CommandItem) => {
      capture('colony_command_palette_executed', { type: item.type, label: item.label })
      if (item.type === 'action' && item.action) {
        item.action()
      } else if (item.href) {
        router.push(item.href)
      }
      close()
    },
    [close, router]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault()
        executeItem(results[activeIndex])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [results, activeIndex, executeItem])

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-[15vh]"
      style={{ zIndex: 100, background: 'rgba(0,0,0,0.6)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'var(--colony-bg-elevated)',
          border: '1px solid var(--colony-border)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ borderBottom: '1px solid var(--colony-border)' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to a lead, bot, report, or action..."
            className="w-full px-4 py-3 bg-transparent outline-none text-sm"
            style={{
              color: 'var(--colony-text-primary)',
            }}
            aria-autocomplete="list"
            aria-controls="cmd-results"
          />
        </div>

        {/* Results */}
        <div
          id="cmd-results"
          className="max-h-[50vh] overflow-y-auto"
          role="listbox"
        >
          {results.length === 0 ? (
            <div
              className="px-4 py-8 text-center text-sm"
              style={{ color: 'var(--colony-text-secondary)' }}
            >
              {query ? 'Nothing matches that.' : 'Start typing to search.'}
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => executeItem(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                style={{
                  background: i === activeIndex
                    ? 'rgba(0,212,255,0.08)'
                    : 'transparent',
                }}
              >
                <span className="text-lg shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--colony-text-primary)' }}
                  >
                    {item.label}
                  </div>
                  {item.subtitle && (
                    <div
                      className="text-xs truncate"
                      style={{ color: 'var(--colony-text-secondary)' }}
                    >
                      {item.subtitle}
                    </div>
                  )}
                </div>
                <span
                  className="text-xs uppercase shrink-0"
                  style={{ color: 'var(--colony-text-secondary)', opacity: 0.6 }}
                >
                  {item.kind ?? item.type}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div
          className="px-4 py-2 flex gap-3 text-xs"
          style={{
            borderTop: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
            opacity: 0.7,
          }}
        >
          <span>&#x2191;&#x2193; navigate</span>
          <span>&#x23CE; select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
