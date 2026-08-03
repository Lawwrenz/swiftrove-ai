// ============================================================================
// Swiftrove AI — Customer Success Agent
// Dedicated AI employee managing every customer relationship
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  MessageSquare, Send, Clock, Heart, Sparkles, Bot, Activity,
  CheckCircle, AlertCircle, ChevronRight, Search, Zap,
  Star, Gift, Calendar, Share2, Eye, FileText,
  ArrowRight, RefreshCw, X, Pencil,
} from 'lucide-react';
import { AnimatedCounter } from '../components/micro';
import { generateCustomerMessage, getErrorMessage } from '../lib/ai-service';

// ============================================================================
// Types
// ============================================================================

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  suffix?: string;
}

interface Conversation {
  customer: string;
  initials: string;
  status: string;
  statusColor: string;
  lastMessage: string;
  time: string;
  aiStatus: string;
  aiStatusColor: string;
}

interface FollowUp {
  customer: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  suggestedTime: string;
  aiRecommendation: string;
}

interface TimelineEvent {
  icon: LucideIcon;
  color: string;
  bg: string;
  title: string;
  description: string;
  time: string;
}

interface SentimentCard {
  label: string;
  color: string;
  bg: string;
  confidence: number;
  latestInteraction: string;
  suggestedAction: string;
}

interface RetentionOpportunity {
  title: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  reason: string;
  impact: string;
  confidence: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const STATS: StatCard[] = [
  { label: 'Active Conversations', value: 128, icon: MessageSquare, color: '#4F46E5', bg: 'bg-indigo-50' },
  { label: 'Messages Sent Today', value: 54, icon: Send, color: '#22C55E', bg: 'bg-emerald-50' },
  { label: 'Pending Follow-ups', value: 8, icon: Clock, color: '#F59E0B', bg: 'bg-amber-50' },
  { label: 'Customer Satisfaction', value: 96, icon: Heart, color: '#EC4899', bg: 'bg-pink-50', suffix: '%' },
];

const CONVERSATIONS: Conversation[] = [
  {
    customer: 'Grace Eze',
    initials: 'GE',
    status: 'Order Confirmed',
    statusColor: '#22C55E',
    lastMessage: 'Your celebration cake is confirmed for Saturday at 10:00 AM.',
    time: '5m ago',
    aiStatus: 'Confirmed',
    aiStatusColor: '#22C55E',
  },
  {
    customer: 'Amaka Bello',
    initials: 'AB',
    status: 'Awaiting Follow-up',
    statusColor: '#F59E0B',
    lastMessage: 'Thank you for your inquiry. I will send the quotation shortly.',
    time: '1h ago',
    aiStatus: 'Drafting quotation',
    aiStatusColor: '#4F46E5',
  },
  {
    customer: 'Chinedu Okafor',
    initials: 'CO',
    status: 'Delivery Scheduled',
    statusColor: '#4F46E5',
    lastMessage: 'Your delivery is scheduled for tomorrow at 2:00 PM.',
    time: '2h ago',
    aiStatus: 'Prepared',
    aiStatusColor: '#22C55E',
  },
  {
    customer: 'Adaobi Nwosu',
    initials: 'AN',
    status: 'Quotation Sent',
    statusColor: '#8B5CF6',
    lastMessage: 'Wedding Cake Package quotation has been sent for your review.',
    time: '3h ago',
    aiStatus: 'Awaiting approval',
    aiStatusColor: '#F59E0B',
  },
  {
    customer: 'Thabo Mokoena',
    initials: 'TM',
    status: 'Payment Issue',
    statusColor: '#EF4444',
    lastMessage: 'We noticed your payment was declined. Let us help you resolve this.',
    time: '30m ago',
    aiStatus: 'Alert sent',
    aiStatusColor: '#EF4444',
  },
];

const FOLLOW_UPS: FollowUp[] = [
  { customer: 'Grace Eze', reason: 'Confirm delivery time', priority: 'high', suggestedTime: 'Today, 10:00 AM', aiRecommendation: 'Send confirmation message with delivery details' },
  { customer: 'Amaka Bello', reason: 'Send quotation', priority: 'high', suggestedTime: 'Today, 12:00 PM', aiRecommendation: 'Corporate Dessert Package quotation ready for review' },
  { customer: 'Chinedu Okafor', reason: 'Payment reminder', priority: 'medium', suggestedTime: 'Tomorrow, 9:00 AM', aiRecommendation: 'Gentle reminder for pending payment of N190,000' },
  { customer: 'Adaobi Nwosu', reason: 'Follow up on quotation', priority: 'medium', suggestedTime: 'Tomorrow, 2:00 PM', aiRecommendation: 'Customer viewed quotation — send portfolio images' },
  { customer: 'Tolu Adebayo', reason: 'Retention offer response', priority: 'low', suggestedTime: 'In 2 days', aiRecommendation: 'Customer is reviewing 20% discount offer' },
  { customer: 'Kofi Asante', reason: 'Share product photos', priority: 'low', suggestedTime: 'In 2 days', aiRecommendation: 'New lead — share Premium Pastry Box images' },
  { customer: 'Faith Njeri', reason: 'Send recommendations', priority: 'medium', suggestedTime: 'Tomorrow, 11:00 AM', aiRecommendation: 'Trial user — recommend Birthday Cake Package' },
  { customer: 'Ama Boateng', reason: 'Re-engagement campaign', priority: 'low', suggestedTime: 'This weekend', aiRecommendation: 'Dormant 3+ months — offer welcome back discount' },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  { icon: MessageSquare, color: '#4F46E5', bg: 'bg-indigo-100', title: 'Inquiry Received', description: 'Grace Eze submitted a new inquiry for a Custom Celebration Cake.', time: '2 hours ago' },
  { icon: FileText, color: '#F59E0B', bg: 'bg-amber-100', title: 'Quotation Sent', description: 'Sales Agent sent a quotation for the Custom Celebration Cake — 3-Tier.', time: '1 hour ago' },
  { icon: CheckCircle, color: '#22C55E', bg: 'bg-emerald-100', title: 'Payment Verified', description: 'Finance Agent confirmed the bank transfer of N185,000 from Grace Eze.', time: '30 minutes ago' },
  { icon: Send, color: '#8B5CF6', bg: 'bg-violet-100', title: 'Confirmation Prepared', description: 'Customer Success prepared confirmation message for Grace Eze.', time: '15 minutes ago' },
  { icon: Calendar, color: '#4F46E5', bg: 'bg-indigo-100', title: 'Delivery Scheduled', description: 'Delivery scheduled for Saturday at 10:00 AM to 12 Awolowo Road, Ikoyi.', time: '5 minutes ago' },
  { icon: CheckCircle, color: '#22C55E', bg: 'bg-emerald-100', title: 'Order Completed', description: 'Order #1048 marked as completed. Customer notified.', time: 'Just now' },
  { icon: Star, color: '#F59E0B', bg: 'bg-amber-100', title: 'Review Received', description: 'Grace Eze left a 5-star review: "Absolutely stunning! Thank you!"', time: 'Pending' },
];

const SENTIMENTS: SentimentCard[] = [
  { label: 'Very Positive', color: '#22C55E', bg: 'bg-emerald-50', confidence: 94, latestInteraction: 'Grace Eze — "Everything was perfect! Thank you so much!"', suggestedAction: 'Request a testimonial for the website' },
  { label: 'Positive', color: '#4F46E5', bg: 'bg-indigo-50', confidence: 87, latestInteraction: 'Kwame Mensah — "The cake was great, my family loved it."', suggestedAction: 'Enrol in VIP loyalty programme' },
  { label: 'Neutral', color: '#F59E0B', bg: 'bg-amber-50', confidence: 62, latestInteraction: 'Adaobi Nwosu — "Still deciding on the wedding cake package."', suggestedAction: 'Share wedding cake portfolio and testimonials' },
  { label: 'Needs Attention', color: '#EF4444', bg: 'bg-red-50', confidence: 45, latestInteraction: 'Thabo Mokoena — "Payment was declined. What do I do?"', suggestedAction: 'Contact customer with alternative payment options' },
];

const RETENTION_OPPORTUNITIES: RetentionOpportunity[] = [
  { title: 'Offer Loyalty Discount', icon: Gift, color: '#4F46E5', bg: 'bg-indigo-50', reason: 'Grace Eze has ordered 3 times this month — reward loyalty', impact: 'Expected retention increase of 18%', confidence: 94 },
  { title: 'Recommend Premium Cupcake Collection', icon: Zap, color: '#EC4899', bg: 'bg-pink-50', reason: 'Grace frequently orders celebration cakes — upsell opportunity', impact: 'Potential AOV increase: ₦12,000–₦18,000', confidence: 91 },
  { title: 'Schedule Follow-up', icon: Calendar, color: '#8B5CF6', bg: 'bg-violet-50', reason: 'Customer responds fastest to morning WhatsApp messages', impact: 'Response rate: 95% within 15 minutes', confidence: 88 },
  { title: 'Birthday Reminder', icon: Star, color: '#F59E0B', bg: 'bg-amber-50', reason: 'Kwame has multiple family birthdays saved in profile', impact: 'Drives repeat orders every 3-4 weeks', confidence: 96 },
  { title: 'Referral Invitation', icon: Share2, color: '#22C55E', bg: 'bg-emerald-50', reason: 'Chinedu has referred 3 new customers this year', impact: 'Referral loop: +3 potential new customers', confidence: 85 },
];

const AGENT_ACTIVITIES = [
  { action: 'Confirmation prepared for', target: 'Grace Eze', time: '2m ago', status: 'success' as const },
  { action: 'Follow-up scheduled for', target: 'Chinedu Okafor', time: '5m ago', status: 'info' as const },
  { action: 'Review request sent to', target: 'Amaka Bello', time: '12m ago', status: 'success' as const },
  { action: 'Loyalty offer prepared for', target: 'Kwame Mensah', time: '18m ago', status: 'info' as const },
  { action: 'Payment alert sent to', target: 'Thabo Mokoena', time: '25m ago', status: 'warning' as const },
  { action: 'Quotation drafted for', target: 'Adaobi Nwosu', time: '35m ago', status: 'success' as const },
  { action: 'Delivery update sent to', target: 'Naledi Dlamini', time: '42m ago', status: 'info' as const },
  { action: 'Re-engagement campaign ready for', target: 'Ama Boateng', time: '1h ago', status: 'info' as const },
];

// ============================================================================
// Sub-components
// ============================================================================

function StatCardComponent({ stat, index }: { stat: StatCard; index: number }) {
  const Icon = stat.icon;
  return (
    <div className={`animate-fade-in-up stagger-${index + 1}`} role="status" aria-label={`${stat.label}: ${stat.value}${stat.suffix || ''}`}>
      <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group cursor-default">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
            <Icon size={20} style={{ color: stat.color }} />
          </div>
          <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          <AnimatedCounter value={stat.value} />
          {stat.suffix || ''}
        </p>
      </div>
    </div>
  );
}

function DailyBrief() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">AI Daily Brief</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
          Good Morning, Lawrence.
        </h2>
        <p className="text-sm text-indigo-100 leading-relaxed mb-5">
          Customer Success has completed 18 customer interactions today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-inset ring-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-amber-300" />
              <span className="text-xs font-medium text-indigo-200">Follow-ups</span>
            </div>
            <p className="text-sm font-semibold text-white">3 follow-ups require your attention.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-inset ring-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Send size={14} className="text-emerald-300" />
              <span className="text-xs font-medium text-indigo-200">Pending</span>
            </div>
            <p className="text-sm font-semibold text-white">Grace Eze's confirmation message is ready to send.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-inset ring-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} className="text-pink-300" />
              <span className="text-xs font-medium text-indigo-200">Satisfaction</span>
            </div>
            <p className="text-sm font-semibold text-white">Overall customer satisfaction remains high at 96%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationCard({ conversation, index }: { conversation: Conversation; index: number }) {
  const statusBg = conversation.statusColor === '#22C55E' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    conversation.statusColor === '#F59E0B' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
    conversation.statusColor === '#EF4444' ? 'bg-red-50 text-red-700 ring-red-200' :
    'bg-indigo-50 text-indigo-700 ring-indigo-200';

  const aiStatusBg = conversation.aiStatusColor === '#22C55E' ? 'bg-emerald-50 text-emerald-700' :
    conversation.aiStatusColor === '#F59E0B' ? 'bg-amber-50 text-amber-700' :
    conversation.aiStatusColor === '#EF4444' ? 'bg-red-50 text-red-700' :
    'bg-indigo-50 text-indigo-700';

  return (
    <div className={`animate-fade-in-up stagger-${index + 1}`}>
      <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {conversation.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-foreground">{conversation.customer}</h4>
              <span className="text-[10px] font-medium text-muted">{conversation.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ring-inset ${statusBg}`}>
                {conversation.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ring-inset ${aiStatusBg}`}>
                <Bot size={10} className="mr-1" />
                {conversation.aiStatus}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{conversation.lastMessage}</p>
          </div>
          <ChevronRight size={16} className="text-muted mt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </div>
      </div>
    </div>
  );
}

function MessageComposer() {
  const [isApproved, setIsApproved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showSavedNotice, setShowSavedNotice] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedMessage, setRegeneratedMessage] = useState<string | null>(null);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('Professional');
  const [showStylePicker, setShowStylePicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [draftMessage, setDraftMessage] = useState(
    `Hello Grace,

Your payment has been confirmed.

Your Custom Celebration Cake is now scheduled for delivery on Saturday at 10:00 AM.

Thank you for choosing Sweet Crumbs Bakery.`
  );

  const STYLES = ['Professional', 'Friendly', 'Concise', 'Empathetic'];

  const STYLE_ICONS: Record<string, string> = {
    Professional: '💼',
    Friendly: '😊',
    Concise: '📝',
    Empathetic: '💛',
  };

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // --- Edit handlers ---
  const handleEdit = () => {
    setEditText(draftMessage);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText('');
  };

  const handleSaveEdit = () => {
    setDraftMessage(editText);
    setIsEditing(false);
    setEditText('');
    setShowSavedNotice(true);
    setTimeout(() => setShowSavedNotice(false), 3000);
  };

  // --- Regenerate handlers ---
  const handleRegenerate = async (style: string) => {
    setIsRegenerating(true);
    setRegenerateError(null);
    setSelectedStyle(style);
    setShowStylePicker(false);

    try {
      const result = await generateCustomerMessage(
        `Regenerate message in ${style.toLowerCase()} tone`,
        'Grace Eze',
        `Current message: ${draftMessage}\n\nCustomer: Grace Eze (VIP, N1.2M lifetime)\nOrder: Custom Celebration Cake, N185K, confirmed\nDelivery: Saturday at 10:00 AM\n\nKeep the same intent but rewrite in a ${style.toLowerCase()} tone. Return ONLY the message text, no JSON.`,
        undefined,
        style.toLowerCase(),
      );

      if (result.error) {
        setRegenerateError(result.error);
        return;
      }

      // Parse the response — it may be JSON with a message field or plain text
      let message = result.response;
      try {
        const parsed = JSON.parse(result.response);
        if (parsed.message) message = parsed.message;
      } catch {
        // Plain text — use as-is
      }

      setRegeneratedMessage(message);
    } catch (err) {
      setRegenerateError(getErrorMessage(err));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAcceptRegenerated = () => {
    if (regeneratedMessage) {
      setDraftMessage(regeneratedMessage);
      setShowSavedNotice(true);
      setTimeout(() => setShowSavedNotice(false), 3000);
    }
    setRegeneratedMessage(null);
    setRegenerateError(null);
  };

  const handleDiscardRegenerated = () => {
    setRegeneratedMessage(null);
    setRegenerateError(null);
    setShowStylePicker(false);
  };

  const handleRetryRegenerate = () => {
    setRegenerateError(null);
    setShowStylePicker(true);
  };

  // --- Render helpers ---
  const renderDraftMessage = (message: string) => (
    <div className="space-y-2 text-sm text-foreground leading-relaxed whitespace-pre-line">
      {message}
    </div>
  );

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm">
          <Send size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Message Composer</h3>
          <p className="text-[10px] text-text-secondary">Generated by Customer Success Agent</p>
        </div>
      </div>

      {!isApproved ? (
        <>
          {/* Success notification toast */}
          {showSavedNotice && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium animate-fade-in-up" role="status">
              <CheckCircle size={14} className="shrink-0" />
              <span>Draft updated successfully.</span>
            </div>
          )}

          {/* Draft message area */}
          {isEditing ? (
            // Edit mode
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Pencil size={14} className="text-violet-600" />
                <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wider">Editing Message</span>
              </div>
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full min-h-[180px] p-4 rounded-xl border border-violet-200 bg-white text-sm text-foreground leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-300 transition-all duration-150"
                aria-label="Edit message draft"
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white
                    hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Check size={15} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-text-secondary border border-border
                    hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X size={15} />
                  Cancel
                </button>
              </div>
            </div>
          ) : regeneratedMessage ? (
            // Regenerated draft preview
            <div className="mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw size={14} className="text-amber-600" />
                  <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                    Regenerated — {selectedStyle}
                  </span>
                </div>
                {renderDraftMessage(regeneratedMessage)}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleAcceptRegenerated}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white
                    hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Check size={15} />
                  Accept
                </button>
                <button
                  onClick={handleDiscardRegenerated}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-text-secondary border border-border
                    hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X size={15} />
                  Discard
                </button>
              </div>
            </div>
          ) : isRegenerating ? (
            // AI thinking / loading state
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-white border border-violet-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={14} className="text-violet-600" />
                <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wider">AI is rethinking...</span>
              </div>
              <div className="flex items-center gap-3 py-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-text-secondary">
                  Generating {selectedStyle.toLowerCase()} version...
                </span>
              </div>
            </div>
          ) : showStylePicker ? (
            // Style picker
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-white border border-violet-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-violet-600" />
                <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wider">Choose a Style</span>
              </div>
              <p className="text-xs text-text-secondary mb-3">Select the tone for the regenerated message:</p>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleRegenerate(style)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-white text-foreground border border-border
                      hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label={`Regenerate in ${style} style`}
                  >
                    <span className="text-base">{STYLE_ICONS[style]}</span>
                    <span>{style}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStylePicker(false)}
                className="mt-3 w-full text-center text-xs text-text-secondary hover:text-foreground transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : regenerateError ? (
            // Error state
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-[10px] font-semibold text-red-700 uppercase tracking-wider">Regeneration Failed</span>
              </div>
              <p className="text-sm text-red-600 leading-relaxed">{regenerateError}</p>
              <button
                onClick={handleRetryRegenerate}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              >
                <RefreshCw size={12} />
                Try Again
              </button>
            </div>
          ) : (
            // Default: show draft
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-white border border-violet-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={14} className="text-violet-600" />
                <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wider">Draft Message</span>
              </div>
              {renderDraftMessage(draftMessage)}
            </div>
          )}

          {/* Action buttons — hide during edit/regenerate-preview/loading/error */}
          {!isEditing && !regeneratedMessage && !isRegenerating && !regenerateError && !showStylePicker && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsApproved(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white
                  hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Send size={15} />
                Approve & Send
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-text-secondary border border-border
                  hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Eye size={15} />
                Edit
              </button>
              <button
                onClick={() => setShowStylePicker(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-text-secondary border border-border
                  hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Zap size={15} />
                Regenerate
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">Message Sent!</p>
          <p className="text-sm text-text-secondary">Confirmation sent to Grace Eze via WhatsApp.</p>
        </div>
      )}
    </div>
  );
}

function FollowUpTable({ followUps }: { followUps: typeof FOLLOW_UPS }) {
  const priorityColors: Record<string, string> = {
    high: 'text-red-600 bg-red-50 ring-red-200',
    medium: 'text-amber-600 bg-amber-50 ring-amber-200',
    low: 'text-emerald-600 bg-emerald-50 ring-emerald-200',
  };

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Follow-up Queue</h3>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
          {followUps.length} pending
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-text-secondary text-xs font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Reason</th>
              <th className="text-left px-5 py-3">Priority</th>
              <th className="text-left px-5 py-3 hidden sm:table-cell">Suggested Time</th>
              <th className="text-left px-5 py-3 hidden lg:table-cell">AI Recommendation</th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {followUps.map((item, i) => (
              <tr key={i} className="border-b border-border hover:bg-surface-hover transition-colors duration-150 cursor-default">
                <td className="px-5 py-3.5">
                  <span className="font-medium text-foreground">{item.customer}</span>
                </td>
                <td className="px-5 py-3.5 text-text-secondary">{item.reason}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ring-inset ${priorityColors[item.priority]}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-text-secondary hidden sm:table-cell">{item.suggestedTime}</td>
                <td className="px-5 py-3.5 text-text-secondary hidden lg:table-cell max-w-[200px] truncate">{item.aiRecommendation}</td>
                <td className="px-5 py-3.5">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-indigo-50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label={`Follow up with ${item.customer}`}
                  >
                    <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerTimeline({ events }: { events: typeof TIMELINE_EVENTS }) {
  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
          <Clock size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Customer Timeline</h3>
          <p className="text-[10px] text-text-secondary">Grace Eze — Order #1048</p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-0">
          {events.map((event, i) => {
            const EventIcon = event.icon;
            return (
              <div key={i} className="flex items-start gap-4 pb-5 last:pb-0 relative">
                <div className={`w-10 h-10 rounded-xl ${event.bg} flex items-center justify-center shrink-0 relative z-10 shadow-sm ring-2 ring-card`}>
                  <EventIcon size={16} style={{ color: event.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                    <span className="text-[10px] font-medium text-muted">{event.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SentimentAnalysis() {
  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-sm">
          <Heart size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Customer Sentiment</h3>
          <p className="text-[10px] text-text-secondary">AI sentiment analysis across all conversations</p>
        </div>
      </div>

      <div className="space-y-3">
        {SENTIMENTS.map((sentiment, i) => (
          <div key={i} className={`p-4 rounded-xl ${sentiment.bg} ring-1 ring-inset transition-all duration-200 hover:shadow-sm`}
            style={{ borderColor: `${sentiment.color}20`, borderWidth: 1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sentiment.color }} />
                <span className="text-sm font-semibold" style={{ color: sentiment.color }}>{sentiment.label}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: sentiment.color }}>{sentiment.confidence}% confidence</span>
            </div>
            <p className="text-sm text-text-secondary mb-2 leading-relaxed">{sentiment.latestInteraction}</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Zap size={12} />
              <span>{sentiment.suggestedAction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetentionSection() {
  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <Gift size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Retention Opportunities</h3>
          <p className="text-[10px] text-text-secondary">AI recommendations to improve customer retention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RETENTION_OPPORTUNITIES.map((opp, i) => {
          const OppIcon = opp.icon;
          const confidenceColor = opp.confidence >= 90 ? 'text-emerald-600' : opp.confidence >= 80 ? 'text-amber-600' : 'text-text-secondary';
          return (
            <div key={i} className={`p-4 rounded-xl ${opp.bg} ring-1 ring-inset transition-all duration-200 hover:shadow-sm cursor-pointer group`}
              style={{ borderColor: `${opp.color}20`, borderWidth: 1 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${opp.bg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}
                  style={{ backgroundColor: `${opp.color}15` }}
                >
                  <OppIcon size={16} style={{ color: opp.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{opp.title}</h4>
                    <span className={`text-[10px] font-bold ${confidenceColor}`}>{opp.confidence}% confidence</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-1">{opp.reason}</p>
                  <p className="text-xs font-medium text-primary">{opp.impact}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentActivityFeed({ activities }: { activities: typeof AGENT_ACTIVITIES }) {
  const statusIcons: Record<string, LucideIcon> = {
    success: CheckCircle,
    info: Bot,
    warning: AlertCircle,
  };
  const statusColors: Record<string, string> = {
    success: 'text-emerald-500',
    info: 'text-primary',
    warning: 'text-amber-500',
  };

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-sm">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Agent Activity</h3>
            <p className="text-[10px] text-text-secondary">Live customer success operations</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          Live
        </span>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {activities.map((event, i) => {
          const StatusIcon = statusIcons[event.status];
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors duration-150 cursor-default animate-fade-in-stream"
            >
              <StatusIcon size={14} className={`${statusColors[event.status]} shrink-0`} />
              <p className="text-sm text-foreground flex-1">
                {event.action} <span className="font-medium text-primary">{event.target}</span>
              </p>
              <span className="text-[10px] font-medium text-muted shrink-0">{event.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function CustomerSuccess() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim()
    ? CONVERSATIONS.filter((c) =>
        c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CONVERSATIONS;

  // Filter follow-ups based on search query
  const filteredFollowUps = searchQuery.trim()
    ? FOLLOW_UPS.filter((f) =>
        f.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.aiRecommendation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FOLLOW_UPS;

  // Filter timeline events based on search query
  const filteredTimeline = searchQuery.trim()
    ? TIMELINE_EVENTS.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TIMELINE_EVENTS;

  // Filter agent activities based on search query
  const filteredActivities = searchQuery.trim()
    ? AGENT_ACTIVITIES.filter((a) =>
        a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.action.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : AGENT_ACTIVITIES;

  return (
    <div className="space-y-6 pb-6">
      {/* ===== Hero Banner ===== */}
      <div className="animate-fade-in-up">
        <div className="hero-gradient p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/[0.03] rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="hero-icon">
                <Heart size={18} className="text-white" />
              </div>
              <span className="hero-label">Customer Success</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Customer Success Agent</h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
              Deliver exceptional customer experiences through intelligent AI-powered customer operations.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Search ===== */}
      <div className="animate-fade-in-up stagger-1">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers, conversations or follow-ups..."
            className="search-input pl-10 w-full"
            aria-label="Search customers, conversations or follow-ups"
          />
        </div>
      </div>

      {/* ===== Header Metrics ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <StatCardComponent key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ===== AI Daily Brief ===== */}
      <div className="animate-fade-in-up stagger-2">
        <DailyBrief />
      </div>

      {/* ===== Left Column: Conversations + Composer ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Conversations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Active Conversations</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                {filteredConversations.length} active
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {filteredConversations.map((conv, i) => (
              <ConversationCard key={conv.customer} conversation={conv} index={i + 3} />
            ))}
          </div>
        </div>

        {/* Right Column: Message Composer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="animate-fade-in-up stagger-4">
            <MessageComposer />
          </div>
        </div>
      </div>

      {/* ===== Follow-up Queue ===== */}
      <div className="animate-fade-in-up stagger-5">
        <FollowUpTable followUps={filteredFollowUps} />
      </div>

      {/* ===== Timeline + Sentiment + Retention ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Timeline */}
        <div className="animate-fade-in-up stagger-6">
          <CustomerTimeline events={filteredTimeline} />
        </div>

        {/* Customer Sentiment */}
        <div className="animate-fade-in-up stagger-7">
          <SentimentAnalysis />
        </div>

        {/* Retention Opportunities */}
        <div className="animate-fade-in-up stagger-8">
          <RetentionSection />
        </div>
      </div>

      {/* ===== Agent Activity Feed ===== */}
      <div className="animate-fade-in-up stagger-8">
        <AgentActivityFeed activities={filteredActivities} />
      </div>
    </div>
  );
}