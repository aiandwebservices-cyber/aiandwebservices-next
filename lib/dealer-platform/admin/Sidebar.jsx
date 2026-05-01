'use client';
import {
  LayoutDashboard, Car, Plus, Users, BadgeCheck, CheckSquare, Calculator,
  Wrench, Archive, Megaphone, BarChart3, Activity, Settings as SettingsIcon,
  FileText, ChevronLeft, TrendingUp,
} from 'lucide-react';
import { useContext } from 'react';
import { GOLD, RED_ACCENT } from './_internals';
import { AdminConfigContext } from './AdminConfigContext';

export const NAV_ITEMS = [
  // main
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard, group: 'main' },
  { id: 'inventory',    label: 'Inventory',      icon: Car,             group: 'main' },
  { id: 'addVehicle',   label: 'Add Vehicle',    icon: Plus,            group: 'main' },
  { id: 'leads',        label: 'Leads',          icon: Users,           group: 'main' },
  { id: 'customers',    label: 'Customers',      icon: BadgeCheck,      group: 'main' },
  { id: 'tasks',        label: 'Tasks',          icon: CheckSquare,     group: 'main' },
  { id: 'deals',        label: 'Deal Builder',   icon: Calculator,      group: 'main' },
  { id: 'documents',    label: 'Documents',      icon: FileText,        group: 'main' },
  { id: 'appointments', label: 'Service',        icon: Wrench,          group: 'main' },
  { id: 'sold',         label: 'Sold Vehicles',  icon: Archive,         group: 'main' },
  // tools
  { id: 'marketing',    label: 'Marketing',      icon: Megaphone,       group: 'tools' },
  { id: 'reporting',    label: 'Reporting',      icon: BarChart3,       group: 'tools' },
  { id: 'roi',          label: 'ROI Dashboard',  icon: TrendingUp,      group: 'tools' },
  { id: 'performance',  label: 'Performance',    icon: Activity,        group: 'tools' },
  // settings
  { id: 'settings',     label: 'Settings',       icon: SettingsIcon,    group: 'settings' },
];

const GROUPS = [
  { id: 'main',     label: 'Workspace' },
  { id: 'tools',    label: 'Tools' },
  { id: 'settings', label: 'Account' },
];

export function Sidebar({
  activeTab, setActiveTab,
  sidebarCollapsed, setSidebarCollapsed,
  sidebarOpen, setSidebarOpen,
  navBadges = {},
}) {
  const config = useContext(AdminConfigContext);
  const dealerName = config?.dealerName || 'Demo Auto Group';
  const initial = dealerName.trim().charAt(0).toUpperCase() || 'D';

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`transition-all duration-200 no-print
        fixed inset-y-0 left-0 z-50 h-screen transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:self-start lg:h-screen lg:z-20 lg:translate-x-0
        ${sidebarCollapsed ? 'w-16' : 'w-56'}`}
        style={{ background: '#111111', borderRight: '1px solid #1A1A1A' }}>

        {/* Brand block */}
        <div className="flex items-center gap-2.5 px-3 h-14" style={{ borderBottom: '1px solid #1A1A1A' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: GOLD }}>
            <span className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{initial}</span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{dealerName}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: '#6B7280' }}>Admin</div>
            </div>
          )}
        </div>

        <nav className="py-3 px-2 flex flex-col gap-0.5 overflow-y-auto" style={{ height: 'calc(100vh - 3.5rem - 3.5rem)' }}>
          {GROUPS.map((g, gi) => {
            const items = NAV_ITEMS.filter(i => i.group === g.id);
            return (
              <div key={g.id}>
                {gi > 0 && <div className="my-2 mx-2" style={{ borderTop: '1px solid #1A1A1A' }} />}
                {!sidebarCollapsed && (
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium"
                    style={{ color: '#6B7280' }}>{g.label}</div>
                )}
                {items.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  const badgeCount = navBadges[item.id] || 0;
                  const showBadge = badgeCount > 0;
                  const badgeColor = item.id === 'appointments' ? '#F59E0B' : RED_ACCENT;
                  return (
                    <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className="group flex items-center gap-3 px-3 rounded-lg text-[13px] relative w-full"
                      style={{
                        height: 40,
                        background: isActive ? '#1A1A1A' : 'transparent',
                        color: isActive ? '#FFFFFF' : '#9CA3AF',
                        fontWeight: isActive ? 600 : 500,
                        borderLeft: isActive ? `2px solid ${GOLD}` : '2px solid transparent',
                        transition: 'background-color 100ms ease, color 100ms ease',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#1A1A1A'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Icon className="w-4 h-4 shrink-0"
                        strokeWidth={isActive ? 2.25 : 1.85}
                        style={{ color: isActive ? GOLD : '#9CA3AF', opacity: isActive ? 1 : 0.5 }} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {showBadge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: badgeColor, color: 'white' }}>{badgeCount}</span>
                          )}
                        </>
                      )}
                      {sidebarCollapsed && showBadge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: badgeColor }} />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ borderTop: '1px solid #1A1A1A' }}>
          <button onClick={() => setSidebarCollapsed(c => !c)}
            className="w-full hidden lg:flex items-center gap-2 text-xs transition"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}>
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button onClick={() => setSidebarOpen(false)}
            className="w-full lg:hidden flex items-center gap-2 text-xs transition"
            style={{ color: '#6B7280' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
