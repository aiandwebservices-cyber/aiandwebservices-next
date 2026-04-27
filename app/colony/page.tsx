'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useCohort } from './components/CohortSwitcher'
import { colonyFetch } from './lib/api-client'
import { ActivityFeed } from './components/ActivityFeed'
import { BillNyeHomeCard } from './components/BillNyeHomeCard'
import { RevenueMoves } from './components/RevenueMoves'
import { ColonyErrorBoundary } from './components/ColonyErrorBoundary'
import { useSidePanel } from './components/SidePanel'
import BotProfilePanel from './components/BotProfilePanel'
import { capture } from './lib/posthog'
import { CountUp } from './components/ui/CountUp'
import { lastRunIsRecent } from './lib/bot-helpers'
import { PriorityAlertsCard } from './components/PriorityAlertsCard'
import { CostPerLeadCard } from './components/CostPerLeadCard'
import type { LeadPayload, DealPayload, FeedEventPayload, BotPayload } from '@/lib/colony/contracts'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'never'
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

function CrewSummaryCard({
  bots,
  onBotClick,
}: {
  bots: BotPayload[] | null
  onBotClick: (bot: BotPayload) => void
}) {
  if (!bots) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12 }}>Crew Status</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Loading…</div>
      </div>
    )
  }

  const live = bots.filter(b => lastRunIsRecent(b.last_run_at, 1))
  const lastRan = [...bots]
    .filter(b => b.last_run_at)
    .sort((a, b) => (b.last_run_at ?? '').localeCompare(a.last_run_at ?? ''))[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>🤖</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>Crew Status</span>
      </div>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: live.length > 0 ? '#34d399' : 'rgba(255,255,255,.35)', lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>
        {live.length}/{bots.length}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>BOTS LIVE</div>
      {lastRan && (
        <div style={{ marginTop: 4, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
          Last: {lastRan.name.split(' ')[0]} · {timeAgo(lastRan.last_run_at)}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', gap: 5, flexWrap: 'wrap', paddingTop: 12, justifyContent: 'center' }}>
        {bots.slice(0, 8).map(bot => {
          const isLive = lastRunIsRecent(bot.last_run_at, 1)
          return (
            <button
              key={bot.id}
              onClick={() => onBotClick(bot)}
              title={bot.name}
              style={{
                width: 28, height: 28, borderRadius: 7, cursor: 'pointer',
                background: isLive ? 'rgba(52,211,153,.12)' : 'rgba(255,255,255,.05)',
                border: `1px solid ${isLive ? 'rgba(52,211,153,.25)' : 'rgba(255,255,255,.08)'}`,
                fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 150ms',
              }}
            >
              {bot.avatar_emoji}
            </button>
          )
        })}
        {bots.length > 8 && (
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 700 }}>
            +{bots.length - 8}
          </div>
        )}
      </div>
    </div>
  )
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
}

interface HomeStats {
  emailsToday: number
  leads: number
  hot: number
  botCost: number
  replies: number
  mrr: number
}

export default function Page() {
  const { cohortId } = useCohort()
  const { open } = useSidePanel()
  const [stats, setStats] = useState<HomeStats>({ emailsToday: 0, leads: 0, hot: 0, botCost: 0, replies: 0, mrr: 0 })
  const [bots, setBots] = useState<BotPayload[] | null>(null)
  const [anyRunning, setAnyRunning] = useState(false)

  // Poll heartbeat status — green dot when any bot is actively running
  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const res = await fetch('/api/colony/crew/status')
        const data = await res.json()
        if (!cancelled) setAnyRunning((data?.summary?.running ?? 0) > 0)
      } catch { /* keep last state */ }
    }
    check()
    const iv = setInterval(check, 15000)
    return () => { cancelled = true; clearInterval(iv) }
  }, [])

  useEffect(() => { capture('colony_feed_viewed') }, [])

  const loadStats = useCallback(async () => {
    const ueParams = new URLSearchParams({ window: '30d' })
    if (cohortId) ueParams.set('cohort_id', cohortId)
    const [leadsRes, dealsRes, feedRes, emailStatsRes, ueRes] = await Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
      colonyFetch<FeedEventPayload[]>('feed', { cohortId }),
      fetch('/api/colony/email/stats', { credentials: 'include' }).then(r => r.json()).catch(() => null),
      fetch(`/api/colony/health/unit-economics?${ueParams.toString()}`, { credentials: 'include' })
        .then(r => r.json()).catch(() => null),
    ])
    const leads = (leadsRes.status === 'ok' || leadsRes.status === 'stale') ? leadsRes.data ?? [] : []
    const deals = (dealsRes.status === 'ok' || dealsRes.status === 'stale') ? dealsRes.data ?? [] : []
    const feed  = (feedRes.status  === 'ok' || feedRes.status  === 'stale') ? feedRes.data  ?? [] : []
    const emailsToday = emailStatsRes?.data?.sent_today ?? 0
    const botCost = Math.round(ueRes?.total_cost_usd ?? 0)

    setStats({
      emailsToday,
      leads: leads.length,
      hot: leads.filter(l => l.temperature === 'HOT').length,
      botCost,
      replies: feed.filter(e =>
        (e.type === 'reply_interested' || e.type === 'reply_received') && isToday(e.timestamp)
      ).length,
      mrr: Math.round(
        deals.filter(d => d.stage === 'Active').reduce((sum, d) => sum + d.amount, 0) / 1000
      ),
    })
  }, [cohortId])

  useEffect(() => {
    let cancelled = false
    colonyFetch<BotPayload[]>('bots', { cohortId }).then(res => {
      if (cancelled) return
      setBots(res.status === 'ok' && res.data ? res.data : [])
    })
    return () => { cancelled = true }
  }, [cohortId])

  useEffect(() => { loadStats() }, [loadStats])

  const hotRate = stats.leads > 0 ? Math.round((stats.hot / stats.leads) * 100) : 0
  const costPerLead = stats.leads > 0 && stats.botCost > 0
    ? `~$${Math.round(stats.botCost / stats.leads)}/lead`
    : null
  const arrLabel = stats.mrr > 0 ? `$${stats.mrr * 12}k ARR` : 'no active contracts'

  const STAT_CARDS = [
    { label: 'EMAILS TODAY',  value: stats.emailsToday, color: '#a78bfa', prefix: '',  suffix: '', subtitle: 'outreach sent today' },
    { label: 'ACTIVE LEADS',  value: stats.leads,       color: '#34d399', prefix: '',  suffix: '', subtitle: `${hotRate}% HOT rate` },
    { label: 'HOT LEADS',     value: stats.hot,         color: '#E11D48', prefix: '',  suffix: '', subtitle: stats.hot > 0 ? 'respond now' : 'all followed up ✓' },
    { label: 'REPLIES TODAY', value: stats.replies,     color: '#60a5fa', prefix: '',  suffix: '', subtitle: 'inbound signals' },
    { label: 'BOT COST 30D',  value: stats.botCost,     color: '#f97316', prefix: '$', suffix: '', subtitle: costPerLead ?? 'this period' },
    { label: 'MRR PIPELINE',  value: stats.mrr,         color: '#2AA5A0', prefix: '$', suffix: 'k', subtitle: arrLabel },
  ]

  return (
    <ColonyErrorBoundary>
      {/* Full-viewport shell */}
      <div style={{ position: 'relative', height: 'calc(100vh - 56px)', overflow: 'hidden', background: '#080d18' }}>

        {/* Background — orbs + dot grid, same DNA as homepage Hero */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div className="ch-orb ch-orb-1" />
          <div className="ch-orb ch-orb-2" />
          <div className="ch-orb ch-orb-3" />
          <div className="ch-dots" />
        </div>

        {/* Scrollable content area */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', overflowY: 'auto', scrollbarWidth: 'thin' }}>
          <main style={{
            padding: '24px 32px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: '100%',
          }}>

            {/* ── Stats stripe ─────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              {STAT_CARDS.map(({ label, value, color, prefix, suffix, subtitle }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                  className="ch-stat-card"
                >
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(32px, 4.5vw, 54px)',
                    color,
                    lineHeight: 1,
                    letterSpacing: '-1px',
                    textAlign: 'center',
                  }}>
                    <CountUp end={value} prefix={prefix} suffix={suffix} />
                  </div>
                  <div style={{
                    marginTop: 10,
                    fontSize: 'clamp(11px, 1vw, 14px)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: 'rgba(255,255,255,.6)',
                    textAlign: 'center',
                  }}>
                    {label}
                  </div>
                  {subtitle && (
                    <div style={{
                      marginTop: 4,
                      fontSize: 'clamp(11px, 1vw, 14px)',
                      color: 'rgba(255,255,255,.32)',
                      fontWeight: 500,
                      letterSpacing: '0.2px',
                      textAlign: 'center',
                    }}>
                      {subtitle}
                    </div>
                  )}
                  {/* Corner glow matching stat color */}
                  <div style={{
                    position: 'absolute',
                    bottom: -30, right: -10,
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.09,
                    filter: 'blur(36px)',
                    pointerEvents: 'none',
                  }} />
                </motion.div>
              ))}
            </div>

            {/* ── Row 1: Priority Alerts · Crew Status · MRR snapshot ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
            >
              <div className="ch-panel" style={{ padding: 20, height: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <PriorityAlertsCard />
              </div>
              <div className="ch-panel" style={{ padding: 20, height: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <CrewSummaryCard
                  bots={bots}
                  onBotClick={(bot) => {
                    capture('colony_bot_clicked', { bot_id: bot.id, bot_name: bot.name, source: 'home_crew_card' })
                    open({ title: bot.name, subtitle: bot.role, width: 'medium', children: <BotProfilePanel bot={bot} /> })
                  }}
                />
              </div>
              {/* MRR snapshot */}
              <div className="ch-panel" style={{ padding: 20, height: 200, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Revenue</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', color: '#2AA5A0', lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>
                  ${stats.mrr}k
                </div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>MRR Pipeline</div>
                <div style={{ marginTop: 3, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>{arrLabel}</div>
                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 2 }}>Bot investment 30d</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
                    ${stats.botCost} · {costPerLead ?? 'tracking cost/lead'}
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: -20, right: -8, width: 90, height: 90, borderRadius: '50%', background: '#2AA5A0', opacity: 0.08, filter: 'blur(30px)', pointerEvents: 'none' }} />
              </div>
            </motion.div>

            {/* ── Row 2: Quick outreach pulse ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div className="ch-panel" style={{ padding: '18px 20px', height: 112, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', color: '#a78bfa', lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>{stats.emailsToday}</div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>Sent Today</div>
                <div style={{ marginTop: 3, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>{stats.replies > 0 ? `${stats.replies} repl${stats.replies === 1 ? 'y' : 'ies'} back` : 'no replies yet'}</div>
                <div style={{ position: 'absolute', bottom: -20, right: -8, width: 80, height: 80, borderRadius: '50%', background: '#a78bfa', opacity: 0.07, filter: 'blur(28px)', pointerEvents: 'none' }} />
              </div>
              <div className="ch-panel" style={{ padding: '18px 20px', height: 112, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', color: '#E11D48', lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>{stats.hot}</div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>HOT Leads</div>
                <div style={{ marginTop: 3, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>{hotRate}% of {stats.leads} active · {stats.hot > 0 ? 'respond now' : 'all clear ✓'}</div>
                <div style={{ position: 'absolute', bottom: -20, right: -8, width: 80, height: 80, borderRadius: '50%', background: '#E11D48', opacity: 0.07, filter: 'blur(28px)', pointerEvents: 'none' }} />
              </div>
              <div className="ch-panel" style={{ padding: '18px 20px', height: 112, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', color: '#60a5fa', lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>{stats.replies}</div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>Replies Today</div>
                <div style={{ marginTop: 3, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>{stats.emailsToday > 0 && stats.replies > 0 ? `${Math.round((stats.replies / stats.emailsToday) * 100)}% reply rate` : 'inbound signals'}</div>
                <div style={{ position: 'absolute', bottom: -20, right: -8, width: 80, height: 80, borderRadius: '50%', background: '#60a5fa', opacity: 0.07, filter: 'blur(28px)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* ── Crew strip — centered, just above activity feed ── */}
            {bots && bots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.48, ease: EASE }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.10)',
                  borderRadius: 14,
                }}
              >
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1.5px', color: 'rgba(255,255,255,.35)',
                  flexShrink: 0,
                }}>
                  CREW
                </span>

                {/* Chips centered between label and count */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {bots.map(bot => {
                    const live = lastRunIsRecent(bot.last_run_at, 1)
                    return (
                      <button
                        key={bot.id}
                        onClick={() => {
                          capture('colony_bot_clicked', { bot_id: bot.id, bot_name: bot.name, source: 'home_strip' })
                          open({
                            title: bot.name,
                            subtitle: bot.role,
                            width: 'medium',
                            children: <BotProfilePanel bot={bot} />,
                          })
                        }}
                        className="ch-bot-chip"
                        style={{
                          background: live ? 'rgba(52,211,153,.08)' : 'rgba(255,255,255,.04)',
                          border: `1px solid ${live ? 'rgba(52,211,153,.20)' : 'rgba(255,255,255,.08)'}`,
                        }}
                      >
                        <span style={{ fontSize: 15, lineHeight: 1 }}>{bot.avatar_emoji}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: live ? '#fff' : 'rgba(255,255,255,.5)',
                          letterSpacing: '0.1px',
                          whiteSpace: 'nowrap',
                        }}>
                          {bot.name.split(' ')[0]}
                        </span>
                        {live && <div className="ch-pulse" />}
                      </button>
                    )
                  })}
                </div>

                <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.28)' }}>
                  {bots.filter(b => lastRunIsRecent(b.last_run_at, 1)).length}/{bots.length} live
                </span>
              </motion.div>
            )}

            {/* ── Original 3 columns, moved down and shorter ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.52 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr',
                gap: 20,
                flex: 1,
                minHeight: 300,
              }}
            >
              {/* Left — Bill Nye */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignSelf: 'flex-start', width: '100%' }}>
                <div className="ch-panel" style={{ padding: 20, aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <BillNyeHomeCard />
                </div>
              </div>

              {/* Center — Activity feed */}
              <div className="ch-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{
                  padding: '14px 22px 10px',
                  borderBottom: '1px solid rgba(255,255,255,.08)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    fontFamily: "var(--colony-font-headline, 'Plus Jakarta Sans')",
                    fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,.85)',
                    letterSpacing: '-0.2px',
                  }}>
                    Activity Feed
                  </span>
                  <div
                    className="ch-pulse"
                    title={anyRunning ? 'Bots are running' : 'No bots running'}
                    style={{
                      background: anyRunning ? '#34d399' : '#ef4444',
                      boxShadow: anyRunning ? '0 0 8px #34d399' : '0 0 6px #ef4444',
                    }}
                  />
                </div>
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', paddingBottom: 8 }}>
                  <ActivityFeed />
                </div>
              </div>

              {/* Right — Cost per Lead */}
              <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: 'calc(100% - 90px)' }}>
                <div className="ch-panel" style={{ padding: 20, paddingBottom: 25, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <CostPerLeadCard />
                </div>
              </div>
            </motion.div>

          </main>
        </div>
      </div>

      <style>{`
        /* ── Background ── */
        .ch-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; will-change: transform; filter: blur(100px);
        }
        .ch-orb-1 {
          width: 750px; height: 750px; top: -22%; right: -12%;
          background: radial-gradient(circle, rgba(42,165,160,.25) 0%, transparent 70%);
          animation: chO1 22s ease-in-out infinite;
        }
        .ch-orb-2 {
          width: 550px; height: 550px; bottom: -18%; left: -8%;
          background: radial-gradient(circle, rgba(42,165,160,.10) 0%, transparent 70%);
          animation: chO2 28s ease-in-out infinite;
        }
        .ch-orb-3 {
          width: 400px; height: 400px; top: 35%; left: 45%;
          background: radial-gradient(circle, rgba(80,180,220,.05) 0%, transparent 70%);
          animation: chO3 32s ease-in-out infinite;
        }
        .ch-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(42,165,160,.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        @keyframes chO1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,35px)} }
        @keyframes chO2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(35px,-25px)} }
        @keyframes chO3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,-18px)} }

        /* ── Glass panel ── */
        .ch-panel {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 20px;
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          box-shadow:
            0 24px 60px rgba(0,0,0,.35),
            0 0 0 1px rgba(42,165,160,.07),
            inset 0 1px 0 rgba(255,255,255,.06);
        }

        /* ── Stat card ── */
        .ch-stat-card {
          position: relative;
          padding: 24px 22px 22px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 20px;
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          box-shadow:
            0 20px 56px rgba(0,0,0,.30),
            inset 0 1px 0 rgba(255,255,255,.06);
          overflow: hidden;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .ch-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 28px 68px rgba(0,0,0,.42),
            inset 0 1px 0 rgba(255,255,255,.08);
        }

        /* ── Bot strip chip ── */
        .ch-bot-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 10px 5px 8px;
          border-radius: 8px;
          cursor: pointer; flex-shrink: 0;
          transition: transform 180ms ease, opacity 180ms ease;
        }
        .ch-bot-chip:hover { transform: translateY(-2px); }

        /* ── Pulse dot — identical to Hero .h-dash-pulse ── */
        .ch-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: #34d399; box-shadow: 0 0 8px #34d399;
          animation: chPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes chPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .5; transform: scale(.8); }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ch-stat-card { padding: 18px 16px; }
        }
        @media (max-width: 900px) {
          /* two-up stats, stacked layout */
        }
      `}</style>
    </ColonyErrorBoundary>
  )
}
