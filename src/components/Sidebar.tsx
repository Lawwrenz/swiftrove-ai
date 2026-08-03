import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Bot, Cpu, Network, Users, ShoppingCart, CreditCard,
  BarChart3, Settings, LogOut, PanelRightClose, PanelRightOpen, Workflow, Heart,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../lib/constants';
import Avatar from './ui/Avatar';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Bot, Cpu, Network, Users, ShoppingCart, CreditCard, BarChart3, Settings, Workflow, Heart,
};

export default function Sidebar() {
  const { sidebarCollapsed, toggleCollapsed } = useSidebar();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-card border-r border-border
        transition-all duration-200 ease-out z-30
        ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border ${sidebarCollapsed ? 'justify-center px-3' : 'px-6 gap-3'}`}>
        {profile?.business_logo_url ? (
          <img
            src={profile.business_logo_url}
            alt="Business logo"
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
        ) : (
          <img
            src="/nativelyai.svg"
            alt="Swiftrove AI"
            className="w-8 h-8 rounded-lg shadow-lg shadow-indigo-500/20 shrink-0"
          />
        )}
        {!sidebarCollapsed && (
          <span className="font-semibold text-foreground text-sm whitespace-nowrap">
            {profile?.company_name || 'Swiftrove AI'}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 cursor-pointer group relative
                    ${isActive(item.path)
                      ? 'bg-secondary text-primary'
                      : 'text-text-secondary hover:bg-surface hover:text-foreground'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {Icon && <Icon size={20} className="shrink-0" />}
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {item.badge && !sidebarCollapsed && (
                    <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-md
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150
                      whitespace-nowrap z-50 pointer-events-none shadow-lg">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapsed}
        className="flex items-center justify-center py-3 px-3 border-t border-border text-muted hover:text-foreground hover:bg-surface transition-colors duration-150 cursor-pointer"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
      </button>

      {/* User menu */}
      <div className={`border-t border-border p-3 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? '' : 'px-1'}`}>
          <Avatar initials={profile ? getInitials(profile.full_name) : '?'} size="md" />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || ''}</p>
              <p className="text-xs text-text-secondary truncate">{profile?.role || ''}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={async () => { await signOut(); navigate('/login'); }}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors duration-150 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}