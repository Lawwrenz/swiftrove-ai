import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Mail, Phone, MapPin, Calendar, ShoppingCart, CreditCard, Workflow, MessageSquare, FileText, Activity, Sparkles, Heart, Shield, TrendingUp, AlertCircle, CheckCircle, Clock, Star, Zap, Gift, Users, XCircle } from 'lucide-react';
import { Card, Badge, Avatar, Button, Skeleton } from '../components/ui';
import { CUSTOMER_INTELLIGENCE, type CustomerIntelligence } from '../lib/constants';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShoppingCart, CreditCard, Workflow, MessageSquare, FileText, Activity, Sparkles, Heart, Shield, TrendingUp, CheckCircle, Clock, Star, Zap, Gift, Users, XCircle, Bot, Mail, Phone, MapPin, Calendar,
};

// ============================================================================
// Section Wrapper
// ============================================================================
function Section({ title, icon: Icon, children, loading }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode; loading?: boolean }) {
  return (
    <Card className="animate-slide-up-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {loading ? (
        <div className="space-y-3">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/2" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
      ) : children}
    </Card>
  );
}

// ============================================================================
// DNA Gauge
// ============================================================================
function DnaGauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ============================================================================
// Health Badge
// ============================================================================
function HealthBadge({ health }: { health: string }) {
  const colors: Record<string, string> = {
    Excellent: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
    Healthy: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400',
    Growing: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
    'At Risk': 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400',
    Churned: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${colors[health] || colors.Healthy}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {health}
    </span>
  );
}

export default function CustomerIntelligenceProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id) {
      setError('No customer ID provided.');
      setLoading(false);
      return;
    }
    // Simulate loading
    const timer = setTimeout(() => {
      const found = CUSTOMER_INTELLIGENCE.find((c) => c.id === id);
      if (found) {
        setCustomer(found);
        setError(null);
      } else {
        setError('Customer not found. They may have been removed.');
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  // Handle error state
  if (error && !loading) {
    return (
      <div className="page-container max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Couldn't load this profile</h2>
          <p className="text-sm text-text-secondary mb-6 max-w-md">{error}</p>
          <Button variant="primary" onClick={() => navigate('/customers')}>
            Browse Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          {loading ? (
            <div className="space-y-2">
              <Skeleton variant="text" className="h-6 w-48" />
              <Skeleton variant="text" className="h-4 w-32" />
            </div>
          ) : customer && (
            <div className="flex items-center gap-4">
              <Avatar initials={customer.avatar} size="lg" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground">{customer.name}</h1>
                  {customer.isVIP && (
                    <Badge variant="warning" size="sm">
                      <Star size={10} className="mr-1" /> VIP
                    </Badge>
                  )}
                  <HealthBadge health={customer.customerHealth} />
                </div>
                <p className="text-sm text-text-secondary">{customer.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" />)}
          </div>
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-64" />
        </div>
      ) : customer ? (
        <div className="space-y-6">
          {/* ── Customer Overview ── */}
          <Section title="Customer Overview" icon={Bot}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary mb-1">Lifetime Value</p>
                <p className="text-lg font-bold text-foreground">{customer.lifetimeValueLabel}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary mb-1">Total Orders</p>
                <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary mb-1">Relationship Score</p>
                <p className="text-lg font-bold text-foreground">{customer.relationshipScore}/100</p>
              </div>
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary mb-1">Member Since</p>
                <p className="text-lg font-bold text-foreground">{customer.memberSince}</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-primary/5 ring-1 ring-primary/10">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{customer.aiSummary}</p>
              </div>
            </div>
          </Section>

          {/* ── Contact Details ── */}
          <Section title="Contact Details" icon={Mail}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <Mail size={16} className="text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="text-sm font-medium text-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <Phone size={16} className="text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Phone</p>
                  <p className="text-sm font-medium text-foreground">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <MapPin size={16} className="text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Location</p>
                  <p className="text-sm font-medium text-foreground">{customer.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <MessageSquare size={16} className="text-muted shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Preferred Channel</p>
                  <p className="text-sm font-medium text-foreground">{customer.preferredChannel}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Customer Health Score ── */}
          <Section title="Customer Health Score" icon={Heart}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Customer DNA</p>
                <DnaGauge label="Buying Frequency" value={customer.customerDNA.buyingFrequency} color="#4F46E5" />
                <DnaGauge label="Payment Reliability" value={customer.customerDNA.paymentReliability} color="#22C55E" />
                <DnaGauge label="Communication Engagement" value={customer.customerDNA.communicationEngagement} color="#8B5CF6" />
                <DnaGauge label="Loyalty" value={customer.customerDNA.loyalty} color="#F59E0B" />
                <DnaGauge label="Upsell Readiness" value={customer.customerDNA.upsellReadiness} color="#EC4899" />
                <DnaGauge label="Customer Satisfaction" value={customer.customerDNA.customerSatisfaction} color="#06B6D4" />
              </div>
              <div className="space-y-4">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Predictive Insights</p>
                {customer.predictiveInsights.map((insight, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <span className="text-sm text-text-secondary">{insight.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{insight.value}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{insight.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── AI Insights ── */}
          <Section title="AI Insights" icon={Sparkles}>
            <div className="space-y-4">
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">AI Evidence</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customer.aiEvidence.map((evidence, i) => {
                  const EvidenceIcon = iconMap[evidence.icon] || CheckCircle;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <EvidenceIcon size={15} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{evidence.label}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{evidence.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mt-6">Next Best Actions</p>
              <div className="space-y-2">
                {customer.nextBestActions.map((action, i) => {
                  const ActionIcon = iconMap[action.icon] || Zap;
                  const priorityColors = { high: 'text-red-600', medium: 'text-amber-600', low: 'text-text-secondary' };
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        action.priority === 'high' ? 'bg-danger/10' : action.priority === 'medium' ? 'bg-warning/10' : 'bg-surface-hover'
                      }`}>
                        <ActionIcon size={15} className={priorityColors[action.priority]} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{action.title}</p>
                          <Badge variant={action.priority === 'high' ? 'danger' : action.priority === 'medium' ? 'warning' : 'neutral'} size="sm">{action.priority}</Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{action.explanation}</p>
                        <p className="text-xs text-primary mt-0.5">{action.impact}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* ── Order History ── */}
          <Section title="Order History" icon={ShoppingCart}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface text-xs text-text-secondary font-medium">
                <span className="flex-1">Product</span>
                <span className="w-20 text-right">Amount</span>
                <span className="w-24 text-right">Date</span>
              </div>
              {customer.favouriteProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{product.name}</span>
                  </div>
                  <span className="w-20 text-right text-sm font-medium text-foreground">{product.count}x</span>
                  <span className="w-24 text-right text-xs text-text-secondary">—</span>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-surface text-sm text-text-secondary">
                <span className="font-medium text-foreground">Average Order Value: </span>
                ₦{customer.averageOrderValue.toLocaleString()}
                <span className="mx-2">·</span>
                <span className="font-medium text-foreground">Frequency: </span>
                {customer.orderFrequency}
              </div>
            </div>
          </Section>

          {/* ── Payment History ── */}
          <Section title="Payment History" icon={CreditCard}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary">Preferred Method</p>
                <p className="text-sm font-medium text-foreground mt-1">{customer.preferredPaymentMethod}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary">Average Payment Time</p>
                <p className="text-sm font-medium text-foreground mt-1">{customer.averagePaymentTime}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface">
                <p className="text-xs text-text-secondary">Payment Reliability</p>
                <p className="text-sm font-medium text-foreground mt-1">{customer.customerDNA.paymentReliability}%</p>
              </div>
            </div>
          </Section>

          {/* ── Workflow History ── */}
          <Section title="Workflow History" icon={Workflow}>
            <div className="space-y-2">
              {customer.activeWorkflowStages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    stage.completed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    stage.active ? 'bg-primary/10 text-primary animate-pulse-dot' : 'bg-surface-hover text-muted'
                  }`}>
                    {stage.completed ? <CheckCircle size={14} /> : stage.active ? <Clock size={14} /> : <span className="w-1.5 h-1.5 rounded-full bg-muted" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{stage.label}</p>
                    {stage.agent && <p className="text-xs text-text-secondary">By: {stage.agent}</p>}
                  </div>
                  {stage.completed && <Badge variant="success" size="sm">Done</Badge>}
                  {stage.active && <Badge variant="info" size="sm" dot>In Progress</Badge>}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Communication Timeline ── */}
          <Section title="Communication Timeline" icon={MessageSquare}>
            <div className="space-y-0">
              {customer.timeline.map((event, idx) => {
                const EventIcon = iconMap[event.icon] || MessageSquare;
                return (
                  <div key={event.id} className="flex gap-4 pb-5 relative last:pb-0">
                    {idx < customer.timeline.length - 1 && (
                      <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
                    )}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-card" style={{ backgroundColor: `${event.color}15`, color: event.color }}>
                      <EventIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{event.description}</p>
                      <p className="text-[11px] text-muted mt-1">{event.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── Notes ── */}
          <Section title="Notes" icon={FileText}>
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 ring-1 ring-amber-200/50 dark:ring-amber-500/20">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">AI Summary</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{customer.aiSummary}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {customer.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                  <Lightbulb size={15} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-text-secondary">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Recent Activity ── */}
          <Section title="Recent Activity" icon={Activity}>
            <div className="space-y-3">
              {customer.timeline.slice(0, 5).map((event) => {
                const EventIcon = iconMap[event.icon] || Activity;
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors duration-150">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0" style={{ color: event.color }}>
                      <EventIcon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-text-secondary truncate">{event.description}</p>
                    </div>
                    <span className="text-[11px] text-muted shrink-0">{event.time}</span>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      ) : null}
    </div>
  );
}

function Lightbulb({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5C7.7 12.8 8 13.5 8 14" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}