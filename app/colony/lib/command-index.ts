import { colonyFetch } from './api-client'
import type { LeadPayload, ReportPayload } from '@/lib/colony/contracts'

export interface CommandItem {
  id: string
  type: 'route' | 'bot' | 'lead' | 'report' | 'action'
  label: string
  subtitle?: string
  icon: string
  kind?: string
  href?: string
  action?: () => void
  searchText: string
}

const ROUTES: CommandItem[] = [
  {
    id: 'route-feed',
    type: 'route',
    label: 'Activity Feed',
    icon: '🏠',
    href: '/colony',
    kind: 'page',
    searchText: 'activity feed home dashboard live',
  },
  {
    id: 'route-inbox',
    type: 'route',
    label: 'Lead Inbox',
    icon: '📥',
    href: '/colony/inbox',
    kind: 'page',
    searchText: 'lead inbox prospects contacts',
  },
  {
    id: 'route-pipeline',
    type: 'route',
    label: 'Pipeline',
    icon: '📋',
    href: '/colony/pipeline',
    kind: 'page',
    searchText: 'pipeline deals opportunities stages kanban',
  },
  {
    id: 'route-health',
    type: 'route',
    label: 'Operations Health',
    icon: '📊',
    href: '/colony/health',
    kind: 'page',
    searchText: 'operations health mrr revenue metrics churn',
  },
  {
    id: 'route-reports',
    type: 'route',
    label: 'Reports',
    icon: '🧪',
    href: '/colony/reports',
    kind: 'page',
    searchText: 'reports bill nye analyses weekly',
  },
]

const BOTS: CommandItem[] = [
  { id: 'bot-billnye',       type: 'bot', label: 'Bill Nye',       subtitle: 'Data Scientist',        icon: '🧪', kind: 'agent', href: '/colony#bot-billnye',       searchText: 'bill nye data scientist agent bot' },
  { id: 'bot-coach',         type: 'bot', label: 'Coach',          subtitle: 'Meta Reviewer',         icon: '🎯', kind: 'agent', href: '/colony#bot-coach',         searchText: 'coach meta reviewer agent bot' },
  { id: 'bot-factchecker',   type: 'bot', label: 'Fact Checker',   subtitle: 'Quality Gate',          icon: '✅', kind: 'agent', href: '/colony#bot-factchecker',   searchText: 'fact checker quality gate agent bot' },
  { id: 'bot-leadresearcher',type: 'bot', label: 'Lead Researcher',subtitle: 'Prospect Finder',       icon: '🔍', kind: 'agent', href: '/colony#bot-leadresearcher',searchText: 'lead researcher prospect finder agent bot' },
  { id: 'bot-bob',           type: 'bot', label: 'Bob — Case Study Writer', subtitle: 'Case Study Writer', icon: '📝', kind: 'agent', href: '/colony#bot-bob',           searchText: 'bob case study writer agent bot' },
  { id: 'bot-scheduler',     type: 'bot', label: 'Scheduler',      subtitle: 'Pipeline Orchestrator', icon: '⏱️', kind: 'agent', href: '/colony#bot-scheduler',     searchText: 'scheduler pipeline orchestrator agent bot' },
  { id: 'bot-harvester',     type: 'bot', label: 'Harvester',      subtitle: 'Data Collector',        icon: '🌾', kind: 'agent', href: '/colony#bot-harvester',     searchText: 'harvester data collector agent bot' },
  { id: 'bot-archivist',     type: 'bot', label: 'Archivist',      subtitle: 'Knowledge Base',        icon: '📚', kind: 'agent', href: '/colony#bot-archivist',     searchText: 'archivist knowledge base agent bot' },
]

export async function buildCommandIndex(cohortId: string): Promise<CommandItem[]> {
  const items: CommandItem[] = [...ROUTES, ...BOTS]

  const [leadsRes, reportsRes] = await Promise.all([
    colonyFetch<LeadPayload[]>('leads', { cohortId, query: { limit: 20 } }),
    colonyFetch<ReportPayload[]>('reports', { cohortId, query: { limit: 10 } }),
  ])

  for (const lead of leadsRes.data ?? []) {
    items.push({
      id: `lead-${lead.id}`,
      type: 'lead',
      label: lead.business_name,
      subtitle: `${lead.niche} · ${lead.city} · ${lead.temperature}`,
      icon: lead.temperature === 'HOT' ? '🔥' : '👤',
      kind: 'lead',
      href: `/colony/inbox?lead=${lead.id}`,
      searchText: `${lead.business_name} ${lead.city} ${lead.niche} ${lead.email ?? ''}`.toLowerCase(),
    })
  }

  for (const r of reportsRes.data ?? []) {
    items.push({
      id: `report-${r.id}`,
      type: 'report',
      label: r.title,
      subtitle: new Date(r.generated_at).toLocaleDateString(),
      icon: '🧪',
      kind: 'report',
      href: `/colony/reports#${r.id}`,
      searchText: `${r.title} bill nye report`.toLowerCase(),
    })
  }

  items.push({
    id: 'action-bookcall',
    type: 'action',
    label: 'Book a call with David',
    icon: '📞',
    kind: 'action',
    action: () => window.open('https://cal.com/aiandwebservices/30min', '_blank'),
    searchText: 'book call meeting schedule david',
  })

  items.push({
    id: 'action-theme',
    type: 'action',
    label: 'Toggle dark / light mode',
    icon: '🌓',
    kind: 'action',
    action: () => {
      const root = document.querySelector('.colony-root')
      if (!root) return
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      root.setAttribute('data-theme', next)
      try { localStorage.setItem('colony-theme', next) } catch { /* storage blocked */ }
    },
    searchText: 'theme dark light mode toggle',
  })

  return items
}
