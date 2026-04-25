'use client'

import { ExternalLink, ChevronRight } from 'lucide-react'
import type { Lead } from '../lib/types'
import { TemperatureBadge } from './TemperatureBadge'
import { LeadDetailPanel } from './LeadDetailPanel'
import { useSidePanel } from './SidePanel'
import { formatAge, isAging } from '../lib/lead-helpers'
import { capture } from '../lib/posthog'

interface LeadRowProps {
  lead: Lead
}

export function LeadRow({ lead }: LeadRowProps) {
  const { open } = useSidePanel()
  const aging = isAging(lead)

  const handleRowClick = () => {
    capture('colony_lead_row_clicked', { lead_id: lead.id, temperature: lead.temperature })
    open({
      title: lead.business_name,
      subtitle: `${lead.niche.replace(/-/g, ' ')} · ${lead.city}, ${lead.state}`,
      children: <LeadDetailPanel lead={lead} />,
      width: 'medium',
    })
  }

  const handleEspoCRM = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`https://espocrm.example.com/#Lead/view/${lead.id}`, '_blank', 'noopener')
  }

  return (
    <div
      onClick={handleRowClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors group"
      style={{ borderBottom: '1px solid var(--colony-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--colony-bg-elevated)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
      aria-label={`View details for ${lead.business_name}`}
    >
      {/* Temperature badge */}
      <TemperatureBadge temperature={lead.temperature} size="sm" />

      {/* Business info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate" style={{ color: 'var(--colony-text-primary)' }}>
            {lead.business_name}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--colony-text-secondary)' }}>
            {lead.city}, {lead.state}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(163,163,163,0.1)', color: 'var(--colony-text-secondary)' }}
          >
            {lead.niche.replace(/-/g, ' ')}
          </span>
          {aging && (
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
            >
              AGING
            </span>
          )}
          {lead.payment_status && lead.payment_status !== 'none' && (
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                background:
                  lead.payment_status === 'paid'     ? 'rgba(52,211,153,0.15)' :
                  lead.payment_status === 'failed'   ? 'rgba(239,68,68,0.15)'  :
                                                       'rgba(245,158,11,0.15)',
                color:
                  lead.payment_status === 'paid'     ? '#34d399' :
                  lead.payment_status === 'failed'   ? '#ef4444' :
                                                       '#f59e0b',
              }}
              title={lead.subscription_plan ? `Plan: ${lead.subscription_plan}` : undefined}
            >
              {lead.payment_status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Right side: times + actions */}
      <div className="flex flex-col items-end gap-1 shrink-0 text-right">
        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          {formatAge(lead.created_at)}
        </span>
        {lead.last_activity_at && (
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.7 }}>
            Last activity {formatAge(lead.last_activity_at)}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleEspoCRM}
          className="p-1.5 rounded hover:opacity-80 transition-opacity"
          style={{ color: 'var(--colony-text-secondary)' }}
          aria-label="View in EspoCRM"
          title="View in EspoCRM"
        >
          <ExternalLink size={14} />
        </button>
        <ChevronRight size={16} style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }} />
      </div>
    </div>
  )
}
