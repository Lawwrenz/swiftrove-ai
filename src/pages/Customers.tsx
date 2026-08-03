import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, ArrowLeft, Zap, TrendingUp, Clock, MessageSquare, Star,
  ShoppingCart, CheckCircle, FileText, Truck, XCircle, Gift, Users,
  Bot, Package, Crown, DollarSign, Activity, Sparkles, MapPin,
  Brain, Shield, Phone, ChevronRight, Fingerprint,
  BarChart3, Lightbulb,
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/ui';
import { CUSTOMER_INTELLIGENCE } from '../lib/constants';
import type { CustomerIntelligence, CustomerDNA, AIEvidence, NextBestAction, PredictiveInsight } from '../lib/constants';

function HealthBadge({ health }: { health: CustomerIntelligence['customerHealth'] }) {
  const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
    Excellent: { variant: 'success', label: 'Excellent' },
    Healthy: { variant: 'success', label: 'Healthy' },
    Growing: { variant: 'info', label: 'Growing' },
    'At Risk': { variant: 'warning', label: 'At Risk' },
    Churned: { variant: 'danger', label: 'Churned' },
  };
  const c = config[health];
  return <Badge variant={c.variant} dot>{c.label}</Badge>;
}

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#22C55E' : score >= 70 ? '#4F46E5' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

function DNAGauge({ value, label, color = '#4F46E5' }: { value: number; label: string; color?: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="72" height="72" className="transform -rotate-90">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="5" />
          <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-text-secondary text-center leading-tight max-w-[80px]">{label}</span>
    </div>
  );
}

function getTimelineIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    CheckCircle: <CheckCircle size={14} />, FileText: <FileText size={14} />,
    Truck: <Truck size={14} />, MessageSquare: <MessageSquare size={14} />,
    Star: <Star size={14} />, Clock: <Clock size={14} />,
    ShoppingCart: <ShoppingCart size={14} />, XCircle: <XCircle size={14} />,
    Gift: <Gift size={14} />, Users: <Users size={14} />,
  };
  return icons[iconName] || <Activity size={14} />;
}

const DNA_COLORS: Record<string, string> = {
  buyingFrequency: '#4F46E5', paymentReliability: '#22C55E', communicationEngagement: '#8B5CF6',
  loyalty: '#EC4899', upsellReadiness: '#F59E0B', customerSatisfaction: '#3B82F6',
};
const DNA_LABELS: Record<string, string> = {
  buyingFrequency: 'Buying Frequency', paymentReliability: 'Payment Reliability',
  communicationEngagement: 'Comm. Engagement', loyalty: 'Loyalty',
  upsellReadiness: 'Upsell Readiness', satisfaction: 'Satisfaction',
};

const EVIDENCE_CATEGORY_COLORS: Record<string, string> = { behavior: '#4F46E5', payment: '#22C55E', timing: '#F59E0B', social: '#8B5CF6' };
const EVIDENCE_ICONS: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart size={14} />, Clock: <Clock size={14} />, CheckCircle: <CheckCircle size={14} />,
  MessageSquare: <MessageSquare size={14} />, Users: <Users size={14} />, Star: <Star size={14} />,
};

const NODE_COLORS: Record<string, string> = { order: '#4F46E5', payment: '#22C55E', invoice: '#F59E0B', support: '#8B5CF6', agent: '#EC4899' };
const NODE_ICONS: Record<string, React.ReactNode> = {
  order: <Package size={12} />, payment: <DollarSign size={12} />,
  invoice: <FileText size={12} />, support: <MessageSquare size={12} />, agent: <Bot size={12} />,
};

function CustomerNetwork({ nodes }: { nodes: CustomerIntelligence['networkNodes'] }) {
  const w = 380, h = 220, cx = 190, cy = 110, radius = 75;
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (nodes.length === 0) return;
    const interval = setInterval(() => setActiveIdx((p) => (p + 1) % nodes.length), 2000);
    return () => clearInterval(interval);
  }, [nodes.length]);
  const positioned = nodes.map((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    return { ...node, x: cx + (node.type === 'agent' ? radius * 0.5 : radius) * Math.cos(angle), y: cy + (node.type === 'agent' ? radius * 0.5 : radius) * Math.sin(angle) };
  });
  const nodeMap = new Map(positioned.map((n) => [n.id, n]));
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[380px] mx-auto" style={{ minHeight: 220 }}>
        {positioned.map((node) => node.connections.map((connId) => {
          const target = nodeMap.get(connId);
          if (!target) return null;
          const isActive = node.id === nodes[activeIdx]?.id || connId === nodes[activeIdx]?.id;
          return <line key={`${node.id}-${connId}`} x1={node.x} y1={node.y} x2={target.x} y2={target.y}
            stroke={isActive ? NODE_COLORS[node.type] : '#CBD5E1'} strokeWidth={isActive ? 2.5 : 1.2}
            strokeDasharray={isActive ? 'none' : '4 3'} className="transition-all duration-500" />;
        }))}
        {positioned.map((node) => {
          const isActive = node.id === nodes[activeIdx]?.id;
          const r = node.type === 'agent' ? 20 : 16;
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={r} fill={isActive ? NODE_COLORS[node.type] : '#F8FAFC'}
                stroke={NODE_COLORS[node.type]} strokeWidth={isActive ? 3 : 1.5} className="transition-all duration-500" />
              {isActive && <circle cx={node.x} cy={node.y} r={r} fill="none" stroke={NODE_COLORS[node.type]} strokeWidth={2} className="animate-pulse-glow" />}
              <foreignObject x={node.x - r / 2} y={node.y - r / 2} width={r} height={r}>
                <div className="flex items-center justify-center w-full h-full" style={{ color: isActive ? '#FFF' : NODE_COLORS[node.type] }}>{NODE_ICONS[node.type]}</div>
              </foreignObject>
              <text x={node.x} y={node.y + r + 12} textAnchor="middle" className="text-[9px] fill-text-secondary font-medium">
                {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function AIExecutiveSummary({ summary, customer }: { summary: string; customer: CustomerIntelligence }) {
  return (
    <Card padding="lg" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Executive Summary</h3>
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Prepared by Swift AI — {customer.overallAIConfidence}% confidence</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-white ring-1 ring-indigo-100/50">
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Recent Activity', value: `${customer.timeline.length} events`, color: '#4F46E5' },
            { label: 'Total Orders', value: `${customer.totalOrders} orders`, color: '#22C55E' },
            { label: 'Lifetime Value', value: customer.lifetimeValueLabel, color: '#F59E0B' },
            { label: 'Member Since', value: customer.memberSince, color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-lg p-3 ring-1 ring-border text-center">
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">{s.label}</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function CustomerDNASection({ dna }: { dna: CustomerDNA }) {
  const keys = Object.keys(dna) as (keyof CustomerDNA)[];
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Customer DNA</h3>
        <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full">Behavioral Profile</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {keys.map((key) => (
          <DNAGauge key={key} value={dna[key]} label={DNA_LABELS[key] || key} color={DNA_COLORS[key] || '#4F46E5'} />
        ))}
      </div>
    </Card>
  );
}

function CustomerTimeline({ timeline }: { timeline: CustomerIntelligence['timeline'] }) {
  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Customer 360 Timeline</h3>
        </div>
        <span className="text-[10px] font-medium text-text-secondary">{timeline.length} events</span>
      </div>
      <div className="p-5 space-y-0 max-h-[340px] overflow-y-auto">
        {timeline.map((event, idx) => (
          <div key={event.id} className="flex gap-3 relative pb-4 last:pb-0 animate-fade-in-up" style={{ animationDelay: `${idx * 0.04}s` }}>
            {idx < timeline.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200" />}
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10" style={{ backgroundColor: `${event.color}18` }}>
              <span style={{ color: event.color }}>{getTimelineIcon(event.icon)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">{event.description}</p>
              <p className="text-[10px] text-muted mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActiveWorkflow({ stages }: { stages: CustomerIntelligence['activeWorkflowStages'] }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Active AI Workflow</h3>
      </div>
      <div className="space-y-0">
        {stages.map((stage, i) => {
          const isDone = stage.completed;
          const isActive = stage.active;
          return (
            <div key={stage.label} className="flex items-center gap-3 py-2.5 relative">
              {i < stages.length - 1 && (
                <div className={`absolute left-[11px] top-10 bottom-0 w-0.5 ${isDone ? 'bg-emerald-200' : 'bg-slate-200'}`} />
              )}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                isDone ? 'bg-emerald-100 text-emerald-600' :
                isActive ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300 animate-pulse-dot' :
                'bg-slate-100 text-slate-400'
              }`}>
                {isDone ? <CheckCircle size={13} /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isDone ? 'text-foreground' : 'text-slate-400'}`}>{stage.label}</p>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-indigo-50 text-indigo-700">
                      <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 animate-pulse-dot" />In Progress
                    </span>
                  )}
                </div>
                {stage.agent && <p className={`text-[10px] ${isDone ? 'text-text-secondary' : 'text-muted'}`}>{isDone ? 'Completed by' : 'Assigned to'} {stage.agent}</p>}
              </div>
              {isDone && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PredictiveInsights({ insights }: { insights: PredictiveInsight[] }) {
  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Predictive Insights</h3>
        <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full">AI Forecasts</span>
      </div>
      <div className="p-5 space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150 animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: insight.color }} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{insight.label}</p>
                <p className="text-[11px] text-text-secondary">{insight.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <span className="text-[10px] font-bold" style={{ color: insight.confidence >= 90 ? '#22C55E' : insight.confidence >= 75 ? '#F59E0B' : '#EF4444' }}>{insight.confidence}%</span>
              <span className="text-[9px] text-muted">conf.</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AIEvidencePanel({ evidence }: { evidence: AIEvidence[] }) {
  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Shield size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Why Swift AI believes this</h3>
        <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full">{evidence.length} sources</span>
      </div>
      <div className="p-5 space-y-2">
        {evidence.map((ev, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors duration-150 animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${EVIDENCE_CATEGORY_COLORS[ev.category] || '#4F46E5'}12` }}>
              <span style={{ color: EVIDENCE_CATEGORY_COLORS[ev.category] || '#4F46E5' }}>{EVIDENCE_ICONS[ev.icon] || <Activity size={14} />}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-foreground">{ev.label}</p>
                <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{
                  backgroundColor: `${EVIDENCE_CATEGORY_COLORS[ev.category] || '#4F46E5'}15`,
                  color: EVIDENCE_CATEGORY_COLORS[ev.category] || '#4F46E5',
                }}>{ev.category}</span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NextBestActions({ actions }: { actions: NextBestAction[] }) {
  const PRIORITY_COLORS: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#4F46E5' };
  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Lightbulb size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Next Best Actions</h3>
        <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full">AI Recommended</span>
      </div>
      <div className="p-5 space-y-2">
        {actions.map((action, i) => (
          <div key={i} className="group p-3 rounded-lg hover:bg-surface-hover transition-all duration-200 animate-fade-in-up cursor-pointer" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" style={{
                backgroundColor: action.priority === 'high' ? '#FEF2F2' : action.priority === 'medium' ? '#FFFBEB' : '#EEF2FF',
              }}>
                <span style={{ color: PRIORITY_COLORS[action.priority] }}><Zap size={14} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{action.title}</p>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{
                    backgroundColor: action.priority === 'high' ? '#FEF2F2' : action.priority === 'medium' ? '#FFFBEB' : '#EEF2FF',
                    color: PRIORITY_COLORS[action.priority],
                  }}>{action.priority}</span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{action.explanation}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <BarChart3 size={10} className="text-muted" />
                  <span className="text-[10px] font-medium text-text-secondary">{action.impact}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Customers() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname, selectedId]);

  // Handle quick action navigation from Dashboard
  useEffect(() => {
    if (location.state?.openAddCustomer) {
      window.history.replaceState({}, document.title);
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [location.state]);

  const customers = useMemo(() => {
    let filtered = CUSTOMER_INTELLIGENCE;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.latestOrder.toLowerCase().includes(q) || c.aiStatus.toLowerCase().includes(q) || c.preferredChannel.toLowerCase().includes(q));
    }
    if (healthFilter !== 'all') filtered = filtered.filter((c) => c.customerHealth === healthFilter);
    return filtered.sort((a, b) => b.relationshipScore - a.relationshipScore);
  }, [search, healthFilter]);

  const selectedCustomer = useMemo(() => CUSTOMER_INTELLIGENCE.find((c) => c.id === selectedId) || null, [selectedId]);

  if (!selectedCustomer) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Customer Intelligence 360°</h1>
              <p className="section-subtitle">Understand customer behavior, predict future outcomes and take smarter actions with AI.</p>
            </div>
          </div>
          <span className="text-xs text-text-secondary">{customers.length} customers</span>
        </div>

        <Card padding="sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search customers by name, email, status, or channel..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                ref={searchInputRef}
                className="search-input pl-10" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'Excellent', 'Healthy', 'Growing', 'At Risk', 'Churned'].map((h) => (
                <button key={h} onClick={() => setHealthFilter(h)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${healthFilter === h ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
                  {h === 'all' ? 'All' : h}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {customers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {customers.map((customer, idx) => (
              <button key={customer.id} onClick={() => setSelectedId(customer.id)}
                className="bg-card rounded-xl shadow-sm ring-1 ring-border p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.03}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={customer.avatar} size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-foreground">{customer.name}</h3>
                        {customer.isVIP && <Crown size={13} className="text-amber-500" />}
                      </div>
                      <p className="text-xs text-text-secondary">{customer.email}</p>
                    </div>
                  </div>
                  <ScoreRing score={customer.relationshipScore} size={40} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <HealthBadge health={customer.customerHealth} />
                  <span className="text-xs text-text-secondary">·</span>
                  <span className="text-xs text-text-secondary truncate">{customer.latestOrder}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-xs text-text-secondary">
                  <Bot size={12} className="text-primary shrink-0" />
                  <span className="truncate">{customer.aiStatus}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <DollarSign size={11} className="text-emerald-500" />
                    <span className="font-medium text-foreground">{customer.lifetimeValueLabel}</span>
                    <span>LTV</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <MessageSquare size={11} className="text-indigo-400" />
                    <span>{customer.preferredChannel}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-muted mb-4"><Search size={24} /></div>
              <h3 className="text-base font-semibold text-foreground mb-1">No customers found</h3>
              <p className="text-sm text-text-secondary max-w-sm mb-6">
                {search ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'No customers match the selected health filter.'}
              </p>
              <Button variant="primary" size="sm" onClick={() => { setSearch(''); setHealthFilter('all'); }}>Clear Filters</Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const c = selectedCustomer;

  return (
    <div className="animate-fade-in-up space-y-6 pb-6">
      <button onClick={() => setSelectedId(null)}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground transition-colors duration-150 cursor-pointer group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to all customers
      </button>

      {/* ── Customer Detail Hero ── */}
      <div className="hero-gradient p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="hero-icon">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="hero-label">Customer Intelligence 360°</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex items-center gap-4">
              <Avatar initials={c.avatar} size="xl" className="ring-2 ring-white/30 shadow-xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{c.name}</h2>
                  {c.isVIP && <Badge variant="warning" size="sm"><Crown size={10} className="mr-0.5" /> VIP</Badge>}
                </div>
                <p className="text-sm text-indigo-200">{c.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-indigo-200 text-xs"><Phone size={11} /><span>{c.phone}</span></div>
                  <div className="flex items-center gap-1 text-indigo-200 text-xs"><MapPin size={11} /><span className="truncate max-w-[180px]">{c.location}</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:ml-auto flex-wrap">
              <div className="text-center">
                <ScoreRing score={c.relationshipScore} size={56} />
                <p className="text-[10px] text-indigo-200 mt-1 font-medium">Relationship</p>
              </div>
              <div className="text-left">
                <HealthBadge health={c.customerHealth} />
                <p className="text-[10px] text-indigo-200 mt-1 font-medium">Health</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">{c.lifetimeValueLabel}</p>
                <p className="text-[10px] text-indigo-200 font-medium">Lifetime Value</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">{c.overallAIConfidence}%</p>
                <p className="text-[10px] text-indigo-200 font-medium">AI Confidence</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">Finance Verification</p>
                <p className="text-[10px] text-indigo-200 font-medium">Current Workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Executive Summary ── */}
      <AIExecutiveSummary summary={c.aiSummary} customer={c} />

      {/* ── DNA + Workflow + Timeline (left) | Insights (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerDNASection dna={c.customerDNA} />
          <ActiveWorkflow stages={c.activeWorkflowStages} />
          <CustomerTimeline timeline={c.timeline} />
        </div>
        <div className="space-y-6">
          <PredictiveInsights insights={c.predictiveInsights} />
        </div>
      </div>

      {/* ── AI Evidence ── */}
      <AIEvidencePanel evidence={c.aiEvidence} />

      {/* ── Next Best Actions ── */}
      <NextBestActions actions={c.nextBestActions} />

      {/* ── Customer Knowledge Graph ── */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Customer Knowledge Graph</h3>
            <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-full">{c.networkNodes.length} connected nodes</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <CustomerNetwork nodes={c.networkNodes} />
            <div className="space-y-2.5 shrink-0">
              {(['order', 'payment', 'invoice', 'support', 'agent'] as const).map((type) => (
                <div key={type} className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: NODE_COLORS[type] }} />
                  <span className="text-xs font-medium text-text-secondary capitalize">{type}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="text-[10px] text-muted">Animated nodes pulse every 2 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}