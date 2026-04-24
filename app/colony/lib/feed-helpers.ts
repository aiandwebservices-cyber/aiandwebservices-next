import type { FeedEvent } from './types'

export function groupByRecency(events: FeedEvent[]): { label: string; events: FeedEvent[] }[] {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000)
  const weekStart = new Date(todayStart.getTime() - 7 * 86_400_000)

  const buckets: Record<string, FeedEvent[]> = {
    'Just now': [],
    'Earlier today': [],
    'Yesterday': [],
    'This week': [],
    'Older': [],
  }

  for (const event of events) {
    const ts = new Date(event.timestamp)
    const diffMs = now.getTime() - ts.getTime()
    if (diffMs < 3_600_000) buckets['Just now'].push(event)
    else if (ts >= todayStart) buckets['Earlier today'].push(event)
    else if (ts >= yesterdayStart) buckets['Yesterday'].push(event)
    else if (ts >= weekStart) buckets['This week'].push(event)
    else buckets['Older'].push(event)
  }

  return Object.entries(buckets)
    .filter(([, evs]) => evs.length > 0)
    .map(([label, events]) => ({ label, events }))
}

export function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const m = Math.floor(diffMs / 60_000)
  const h = Math.floor(diffMs / 3_600_000)
  const d = Math.floor(diffMs / 86_400_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d === 1) return 'yesterday'
  return `${d}d ago`
}
