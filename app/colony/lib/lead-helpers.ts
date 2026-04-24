import type { Lead, Cohort } from './types'
import { getLeadsForCohort } from './mock-data'

export interface LeadFilters {
  temperature?: 'ALL' | 'HOT' | 'WARM' | 'COOL' | 'COLD' | 'UNCONTACTED' | 'AGING'
  niche?: string
  source?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
}

export function isAging(lead: Lead): boolean {
  if (lead.temperature !== 'HOT') return false
  if (lead.last_activity_at) return false
  const ageMs = Date.now() - new Date(lead.created_at).getTime()
  return ageMs > 2 * 60 * 60 * 1000
}

export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  return leads.filter((lead) => {
    const temp = filters.temperature
    if (temp && temp !== 'ALL') {
      if (temp === 'UNCONTACTED' && lead.last_activity_at) return false
      else if (temp === 'AGING' && !isAging(lead)) return false
      else if (temp !== 'UNCONTACTED' && temp !== 'AGING' && lead.temperature !== temp) return false
    }

    if (filters.niche && filters.niche !== 'all') {
      if (lead.niche !== filters.niche) return false
    }

    if (filters.source && filters.source !== 'all') {
      if (lead.source !== filters.source) return false
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const created = new Date(lead.created_at)
      const now = new Date()
      if (filters.dateRange === 'today') {
        if (created.toDateString() !== now.toDateString()) return false
      } else if (filters.dateRange === 'week') {
        if (created < new Date(now.getTime() - 7 * 86400000)) return false
      } else if (filters.dateRange === 'month') {
        if (created < new Date(now.getTime() - 30 * 86400000)) return false
      }
    }

    return true
  })
}

export function formatAge(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime()
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  const months = Math.floor(days / 30)

  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${months}mo ago`
}

export function getLeadById(leadId: string, cohortId: Cohort): Lead | undefined {
  return getLeadsForCohort(cohortId).find((l) => l.id === leadId)
}

export function getUniqueNiches(leads: Lead[]): string[] {
  return [...new Set(leads.map((l) => l.niche))].sort()
}
