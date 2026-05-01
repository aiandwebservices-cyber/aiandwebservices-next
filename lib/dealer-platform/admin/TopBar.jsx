'use client';
import { Menu, Search, Moon, Sun, HelpCircle, Bell } from 'lucide-react';
import { GOLD, RED_ACCENT } from './_internals';
import { NotificationDropdown } from './NotificationDropdown';

/**
 * Topbar — sticky at top, hosts:
 *   - Mobile hamburger (opens sidebar drawer)
 *   - Dealer logo + name + "Dealer Dashboard" tagline
 *   - "Signed in as" indicator
 *   - Search button (Cmd+K)
 *   - Theme toggle (sun/moon)
 *   - Help button
 *   - Notification bell + dropdown
 *   - User avatar (initials)
 */
export function TopBar({
  config, settings,
  setSidebarOpen,
  searchOpen, setSearchOpen,
  adminTheme, toggleTheme,
  helpOpen, setHelpOpen,
  notifOpen, setNotifOpen,
  unreadLeads, reservationCount,
  leads, setLeads, reservations, appointments,
  setActiveTab, flash,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200 no-print">
      <div className="flex items-center h-14 px-4 lg:px-6 gap-4">
        <button onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded hover:bg-stone-100 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #9a7d28 100%)` }}>
            <span className="font-display font-bold text-[13px] text-white">P</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[15px] font-semibold tracking-tight">{config.dealerName || 'Demo Auto Group'}</span>
              <span className="text-stone-300 hidden sm:inline">/</span>
              <span className="text-[12px] smallcaps text-stone-500 hidden sm:inline">Dealer Dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2 text-xs text-stone-600">
          <span className="smallcaps text-stone-400">Signed in as</span>
          <span className="font-medium text-stone-900">{settings.dealerName || config.dealerName || 'Dealer'}</span>
        </div>

        <button onClick={() => setSearchOpen(true)}
          title="Search (⌘K)"
          className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-stone-200 hover:bg-stone-100 text-xs text-stone-500 transition">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center px-1 py-0.5 ml-1 rounded text-[9px] font-mono bg-stone-100 text-stone-500 border border-stone-200">⌘K</kbd>
        </button>

        <button onClick={toggleTheme}
          title={adminTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded hover:bg-stone-100 transition">
          {adminTheme === 'light'
            ? <Moon className="w-4 h-4 text-stone-700" strokeWidth={2} />
            : <Sun className="w-4 h-4 text-amber-400" strokeWidth={2} />}
        </button>

        <button onClick={() => setHelpOpen(true)}
          title="Help"
          className="p-2 rounded hover:bg-stone-100 transition">
          <HelpCircle className="w-4 h-4 text-stone-700" strokeWidth={2} />
        </button>

        <div className="relative">
          <button className="relative p-2 rounded hover:bg-stone-100" onClick={() => setNotifOpen(o => !o)}
            title="Notifications">
            <Bell className="w-4 h-4 text-stone-700" strokeWidth={2} />
            {(unreadLeads + reservationCount) > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center pulse-dot"
                style={{ backgroundColor: RED_ACCENT }}>{unreadLeads + reservationCount}</span>
            )}
          </button>
          {notifOpen && (
            <NotificationDropdown
              leads={leads} setLeads={setLeads} unreadLeads={unreadLeads}
              reservations={reservations} appointments={appointments}
              setActiveTab={setActiveTab} flash={flash}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-semibold text-stone-700">
          {(settings.dealerName || config.dealerName || 'M E').split(' ').map(p => p[0]).slice(0, 2).join('')}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
