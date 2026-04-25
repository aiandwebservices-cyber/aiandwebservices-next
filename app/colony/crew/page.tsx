'use client'

import { useEffect, useState } from 'react'
import { BotStatusDot } from '../components/BotStatusDot'
import { BotStatusRing } from '../components/BotStatusRing'
import type { BotStatus, StatusTier } from '@/lib/colony/bot-status'

const TIER_ORDER: Record<StatusTier, number> = {
  running: 0,
  live: 1,
  online: 2,
  failed: 3,
  idle: 4,
  offline: 5,
}

const TIER_LABELS: Record<StatusTier, string> = {
  running: 'Running',
  live: 'Live',
  online: 'Online',
  idle: 'Idle',
  offline: 'Offline',
  failed: 'Failed',
}

// Fallback metadata for known agents whose heartbeats may not yet carry full bot_name/role/emoji
const BOT_FALLBACKS: Record<string, { name: string; role: string; emoji: string }> = {
  scheduler:          { name: 'Scheduler',           role: 'Master pipeline orchestrator',                                emoji: '⏱️' },
  harvester:          { name: 'Harvester',           role: 'Sunbiz filings → enriched leads in EspoCRM',                  emoji: '🌾' },
  lead_researcher:    { name: 'Lead Researcher',     role: 'Pre-computes signal data for the master pipeline',            emoji: '🔍' },
  bob:                { name: 'Bob — Case Study Writer', role: 'Watches the pipeline, writes case studies + marketing',   emoji: '📝' },
  blog_writer:        { name: 'Blog Writer',         role: 'SEO blog posts with research + optimization',                 emoji: '✍️' },
  proposal_generator: { name: 'Proposal Generator',  role: 'Post-audit sales proposals from lead research',               emoji: '📄' },
  linkedin_agent:     { name: 'LinkedIn Agent',      role: 'LinkedIn channel outreach + content',                         emoji: '🔗' },
  seo_crew:           { name: 'SEO Crew',            role: 'Keyword research + SERP briefings for blog_writer',           emoji: '🚀' },
  email_writer:       { name: 'Email Writer',        role: 'Instantly.ai campaign push for scaled outreach',              emoji: '📧' },
  bill_nye:           { name: 'Bill Nye',            role: 'Data analyst — lead scoring + pipeline insights',             emoji: '🧪' },
  bill_nye_validator: { name: 'Bill Nye Validator',  role: 'Validates Bill Nye reports before publishing',               emoji: '🔬' },
  writing_coach:      { name: 'Writing Coach',       role: 'Outreach quality review — reply-rate pattern analysis',       emoji: '✍️' },
  syndication_agent:  { name: 'Syndication Agent',   role: 'Distributes content across channels',                         emoji: '📡' },
  social_publisher:   { name: 'Social Publisher',    role: 'Publishes approved content to social platforms',             emoji: '📲' },
  nudge_sender:       { name: 'Nudge Sender',        role: 'Follow-up sequences for warm leads',                          emoji: '💬' },
  fact_checker:       { name: 'Fact Checker',        role: 'Verifies claims in outreach drafts before sending',           emoji: '✅' },
  archivist:          { name: 'Archivist',           role: 'Seeds and maintains the Qdrant knowledge base',              emoji: '📚' },
}

function formatAge(minutes: number | null): string {
  if (minutes === null) return 'never'
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${Math.round(minutes)}m ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`
  return `${Math.round(minutes / 1440)}d ago`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${(seconds / 3600).toFixed(1)}h`
}

const TIER_DOT_COLOR: Record<StatusTier, string> = {
  running: '#34d399',  // strong
  live:    '#22c47a',  // normal
  online:  '#16a05e',  // subtle
  idle:    '#52525b',  // off
  offline: '#52525b',  // off
  failed:  '#ef4444',
}

const TIER_BORDER: Record<StatusTier, string> = {
  running: 'rgba(52,211,153,0.55)',  // strong
  live:    'rgba(52,211,153,0.40)',  // normal
  online:  'rgba(52,211,153,0.25)', // subtle
  idle:    'var(--colony-border)',
  offline: 'var(--colony-border)',
  failed:  'rgba(239,68,68,0.35)',
}

interface CrewStatusResponse {
  bots: Record<string, BotStatus>
  summary: {
    running: number
    live: number
    failed: number
    total: number
  }
}

export default function CrewPage() {
  const [bots, setBots] = useState<Record<string, BotStatus>>({})
  const [summary, setSummary] = useState<CrewStatusResponse['summary'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const resp = await fetch('/api/colony/crew/status')
        const data: CrewStatusResponse = await resp.json()
        if (cancelled) return
        setBots(data.bots || {})
        setSummary(data.summary || null)
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 15000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const botArray = Object.values(bots)
  const sorted = [...botArray].sort((a, b) => {
    const tA = TIER_ORDER[a.status_tier]
    const tB = TIER_ORDER[b.status_tier]
    if (tA !== tB) return tA - tB
    return (a.bot_id || '').localeCompare(b.bot_id || '')
  })

  const counts = {
    running: botArray.filter((b) => b.status_tier === 'running').length,
    live: botArray.filter((b) => b.status_tier === 'live').length,
    online: botArray.filter((b) => b.status_tier === 'online').length,
    idle: botArray.filter((b) => b.status_tier === 'idle').length,
    offline: botArray.filter((b) => b.status_tier === 'offline').length,
    failed: botArray.filter((b) => b.status_tier === 'failed').length,
  }

  const renderTierBadge = (tier: StatusTier, count: number) => (
    <div className="flex items-center gap-1.5">
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: TIER_DOT_COLOR[tier],
          animation: tier === 'running' || tier === 'failed'
            ? 'colonyPulse 1.2s ease-in-out infinite'
            : tier === 'live'
              ? 'colonyPulse 2s ease-in-out infinite'
              : undefined,
          display: 'inline-block',
        }}
      />
      <span style={{ color: 'var(--colony-text-secondary)' }}>
        {TIER_LABELS[tier]}: <span style={{ color: 'var(--colony-text-primary)', fontWeight: 600 }}>{count}</span>
      </span>
    </div>
  )

  const renderRunningIndicator = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 6,
        background: 'rgba(52,211,153,0.12)',
        border: '1px solid rgba(52,211,153,0.35)',
        fontSize: 11,
        color: '#34d399',
        fontWeight: 600,
        letterSpacing: '0.03em',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#34d399',
          animation: 'colonyPulse 1.2s ease-in-out infinite',
          display: 'inline-block',
        }}
      />
      LIVE
    </div>
  )

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Crew
          </h1>
          {summary && summary.running > 0 && renderRunningIndicator()}
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Every agent that has reported a heartbeat. Running bots pulse indigo; failed bots pulse red.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        {counts.running > 0 && renderTierBadge('running', counts.running)}
        {renderTierBadge('live', counts.live)}
        {renderTierBadge('online', counts.online)}
        {renderTierBadge('idle', counts.idle)}
        {renderTierBadge('offline', counts.offline)}
        {counts.failed > 0 && renderTierBadge('failed', counts.failed)}
      </div>

      {loading && (
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Loading crew...
        </div>
      )}

      {!loading && sorted.length === 0 && (
        <div
          className="p-6 rounded text-sm"
          style={{
            background: 'var(--colony-bg-elevated)',
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
          }}
        >
          No heartbeats recorded yet. Run any pipeline to see the first agent come online.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((bot) => {
          const fallback = BOT_FALLBACKS[bot.bot_id] || {
            name: bot.bot_id,
            role: '(no role set)',
            emoji: '🤖',
          }
          const displayName = bot.bot_name || fallback.name
          const displayRole = bot.bot_role || fallback.role
          const displayEmoji = bot.avatar_emoji || fallback.emoji
          const isRunning = bot.status_tier === 'running'
          const isFailed = bot.status_tier === 'failed'

          return (
            <BotStatusRing key={bot.bot_id} botId={bot.bot_id} intensity="normal">
              <div
                className="p-4 rounded-lg h-full"
                style={{
                  background: isRunning
                    ? 'linear-gradient(135deg, rgba(52,211,153,0.10) 0%, var(--colony-bg-elevated) 100%)'
                    : bot.status_tier === 'live'
                      ? 'linear-gradient(135deg, rgba(52,211,153,0.05) 0%, var(--colony-bg-elevated) 100%)'
                      : bot.status_tier === 'online'
                        ? 'linear-gradient(135deg, rgba(52,211,153,0.03) 0%, var(--colony-bg-elevated) 100%)'
                        : isFailed
                          ? 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, var(--colony-bg-elevated) 100%)'
                          : 'var(--colony-bg-elevated)',
                  border: `1px solid ${TIER_BORDER[bot.status_tier]}`,
                  borderRadius: 14,
                  transition: 'border-color 0.3s ease',
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{displayEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="text-sm font-bold truncate"
                        style={{ color: 'var(--colony-text-primary)' }}
                      >
                        {displayName}
                      </div>
                      {isRunning ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            color: '#34d399',
                            background: 'rgba(52,211,153,0.12)',
                            border: '1px solid rgba(52,211,153,0.35)',
                            borderRadius: 4,
                            padding: '1px 5px',
                          }}
                        >
                          ● LIVE
                        </span>
                      ) : (
                        <BotStatusDot botId={bot.bot_id} size="sm" />
                      )}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--colony-text-secondary)' }}
                    >
                      {isRunning ? (
                        <>
                          Started{' '}
                          {bot.started_at
                            ? formatAge((Date.now() - new Date(bot.started_at).getTime()) / 60000)
                            : 'just now'}
                        </>
                      ) : (
                        <>
                          {TIER_LABELS[bot.status_tier]} · {formatAge(bot.age_minutes)}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: 'var(--colony-text-secondary)' }}
                >
                  {displayRole}
                </div>

                {bot.last_summary && (
                  <div
                    className="p-2 rounded"
                    style={{
                      background: 'var(--colony-row-bg)',
                      border: `1px solid ${isRunning ? 'rgba(52,211,153,0.2)' : 'var(--colony-row-border)'}`,
                    }}
                  >
                    <div
                      className="text-xs mb-1"
                      style={{ color: 'var(--colony-text-secondary)' }}
                    >
                      {isRunning ? 'In progress' : 'Last action'}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: isRunning ? '#6ee7b7' : 'var(--colony-text-primary)' }}
                    >
                      {bot.last_summary}
                    </div>
                  </div>
                )}

                <div
                  className="flex gap-3 mt-3 text-xs"
                  style={{ color: 'var(--colony-text-secondary)' }}
                >
                  {bot.decisions_count !== null && bot.decisions_count > 0 && (
                    <div>
                      <span style={{ color: 'var(--colony-text-primary)', fontWeight: 600 }}>
                        {bot.decisions_count}
                      </span>{' '}
                      decisions
                    </div>
                  )}
                  {!isRunning && bot.run_duration_seconds !== null && bot.run_duration_seconds > 0 && (
                    <div>
                      <span style={{ color: 'var(--colony-text-primary)', fontWeight: 600 }}>
                        {formatDuration(bot.run_duration_seconds)}
                      </span>{' '}
                      last run
                    </div>
                  )}
                  {isRunning && bot.started_at && (
                    <div style={{ color: '#34d399' }}>
                      running{' '}
                      <span style={{ fontWeight: 600 }}>
                        {formatDuration((Date.now() - new Date(bot.started_at).getTime()) / 1000)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </BotStatusRing>
          )
        })}
      </div>
    </main>
  )
}
