'use client'

import type { Bot } from '../lib/types'
import { lastRunIsRecent, formatDecisionsCount } from '../lib/bot-helpers'
import { useSidePanel } from './SidePanel'
import BotProfilePanel from './BotProfilePanel'
import { capture } from '../lib/posthog'
import { BotStatusDot } from './BotStatusDot'

export default function BotCard({ bot }: { bot: Bot }) {
  const { open } = useSidePanel()
  const isActive = lastRunIsRecent(bot.last_run_at)

  function handleClick() {
    capture('colony_bot_clicked', { bot_id: bot.id, bot_name: bot.name, source: 'roster' })
    open({
      title: bot.name,
      subtitle: bot.role,
      width: 'medium',
      children: <BotProfilePanel bot={bot} />,
    })
  }

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center text-center rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shrink-0${isActive ? ' colony-bot-active' : ''}`}
      style={{
        minWidth: 140,
        height: 120,
        background: 'var(--colony-bg-elevated)',
        border: '1px solid var(--colony-border)',
      }}
    >
      <span
        className="colony-bot-avatar"
        style={{ fontSize: 32, lineHeight: 1, display: 'block', marginBottom: 6 }}
      >
        {bot.avatar_emoji}
      </span>
      <span className="flex items-center gap-1 justify-center text-sm font-bold leading-tight" style={{ color: 'var(--colony-text-primary)' }}>
        {bot.name}
        <BotStatusDot botId={bot.id} size="sm" />
      </span>
      <span className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--colony-text-secondary)' }}>
        {bot.role}
      </span>
      <span className="text-xs mt-auto pt-1" style={{ color: 'var(--colony-accent)' }}>
        {formatDecisionsCount(bot.decisions_this_week)} this week
      </span>
    </button>
  )
}
