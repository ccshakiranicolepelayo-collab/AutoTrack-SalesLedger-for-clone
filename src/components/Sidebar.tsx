import { useState } from 'react';
import { LayoutDashboard, Car, Users, Activity, DollarSign, FileBarChart, Settings, Menu, X, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'unit-info', label: 'Unit Information', icon: Car },
  { id: 'client-info', label: 'Client Information', icon: Users },
  { id: 'activity', label: 'Activity Tracking', icon: Activity },
  { id: 'total-gp', label: 'Total Gross Profit', icon: DollarSign },
  { id: 'reports', label: 'View Reports', icon: FileBarChart, route: '/reports' },
  { id: 'logout', label: 'Log Out', icon: LogOut },
];

interface SidebarProps {
  onNavigate: (id: string) => void;
  onSettingsClick: () => void;
  onRouteNavigate?: (route: string) => void;
  onLogout?: () => void;
}

export default function Sidebar({ onNavigate, onSettingsClick, onRouteNavigate, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.id === 'logout') {
      onLogout?.();
    } else if ((item as any).route && onRouteNavigate) {
      onRouteNavigate((item as any).route);
    } else {
      onNavigate(item.id);
    }
    setOpen(false);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-3 z-50 p-2 rounded bg-card border border-border hover:bg-accent transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`fixed top-0 left-0 z-40 h-full w-60 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-4 pt-14 text-lg font-semibold tracking-tight border-b border-sidebar-border">
          Vehicle Sales Tracker
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm hover:bg-sidebar-accent transition-colors text-left ${
                item.id === 'logout' ? 'text-destructive' : ''
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => { onSettingsClick(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="w-4 h-4" />
            System Settings
          </button>
        </div>
      </aside>
    </>
  );
}
