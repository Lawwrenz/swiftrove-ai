import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Workflow, Sparkles, Send, Zap, CheckCircle, Clock,
  TrendingUp, DollarSign, ShoppingCart, Bell,
  Settings, Play, FileText, MessageSquare, ChevronRight,
  BarChart3, Activity, Target, Eye,
  CreditCard, Handshake, Star,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { SuccessAnimation } from '../components/micro';
import { generateWorkflowDescription, sanitizeInput } from '../lib/ai-service';

// ============================================================================
// Types
// ============================================================================

interface WorkflowTemplate {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  steps: number;
  popularity: number;
}

interface RunningWorkflow {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'failed' | 'completed';
  executions: number;
  successRate: number;
  avgCompletionTime: string;
  lastRun: string;
  startedBy: string;
}

interface AIOptimization {
  id: string;
  title: string;
  explanation: string;
  impact: string;
  icon: LucideIcon;
  color: string;
  savings: string;
}

interface ExecutionEvent {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  agentName: string;
  action: string;
  target: string;
  timeAgo: string;
  status: 'success' | 'pending' | 'info';
}

// ============================================================================
// Mock Data
// ============================================================================

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'T1', label: 'New Customer Order', description: 'Automate order intake, quotation, payment, and fulfilment',
    icon: ShoppingCart, color: '#4F46E5', bgGradient: 'from-indigo-500/20 to-indigo-600/10', steps: 5, popularity: 92,
  },
  {
    id: 'T2', label: 'Payment Verification', description: 'Verify payments, flag anomalies, and confirm orders',
    icon: CreditCard, color: '#22C55E', bgGradient: 'from-emerald-500/20 to-emerald-600/10', steps: 4, popularity: 88,
  },
  {
    id: 'T3', label: 'Birthday Cake Order', description: 'Handle birthday cake inquiries, customisation, and delivery',
    icon: Star, color: '#F59E0B', bgGradient: 'from-amber-500/20 to-amber-600/10', steps: 6, popularity: 85,
  },
  {
    id: 'T4', label: 'Customer Follow-up', description: 'Automate post-purchase follow-ups and satisfaction surveys',
    icon: MessageSquare, color: '#8B5CF6', bgGradient: 'from-violet-500/20 to-violet-600/10', steps: 3, popularity: 79,
  },
  {
    id: 'T5', label: 'Weekly Executive Report', description: 'Compile revenue, orders, and AI workforce metrics',
    icon: BarChart3, color: '#3B82F6', bgGradient: 'from-blue-500/20 to-blue-600/10', steps: 4, popularity: 74,
  },
  {
    id: 'T6', label: 'Loyalty Campaign', description: 'Identify VIP customers and trigger personalised offers',
    icon: Target, color: '#EC4899', bgGradient: 'from-pink-500/20 to-pink-600/10', steps: 5, popularity: 71,
  },
];

const RUNNING_WORKFLOWS: RunningWorkflow[] = [
  { id: 'W1', name: 'Grace Eze — Celebration Cake', status: 'running', executions: 247, successRate: 98, avgCompletionTime: '12s', lastRun: '2m ago', startedBy: 'Automation' },
  { id: 'W2', name: 'Amaka Bello — Corporate Package', status: 'running', executions: 189, successRate: 97, avgCompletionTime: '8s', lastRun: '5m ago', startedBy: 'Automation' },
  { id: 'W3', name: 'Thabo Mokoena — Payment Issue', status: 'paused', executions: 42, successRate: 65, avgCompletionTime: '—', lastRun: '1h ago', startedBy: 'Lawrence' },
  { id: 'W4', name: 'Daily Customer Follow-up', status: 'running', executions: 1_042, successRate: 99, avgCompletionTime: '4s', lastRun: '1m ago', startedBy: 'Automation' },
];

const AI_OPTIMIZATIONS: AIOptimization[] = [
  { id: 'O1', title: 'Reduce Confirmation Delay', explanation: 'Customer Success confirmation is taking 22s on average. Parallel processing could reduce this to 5s.', impact: 'Expected 77% faster confirmations', icon: Zap, color: '#F59E0B', savings: '~17s per order' },
  { id: 'O2', title: 'Improve Payment Reminders', explanation: 'Only 1 reminder is sent for pending payments. Adding a second reminder at 24h could improve recovery by 34%.', impact: 'Potential ₦450K recovered', icon: Bell, color: '#EF4444', savings: '+34% recovery rate' },
  { id: 'O3', title: 'Increase Follow-up Timing', explanation: 'Follow-ups are sent 48h after delivery. Data shows 24h follow-ups have a 42% higher response rate.', impact: '42% higher customer engagement', icon: TrendingUp, color: '#22C55E', savings: '+42% response rate' },
];

const EXECUTION_EVENTS: ExecutionEvent[] = [
  { id: 'E1', icon: ShoppingCart, iconColor: '#4F46E5', agentName: 'Sales Agent', action: 'completed', target: 'quotation for Grace Eze', timeAgo: '2m ago', status: 'success' },
  { id: 'E2', icon: DollarSign, iconColor: '#22C55E', agentName: 'Finance Agent', action: 'verified', target: 'payment from Grace Eze', timeAgo: '5m ago', status: 'success' },
  { id: 'E3', icon: MessageSquare, iconColor: '#8B5CF6', agentName: 'Customer Success', action: 'sent', target: 'confirmation to Grace Eze', timeAgo: '11m ago', status: 'info' },
  { id: 'E4', icon: ShoppingCart, iconColor: '#4F46E5', agentName: 'Sales Agent', action: 'recommended', target: 'Corporate Package to Amaka Bello', timeAgo: '18m ago', status: 'info' },
  { id: 'E5', icon: FileText, iconColor: '#22C55E', agentName: 'Finance Agent', action: 'generated', target: 'invoice for Adaobi Nwosu', timeAgo: '23m ago', status: 'success' },
  { id: 'E6', icon: Handshake, iconColor: '#8B5CF6', agentName: 'Customer Success', action: 'sent', target: 'delivery update to Brian Otieno', timeAgo: '28m ago', status: 'success' },
  { id: 'E7', icon: Bell, iconColor: '#EF4444', agentName: 'Finance Agent', action: 'flagged', target: 'payment issue with Thabo Mokoena', timeAgo: '55m ago', status: 'pending' },
];

// Workflow nodes for the SVG flow diagram
const WORKFLOW_NODES = [
  { id: 'node1', label: 'Customer Request', color: '#4F46E5', y: 0 },
  { id: 'node2', label: 'Sales Agent', color: '#4F46E5', y: 80 },
  { id: 'node3', label: 'Approval', color: '#F59E0B', y: 160 },
  { id: 'node4', label: 'Finance Agent', color: '#22C55E', y: 240 },
  { id: 'node5', label: 'Customer Success', color: '#8B5CF6', y: 320 },
  { id: 'node6', label: 'Notification', color: '#3B82F6', y: 400 },
  { id: 'node7', label: 'Completed', color: '#22C55E', y: 480 },
];

// ============================================================================
// Sub-components
// ============================================================================

function WorkflowDiagram() {
  return (
    <div className="relative w-full max-w-[320px] mx-auto py-4">
      <svg viewBox="0 0 100 520" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {WORKFLOW_NODES.slice(0, -1).map((node, idx) => {
          const next = WORKFLOW_NODES[idx + 1];
          const midY = (node.y + next.y) / 2;
          return (
            <g key={`conn-${idx}`}>
              {/* Glow line behind */}
              <path
                d={`M 50 ${node.y + 40} Q 50 ${midY}, 50 ${next.y}`}
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.3"
                filter="url(#glow)"
              />
              {/* Main line */}
              <path
                d={`M 50 ${node.y + 40} Q 50 ${midY}, 50 ${next.y}`}
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="animate-flow-line"
              />
              {/* Arrow dots at midpoint */}
              <circle cx="50" cy={midY} r="1.5" fill="#4F46E5" opacity="0.6" className="animate-pulse-dot" />
            </g>
          );
        })}

        {/* Nodes */}
        {WORKFLOW_NODES.map((node, idx) => (
          <g key={node.id}>
            {/* Node background */}
            <rect
              x={20} y={node.y}
              width="60" height="36"
              rx="18" ry="18"
              fill={node.color}
              opacity={idx === WORKFLOW_NODES.length - 1 ? 1 : 0.9}
              filter={idx === 0 ? 'url(#glow)' : undefined}
            />
            {/* Node label */}
            <text
              x={50} y={node.y + 22}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function AutomationStudio() {
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setShowWorkflow(false);

    try {
      const result = await generateWorkflowDescription(sanitizeInput(prompt));
      if (result.error) {
        console.error('Workflow generation error:', result.error);
      }
    } catch (err) {
      console.error('Workflow generation error:', err);
    }

    // Always show the workflow UI after "generation"
    setTimeout(() => {
      setIsGenerating(false);
      setShowWorkflow(true);
    }, 800);
  }, [prompt]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  const examplePrompts = [
    'When payment is verified, send confirmation.',
    'Notify me whenever a VIP customer places an order.',
    'Generate an invoice after quotation approval.',
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* ===== Page Header ===== */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Workflow size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Automation Studio</h1>
          </div>
          <p className="section-subtitle">Describe what you want to automate. Swift builds the workflow.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="success" dot size="sm">AI Active</Badge>
          <span className="text-xs text-text-secondary">3 workflows running</span>
        </div>
      </div>

      {/* ===== Hero: AI Prompt Box ===== */}
      <div className="hero-gradient p-6 lg:p-8">
        <div className="hero-pattern" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="hero-icon">
              <Sparkles size={15} className="text-indigo-200" />
            </div>
            <span className="hero-label">AI Workflow Builder</span>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight mb-2">
            What would you like to automate?
          </h2>
          <p className="text-sm text-indigo-200/90 mb-5">
            Describe your workflow in plain English. Swift's AI will build it for you.
          </p>

          {/* Prompt Input */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl ring-1 ring-white/20 overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-400/50 focus-within:bg-white/15">
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to automate..."
                className="w-full bg-transparent text-white placeholder-indigo-300/70 px-5 py-4 pr-14 resize-none outline-none text-sm min-h-[56px] max-h-[160px] leading-relaxed"
                rows={2}
                aria-label="Describe your automation workflow"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="absolute right-2.5 bottom-2.5 p-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.95] cursor-pointer"
                aria-label="Generate workflow"
              >
                {isGenerating ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="flex flex-wrap gap-2 mt-4">
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => { setPrompt(ex); inputRef.current?.focus(); }}
                className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs text-indigo-200 hover:bg-white/20 hover:text-white transition-all duration-150 cursor-pointer ring-1 ring-white/10"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== AI Generated Workflow + Summary ===== */}
      {showWorkflow && (
        <div className="animate-slide-up-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflow Diagram */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <CheckCircle size={13} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Generated Workflow</h3>
              <Badge variant="success" size="sm" dot>Live</Badge>
            </div>
            <div className="relative">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-emerald-500/5 rounded-xl" />
              <WorkflowDiagram />
            </div>
          </Card>

          {/* Workflow Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Swift's Summary</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground font-medium mb-1">Purpose</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  This workflow automates the end-to-end order processing pipeline. When a customer submits a request,
                  the Sales Agent creates a quotation, awaits customer approval, then passes it to the Finance Agent
                  for payment verification. Customer Success sends a confirmation, and the system notifies all parties.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface text-center">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Est. Time</p>
                  <p className="text-sm font-bold text-foreground">~12s</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface text-center">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Confidence</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">98%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface text-center">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Impact</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">High</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={() => {}}>
                  <Play size={14} />
                  Activate Workflow
                </Button>
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  <Settings size={14} />
                  Customise
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ===== Workflow Templates ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Workflow Templates</h3>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            View All
            <ChevronRight size={14} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {WORKFLOW_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => {
                  setPrompt(`Set up a workflow for: ${template.label}`);
                  setShowWorkflow(false);
                }}
                className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${template.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                <div className="relative p-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${template.color}15`, color: template.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{template.label}</p>
                  <p className="text-[11px] text-text-secondary leading-tight mb-3">{template.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted">
                    <span>{template.steps} steps</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1">
                      <TrendingUp size={10} />
                      {template.popularity}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Automation Health + AI Optimization ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Automation Health */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Automation Health</h3>
            </div>
            <Badge variant="info" dot size="sm">3 Active</Badge>
          </div>
          <div className="space-y-3">
            {RUNNING_WORKFLOWS.map((wf) => {
              const statusColor = wf.status === 'running' ? '#22C55E' : wf.status === 'paused' ? '#F59E0B' : wf.status === 'failed' ? '#EF4444' : '#64748B';
              const statusLabel = wf.status === 'running' ? 'Running' : wf.status === 'paused' ? 'Paused' : wf.status === 'failed' ? 'Failed' : 'Completed';
              return (
                <div key={wf.id} className="flex items-center justify-between p-3.5 rounded-xl bg-surface hover:bg-surface-hover transition-colors duration-150">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{wf.name}</p>
                      <p className="text-[11px] text-text-secondary">{wf.startedBy} · {wf.lastRun}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-5 text-xs text-text-secondary shrink-0">
                    <span className="text-center">
                      <span className="block font-semibold text-foreground">{wf.executions.toLocaleString()}</span>
                      Executions
                    </span>
                    <span className="text-center">
                      <span className="block font-semibold text-foreground">{wf.successRate}%</span>
                      Success
                    </span>
                    <span className="text-center">
                      <span className="block font-semibold text-foreground">{wf.avgCompletionTime}</span>
                      Avg Time
                    </span>
                  </div>
                  <Badge
                    variant={wf.status === 'running' ? 'success' : wf.status === 'paused' ? 'warning' : 'neutral'}
                    size="sm"
                    dot
                  >
                    {statusLabel}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Optimization */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Optimisation</h3>
          </div>
          <div className="space-y-3">
            {AI_OPTIMIZATIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  className="p-3.5 rounded-xl bg-surface hover:bg-surface-hover transition-colors duration-150 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `${opt.color}15`, color: opt.color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{opt.explanation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                          <Zap size={10} />
                          {opt.savings}
                        </span>
                        <span className="text-[10px] text-text-secondary">{opt.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ===== Recent Executions Timeline ===== */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Recent Executions</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <Eye size={14} />
            View All
          </Button>
        </div>
        <div className="relative">
          <div className="space-y-0">
            {EXECUTION_EVENTS.map((event, idx) => {
              const Icon = event.icon;
              const isLast = idx === EXECUTION_EVENTS.length - 1;
              return (
                <div key={event.id} className="flex gap-4 pb-5 relative last:pb-0 animate-fade-in-stream" style={{ animationDelay: `${idx * 60}ms` }}>
                  {/* Vertical line */}
                  {!isLast && (
                    <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
                  )}
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white"
                    style={{ backgroundColor: `${event.iconColor}15`, color: event.iconColor }}
                  >
                    <Icon size={14} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{event.agentName}</p>
                      <span className="text-xs text-text-secondary">{event.action}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{event.target}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted">{event.timeAgo}</span>
                      <Badge
                        variant={event.status === 'success' ? 'success' : event.status === 'pending' ? 'warning' : 'info'}
                        size="sm"
                        dot
                      >
                        {event.status === 'success' ? 'Done' : event.status === 'pending' ? 'Pending' : 'Info'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}