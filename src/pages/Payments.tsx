import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  TrendingUp, Shield, AlertCircle, CheckCircle, Clock,
  Search, FileText, Bot,
  Sparkles, BarChart3, BrainCircuit,
  Handshake, RefreshCw, ArrowUpRight, ArrowDownRight,
  ChevronRight, Network,
  Eye, Ban,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from 'recharts';
import { Card, Badge, Button, Avatar } from '../components/ui';

// ============================================================================
// Types
// ============================================================================
interface RiskItem {
  id: string;
  label: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  suggestedAction: string;
  icon: LucideIcon;
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  impact: string;
  confidence: number;
  icon: LucideIcon;
  color: string;
}

interface TimelineEvent {
  id: string;
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  time: string;
}

interface KnowledgeNode {
  id: string;
  label: string;
  type: 'payment' | 'invoice' | 'customer' | 'order' | 'agent' | 'revenue';
  connections: string[];
  x?: number;
  y?: number;
}

// ============================================================================
// Inline data for the Finance Intelligence Center
// ============================================================================
const FINANCIAL_SUMMARY = {
  greeting: 'Good Evening, Lawrence',
  paymentsReceived: 12,
  invoicesVerified: 8,
  outstandingInvoices: 3,
  cashFlowOutlook: 'Positive — you have sufficient runway for the next 2 weeks. Your outstanding invoices total ₦680,000 which, once collected, will cover upcoming supplier payments.',
  highestPriority: 'Follow up on Adaobi Nwosu\'s ₦450,000 wedding cake payment — pending since July 23rd.',
};

const FINANCIAL_HEALTH = {
  score: 96,
  label: 'Excellent',
  metrics: [
    { label: 'Payment Success Rate', value: '94%', trend: 'up', change: '+2%' },
    { label: 'Outstanding Invoices', value: '₦680K', trend: 'down', change: '-12%' },
    { label: 'Cash Flow Stability', value: '88%', trend: 'up', change: '+5%' },
    { label: 'Revenue Growth', value: '₦2.4M', trend: 'up', change: '+18%' },
    { label: 'AI Confidence', value: '96%', trend: 'up', change: '+1%' },
  ],
};

const CASH_FLOW_DATA = {
  todayReceived: '₦280,000',
  expectedIncoming: '₦680,000',
  upcomingPayouts: '₦145,000',
  weeklyTrend: [
    { day: 'Mon', received: 45000, expected: 120000 },
    { day: 'Tue', received: 85000, expected: 95000 },
    { day: 'Wed', received: 120000, expected: 140000 },
    { day: 'Thu', received: 28000, expected: 110000 },
    { day: 'Fri', received: 0, expected: 68000 },
    { day: 'Sat', received: 0, expected: 45000 },
    { day: 'Sun', received: 0, expected: 25000 },
  ],
  monthlyForecast: [
    { month: 'Feb', actual: 1200000, forecast: 1150000 },
    { month: 'Mar', actual: 1450000, forecast: 1400000 },
    { month: 'Apr', actual: 1100000, forecast: 1200000 },
    { month: 'May', actual: 1680000, forecast: 1550000 },
    { month: 'Jun', actual: 1900000, forecast: 1800000 },
    { month: 'Jul', actual: 2100000, forecast: 2000000 },
  ],
};

const VERIFIED_PAYMENTS = [
  {
    id: 'VP1',
    customer: 'Grace Eze',
    order: '#1048',
    amount: '₦185,000',
    status: 'Verified',
    confidence: 98,
    evidence: [
      'Reference matched',
      'Expected amount confirmed',
      'Payment window matched',
    ],
  },
  {
    id: 'VP2',
    customer: 'Amaka Bello',
    order: '#1047',
    amount: '₦95,000',
    status: 'Verified',
    confidence: 97,
    evidence: [
      'Reference matched',
      'Expected amount confirmed',
      'Customer validated',
    ],
  },
  {
    id: 'VP3',
    customer: 'Kofi Asante',
    order: '#1049',
    amount: '₦35,000',
    status: 'Pending',
    confidence: 72,
    evidence: [
      'Reference matched',
      'Awaiting bank confirmation',
    ],
  },
];

const REVENUE_FORECAST = {
  next7Days: { revenue: '₦385,000', confidence: 85 },
  next30Days: { revenue: '₦2,150,000', confidence: 78 },
  expectedGrowth: '+18%',
};

const RISK_ITEMS: RiskItem[] = [
  {
    id: 'R1', label: 'Invoice likely to become overdue',
    severity: 'critical', confidence: 92,
    suggestedAction: 'Send payment reminder to Adaobi Nwosu',
    icon: AlertCircle, color: '#EF4444',
  },
  {
    id: 'R2', label: 'Large payment awaiting confirmation',
    severity: 'high', confidence: 88,
    suggestedAction: 'Contact bank to verify ₦450,000 transfer',
    icon: Clock, color: '#F59E0B',
  },
  {
    id: 'R3', label: 'Duplicate payment risk detected',
    severity: 'medium', confidence: 76,
    suggestedAction: 'Review recent payment entries for duplicates',
    icon: Ban, color: '#4F46E5',
  },
  {
    id: 'R4', label: 'Healthy cash flow — no action needed',
    severity: 'low', confidence: 95,
    suggestedAction: 'Continue monitoring',
    icon: Shield, color: '#22C55E',
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'RC1', title: 'Follow up overdue invoice',
    reason: 'Adaobi Nwosu\'s ₦450,000 payment is 2 days overdue.',
    impact: 'Recover ₦450,000', confidence: 92,
    icon: AlertCircle, color: '#EF4444',
  },
  {
    id: 'RC2', title: 'Prepare weekly finance report',
    reason: 'End of week — auto-generate AI summary for stakeholders.',
    impact: 'Save 2 hours', confidence: 95,
    icon: FileText, color: '#4F46E5',
  },
  {
    id: 'RC3', title: 'Offer installment plan',
    reason: 'Tolu Adebayo\'s payment failed — offer flexible payment option.',
    impact: 'Retain customer', confidence: 78,
    icon: Handshake, color: '#F59E0B',
  },
  {
    id: 'RC4', title: 'Review high-value pending order',
    reason: 'Pending ₦450K wedding cake order needs confirmation.',
    impact: 'Secure revenue', confidence: 88,
    icon: Eye, color: '#8B5CF6',
  },
  {
    id: 'RC5', title: 'Increase inventory for popular products',
    reason: 'Sales Agent reports 3 new corporate orders this week.',
    impact: 'Meet demand', confidence: 84,
    icon: TrendingUp, color: '#22C55E',
  },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'FT1', icon: CheckCircle, color: '#22C55E', title: 'Payment received', description: 'Grace Eze — ₦185,000 verified via bank transfer.', time: '2 hours ago' },
  { id: 'FT2', icon: FileText, color: '#4F46E5', title: 'Invoice generated', description: 'Invoice #1050 for corporate dessert package — ₦95,000.', time: '3 hours ago' },
  { id: 'FT3', icon: Bot, color: '#8B5CF6', title: 'Finance Agent verified payment', description: 'Amaka Bello — ₦95,000 verified automatically.', time: '4 hours ago' },
  { id: 'FT4', icon: BarChart3, color: '#F59E0B', title: 'Revenue forecast updated', description: 'Next 30 days: ₦2,150,000 expected at 78% confidence.', time: '6 hours ago' },
  { id: 'FT5', icon: Clock, color: '#64748B', title: 'Reminder scheduled', description: 'Follow-up reminder set for Adaobi Nwosu\'s overdue payment.', time: '8 hours ago' },
];

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'KN1', label: 'Payments', type: 'payment', connections: ['KN2', 'KN3', 'KN6'] },
  { id: 'KN2', label: 'Invoices', type: 'invoice', connections: ['KN1', 'KN3', 'KN4'] },
  { id: 'KN3', label: 'Customers', type: 'customer', connections: ['KN1', 'KN2', 'KN4'] },
  { id: 'KN4', label: 'Orders', type: 'order', connections: ['KN2', 'KN3', 'KN5'] },
  { id: 'KN5', label: 'Finance Agent', type: 'agent', connections: ['KN1', 'KN4', 'KN6'] },
  { id: 'KN6', label: 'Revenue', type: 'revenue', connections: ['KN1', 'KN5'] },
];

const SEARCH_SUGGESTIONS = [
  'Show unpaid invoices',
  'Payments today',
  'Revenue forecast',
  'Large transactions',
  'Overdue payments',
];

// ============================================================================
// Animated Counter
// ============================================================================
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => { animate(); }, [animate]);

  return <span>{prefix}{count}{suffix}</span>;
}

// ============================================================================
// Risk Severity Badge
// ============================================================================
function RiskBadge({ severity }: { severity: RiskItem['severity'] }) {
  const config = {
    critical: { label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
    high: { label: 'High', color: '#F59E0B', bg: '#FFFBEB' },
    medium: { label: 'Medium', color: '#4F46E5', bg: '#EEF2FF' },
    low: { label: 'Low', color: '#22C55E', bg: '#F0FDF4' },
  };
  const c = config[severity];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {severity === 'critical' && <AlertCircle size={10} />}
      {c.label}
    </span>
  );
}

// ============================================================================
// Knowledge Graph Component
// ============================================================================
function KnowledgeGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimPhase((p) => (p + 1) % 60), 300);
    return () => clearInterval(t);
  }, []);

  const nodePositions: Record<string, { x: number; y: number }> = {
    KN1: { x: 50, y: 50 },
    KN2: { x: 20, y: 72 },
    KN3: { x: 80, y: 72 },
    KN4: { x: 50, y: 92 },
    KN5: { x: 20, y: 50 },
    KN6: { x: 80, y: 50 },
  };

  const nodeColors: Record<string, string> = {
    payment: '#4F46E5',
    invoice: '#F59E0B',
    customer: '#22C55E',
    order: '#8B5CF6',
    agent: '#EF4444',
    revenue: '#06B6D4',
  };

  const nodeTypes: Record<string, string> = {
    KN1: 'Payments', KN2: 'Invoices', KN3: 'Customers',
    KN4: 'Orders', KN5: 'Finance Agent', KN6: 'Revenue',
  };

  const svgW = 100, svgH = 100;

  return (
    <div className="relative w-full h-[220px]">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" aria-label="Finance knowledge graph showing relationships between payments, invoices, customers, orders, finance agent and revenue">
        {/* Connection lines */}
        {KNOWLEDGE_NODES.flatMap((node) =>
          node.connections.map((connId) => {
            const from = nodePositions[node.id];
            const to = nodePositions[connId];
            if (!from || !to) return null;
            const isActive = hoveredNode === node.id || hoveredNode === connId;
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isActive ? '#4F46E5' : '#E2E8F0'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? 'none' : '4,3'}
                className="transition-all duration-300"
              />
            );
          })
        )}

        {/* Animated flow dots */}
        {KNOWLEDGE_NODES.flatMap((node) =>
          node.connections.map((connId, idx) => {
            const from = nodePositions[node.id];
            const to = nodePositions[connId];
            if (!from || !to) return null;
            const progress = ((animPhase + idx * 10) % 60) / 60;
            const x = from.x + (to.x - from.x) * progress;
            const y = from.y + (to.y - from.y) * progress;
            return (
              <circle
                key={`dot-${node.id}-${connId}`}
                cx={x} cy={y} r={1.5}
                fill="#4F46E5"
                opacity={0.6}
              />
            );
          })
        )}

        {/* Nodes */}
        {KNOWLEDGE_NODES.map((node) => {
          const pos = nodePositions[node.id];
          const isHovered = hoveredNode === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-200"
              role="img"
              aria-label={`${nodeTypes[node.id]} node`}
            >
              <circle
                cx={pos.x} cy={pos.y} r={isHovered ? 7 : 5.5}
                fill={nodeColors[node.type]}
                opacity={isHovered ? 1 : 0.85}
                className="transition-all duration-200"
              />
              {isHovered && (
                <text
                  x={pos.x} y={pos.y - 10}
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="4"
                  fontWeight="600"
                  className="font-sans"
                >
                  {nodeTypes[node.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================================
// Finance Intelligence Search
// ============================================================================
function FinanceSearch() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = SEARCH_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search financial data..."
          className="search-input pl-10"
          aria-label="Search financial data"
        />
      </div>
      {showSuggestions && query && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-xl shadow-lg ring-1 ring-border border border-border overflow-hidden z-20">
          {filtered.length > 0 ? (
            filtered.map((s) => (
              <button
                key={s}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer text-left"
                onMouseDown={() => { setQuery(s); setShowSuggestions(false); }}
              >
                <Search size={14} className="text-muted shrink-0" />
                {s}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-text-secondary">
              No results found. Try "unpaid invoices" or "payments today".
            </div>
          )}
        </div>
      )}
      {!query && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {SEARCH_SUGGESTIONS.slice(0, 3).map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-surface text-[11px] text-text-secondary hover:bg-surface-hover hover:text-foreground transition-colors duration-150 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================
export default function Payments() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* ===== Page Header ===== */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finance Intelligence Center</h1>
          <p className="section-subtitle">
            Understand your financial performance, predict cash flow and automate payment operations with AI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />}>
            Sync
          </Button>
          <Button variant="primary" size="sm" icon={<FileText size={14} />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* ===== AI Financial Brief ===== */}
      <div className="hero-gradient p-6 lg:p-8">
        <div className="hero-pattern" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="hero-icon">
              <BrainCircuit size={18} className="text-white" />
            </div>
            <span className="hero-label">AI Financial Briefing</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            {greeting}, Lawrence.
          </h2>

          <div className="mt-5 p-5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">Payments Received</p>
                    <p className="text-lg font-bold text-white mt-1">{FINANCIAL_SUMMARY.paymentsReceived}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">Invoices Verified</p>
                    <p className="text-lg font-bold text-white mt-1">{FINANCIAL_SUMMARY.invoicesVerified}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-wider">Outstanding</p>
                    <p className="text-lg font-bold text-white mt-1">{FINANCIAL_SUMMARY.outstandingInvoices}</p>
                  </div>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  {FINANCIAL_SUMMARY.cashFlowOutlook}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/15 ring-1 ring-amber-500/20">
                  <AlertCircle size={16} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-200 uppercase tracking-wider">Highest Priority</p>
                    <p className="text-sm text-amber-100 mt-0.5">{FINANCIAL_SUMMARY.highestPriority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-300" />
                  <span className="text-xs text-indigo-200">Swift AI processed 18 financial operations today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Financial Health Score ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 animate-fade-in-up">
          <div className="flex flex-col items-center text-center py-2">
            <div className="relative mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#4F46E5" strokeWidth="6"
                  strokeDasharray={`${(96 / 100) * 326.7} 326.7`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  <AnimatedCounter value={96} />
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  Excellent
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">Financial Health</p>
            <p className="text-xs text-text-secondary mt-1">AI-powered assessment</p>
          </div>
        </Card>

        <Card className="lg:col-span-2 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Supporting Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FINANCIAL_HEALTH.metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-lg bg-surface">
                <p className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">{m.label}</p>
                <p className="text-lg font-bold text-foreground mt-1">{m.value}</p>
                <div className={`inline-flex items-center gap-1 text-[11px] font-medium mt-1 ${
                  m.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {m.change}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== Cash Flow ===== */}
      <Card className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Cash Flow</h3>
            <p className="text-xs text-text-secondary mt-0.5">Real-time financial movement</p>
          </div>
          <Badge variant="info" size="sm" dot>Live</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <p className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Money Received Today</p>
            <p className="text-xl font-bold text-emerald-800 mt-1">{CASH_FLOW_DATA.todayReceived}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <p className="text-[10px] font-medium text-indigo-700 uppercase tracking-wider">Expected Incoming</p>
            <p className="text-xl font-bold text-indigo-800 mt-1">{CASH_FLOW_DATA.expectedIncoming}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50">
            <p className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">Upcoming Payouts</p>
            <p className="text-xl font-bold text-amber-800 mt-1">{CASH_FLOW_DATA.upcomingPayouts}</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CASH_FLOW_DATA.weeklyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, undefined]}
              />
              <Area type="monotone" dataKey="expected" stroke="#22C55E" strokeWidth={2} fill="url(#expectedGrad)" name="Expected" />
              <Area type="monotone" dataKey="received" stroke="#4F46E5" strokeWidth={2} fill="url(#receivedGrad)" name="Received" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ===== AI Payment Verification + Revenue Forecast ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Payment Verification */}
        <Card className="lg:col-span-2 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Payment Verification</h3>
              <p className="text-xs text-text-secondary mt-0.5">Intelligent payment validation</p>
            </div>
            <Badge variant="success" size="sm" dot>Active</Badge>
          </div>

          <div className="space-y-3">
            {VERIFIED_PAYMENTS.map((vp) => (
              <div
                key={vp.id}
                className="p-4 rounded-xl bg-surface hover:bg-card hover:shadow-md transition-all duration-200 border border-transparent hover:border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={vp.customer.split(' ').map((n) => n[0]).join('')} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{vp.customer}</p>
                      <p className="text-xs text-text-secondary">{vp.order} · {vp.amount}</p>
                    </div>
                  </div>
                  <Badge
                    variant={vp.status === 'Verified' ? 'success' : 'warning'}
                    dot
                    size="sm"
                  >
                    {vp.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${vp.confidence}%`,
                        backgroundColor: vp.confidence >= 90 ? '#22C55E' : vp.confidence >= 70 ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-text-secondary">{vp.confidence}% confidence</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {vp.evidence.map((e, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card text-[10px] font-medium text-text-secondary ring-1 ring-border"
                    >
                      <CheckCircle size={10} className="text-emerald-500" />
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue Forecast */}
        <Card className="animate-fade-in-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Forecast</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <p className="text-[10px] font-medium text-indigo-700 uppercase tracking-wider">Next 7 Days</p>
              <p className="text-2xl font-bold text-indigo-800 mt-1">{REVENUE_FORECAST.next7Days.revenue}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex-1 h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${REVENUE_FORECAST.next7Days.confidence}%` }} />
                </div>
                <span className="text-[11px] font-medium text-indigo-600">{REVENUE_FORECAST.next7Days.confidence}%</span>
              </div>
              <p className="text-[11px] text-indigo-500 mt-1">AI Confidence</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <p className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Next 30 Days</p>
              <p className="text-2xl font-bold text-emerald-800 mt-1">{REVENUE_FORECAST.next30Days.revenue}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex-1 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${REVENUE_FORECAST.next30Days.confidence}%` }} />
                </div>
                <span className="text-[11px] font-medium text-emerald-600">{REVENUE_FORECAST.next30Days.confidence}%</span>
              </div>
              <p className="text-[11px] text-emerald-500 mt-1">AI Confidence</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50">
              <p className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">Expected Growth</p>
              <p className="text-2xl font-bold text-amber-800 mt-1">{REVENUE_FORECAST.expectedGrowth}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={14} className="text-amber-500" />
                <span className="text-[11px] text-amber-600">Month-over-month</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CASH_FLOW_DATA.monthlyForecast} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, undefined]}
                  />
                  <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Actual" />
                  <Bar dataKey="forecast" fill="#A5B4FC" radius={[4, 4, 0, 0]} name="Forecast" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-text-secondary text-center mt-1">Monthly revenue trend (Actual vs Forecast)</p>
          </div>
        </Card>
      </div>

      {/* ===== Financial Risk Monitor + AI Recommendations ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Risk Monitor */}
        <Card className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Financial Risk Monitor</h3>
              <p className="text-xs text-text-secondary mt-0.5">AI-powered risk detection</p>
            </div>
            <Badge variant="warning" size="sm" dot>Monitoring</Badge>
          </div>

          <div className="space-y-3" aria-live="polite" aria-atomic="true">
            {RISK_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface hover:bg-card hover:shadow-sm transition-all duration-200"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <RiskBadge severity={item.severity} />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-text-secondary">
                      <span className="font-medium">Confidence:</span> {item.confidence}%
                    </span>
                    <span className="text-[11px] text-primary font-medium">
                      {item.suggestedAction}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
              <p className="text-xs text-text-secondary mt-0.5">Smart actions for your business</p>
            </div>
            <Badge variant="info" size="sm" dot>AI Powered</Badge>
          </div>

          <div className="space-y-2">
            {RECOMMENDATIONS.map((rec) => (
              <button
                key={rec.id}
                className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface hover:bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${rec.color}15` }}
                >
                  <rec.icon size={16} style={{ color: rec.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                    <ChevronRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{rec.reason}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] font-medium text-primary">{rec.impact}</span>
                    <span className="text-[11px] text-text-secondary">{rec.confidence}% confidence</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== Finance Timeline + Knowledge Graph ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finance Timeline */}
        <Card className="lg:col-span-2 animate-fade-in-up" padding="none">
          <Card header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Finance Timeline</h3>
                <p className="text-xs text-text-secondary mt-0.5">Chronological activity feed</p>
              </div>
              <Badge variant="info" size="sm" dot>Live</Badge>
            </div>
          }>
            <div className="px-6 py-4">
              <div className="relative space-y-0">
                {TIMELINE_EVENTS.map((event, idx) => (
                  <div key={event.id} className="flex gap-4 pb-5 relative last:pb-0">
                    {idx < TIMELINE_EVENTS.length - 1 && (
                      <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
                    )}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-card"
                      style={{ backgroundColor: `${event.color}15` }}
                    >
                      <event.icon size={16} style={{ color: event.color }} />
                    </div>
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

        {/* Finance Knowledge Graph */}
        <Card className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Finance Knowledge Graph</h3>
              <p className="text-xs text-text-secondary mt-0.5">Entity relationships</p>
            </div>
            <Network size={16} className="text-muted" />
          </div>
          <KnowledgeGraph />
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries({
              payment: '#4F46E5', invoice: '#F59E0B', customer: '#22C55E',
              order: '#8B5CF6', agent: '#EF4444', revenue: '#06B6D4',
            }).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-medium text-text-secondary capitalize">{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== Search ===== */}
      <Card className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Search size={15} className="text-muted" />
          <h3 className="text-sm font-semibold text-foreground">Financial Search</h3>
        </div>
        <FinanceSearch />
      </Card>
    </div>
  );
}