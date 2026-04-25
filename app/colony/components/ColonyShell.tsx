'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
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
  { href: '/colony/crew',      label: 'Crew' },
  { href: '/colony/reports',   label: 'Reports' },
  { href: '/colony/coach',     label: 'Coach' },
  { href: '/colony/nudges',    label: 'Nudges' },
  { href: '/colony/analytics', label: 'Analytics' },
  { href: '/colony/team',      label: 'Team' },
]

const ADMIN_EMAILS = ['david@aiandwebservices.com', 'aiandwebservices@gmail.com']

export default function ColonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { open: openPalette } = useCommandPalette()
  const { user } = useUser()

  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? ''
  const isAdmin = ADMIN_EMAILS.includes(userEmail)

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
            {/* Brand area — Colony by [logo] only */}
            <div style={{ padding: '20px 20px' }}>
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
            </div>

            {/* Empty space — Phase 17C will fill this */}
            <div className="flex-1" />

            {/* Cohort switcher — admin only */}
            {isAdmin && (
              <div className="px-3 pb-5">
                <CohortSwitcher />
              </div>
            )}
          </aside>

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--colony-bg-content)' }}>
            {/* Topbar */}
            <header
              className="colony-topbar flex items-center justify-between px-4 shrink-0"
              style={{ height: 56, position: 'relative' }}
            >
              {/* LEFT: mobile menu + Crew online */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto', minWidth: 140 }}>
                <button
                  className="lg:hidden p-1 rounded hover:opacity-70"
                  style={{ color: 'var(--colony-text-primary)' }}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 8px #34d399',
                    animation: 'colonyPulse 2s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', fontWeight: 600, letterSpacing: '.3px' }}>
                    Crew online
                  </span>
                </div>
              </div>

              {/* CENTER: Nav pills — visually centered to viewport (compensate for sidebar on lg+) */}
              <nav
                className="colony-nav-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
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
                      }}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>

              {/* RIGHT: search, MRR, theme, user */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto', marginLeft: 'auto' }}>
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
