import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, CheckCircle, AlertCircle, Clock, Shield, DollarSign, FileText, AlertTriangle, Search, User } from 'lucide-react';
import { PAYMENTS } from '../lib/constants';

interface ReviewItem {
  id: string;
  type: 'payment' | 'approval' | 'flag' | 'invoice';
  customer: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  urgency: 'high' | 'medium' | 'low';
  reviewed: boolean;
}

const reviewItems: ReviewItem[] = [
  { id: 'R1', type: 'payment', customer: 'Grace Eze', description: 'Bank transfer for Custom Celebration Cake', amount: 185000, date: '2025-07-24 10:05', status: 'Pending', urgency: 'high', reviewed: false },
  { id: 'R2', type: 'payment', customer: 'Adaobi Nwosu', description: 'Bank transfer for Wedding Cake Package', amount: 450000, date: '2025-07-23 09:35', status: 'Pending', urgency: 'high', reviewed: false },
  { id: 'R3', type: 'approval', customer: 'Thabo Mokoena', description: 'Payment retry for Wedding Cake Package', amount: 450000, date: '2025-07-24 09:15', status: 'Awaiting Approval', urgency: 'high', reviewed: false },
  { id: 'R4', type: 'flag', customer: 'Thabo Mokoena', description: 'Bank declined — insufficient funds', amount: 450000, date: '2025-07-24 09:15', status: 'Flagged', urgency: 'high', reviewed: false },
  { id: 'R5', type: 'flag', customer: 'Tolu Adebayo', description: 'Subscription cancelled — payment failed', amount: 25000, date: '2025-07-23', status: 'Flagged', urgency: 'medium', reviewed: false },
  { id: 'R6', type: 'invoice', customer: 'Amaka Bello', description: 'Invoice for Corporate Dessert Package', amount: 95000, date: '2025-07-24', status: 'Awaiting Review', urgency: 'medium', reviewed: false },
  { id: 'R7', type: 'invoice', customer: 'Kofi Asante', description: 'Invoice for Premium Pastry Box', amount: 35000, date: '2025-07-24', status: 'Awaiting Review', urgency: 'low', reviewed: false },
  { id: 'R8', type: 'payment', customer: 'Naledi Dlamini', description: 'Mastercard payment — verified', amount: 145000, date: '2025-07-21', status: 'Verified', urgency: 'low', reviewed: true },
];

const typeIcons: Record<string, typeof DollarSign> = {
  payment: DollarSign,
  approval: Shield,
  flag: AlertTriangle,
  invoice: FileText,
};

const typeColors: Record<string, string> = {
  payment: '#4F46E5',
  approval: '#F59E0B',
  flag: '#EF4444',
  invoice: '#22C55E',
};

export default function FinanceReviewWorkspace({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState<ReviewItem[]>(reviewItems);
  const [filter, setFilter] = useState<string>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !isVisible) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, reviewed: true, status: 'Approved' } : item
    ));
  };

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, reviewed: true, status: 'Dismissed' } : item
    ));
  };

  const filtered = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !item.reviewed;
    if (filter === 'reviewed') return item.reviewed;
    return item.type === filter;
  });

  const pendingCount = items.filter((i) => !i.reviewed).length;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isVisible ? 'bg-black/30 backdrop-blur-sm' : 'bg-black/0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Finance Review Workspace"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-full sm:w-[520px] lg:w-[520px] bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Eye size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Finance Review</h2>
                <p className="text-[10px] text-text-secondary">{pendingCount} items awaiting review</p>
              </div>
            </div>
            <button
              ref={triggerRef}
              onClick={handleClose}
              className="p-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2.5 rounded-lg bg-amber-50 ring-1 ring-amber-200/50">
              <p className="text-lg font-bold text-amber-700">{items.filter((i) => i.type === 'payment' && !i.reviewed).length}</p>
              <p className="text-[10px] font-medium text-amber-600">Pending Payments</p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 ring-1 ring-red-200/50">
              <p className="text-lg font-bold text-red-700">{items.filter((i) => i.type === 'flag').length}</p>
              <p className="text-[10px] font-medium text-red-600">AI Flags</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 ring-1 ring-blue-200/50">
              <p className="text-lg font-bold text-blue-700">{items.filter((i) => i.type === 'invoice' && !i.reviewed).length}</p>
              <p className="text-[10px] font-medium text-blue-600">Invoices</p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'pending', label: 'Pending Review' },
              { key: 'reviewed', label: 'Reviewed' },
              { key: 'payment', label: 'Payments' },
              { key: 'flag', label: 'Flags' },
              { key: 'invoice', label: 'Invoices' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  filter === f.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover ring-1 ring-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle size={22} className="text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">All caught up!</p>
              <p className="text-xs text-text-secondary max-w-[200px]">
                No items match the current filter. Everything has been reviewed.
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = typeIcons[item.type] || DollarSign;
              const color = typeColors[item.type] || '#4F46E5';
              const urgencyColor = item.urgency === 'high' ? '#EF4444' : item.urgency === 'medium' ? '#F59E0B' : '#22C55E';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl ring-1 transition-all duration-150 ${
                    item.reviewed
                      ? 'bg-surface/30 ring-border/30 opacity-60'
                      : 'bg-card ring-border hover:ring-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground">{item.customer}</span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${color}12`, color }}
                        >
                          {item.type === 'payment' ? 'Payment' : item.type === 'approval' ? 'Approval' : item.type === 'flag' ? 'AI Flag' : 'Invoice'}
                        </span>
                        {!item.reviewed && (
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: urgencyColor }}
                          >
                            {item.urgency === 'high' ? 'High Priority' : item.urgency === 'medium' ? 'Medium' : 'Low'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mb-1">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">₦{item.amount.toLocaleString()}</span>
                        <span className="text-[10px] text-muted">·</span>
                        <span className="text-[10px] text-text-secondary">{item.date}</span>
                        <span className="text-[10px] text-muted">·</span>
                        <span className={`text-[10px] font-medium ${
                          item.status === 'Approved' || item.status === 'Verified'
                            ? 'text-emerald-600'
                            : item.status === 'Flagged' || item.status === 'Dismissed'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!item.reviewed && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200/50 transition-all duration-150 active:scale-[0.97] cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        {item.type === 'flag' ? 'Resolve' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDismiss(item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-surface text-text-secondary hover:bg-surface-hover ring-1 ring-border transition-all duration-150 active:scale-[0.97] cursor-pointer"
                      >
                        <X size={13} />
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-border bg-surface/50">
          <p className="text-[10px] text-text-secondary text-center">
            {items.filter((i) => !i.reviewed).length} items remaining · {items.filter((i) => i.reviewed).length} reviewed
          </p>
        </div>
      </div>
    </>
  );
}