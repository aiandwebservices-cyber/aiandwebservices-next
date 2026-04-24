'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Home, Inbox, TrendingUp, Activity, BarChart2, Menu, Phone } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import CohortSwitcher, { CohortProvider } from './CohortSwitcher'
import { SidePanelProvider } from './SidePanel'

const NAV_ITEMS = [
  { href: '/colony', label: 'Feed', icon: Home },
  { href: '/colony/inbox', label: 'Inbox', icon: Inbox },
  { href: '/colony/pipeline', label: 'Pipeline', icon: TrendingUp },
  { href: '/colony/health', label: 'Health', icon: Activity },
  { href: '/colony/reports', label: 'Reports', icon: BarChart2 },
]

const PAGE_TITLES: Record<string, string> = {
  '/colony': 'Activity Feed',
  '/colony/inbox': 'Inbox',
  '/colony/pipeline': 'Pipeline',
  '/colony/health': 'Health',
  '/colony/reports': 'Reports',
}

export default function ColonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitle = PAGE_TITLES[pathname] ?? 'Colony'

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
          style={{ width: 240, background: 'var(--colony-bg-chrome)', flexShrink: 0 }}
        >
          {/* Wordmark */}
          <div className="px-5 pt-6 pb-4">
            <div className="text-2xl font-black" style={{ color: 'var(--colony-accent)' }}>
              Colony
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--colony-text-chrome)', opacity: 0.5 }}>
              by AIandWEBservices
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-opacity"
                  style={{
                    color: active ? '#fff' : 'var(--colony-text-chrome)',
                    background: active ? 'var(--colony-accent)' : 'transparent',
                    opacity: active ? 1 : 0.65,
                  }}
                >
                  <Icon size={16} />
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
            className="flex items-center justify-between px-4 shrink-0 border-b"
            style={{ height: 48, borderColor: 'var(--colony-border)' }}
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
              <span className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                {pageTitle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="https://cal.com/david-pulis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--colony-accent)', color: '#fff' }}
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
