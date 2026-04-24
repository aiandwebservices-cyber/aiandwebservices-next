'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('colony-theme') as 'dark' | 'light' | null
    if (stored) {
      setTheme(stored)
      document.querySelector('.colony-root')?.setAttribute('data-theme', stored)
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('colony-theme', next)
    document.querySelector('.colony-root')?.setAttribute('data-theme', next)
  }

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg transition-colors hover:opacity-70"
      style={{ color: 'var(--colony-text-primary)' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
