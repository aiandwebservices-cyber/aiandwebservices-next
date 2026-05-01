'use client';
import { Menu, Search, Moon, Sun, HelpCircle, Bell } from 'lucide-react';
import { GOLD, RED_ACCENT } from './_internals';
import { NotificationDropdown } from './NotificationDropdown';
import { NAV_ITEMS } from './Sidebar';

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  inventory:    'Inventory',
  addVehicle:   'Add Vehicle',
  leads:        'Leads',
  customers:    'Customers',
  tasks:        'Tasks',
  deals:        'Deal Builder',
  documents:    'Documents',
  appointments: 'Service',
  sold:         'Sold Vehicles',
  marketing:    'Marketing',
  reporting:    'Reporting',
  performance:  'Performance',
  settings:     'Settings',
};

export function TopBar({
  config, settings,
  activeTab,
  setSidebarOpen,
  searchOpen, setSearchOpen,
  adminTheme, toggleTheme,
  helpOpen, setHelpOpen,
  notifOpen, setNotifOpen,
  unreadLeads, reservationCount,
  leads, setLeads, reservations, appointments,
  setActiveTab, flash,
  espoAvailable,
}) {
  const pageTitle = PAGE_TITLES[activeTab] || 'Dashboard';
  const userName = settings?.dealerName || config?.dealerName || 'Dealer';
  const initials = userName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-30 no-print"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
      <div className="flex items-center px-4 lg:px-6 gap-3" style={{ height: 56 }}>
        <button onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-md transition lg:hidden hover:bg-[#F9FAFB]">
          <Menu className="w-5 h-5" style={{ color: '#1A1A1A' }} />
        </button>

        <h1 className="text-base font-semibold tracking-tight truncate" style={{ color: '#1A1A1A' }}>
          {pageTitle}
        </h1>

        <div className="flex-1" />

        <button onClick={() => setSearchOpen(true)}
          title="Search (⌘K)"
          className="hidden sm:inline-flex items-center gap-2 px-3 rounded-md transition text-xs"
          style={{ height: 36, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#6B7280' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}>
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center px-1 py-0.5 ml-1 rounded text-[9px] font-mono"
            style={{ background: '#F9FAFB', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>⌘K</kbd>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium select-none"
          title={espoAvailable ? 'Connected to EspoCRM' : 'Running in demo mode (local storage)'}
          style={{
            background: espoAvailable ? '#F0FDF4' : '#FEFCE8',
            color: espoAvailable ? '#15803D' : '#92400E',
            border: `1px solid ${espoAvailable ? '#BBF7D0' : '#FDE68A'}`,
          }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: espoAvailable ? '#22C55E' : '#EAB308' }} />
          {espoAvailable ? 'CRM' : 'Demo'}
        </div>

        <button onClick={toggleTheme}
          title={adminTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="rounded-md transition flex items-center justify-center"
          style={{ width: 36, height: 36 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          {adminTheme === 'light'
            ? <Moon className="w-4 h-4" strokeWidth={2} style={{ color: '#6B7280' }} />
            : <Sun className="w-4 h-4" strokeWidth={2} style={{ color: '#F59E0B' }} />}
        </button>

        <button onClick={() => setHelpOpen(true)}
          title="Help"
          className="rounded-md transition flex items-center justify-center"
          style={{ width: 36, height: 36 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <HelpCircle className="w-4 h-4" strokeWidth={2} style={{ color: '#6B7280' }} />
        </button>

        <div className="relative">
          <button className="relative rounded-md transition flex items-center justify-center"
            style={{ width: 36, height: 36 }}
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <Bell className="w-4 h-4" strokeWidth={2} style={{ color: '#6B7280' }} />
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

        <div className="flex items-center justify-center rounded-full text-xs font-semibold"
          style={{ width: 32, height: 32, background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#1A1A1A' }}
          title={userName}>
          {initials || 'D'}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
