import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import MobileSidebar from './MobileSidebar';
import CommandCenter from './CommandCenter';
import SwiftPanel from './SwiftPanel';
import ProactiveInsightToast from './ProactiveInsightToast';
import { useSidebar } from '../context/SidebarContext';
import { useSwift } from '../context/SwiftContext';

export default function Layout() {
  const { sidebarCollapsed } = useSidebar();
  const { openSwift, isOpen: isSwiftOpen } = useSwift();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <CommandCenter />
      <SwiftPanel />

      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <TopNav />

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Swift AI button */}
      {!isSwiftOpen && (
        <button
          onClick={openSwift}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30
            hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-[0.95] transition-all duration-200
            flex items-center justify-center cursor-pointer group overflow-hidden
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open Swift AI Executive Assistant"
        >
          <Sparkles size={22} className="text-white group-hover:rotate-12 transition-transform duration-300 relative z-10" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          {/* Hover glow */}
          <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
          {/* Ripple container */}
          <span className="ripple-container" aria-hidden="true" />
        </button>
      )}

      {/* Proactive Insight Toast */}
      {!isSwiftOpen && <ProactiveInsightToast />}
    </div>
  );
}