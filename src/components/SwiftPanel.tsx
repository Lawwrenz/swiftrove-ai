import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, X, Send, Brain, TrendingUp, DollarSign, Handshake,
  Users, ShoppingCart, FileText, CreditCard,
  CheckCircle, ArrowRight, Clock, AlertCircle, Bot,
  MessageSquare, ChevronRight, Shield, Network,
  User, PanelLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSwift, type SwiftMessage, type SwiftReasoning, type SwiftAction, type AgentCollaboration } from '../context/SwiftContext';
import { ThinkingDots } from './micro';
import { askSwift, getErrorMessage, sanitizeInput } from '../lib/ai-service';

// ============================================================================
// Types
// ============================================================================

interface SuggestedQuestion {
  label: string;
  icon: LucideIcon;
  color: string;
}

// ============================================================================
// Data
// ============================================================================

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { label: 'What needs my attention today?', icon: AlertCircle, color: '#EF4444' },
  { label: 'Summarise today\'s business.', icon: FileText, color: '#4F46E5' },
  { label: 'Which customers should I follow up with?', icon: Users, color: '#F59E0B' },
  { label: 'Explain my cash flow.', icon: DollarSign, color: '#22C55E' },
  { label: 'Show pending approvals.', icon: Clock, color: '#8B5CF6' },
  { label: 'How is Grace Eze\'s order progressing?', icon: ShoppingCart, color: '#EC4899' },
];

// ============================================================================
// Helper: Generate Swift responses (replaced by real AI)
// ============================================================================

// The generateResponse function has been replaced by real AI calls via askSwift
// See handleSend below for the real AI integration.

// ============================================================================
// Sub-components
// ============================================================================

// ============================================================================
// Message Bubble
// ============================================================================

function SwiftMessageBubble({ message }: { message: SwiftMessage }) {
  const [showReasoning, setShowReasoning] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4 animate-slide-in-right">
        <div className="max-w-[85%] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 animate-slide-up-fade-in">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
          <Sparkles size={15} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Sender name */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-foreground">Swift</span>
            <span className="text-[10px] text-text-secondary">Executive Assistant</span>
          </div>

          {/* Content */}
          <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3.5 shadow-sm ring-1 ring-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          </div>

          {/* AI Reasoning */}
          {message.reasoning && (
            <div className="mt-2">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors duration-150 cursor-pointer"
              >
                <Brain size={13} />
                <span>Why?</span>
                <ChevronRight
                  size={12}
                  className={`transition-transform duration-200 ${showReasoning ? 'rotate-90' : ''}`}
                />
              </button>

              {showReasoning && (
                <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-violet-50/80 ring-1 ring-indigo-100/50 animate-slide-up-fade-in">
                  <p className="text-[11px] font-semibold text-indigo-700 mb-2">AI Reasoning</p>
                  <ul className="space-y-1.5 mb-2">
                    {message.reasoning.points.map((point, i) => (
                      <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5">
                        <CheckCircle size={10} className="text-indigo-400 mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 pt-1.5 border-t border-indigo-100/50">
                    <Shield size={11} className="text-indigo-400" />
                    <span className="text-[10px] font-medium text-indigo-500">Confidence: {message.reasoning.confidence}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multi-agent collaboration */}
          {message.agents && message.agents.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-surface to-surface/80 ring-1 ring-border animate-slide-up-fade-in">
              <div className="flex items-center gap-2 mb-2.5">
                <Bot size={13} className="text-primary" />
                <span className="text-[11px] font-semibold text-foreground">Multi-Agent Collaboration</span>
              </div>
              <div className="space-y-2">
                {message.agents.map((agent, i) => {
                  const AgentIcon = agent.icon === 'DollarSign' ? DollarSign : agent.icon === 'TrendingUp' ? TrendingUp : agent.icon === 'Handshake' ? Handshake : Bot;
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${agent.color}15` }}
                      >
                        <AgentIcon size={12} style={{ color: agent.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-foreground">{agent.agent}</span>
                          {agent.status === 'done' && (
                            <span className="text-emerald-500"><CheckCircle size={10} /></span>
                          )}
                          {agent.status === 'working' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                          )}
                          {agent.status === 'pending' && (
                            <span className="text-muted"><Clock size={10} /></span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-secondary truncate">{agent.task}</p>
                      </div>
                      <span className={`text-[10px] font-medium ${
                        agent.status === 'done' ? 'text-emerald-600' :
                        agent.status === 'working' ? 'text-amber-600' : 'text-text-secondary'
                      }`}>
                        {agent.status === 'done' ? '✓ Completed' : agent.status === 'working' ? 'Working...' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Overall progress */}
              {message.agents.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-text-secondary">Overall Workflow</span>
                    <span className="text-[10px] font-medium text-primary">
                      {Math.round((message.agents.filter(a => a.status === 'done').length / message.agents.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${(message.agents.filter(a => a.status === 'done').length / message.agents.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {message.actions && message.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.actions.map((action, i) => {
                const ActionIcon = action.icon === 'MessageSquare' ? MessageSquare :
                  action.icon === 'CreditCard' ? CreditCard :
                  action.icon === 'Send' ? Send :
                  action.icon === 'User' ? User :
                  action.icon === 'CheckCircle' ? CheckCircle :
                  action.icon === 'BarChart3' ? TrendingUp :
                  action.icon === 'Bot' ? Bot :
                  action.icon === 'FileText' ? FileText :
                  action.icon === 'Network' ? Network :
                  action.icon === 'Users' ? Users :
                  action.icon === 'DollarSign' ? DollarSign : ArrowRight;
                return (
                  <button
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-700
                      hover:from-indigo-100 hover:to-violet-100
                      transition-all duration-150 ring-1 ring-indigo-200/50
                      active:scale-[0.97] cursor-pointer"
                  >
                    <ActionIcon size={12} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Typing Indicator
// ============================================================================

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4 animate-slide-up-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 relative">
        <Sparkles size={15} />
        <div className="absolute inset-0 rounded-xl bg-indigo-400/20 animate-thinking-glow" />
      </div>
      <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3.5 shadow-sm ring-1 ring-border">
        <ThinkingDots color="bg-indigo-400" dotCount={3} size="md" />
      </div>
    </div>
  );
}

// ============================================================================
// Welcome Screen
// ============================================================================

function WelcomeScreen({ onQuestionClick }: { onQuestionClick: (q: string) => void }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="animate-slide-up-fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {getGreeting()}, Lawrence 👋
        </h2>
      </div>

      <div className="animate-slide-up-fade-in stagger-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">I'm Swift.</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed ml-8">
          I've reviewed today's business activity and I'm ready to help.
        </p>
      </div>

      {/* Today's Briefing */}
      <div className="animate-slide-up-fade-in stagger-2">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 rounded-2xl p-5 ring-1 ring-indigo-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Today's Summary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="text-[10px] font-medium text-emerald-600">Live</span>
            </div>
          </div>

          <div className="space-y-2.5 mb-4">
            {[
              '18 operational tasks completed',
              '7 customer conversations handled',
              '₦635,000 payments verified',
              '3 workflows completed',
              'No critical operational issues detected',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* Business Health */}
          <div className="bg-card/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Business Health</span>
              <span className="text-lg font-bold text-emerald-600">96%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-progress-pulse"
                style={{ width: '96%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="animate-slide-up-fade-in stagger-3">
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Try asking
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => onQuestionClick(q.label)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-surface hover:bg-surface-hover
                text-sm text-text-secondary hover:text-foreground
                transition-all duration-150 text-left cursor-pointer
                ring-1 ring-border hover:ring-ring active:scale-[0.99]"
            >
              <q.icon size={14} style={{ color: q.color }} className="shrink-0" />
              <span className="truncate">{q.label}</span>
              <ArrowRight size={12} className="ml-auto text-muted shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main SwiftPanel Component
// ============================================================================

export default function SwiftPanel() {
  const {
    isOpen, closeSwift, messages, addMessage, isTyping, setIsTyping,
    showWelcome, setShowWelcome, clearMessages,
  } = useSwift();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Scroll to bottom on new messages or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Reset input on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setInput(''), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text?: string) => {
    const query = sanitizeInput(text || input);
    if (!query) return;

    // Cancel any previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    // Add user message
    const userMsg: SwiftMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setInput('');
    setShowWelcome(false);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call the real AI
      const result = await askSwift(query, undefined, { signal: abortRef.current.signal });

      if (result.error) {
        throw new Error(result.error);
      }

      const swiftMsg: SwiftMessage = {
        id: `swift-${Date.now()}`,
        role: 'swift',
        content: result.response || "I'm analysing the data. Could you provide more details?",
        timestamp: Date.now(),
        reasoning: {
          points: [
            'Analysed through business knowledge graph.',
            'Cross-referenced customer, order, and payment data.',
            'Generated response using AI analysis.',
          ],
          confidence: 95,
        },
        actions: [
          { label: 'View Report', icon: 'BarChart3', action: () => {} },
          { label: 'Check Customers', icon: 'Users', action: () => {} },
        ],
      };
      addMessage(swiftMsg);
    } catch (error: any) {
      if (error.name === 'AbortError') return;

      const errorMsg: SwiftMessage = {
        id: `swift-${Date.now()}`,
        role: 'swift',
        content: `I encountered an issue: ${getErrorMessage(error)}. Please try asking again or rephrase your question.`,
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  }, [input, addMessage, setIsTyping, setShowWelcome]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={closeSwift}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Swift AI Executive Assistant"
        className="fixed inset-y-0 right-0 z-[91] w-full max-w-lg animate-slide-in-right shadow-2xl"
      >
        <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl ring-1 ring-border">
          {/* ============================================================ */}
          {/* HEADER */}
          {/* ============================================================ */}
          <div className="shrink-0 px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Swift</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                    <span className="text-[10px] text-emerald-600 font-medium">Active</span>
                    <span className="text-[10px] text-text-secondary">·</span>
                    <span className="text-[10px] text-text-secondary">Executive Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                    aria-label="Clear conversation"
                    title="New conversation"
                  >
                    <PanelLeft size={16} />
                  </button>
                )}
                <button
                  onClick={closeSwift}
                  className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                  aria-label="Close Swift"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick keyboard hint */}
            <div className="flex items-center gap-2 mt-2.5">
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-hover text-[9px] font-medium text-text-secondary ring-1 ring-border">
                ⌘K
              </kbd>
              <span className="text-[10px] text-text-secondary">to toggle ·</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-hover text-[9px] font-medium text-text-secondary ring-1 ring-border">
                Esc
              </kbd>
              <span className="text-[10px] text-text-secondary">to close</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BODY */}
          {/* ============================================================ */}
          <div className="flex-1 overflow-y-auto">
            {showWelcome && messages.length === 0 ? (
              <WelcomeScreen onQuestionClick={(q) => handleSend(q)} />
            ) : (
              <div className="p-5">
                {/* Messages */}
                {messages.map((msg) => (
                  <SwiftMessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* INPUT */}
          {/* ============================================================ */}
          <div className="shrink-0 px-4 py-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Swift anything..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface text-sm text-foreground placeholder:text-muted
                    ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card
                    transition-all duration-150"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Ask Swift anything"
                />
              </div>
              <button
                onClick={() => input.trim() && handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500
                  flex items-center justify-center text-white shadow-md shadow-indigo-500/20
                  hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105
                  active:scale-[0.95] transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                  cursor-pointer"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-[10px] text-text-secondary text-center mt-2">
              Swift understands your customers, operations, and AI agents
            </p>
          </div>
        </div>
      </div>
    </>
  );
}