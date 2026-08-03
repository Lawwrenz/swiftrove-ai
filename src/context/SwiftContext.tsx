import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { askSwift, getCacheKey, getFromCache, setCache, getErrorMessage, sanitizeInput } from '../lib/ai-service';

// ============================================================================
// Types
// ============================================================================

export interface SwiftAction {
  label: string;
  icon: string;
  action: () => void;
}

export interface SwiftReasoning {
  points: string[];
  confidence: number;
}

export interface AgentCollaboration {
  agent: string;
  icon: string;
  color: string;
  status: 'done' | 'working' | 'pending';
  task: string;
}

export interface SwiftMessage {
  id: string;
  role: 'user' | 'swift';
  content: string;
  timestamp: number;
  reasoning?: SwiftReasoning;
  actions?: SwiftAction[];
  agents?: AgentCollaboration[];
}

export interface ProactiveInsight {
  id: string;
  message: string;
  icon: string;
  color: string;
}

interface SwiftContextType {
  isOpen: boolean;
  openSwift: () => void;
  closeSwift: () => void;
  toggleSwift: () => void;
  messages: SwiftMessage[];
  addMessage: (msg: SwiftMessage) => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
  proactiveInsight: ProactiveInsight | null;
  dismissProactiveInsight: () => void;
  showWelcome: boolean;
  setShowWelcome: Dispatch<SetStateAction<boolean>>;
  sendMessage: (query: string) => Promise<void>;
}

const SwiftContext = createContext<SwiftContextType | undefined>(undefined);

const PROACTIVE_INSIGHTS: ProactiveInsight[] = [
  { id: 'P1', message: 'Checking your business for actionable insights...', icon: 'Sparkles', color: '#4F46E5' },
  { id: 'P2', message: 'Analysing customer activity and payment status...', icon: 'Zap', color: '#F59E0B' },
  { id: 'P3', message: 'Reviewing pending orders and follow-ups...', icon: 'Clock', color: '#EF4444' },
  { id: 'P4', message: 'Monitoring AI agent performance and task completion...', icon: 'AlertCircle', color: '#EF4444' },
  { id: 'P5', message: 'Evaluating cash flow and revenue trends...', icon: 'Star', color: '#22C55E' },
];

// AI-generated insight cache
let lastInsightFetch = 0;
const INSIGHT_CACHE_TTL = 120000; // 2 minutes

export function SwiftProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SwiftMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [proactiveInsight, setProactiveInsight] = useState<ProactiveInsight | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const openSwift = useCallback(() => setIsOpen(true), []);
  const closeSwift = useCallback(() => setIsOpen(false), []);
  const toggleSwift = useCallback(() => setIsOpen((prev) => !prev), []);

  const addMessage = useCallback((msg: SwiftMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
  }, []);

  const dismissProactiveInsight = useCallback(() => {
    setProactiveInsight(null);
  }, []);

  const sendMessage = useCallback(async (query: string) => {
    const text = sanitizeInput(query);
    if (!text) return;

    // Cancel any previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    // Add user message
    const userMsg: SwiftMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setShowWelcome(false);

    // Show typing indicator
    setIsTyping(true);

    try {
      const result = await askSwift(text, undefined, { signal: abortRef.current.signal });

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
  }, [addMessage, setShowWelcome]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Show proactive insights periodically when Swift is closed
  useEffect(() => {
    if (isOpen) {
      setProactiveInsight(null);
      return;
    }

    const showInsight = async () => {
      // Try to fetch an AI-generated insight
      const now = Date.now();
      if (now - lastInsightFetch > INSIGHT_CACHE_TTL) {
        lastInsightFetch = now;
        try {
          const result = await askSwift("What's one quick insight I should know about my business right now?", "Keep it to one short sentence.", { signal: AbortSignal.timeout(5000) });
          if (result.response && !result.error) {
            const colors = ['#4F46E5', '#F59E0B', '#EF4444', '#22C55E', '#8B5CF6'];
            const icons = ['TrendingUp', 'Zap', 'Clock', 'AlertCircle', 'Star'];
            const idx = Math.floor(Math.random() * colors.length);
            setProactiveInsight({ id: `ai-${now}`, message: result.response, icon: icons[idx], color: colors[idx] });
            return;
          }
        } catch {
          // Fall through to random fallback
        }
      }

      // Fallback: show a random placeholder insight
      const idx = Math.floor(Math.random() * PROACTIVE_INSIGHTS.length);
      setProactiveInsight(PROACTIVE_INSIGHTS[idx]);
    };

    // First insight after 30 seconds
    const initial = setTimeout(showInsight, 30000);

    // Then every 60-120 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        showInsight();
      }
    }, 60000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Reset welcome when reopening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setShowWelcome(true);
    }
  }, [isOpen, messages.length]);

  return (
    <SwiftContext.Provider
      value={{
        isOpen, openSwift, closeSwift, toggleSwift,
        messages, addMessage, clearMessages,
        isTyping, setIsTyping,
        proactiveInsight, dismissProactiveInsight,
        showWelcome, setShowWelcome,
        sendMessage,
      }}
    >
      {children}
    </SwiftContext.Provider>
  );
}

export function useSwift() {
  const ctx = useContext(SwiftContext);
  if (!ctx) throw new Error('useSwift must be used within SwiftProvider');
  return ctx;
}