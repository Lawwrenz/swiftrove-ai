import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  TrendingUp, DollarSign, Handshake, Sparkles, Bot, Activity,
  CheckCircle, Clock, Eye, ArrowRightLeft, MessageSquare, Users,
  Zap, BarChart3, Cpu, Target, Timer, ChevronRight, Send,
  X, AlertCircle, Info,
} from 'lucide-react';
import { Card } from '../components/ui';
import {
  AI_WORKFORCE_STATS, AGENT_DETAILS, ACTIVITY_FEED_EVENTS, PERFORMANCE_DATA,
  type AgentDetail, type ChartDataPoint,
} from '../lib/constants';

// ============================================================================
// Icon Map
// ============================================================================
const iconMap: Record<string, LucideIcon> = {
  TrendingUp, DollarSign, Handshake, CheckCircle, MessageSquare,
  Clock, Eye, ArrowRightLeft, Users, Sparkles, Bot, Activity,
  Zap, BarChart3, Cpu, Target, Timer,
};

// ============================================================================
// Stat Card Colors
// ============================================================================
const statCards = [
  { label: 'Agents Online', value: `${AI_WORKFORCE_STATS.agentsOnline}`, icon: Bot, color: '#4F46E5', bg: 'bg-indigo-50' },
  { label: 'Active Tasks', value: `${AI_WORKFORCE_STATS.activeTasks}`, icon: Cpu, color: '#F59E0B', bg: 'bg-amber-50' },
  { label: 'Tasks Completed Today', value: `${AI_WORKFORCE_STATS.tasksCompletedToday}`, icon: Zap, color: '#22C55E', bg: 'bg-emerald-50' },
  { label: 'Average Success Rate', value: `${AI_WORKFORCE_STATS.averageSuccessRate}%`, icon: Target, color: '#8B5CF6', bg: 'bg-violet-50' },
];

// ============================================================================
// Sub-components
// ============================================================================

function SummaryCard({
  label, value, icon: Icon, color, bg, index,
}: {
  label: string; value: string; icon: LucideIcon; color: string; bg: string; index: number;
}) {
  return (
    <div
      className={`animate-fade-in-up stagger-${index + 1}`}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group cursor-default">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
            <Icon size={20} style={{ color }} />
          </div>
          <span className="text-xs font-medium text-text-secondary">{label}</span>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function AnimatedProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-surface-hover rounded-full overflow-hidden ring-1 ring-inset ring-border/50">
      <div
        className="h-full rounded-full animate-progress-pulse transition-all duration-700 ease-out"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

function AgentActionButtons({ agent, agentColor }: { agent: AgentDetail; agentColor: string }) {
  const PrimaryIcon = iconMap[agent.primaryActionIcon];
  const SecondaryIcon = iconMap[agent.secondaryActionIcon];
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border">
      <button
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-150 active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        style={{ backgroundColor: agentColor }}
        aria-label={agent.primaryAction}
      >
        {PrimaryIcon && <span className="shrink-0"><PrimaryIcon size={15} /></span>}
        {agent.primaryAction}
      </button>
      <button
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-card text-text-secondary border border-border hover:bg-surface-hover active:bg-surface transition-all duration-150 active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label={agent.secondaryAction}
      >
        {SecondaryIcon && <span className="shrink-0"><SecondaryIcon size={15} /></span>}
        {agent.secondaryAction}
      </button>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: AgentDetail; index: number }) {
  const Icon = iconMap[agent.icon] || Bot;
  const gradientFrom = agent.gradient.split(' ')[0].replace('from-', '');
  const agentColor = gradientFrom === 'indigo-500' ? '#4F46E5' : gradientFrom === 'emerald-500' ? '#22C55E' : '#8B5CF6';

  return (
    <div className={`animate-fade-in-up stagger-${index + 2}`}>
      <div className="bg-card rounded-xl shadow-sm ring-1 ring-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
        <div className={`h-1.5 bg-gradient-to-r ${agent.gradient}`} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${agentColor}, ${agentColor}dd)` }}
              >
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                <p className="text-xs text-text-secondary">{agent.tagline}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              {agent.statusLabel}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-4 leading-relaxed">{agent.role}</p>

          <div className="p-4 rounded-xl bg-surface ring-1 ring-inset ring-border/50 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Current Task</span>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {agent.currentTask} <span className="text-text-secondary font-normal">{agent.taskTarget}</span>
            </p>
            <AnimatedProgressBar value={agent.progress} color={agentColor} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-medium text-text-secondary">{agent.progress}% complete</span>
              <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <Timer size={11} /> ~{agent.estimatedCompletion}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Recent Activity</p>
            <div className="space-y-1.5">
              {agent.recentActivity.map((activity, i) => {
                const ActIcon = iconMap[activity.icon] || CheckCircle;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <ActIcon size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-foreground">{activity.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Capabilities</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${agentColor}12`,
                    color: agentColor,
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-surface/50 ring-1 ring-inset ring-border/50 mb-4">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold" style={{ color: agentColor }}>{agent.confidenceScore}%</p>
              <p className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Confidence</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-foreground">{agent.estimatedCompletion}</p>
              <p className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Est. Completion</p>
            </div>
          </div>

          <AgentActionButtons agent={agent} agentColor={agentColor} />
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const statusIcons: Record<string, LucideIcon> = {
    success: CheckCircle,
    pending: AlertCircle,
    info: Info,
  };
  const statusColors: Record<string, string> = {
    success: 'text-emerald-500',
    pending: 'text-amber-500',
    info: 'text-primary',
  };

  return (
    <div className="animate-fade-in-up stagger-2">
      <Card className="h-full" padding="none">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Live Activity Feed</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Live
          </span>
        </div>
        <div className="p-4 space-y-1 max-h-[520px] overflow-y-auto">
          {ACTIVITY_FEED_EVENTS.map((event) => {
            const StatusIcon = statusIcons[event.status] || Info;
            const AgentIcon = iconMap[event.agentIcon] || Bot;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors duration-150 cursor-default"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${event.agentGradient.split(' ')[0].replace('from-', '')}, ${event.agentGradient.split(' ')[1].replace('to-', '')})` }}
                >
                  <AgentIcon size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-medium">{event.agentName}</span>
                    {' '}{event.action}{' '}
                    <span className="font-medium text-primary">{event.target}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <StatusIcon size={14} className={statusColors[event.status]} />
                  <span className="text-[10px] font-medium text-text-secondary">{event.timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-border bg-surface/50 rounded-b-xl">
          <button
            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg py-1"
            aria-label="View all activity"
          >
            View All Activity
            <ChevronRight size={12} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// SVG Chart Components
// ============================================================================

function BarChart({ data, title, unit }: { data: ChartDataPoint[]; title: string; unit?: string }) {
  const max = Math.max(...data.map(d => d.value));
  const barWidth = Math.max(20, Math.min(36, 100 / data.length - 8));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {unit && <span className="text-[10px] font-medium text-text-secondary">{unit}</span>}
      </div>
      <div className="flex-1 flex items-end justify-center gap-2.5">
        {data.map((point) => (
          <div key={point.label} className="flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] font-semibold" style={{ color: point.color }}>
              {point.value}{unit === '%' ? '%' : ''}
            </span>
            <div
              className="rounded-md transition-all duration-500 ease-out hover:opacity-80"
              style={{
                height: `${(point.value / max) * 100}%`,
                width: barWidth,
                backgroundColor: point.color,
                minHeight: 4,
              }}
            />
            <span className="text-[10px] font-medium text-text-secondary">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarChart({ data, title, unit }: { data: ChartDataPoint[]; title: string; unit?: string }) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {unit && <span className="text-[10px] font-medium text-text-secondary">{unit}</span>}
      </div>
      <div className="flex-1 space-y-3">
        {data.map((point) => (
          <div key={point.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{point.label}</span>
              <span className="text-xs font-semibold" style={{ color: point.color }}>
                {point.value}{unit === '%' ? '%' : unit === 's' ? 's' : ''}
              </span>
            </div>
            <div className="h-2.5 bg-surface-hover rounded-full ring-1 ring-inset ring-border/50 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(point.value / max) * 100}%`,
                  backgroundColor: point.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircularGauge({ value, color, label }: { value: number; color: string; label: string }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative mb-2">
        <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`${label}: ${value}%`}>
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
          />
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 55 55)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
    </div>
  );
}

function PerformanceDashboard() {
  const avgSuccessRate = PERFORMANCE_DATA.successRate.reduce((a, b) => a + b.value, 0) / PERFORMANCE_DATA.successRate.length;

  return (
    <div className="animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={18} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Performance Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-h-[200px]">
          <BarChart data={PERFORMANCE_DATA.tasksCompleted} title="Tasks Completed" unit="This Week" />
        </Card>
        <Card className="min-h-[200px]">
          <HorizontalBarChart data={PERFORMANCE_DATA.agentUtilization} title="Agent Utilization" unit="%" />
        </Card>
        <Card className="min-h-[200px]">
          <CircularGauge value={avgSuccessRate} color="#4F46E5" label="Overall Success Rate" />
        </Card>
        <Card className="min-h-[200px]">
          <HorizontalBarChart data={PERFORMANCE_DATA.responseTime} title="Response Time" unit="s" />
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Floating AI Assistant
// ============================================================================

function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97] cursor-pointer animate-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Sparkles size={18} />
        <span className="text-sm font-semibold">Swift AI</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-title"
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-border animate-slide-up-fade-in overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 id="assistant-title" className="text-sm font-semibold text-white">Swift AI</h3>
                  <p className="text-[10px] text-white/80">AI Operations Assistant</p>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); buttonRef.current?.focus(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-50/50 ring-1 ring-indigo-100/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Hi Lawrence 👋<br />I'm Swift AI.</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      I can help you create orders, analyse customers, verify payments and answer operational questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface ring-1 ring-inset ring-border/50 focus-within:ring-primary/30 focus-within:bg-card transition-all duration-150">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask Swift AI anything..."
                  className="flex-1 px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                  aria-label="Ask Swift AI anything"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary text-white hover:brightness-110 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-[10px] text-muted mt-2 text-center">
                Responses are AI-generated. Verify important information.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function AIWorkforce() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="space-y-6 pb-6">
      <div className="animate-fade-in-up">
        <div className="hero-gradient p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10">
            <div className="hero-icon inline-flex mb-3">
              <Bot size={18} className="text-white" />
            </div>
            <span className="hero-label block mb-3">AI Operations Center</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">AI Workforce</h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
              Meet your AI team. These intelligent agents collaborate to automate business operations, assist customers, process payments and keep your business running efficiently.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <SummaryCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {AGENT_DETAILS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <PerformanceDashboard />
      <FloatingAssistant />
    </div>
  );
}