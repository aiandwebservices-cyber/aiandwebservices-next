export function lastRunIsRecent(lastRunAt: string, withinHours = 1): boolean {
  const diff = Date.now() - new Date(lastRunAt).getTime()
  return diff < withinHours * 60 * 60 * 1000
}

export function formatDecisionsCount(count: number): string {
  return count === 1 ? '1 decision' : `${count} decisions`
}

export function formatLastRun(lastRunAt: string): string {
  const diffMs = Date.now() - new Date(lastRunAt).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
