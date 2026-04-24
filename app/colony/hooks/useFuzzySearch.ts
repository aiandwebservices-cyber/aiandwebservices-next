'use client'
import { useMemo } from 'react'
import type { CommandItem } from '../lib/command-index'

interface Options { limit?: number }

export function useFuzzySearch(
  items: CommandItem[],
  query: string,
  options: Options = {}
): CommandItem[] {
  const limit = options.limit ?? 10

  return useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, limit)
    }

    const q = query.toLowerCase().trim()
    const scored = items.map(item => {
      const text = item.searchText
      let score = 0

      if (text === q) score += 100
      if (text.startsWith(q)) score += 60
      if (text.includes(q)) score += 40
      if (fuzzyMatch(q, text)) score += 20
      if (score > 0) score -= Math.min(10, text.length / 10)

      return { item, score }
    })

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item)
  }, [items, query, limit])
}

function fuzzyMatch(needle: string, haystack: string): boolean {
  let hi = 0
  for (let ni = 0; ni < needle.length; ni++) {
    const char = needle[ni]
    let found = false
    while (hi < haystack.length) {
      if (haystack[hi] === char) { hi++; found = true; break }
      hi++
    }
    if (!found) return false
  }
  return true
}
