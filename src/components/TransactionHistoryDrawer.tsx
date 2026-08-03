import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, ArrowRightLeft, CheckCircle, Clock, XCircle, CreditCard, FileText, ChevronRight } from 'lucide-react';
import { PAYMENTS } from '../lib/constants';

const statusIcons: Record<string, typeof CheckCircle> = {
  verified: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

const statusColors: Record<string, string> = {
  verified: '#22C55E',
  pending: '#F59E0B',
  failed: '#EF4444',
};

const methodLabels: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
  bank_transfer: 'Bank Transfer',
};

export default function TransactionHistoryDrawer({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    setTimeout(() => searchRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const filtered = PAYMENTS.filter((p) => {
    const matchesSearch = search === '' ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

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
        aria-label="Transaction History"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[480px] bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <ArrowRightLeft size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Transaction History</h2>
                <p className="text-[10px] text-text-secondary">Recent payments, invoices & transaction status</p>
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

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 ring-1 ring-emerald-200/50">
              <p className="text-lg font-bold text-emerald-700">{PAYMENTS.filter((p) => p.status === 'verified').length}</p>
              <p className="text-[10px] font-medium text-emerald-600">Verified</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 ring-1 ring-amber-200/50">
              <p className="text-lg font-bold text-amber-700">{PAYMENTS.filter((p) => p.status === 'pending').length}</p>
              <p className="text-[10px] font-medium text-amber-600">Pending</p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 ring-1 ring-red-200/50">
              <p className="text-lg font-bold text-red-700">{PAYMENTS.filter((p) => p.status === 'failed').length}</p>
              <p className="text-[10px] font-medium text-red-600">Failed</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or ID..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface text-sm text-foreground placeholder:text-muted ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
              aria-label="Search transactions"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'verified', label: 'Verified' },
              { key: 'pending', label: 'Pending' },
              { key: 'failed', label: 'Failed' },
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
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-3">
                <Search size={22} className="text-muted" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No transactions found</p>
              <p className="text-xs text-text-secondary max-w-[200px]">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            filtered.map((payment) => {
              const StatusIcon = statusIcons[payment.status] || Clock;
              const color = statusColors[payment.status] || '#6B7280';
              return (
                <div
                  key={payment.id}
                  className="group flex items-start gap-3 p-3.5 rounded-xl bg-surface/50 hover:bg-surface-hover ring-1 ring-border/50 hover:ring-border transition-all duration-150 cursor-default"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <StatusIcon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{payment.customer}</span>
                      <span className="text-[10px] text-muted">{payment.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <CreditCard size={11} className="text-muted" />
                      <span className="text-xs text-text-secondary">
                        {methodLabels[payment.method] || payment.method}
                      </span>
                      <span className="text-[10px] text-muted">·</span>
                      <span className="text-xs text-text-secondary">{payment.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">₦{payment.amount.toLocaleString()}</span>
                      <span className="text-[10px] text-muted">·</span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color }}
                      >
                        {payment.status === 'verified' ? 'Verified' : payment.status === 'pending' ? 'Pending' : 'Failed'}
                      </span>
                    </div>
                    {payment.invoiceItems && payment.invoiceItems.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {payment.invoiceItems.map((item, i) => (
                          <span key={i} className="text-[10px] text-muted bg-surface rounded px-1.5 py-0.5">
                            {item.description} × {item.qty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-muted group-hover:text-text-secondary transition-colors duration-150 shrink-0 mt-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-border bg-surface/50">
          <p className="text-[10px] text-text-secondary text-center">
            {filtered.length} transactions · Total: ₦{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
}