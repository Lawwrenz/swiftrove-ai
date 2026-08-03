import { useState, useEffect, useCallback } from 'react';
import {
  X, User, Package, Hash, DollarSign, Globe, Calendar, FileText, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from './ui';
import { createOrder } from '../lib/supabase-service';
import { supabase } from '../lib/supabase';
import type { Customer } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (order: any) => void;
}

interface FormData {
  customer_id: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  amount: number;
  currency: string;
  due_date: string;
  notes: string;
  status: string;
}

interface FormErrors {
  customer_id?: string;
  product_name?: string;
  quantity?: string;
  amount?: string;
}

// ============================================================================
// Currency options
// ============================================================================

const CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP', 'KES', 'GHS', 'ZAR', 'XOF'];

// ============================================================================
// Status options
// ============================================================================

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

// ============================================================================
// Helper: generate order number
// ============================================================================

function generateOrderNumber(): string {
  const lastNum = parseInt(localStorage.getItem('lastOrderNum') || '1048', 10);
  const nextNum = lastNum + 1;
  localStorage.setItem('lastOrderNum', nextNum.toString());
  return `ORD-${nextNum}`;
}

// ============================================================================
// CreateOrderModal Component
// ============================================================================

export default function CreateOrderModal({ open, onClose, onSuccess }: CreateOrderModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [saving, setSaving] = useState<'idle' | 'draft' | 'create'>('idle');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormData>({
    customer_id: '',
    customer_name: '',
    product_name: '',
    quantity: 1,
    amount: 0,
    currency: 'NGN',
    due_date: '',
    notes: '',
    status: 'pending',
  });

  // Load customers
  useEffect(() => {
    if (!open) return;
    const loadCustomers = async () => {
      setCustomersLoading(true);
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, full_name, email, company')
          .order('full_name', { ascending: true });
        if (error) throw error;
        setCustomers(data || []);
      } catch {
        // Silently fail — customers field will just show typing
      } finally {
        setCustomersLoading(false);
      }
    };
    loadCustomers();
  }, [open]);

  // Reset form on open
  useEffect(() => {
    if (open) {
      setForm({
        customer_id: '',
        customer_name: '',
        product_name: '',
        quantity: 1,
        amount: 0,
        currency: 'NGN',
        due_date: '',
        notes: '',
        status: 'pending',
      });
      setErrors({});
      setSuccess(false);
      setSaving('idle');
      setSearchQuery('');
      setShowCustomerDropdown(false);
    }
  }, [open]);

  // Keyboard: Escape to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.customer_id) errs.customer_id = 'Please select a customer';
    if (!form.product_name.trim()) errs.product_name = 'Product name is required';
    if (form.quantity < 1) errs.quantity = 'Quantity must be at least 1';
    if (form.amount <= 0) errs.amount = 'Amount must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSave = useCallback(async (status: 'draft' | 'create') => {
    if (!validate()) return;

    setSaving(status === 'draft' ? 'draft' : 'create');

    try {
      const orderNumber = generateOrderNumber();
      const orderStatus = status === 'draft' ? 'pending' : (form.status as any);

      const newOrder = await createOrder({
        customer_id: form.customer_id,
        order_number: orderNumber,
        product_name: form.product_name.trim(),
        quantity: form.quantity,
        amount: form.amount,
        currency: form.currency,
        status: orderStatus,
        due_date: form.due_date || null,
        notes: form.notes.trim() || null,
        workflow_stage: 'inquiry',
        created_by: null,
      });

      setSuccess(true);

      // Build a KanbanOrder-like object for the board
      const customer = customers.find((c) => c.id === form.customer_id);
      const initials = customer?.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'NA';

      const kanbanOrder = {
        id: orderNumber,
        customer: customer?.full_name || form.customer_name,
        customerInitials: initials,
        product: form.product_name.trim(),
        amount: form.amount,
        quantity: form.quantity,
        currency: form.currency,
        status: 'new' as const,
        priority: 'medium' as const,
        aiRecommendation: 'New order created — awaiting processing',
        date: new Date().toISOString().split('T')[0],
        items: [{ name: form.product_name.trim(), qty: form.quantity, price: form.amount }],
        customerInfo: {
          name: customer?.full_name || form.customer_name,
          email: customer?.email || '',
          phone: '',
        },
        shippingAddress: '',
        paymentStatus: 'pending' as const,
        internalNotes: form.notes ? [{ text: form.notes, author: 'Staff', time: 'Just now' }] : [],
        timeline: [
          { status: 'Order Created', date: new Date().toISOString(), completed: true, agent: 'Staff', agentInitials: 'ST' },
        ],
      };

      // Brief delay to show success state
      setTimeout(() => {
        onSuccess(kanbanOrder);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrors({ ...errors, product_name: err.message || 'Failed to create order. Please try again.' });
      setSaving('idle');
    }
  }, [form, validate, customers, errors, onSuccess, onClose]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create New Order"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-scale-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">New Order</h2>
              <p className="text-xs text-text-secondary">Create a new customer order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Order Created!</h3>
            <p className="text-sm text-text-secondary">
              {form.product_name} for {form.customer_name} has been saved.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Customer Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Customer <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery || form.customer_name}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowCustomerDropdown(true);
                    if (!e.target.value) {
                      setForm({ ...form, customer_id: '', customer_name: '' });
                    }
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Search or type customer name..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted
                    transition-all duration-150 bg-card
                    focus:outline-none focus:ring-2
                    ${errors.customer_id ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                  autoComplete="off"
                />
                {customersLoading && (
                  <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted animate-spin" />
                )}
              </div>
              {errors.customer_id && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.customer_id}
                </p>
              )}

              {/* Customer dropdown */}
              {showCustomerDropdown && (searchQuery || filteredCustomers.length > 0) && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg ring-1 ring-slate-200 max-h-48 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, customer_id: c.id, customer_name: c.full_name });
                          setSearchQuery(c.full_name);
                          setShowCustomerDropdown(false);
                          setErrors({ ...errors, customer_id: undefined });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-indigo-50 transition-colors duration-100 cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {c.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{c.full_name}</p>
                          {c.email && (
                            <p className="text-[11px] text-text-secondary truncate">{c.email}</p>
                          )}
                        </div>
                        {c.company && (
                          <span className="text-[10px] text-muted shrink-0">{c.company}</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-text-secondary text-center">
                      No customers found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Product / Service <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={form.product_name}
                  onChange={(e) => {
                    setForm({ ...form, product_name: e.target.value });
                    setErrors({ ...errors, product_name: undefined });
                  }}
                  placeholder="e.g. Custom Celebration Cake"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted
                    transition-all duration-150 bg-card
                    focus:outline-none focus:ring-2
                    ${errors.product_name ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                />
              </div>
              {errors.product_name && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.product_name}
                </p>
              )}
            </div>

            {/* Quantity + Currency row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Quantity <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, parseInt(e.target.value) || 1);
                      setForm({ ...form, quantity: qty });
                      setErrors({ ...errors, quantity: undefined });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-foreground
                      transition-all duration-150 bg-card
                      focus:outline-none focus:ring-2
                      ${errors.quantity ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                  />
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-xs text-danger flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.quantity}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm text-foreground bg-card
                      focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all duration-150 appearance-none cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Amount <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.amount || ''}
                  onChange={(e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    setForm({ ...form, amount: amt });
                    setErrors({ ...errors, amount: undefined });
                  }}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted
                    transition-all duration-150 bg-card
                    focus:outline-none focus:ring-2
                    ${errors.amount ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-danger flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm text-foreground bg-card
                    focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all duration-150"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <div className="relative">
                <CheckCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm text-foreground bg-card
                    focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all duration-150 appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-muted pointer-events-none" />
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes or instructions..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm text-foreground placeholder:text-muted bg-card
                    focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all duration-150 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="md"
              loading={saving === 'draft'}
              disabled={saving !== 'idle'}
              onClick={() => handleSave('draft')}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Package size={16} />}
              loading={saving === 'create'}
              disabled={saving !== 'idle'}
              onClick={() => handleSave('create')}
            >
              Create Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}