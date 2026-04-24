'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Home, Inbox, TrendingUp, Activity, BarChart2, LineChart, Menu, Phone } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import CohortSwitcher, { CohortProvider } from './CohortSwitcher'
import { SidePanelProvider } from './SidePanel'
import { MRRWidget } from '../health/components/MRRWidget'
import { useCommandPalette } from './CommandPaletteProvider'

const NAV_ITEMS = [
  { href: '/colony', label: 'Feed', icon: Home },
  { href: '/colony/inbox', label: 'Inbox', icon: Inbox },
  { href: '/colony/pipeline', label: 'Pipeline', icon: TrendingUp },
  { href: '/colony/health', label: 'Health', icon: Activity },
  { href: '/colony/reports', label: 'Reports', icon: BarChart2 },
  { href: '/colony/analytics', label: 'Analytics', icon: LineChart },
]

const PAGE_TITLES: Record<string, string> = {
  '/colony': 'Activity Feed',
  '/colony/inbox': 'Inbox',
  '/colony/pipeline': 'Pipeline',
  '/colony/health': 'Health',
  '/colony/reports': 'Reports',
  '/colony/analytics': 'Analytics',
}

export default function ColonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitle = PAGE_TITLES[pathname] ?? 'Colony'
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

        {/* Sidebar */}
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
          {/* Wordmark */}
          <div className="px-5 pt-6 pb-4">
            <div
              style={{
                fontFamily: 'var(--colony-font-headline)',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: 'var(--colony-text-primary)',
                lineHeight: 1,
              }}
            >
              Colony
            </div>
            <div
              style={{
                fontSize: 10,
                marginTop: 4,
                color: 'var(--colony-teal-600)',
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              by AIandWEBservices
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`colony-nav-pill ${active ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: 13,
                    padding: '9px 14px',
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 pb-5 space-y-3">
            <CohortSwitcher />
            <div className="flex justify-center">
              <UserButton />
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--colony-bg-content)' }}>
          {/* Topbar */}
          <header
            className="colony-topbar flex items-center justify-between px-4 shrink-0"
            style={{ height: 56 }}
          >
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-1 rounded hover:opacity-70"
                style={{ color: 'var(--colony-text-primary)' }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <span
                style={{
                  fontFamily: 'var(--colony-font-headline)',
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: '-0.3px',
                  color: 'var(--colony-text-primary)',
                }}
              >
                {pageTitle}
              </span>
            </div>
            <div className="flex items-center gap-2">
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
                <kbd
                  style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,.08)',
                    border: '1px solid rgba(255,255,255,.1)',
                  }}
                >
                  ⌘K
                </kbd>
              </button>
              <ThemeToggle />
              <MRRWidget />
              <a
                href="https://cal.com/david-pulis"
                target="_blank"
                rel="noopener noreferrer"
                className="colony-btn-primary hidden sm:inline-flex items-center gap-1.5"
                style={{ padding: '8px 18px', fontSize: 12 }}
              >
                <Phone size={12} />
                Book a call
              </a>
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
