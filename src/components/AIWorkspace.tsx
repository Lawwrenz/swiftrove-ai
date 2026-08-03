// ============================================================================
// AI Workspace — Immersive Panel for AI-Human Collaboration
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, CheckCircle, Circle, Bot, Sparkles, MessageSquare, Mail,
  TrendingUp, DollarSign, Handshake, Clock, Send, Edit3, FileText,
  CreditCard, Bell, AlertTriangle, Play, Shield,
} from 'lucide-react';
import type { KanbanOrder } from '../lib/constants';
import { Avatar, Badge } from './ui';

// ============================================================================
// Agent definitions
// ============================================================================
const AGENTS = {
  sales: { name: 'Sales Agent', icon: TrendingUp, gradient: 'from-indigo-500 to-indigo-600', color: '#4F46E5', bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  finance: { name: 'Finance Agent', icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', color: '#22C55E', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  success: { name: 'Customer Success', icon: Handshake, gradient: 'from-violet-500 to-violet-600', color: '#8B5CF6', bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
};

// ============================================================================
// Mock conversation data based on order stage
// ============================================================================
function getConversation(_stage: string) {
  return [
    { agent: 'sales', message: 'I\'ve analysed the customer\'s requirements and generated a tailored quotation matching their business needs.', time: '2m ago' },
    { agent: 'finance', message: 'I\'m reviewing the payment details. Waiting for verification before releasing funds.', time: '1m ago' },
    { agent: 'success', message: 'I\'ve prepared the onboarding confirmation message. Ready to send once payment clears.', time: '30s ago' },
  ];
}

// ============================================================================
// Mock message preview
// ============================================================================
function getMessagePreview(customer: string, product: string) {
  return {
    subject: `Your ${product} Confirmation`,
    body: `Hello ${customer},\n\nYour ${product} has been confirmed.\nThank you for choosing Sweet Crumbs Bakery.\nYour order details are attached.\n\nBest regards,\nThe Sweet Crumbs Team`,
  };
}

// ============================================================================
// Workflow steps by current stage
// ============================================================================
const WORKFLOW_STEPS = [
  { label: 'Customer Inquiry', icon: MessageSquare },
  { label: 'AI Analysed Requirements', icon: Bot },
  { label: 'Quotation Generated', icon: FileText },
  { label: 'Customer Approved', icon: CheckCircle },
  { label: 'Payment Verification', icon: Shield },
  { label: 'Welcome Message', icon: Mail },
  { label: 'Order Complete', icon: Sparkles },
];

function getCurrentStepIndex(stage: string): number {
  const map: Record<string, number> = {
    'Customer Inquiry': 0,
    'AI Analysed Requirements': 1,
    'Quotation Generated': 2,
    'Customer Approved': 3,
    'Payment Verification': 4,
    'Welcome Message': 5,
    'Order Complete': 6,
  };
  return map[stage] ?? 4;
}

// ============================================================================
// Timeline from order
// ============================================================================
function getTimelineFromOrder(order: KanbanOrder) {
  return order.timeline.map((t) => ({
    label: t.status,
    completed: t.completed,
    agent: t.agent,
    agentInitials: t.agentInitials,
    date: t.date,
  }));
}

// ============================================================================
// Sub-components
// ============================================================================

// --- Animated Circular Progress ---
function CircularProgress({ value, label, color, size = 80 }: {
  value: number; label: string; color: string; size?: number;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#grad-${label.replace(/\s+/g, '')})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <defs>
            <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground" style={{ color }}>
            {Math.round(animatedValue)}%
          </span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-text-secondary text-center leading-tight">{label}</span>
    </div>
  );
}

// --- AI Reasoning Card ---
function AIReasoning({ order }: { order: KanbanOrder }) {
  const reasoning = `Sales Agent analysed ${order.customer}'s request. The ${order.product} best matches the customer's requirements based on previous interactions and requested features.`;
  const waitingOn = `Finance Agent is waiting for payment confirmation before Customer Success sends the onboarding message.`;

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
          <Sparkles size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">AI Reasoning</h3>
      </div>
      <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
        <p>{reasoning}</p>
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-100">
          <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <Clock size={12} className="text-amber-700" />
          </div>
          <p className="text-sm text-amber-800">{waitingOn}</p>
        </div>
      </div>
    </div>
  );
}

// --- AI Workflow ---
function AIWorkflow({ currentStage }: { currentStage: string }) {
  const currentIndex = getCurrentStepIndex(currentStage);

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">AI Workflow</h3>
      <div className="space-y-0">
        {WORKFLOW_STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={i} className="flex gap-3 relative last:pb-0 pb-2">
              {/* Connector line */}
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                  isCompleted ? 'bg-emerald-300' : isCurrent ? 'bg-indigo-300' : 'bg-slate-200'
                }`} />
              )}

              {/* Icon */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-300'
                  : isCurrent
                    ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-400 animate-pulse'
                    : 'bg-slate-100 text-slate-400 ring-2 ring-slate-200'
              }`}>
                {isCompleted ? (
                  <CheckCircle size={14} />
                ) : isCurrent ? (
                  <Play size={12} className="ml-0.5" />
                ) : (
                  <Circle size={12} />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0 pt-1">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isCompleted ? 'text-foreground' : isCurrent ? 'text-indigo-700 font-semibold' : 'text-muted'
                }`}>
                  {step.label}
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 ml-2 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
                      In Progress
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- AI Actions ---
function AIActions() {
  const actions = [
    { icon: CheckCircle, label: 'Approve AI Recommendation', color: '#4F46E5', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', text: 'text-indigo-700' },
    { icon: Edit3, label: 'Edit Quotation', color: '#F59E0B', bg: 'bg-amber-50', hover: 'hover:bg-amber-100', text: 'text-amber-700' },
    { icon: CreditCard, label: 'Generate Invoice', color: '#22C55E', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100', text: 'text-emerald-700' },
    { icon: Bell, label: 'Send Payment Reminder', color: '#8B5CF6', bg: 'bg-violet-50', hover: 'hover:bg-violet-100', text: 'text-violet-700' },
    { icon: AlertTriangle, label: 'Escalate to Human', color: '#EF4444', bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-700' },
  ];

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">AI Actions</h3>
      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action, i) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl ${action.bg} ${action.hover} ${action.text} transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full text-left`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/80 shadow-sm">
                <ActionIcon size={16} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Live Conversation ---
function LiveConversation() {
  const conversation = getConversation('Payment Verification');
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    // Stagger message appearance
    conversation.forEach((_, i) => {
      setTimeout(() => setVisibleMessages((prev) => Math.max(prev, i + 1)), 400 + i * 800);
    });
  }, []);

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
        <h3 className="text-sm font-semibold text-foreground">Live Conversation</h3>
      </div>
      <div className="space-y-3">
        {conversation.slice(0, visibleMessages).map((msg, i) => {
          const agent = AGENTS[msg.agent as keyof typeof AGENTS];
          const AgentIcon = agent.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-border animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${agent.gradient} shadow-sm`}>
                <AgentIcon size={15} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-foreground">{agent.name}</span>
                  <span className="text-[10px] text-muted">{msg.time}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{msg.message}</p>
              </div>
            </div>
          );
        })}
        {visibleMessages < conversation.length && (
          <div className="flex items-center gap-2 text-xs text-muted pl-2 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span>AI agents are responding...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Message Preview ---
function MessagePreview({ order }: { order: KanbanOrder }) {
  const preview = getMessagePreview(order.customer, order.product);
  const [approved, setApproved] = useState(false);

  if (approved) {
    return (
      <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <p className="text-sm font-semibold text-emerald-800 mb-1">Message Sent!</p>
        <p className="text-xs text-emerald-600">The confirmation has been sent to {order.customer}.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm">
          <Mail size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Message Preview</h3>
          <p className="text-[10px] text-text-secondary">Customer confirmation</p>
        </div>
      </div>

      {/* Email preview */}
      <div className="rounded-xl bg-slate-50 border border-border p-4 mb-4">
        <p className="text-xs font-semibold text-foreground mb-2">{preview.subject}</p>
        <div className="space-y-1 text-sm text-text-secondary leading-relaxed">
          {preview.body.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setApproved(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium
            hover:shadow-md hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Send size={15} />
          Approve &amp; Send
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-primary border border-border text-sm font-medium
            hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Edit3 size={15} />
          Edit Message
        </button>
      </div>
    </div>
  );
}

// --- Confidence Scores ---
function ConfidenceScores() {
  const scores = [
    { label: 'Sales Agent', value: 98, color: '#4F46E5', gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Finance Agent', value: 96, color: '#22C55E', gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Customer Success', value: 99, color: '#8B5CF6', gradient: 'from-violet-500 to-violet-600' },
  ];

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-5">AI Confidence</h3>
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        {scores.map((score) => (
          <CircularProgress
            key={score.label}
            label={score.label}
            value={score.value}
            color={score.color}
          />
        ))}
      </div>
    </div>
  );
}

// --- Timeline ---
function OrderTimeline({ order }: { order: KanbanOrder }) {
  const timeline = getTimelineFromOrder(order);

  return (
    <div className="p-5 rounded-xl bg-white border border-border shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">Order Timeline</h3>
      <div className="space-y-0">
        {timeline.map((step, i) => {
          const isLast = i === timeline.length - 1;
          return (
            <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
              {/* Connector */}
              {!isLast && (
                <div className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${step.completed ? 'bg-emerald-200' : 'bg-slate-200'}`} />
              )}
              {/* Dot */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                step.completed
                  ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-200'
                  : 'bg-slate-100 text-slate-400 ring-2 ring-slate-200'
              }`}>
                {step.completed ? (
                  <CheckCircle size={14} />
                ) : (
                  <Circle size={12} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted'}`}>
                  {step.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-text-secondary">{step.date}</span>
                  {step.agent && (
                    <>
                      <span className="text-[11px] text-muted">•</span>
                      <span className="text-[11px] font-medium text-primary">{step.agent}</span>
                    </>
                  )}
                </div>
              </div>
              {step.completed && (
                <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main AIWorkspace Component
// ============================================================================
export default function AIWorkspace({
  order,
  onClose,
}: {
  order: KanbanOrder;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Focus management
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    first?.focus();
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  // Derive current stage from order
  const currentStage = order.timeline.find((t) => !t.completed)?.status ?? 'Order Complete';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isVisible ? 'bg-black/30 backdrop-blur-sm' : 'bg-black/0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-workspace-title"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[40%] max-w-[600px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ===== Header ===== */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h2 id="ai-workspace-title" className="text-lg font-bold text-foreground tracking-tight">{order.id}</h2>
              <Badge variant={order.priority === 'high' ? 'danger' : order.priority === 'medium' ? 'warning' : 'neutral'} dot>
                {order.priority}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{order.date}</p>
          </div>
          <button
            ref={triggerRef}
            onClick={handleClose}
            className="p-2 rounded-lg text-text-secondary hover:bg-slate-100 hover:text-foreground transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ml-3 shrink-0"
            aria-label="Close AI Workspace"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== Scrollable Content ===== */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Customer Summary */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Avatar initials={order.customerInitials} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground">{order.customer}</p>
                <p className="text-sm text-text-secondary">{order.product}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-text-secondary">Order Value</p>
                <p className="text-xl font-bold text-foreground">₦{order.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse-dot" />
              <span className="text-sm font-medium text-indigo-700">Current Stage: {currentStage}</span>
            </div>
          </div>

          {/* Section 1: AI Reasoning */}
          <AIReasoning order={order} />

          {/* Section 2: AI Workflow */}
          <AIWorkflow currentStage={currentStage} />

          {/* Section 3: AI Actions */}
          <AIActions />

          {/* Section 4: Live Conversation */}
          <LiveConversation />

          {/* Section 5: Message Preview */}
          <MessagePreview order={order} />

          {/* Section 6: Confidence */}
          <ConfidenceScores />

          {/* Section 7: Timeline */}
          <OrderTimeline order={order} />

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}