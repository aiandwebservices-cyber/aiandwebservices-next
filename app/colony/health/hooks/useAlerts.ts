'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCohort } from '../../components/CohortSwitcher'
import { colonyFetch } from '../../lib/api-client'
import type { Alert } from '../types'
import type { LeadPayload, DealPayload } from '@/lib/colony/contracts'

const SIX_HOURS = 6 * 60 * 60 * 1000
const FORTY_FIVE_DAYS = 45 * 24 * 60 * 60 * 1000
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000
const SEVEN_DAYS_AGO = () => new Date(Date.now() - SEVEN_DAYS)

function deriveAlerts(leads: LeadPayload[], deals: DealPayload[]): Alert[] {
  const alerts: Alert[] = []
  const now = Date.now()

  // Critical: HOT leads > 6h old without activity
  leads
    .filter((l) => l.temperature === 'HOT' && !l.last_activity_at)
    .filter((l) => now - new Date(l.created_at).getTime() > SIX_HOURS)
    .forEach((l) => {
      const hoursOld = Math.floor((now - new Date(l.created_at).getTime()) / 3600000)
      alerts.push({
        id: `hot-aging-${l.id}`,
        urgency: 'critical',
        icon: '🔥',
        title: `HOT lead aging ${hoursOld}h+: ${l.business_name}`,
        context: `${l.niche} · ${l.city}, ${l.state} — no outreach recorded`,
        actionLabel: 'View lead',
        drillTarget: { type: 'lead', id: l.id },
      })
    })

  // Critical: Active deals no activity > 45 days (churn risk)
  deals
    .filter((d) => d.stage === 'Active')
    .filter((d) => {
      const lastActivity = d.last_activity_at ?? d.created_at
      return now - new Date(lastActivity).getTime() > FORTY_FIVE_DAYS
    })
    .forEach((d) => {
      const days = Math.floor((now - new Date(d.last_activity_at ?? d.created_at).getTime()) / 86400000)
      alerts.push({
        id: `churn-risk-${d.id}`,
        urgency: 'critical',
        icon: '⚠️',
        title: `Churn risk: ${d.business_name}`,
        context: `Active subscription — no activity in ${days} days`,
        actionLabel: 'View deal',
        drillTarget: { type: 'deal', id: d.id },
      })
    })

  // Important: Deals in "Proposal Sent" > 7 days
  deals
    .filter((d) => d.stage === 'Proposal Sent' && d.days_in_stage > 7)
    .forEach((d) => {
      alerts.push({
        id: `proposal-aging-${d.id}`,
        urgency: 'important',
        icon: '📋',
        title: `Follow-up needed: ${d.business_name}`,
        context: `Proposal sent ${d.days_in_stage} days ago — no response recorded`,
        actionLabel: 'View deal',
        drillTarget: { type: 'deal', id: d.id },
      })
    })

  // Important: Deals in "Audit Scheduled" > 4 days with no activity
  deals
    .filter((d) => d.stage === 'Audit Scheduled' && d.days_in_stage > 4)
    .filter((d) => !d.last_activity_at || now - new Date(d.last_activity_at).getTime() > FOUR_DAYS)
    .forEach((d) => {
      alerts.push({
        id: `audit-stale-${d.id}`,
        urgency: 'important',
        icon: '📅',
        title: `Audit check: ${d.business_name}`,
        context: `Audit scheduled ${d.days_in_stage} days ago — confirm it happened`,
        actionLabel: 'View deal',
        drillTarget: { type: 'deal', id: d.id },
      })
    })

  // FYI: New leads from unusual sources this week (not master_pipeline)
  const sevenDaysAgo = SEVEN_DAYS_AGO()
  const unusualLeads = leads.filter(
    (l) => l.source !== 'master_pipeline' && new Date(l.created_at) >= sevenDaysAgo
  )
  if (unusualLeads.length > 0) {
    const sources = [...new Set(unusualLeads.map((l) => l.source))].join(', ')
    alerts.push({
      id: 'unusual-sources',
      urgency: 'fyi',
      icon: '📡',
      title: `${unusualLeads.length} new lead${unusualLeads.length > 1 ? 's' : ''} from non-pipeline sources`,
      context: `Sources this week: ${sources}`,
    })
  }

  return alerts
}

export function useAlerts(): { alerts: Alert[]; count: number } {
  const { cohortId } = useCohort()
  const [alerts, setAlerts] = useState<Alert[]>([])

  const load = useCallback(async () => {
    const [leadsRes, dealsRes] = await Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
    ])

    const leads = leadsRes.data ?? []
    const deals = dealsRes.data ?? []
    setAlerts(deriveAlerts(leads, deals))
  }, [cohortId])

  useEffect(() => { load() }, [load])

  const criticalCount = alerts.filter((a) => a.urgency === 'critical' || a.urgency === 'important').length
  return { alerts, count: criticalCount }
}
