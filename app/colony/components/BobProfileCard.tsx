'use client'

import { useEffect, useState } from 'react'
import { BotStatusDot } from './BotStatusDot'

interface BobProfile {
  bot_id: string
  display_name: string
  emoji: string
  status: 'active' | 'idle' | 'unknown'
  last_snapshot: {
    taken_at?: string
    generated_at?: string
    total_pipeline_cost_usd?: number
    leads_count?: number
    customers_count?: number
    mrr_usd?: number
  } | null
  pending_drafts_count: number
  claim_sources_count: number
  recent_case_studies: Array<{
    id: string
    title?: string
    audience?: string
    variant_type?: string
    created_at?: string
    body_preview?: string
  }>
  collection_sizes: Record<string, number>
}

interface BobProfileCardProps {
  cohortId?: string
  onClose?: () => void
}

export function BobProfileCard({ cohortId, onClose }: BobProfileCardProps) {
  const [profile, setProfile] = useState<BobProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = cohortId
      ? `/api/colony/bots/bob?cohort_id=${encodeURIComponent(cohortId)}`
      : '/api/colony/bots/bob'
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setProfile(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [cohortId])

  if (loading) {
    return <div className="p-6 text-sm text-zinc-400">Loading Bob...</div>
  }

  if (error || !profile) {
    return <div className="p-6 text-sm text-red-400">Failed to load Bob: {error}</div>
  }

  const statusColor =
    profile.status === 'active'
      ? 'text-emerald-400'
      : profile.status === 'idle'
      ? 'text-amber-400'
      : 'text-zinc-500'

  const snapshotTs =
    profile.last_snapshot?.taken_at || profile.last_snapshot?.generated_at

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{profile.emoji}</div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">{profile.display_name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <BotStatusDot botId="bob" cohortId={cohortId} size="md" showLabel={true} />
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 text-sm">
            Close
          </button>
        )}
      </div>

      {profile.last_snapshot && (
        <div className="mb-6 p-4 rounded bg-zinc-900/50 border border-zinc-800">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Last Snapshot</div>
          <div className="text-sm text-zinc-300 space-y-1">
            {snapshotTs && <div>Taken: {new Date(snapshotTs).toLocaleString()}</div>}
            {profile.last_snapshot.leads_count !== undefined && (
              <div>Leads tracked: {profile.last_snapshot.leads_count}</div>
            )}
            {profile.last_snapshot.customers_count !== undefined && (
              <div>Active customers: {profile.last_snapshot.customers_count}</div>
            )}
            {profile.last_snapshot.mrr_usd !== undefined && (
              <div>MRR: ${profile.last_snapshot.mrr_usd}</div>
            )}
            {profile.last_snapshot.total_pipeline_cost_usd !== undefined && (
              <div>Pipeline cost: ${profile.last_snapshot.total_pipeline_cost_usd.toFixed(2)}</div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
          <div className="text-2xl font-semibold text-zinc-100">{profile.pending_drafts_count}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Pending Drafts</div>
        </div>
        <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
          <div className="text-2xl font-semibold text-zinc-100">{profile.collection_sizes.case_studies}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Case Studies</div>
        </div>
        <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
          <div className="text-2xl font-semibold text-zinc-100">{profile.claim_sources_count}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Claim Sources</div>
        </div>
      </div>

      {profile.recent_case_studies.length > 0 && (
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Recent Case Studies</div>
          <div className="space-y-2">
            {profile.recent_case_studies.map((cs) => (
              <div key={cs.id} className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
                <div className="text-sm font-medium text-zinc-100">
                  {cs.title || `Case Study ${cs.id.slice(0, 8)}`}
                </div>
                {(cs.audience || cs.variant_type) && (
                  <div className="text-xs text-zinc-500 mt-1">
                    {cs.audience && <span>{cs.audience}</span>}
                    {cs.audience && cs.variant_type && <span> · </span>}
                    {cs.variant_type && <span>{cs.variant_type}</span>}
                  </div>
                )}
                {cs.body_preview && (
                  <div className="text-xs text-zinc-400 mt-2">{cs.body_preview}...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
