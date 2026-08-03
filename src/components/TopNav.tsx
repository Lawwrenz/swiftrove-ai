import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, CheckCircle, DollarSign, ShoppingCart, Users, Bot, MessageSquare, AlertCircle, LogOut, User } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../lib/constants';
import Avatar from './ui/Avatar';
import ThemeToggle from './ThemeToggle';

// --- Notification types ---
interface Notification {
  id: string;
  icon: typeof Bell;
  color: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', icon: CheckCircle, color: '#22C55E', title: 'Payment Verified', description: 'Grace Eze\'s ₦185,000 payment for Custom Celebration Cake has been verified.', time: '2m ago', read: false },
  { id: 'n2', icon: DollarSign, color: '#4F46E5', title: 'Invoice Generated', description: 'Invoice #1050 for Corporate Dessert Package — ₦95,000 ready for Amaka Bello.', time: '5m ago', read: false },
  { id: 'n3', icon: ShoppingCart, color: '#F59E0B', title: 'New Order Placed', description: 'Kofi Asante ordered Premium Pastry Box — ₦35,000.', time: '15m ago', read: false },
  { id: 'n4', icon: AlertCircle, color: '#EF4444', title: 'Payment Issue', description: 'Thabo Mokoena\'s bank declined transaction for Wedding Cake Package.', time: '30m ago', read: false },
  { id: 'n5', icon: Bot, color: '#8B5CF6', title: 'AI Task Complete', description: 'Sales Agent completed quotation for Grace Eze.', time: '1h ago', read: true },
  { id: 'n6', icon: Users, color: '#3B82F6', title: 'New Customer', description: 'Zainab Ibrahim registered for a wedding cake consultation.', time: '2h ago', read: true },
  { id: 'n7', icon: MessageSquare, color: '#22C55E', title: 'Follow-up Sent', description: 'Customer Success sent delivery update to Brian Otieno.', time: '3h ago', read: true },
];

export default function TopNav() {
  const { toggleSidebar, sidebarCollapsed } = useSidebar();
  const { openCommandCenter } = useCommandCenter();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentPage = NAV_ITEMS.find(
    (item) => item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header
      className={`
        sticky top-0 z-20 h-16 bg-card/80 backdrop-blur-md border-b border-border
        flex items-center justify-between px-4 lg:px-6 gap-4
        transition-all duration-200
        ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}
      `}
    >
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-foreground transition-colors duration-150 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          {/* Business logo — small inline */}
          {profile?.business_logo_url && (
            <img
              src={profile.business_logo_url}
              alt=""
              className="w-5 h-5 rounded object-cover mr-1"
            />
          )}
          <span className="text-text-secondary">{profile?.company_name || 'Dashboard'}</span>
          {currentPage && currentPage.path !== '/' && (
            <>
              <ChevronRight size={14} className="text-muted" />
              <span className="text-foreground font-medium">{currentPage.label}</span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* Search - opens Command Center */}
        <button
          onClick={openCommandCenter}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-muted text-sm min-w-[200px] hover:bg-surface-hover hover:border-ring transition-all duration-150 cursor-pointer group"
          aria-label="Open Swift AI Command Center"
        >
          <Search size={16} className="shrink-0 group-hover:text-text-secondary transition-colors" />
          <span className="text-left text-muted flex-1">Search...</span>
          <kbd className="hidden xl:inline-flex text-[10px] text-muted bg-card border border-border px-1.5 py-0.5 rounded font-medium group-hover:bg-surface-hover">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-foreground transition-colors duration-150 cursor-pointer"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifOpen}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-danger text-white text-[9px] font-bold rounded-full ring-2 ring-card px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-32px)] bg-card rounded-xl shadow-xl ring-1 ring-border animate-scale-in z-50 overflow-hidden"
              role="menu"
              aria-label="Notifications"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-primary hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <button
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors duration-150 cursor-pointer hover:bg-surface ${
                          !n.read ? 'bg-primary/[0.02]' : ''
                        }`}
                        role="menuitem"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${n.color}15` }}
                        >
                          <Icon size={15} style={{ color: n.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{n.description}</p>
                          <p className="text-[10px] text-muted mt-1">{n.time}</p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-5 py-8 text-center text-sm text-text-secondary">
                    No notifications yet.
                  </div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-border bg-surface/50">
                <button
                  onClick={() => { setNotifOpen(false); navigate('/settings'); }}
                  className="w-full text-xs font-medium text-primary hover:text-indigo-700 transition-colors cursor-pointer text-center"
                >
                  Notification Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:opacity-80 transition-opacity duration-150"
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground leading-tight">{profile?.full_name || ''}</p>
              <p className="text-xs text-text-secondary">{profile?.role || ''}</p>
            </div>
            <Avatar initials={getInitials(profile?.full_name || '')} size="md" />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-card rounded-xl shadow-xl ring-1 ring-border animate-scale-in z-50 overflow-hidden"
              role="menu"
              aria-label="User menu"
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-text-secondary truncate">{profile?.email || ''}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-foreground transition-colors duration-150 cursor-pointer"
                  role="menuitem"
                >
                  <User size={15} />
                  My Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-foreground transition-colors duration-150 cursor-pointer"
                  role="menuitem"
                >
                  <SettingsIcon size={15} />
                  Settings
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SettingsIcon({ size }: { size?: number }) {
  return (
    <svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
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