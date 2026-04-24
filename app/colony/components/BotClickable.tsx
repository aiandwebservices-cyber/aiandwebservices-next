'use client'

import { useCohort } from './CohortSwitcher'
import { useSidePanel } from './SidePanel'
import { getBotById } from '../lib/bot-helpers'
import BotProfilePanel from './BotProfilePanel'
import { capture } from '../lib/posthog'

interface BotClickableProps {
  botId: string
  children: React.ReactNode
  className?: string
}

export default function BotClickable({ botId, children, className }: BotClickableProps) {
  const { cohortId } = useCohort()
  const { open } = useSidePanel()

  function handleClick() {
    const bot = getBotById(botId, cohortId)
    if (!bot) return
    capture('colony_bot_clicked', { bot_id: bot.id, bot_name: bot.name, source: 'clickable' })
    open({
      title: bot.name,
      subtitle: bot.role,
      width: 'medium',
      children: <BotProfilePanel bot={bot} />,
    })
  }

  return (
    <span
      onClick={handleClick}
      className={className}
      style={{ cursor: 'pointer', borderBottom: '1px dotted var(--colony-accent)', color: 'inherit' }}
    >
      {children}
    </span>
  )
}
