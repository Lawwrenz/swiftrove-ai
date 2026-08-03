import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Sparkles, ChevronRight, Brain, Users, ShoppingCart, FileText,
  CreditCard, Package, Bot, DollarSign, Handshake, MessageSquare,
  ArrowRight, Network, Activity, Zap, TrendingUp, Shield, Layers,
  X, Lightbulb, Target, CheckCircle, ArrowUpRight,
  Clock, AlertCircle, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// ============================================================================
// Types
// ============================================================================

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'orchestrator' | 'entity' | 'agent';
  x: number;
  y: number;
  color: string;
  icon: string;
  size: number;
  description?: string;
  score?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  strength: number;
}

interface AIInsight {
  id: string;
  message: string;
  confidence: number;
  evidence: string;
  icon: LucideIcon;
  color: string;
  category: string;
}

interface BusinessMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
}

// ============================================================================
// Data
// ============================================================================

const NODES: GraphNode[] = [
  { id: 'lawrence', label: 'Lawrence Ezealor', type: 'person', x: 450, y: 340, color: '#4F46E5', icon: 'User', size: 52, description: 'Business Owner & Admin', score: 100 },
  { id: 'orchestrator', label: 'Swift AI Orchestrator', type: 'orchestrator', x: 450, y: 180, color: '#8B5CF6', icon: 'Brain', size: 44, description: 'Central AI Intelligence Layer', score: 99 },
  { id: 'customers', label: 'Customers', type: 'entity', x: 220, y: 140, color: '#3B82F6', icon: 'Users', size: 38, description: '15 active customer profiles', score: 95 },
  { id: 'orders', label: 'Orders', type: 'entity', x: 680, y: 140, color: '#F59E0B', icon: 'ShoppingCart', size: 38, description: '342 total orders processed', score: 94 },
  { id: 'invoices', label: 'Invoices', type: 'entity', x: 120, y: 340, color: '#22C55E', icon: 'FileText', size: 38, description: 'Automated invoice generation', score: 92 },
  { id: 'payments', label: 'Payments', type: 'entity', x: 780, y: 340, color: '#14B8A6', icon: 'CreditCard', size: 38, description: '₦8.29M total revenue processed', score: 96 },
  { id: 'products', label: 'Products', type: 'entity', x: 220, y: 540, color: '#EC4899', icon: 'Package', size: 38, description: '25 bakery product SKUs', score: 90 },
  { id: 'sales-agent', label: 'Sales Agent', type: 'agent', x: 340, y: 540, color: '#4F46E5', icon: 'TrendingUp', size: 36, description: 'Lead generation & conversion', score: 98 },
  { id: 'finance-agent', label: 'Finance Agent', type: 'agent', x: 450, y: 500, color: '#22C55E', icon: 'DollarSign', size: 36, description: 'Payment & financial management', score: 99 },
  { id: 'cs-agent', label: 'Customer Success Agent', type: 'agent', x: 560, y: 540, color: '#8B5CF6', icon: 'Handshake', size: 36, description: 'Support & retention', score: 97 },
  { id: 'communications', label: 'Communications', type: 'entity', x: 680, y: 540, color: '#F97316', icon: 'MessageSquare', size: 36, description: 'WhatsApp, Email & SMS channels', score: 88 },
];

const EDGES: GraphEdge[] = [
  { source: 'orchestrator', target: 'lawrence', strength: 0.9 },
  { source: 'orchestrator', target: 'customers', strength: 0.8 },
  { source: 'orchestrator', target: 'orders', strength: 0.8 },
  { source: 'orchestrator', target: 'invoices', strength: 0.7 },
  { source: 'orchestrator', target: 'payments', strength: 0.8 },
  { source: 'orchestrator', target: 'products', strength: 0.7 },
  { source: 'orchestrator', target: 'sales-agent', strength: 0.9 },
  { source: 'orchestrator', target: 'finance-agent', strength: 0.9 },
  { source: 'orchestrator', target: 'cs-agent', strength: 0.9 },
  { source: 'orchestrator', target: 'communications', strength: 0.7 },
  { source: 'lawrence', target: 'customers', strength: 0.6 },
  { source: 'lawrence', target: 'payments', strength: 0.5 },
  { source: 'customers', target: 'orders', strength: 0.9 },
  { source: 'customers', target: 'communications', strength: 0.8 },
  { source: 'customers', target: 'invoices', strength: 0.7 },
  { source: 'orders', target: 'invoices', strength: 0.9 },
  { source: 'orders', target: 'payments', strength: 0.8 },
  { source: 'orders', target: 'products', strength: 0.8 },
  { source: 'invoices', target: 'payments', strength: 0.9 },
  { source: 'payments', target: 'finance-agent', strength: 0.9 },
  { source: 'products', target: 'sales-agent', strength: 0.8 },
  { source: 'products', target: 'orders', strength: 0.7 },
  { source: 'sales-agent', target: 'customers', strength: 0.9 },
  { source: 'sales-agent', target: 'orders', strength: 0.8 },
  { source: 'finance-agent', target: 'invoices', strength: 0.8 },
  { source: 'finance-agent', target: 'payments', strength: 0.9 },
  { source: 'cs-agent', target: 'customers', strength: 0.9 },
  { source: 'cs-agent', target: 'orders', strength: 0.7 },
  { source: 'cs-agent', target: 'communications', strength: 0.8 },
  { source: 'communications', target: 'customers', strength: 0.8 },
  { source: 'communications', target: 'cs-agent', strength: 0.7 },
];

const ICON_MAP: Record<string, LucideIcon> = {
  User: Users, Brain, Users, ShoppingCart, FileText, CreditCard, Package,
  TrendingUp, DollarSign, Handshake, MessageSquare,
};

const INSIGHTS: AIInsight[] = [
  {
    id: 'IN1', category: 'Pattern',
    message: 'Customers purchasing celebration cakes often reorder cupcakes within 14 days.',
    confidence: 94, evidence: 'Based on 23 repeat purchase patterns across 8 customers',
    icon: Lightbulb, color: '#4F46E5',
  },
  {
    id: 'IN2', category: 'Revenue',
    message: 'Weekend sales increased 18% this month compared to last month.',
    confidence: 97, evidence: 'Revenue comparison: ₦2.1M vs ₦1.78M on weekends',
    icon: TrendingUp, color: '#22C55E',
  },
  {
    id: 'IN3', category: 'Prediction',
    message: 'Grace Eze has a 94% repeat purchase probability within the next 30 days.',
    confidence: 96, evidence: 'Purchase history: 24 orders, average interval 41 days',
    icon: Target, color: '#8B5CF6',
  },
  {
    id: 'IN4', category: 'Finance',
    message: 'Average payment time decreased to 2.3 hours this month (was 3.8 hours).',
    confidence: 91, evidence: 'Finance Agent efficiency improved with automated verification',
    icon: Clock, color: '#14B8A6',
  },
  {
    id: 'IN5', category: 'Opportunity',
    message: 'Kwame Mensah has 3 upcoming family birthdays — pre-order opportunity.',
    confidence: 88, evidence: 'Profile indicates recurring birthday cake orders every 3-4 weeks',
    icon: Zap, color: '#F59E0B',
  },
  {
    id: 'IN6', category: 'Warning',
    message: 'Ama Boateng has been dormant for 3+ months — re-engagement campaign ready.',
    confidence: 93, evidence: 'Last order: Monthly Dessert Subscription, July 2024',
    icon: AlertCircle, color: '#EF4444',
  },
];

const BUSINESS_METRICS: BusinessMetric[] = [
  { label: 'Connected Entities', value: '11', change: 'All active', trend: 'up', icon: Network, color: '#4F46E5' },
  { label: 'Active Relationships', value: '32', change: '+4 this week', trend: 'up', icon: Activity, color: '#22C55E' },
  { label: 'AI Confidence', value: '96%', change: '+2.1%', trend: 'up', icon: Brain, color: '#8B5CF6' },
  { label: 'Knowledge Coverage', value: '94%', change: 'Comprehensive', trend: 'up', icon: Layers, color: '#3B82F6' },
  { label: 'Automation Opportunities', value: '8', change: '+3 detected', trend: 'up', icon: Zap, color: '#F59E0B' },
];

const SAMPLE_QUERIES = [
  'Which customers should I follow up with?',
  'Show overdue payments.',
  'Which products generate repeat purchases?',
  'Which customers are most valuable?',
  'What is the current cash flow status?',
  'Show me the AI agent activity log.',
];

const REASONING_PATH = [
  { step: 1, label: 'Grace Eze', detail: 'Customer identified as high-value VIP with 24 orders', icon: Users, color: '#4F46E5' },
  { step: 2, label: 'Order #1048', detail: 'New order placed for Custom Celebration Cake (₦185,000)', icon: ShoppingCart, color: '#F59E0B' },
  { step: 3, label: 'Invoice Generated', detail: 'Finance Agent created invoice automatically', icon: FileText, color: '#22C55E' },
  { step: 4, label: 'Payment Verified', detail: 'Bank transfer of ₦185,000 confirmed by Finance Agent', icon: CreditCard, color: '#14B8A6' },
  { step: 5, label: 'Customer Success', detail: 'Confirmation message sent via WhatsApp to Grace', icon: Handshake, color: '#8B5CF6' },
  { step: 6, label: 'Recommended Loyalty Offer', detail: 'AI predicts 94% repeat probability — loyalty discount suggested', icon: Star, color: '#EC4899' },
];

const RELATIONSHIP_CHAIN = [
  { label: 'Customer', icon: Users, color: '#4F46E5', description: 'Grace Eze places an order' },
  { label: 'Orders', icon: ShoppingCart, color: '#F59E0B', description: 'Order #1048 — Custom Celebration Cake' },
  { label: 'Invoices', icon: FileText, color: '#22C55E', description: 'Invoice #INV-024 generated automatically' },
  { label: 'Payments', icon: CreditCard, color: '#14B8A6', description: 'Bank transfer of ₦185,000 verified' },
  { label: 'Products', icon: Package, color: '#EC4899', description: '3-Tier Celebration Cake in production' },
  { label: 'AI Agents', icon: Bot, color: '#8B5CF6', description: '3 agents coordinating the workflow' },
  { label: 'Communications', icon: MessageSquare, color: '#F97316', description: 'WhatsApp confirmation sent to customer' },
];

// ============================================================================
// Helper: Node Icon
// ============================================================================

function NodeIcon({ type, size = 20 }: { type: string; size?: number }) {
  const Icon = ICON_MAP[type] || Bot;
  return <Icon size={size} />;
}

// ============================================================================
// Knowledge Graph Page
// ============================================================================

export default function KnowledgeGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchAnswer, setSearchAnswer] = useState<string | null>(null);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [activeRelationshipStep, setActiveRelationshipStep] = useState(0);
  const [flowDots, setFlowDots] = useState<{ id: string; progress: number }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const relationshipTimerRef = useRef<ReturnType<typeof setInterval>>();

  // Generate flow dots on edges
  useEffect(() => {
    const dots = EDGES.map((_, i) => ({ id: `dot-${i}`, progress: Math.random() }));
    setFlowDots(dots);
    const interval = setInterval(() => {
      setFlowDots(prev => prev.map(d => ({
        ...d,
        progress: (d.progress + 0.005) % 1,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Relationship explorer auto-advance
  useEffect(() => {
    relationshipTimerRef.current = setInterval(() => {
      setActiveRelationshipStep(prev => (prev + 1) % RELATIONSHIP_CHAIN.length);
    }, 3000);
    return () => clearInterval(relationshipTimerRef.current);
  }, []);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Connected nodes for hover
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode && !selectedNode) return new Set<string>();
    const activeId = hoveredNode || selectedNode;
    const connected = new Set<string>([activeId!]);
    EDGES.forEach(e => {
      if (e.source === activeId) connected.add(e.target);
      if (e.target === activeId) connected.add(e.source);
    });
    return connected;
  }, [hoveredNode, selectedNode]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return NODES.find(n => n.id === selectedNode) || null;
  }, [selectedNode]);

  // Filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return SAMPLE_QUERIES;
    return SAMPLE_QUERIES.filter(q =>
      q.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSuggestions(false);
      // Simulate AI answer
      const answers: Record<string, string> = {
        'Which customers should I follow up with?': 'Based on AI analysis, **Grace Eze** (payment verification pending), **Thabo Mokoena** (payment declined), and **Adaobi Nwosu** (quotation awaiting approval) require immediate follow-up. **Kwame Mensah** and **Naledi Dlamini** are ready for loyalty programme enrolment.',
        'Show overdue payments.': 'Currently **2 overdue payments** detected: **Thabo Mokoena** — ₦450,000 (Wedding Cake Package, bank declined) and **Grace Eze** — ₦185,000 (Custom Celebration Cake, pending verification). Total at risk: **₦635,000**.',
        'Which products generate repeat purchases?': '**Custom Celebration Cake** (68% repeat rate), **Birthday Cake Package** (72% repeat rate), and **Cupcake Collection** (61% repeat rate) are your top repeat-purchase products. **Corporate Dessert Package** has growing repeat demand at 45%.',
        'Which customers are most valuable?': 'Your top 3 customers by lifetime value: **Grace Eze** (₦1.2M, 24 orders), **Chinedu Okafor** (₦890K, 42 orders), and **Kwame Mensah** (₦620K, 31 orders). All three are VIP candidates for your loyalty programme.',
        'What is the current cash flow status?': 'Current cash flow is **healthy**. Total received today: **₦1,245,000** across 4 verified payments. Expected incoming: **₦820,000** (3 pending verifications). AI confidence in cash flow forecast: **96%**.',
        'Show me the AI agent activity log.': '**Recent activity:** Sales Agent completed quotation for Grace Eze (2m ago), Finance Agent reviewing payment (5m ago), Customer Success preparing confirmation (11m ago), Sales Agent recommended Corporate Package to Amaka Bello (18m ago).',
      };
      setSearchAnswer(answers[query] || `Swift AI is analyzing your question about "${query}"... Here's what the knowledge graph reveals: **3 connected entities** and **5 active relationships** are relevant to your query. AI confidence: **92%**.`);
    } else {
      setSearchAnswer(null);
    }
  }

  function handleNodeClick(nodeId: string) {
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
  }

  function getEdgeOpacity(source: string, target: string): number {
    const activeId = hoveredNode || selectedNode;
    if (!activeId) return 0.15;
    if (source === activeId || target === activeId) return 0.7;
    return 0.04;
  }

  // Get flow dot position on an edge
  function getDotPosition(source: string, target: string, progress: number) {
    const src = NODES.find(n => n.id === source);
    const tgt = NODES.find(n => n.id === target);
    if (!src || !tgt) return { x: 0, y: 0 };
    return {
      x: src.x + (tgt.x - src.x) * progress,
      y: src.y + (tgt.y - src.y) * progress,
    };
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-[1400px] mx-auto">
      {/* ============================================================ */}
      {/* HEADER                                                       */}
      {/* ============================================================ */}
      <div className="hero-gradient-dark p-8 lg:p-10">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
              <Network size={22} className="text-indigo-300" />
            </div>
            <span className="ai-badge !bg-indigo-500/20 !text-indigo-300 !ring-indigo-500/30">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse-dot" />
              Live Intelligence Layer
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Business Knowledge Graph
          </h1>
          <p className="text-indigo-200/80 text-base lg:text-lg max-w-2xl">
            Discover how your customers, operations and AI agents are connected into one living business network.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BUSINESS HEALTH                                              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BUSINESS_METRICS.map((metric, i) => (
          <div
            key={metric.label}
            className="bg-card rounded-xl p-4 shadow-sm ring-1 ring-border hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                <metric.icon size={14} style={{ color: metric.color }} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {metric.label}
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">{metric.value}</div>
            <div className="flex items-center gap-1 mt-0.5">
              {metric.trend === 'up' && <ArrowUpRight size={12} className="text-emerald-500" />}
              <span className="text-[11px] text-emerald-600 font-medium">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* MAIN GRAPH + NODE INSPECTOR                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Area */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-sm ring-1 ring-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network size={18} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">Network Visualization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary">Hover to explore &middot; Click to inspect</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            </div>
          </div>
          <div className="relative w-full" style={{ height: 500 }}>
            <svg
              viewBox="0 0 900 620"
              className="w-full h-full"
              role="img"
              aria-label="Business Knowledge Graph showing connections between customers, orders, payments, products, and AI agents"
            >
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(79,70,229,0.3)" />
                  <stop offset="100%" stopColor="rgba(79,70,229,0)" />
                </radialGradient>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background grid */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.5" fill="#E2E8F0" opacity="0.3" />
              </pattern>
              <rect width="900" height="620" fill="url(#grid)" />

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const source = NODES.find(n => n.id === edge.source);
                const target = NODES.find(n => n.id === edge.target);
                if (!source || !target) return null;
                const opacity = getEdgeOpacity(edge.source, edge.target);
                const isActive = opacity > 0.5;
                return (
                  <g key={`edge-${i}`}>
                    <line
                      x1={source.x} y1={source.y}
                      x2={target.x} y2={target.y}
                      stroke={isActive ? '#4F46E5' : '#94A3B8'}
                      strokeWidth={isActive ? 2 : 1}
                      opacity={opacity}
                      className="transition-all duration-300"
                    />
                    {/* Flow dot */}
                    {flowDots[i] && isActive && (
                      <circle
                        cx={getDotPosition(edge.source, edge.target, flowDots[i].progress).x}
                        cy={getDotPosition(edge.source, edge.target, flowDots[i].progress).y}
                        r={3}
                        fill="#4F46E5"
                        opacity={0.7}
                        filter="url(#glowFilter)"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map((node) => {
                const Icon = ICON_MAP[node.icon] || Bot;
                const isConnected = connectedNodeIds.has(node.id);
                const isActive = !hoveredNode && !selectedNode;
                const opacity = isActive ? 1 : (isConnected ? 1 : 0.2);
                const isSelected = selectedNode === node.id;
                const isHovered = hoveredNode === node.id;

                return (
                  <g
                    key={node.id}
                    className="transition-all duration-300 cursor-pointer"
                    style={{ transition: 'opacity 0.3s ease' }}
                    opacity={opacity}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node.id)}
                    role="button"
                    aria-label={`${node.label}: ${node.description || ''}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNodeClick(node.id); }}
                  >
                    {/* Glow ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={node.x} cy={node.y}
                        r={node.size / 2 + 14}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        opacity={0.3}
                        filter="url(#softGlow)"
                      />
                    )}

                    {/* Node background */}
                    <circle
                      cx={node.x} cy={node.y}
                      r={node.size / 2 + 2}
                      fill="white"
                      stroke={node.color}
                      strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                      opacity={1}
                      className="transition-all duration-200"
                    />

                    {/* Node inner fill */}
                    <circle
                      cx={node.x} cy={node.y}
                      r={node.size / 2}
                      fill={isSelected || isHovered ? `${node.color}20` : `${node.color}08`}
                    />

                    {/* Icon */}
                    <foreignObject
                      x={node.x - 12} y={node.y - 12}
                      width={24} height={24}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon size={node.type === 'person' ? 20 : node.type === 'orchestrator' ? 18 : 16} color={node.color} />
                      </div>
                    </foreignObject>

                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + node.size / 2 + 18}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#0F172A' : '#64748B'}
                      fontSize={node.type === 'person' ? 12 : node.type === 'orchestrator' ? 11 : 10}
                      fontWeight={node.type === 'person' ? 600 : node.type === 'orchestrator' ? 600 : 500}
                      className="transition-all duration-200"
                    >
                      {node.label}
                    </text>

                    {/* Score badge for person/orchestrator */}
                    {node.score && (node.type === 'person' || node.type === 'orchestrator') && (
                      <text
                        x={node.x + node.size / 2 + 8}
                        y={node.y - node.size / 2 + 4}
                        fill={node.color}
                        fontSize={9}
                        fontWeight={600}
                        opacity={0.8}
                      >
                        {node.score}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="bg-card rounded-xl shadow-sm ring-1 ring-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">Node Inspector</span>
            </div>
            {selectedNode && (
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
                aria-label="Close inspector"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {selectedNodeData ? (
            <div className="p-5 space-y-4 animate-slide-in-right">
              {/* Node header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ background: selectedNodeData.color }}
                >
                  <NodeIcon type={selectedNodeData.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedNodeData.label}</h3>
                  <p className="text-xs text-text-secondary">{selectedNodeData.description}</p>
                </div>
              </div>

              {selectedNodeData.id === 'customers' && (
                <div className="space-y-3">
                  <div className="bg-surface rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">Relationship Score</span>
                      <span className="text-xs font-bold text-emerald-600">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '98%' }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">Lifetime Value</span>
                      <span className="text-xs font-bold text-foreground">₦1.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">Orders</span>
                      <span className="text-xs font-bold text-foreground">6</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-secondary">Average Order Value</span>
                      <span className="text-xs font-bold text-foreground">₦200,000</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-foreground">Current Workflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                      <span className="text-xs text-text-secondary">Payment Verification</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-foreground">AI Recommendations</span>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="text-[11px] text-text-secondary flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-emerald-500 shrink-0" /> Offer Loyalty Discount
                      </li>
                      <li className="text-[11px] text-text-secondary flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-emerald-500 shrink-0" /> Recommend Premium Cupcakes
                      </li>
                      <li className="text-[11px] text-text-secondary flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-emerald-500 shrink-0" /> Schedule WhatsApp Follow-up
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-foreground">Connected Products</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info" size="sm">Celebration Cake</Badge>
                      <Badge variant="info" size="sm">Cupcake Collection</Badge>
                      <Badge variant="info" size="sm">Pastry Box</Badge>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-foreground">Connected AI Agents</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success" size="sm" dot>Finance Agent</Badge>
                      <Badge variant="info" size="sm" dot>Sales Agent</Badge>
                      <Badge variant="info" size="sm" dot>Customer Success</Badge>
                    </div>
                  </div>
                </div>
              )}

              {selectedNodeData.id !== 'customers' && (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-text-secondary">
                    Select a customer node to view detailed relationship data.
                  </p>
                </div>
              )}

              {/* Connected entities */}
              <div>
                <span className="text-xs font-semibold text-foreground mb-2 block">Connected Entities</span>
                <div className="flex flex-wrap gap-2">
                  {EDGES
                    .filter(e => e.source === selectedNode || e.target === selectedNode)
                    .map(e => {
                      const connectedId = e.source === selectedNode ? e.target : e.source;
                      const connectedNode = NODES.find(n => n.id === connectedId);
                      if (!connectedNode) return null;
                      return (
                        <button
                          key={connectedId}
                          onClick={() => handleNodeClick(connectedId)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors duration-150 cursor-pointer"
                          style={{ background: `${connectedNode.color}15`, color: connectedNode.color }}
                        >
                          {connectedNode.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-muted mb-3">
                <Target size={24} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No Node Selected</p>
              <p className="text-xs text-text-secondary max-w-xs">
                Click on any node in the graph to inspect its relationships, metrics, and AI insights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* AI REASONING EXPLORER + AI INSIGHTS                          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Reasoning Explorer */}
        <Card
          padding="none"
          header={
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">AI Reasoning Explorer</span>
            </div>
          }
        >
          <div className="p-5 space-y-0">
            {REASONING_PATH.map((step, i) => (
              <div key={step.step} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Connector line */}
                {i < REASONING_PATH.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-100" />
                )}

                {/* Step number */}
                <div
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: step.color }}
                >
                  {step.step}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <step.icon size={14} style={{ color: step.color }} />
                    <span className="text-sm font-semibold text-foreground">{step.label}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card
          padding="none"
          header={
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">AI Insights</span>
              <Badge variant="info" size="sm">{INSIGHTS.length} active</Badge>
            </div>
          }
        >
          <div className="p-5 space-y-3">
            {INSIGHTS.map((insight) => (
              <button
                key={insight.id}
                onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer
                  ${activeInsight === insight.id
                    ? 'bg-surface ring-1 ring-border'
                    : 'hover:bg-surface'
                  }`}
                aria-expanded={activeInsight === insight.id}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${insight.color}15` }}
                  >
                    <insight.icon size={15} style={{ color: insight.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info" size="sm">{insight.category}</Badge>
                      <span className="text-[11px] text-text-secondary font-medium">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">{insight.message}</p>
                    {activeInsight === insight.id && (
                      <div className="mt-2 pt-2 border-t border-border animate-slide-up-fade-in">
                        <div className="flex items-start gap-1.5">
                          <Shield size={12} className="text-text-secondary mt-0.5 shrink-0" />
                          <span className="text-[11px] text-text-secondary">{insight.evidence}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-muted mt-1.5 transition-transform duration-200 ${activeInsight === insight.id ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* ASK THE GRAPH                                                */}
      {/* ============================================================ */}
      <Card
        padding="none"
        header={
          <div className="flex items-center gap-2">
            <Search size={18} className="text-primary" />
            <span className="font-semibold text-sm text-foreground">Ask the Graph</span>
          </div>
        }
      >
        <div className="p-5 space-y-4">
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (!e.target.value) setSearchAnswer(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Ask anything about your business..."
                className="search-input pl-12 pr-12 py-3.5"
                aria-label="Ask the business knowledge graph"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchAnswer(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted hover:text-foreground hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && !searchAnswer && (
              <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-card rounded-xl shadow-lg ring-1 ring-border overflow-hidden animate-scale-in">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSearch(query)}
                      className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:bg-surface-hover hover:text-foreground
                        transition-colors duration-100 flex items-center gap-3 cursor-pointer"
                    >
                      <Search size={14} className="text-muted shrink-0" />
                      {query}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-text-secondary">
                    No matching queries found. Press Enter to ask directly.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick suggestion chips */}
          {!searchAnswer && (
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUERIES.slice(0, 4).map((query) => (
                <button
                  key={query}
                  onClick={() => handleSearch(query)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary bg-surface
                    hover:bg-surface-hover hover:text-foreground transition-all duration-150 border border-border/50 cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          )}

          {/* AI Answer */}
          {searchAnswer && (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 rounded-xl p-5 animate-slide-up-fade-in" role="alert" aria-live="polite">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-indigo-600" />
                </div>
                <span className="text-xs font-semibold text-indigo-700">Swift AI Response</span>
                <Badge variant="info" size="sm" dot>97% confidence</Badge>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {searchAnswer}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ============================================================ */}
      {/* RELATIONSHIP EXPLORER                                        */}
      {/* ============================================================ */}
      <Card
        padding="none"
        header={
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-primary" />
            <span className="font-semibold text-sm text-foreground">Relationship Explorer</span>
            <Badge variant="info" size="sm">Auto-playing</Badge>
          </div>
        }
      >
        <div className="p-5">
          <div className="flex items-center justify-center gap-0 overflow-x-auto py-4">
            {RELATIONSHIP_CHAIN.map((item, i) => (
              <div key={item.label} className="flex items-center gap-0 shrink-0">
                {/* Step card */}
                <button
                  onClick={() => setActiveRelationshipStep(i)}
                  className={`
                    flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-500 cursor-pointer
                    ${activeRelationshipStep === i
                      ? 'bg-gradient-to-br from-indigo-50 to-violet-50 ring-2 ring-indigo-200 scale-105'
                      : 'hover:bg-slate-50'
                    }
                  `}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: activeRelationshipStep === i ? `${item.color}20` : '#F8FAFC',
                      boxShadow: activeRelationshipStep === i ? `0 0 20px ${item.color}30` : 'none',
                    }}
                  >
                    <item.icon
                      size={20}
                      style={{ color: activeRelationshipStep === i ? item.color : '#94A3B8' }}
                      className="transition-all duration-500"
                    />
                  </div>
                  <span
                    className="text-xs font-semibold whitespace-nowrap transition-all duration-500"
                    style={{ color: activeRelationshipStep === i ? item.color : '#64748B' }}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-text-secondary text-center max-w-[120px] leading-tight">
                    {item.description}
                  </span>
                </button>

                {/* Arrow connector */}
                {i < RELATIONSHIP_CHAIN.length - 1 && (
                  <div className="flex items-center px-2">
                    <ArrowRight
                      size={16}
                      className={`transition-all duration-500 ${activeRelationshipStep === i || activeRelationshipStep === i + 1 ? 'text-indigo-400' : 'text-slate-300'}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-text-secondary">Journey Progress</span>
              <span className="text-[10px] font-medium text-text-secondary">
                Step {activeRelationshipStep + 1} of {RELATIONSHIP_CHAIN.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((activeRelationshipStep + 1) / RELATIONSHIP_CHAIN.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
          <Network size={14} className="text-primary" />
          <span>Swiftrove AI Business Knowledge Graph &mdash; Connecting your entire business into one living intelligence layer.</span>
        </div>
      </div>
    </div>
  );
}