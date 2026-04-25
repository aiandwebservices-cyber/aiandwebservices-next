'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'
import { CohortProvider } from './CohortSwitcher'
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
  { href: '/colony/social',    label: 'Social' },
  { href: '/colony/analytics', label: 'Analytics' },
  { href: '/colony/team',      label: 'Team' },
]

export default function ColonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { open: openPalette } = useCommandPalette()

  return (
    <CohortProvider>
      <SidePanelProvider>
        <div className="flex flex-col min-h-screen" style={{ background: 'var(--colony-bg-content)' }}>
          {/* Topbar */}
          <header
            className="colony-topbar flex items-center justify-between px-4 shrink-0"
            style={{ height: 56, position: 'relative' }}
          >
              {/* LEFT: brand */}
              <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                <Link
                  href="/colony"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                >
                  <span style={{
                    fontFamily: "var(--colony-font-headline, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.4px',
                    lineHeight: 1,
                  }}>
                    &nbsp;&nbsp;&nbsp;Colony
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 500, lineHeight: 1 }}>
                    by
                  </span>
                  <img
                    src="/logo-final/logoFINAL-aiandweb-transparent-whitetext.svg"
                    alt="AIandWEBservices"
                    style={{ height: 37, width: 'auto', flexShrink: 0 }}
                  />
                </Link>
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
                      className="colony-topbar-link"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '.4px',
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
      </SidePanelProvider>
    </CohortProvider>
  )
}
