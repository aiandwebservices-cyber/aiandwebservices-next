interface CacheEntry<T> {
  data: T
  cached_at: string
  expires_at: number
}

export class ColonyCache {
  private store: Map<string, CacheEntry<unknown>>
  private ttl_ms: number
  private max_entries: number

  constructor(ttl_seconds = 60, max_entries = 500) {
    this.store = new Map()
    this.ttl_ms = ttl_seconds * 1000
    this.max_entries = max_entries
  }

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    if (Date.now() > entry.expires_at) {
      this.store.delete(key)
      return null
    }
    return entry
  }

  set<T>(key: string, data: T): void {
    if (this.store.size >= this.max_entries) {
      // evict oldest entry
      const oldest = this.store.keys().next().value
      if (oldest) this.store.delete(oldest)
    }
    this.store.set(key, {
      data,
      cached_at: new Date().toISOString(),
      expires_at: Date.now() + this.ttl_ms,
    })
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  invalidateCohort(cohortId: string): void {
    const prefix = `colony:${cohortId}:`
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key)
    }
  }

  clear(): void {
    this.store.clear()
  }
}

export const cache = new ColonyCache()
