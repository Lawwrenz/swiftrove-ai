import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  X, LayoutDashboard, Bot, Cpu, Network, Users, ShoppingCart, CreditCard, BarChart3, Settings, Workflow, Heart,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../lib/constants';
import Avatar from './ui/Avatar';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Bot, Cpu, Network, Users, ShoppingCart, CreditCard, BarChart3, Settings, Workflow, Heart,
};

export default function MobileSidebar() {
  const { sidebarOpen, closeSidebar } = useSidebar();
  const { profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    if (sidebarOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, closeSidebar]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-card shadow-xl z-50 transition-transform duration-250 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/nativelyai.svg"
              alt="Swiftrove AI"
              className="w-8 h-8 rounded-lg shadow-lg shadow-indigo-500/20 shrink-0"
            />
            <span className="font-semibold text-foreground text-sm">Swiftrove AI</span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 cursor-pointer
                      ${isActive(item.path)
                        ? 'bg-secondary text-primary'
                        : 'text-text-secondary hover:bg-surface hover:text-foreground'
                      }
                    `}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar initials={getInitials(profile?.full_name || '')} size="md" />
            <div>
              <p className="text-sm font-medium text-foreground">{profile?.full_name || ''}</p>
              <p className="text-xs text-text-secondary">{profile?.role || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </>
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