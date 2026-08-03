import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight,
  Plus, Sparkles, Bot, DollarSign, Handshake, TrendingUp, Eye, Mail,
  BarChart3, Bell, Gift, FileText, MessageSquare, User, AlertTriangle, CreditCard,
  Zap, Calendar, X,
} from 'lucide-react';
import { Card, Button, Avatar } from '../components/ui';
import AIWorkspace from '../components/AIWorkspace';
import CreateOrderModal from '../components/CreateOrderModal';
import { useSwift } from '../context/SwiftContext';
import {
  KANBAN_ORDERS, TODAY_AI_ACTIVITIES, AI_INSIGHTS,
} from '../lib/constants';
import type { KanbanOrder } from '../lib/constants';

// ============================================================================
// Icon map
// ============================================================================
const iconMap: Record<string, LucideIcon> = {
  ShoppingCart, Clock, CheckCircle, AlertCircle, DollarSign, Bot, Handshake,
  TrendingUp, Eye, Mail, BarChart3, Bell, Gift, FileText, MessageSquare,
  User, AlertTriangle, CreditCard, Zap, Calendar, Plus, Sparkles,
};

// ============================================================================
// Helpers
// ============================================================================
const kanbanColumns = [
  { id: 'new' as const, label: 'New', icon: Clock, color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500' },
  { id: 'processing' as const, label: 'Processing', icon: Zap, color: '#4F46E5', bg: 'bg-indigo-50 dark:bg-indigo-900/20', dot: 'bg-indigo-500' },
  { id: 'completed' as const, label: 'Completed', icon: CheckCircle, color: '#22C55E', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-500' },
  { id: 'issue' as const, label: 'Issue', icon: AlertCircle, color: '#EF4444', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500' },
];

const priorityStyles: Record<string, string> = {
  high: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-400/30',
  medium: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-400/30',
  low: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 ring-slate-600/20 dark:ring-slate-400/30',
};

function getOrdersByStatus(orders: KanbanOrder[], status: string) {
  return orders.filter((o) => o.status === status);
}

// ============================================================================
// Summary Card
// ============================================================================
function SummaryCard({
  icon: Icon, label, count, change, trend, color,
}: {
  icon: LucideIcon; label: string; count: number; change: string; trend: 'up' | 'down'; color: string;
}) {
  return (
    <Card className="animate-fade-in-up" padding="md">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{count}</p>
          <div className={`inline-flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </div>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Kanban Card
// ============================================================================
function KanbanCard({
  order, onOpen,
}: {
  order: KanbanOrder; onOpen: (order: KanbanOrder) => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', order.id);
    e.currentTarget.classList.add('opacity-50');
  };
  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const paymentStatusStyles: Record<string, string> = {
    paid: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30',
    pending: 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30',
    failed: 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onOpen(order)}
      className="bg-card rounded-xl shadow-sm ring-1 ring-border p-4 cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        active:scale-[0.98]"
    >
      {/* Top row: ID + Priority */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-mono font-semibold text-primary">{order.id}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${priorityStyles[order.priority]}`}>
          {order.priority}
        </span>
      </div>

      {/* Customer + Product */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <Avatar initials={order.customerInitials} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{order.customer}</p>
          <p className="text-[11px] text-text-secondary truncate">{order.product}</p>
        </div>
      </div>

      {/* Amount */}
      <p className="text-base font-bold text-foreground mb-2.5">₦{order.amount.toLocaleString()}</p>

      {/* AI Recommendation Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium mb-2.5">
        <Sparkles size={12} className="shrink-0" />
        <span className="truncate">{order.aiRecommendation}</span>
      </div>

      {/* Bottom: Payment + Date */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${paymentStatusStyles[order.paymentStatus]}`}>
          {order.paymentStatus}
        </span>
        <span className="text-[11px] text-text-secondary">{order.date}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Kanban Column
// ============================================================================
function KanbanColumn({
  column, orders, onOpen, onDrop,
}: {
  column: typeof kanbanColumns[0];
  orders: KanbanOrder[];
  onOpen: (order: KanbanOrder) => void;
  onDrop: (orderId: string, newStatus: string) => void;
}) {
  const ColumnIcon = column.icon;
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const orderId = e.dataTransfer.getData('text/plain');
    onDrop(orderId, column.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl transition-colors duration-200 min-h-[300px] ${
        dragOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${column.bg}`}>
        <div className="flex items-center gap-2">
          <ColumnIcon size={16} style={{ color: column.color }} />
          <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
        </div>
        <span className="text-xs font-medium text-text-secondary bg-white dark:bg-surface px-2 py-0.5 rounded-full ring-1 ring-slate-200 dark:ring-border">
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3 p-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <KanbanCard key={order.id} order={order} onOpen={onOpen} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-hover flex items-center justify-center mb-2">
              <CheckCircle size={18} className="text-text-secondary" />
            </div>
            <p className="text-xs text-text-secondary">No orders</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Orders Page
// ============================================================================
export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState<KanbanOrder[]>(KANBAN_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<KanbanOrder | null>(null);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successNotification, setSuccessNotification] = useState<{ visible: boolean; customerName: string; productName: string }>({ visible: false, customerName: '', productName: '' });
  const newOrderBtnRef = useRef<HTMLButtonElement>(null);
  const { openSwift, clearMessages, sendMessage } = useSwift();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle quick action navigation from Dashboard
  useEffect(() => {
    if (location.state?.openNewOrder) {
      window.history.replaceState({}, document.title);
      requestAnimationFrame(() => {
        newOrderBtnRef.current?.focus();
      });
    }
  }, [location.state]);

  // Summary counts
  const summary = {
    pending: getOrdersByStatus(orders, 'new').length,
    processing: getOrdersByStatus(orders, 'processing').length,
    completedToday: getOrdersByStatus(orders, 'completed').length,
    awaitingPayment: orders.filter((o) => o.paymentStatus === 'pending').length,
  };

  // Drag & drop
  const handleDrop = useCallback((orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as KanbanOrder['status'] } : o))
    );
  }, []);

  // Handle successful order creation
  const handleOrderCreated = useCallback((order: KanbanOrder) => {
    setOrders((prev) => [order, ...prev]);
    setSuccessNotification({
      visible: true,
      customerName: order.customer,
      productName: order.product,
    });
    setTimeout(() => {
      setSuccessNotification({ visible: false, customerName: '', productName: '' });
    }, 4000);
  }, []);

  // Handle Create with AI
  const handleCreateWithAI = useCallback(() => {
    clearMessages();
    openSwift();
    // Small delay to let the panel open before sending the message
    setTimeout(() => {
      sendMessage("I'd like to create a new order. Can you help me with that? Let's start with the customer name.");
    }, 300);
  }, [clearMessages, openSwift, sendMessage]);

  // Empty state toggle
  if (showEmpty) {
    return (
      <div className="animate-fade-in-up space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Orders</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage customer orders while your AI workforce assists with quotations, approvals, payment verification and customer communication.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
              New Order
            </Button>
            <Button variant="secondary" size="md" icon={<Sparkles size={16} />} onClick={handleCreateWithAI}>
              Create with AI
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-5">
              <ShoppingCart size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
            <p className="text-sm text-text-secondary max-w-sm mb-6">
              Click &quot;Create with AI&quot; to generate your first order from a customer conversation.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
                New Order
              </Button>
              <Button variant="secondary" size="md" icon={<Sparkles size={16} />} onClick={handleCreateWithAI}>
                Create with AI
              </Button>
            </div>
            <button
              onClick={() => setShowEmpty(false)}
              className="mt-6 text-xs text-primary hover:text-indigo-700 dark:hover:text-indigo-400 underline underline-offset-2 transition-colors duration-150 cursor-pointer"
            >
              Show mock data
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ===== Page Header ===== */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Orders</h1>
          <p className="section-subtitle">
            Manage customer orders while your AI workforce assists with quotations, approvals, payment verification and customer communication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" icon={<Plus size={16} />} ref={newOrderBtnRef as React.Ref<HTMLButtonElement>} onClick={() => setShowCreateModal(true)}>
            New Order
          </Button>
          <Button variant="secondary" size="md" icon={<Sparkles size={16} />} onClick={handleCreateWithAI}>
            Create with AI
          </Button>
        </div>
      </div>

      {/* ===== Top Summary ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Clock}
          label="Pending Orders"
          count={summary.pending}
          change="+3 new"
          trend="up"
          color="#F59E0B"
        />
        <SummaryCard
          icon={Zap}
          label="Orders Processing"
          count={summary.processing}
          change="+2 this hour"
          trend="up"
          color="#4F46E5"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Completed Today"
          count={summary.completedToday}
          change="+12% vs yesterday"
          trend="up"
          color="#22C55E"
        />
        <SummaryCard
          icon={DollarSign}
          label="Awaiting Payment"
          count={summary.awaitingPayment}
          change="+1 flagged"
          trend="down"
          color="#EF4444"
        />
      </div>

      {/* ===== Main Content: Kanban + Sidebar ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-3 space-y-6">
          {/* Order Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanColumns.map((col) => (
              <div key={col.id} className="bg-slate-50/80 dark:bg-surface/50 rounded-xl ring-1 ring-slate-100 dark:ring-border">
                <KanbanColumn
                  column={col}
                  orders={getOrdersByStatus(orders, col.id)}
                  onOpen={setSelectedOrder}
                  onDrop={handleDrop}
                />
              </div>
            ))}
          </div>

          {/* ===== Smart Insights ===== */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Swift AI Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {AI_INSIGHTS.map((insight) => {
                const InsightIcon = iconMap[insight.actionIcon] || BarChart3;
                const borderColor = insight.type === 'revenue' ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/20' :
                  insight.type === 'warning' ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/20' :
                  'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20';
                const iconBg = insight.type === 'revenue' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300' :
                  insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300' :
                  'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300';
                return (
                  <div key={insight.id} className={`p-4 rounded-xl border ${borderColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
                        <InsightIcon size={14} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary capitalize">{insight.type}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-3">{insight.message}</p>
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg px-2 py-1 -ml-1"
                    >
                      <InsightIcon size={13} />
                      {insight.actionLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ===== Right Sidebar: Today's AI Activity ===== */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">
            <Card padding="none">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                  <h3 className="text-sm font-semibold text-foreground">Today&apos;s AI Activity</h3>
                </div>
              </div>
              <div className="divide-y divide-border">
                {TODAY_AI_ACTIVITIES.map((activity) => {
                  const ActivityIcon = iconMap[activity.agentIcon] || Bot;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors duration-150">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${activity.agentColor}15`, color: activity.agentColor }}
                      >
                        <ActivityIcon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground">
                          <span className="font-semibold">{activity.agentName}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium text-primary">{activity.target}</span>
                        </p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{activity.timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 border-t border-border">
                <button
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
                >
                  <Eye size={13} />
                  View All Activity
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== AI Workspace ===== */}
      {selectedOrder && (
        <AIWorkspace
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* ===== Create Order Modal ===== */}
      <CreateOrderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleOrderCreated}
      />

      {/* ===== Success Notification Toast ===== */}
      {successNotification.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up-fade-in">
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-5 py-3.5 rounded-2xl shadow-lg ring-1 ring-emerald-200/50 dark:ring-emerald-700/30 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Order created!</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-300/70">
                {successNotification.productName} for {successNotification.customerName}
              </p>
            </div>
            <button
              onClick={() => setSuccessNotification({ visible: false, customerName: '', productName: '' })}
              className="ml-2 p-1 rounded-lg text-emerald-500 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-200 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/50 transition-colors duration-150 cursor-pointer"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}