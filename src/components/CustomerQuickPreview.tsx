import { useEffect, useState, useCallback, useRef } from 'react';
import {
  X, Bot, ShoppingCart, CreditCard, Sparkles, Activity, AlertCircle,
  ChevronRight, Package, Phone, Mail, MapPin, MessageSquare, UserCheck,
  Eye, FileText, Clock, TrendingUp, Zap, Gift, Star, Users, CheckCircle,
  Send, Plus, BarChart3, Fingerprint, Shield, Crown,
  ChevronUp,
} from 'lucide-react';
import { Badge, Avatar, Button, Skeleton } from './ui';
import { CUSTOMER_INTELLIGENCE, type CustomerIntelligence } from '../lib/constants';

interface CustomerQuickPreviewProps {
  customerId: string;
  open: boolean;
  onClose: () => void;
  onSendMessage?: (customerId: string) => void;
  onCreateOrder?: (customerId: string) => void;
}

// ============================================================================
// Health badge variant helper
// ============================================================================
function healthBadgeVariant(health: string): 'success' | 'warning' | 'danger' | 'info' {
  if (health === 'Excellent' || health === 'Healthy') return 'success';
  if (health === 'Growing' || health === 'At Risk') return 'warning';
  if (health === 'Churned') return 'danger';
  return 'info';
}

// ============================================================================
// Priority badge helper
// ============================================================================
function priorityBadgeVariant(priority: 'high' | 'medium' | 'low'): 'danger' | 'warning' | 'info' {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'info';
}

// ============================================================================
// Timeline icon map
// ============================================================================
function TimelineIcon({ iconType }: { iconType: string }) {
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    CheckCircle, FileText, Clock, MessageSquare, ShoppingCart, Star, Users, Truck, XCircle, Gift, TrendingUp, Zap,
  };
  const Icon = iconMap[iconType] || Activity;
  return <Icon size={12} className="text-primary" />;
}

// ============================================================================
// Section wrapper
// ============================================================================
function PreviewSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={12} className="text-primary" />
        </div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// Info row component
// ============================================================================
function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <Icon size={13} className="text-muted shrink-0" />
      <span className="text-xs text-text-secondary min-w-[80px]">{label}</span>
      <span className="text-xs font-medium text-foreground ml-auto">{value}</span>
    </div>
  );
}

// ============================================================================
// Mini DNA gauge
// ============================================================================
function MiniGauge({ value, label, color = '#4F46E5' }: { value: number; label: string; color?: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="44" height="44" className="transform -rotate-90">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="22" cy="22" r={radius} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-[9px] font-medium text-text-secondary text-center leading-tight max-w-[60px]">{label}</span>
    </div>
  );
}

// ============================================================================
// Loading skeleton
// ============================================================================
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-10 w-full" />
        <Skeleton variant="text" className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-10 w-full" />
        <Skeleton variant="text" className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-10 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// Error state
// ============================================================================
function ErrorState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mb-3">
        <AlertCircle size={24} className="text-danger" />
      </div>
      <p className="text-sm font-medium text-foreground">Could not load preview</p>
      <p className="text-xs text-text-secondary mt-1">This customer may no longer be available.</p>
      <Button variant="ghost" size="sm" className="mt-4" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function CustomerQuickPreview({ customerId, open, onClose, onSendMessage, onCreateOrder }: CustomerQuickPreviewProps) {
  const [customer, setCustomer] = useState<CustomerIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Reset scroll and load data on open
  useEffect(() => {
    if (open && customerId) {
      setAnimatingOut(false);
      setLoading(true);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      const timer = setTimeout(() => {
        const found = CUSTOMER_INTELLIGENCE.find((c) => c.id === customerId);
        setCustomer(found || null);
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setCustomer(null);
    }
  }, [open, customerId]);

  // Lock body scroll and handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    setAnimatingOut(true);
    setTimeout(() => {
      setAnimatingOut(false);
      onClose();
    }, 250);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  // Focus trap: move focus to header on open
  useEffect(() => {
    if (open && headerRef.current) {
      headerRef.current.focus();
    }
  }, [open]);

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(customerId);
    }
  };

  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder(customerId);
    }
  };

  const handleScrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!open) return null;

  const dna = customer?.customerDNA;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animatingOut ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[450px] bg-card shadow-2xl border-l border-border flex flex-col ${animatingOut ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Customer quick preview"
      >
        {/* ================================================================ */}
        {/* Sticky Premium Header */}
        {/* ================================================================ */}
        <div
          ref={headerRef}
          tabIndex={-1}
          className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border shrink-0 px-5 py-4"
        >
          <div className="flex items-center justify-between">
            {loading ? (
              <div className="flex items-center gap-3">
                <Skeleton variant="avatar" className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton variant="text" className="h-4 w-28" />
                  <Skeleton variant="text" className="h-3 w-20" />
                </div>
              </div>
            ) : customer ? (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar initials={customer.avatar} size="md" className="ring-2 ring-primary/20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{customer.name}</p>
                    <Badge variant={healthBadgeVariant(customer.customerHealth)} dot size="sm">
                      {customer.customerHealth}
                    </Badge>
                    {customer.isVIP && (
                      <Badge variant="warning" size="sm" className="flex items-center gap-0.5">
                        <Crown size={10} /> VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary truncate">{customer.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <AlertCircle size={16} />
                <span>Customer not found</span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shrink-0 ml-2"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Quick Actions Bar */}
        {/* ================================================================ */}
        {customer && !loading && (
          <div className="shrink-0 px-5 py-3 border-b border-border/50 bg-gradient-to-r from-primary/[0.02] to-transparent">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleSendMessage}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface hover:bg-primary/10 hover:text-primary active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Send message to customer"
              >
                <Send size={14} className="text-primary" />
                <span className="text-[10px] font-medium text-foreground leading-tight">Message</span>
              </button>
              <button
                onClick={handleCreateOrder}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface hover:bg-emerald-50 hover:text-emerald-600 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Create order for customer"
              >
                <Plus size={14} className="text-emerald-500" />
                <span className="text-[10px] font-medium text-foreground leading-tight">Order</span>
              </button>
              <button
                onClick={handleScrollToTop}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Scroll to top of preview"
              >
                <ChevronUp size={14} className="text-indigo-500" />
                <span className="text-[10px] font-medium text-foreground leading-tight">Top</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* Scrollable Content — 10 Sections */}
        {/* ================================================================ */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <LoadingSkeleton />
          ) : customer ? (
            <div className="divide-y divide-border">
              {/* 1. Customer Overview */}
              <PreviewSection title="Customer Overview" icon={UserCheck}>
                <div className="space-y-2">
                  {/* Health & Score */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface">
                      <p className="text-[10px] text-text-secondary mb-0.5">Health</p>
                      <Badge variant={healthBadgeVariant(customer.customerHealth)} dot size="sm">
                        {customer.customerHealth}
                      </Badge>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface">
                      <p className="text-[10px] text-text-secondary mb-0.5">Score</p>
                      <p className="text-sm font-semibold text-foreground">{customer.relationshipScore}/100</p>
                    </div>
                  </div>
                  {/* LTV, Orders, Member Since */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface">
                      <p className="text-[10px] text-text-secondary mb-0.5">Lifetime Value</p>
                      <p className="text-sm font-semibold text-foreground">{customer.lifetimeValueLabel}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface">
                      <p className="text-[10px] text-text-secondary mb-0.5">Orders</p>
                      <p className="text-sm font-semibold text-foreground">{customer.totalOrders}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface">
                      <p className="text-[10px] text-text-secondary mb-0.5">Member Since</p>
                      <p className="text-sm font-semibold text-foreground truncate">{customer.memberSince}</p>
                    </div>
                  </div>
                  {/* AI Summary */}
                  <div className="mt-2 p-3 rounded-lg bg-primary/5 text-xs text-foreground leading-relaxed">
                    <Sparkles size={12} className="inline text-primary mr-1" />
                    {customer.aiSummary}
                  </div>
                </div>
              </PreviewSection>

              {/* 2. Contact Information */}
              <PreviewSection title="Contact Information" icon={Mail}>
                <InfoRow label="Email" value={customer.email} icon={Mail} />
                <InfoRow label="Phone" value={customer.phone} icon={Phone} />
                <InfoRow label="Location" value={customer.location} icon={MapPin} />
                <InfoRow label="Preferred Channel" value={customer.preferredChannel} icon={MessageSquare} />
                <InfoRow label="Avg Response" value={customer.avgResponseTime} icon={Clock} />
              </PreviewSection>

              {/* 3. Customer Health */}
              <PreviewSection title="Customer Health" icon={Shield}>
                <div className="grid grid-cols-3 gap-3">
                  {dna && (
                    <>
                      <MiniGauge value={dna.buyingFrequency} label="Buying Frequency" color="#4F46E5" />
                      <MiniGauge value={dna.paymentReliability} label="Payment Reliability" color="#22C55E" />
                      <MiniGauge value={dna.loyalty} label="Loyalty" color="#EC4899" />
                      <MiniGauge value={dna.customerSatisfaction} label="Satisfaction" color="#3B82F6" />
                      <MiniGauge value={dna.communicationEngagement} label="Engagement" color="#8B5CF6" />
                      <MiniGauge value={dna.upsellReadiness} label="Upsell Readiness" color="#F59E0B" />
                    </>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary bg-surface p-2.5 rounded-lg">
                  <Fingerprint size={12} className="text-primary shrink-0" />
                  <span>AI Confidence: <strong className="text-foreground">{customer.overallAIConfidence}%</strong></span>
                  <span className="text-muted">·</span>
                  <span>Churn Risk: <strong className="text-foreground">{customer.churnRisk}</strong></span>
                </div>
              </PreviewSection>

              {/* 4. AI Insights */}
              <PreviewSection title="AI Insights" icon={Bot}>
                <div className="space-y-2">
                  {customer.predictiveInsights.slice(0, 4).map((insight, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: insight.color }} />
                        <span className="text-xs text-text-secondary truncate">{insight.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-semibold text-foreground">{insight.value}</span>
                        <span className="text-[10px] text-muted bg-surface-hover px-1.5 py-0.5 rounded">
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </PreviewSection>

              {/* 5. Recent Orders */}
              <PreviewSection title="Recent Orders" icon={ShoppingCart}>
                {customer.favouriteProducts.length > 0 ? (
                  <div className="space-y-2">
                    {customer.favouriteProducts.slice(0, 3).map((product, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Package size={13} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-text-secondary">{product.count} orders</p>
                        </div>
                        <ChevronRight size={14} className="text-muted shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">No orders yet.</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                  <span>Avg: <span className="font-medium text-foreground">₦{customer.averageOrderValue.toLocaleString()}</span></span>
                  <span className="text-muted">|</span>
                  <span>{customer.orderFrequency}</span>
                </div>
              </PreviewSection>

              {/* 6. Outstanding Payments */}
              <PreviewSection title="Outstanding Payments" icon={CreditCard}>
                <div className="space-y-2">
                  <InfoRow label="Method" value={customer.preferredPaymentMethod || '—'} icon={CreditCard} />
                  <InfoRow label="Avg Payment Time" value={customer.averagePaymentTime || '—'} icon={Clock} />
                  <InfoRow label="Reliability" value={`${customer.customerDNA.paymentReliability}%`} icon={CheckCircle} />
                  <InfoRow label="Next Purchase Likely" value={customer.estimatedNextPurchase} icon={TrendingUp} />
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface mt-1">
                    <span className="text-xs text-text-secondary">Upsell Opportunity</span>
                    <Badge variant={customer.upsellOpportunity === 'High' ? 'success' : customer.upsellOpportunity === 'Medium' ? 'warning' : 'info'} size="sm">
                      {customer.upsellOpportunity}
                    </Badge>
                  </div>
                </div>
              </PreviewSection>

              {/* 7. Communication History */}
              <PreviewSection title="Communication History" icon={MessageSquare}>
                <div className="space-y-2">
                  <InfoRow label="Preferred Channel" value={customer.preferredChannel} icon={MessageSquare} />
                  <InfoRow label="Avg Response Time" value={customer.avgResponseTime} icon={Clock} />
                  <InfoRow label="Engagement Score" value={`${customer.customerDNA.communicationEngagement}%`} icon={Activity} />
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-text-secondary">
                      Most active: <strong className="text-foreground">{customer.mostActiveMonth}</strong>
                    </span>
                  </div>
                </div>
              </PreviewSection>

              {/* 8. AI Recommendations */}
              <PreviewSection title="AI Recommendations" icon={Sparkles}>
                <div className="space-y-2">
                  {customer.recommendations.slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                      <Sparkles size={12} className="text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{rec.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PreviewSection>

              {/* 9. Timeline */}
              <PreviewSection title="Timeline" icon={Activity}>
                <div className="space-y-2">
                  {customer.timeline.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${event.color}15` }}>
                        <TimelineIcon iconType={event.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                        <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-2">{event.description}</p>
                      </div>
                      <span className="text-[10px] text-muted shrink-0 ml-1 mt-0.5">{event.time}</span>
                    </div>
                  ))}
                </div>
              </PreviewSection>

              {/* 10. Notes */}
              <PreviewSection title="Notes" icon={FileText}>
                <div className="p-3 rounded-lg bg-surface">
                  <p className="text-xs text-foreground leading-relaxed">{customer.aiSummary}</p>
                </div>
                {customer.nextBestActions.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">AI Recommended Actions</p>
                    {customer.nextBestActions.slice(0, 2).map((action, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                        <Gift size={12} className="text-primary shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-medium text-foreground">{action.title}</p>
                            <Badge variant={priorityBadgeVariant(action.priority)} size="sm">{action.priority}</Badge>
                          </div>
                          <p className="text-[10px] text-text-secondary mt-0.5">{action.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PreviewSection>
            </div>
          ) : (
            <ErrorState onClose={handleClose} />
          )}
        </div>
      </div>
    </>
  );
}