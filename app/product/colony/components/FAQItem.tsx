'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="text-white font-semibold text-base">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: '#2AA5A0' }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-80 pb-5' : 'max-h-0'}`}
      >
        <p className="leading-relaxed" style={{ color: '#94a3b8' }}>{answer}</p>
      </div>
    </div>
  )
}
