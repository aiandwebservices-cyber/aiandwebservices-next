'use client'

import { useEffect } from 'react'
import type { Bot } from '../lib/types'
import { formatLastRun, formatDecisionsCount } from '../lib/bot-helpers'
import { capture } from '../lib/posthog'

function getBotSchedule(botName: string): string {
  switch (botName) {
    case 'Bill Nye': return 'Runs weekly on Sundays at 11pm'
    case 'Coach': return 'Runs after every master_pipeline execution'
    case 'Scheduler': return 'Runs master_pipeline 3x daily at 8am / 1pm / 6pm'
    default: return 'Runs as part of master_pipeline'
  }
}

const BOT_DECISIONS: Record<string, string[]> = {
  'Bill Nye': [
    'Flagged Torres Insurance as HOT priority',
    'Detected LinkedIn saturation in Miami dental segment',
    'Identified Tuesday as peak engagement day',
  ],
  'Coach': [
    'Rejected fact claim about practice size',
    'Flagged declining LinkedIn response rate — 31% drop',
    'Recommended source rotation to referral + Google Maps',
  ],
  'Fact Checker': [
    'Rejected 3 of 22 business claims this cycle',
    'Verified Coral Gables Family Dental website data',
    'Flagged duplicate entry: Doral Dental / Doral Dental Center',
  ],
  'Lead Researcher': [
    'Surfaced 14 new prospects in Miami metro dental',
    'Identified pediatric dental as high-velocity segment',
    'Added 5 HOT-scored prospects from Google Maps sweep',
  ],
  'Bob': [
    'Drafted personalized email for Dr. Anna Patel',
    'Queued 18 outreach emails for HOT + WARM segment',
    'Adapted template for orthodontics niche tone',
  ],
  'Scheduler': [
    'Ran master_pipeline at 8am — 9 leads discovered',
    'Ran master_pipeline at 1pm — 14 leads, 3 HOT scored',
    'Queued 6pm run with updated niche filters',
  ],
  'Harvester': [
    'Pulled 300 new business records from Google Maps',
    'Deduplicated 42 existing records in EspoCRM',
    'Added landscaping segment data for Hialeah metro',
  ],
  'Archivist': [
    'Indexed 47 leads to Qdrant vector store',
    'Updated embedding for Torres Insurance profile',
    'Cleared 12 stale embeddings from Q1',
  ],
}

export default function BotProfilePanel({ bot }: { bot: Bot }) {
  useEffect(() => {
    capture('colony_bot_profile_viewed', { bot_id: bot.id, bot_name: bot.name })
  }, [bot.id, bot.name])

  const decisions = BOT_DECISIONS[bot.name] ?? ['Processed pipeline data', 'Updated records', 'Completed scheduled task']
  const schedule = getBotSchedule(bot.name)

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="flex items-center gap-4">
        <span style={{ fontSize: 64, lineHeight: 1 }}>{bot.avatar_emoji}</span>
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>{bot.name}</h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>{bot.role}</p>
        </div>
      </div>

      {/* Last Run */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Last run · {formatLastRun(bot.last_run_at)}
        </p>
        <p className="text-sm italic" style={{ color: 'var(--colony-text-primary)' }}>
          &ldquo;{bot.last_output_summary}&rdquo;
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'This week', value: formatDecisionsCount(bot.decisions_this_week) },
          { label: 'Success rate', value: '94%' },
          { label: 'Time saved', value: '~6.2 hrs' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
          >
            <p className="text-lg font-bold" style={{ color: 'var(--colony-accent)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Decisions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Recent Decisions
        </p>
        <ul className="flex flex-col gap-2">
          {decisions.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm rounded-lg px-3 py-2"
              style={{ background: 'var(--colony-bg-elevated)', color: 'var(--colony-text-primary)' }}
            >
              <span style={{ color: 'var(--colony-accent)', marginTop: 2 }}>›</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Schedule
        </p>
        <p className="text-sm" style={{ color: 'var(--colony-text-primary)' }}>{schedule}</p>
      </div>

      {/* Footer */}
      <button
        className="text-sm text-left hover:opacity-70 transition-opacity"
        style={{ color: 'var(--colony-accent)' }}
        onClick={() => console.log(`View all ${bot.name} history`)}
      >
        View all {bot.name}&rsquo;s history →
      </button>
    </div>
  )
}
