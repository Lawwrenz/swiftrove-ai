import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  DollarSign, ShoppingCart, Clock, Bot, ArrowUpRight, ArrowDownRight,
  PlusCircle, UserPlus, FileBarChart, BarChart3, Eye, Mail,
  CheckCircle, Truck, Users, FileText, TrendingUp, Sparkles, Timer, AlertCircle, Loader2,
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/ui';
import { AnimatedCounter } from '../components/micro';
import { useAuth } from '../context/AuthContext';
import { useSwift } from '../context/SwiftContext';
import {
  DASHBOARD_STATS, CUSTOMERS, TIMELINE_EVENTS, QUICK_ACTIONS, AGENTS, AGENT_DETAILS,
} from '../lib/constants';
import CustomerQuickPreview from '../components/CustomerQuickPreview';
import AIMessageComposer from '../components/AIMessageComposer';

const iconMap: Record<string, LucideIcon> = {
  DollarSign, ShoppingCart, Clock, Bot, PlusCircle, UserPlus, FileBarChart, BarChart3,
  TrendingUp, CheckCircle, Truck, Users, FileText,
};

// ============================================================================
// Metric Card — compact hero metric with animated counter
// ============================================================================
function MetricCard({
  icon: Icon, value, label, suffix, color,
}: {
  icon: LucideIcon; value: number; label: string; suffix?: string; color: string;
}) {
  return (
    <div className="animate-count-up bg-white/10 backdrop-blur-sm rounded-xl p-3 ring-1 ring-white/20 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-colors duration-150">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} style={{ color }} />
        <span className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
    </div>
  );
}

// ============================================================================
// Stat Card — dashboard stat card with trend indicator
// ============================================================================
function StatCard({ stat, index }: { stat: typeof DASHBOARD_STATS[0]; index: number }) {
  const Icon = iconMap[stat.icon];
  return (
    <Card
      className={`animate-fade-in-up stagger-${index + 1}`}
      hover
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
          <div className={`inline-flex items-center gap-1 text-xs font-medium ${
            stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {stat.change}
          </div>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </Card>
  );
}

function TimelineIcon({ icon, color }: { icon: string; color: string }) {
  const Icon = iconMap[icon];
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-card"
      style={{ backgroundColor: `${color}15`, color }}
    >
      {Icon && <Icon size={16} />}
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { openSwift } = useSwift();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHighlighted, setTimelineHighlighted] = useState(false);
  const [swiftOpening, setSwiftOpening] = useState(false);
  const [previewCustomerId, setPreviewCustomerId] = useState<string | null>(null);
  const [composerCustomerId, setComposerCustomerId] = useState<string | null>(null);
  const [navigatingCustomerId, setNavigatingCustomerId] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll-to-timeline when navigated from another page
  useEffect(() => {
    if (location.state?.scrollToTimeline) {
      // Small delay to let the page render
      const t = setTimeout(() => {
        handleViewActivity();
        window.history.replaceState({}, document.title);
      }, 300);
      return () => clearTimeout(t);
    }
  }, []);

  const recentCustomers = CUSTOMERS.slice(0, 5);

  const handleQuickAction = (actionLabel: string) => {
    switch (actionLabel) {
      case 'New Order':
        navigate('/orders', { state: { openNewOrder: true } });
        break;
      case 'Add Customer':
        navigate('/customers', { state: { openAddCustomer: true } });
        break;
      case 'Run Report':
        navigate('/analytics', { state: { runReport: true } });
        break;
      case 'View Analytics':
        navigate('/analytics');
        break;
    }
  };

  const handleAskSwift = () => {
    setSwiftOpening(true);
    openSwift();
    // Reset loading state after a brief moment
    setTimeout(() => setSwiftOpening(false), 400);
  };

  const handleViewActivity = () => {
    const el = timelineRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimelineHighlighted(true);
      setTimeout(() => setTimelineHighlighted(false), 2500);
    }
  };

  const handleCustomerClick = (customerId: string) => {
    setNavigatingCustomerId(customerId);
    // Brief delay to show loading state, then navigate
    setTimeout(() => {
      setNavigatingCustomerId(null);
      navigate(`/customer-intelligence/${customerId}`);
    }, 200);
  };

  const handlePreviewClick = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    lastFocusedRef.current = e.currentTarget as HTMLButtonElement;
    setPreviewCustomerId(customerId);
  };

  const handleComposerClick = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    lastFocusedRef.current = e.currentTarget as HTMLButtonElement;
    setComposerCustomerId(customerId);
  };

  return (
    <div className="page-container">
      {/* ===== AI Operations Briefing — Hero Section ===== */}
      <div className="hero-gradient p-6 lg:p-8">
        <div className="hero-pattern" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="relative z-10">
          {/* Top row: Greeting + AI Status Panel */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Greeting, Summary, Metrics, Actions */}
            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <div className="flex items-center gap-3 mb-3">
                <div className="hero-icon">
                  <Bot size={18} className="text-white" />
                </div>
                <span className="hero-label">AI Operations Center</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {(() => {
                  const h = new Date().getHours();
                  const greeting = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
                  return `${greeting}, ${(profile?.full_name || 'there').split(' ')[0]} 👋`;
                })()}
              </h1>
              <p className="mt-1 text-indigo-200 text-sm lg:text-base">
                Here's what your AI workforce has accomplished today.
              </p>

              {/* AI Daily Briefing Summary */}
              <div className="mt-5 p-5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} className="text-indigo-300" />
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">AI Daily Briefing</span>
                </div>
                <p className="text-sm text-white font-semibold mb-3">
                  Your AI Workforce completed 18 operational tasks today.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5 text-sm text-indigo-100">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><span className="font-medium text-white">Sales Agent</span> generated 4 new customer orders.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-indigo-100">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><span className="font-medium text-white">Finance Agent</span> verified 3 payments.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-indigo-100">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><span className="font-medium text-white">Customer Success</span> resolved 7 customer requests.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-amber-200">
                    <AlertCircle size={14} className="text-amber-300 shrink-0 mt-0.5" />
                    <span className="font-medium">2 high-priority follow-ups</span>
                    <span className="text-amber-200/80"> are waiting for your approval.</span>
                  </li>
                </ul>
              </div>

              {/* Today's Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <MetricCard icon={CheckCircle} value={18} label="Tasks Completed" color="#22C55E" />
                <MetricCard icon={ShoppingCart} value={4} label="New Orders" color="#4F46E5" />
                <MetricCard icon={DollarSign} value={3} label="Payments Verified" color="#22C55E" />
                <MetricCard icon={Timer} value={6.5} label="Hours Saved" suffix="hrs" color="#8B5CF6" />
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Sparkles size={16} />}
                  className="!bg-white !text-indigo-700 !shadow-lg hover:!shadow-xl !rounded-xl !border-0"
                  aria-label="Ask Swift AI"
                  loading={swiftOpening}
                  onClick={handleAskSwift}
                >
                  Ask Swift AI
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  icon={<Eye size={16} />}
                  className="!bg-white/10 !text-white !backdrop-blur-sm !ring-1 !ring-white/30 hover:!bg-white/20 !border-0 !rounded-xl"
                  aria-label="View Activity"
                  onClick={handleViewActivity}
                >
                  View Activity
                </Button>
              </div>
            </div>

            {/* Right: AI Workforce Status Panel */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="relative">
                {/* Glow background */}
                <div className="absolute -inset-4 bg-indigo-400/20 rounded-2xl blur-xl animate-glow" />
                <div className="relative p-5 rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-1">
                      {AGENT_DETAILS.slice(0, 3).map((a) => {
                        const AgentIcon = iconMap[a.icon] || Bot;
                        const agentColor = a.gradient.includes('indigo') ? '#4F46E5' : a.gradient.includes('emerald') ? '#22C55E' : '#8B5CF6';
                        return (
                          <div
                            key={a.id}
                            className="w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-indigo-600"
                            style={{ backgroundColor: agentColor }}
                          >
                            <AgentIcon size={12} className="text-white" />
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">AI Workforce Status</span>
                  </div>

                  <div className="space-y-3">
                    {AGENT_DETAILS.map((agent) => {
                      const AgentIcon = iconMap[agent.icon] || Bot;
                      const agentColor = agent.gradient.includes('indigo') ? '#4F46E5' : agent.gradient.includes('emerald') ? '#22C55E' : '#8B5CF6';
                      return (
                        <div key={agent.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-150">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                            style={{ backgroundColor: agentColor }}
                          >
                            <AgentIcon size={17} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-white">{agent.name}</p>
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                            </div>
                            <p className="text-[11px] text-indigo-200 font-medium">{agent.statusLabel}</p>
                            <p className="text-[11px] text-indigo-300/80 truncate mt-0.5">{agent.currentTask}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15">
                    <div className="flex items-center justify-between text-xs text-indigo-200">
                      <span>Total tasks today</span>
                      <span className="font-semibold text-white">247</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Middle Section: Recent Customers + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customers */}
        <Card className="lg:col-span-2 animate-fade-in-up" padding="none">
          <Card header={
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Customers</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
                View All
              </Button>
            </div>
          }>
            <div className="divide-y divide-border">
              {recentCustomers.map((customer) => {
                const isNavigating = navigatingCustomerId === customer.id;
                return (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-surface transition-colors duration-150 group"
                  >
                    {/* Left: Avatar + Name/Email (clickable) */}
                    <button
                      onClick={() => handleCustomerClick(customer.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCustomerClick(customer.id); } }}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-1 -ml-1"
                      tabIndex={0}
                      aria-label={`View intelligence profile for ${customer.name}`}
                    >
                      <Avatar initials={customer.avatar} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150 truncate">
                            {isNavigating ? 'Opening...' : customer.name}
                          </p>
                          {isNavigating && (
                            <Loader2 size={12} className="text-primary animate-spin shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate">{customer.email}</p>
                      </div>
                    </button>

                    {/* Right: Status, Spend, Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={customer.status === 'active' ? 'success' : customer.status === 'lead' ? 'warning' : 'neutral'}
                        dot
                        size="sm"
                      >
                        {customer.status}
                      </Badge>
                      <span className="text-xs text-text-secondary hidden sm:inline">₦{customer.totalSpent.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handlePreviewClick(customer.id, e)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePreviewClick(customer.id, e as any); } }}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-indigo-50 dark:hover:bg-primary/20 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`Quick preview for ${customer.name}`}
                          tabIndex={0}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => handleComposerClick(customer.id, e)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleComposerClick(customer.id, e as any); } }}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-indigo-50 dark:hover:bg-primary/20 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`Send message to ${customer.name}`}
                          tabIndex={0}
                        >
                          <Mail size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Card>

        {/* Activity Timeline */}
        <div ref={timelineRef} id="activity-timeline">
          <Card
            className={`animate-fade-in-up transition-all duration-700 ${
              timelineHighlighted
                ? 'ring-2 ring-indigo-400/40 bg-indigo-50/30 dark:bg-indigo-500/10 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30'
                : ''
            }`}
            padding="none"
          >
          <Card header={
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Activity Timeline</h3>
              <Badge variant="info" size="sm" dot>Live</Badge>
            </div>
          }>
            <div className="px-6 py-4">
              <div className="relative space-y-0">
                {TIMELINE_EVENTS.map((event, idx) => (
                  <div key={event.id} className="flex gap-4 pb-5 relative last:pb-0">
                    {/* Vertical line */}
                    {idx < TIMELINE_EVENTS.length - 1 && (
                      <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
                    )}
                    {/* Icon */}
                    <TimelineIcon icon={event.icon} color={event.color} />
                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{event.description}</p>
                      <p className="text-[11px] text-muted mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Card>
      </div>
    </div>

      {/* Bottom Section: AI Insights + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <Card className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">AI Workforce Status</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai-workforce')}>
              View All Agents
            </Button>
          </div>
          <div className="space-y-4">
            {AGENTS.map((agent) => {
              const Icon = iconMap[agent.icon] || Bot;
              return (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-text-secondary truncate">{agent.currentTask}</p>
                  </div>
                  <Badge
                    variant={agent.status === 'online' ? 'success' : agent.status === 'busy' ? 'warning' : 'neutral'}
                    dot
                    size="sm"
                  >
                    {agent.status}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Total tasks completed today</span>
              <span className="font-semibold text-foreground">247</span>
            </div>
            <div className="mt-2 h-2 bg-slate-100 dark:bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = iconMap[action.icon];
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleQuickAction(action.label); } }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-surface hover:bg-card hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 cursor-pointer group text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  tabIndex={0}
                  aria-label={`${action.label}: ${action.description}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}15`, color: action.color }}
                  >
                    {Icon && <Icon size={22} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-tight">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Customer Quick Preview Drawer */}
      <CustomerQuickPreview
        customerId={previewCustomerId || ''}
        open={!!previewCustomerId}
        onClose={() => {
          setPreviewCustomerId(null);
          setTimeout(() => lastFocusedRef.current?.focus(), 0);
        }}
        onSendMessage={(id) => {
          setPreviewCustomerId(null);
          setComposerCustomerId(id);
        }}
        onCreateOrder={(id) => {
          setPreviewCustomerId(null);
          navigate('/orders', { state: { openNewOrder: true, preselectedCustomer: id } });
        }}
      />

      {/* AI Message Composer */}
      <AIMessageComposer
        customerId={composerCustomerId || ''}
        open={!!composerCustomerId}
        onClose={() => {
          setComposerCustomerId(null);
          setTimeout(() => lastFocusedRef.current?.focus(), 0);
        }}
      />
    </div>
  );
}