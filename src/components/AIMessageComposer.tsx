import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Bot, Sparkles, RefreshCw, Send, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Badge, Avatar, Button, Skeleton } from './ui';
import { SuccessAnimation } from './micro';
import { CUSTOMER_INTELLIGENCE, type CustomerIntelligence, ORDERS } from '../lib/constants';
import { generateCustomerMessage, getErrorMessage } from '../lib/ai-service';

interface AIMessageComposerProps {
  customerId: string;
  open: boolean;
  onClose: () => void;
}

export default function AIMessageComposer({ customerId, open, onClose }: AIMessageComposerProps) {
  const [customer, setCustomer] = useState<CustomerIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load customer data
  useEffect(() => {
    if (open && customerId) {
      setLoading(true);
      setError(null);
      setSent(false);
      setMessage('');
      setDraft('');
      setShowDiscardConfirm(false);
      const timer = setTimeout(() => {
        const found = CUSTOMER_INTELLIGENCE.find((c) => c.id === customerId);
        setCustomer(found || null);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, customerId]);

  // Generate AI draft
  useEffect(() => {
    if (customer && !draft) {
      generateDraft();
    }
  }, [customer]);

  // Auto-close after successful send
  useEffect(() => {
    if (sent) {
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 2000);
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      };
    }
  }, [sent, onClose]);

  const generateDraft = async () => {
    setDraftLoading(true);
    setError(null);
    try {
      const latestOrder = ORDERS.find((o) => o.customer === customer?.name);
      const context = `Latest order: ${latestOrder ? `${latestOrder.product} (₦${latestOrder.amount.toLocaleString()})` : 'No recent orders'}. Customer status: ${customer?.customerHealth}. Total orders: ${customer?.totalOrders}.`;
      const result = await generateCustomerMessage('compose', customer?.name || '', context, undefined, 'professional');
      if (result.error) {
        setDraft(getFallbackDraft(customer!));
      } else {
        setDraft(result.response);
      }
      setMessage(result.error ? getFallbackDraft(customer!) : result.response);
    } catch (err) {
      setDraft(getFallbackDraft(customer!));
      setMessage(getFallbackDraft(customer!));
    } finally {
      setDraftLoading(false);
    }
  };

  const getFallbackDraft = (c: CustomerIntelligence): string => {
    const latestOrder = ORDERS.find((o) => o.customer === c.name);
    const orderRef = latestOrder ? `your recent order of ${latestOrder.product} (₦${latestOrder.amount.toLocaleString()})` : 'your interest in our products';
    return `Hi ${c.name.split(' ')[0]},\n\nThank you for choosing Sweet Crumbs Bakery! We truly appreciate your business and wanted to follow up regarding ${orderRef}.\n\nAs a valued customer, we'd love to recommend our ${c.favouriteProducts[0]?.name || 'specialty items'} — perfect for your next celebration. Let us know if you'd like to place another order or have any questions.\n\nWarm regards,\nThe Sweet Crumbs Team`;
  };

  const handleRegenerate = () => {
    setDraft('');
    setMessage('');
    generateDraft();
  };

  const handleSend = async () => {
    setSending(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
  };

  const handleCancel = () => {
    if (message.trim()) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDiscardDraft = () => {
    setShowDiscardConfirm(false);
    onClose();
  };

  const handleContinueEditing = () => {
    setShowDiscardConfirm(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showDiscardConfirm) {
        setShowDiscardConfirm(false);
      } else if (!sent) {
        handleCancel();
      }
    }
  }, [showDiscardConfirm, sent]);

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

  // Focus header on open
  useEffect(() => {
    if (open && headerRef.current) {
      headerRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const latestOrder = customer ? ORDERS.find((o) => o.customer === customer.name) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={sent ? undefined : handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="AI Message Composer"
      >
        <div className="relative bg-card rounded-xl shadow-xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div
            ref={headerRef}
            tabIndex={-1}
            className="flex items-center justify-between px-5 py-4 border-b border-border"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare size={16} className="text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">AI Message Composer</h2>
                <p className="text-[11px] text-text-secondary">Customer Success Agent</p>
              </div>
            </div>
            {!sent && (
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Close composer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-5">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <SuccessAnimation />
                <h3 className="text-lg font-semibold text-foreground mt-4">Message sent successfully.</h3>
                <p className="text-sm text-text-secondary mt-1 max-w-xs">
                  Your message to {customer?.name} has been sent.
                </p>
                <p className="text-xs text-text-secondary mt-3 animate-pulse">
                  Closing automatically...
                </p>
              </div>
            ) : showDiscardConfirm ? (
              /* Discard confirmation dialog */
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} className="text-amber-500" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Discard this draft?</h3>
                <p className="text-sm text-text-secondary mt-1 max-w-xs mx-auto">
                  Your message draft will be lost if you discard it.
                </p>
                <div className="flex items-center gap-3 mt-6 justify-center">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleContinueEditing}
                  >
                    Continue Editing
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    className="text-danger hover:bg-danger/10"
                    onClick={handleDiscardDraft}
                  >
                    Discard Draft
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-10 w-full" />
                <Skeleton variant="text" className="h-10 w-full" />
                <Skeleton variant="text" className="h-24 w-full" />
              </div>
            ) : customer ? (
              <div className="space-y-4">
                {/* Auto-populated fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium mb-1">Customer</p>
                    <div className="flex items-center gap-2">
                      <Avatar initials={customer.avatar} size="sm" />
                      <span className="text-sm font-medium text-foreground">{customer.name}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium mb-1">Email</p>
                    <p className="text-sm text-foreground truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium mb-1">Latest Order</p>
                  <p className="text-sm font-medium text-foreground">
                    {latestOrder ? `${latestOrder.product} — ₦${latestOrder.amount.toLocaleString()}` : 'No recent orders'}
                  </p>
                  {latestOrder && (
                    <p className="text-xs text-text-secondary mt-0.5">{latestOrder.date} · {latestOrder.status}</p>
                  )}
                </div>

                {/* AI Draft */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-primary" />
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Suggested AI Draft</span>
                      {draftLoading && <span className="text-[10px] text-primary animate-pulse">Generating...</span>}
                    </div>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-36 p-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder={draftLoading ? 'AI is drafting a message...' : 'Write your message here...'}
                    aria-label="Message draft"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 text-sm text-danger">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    icon={sending ? undefined : <Send size={14} />}
                    loading={sending}
                    disabled={!message.trim() || sending}
                    onClick={handleSend}
                    className="flex-1"
                  >
                    {sending ? 'Sending...' : 'Approve & Send'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    icon={<RefreshCw size={14} className={draftLoading ? 'animate-spin' : ''} />}
                    disabled={draftLoading || sending}
                    onClick={handleRegenerate}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={sending}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={28} className="text-danger mb-3" />
                <p className="text-sm font-medium text-foreground">Could not load customer</p>
                <p className="text-xs text-text-secondary mt-1">This customer may no longer be available.</p>
                <Button variant="ghost" size="sm" className="mt-4" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}