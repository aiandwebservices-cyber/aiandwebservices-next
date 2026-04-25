'use client'

interface BotClickableProps {
  botId: string
  children: React.ReactNode
  className?: string
}

export default function BotClickable({ children, className }: BotClickableProps) {
  return (
    <span
      className={className}
      style={{ color: 'var(--colony-accent)' }}
    >
      {children}
    </span>
  )
}
