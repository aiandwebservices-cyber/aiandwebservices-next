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
import type { LeadPayload, DealPayload, FeedEventPayload, BotPayload } from '@/lib/colony/contracts'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
}

interface HomeStats {
  leads: number
  hot: number
  replies: number
  mrr: number
}

export default function Page() {
  const { cohortId } = useCohort()
  const { open } = useSidePanel()
  const [stats, setStats] = useState<HomeStats>({ leads: 0, hot: 0, replies: 0, mrr: 0 })
  const [bots, setBots] = useState<BotPayload[] | null>(null)

  useEffect(() => { capture('colony_feed_viewed') }, [])

  const loadStats = useCallback(async () => {
    const [leadsRes, dealsRes, feedRes] = await Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
      colonyFetch<FeedEventPayload[]>('feed', { cohortId }),
    ])
    const leads = (leadsRes.status === 'ok' || leadsRes.status === 'stale') ? leadsRes.data ?? [] : []
    const deals = (dealsRes.status === 'ok' || dealsRes.status === 'stale') ? dealsRes.data ?? [] : []
    const feed  = (feedRes.status  === 'ok' || feedRes.status  === 'stale') ? feedRes.data  ?? [] : []

    setStats({
      leads: leads.length,
      hot: leads.filter(l => l.temperature === 'HOT').length,
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

  const STAT_CARDS = [
    { label: 'ACTIVE LEADS',   value: stats.leads,   color: '#34d399', prefix: '',  suffix: '' },
    { label: 'REPLIES TODAY',  value: stats.replies,  color: '#60a5fa', prefix: '',  suffix: '' },
    { label: 'HOT RIGHT NOW',  value: stats.hot,      color: '#E11D48', prefix: '',  suffix: '' },
    { label: 'MRR PIPELINE',   value: stats.mrr,      color: '#2AA5A0', prefix: '$', suffix: 'k' },
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
            maxWidth: 1400,
            margin: '0 auto',
            padding: '24px 32px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: '100%',
          }}>

            {/* ── Stats stripe ─────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {STAT_CARDS.map(({ label, value, color, prefix, suffix }, i) => (
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
                  }}>
                    <CountUp end={value} prefix={prefix} suffix={suffix} />
                  </div>
                  <div style={{
                    marginTop: 10,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: 'rgba(255,255,255,.6)',
                  }}>
                    {label}
                  </div>
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

            {/* ── Bot strip ─────────────────────────────────────────── */}
            {bots && bots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32, ease: EASE }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.10)',
                  borderRadius: 14,
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1.5px', color: 'rgba(255,255,255,.35)',
                  flexShrink: 0, marginRight: 6,
                }}>
                  CREW
                </span>

                {bots.map(bot => {
                  const live = lastRunIsRecent(bot.last_run_at)
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

                <span style={{
                  marginLeft: 'auto', flexShrink: 0,
                  fontSize: 10, fontWeight: 600,
                  color: 'rgba(255,255,255,.28)',
                }}>
                  {bots.filter(b => lastRunIsRecent(b.last_run_at)).length}/{bots.length} live
                </span>
              </motion.div>
            )}

            {/* ── Main content: Feed (left) + Priority column (right) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '65fr 35fr',
                gap: 20,
                flex: 1,
                minHeight: 480,
              }}
            >
              {/* Left — Activity feed */}
              <div className="ch-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{
                  padding: '18px 22px 12px',
                  borderBottom: '1px solid rgba(255,255,255,.08)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '1.5px', color: 'rgba(255,255,255,.45)',
                  }}>
                    RECENT ACTIVITY
                  </span>
                  <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 12 }}>·</span>
                  <span style={{
                    fontFamily: "var(--colony-font-headline, 'Plus Jakarta Sans')",
                    fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.75)',
                    letterSpacing: '-0.1px',
                  }}>
                    Activity Feed
                  </span>
                  <div className="ch-pulse" style={{ marginLeft: 2 }} />
                </div>
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', paddingBottom: 8 }}>
                  <ActivityFeed />
                </div>
              </div>

              {/* Right — Priority column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1.5px', color: 'rgba(255,255,255,.45)',
                }}>
                  TODAY&apos;S PRIORITY
                </div>

                <div className="ch-panel" style={{ padding: 20 }}>
                  <BillNyeHomeCard />
                </div>

                <div className="ch-panel" style={{ padding: 20 }}>
                  <RevenueMoves />
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
