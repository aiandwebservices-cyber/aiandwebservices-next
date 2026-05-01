'use client';
import {
  LayoutDashboard, Car, Plus, Users, BadgeCheck, CheckSquare, Calculator,
  Wrench, Archive, Megaphone, BarChart3, Activity, Settings as SettingsIcon,
  ChevronLeft,
} from 'lucide-react';
import { GOLD, RED_ACCENT } from './_internals';

export const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'inventory',    label: 'Inventory',      icon: Car },
  { id: 'addVehicle',   label: 'Add Vehicle',    icon: Plus },
  { id: 'leads',        label: 'Leads',          icon: Users },
  { id: 'customers',    label: 'Customers',      icon: BadgeCheck },
  { id: 'tasks',        label: 'Tasks',          icon: CheckSquare },
  { id: 'deals',        label: 'Deal Builder',   icon: Calculator },
  { id: 'appointments', label: 'Service',        icon: Wrench },
  { id: 'sold',         label: 'Sold Vehicles',  icon: Archive },
  { id: 'marketing',    label: 'Marketing',      icon: Megaphone },
  { id: 'reporting',    label: 'Reporting',      icon: BarChart3 },
  { id: 'performance',  label: 'Performance',    icon: Activity },
  { id: 'settings',     label: 'Settings',       icon: SettingsIcon }
];

/**
 * Sidebar navigation — collapsible on desktop, drawer on mobile.
 * Active item shows gold icon + dark background. Per-item badge colors:
 *   - appointments → amber (pending count)
 *   - others       → red (unread / overdue)
 */
export function Sidebar({
  activeTab, setActiveTab,
  sidebarCollapsed, setSidebarCollapsed,
  sidebarOpen, setSidebarOpen,
  navBadges = {},
}) {
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`bg-white border-r border-stone-200 transition-all duration-200 no-print
        fixed inset-y-0 left-0 z-50 h-screen transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-14 lg:self-start lg:h-[calc(100vh-3.5rem)] lg:z-20 lg:translate-x-0
        ${sidebarCollapsed ? 'w-14' : 'w-48'}`}>
        <nav className="py-3 px-2 flex flex-col gap-1.5">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            const badgeCount = navBadges[item.id] || 0;
            const showBadge = badgeCount > 0;
            const badgeColor = item.id === 'appointments' ? '#C8970F' : RED_ACCENT;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`group flex items-center gap-3 px-2.5 py-2.5 rounded-md text-sm transition relative ${isActive ? 'bg-stone-900 text-white hover:bg-stone-800' : 'text-stone-700 hover:bg-stone-100'}`}>
                <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.25 : 1.85}
                  style={isActive ? { color: GOLD } : {}} />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-medium flex-1 text-left">{item.label}</span>
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
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-200 p-3">
          <button onClick={() => setSidebarCollapsed(c => !c)}
            className="w-full hidden lg:flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition">
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button onClick={() => setSidebarOpen(false)}
            className="w-full lg:hidden flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
