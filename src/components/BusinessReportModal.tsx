import { useEffect, useRef, useState } from 'react';
import {
  X, Download, Sparkles, DollarSign, ShoppingCart, CreditCard, Users,
  Bot, CheckCircle, TrendingUp, BarChart3, Crown, Activity,
} from 'lucide-react';
import { Card, Button } from './ui';
import { useAuth } from '../context/AuthContext';
import {
  CUSTOMERS, AGENTS, PAYMENTS, KANBAN_ORDERS,
} from '../lib/constants';

// ============================================================================
// Report data generator
// ============================================================================

interface ReportSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
}

function generateReport() {
  const totalRevenue = 28430000;
  const totalOrders = 847;
  const totalCustomers = 15;
  const pendingPayments = PAYMENTS.filter((p) => p.status === 'pending').length;
  const verifiedPayments = PAYMENTS.filter((p) => p.status === 'verified').length;
  const failedPayments = PAYMENTS.filter((p) => p.status === 'failed').length;
  const totalPaymentAmount = PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

  const aiTasksCompleted = 247;
  const agentsOnline = AGENTS.filter((a) => a.status === 'online').length;
  const avgSuccessRate = 98;

  const activeOrders = KANBAN_ORDERS.filter((o) => o.status === 'new' || o.status === 'processing').length;
  const completedOrders = KANBAN_ORDERS.filter((o) => o.status === 'completed').length;
  const issueOrders = KANBAN_ORDERS.filter((o) => o.status === 'issue').length;

  const topCustomers = [...CUSTOMERS]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Business Health Score: composite of payments verified, orders completed, agents online, etc.
  const healthScore = Math.round(
    ((verifiedPayments / Math.max(PAYMENTS.length, 1)) * 35) +
    ((completedOrders / Math.max(KANBAN_ORDERS.length, 1)) * 25) +
    ((agentsOnline / Math.max(AGENTS.length, 1)) * 20) +
    ((avgSuccessRate / 100) * 20)
  );

  return { totalRevenue, totalOrders, totalCustomers, pendingPayments, verifiedPayments, failedPayments, totalPaymentAmount, aiTasksCompleted, agentsOnline, avgSuccessRate, activeOrders, completedOrders, issueOrders, topCustomers, healthScore };
}

// ============================================================================
// Stat row
// ============================================================================
function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-foreground" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

// ============================================================================
// BusinessReportModal
// ============================================================================

interface BusinessReportModalProps {
  onClose: () => void;
}

export default function BusinessReportModal({ onClose }: BusinessReportModalProps) {
  const { profile } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [generating, setGenerating] = useState(true);
  const [report] = useState(generateReport);

  // Focus trap + Escape
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [onClose]);

  // Simulate generation delay
  useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const sections: ReportSection[] = [
    {
      title: 'Revenue Summary',
      icon: <DollarSign size={16} />,
      color: '#22C55E',
      content: (
        <div>
          <p className="text-3xl font-bold text-foreground mb-2">₦{report.totalRevenue.toLocaleString()}</p>
          <StatRow label="Period" value="Last 30 Days" />
          <StatRow label="Monthly Growth" value="+18.2%" color="#22C55E" />
          <StatRow label="Average Daily Revenue" value={`₦${Math.round(report.totalRevenue / 30).toLocaleString()}`} />
        </div>
      ),
    },
    {
      title: 'Order Summary',
      icon: <ShoppingCart size={16} />,
      color: '#4F46E5',
      content: (
        <div>
          <p className="text-3xl font-bold text-foreground mb-2">{report.totalOrders}</p>
          <StatRow label="Active Orders" value={String(report.activeOrders)} />
          <StatRow label="Completed" value={String(report.completedOrders)} color="#22C55E" />
          <StatRow label="Issues Flagged" value={String(report.issueOrders)} color="#EF4444" />
        </div>
      ),
    },
    {
      title: 'Payment Summary',
      icon: <CreditCard size={16} />,
      color: '#F59E0B',
      content: (
        <div>
          <p className="text-3xl font-bold text-foreground mb-2">₦{report.totalPaymentAmount.toLocaleString()}</p>
          <StatRow label="Verified" value={String(report.verifiedPayments)} color="#22C55E" />
          <StatRow label="Pending" value={String(report.pendingPayments)} color="#F59E0B" />
          <StatRow label="Failed" value={String(report.failedPayments)} color="#EF4444" />
        </div>
      ),
    },
    {
      title: 'Customer Growth',
      icon: <Users size={16} />,
      color: '#3B82F6',
      content: (
        <div>
          <p className="text-3xl font-bold text-foreground mb-2">{report.totalCustomers}</p>
          <StatRow label="New Customers (30d)" value="+43" color="#22C55E" />
          <StatRow label="Active Customers" value="12" />
          <StatRow label="Growth Rate" value="+18.2%" color="#22C55E" />
        </div>
      ),
    },
    {
      title: 'AI Workforce Performance',
      icon: <Bot size={16} />,
      color: '#8B5CF6',
      content: (
        <div>
          <p className="text-3xl font-bold text-foreground mb-2">{report.aiTasksCompleted}</p>
          <StatRow label="Tasks Completed Today" value={String(report.aiTasksCompleted)} />
          <StatRow label="Agents Online" value={`${report.agentsOnline} / ${AGENTS.length}`} color="#22C55E" />
          <StatRow label="Average Success Rate" value={`${report.avgSuccessRate}%`} color="#22C55E" />
          <div className="mt-3 space-y-2">
            {AGENTS.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.status === 'online' ? '#22C55E' : a.status === 'busy' ? '#F59E0B' : '#94A3B8' }} />
                  <span className="text-xs font-medium text-foreground">{a.name}</span>
                </div>
                <span className="text-[10px] text-text-secondary capitalize">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Workflow Performance',
      icon: <Activity size={16} />,
      color: '#EC4899',
      content: (
        <div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-secondary">Sales Agent</span>
                <span className="font-semibold text-foreground">92%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-secondary">Finance Agent</span>
                <span className="font-semibold text-foreground">78%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#22C55E]" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-secondary">Customer Success</span>
                <span className="font-semibold text-foreground">85%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Top Customers',
      icon: <Crown size={16} />,
      color: '#F59E0B',
      content: (
        <div>
          <div className="divide-y divide-border">
            {report.topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-text-secondary">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-[10px] text-text-secondary">{c.email}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">₦{c.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Business Health Score',
      icon: <TrendingUp size={16} />,
      color: report.healthScore >= 80 ? '#22C55E' : report.healthScore >= 60 ? '#F59E0B' : '#EF4444',
      content: (
        <div className="flex flex-col items-center py-4">
          <div className="relative mb-4">
            <svg width="100" height="100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-chart-grid)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={report.healthScore >= 80 ? '#22C55E' : report.healthScore >= 60 ? '#F59E0B' : '#EF4444'}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - report.healthScore / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{report.healthScore}%</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary text-center max-w-xs">
            {report.healthScore >= 80
              ? 'Your business is performing exceptionally well. All key metrics are in good shape.'
              : report.healthScore >= 60
              ? 'Your business is performing adequately. Some areas need attention.'
              : 'Your business needs immediate attention. Review flagged issues.'}
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Critical</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (generating) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="bg-card rounded-2xl shadow-2xl w-full max-w-lg p-12 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h2 id="report-title" className="text-lg font-bold text-foreground">Generating Your Report</h2>
            <p className="text-sm text-text-secondary">Swift AI is analysing your business data...</p>
            <div className="w-48 h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pb-8 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            {profile?.business_logo_url ? (
              <img
                src={profile.business_logo_url}
                alt="Company logo"
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BarChart3 size={20} className="text-white" />
              </div>
            )}
            <div>
              <h2 id="report-title" className="text-lg font-bold text-foreground">
                {profile?.company_name ? `${profile.company_name} — Executive Report` : 'Executive Business Report'}
              </h2>
              <p className="text-xs text-text-secondary">Prepared by Swift AI — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => {
                // Print the report as a simple download fallback
                window.print();
              }}
            >
              Print Report
            </Button>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Close report"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Report Body */}
        <div id="report-content" className="p-6">
          {/* AI Executive Summary */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-transparent border border-indigo-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Executive Summary</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Your business generated <strong>₦{report.totalRevenue.toLocaleString()}</strong> in revenue over the past 30 days, with <strong>{report.totalOrders}</strong> orders processed. The AI workforce completed <strong>{report.aiTasksCompleted}</strong> operational tasks, maintaining a <strong>{report.avgSuccessRate}%</strong> success rate. Payment verification stands at <strong>{report.verifiedPayments} of {PAYMENTS.length}</strong> transactions cleared. Your Business Health Score is <strong>{report.healthScore}%</strong>{report.healthScore >= 80 ? ' — exceptionally strong.' : report.healthScore >= 60 ? ' — stable with room for improvement.' : ' — requires attention.'}
            </p>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section) => (
              <Card key={section.title} className="animate-fade-in-up" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                    {section.icon}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{section.title}</span>
                </div>
                {section.content}
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <CheckCircle size={12} className="text-emerald-500" />
              <span>Report generated by Swift AI — data reflects the last 30 days</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}