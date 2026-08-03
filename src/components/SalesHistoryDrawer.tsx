import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, FileText, MessageSquare, ShoppingCart, TrendingUp, Clock, CheckCircle, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'quotation' | 'conversation' | 'order' | 'recommendation';
  title: string;
  customer: string;
  date: string;
  status: string;
  summary: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'H1', type: 'quotation', title: 'Quotation for Grace Eze', customer: 'Grace Eze', date: '2025-07-24 09:18', status: 'Completed', summary: 'Custom Celebration Cake — 3-Tier — ₦185,000' },
  { id: 'H2', type: 'quotation', title: 'Quotation for Amaka Bello', customer: 'Amaka Bello', date: '2025-07-24 11:35', status: 'Draft', summary: 'Corporate Dessert Package — 50 servings — ₦95,000' },
  { id: 'H3', type: 'order', title: 'Order #1048 — Grace Eze', customer: 'Grace Eze', date: '2025-07-24', status: 'Processing', summary: 'Custom Celebration Cake — ₦185,000 — Payment pending' },
  { id: 'H4', type: 'order', title: 'Order #1047 — Amaka Bello', customer: 'Amaka Bello', date: '2025-07-24', status: 'Pending', summary: 'Corporate Dessert Package — ₦95,000 — Awaiting approval' },
  { id: 'H5', type: 'order', title: 'Order #1045 — Brian Otieno', customer: 'Brian Otieno', date: '2025-07-22', status: 'Completed', summary: 'Corporate Dessert Package — ₦150,000 — Delivered' },
  { id: 'H6', type: 'conversation', title: 'WhatsApp Chat with Grace Eze', customer: 'Grace Eze', date: '2025-07-24', status: 'Active', summary: 'Customer confirmed order details and requested expedited delivery' },
  { id: 'H7', type: 'conversation', title: 'Email Thread with Amaka Bello', customer: 'Amaka Bello', date: '2025-07-23', status: 'Closed', summary: 'Discussed corporate dessert options for upcoming event' },
  { id: 'H8', type: 'recommendation', title: 'Recommended Celebration Cake to Grace', customer: 'Grace Eze', date: '2025-07-22', status: 'Accepted', summary: 'AI suggested Custom Celebration Cake based on past orders' },
  { id: 'H9', type: 'recommendation', title: 'Recommended Corporate Package to Amaka', customer: 'Amaka Bello', date: '2025-07-21', status: 'Pending', summary: 'AI recommended Corporate Dessert Package for business events' },
  { id: 'H10', type: 'quotation', title: 'Quotation for Adaobi Nwosu', customer: 'Adaobi Nwosu', date: '2025-07-23 08:05', status: 'Completed', summary: 'Wedding Cake — 5-Tier Premium — ₦450,000' },
  { id: 'H11', type: 'order', title: 'Order #1046 — Adaobi Nwosu', customer: 'Adaobi Nwosu', date: '2025-07-23', status: 'Processing', summary: 'Wedding Cake Package — ₦450,000 — Payment verification' },
  { id: 'H12', type: 'recommendation', title: 'Recommended Premium Cupcake to Grace', customer: 'Grace Eze', date: '2025-07-20', status: 'Accepted', summary: 'AI upsell recommendation for Premium Cupcake Collection' },
];

const typeColors: Record<string, string> = {
  quotation: '#4F46E5',
  conversation: '#8B5CF6',
  order: '#22C55E',
  recommendation: '#F59E0B',
};

const typeIcons: Record<string, typeof FileText> = {
  quotation: FileText,
  conversation: MessageSquare,
  order: ShoppingCart,
  recommendation: TrendingUp,
};

const typeLabels: Record<string, string> = {
  quotation: 'Quotation',
  conversation: 'Conversation',
  order: 'Order',
  recommendation: 'Recommendation',
};

export default function SalesHistoryDrawer({ onClose }: { onClose: () => void }) {
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

  const filtered = mockHistory.filter((item) => {
    const matchesSearch = search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: mockHistory.length,
    quotation: mockHistory.filter((i) => i.type === 'quotation').length,
    conversation: mockHistory.filter((i) => i.type === 'conversation').length,
    order: mockHistory.filter((i) => i.type === 'order').length,
    recommendation: mockHistory.filter((i) => i.type === 'recommendation').length,
  };

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
        aria-label="Sales Agent History"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[480px] bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Clock size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Sales History</h2>
                <p className="text-[10px] text-text-secondary">Completed quotations, orders & conversations</p>
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

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface text-sm text-foreground placeholder:text-muted ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
              aria-label="Search history"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
            {(['all', 'quotation', 'conversation', 'order', 'recommendation'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  filter === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover ring-1 ring-border'
                }`}
              >
                {type !== 'all' && React.createElement(typeIcons[type], { size: 12 })}
                {type === 'all' ? 'All' : typeLabels[type]}
                <span className={`text-[10px] ${filter === type ? 'text-white/70' : 'text-muted'}`}>
                  {counts[type]}
                </span>
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
              <p className="text-sm font-medium text-foreground mb-1">No results found</p>
              <p className="text-xs text-text-secondary max-w-[200px]">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              const color = typeColors[item.type] || '#4F46E5';
              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 p-3.5 rounded-xl bg-surface/50 hover:bg-surface-hover ring-1 ring-border/50 hover:ring-border transition-all duration-150 cursor-default"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                      <span
                        className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}12`, color }}
                      >
                        {typeLabels[item.type]}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-1 line-clamp-1">{item.summary}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-secondary">{item.customer}</span>
                      <span className="text-[10px] text-muted">·</span>
                      <span className="text-[10px] text-text-secondary">{item.date}</span>
                      <span className="text-[10px] text-muted">·</span>
                      <span className={`text-[10px] font-medium ${
                        item.status === 'Completed' || item.status === 'Accepted' || item.status === 'Closed'
                          ? 'text-emerald-600'
                          : item.status === 'Processing' || item.status === 'Active' || item.status === 'Pending'
                          ? 'text-amber-600'
                          : 'text-text-secondary'
                      }`}>
                        {item.status}
                      </span>
                    </div>
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
            Showing {filtered.length} of {mockHistory.length} history items
          </p>
        </div>
      </div>
    </>
  );
}