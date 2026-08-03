import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  DollarSign, ShoppingCart, Users, Zap, ArrowUpRight, ChevronDown, Sparkles,
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import BusinessReportModal from '../components/BusinessReportModal';
import { ANALYTICS_STATS, CHART_DATA } from '../lib/constants';

const iconMap: Record<string, LucideIcon> = {
  DollarSign, ShoppingCart, Users, Zap,
};

function MetricCard({ stat, index }: { stat: typeof ANALYTICS_STATS[0]; index: number }) {
  const Icon = iconMap[stat.icon];
  return (
    <Card className={`animate-fade-in-up stagger-${index + 1}`} hover>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-text-secondary">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
          <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={14} />
            {stat.change}
          </div>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </Card>
  );
}

function AreaChart({ data, color, gradientId }: { data: number[]; color: string; gradientId: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 300;
  const height = 120;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 20) - 10}`).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - ((v - min) / range) * (height - 20) - 10}
          r="2.5"
          fill={color}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      ))}
    </svg>
  );
}

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const barCount = data.length;
  const barWidth = 20;
  const gap = 6;
  const width = barCount * (barWidth + gap);
  const height = 120;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const barH = (v / max) * (height - 10);
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barH}
            width={barWidth}
            height={barH}
            rx="3"
            fill={color}
            fillOpacity="0.8"
            className="hover:fill-opacity-100 transition-all duration-200"
          />
        );
      })}
    </svg>
  );
}

function LineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 300;
  const height = 120;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 20) - 10}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - ((v - min) / range) * (height - 20) - 10}
          r="3"
          fill="var(--color-chart-bg)"
          stroke={color}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function RadialChart({ value, color }: { value: number; color: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-chart-grid)" strokeWidth="8" />
      <circle
        cx="60" cy="60" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        className="transition-all duration-1000"
      />
      <text x="60" y="55" textAnchor="middle" className="text-2xl font-bold" fill="var(--color-foreground)" fontSize="24">
        {value}%
      </text>
      <text x="60" y="75" textAnchor="middle" className="text-[10px]" fill="var(--color-text-secondary)" fontSize="10">
        Efficiency
      </text>
    </svg>
  );
}

const chartConfigs = [
  {
    title: 'Revenue Trend',
    description: 'Monthly revenue for the past 12 months',
    type: 'area' as const,
    data: CHART_DATA.revenue,
    color: '#22C55E',
    gradientId: 'revenue-grad',
    prefix: '₦',
  },
  {
    title: 'Orders Overview',
    description: 'Monthly orders for the past 12 months',
    type: 'bar' as const,
    data: CHART_DATA.orders,
    color: '#4F46E5',
    gradientId: 'orders-grad',
    prefix: '',
  },
  {
    title: 'Customer Growth',
    description: 'Monthly new customer signups',
    type: 'line' as const,
    data: CHART_DATA.customers,
    color: '#3B82F6',
    gradientId: 'customers-grad',
    prefix: '',
  },
  {
    title: 'AI Productivity',
    description: 'Overall AI agent efficiency score',
    type: 'radial' as const,
    data: [CHART_DATA.aiProductivity],
    color: '#8B5CF6',
    gradientId: 'ai-grad',
    prefix: '',
  },
];

export default function Analytics() {
  const location = useLocation();
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle quick action navigation from Dashboard
  useEffect(() => {
    if (location.state?.runReport) {
      window.history.replaceState({}, document.title);
      setShowReport(true);
    }
  }, [location.state]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="section-subtitle">
            Insights and metrics for your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles size={14} />}
            onClick={() => setShowReport(true)}
          >
            Run Report
          </Button>
          <Button variant="secondary" size="sm" icon={<ChevronDown size={14} />}>
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ANALYTICS_STATS.map((stat, i) => (
          <MetricCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartConfigs.map((chart, i) => (
          <Card key={chart.title} className={`animate-fade-in-up stagger-${i + 1} group`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{chart.title}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{chart.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-text-secondary">View</span>
                <ChevronDown size={12} className="text-muted" />
              </div>
            </div>
            <div className="h-40">
              {chart.type === 'area' && <AreaChart data={chart.data} color={chart.color} gradientId={chart.gradientId} />}
              {chart.type === 'bar' && <BarChart data={chart.data} color={chart.color} />}
              {chart.type === 'line' && <LineChart data={chart.data} color={chart.color} />}
              {chart.type === 'radial' && <RadialChart value={chart.data[0]} color={chart.color} />}
            </div>
          </Card>
        ))}
      </div>

      {/* Business Report Modal */}
      {showReport && <BusinessReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}