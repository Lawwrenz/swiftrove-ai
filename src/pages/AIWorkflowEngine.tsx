// ============================================================================
// Swift AI Orchestrator — AI Workflow Engine
// Mission Control for coordinating multiple AI agents in real time
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles, Cpu, CheckCircle, Circle, Timer, Zap, TrendingUp,
  DollarSign, Handshake, Clock, ChevronRight, Activity,
  Target, Bot, Play, MessageSquare,
} from 'lucide-react';
import { WorkflowLine, SuccessAnimation } from '../components/micro';
import { generateWorkflow, sanitizeInput } from '../lib/ai-service';

// ============================================================================
// Types
// ============================================================================

interface WorkflowStage {
  id: string;
  label: string;
  icon: LucideIcon;
  agent: string;
  color: string;
  completed: boolean;
  active: boolean;
}

interface AgentExecution {
  id: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
  color: string;
  currentTask: string;
  progress: number;
  estimated: string;
  nextTask: string;
  status: 'working' | 'waiting' | 'idle';
}

interface LogEvent {
  id: number;
  time: string;
  message: string;
  icon: LucideIcon;
  color: string;
}

interface MetricCard {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 'inquiry', label: 'Customer Inquiry', icon: MessageSquare, agent: 'Customer', color: '#94A3B8', completed: true, active: false },
  { id: 'sales', label: 'Sales Agent', icon: TrendingUp, agent: 'Sales Agent', color: '#4F46E5', completed: false, active: true },
  { id: 'approval', label: 'Business Approval', icon: CheckCircle, agent: 'Owner', color: '#F59E0B', completed: false, active: false },
  { id: 'finance', label: 'Finance Agent', icon: DollarSign, agent: 'Finance Agent', color: '#22C55E', completed: false, active: false },
  { id: 'success', label: 'Customer Success', icon: Handshake, agent: 'Customer Success', color: '#8B5CF6', completed: false, active: false },
  { id: 'completed', label: 'Completed', icon: Sparkles, agent: 'System', color: '#22C55E', completed: false, active: false },
];

const AGENT_EXECUTIONS: AgentExecution[] = [
  {
    id: 'sales',
    name: 'Sales Agent',
    icon: TrendingUp,
    gradient: 'from-indigo-500 to-indigo-600',
    color: '#4F46E5',
    currentTask: 'Creating quotation for Grace Eze',
    progress: 87,
    estimated: '12 seconds',
    nextTask: 'Submit for approval',
    status: 'working',
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-emerald-600',
    color: '#22C55E',
    currentTask: 'Waiting for payment',
    progress: 0,
    estimated: '—',
    nextTask: 'Verify payment',
    status: 'waiting',
  },
  {
    id: 'success',
    name: 'Customer Success',
    icon: Handshake,
    gradient: 'from-violet-500 to-violet-600',
    color: '#8B5CF6',
    currentTask: 'Waiting',
    progress: 0,
    estimated: '—',
    nextTask: 'Preparing confirmation message',
    status: 'idle',
  },
];

const ORCHESTRATOR_LOG_EVENTS: LogEvent[] = [
  { id: 1, time: '20:04', message: 'Customer inquiry received.', icon: MessageSquare, color: '#4F46E5' },
  { id: 2, time: '20:05', message: 'Sales Agent selected.', icon: TrendingUp, color: '#4F46E5' },
  { id: 3, time: '20:06', message: 'Quotation generated.', icon: CheckCircle, color: '#22C55E' },
  { id: 4, time: '20:07', message: 'Waiting for owner approval.', icon: Clock, color: '#F59E0B' },
  { id: 5, time: '20:08', message: 'Finance Agent activated.', icon: DollarSign, color: '#22C55E' },
  { id: 6, time: '20:09', message: 'Payment verified.', icon: CheckCircle, color: '#22C55E' },
  { id: 7, time: '20:10', message: 'Customer Success activated.', icon: Handshake, color: '#8B5CF6' },
  { id: 8, time: '20:11', message: 'Workflow completed.', icon: Sparkles, color: '#8B5CF6' },
];

const METRICS_DATA: MetricCard[] = [
  { label: 'Avg Completion Time', value: '24s', change: '-12%', icon: Timer, color: '#4F46E5', bg: 'bg-indigo-50' },
  { label: 'Tasks Automated', value: '1,847', change: '+18%', icon: Cpu, color: '#22C55E', bg: 'bg-emerald-50' },
  { label: 'Hours Saved', value: '142h', change: '+24%', icon: Zap, color: '#F59E0B', bg: 'bg-amber-50' },
  { label: 'AI Confidence', value: '98%', change: '+2%', icon: Target, color: '#8B5CF6', bg: 'bg-violet-50' },
  { label: 'Active Workflows', value: '18', change: '+5', icon: Activity, color: '#EC4899', bg: 'bg-pink-50' },
];

// ============================================================================
// AI Decision Panel
// ============================================================================

function AIDecisionPanel() {
  const [decisionData, setDecisionData] = useState<{
    agents: { name: string; icon: LucideIcon; color: string; reason: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const result = await generateWorkflow('analysis', 'Order processing workflow for Grace Eze - Custom Celebration Cake');
        if (result.response && !result.error) {
          try {
            const parsed = JSON.parse(result.response);
            if (parsed.agents) {
              const agentIcons: Record<string, LucideIcon> = {
                'Sales Agent': TrendingUp,
                'Finance Agent': DollarSign,
                'Customer Success Agent': Handshake,
                'Customer Success': Handshake,
              };
              const agentColors: Record<string, string> = {
                'Sales Agent': '#4F46E5',
                'Finance Agent': '#22C55E',
                'Customer Success Agent': '#8B5CF6',
                'Customer Success': '#8B5CF6',
              };
              setDecisionData({
                agents: parsed.agents.map((a: any) => ({
                  name: a.name,
                  icon: agentIcons[a.name] || Bot,
                  color: agentColors[a.name] || '#4F46E5',
                  reason: a.reason || a.task || 'Selected for this workflow stage',
                })),
              });
            }
          } catch {}
        }
      } catch {}
      setLoading(false);
    };
    fetchDecision();
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-5 h-full">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Why Swift AI chose this workflow</h3>
          <p className="text-[10px] text-text-secondary">AI Decision Reasoning</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-surface animate-pulse">
              <div className="h-4 bg-surface-hover rounded w-24 mb-2" />
              <div className="h-3 bg-surface-hover rounded w-full" />
            </div>
          ))}
        </div>
      ) : decisionData ? (
        <div className="space-y-4">
          {decisionData.agents.map((agent, i) => {
            const AgentIcon = agent.icon;
            const agentColors = ['#4F46E5', '#F59E0B', '#22C55E', '#8B5CF6'];
            const bgColors = ['from-indigo-50/80', 'from-amber-50/80', 'from-emerald-50/80', 'from-violet-50/80'];
            return (
              <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${bgColors[i]} to-white border border-indigo-100 shadow-sm`}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${agentColors[i]}15` }}>
                    <AgentIcon size={13} style={{ color: agentColors[i] }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: agentColors[i] }}>{agent.name}</p>
                    <p className="text-sm text-text-secondary leading-relaxed mt-0.5">{agent.reason}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp size={13} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-700 mb-0.5">Sales Agent</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  The customer requested a custom celebration cake. Sales Agent generates quotations based on pricing and preferences.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={13} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-0.5">Business Approval</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Owner approval is required for high-value orders. Swift AI routes the quotation for review.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign size={13} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700 mb-0.5">Finance Agent</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Finance Agent verifies payment before fulfilment for secure transactions.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-white border border-violet-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                <Handshake size={13} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-700 mb-0.5">Customer Success</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Customer Success prepares delivery confirmation after payment for a seamless experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function StatusBadge({ label, color, pulse }: { label: string; color: string; pulse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white ring-1 ring-inset ring-white/20">
      <span className={`inline-block w-2 h-2 rounded-full ${pulse ? 'animate-pulse-dot' : ''}`} style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// --- Workflow Canvas ---
function WorkflowCanvas() {
  const [stages, setStages] = useState<WorkflowStage[]>(WORKFLOW_STAGES);
  const activeIndex = stages.findIndex((s) => s.active);

  useEffect(() => {
    // Simulate workflow progression
    const interval = setInterval(() => {
      setStages((prev) => {
        const current = prev.findIndex((s) => s.active);
        if (current === -1 || current >= prev.length - 1) return prev;
        return prev.map((s, i) => ({
          ...s,
          completed: i < current + 1 ? true : s.completed,
          active: i === current + 1,
        }));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Activity size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Active Workflow</h3>
          <p className="text-[10px] text-text-secondary">Customer Inquiry → Completed</p>
        </div>
      </div>

      {/* Horizontal workflow stages — auto-sized nodes, no clipping */}
      <div className="relative flex items-start justify-center gap-6 px-4 overflow-x-auto">
        {/* Animated workflow connector line */}
        <div className="absolute top-5 left-8 right-8 z-0">
          <WorkflowLine
            completed={stages.filter(s => s.completed).length}
            total={stages.length}
            height={3}
            color="#22C55E"
          />
        </div>

        {stages.map((stage) => {
          const isActive = stage.active;
          const isCompleted = stage.completed;

          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 relative z-10 shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 cursor-default ${
                  isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-300 dark:ring-emerald-700 ring-offset-2 dark:ring-offset-card'
                    : isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-400 dark:ring-indigo-600 ring-offset-2 dark:ring-offset-card animate-pulse-glow'
                      : 'bg-surface text-muted ring-2 ring-border ring-offset-2 dark:ring-offset-card'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={18} />
                ) : isActive ? (
                  <Play size={14} className="ml-0.5" />
                ) : (
                  <Circle size={14} />
                )}
              </div>
              <div className="text-center min-w-0">
                <p className={`text-[11px] font-semibold leading-tight whitespace-nowrap transition-colors duration-300 ${
                  isCompleted ? 'text-emerald-700 dark:text-emerald-400' : isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-muted'
                }`}>
                  {stage.label}
                </p>
                <p className="text-[9px] text-text-secondary mt-0.5 whitespace-nowrap">{stage.agent}</p>
              </div>
              {isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700 animate-scale-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Live Agent Execution Card ---
function AgentExecutionCard({ agent }: { agent: AgentExecution }) {
  const [progress, setProgress] = useState(agent.progress);
  const AgentIcon = agent.icon;

  useEffect(() => {
    if (agent.status !== 'working' || progress >= 100) return;
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 300);
    return () => clearInterval(interval);
  }, [agent.status, progress]);

  const isActive = agent.status === 'working';
  const isWaiting = agent.status === 'waiting';

  return (
    <div className={`bg-card rounded-xl shadow-sm ring-1 ring-border p-5 transition-all duration-300 ${
      isActive ? 'ring-2 ring-indigo-200 dark:ring-indigo-700 shadow-md' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shadow-sm`}>
          <AgentIcon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
            {isActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                Working
              </span>
            )}
            {isWaiting && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200 dark:ring-amber-700">
                <Clock size={10} />
                Waiting
              </span>
            )}
            {agent.status === 'idle' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-surface text-muted ring-1 ring-inset ring-border">
                Idle
              </span>
            )}
          </div>
          <p className="text-[10px] text-text-secondary">{agent.nextTask}</p>
        </div>
      </div>

      {/* Current Task */}
      <div className="p-3.5 rounded-xl bg-surface ring-1 ring-inset ring-border/50 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Cpu size={12} className="text-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Current Task</span>
        </div>
        <p className="text-sm font-medium text-foreground">{agent.currentTask}</p>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="space-y-2">
          <div className="h-2.5 bg-surface-hover rounded-full ring-1 ring-inset ring-border/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out animate-progress-pulse"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${agent.color}, ${agent.color}dd)`,
                boxShadow: `0 0 8px ${agent.color}66`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium" style={{ color: agent.color }}>{progress}%</span>
            <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
              <Timer size={11} /> ~{agent.estimated}
            </span>
          </div>
        </div>
      )}

      {/* Waiting state */}
      {isWaiting && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 ring-1 ring-inset ring-amber-200/50 dark:ring-amber-700/30">
          <Clock size={14} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">Awaiting input from previous stage</p>
        </div>
      )}

      {/* Idle state */}
      {agent.status === 'idle' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface ring-1 ring-inset ring-border/50">
          <Circle size={14} className="text-muted shrink-0" />
          <p className="text-xs text-text-secondary">Ready to execute on next workflow</p>
        </div>
      )}
    </div>
  );
}

// --- Orchestrator Log ---
function OrchestratorLog() {
  const [visibleEvents, setVisibleEvents] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stream events one by one
    const timers: ReturnType<typeof setTimeout>[] = [];
    ORCHESTRATOR_LOG_EVENTS.forEach((_, i) => {
      const timer = setTimeout(() => {
        setVisibleEvents((prev) => Math.max(prev, i + 1));
      }, 600 + i * 800);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleEvents]);

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-sm">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Orchestrator Log</h3>
            <p className="text-[10px] text-text-secondary">Live execution timeline</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-700/30">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          {visibleEvents < ORCHESTRATOR_LOG_EVENTS.length ? 'Streaming' : 'Complete'}
        </span>
      </div>

      <div className="space-y-1 max-h-[280px] overflow-y-auto">
        {ORCHESTRATOR_LOG_EVENTS.slice(0, visibleEvents).map((event) => {
          const EventIcon = event.icon;
          return (
            <div
              key={event.id}
              className="animate-fade-in-stream flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors duration-150 cursor-default"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${event.color}15` }}
              >
                <EventIcon size={13} style={{ color: event.color }} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-[11px] font-mono font-medium text-muted shrink-0 w-10">{event.time}</span>
                <p className="text-sm text-foreground">{event.message}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot shrink-0 mt-1.5" />
            </div>
          );
        })}
        {visibleEvents < ORCHESTRATOR_LOG_EVENTS.length && (
          <div className="flex items-center gap-2 text-xs text-muted pl-3 py-2 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span>New events arriving...</span>
          </div>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

// --- Workflow Metrics ---
function WorkflowMetrics() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {METRICS_DATA.map((metric, i) => {
        const MetricIcon = metric.icon;
        return (
          <div
            key={metric.label}
            className={`animate-fade-in-up stagger-${i + 1} bg-card rounded-xl shadow-sm ring-1 ring-border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group cursor-default`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${metric.bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                <MetricIcon size={18} style={{ color: metric.color }} />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{metric.value}</p>
            <p className="text-[11px] font-medium text-text-secondary mt-0.5">{metric.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// --- Start New Workflow ---
function StartNewWorkflow() {
  const [input, setInput] = useState('');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;
    setGenerating(true);

    try {
      const result = await generateWorkflow(input.trim(), '', { signal: AbortSignal.timeout(10000) });
      if (result.error) {
        console.error('Workflow generation error:', result.error);
      }
    } catch (err) {
      console.error('Workflow generation error:', err);
    }

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 800);
  }, [input]);

  const handleReset = useCallback(() => {
    setGenerated(false);
    setInput('');
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Start New Workflow</h3>
            <p className="text-[11px] text-indigo-200">Describe a customer request to generate an AI workflow</p>
          </div>
        </div>

        {!generated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-inset ring-white/20 focus-within:ring-white/40 transition-all duration-150">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                placeholder="Customer wants a birthday cake for Saturday."
                className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white placeholder:text-indigo-200/60 outline-none"
                aria-label="Describe a customer request"
              />
              <button
                onClick={handleGenerate}
                disabled={!input.trim() || generating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold
                  hover:shadow-md hover:brightness-110 active:scale-[0.97] transition-all duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Generate workflow"
              >
                {generating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generate Workflow
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-indigo-200/60">
              Swift AI will analyse the request and create an automated workflow across all available agents.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <SuccessAnimation size={56} />
            </div>
            <p className="text-base font-semibold text-white mb-1">Workflow Generated!</p>
            <p className="text-sm text-indigo-200 mb-4">
              Swift AI has created a 4-step workflow for your customer request.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white/15 text-white text-sm font-medium backdrop-blur-sm
                  hover:bg-white/25 active:scale-[0.97] transition-all duration-150 cursor-pointer ring-1 ring-inset ring-white/20
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Create Another
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold
                  hover:shadow-md hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                View Workflow
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function AIWorkflowEngine() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="space-y-6 pb-6">
      {/* ===== Header ===== */}
      <div className="animate-fade-in-up">
        <div className="hero-gradient p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/[0.03] rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="hero-icon">
                <Cpu size={18} className="text-white" />
              </div>
              <span className="hero-label">Swift AI Orchestrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Swift AI Orchestrator</h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed mb-5">
              Coordinate intelligent AI agents to automate your business operations.
            </p>

            {/* Status bar */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label="Online" color="#22C55E" pulse />
              <StatusBadge label="3 Active Agents" color="#4F46E5" />
              <StatusBadge label="18 Running Tasks" color="#F59E0B" />
              <StatusBadge label="97% Success Rate" color="#22C55E" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content: Workflow Canvas + Agent Execution ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Workflow Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in-up stagger-1">
            <WorkflowCanvas />
          </div>

          {/* Orchestrator Log */}
          <div className="animate-fade-in-up stagger-2">
            <OrchestratorLog />
          </div>
        </div>

        {/* Right: Agent Execution Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Live Agent Execution</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                Live
              </span>
            </div>
          </div>
          {AGENT_EXECUTIONS.map((agent, i) => (
            <div key={agent.id} className={`animate-fade-in-up stagger-${i + 3}`}>
              <AgentExecutionCard agent={agent} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== AI Decision Panel ===== */}
      <div className="animate-fade-in-up stagger-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIDecisionPanel />
          <div className="space-y-6">
            {/* Workflow Metrics */}
            <WorkflowMetrics />
            {/* Start New Workflow */}
            <div className="animate-fade-in-up stagger-5">
              <StartNewWorkflow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}