'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { capture } from '../lib/posthog'
import type { LeadFilters } from '../lib/lead-helpers'

const TEMP_OPTIONS = ['ALL', 'HOT', 'WARM', 'COOL', 'COLD', 'UNCONTACTED', 'AGING'] as const
const SOURCE_LABELS: Record<string, string> = {
  all: 'All Sources',
  master_pipeline: 'Pipeline',
  fresh_business: 'Fresh Business',
  website: 'Website',
  manual: 'Manual',
}
const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
] as const

export function useInboxFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: LeadFilters = {
    temperature: ((searchParams.get('temp')?.toUpperCase()) as LeadFilters['temperature']) ?? 'ALL',
    niche: searchParams.get('niche') ?? 'all',
    source: searchParams.get('source') ?? 'all',
    dateRange: (searchParams.get('date') as LeadFilters['dateRange']) ?? 'all',
  }

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const isDefault = value === 'ALL' || value === 'all'
    if (isDefault) {
      params.delete(key)
    } else {
      params.set(key, value.toLowerCase())
    }
    router.replace(`?${params.toString()}`, { scroll: false })
    capture('colony_inbox_filter_changed', { filter: key, value })
  }

  const clearAll = () => {
    router.replace('?', { scroll: false })
    capture('colony_inbox_filter_changed', { filter: 'all', value: 'cleared' })
  }

  const hasActiveFilters = !!(
    searchParams.get('temp') ||
    searchParams.get('niche') ||
    searchParams.get('source') ||
    searchParams.get('date')
  )

  return { filters, setFilter, clearAll, hasActiveFilters }
}

interface InboxFiltersProps {
  niches: string[]
}

function InboxFiltersInner({ niches }: InboxFiltersProps) {
  const { filters, setFilter, clearAll, hasActiveFilters } = useInboxFilters()
  const activeTemp = filters.temperature ?? 'ALL'
  const activeSource = filters.source ?? 'all'
  const activeDate = filters.dateRange ?? 'all'

  const chipBase: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 999,
    cursor: 'pointer',
    border: '1px solid var(--colony-border)',
    background: 'transparent',
    color: 'var(--colony-text-secondary)',
    transition: 'all 120ms',
    whiteSpace: 'nowrap',
  }
  const chipActive: React.CSSProperties = {
    ...chipBase,
    background: 'var(--colony-accent)',
    borderColor: 'var(--colony-accent)',
    color: '#000',
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Temperature chips */}
      <div className="flex flex-wrap gap-1.5">
        {TEMP_OPTIONS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter('temp', t)}
            style={activeTemp === t ? chipActive : chipBase}
          >
            {t === 'UNCONTACTED' ? 'Uncontacted' : t === 'AGING' ? '⏰ Aging' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--colony-border)' }} />

      {/* Niche dropdown */}
      <select
        value={filters.niche ?? 'all'}
        onChange={(e) => setFilter('niche', e.target.value)}
        className="text-xs px-3 py-1.5 rounded-full cursor-pointer"
        style={{
          border: '1px solid var(--colony-border)',
          background: filters.niche && filters.niche !== 'all' ? 'var(--colony-accent)' : 'transparent',
          color: filters.niche && filters.niche !== 'all' ? '#000' : 'var(--colony-text-secondary)',
          fontWeight: 600,
          outline: 'none',
        }}
      >
        <option value="all">All Niches</option>
        {niches.map((n) => (
          <option key={n} value={n}>
            {n.charAt(0).toUpperCase() + n.slice(1).replace(/-/g, ' ')}
          </option>
        ))}
      </select>

      {/* Source dropdown */}
      <select
        value={activeSource}
        onChange={(e) => setFilter('source', e.target.value)}
        className="text-xs px-3 py-1.5 rounded-full cursor-pointer"
        style={{
          border: '1px solid var(--colony-border)',
          background: activeSource !== 'all' ? 'var(--colony-accent)' : 'transparent',
          color: activeSource !== 'all' ? '#000' : 'var(--colony-text-secondary)',
          fontWeight: 600,
          outline: 'none',
        }}
      >
        {Object.entries(SOURCE_LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>

      {/* Date range chips */}
      <div className="flex gap-1.5">
        {DATE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter('date', value)}
            style={activeDate === value ? chipActive : chipBase}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: 'var(--colony-danger)' }}
        >
          <X size={12} />
          Clear filters
        </button>
      )}
    </div>
  )
}

export function InboxFilters({ niches }: InboxFiltersProps) {
  return (
    <Suspense fallback={<div className="h-9" />}>
      <InboxFiltersInner niches={niches} />
    </Suspense>
  )
}
