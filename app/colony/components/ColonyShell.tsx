'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import CohortSwitcher, { CohortProvider } from './CohortSwitcher'
import { SidePanelProvider } from './SidePanel'
import { MRRWidget } from '../health/components/MRRWidget'
import { useCommandPalette } from './CommandPaletteProvider'

const NAV_ITEMS = [
  { href: '/colony',           label: 'Feed' },
  { href: '/colony/inbox',     label: 'Inbox' },
  { href: '/colony/pipeline',  label: 'Pipeline' },
  { href: '/colony/health',    label: 'Health' },
  { href: '/colony/reports',   label: 'Reports' },
  { href: '/colony/analytics', label: 'Analytics' },
  { href: '/colony/team',      label: 'Team' },
]

export default function ColonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { open: openPalette } = useCommandPalette()

  return (
    <CohortProvider>
      <SidePanelProvider>
        <div className="flex min-h-screen">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar — brand only */}
          <aside
            className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
            style={{
              width: 240,
              background: 'var(--colony-bg-chrome)',
              borderRight: '1px solid rgba(255,255,255,.06)',
              flexShrink: 0,
            }}
          >
            {/* Brand area */}
            <div style={{ padding: '20px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <Link
                href="/colony"
                style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
              >
                <span style={{
                  fontFamily: "var(--colony-font-headline, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                }}>
                  Colony
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 500, lineHeight: 1 }}>
                  by
                </span>
                <img
                  src="/logo-icon-transparent.png"
                  alt="AIandWEBservices"
                  style={{ height: 24, width: 'auto', flexShrink: 0 }}
                />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 6px #34d399',
                  animation: 'colonyPulse 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 600, letterSpacing: '.3px' }}>
                  Crew online
                </span>
              </div>
            </div>

            {/* Empty space — Phase 17C will fill this */}
            <div className="flex-1" />

            {/* Cohort switcher */}
            <div className="px-3 pb-5">
              <CohortSwitcher />
            </div>
          </aside>

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--colony-bg-content)' }}>
            {/* Topbar */}
            <header
              className="colony-topbar flex items-center justify-between px-4 shrink-0"
              style={{ height: 56, gap: 8 }}
            >
              {/* Left: mobile menu toggle + nav pills */}
              <div
                className="flex items-center overflow-x-auto"
                style={{ gap: 4, scrollbarWidth: 'none', msOverflowStyle: 'none', flexShrink: 1, minWidth: 0 }}
              >
                <button
                  className="lg:hidden p-1 rounded hover:opacity-70 shrink-0"
                  style={{ color: 'var(--colony-text-primary)', marginRight: 4 }}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
                {NAV_ITEMS.map(({ href, label }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '.4px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        color: isActive ? '#2AA5A0' : 'rgba(255,255,255,.5)',
                        background: isActive ? '#D0F0EF' : 'transparent',
                        transition: 'all 200ms cubic-bezier(.21,.47,.32,.98)',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>

              {/* Right: search, MRR, theme, user */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openPalette}
                  className="hidden md:flex items-center gap-1.5 transition-all"
                  style={{
                    border: '1px solid rgba(255,255,255,.12)',
                    background: 'rgba(255,255,255,.04)',
                    color: 'var(--colony-text-secondary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--colony-radius-pill)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  title="Open command palette"
                  aria-label="Open command palette"
                >
                  <span>Search</span>
                  <kbd style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.1)',
                  }}>
                    ⌘K
                  </kbd>
                </button>
                <MRRWidget />
                <ThemeToggle />
                <UserButton />
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidePanelProvider>
    </CohortProvider>
  )
}
