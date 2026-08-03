import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, Search, X, Zap, ArrowRight, Clock, Bot,
  TrendingUp, DollarSign, Handshake, Cpu, CheckCircle,
  Users, FileText, MessageSquare, BarChart3, CreditCard,
} from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';

// ============================================================================
// Types
// ============================================================================

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Sparkles;
  color: string;
  bg: string;
}

interface AgentMatch {
  name: string;
  icon: typeof Bot;
  color: string;
  gradient: string;
}

interface RecentCommand {
  id: string;
  text: string;
  agent: string;
}

interface ExecutionStage {
  id: string;
  name: string;
  icon: typeof Bot;
  color: string;
  progress: number;
  status: 'working' | 'waiting' | 'done';
  task: string;
}

// ============================================================================
// Data
// ============================================================================

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'order', label: 'Create Order', icon: Zap, color: '#4F46E5', bg: 'bg-indigo-50' },
  { id: 'payment', label: 'Verify Payment', icon: CreditCard, color: '#22C55E', bg: 'bg-emerald-50' },
  { id: 'customer', label: 'Find Customer', icon: Users, color: '#F59E0B', bg: 'bg-amber-50' },
  { id: 'insights', label: 'Show Insights', icon: BarChart3, color: '#8B5CF6', bg: 'bg-violet-50' },
  { id: 'invoice', label: 'Generate Invoice', icon: FileText, color: '#EC4899', bg: 'bg-pink-50' },
  { id: 'reply', label: 'Draft Reply', icon: MessageSquare, color: '#06B6D4', bg: 'bg-cyan-50' },
];

const EXAMPLES = [
  'Create an order for Grace Eze...',
  'Verify payment for order #1042',
  'Find customer with email',
  'Show pending orders',
  'Generate invoice for last month',
  'Draft a reply to customer inquiry',
  'Summarise today\'s activity',
];

const RECENT_COMMANDS: RecentCommand[] = [
  { id: '1', text: 'Create quotation for Grace Eze', agent: 'Sales Agent' },
  { id: '2', text: 'Show unpaid orders', agent: 'Finance Agent' },
  { id: '3', text: 'Generate invoice', agent: 'Finance Agent' },
  { id: '4', text: 'Prepare follow-up', agent: 'Customer Success' },
];

// ============================================================================
// Agent matching logic
// ============================================================================

function matchAgent(input: string): AgentMatch | null {
  const lower = input.toLowerCase();

  if (lower.includes('order') || lower.includes('quotation') || lower.includes('quote') || lower.includes('sales') || lower.includes('sell')) {
    return { name: 'Sales Agent', icon: TrendingUp, color: '#4F46E5', gradient: 'from-indigo-500 to-indigo-600' };
  }
  if (lower.includes('payment') || lower.includes('pay') || lower.includes('invoice') || lower.includes('finance') || lower.includes('dollar') || lower.includes('money')) {
    return { name: 'Finance Agent', icon: DollarSign, color: '#22C55E', gradient: 'from-emerald-500 to-emerald-600' };
  }
  if (lower.includes('customer') || lower.includes('success') || lower.includes('follow') || lower.includes('reply') || lower.includes('draft') || lower.includes('message')) {
    return { name: 'Customer Success', icon: Handshake, color: '#8B5CF6', gradient: 'from-violet-500 to-violet-600' };
  }
  if (lower.includes('generate') || lower.includes('workflow') || lower.includes('automate') || lower.includes('pipeline') || lower.includes('orchestrat')) {
    return { name: 'Swift AI Orchestrator', icon: Cpu, color: '#F59E0B', gradient: 'from-amber-500 to-amber-600' };
  }
  if (lower.includes('insight') || lower.includes('analytics') || lower.includes('report') || lower.includes('trend') || lower.includes('summary')) {
    return { name: 'Analytics Engine', icon: BarChart3, color: '#8B5CF6', gradient: 'from-violet-500 to-violet-600' };
  }

  return null;
}

// ============================================================================
// Execution Simulation
// ============================================================================

function simulateExecution(input: string): ExecutionStage[] {
  const lower = input.toLowerCase();
  const stages: ExecutionStage[] = [];

  if (lower.includes('order') || lower.includes('quotation') || lower.includes('quote')) {
    stages.push(
      { id: 's1', name: 'Sales Agent', icon: TrendingUp, color: '#4F46E5', progress: 87, status: 'working', task: 'Creating quotation for Grace Eze' },
      { id: 's2', name: 'Business Approval', icon: CheckCircle, color: '#F59E0B', progress: 0, status: 'waiting', task: 'Awaiting owner approval' },
      { id: 's3', name: 'Finance Agent', icon: DollarSign, color: '#22C55E', progress: 0, status: 'waiting', task: 'Waiting for payment' },
      { id: 's4', name: 'Customer Success', icon: Handshake, color: '#8B5CF6', progress: 0, status: 'waiting', task: 'Waiting' },
    );
  } else if (lower.includes('payment') || lower.includes('invoice')) {
    stages.push(
      { id: 's1', name: 'Finance Agent', icon: DollarSign, color: '#22C55E', progress: 63, status: 'working', task: 'Verifying payment details' },
      { id: 's2', name: 'Sales Agent', icon: TrendingUp, color: '#4F46E5', progress: 100, status: 'done', task: 'Order confirmed' },
      { id: 's3', name: 'Customer Success', icon: Handshake, color: '#8B5CF6', progress: 0, status: 'waiting', task: 'Preparing confirmation' },
    );
  } else if (lower.includes('customer') || lower.includes('find')) {
    stages.push(
      { id: 's1', name: 'Customer Success', icon: Handshake, color: '#8B5CF6', progress: 100, status: 'done', task: 'Customer found: Grace Eze' },
      { id: 's2', name: 'Sales Agent', icon: TrendingUp, color: '#4F46E5', progress: 0, status: 'waiting', task: 'Ready to create order' },
    );
  } else {
    stages.push(
      { id: 's1', name: 'Swift AI Orchestrator', icon: Cpu, color: '#4F46E5', progress: 45, status: 'working', task: 'Analysing request...' },
      { id: 's2', name: 'AI Engine', icon: Bot, color: '#8B5CF6', progress: 0, status: 'waiting', task: 'Processing...' },
    );
  }

  return stages;
}

// ============================================================================
// Sub-components
// ============================================================================

function AgentBadge({ agent }: { agent: AgentMatch }) {
  const AgentIcon = agent.icon;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-inset ring-white/20 animate-slide-up-fade-in">
      <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
        <AgentIcon size={11} className="text-white" />
      </div>
      <span className="text-sm font-medium text-white">{agent.name} selected</span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
    </div>
  );
}

function ExecutionView({ stages, onClose }: { stages: ExecutionStage[]; onClose: () => void }) {
  return (
    <div className="space-y-3 animate-slide-up-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white/80">Executing Workflow</h4>
        <button
          onClick={onClose}
          className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
      {stages.map((stage) => {
        const StageIcon = stage.icon;
        return (
          <div key={stage.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <StageIcon size={16} style={{ color: stage.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{stage.name}</span>
                  {stage.status === 'working' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-400/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                      Working
                    </span>
                  )}
                  {stage.status === 'waiting' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-400/20 text-amber-300 ring-1 ring-inset ring-amber-400/30">
                      Waiting
                    </span>
                  )}
                  {stage.status === 'done' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-400/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                      <CheckCircle size={9} />
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-0.5">{stage.task}</p>
              </div>
            </div>
            {/* Progress bar */}
            {stage.status === 'working' && (
              <div className="h-2 bg-white/10 rounded-full overflow-hidden ring-1 ring-inset ring-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${stage.progress}%`,
                    background: `linear-gradient(90deg, ${stage.color}, ${stage.color}dd)`,
                    boxShadow: `0 0 8px ${stage.color}66`,
                  }}
                />
              </div>
            )}
            {stage.status === 'done' && (
              <div className="h-2 bg-white/10 rounded-full overflow-hidden ring-1 ring-inset ring-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '100%',
                    background: `linear-gradient(90deg, ${stage.color}, ${stage.color}dd)`,
                  }}
                />
              </div>
            )}
            {stage.status === 'waiting' && (
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock size={11} />
                <span>Awaiting previous step...</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CommandCenter() {
  const { isOpen, closeCommandCenter } = useCommandCenter();
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentMatch | null>(null);
  const [showExamples, setShowExamples] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [stages, setStages] = useState<ExecutionStage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow the animation to start
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setInput('');
        setActiveAgent(null);
        setShowExamples(true);
        setExecuting(false);
        setStages([]);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Detect agent as user types
  useEffect(() => {
    if (input.trim()) {
      const match = matchAgent(input);
      setActiveAgent(match);
      setShowExamples(false);
    } else {
      setActiveAgent(null);
      setShowExamples(true);
    }
  }, [input]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  // Handle submit
  const handleSubmit = useCallback((command?: string) => {
    const text = command || input;
    if (!text.trim()) return;
    setExecuting(true);
    setShowExamples(false);
    const simulated = simulateExecution(text);
    setStages(simulated);
  }, [input]);

  // Handle example click
  const handleExampleClick = useCallback((example: string) => {
    setInput(example);
    setShowExamples(false);
    handleSubmit(example);
  }, [handleSubmit]);

  // Handle quick action
  const handleQuickAction = useCallback((label: string) => {
    setInput(label);
    setShowExamples(false);
    handleSubmit(label);
  }, [handleSubmit]);

  // Handle keydown in input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !executing) {
      handleSubmit();
    }
  }, [handleSubmit, executing]);

  // Trap focus
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector = 'button, input, [tabindex]:not([tabindex="-1"])';
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md animate-fade-in"
        onClick={closeCommandCenter}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-center-title"
        className="fixed inset-0 z-[101] flex items-start justify-center pt-[12vh] px-4 pointer-events-none"
      >
        <div
          className="w-full max-w-2xl pointer-events-auto animate-scale-in"
          style={{ animationDuration: '0.2s' }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-900/90 backdrop-blur-2xl shadow-2xl ring-1 ring-inset ring-white/10">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 id="command-center-title" className="text-sm font-semibold text-white">Swift AI</h2>
                    <p className="text-[10px] text-white/50">Ask, search or automate anything.</p>
                  </div>
                </div>
                <button
                  onClick={closeCommandCenter}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-150 cursor-pointer ring-1 ring-inset ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Close command center"
                >
                  <X size={14} className="text-white/60" />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={18} className="text-white/40" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Create an order for Grace Eze..."
                  className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white/5 text-white text-base placeholder:text-white/30 ring-1 ring-inset ring-white/10
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.07] transition-all duration-150"
                  aria-label="Type a command for Swift AI"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <kbd className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-white/40 ring-1 ring-inset ring-white/10">
                    ↵
                  </kbd>
                </div>
              </div>

              {/* Live Agent Detection */}
              {activeAgent && !executing && (
                <div className="mb-5">
                  <AgentBadge agent={activeAgent} />
                </div>
              )}

              {/* Quick Actions */}
              {!executing && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action.label)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white/80
                            transition-all duration-150 cursor-pointer ring-1 ring-inset ring-white/10 hover:ring-white/20 active:scale-[0.97]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        >
                          <ActionIcon size={14} style={{ color: action.color }} />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Examples */}
              {showExamples && !executing && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Try asking</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example}
                        onClick={() => handleExampleClick(example)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 text-sm text-white/60 hover:text-white/90
                          transition-all duration-150 text-left cursor-pointer ring-1 ring-inset ring-white/[0.04] hover:ring-white/10
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                      >
                        <ArrowRight size={12} className="shrink-0 text-white/20" />
                        <span className="truncate">{example}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Commands */}
              {!executing && !activeAgent && !showExamples && input.length === 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Recent Commands</p>
                  <div className="space-y-1">
                    {RECENT_COMMANDS.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleExampleClick(cmd.text)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 text-sm
                          transition-all duration-150 cursor-pointer w-full text-left ring-1 ring-inset ring-white/[0.04] hover:ring-white/10
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                      >
                        <Clock size={13} className="shrink-0 text-white/30" />
                        <span className="text-white/70 flex-1 truncate">{cmd.text}</span>
                        <span className="text-[10px] text-white/30 shrink-0">{cmd.agent}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution View */}
              {executing && stages.length > 0 && (
                <ExecutionView stages={stages} onClose={() => {
                  setExecuting(false);
                  setStages([]);
                  setInput('');
                  inputRef.current?.focus();
                }} />
              )}

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/30">
                  Press <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-medium text-white/40">⌘K</kbd> to open
                </span>
                <span className="text-[10px] text-white/30">
                  <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-medium text-white/40 mr-1">↑↓</kbd>
                  Navigate
                  <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-medium text-white/40 ml-1 mr-1">↵</kbd>
                  Select
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}