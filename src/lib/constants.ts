// ============================================================================
// TypeScript Interfaces & Mock Data for Sweet Crumbs Bakery
// ============================================================================

// --- Customer ---
export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive' | 'lead';
  orders: number;
  totalSpent: number;
  aiSummary: string;
  joinedAt: string;
}

// --- Order ---
export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  product: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  amount: number;
  date: string;
  items: { name: string; qty: number; price: number }[];
  shippingAddress: string;
  timeline: { status: string; date: string; completed: boolean }[];
  customerInfo: { name: string; email: string; phone: string };
}

// --- Payment ---
export interface Payment {
  id: string;
  amount: number;
  method: 'visa' | 'mastercard' | 'paypal' | 'bank_transfer';
  status: 'verified' | 'pending' | 'failed';
  date: string;
  customer: string;
  invoiceItems: { description: string; qty: number; unitPrice: number }[];
}

// --- AI Agent ---
export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'online' | 'idle' | 'busy';
  currentTask: string;
  description: string;
  capabilities: string[];
  color: string;
}

// --- Timeline Event ---
export interface TimelineEvent {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  time: string;
}

// --- Stat Card ---
export interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

// --- Activity ---
export interface Activity {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

// --- Customers ---
export const CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'Grace Eze', email: 'grace@ezeinnovations.com', avatar: 'GE', status: 'active', orders: 24, totalSpent: 485000, aiSummary: 'Premium customer, ordered Custom Celebration Cake — payment verification in progress', joinedAt: '2024-03-15' },
  { id: 'C002', name: 'Amaka Bello', email: 'amaka@bellotech.com', avatar: 'AB', status: 'active', orders: 18, totalSpent: 320000, aiSummary: 'Bulk order potential, recurring buyer', joinedAt: '2024-05-22' },
  { id: 'C003', name: 'Chinedu Okafor', email: 'chinedu@okafor.com', avatar: 'CO', status: 'active', orders: 42, totalSpent: 890000, aiSummary: 'VIP customer, referral source', joinedAt: '2023-11-08' },
  { id: 'C004', name: 'Adaobi Nwosu', email: 'adaobi@nwosu.com', avatar: 'AN', status: 'lead', orders: 1, totalSpent: 45000, aiSummary: 'New lead — enquired about Wedding Cake Package', joinedAt: '2025-01-10' },
  { id: 'C005', name: 'Tolu Adebayo', email: 'tolu@adebayo.com', avatar: 'TA', status: 'active', orders: 15, totalSpent: 215000, aiSummary: 'Growing account, upsell opportunity', joinedAt: '2024-09-03' },
  { id: 'C006', name: 'Kofi Asante', email: 'kofi@asante.com', avatar: 'KA', status: 'lead', orders: 0, totalSpent: 0, aiSummary: 'Qualified lead, interested in Premium Pastry Box', joinedAt: '2025-02-28' },
  { id: 'C007', name: 'Ama Boateng', email: 'ama@boateng.com', avatar: 'AM', status: 'inactive', orders: 6, totalSpent: 95000, aiSummary: 'Dormant — re-engagement campaign for Monthly Dessert Subscription', joinedAt: '2024-07-19' },
  { id: 'C008', name: 'Kwame Mensah', email: 'kwame@mensah.com', avatar: 'KM', status: 'active', orders: 31, totalSpent: 620000, aiSummary: 'Loyal customer, recurring birthday cake orders', joinedAt: '2024-01-14' },
  { id: 'C009', name: 'Amina Wanjiku', email: 'amina@wanjiku.com', avatar: 'AW', status: 'inactive', orders: 3, totalSpent: 55000, aiSummary: 'Churned — win-back campaign for Luxury Cupcake Collection', joinedAt: '2024-04-30' },
  { id: 'C010', name: 'Brian Otieno', email: 'brian@otieno.com', avatar: 'BO', status: 'active', orders: 9, totalSpent: 175000, aiSummary: 'Steady growth, recommend Corporate Dessert Package', joinedAt: '2024-10-12' },
  { id: 'C011', name: 'Faith Njeri', email: 'faith@njeri.com', avatar: 'FN', status: 'lead', orders: 2, totalSpent: 28000, aiSummary: 'Trial user, high conversion potential for Birthday Cake Package', joinedAt: '2025-03-05' },
  { id: 'C012', name: 'Thabo Mokoena', email: 'thabo@mokoena.com', avatar: 'TM', status: 'active', orders: 11, totalSpent: 285000, aiSummary: 'Multi-product buyer, interested in Wedding Cake Package', joinedAt: '2024-06-21' },
  { id: 'C013', name: 'Naledi Dlamini', email: 'naledi@dlamini.com', avatar: 'ND', status: 'active', orders: 14, totalSpent: 310000, aiSummary: 'Regular orders, loyalty program candidate', joinedAt: '2024-08-15' },
  { id: 'C014', name: 'David Mensah', email: 'david@mensah.com', avatar: 'DM', status: 'active', orders: 22, totalSpent: 420000, aiSummary: 'High-value customer, frequent Event Catering orders', joinedAt: '2024-02-10' },
  { id: 'C015', name: 'Zainab Ibrahim', email: 'zainab@ibrahim.com', avatar: 'ZI', status: 'lead', orders: 1, totalSpent: 35000, aiSummary: 'New lead — inquiry about Wedding Cake Package', joinedAt: '2025-03-18' },
];

// --- Orders ---
export const ORDERS: Order[] = [
  {
    id: 'ORD-1048',
    customer: 'Grace Eze',
    customerEmail: 'grace@ezeinnovations.com',
    product: 'Custom Celebration Cake',
    status: 'processing',
    amount: 185000,
    date: '2025-07-24',
    items: [{ name: 'Custom Celebration Cake — 3-Tier', qty: 1, price: 185000 }],
    shippingAddress: '12 Awolowo Road, Ikoyi, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 09:15', completed: true },
      { status: 'Quotation Generated', date: '2025-07-24 09:18', completed: true },
      { status: 'Customer Approved', date: '2025-07-24 10:02', completed: true },
      { status: 'Payment Verification', date: '2025-07-24 10:05', completed: false },
      { status: 'Order Complete', date: '—', completed: false },
    ],
    customerInfo: { name: 'Grace Eze', email: 'grace@ezeinnovations.com', phone: '+234 801 234 5678' },
  },
  {
    id: 'ORD-1047',
    customer: 'Amaka Bello',
    customerEmail: 'amaka@bellotech.com',
    product: 'Corporate Dessert Package',
    status: 'processing',
    amount: 95000,
    date: '2025-07-24',
    items: [{ name: 'Corporate Dessert Package — 50 servings', qty: 1, price: 95000 }],
    shippingAddress: '45 Marina Street, Lagos Island, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 11:30', completed: true },
      { status: 'Quotation Generated', date: '2025-07-24 11:35', completed: true },
      { status: 'Customer Approved', date: '2025-07-24 12:00', completed: true },
      { status: 'Payment Verification', date: '2025-07-24 12:05', completed: false },
    ],
    customerInfo: { name: 'Amaka Bello', email: 'amaka@bellotech.com', phone: '+234 802 345 6789' },
  },
  {
    id: 'ORD-1046',
    customer: 'Adaobi Nwosu',
    customerEmail: 'adaobi@nwosu.com',
    product: 'Wedding Cake Package',
    status: 'processing',
    amount: 450000,
    date: '2025-07-23',
    items: [{ name: 'Wedding Cake — 5-Tier Premium', qty: 1, price: 450000 }],
    shippingAddress: '8 Bishop Aboyade Cole Street, Victoria Island, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-23 08:00', completed: true },
      { status: 'Quotation Generated', date: '2025-07-23 08:05', completed: true },
      { status: 'Customer Approved', date: '2025-07-23 09:30', completed: true },
      { status: 'Payment Verification', date: '2025-07-23 09:35', completed: false },
    ],
    customerInfo: { name: 'Adaobi Nwosu', email: 'adaobi@nwosu.com', phone: '+234 803 456 7890' },
  },
  {
    id: 'ORD-1045',
    customer: 'Brian Otieno',
    customerEmail: 'brian@otieno.com',
    product: 'Corporate Dessert Package',
    status: 'shipped',
    amount: 150000,
    date: '2025-07-22',
    items: [{ name: 'Corporate Dessert Package — 80 servings', qty: 1, price: 150000 }],
    shippingAddress: '10 Ligali Ayorinde Street, Victoria Island, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-22 14:00', completed: true },
      { status: 'Quotation Generated', date: '2025-07-22 14:05', completed: true },
      { status: 'Customer Approved', date: '2025-07-22 15:00', completed: true },
      { status: 'Payment Verification', date: '2025-07-22 15:10', completed: true },
      { status: 'Order Complete', date: '2025-07-22 16:00', completed: true },
    ],
    customerInfo: { name: 'Brian Otieno', email: 'brian@otieno.com', phone: '+234 808 901 2345' },
  },
  {
    id: 'ORD-1044',
    customer: 'Naledi Dlamini',
    customerEmail: 'naledi@dlamini.com',
    product: 'Custom Celebration Cake',
    status: 'delivered',
    amount: 145000,
    date: '2025-07-21',
    items: [{ name: 'Custom Celebration Cake — 2-Tier', qty: 1, price: 145000 }],
    shippingAddress: '16 Admiralty Way, Lekki, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-15', completed: true },
      { status: 'Quotation Generated', date: '2025-07-15', completed: true },
      { status: 'Customer Approved', date: '2025-07-15', completed: true },
      { status: 'Payment Verification', date: '2025-07-15', completed: true },
      { status: 'Order Complete', date: '2025-07-16', completed: true },
    ],
    customerInfo: { name: 'Naledi Dlamini', email: 'naledi@dlamini.com', phone: '+234 810 123 4567' },
  },
  {
    id: 'ORD-1043',
    customer: 'Kwame Mensah',
    customerEmail: 'kwame@mensah.com',
    product: 'Birthday Cake Package',
    status: 'delivered',
    amount: 85000,
    date: '2025-07-20',
    items: [{ name: 'Birthday Cake Package', qty: 1, price: 85000 }],
    shippingAddress: '7 Raymond Njoku Street, Ikoyi, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-10', completed: true },
      { status: 'Quotation Generated', date: '2025-07-10', completed: true },
      { status: 'Customer Approved', date: '2025-07-10', completed: true },
      { status: 'Payment Verification', date: '2025-07-10', completed: true },
      { status: 'Order Complete', date: '2025-07-11', completed: true },
    ],
    customerInfo: { name: 'Kwame Mensah', email: 'kwame@mensah.com', phone: '+234 806 789 0123' },
  },
  {
    id: 'ORD-1042',
    customer: 'Thabo Mokoena',
    customerEmail: 'thabo@mokoena.com',
    product: 'Wedding Cake Package',
    status: 'pending',
    amount: 450000,
    date: '2025-07-24',
    items: [{ name: 'Wedding Cake — 5-Tier Premium', qty: 1, price: 450000 }],
    shippingAddress: '5 Ademola Street, Ikoyi, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 08:00', completed: true },
      { status: 'Quotation Generated', date: '2025-07-24 08:05', completed: true },
      { status: 'Customer Approved', date: '2025-07-24 09:00', completed: true },
      { status: 'Payment Verification', date: '2025-07-24 09:10', completed: false },
    ],
    customerInfo: { name: 'Thabo Mokoena', email: 'thabo@mokoena.com', phone: '+234 809 012 3456' },
  },
  {
    id: 'ORD-1041',
    customer: 'Tolu Adebayo',
    customerEmail: 'tolu@adebayo.com',
    product: 'Monthly Dessert Subscription',
    status: 'cancelled',
    amount: 25000,
    date: '2025-07-23',
    items: [{ name: 'Monthly Dessert Subscription', qty: 1, price: 25000 }],
    shippingAddress: '22 Adeniyi Jones Avenue, Ikeja, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-18', completed: true },
      { status: 'Quotation Generated', date: '2025-07-18', completed: true },
      { status: 'Cancelled', date: '2025-07-19', completed: true },
    ],
    customerInfo: { name: 'Tolu Adebayo', email: 'tolu@adebayo.com', phone: '+234 804 567 8901' },
  },
  {
    id: 'ORD-1040',
    customer: 'Kofi Asante',
    customerEmail: 'kofi@asante.com',
    product: 'Premium Pastry Box',
    status: 'pending',
    amount: 35000,
    date: '2025-07-24',
    items: [{ name: 'Premium Pastry Box — Assorted', qty: 1, price: 35000 }],
    shippingAddress: '15 Toyin Street, Ikeja, Lagos',
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 12:00', completed: true },
      { status: 'Quotation Pending', date: '—', completed: false },
    ],
    customerInfo: { name: 'Kofi Asante', email: 'kofi@asante.com', phone: '+234 805 678 9012' },
  },
];

// --- Payments ---
export const PAYMENTS: Payment[] = [
  { id: 'PAY-001', amount: 185000, method: 'bank_transfer', status: 'pending', date: '2025-07-24', customer: 'Grace Eze', invoiceItems: [{ description: 'Custom Celebration Cake — 3-Tier', qty: 1, unitPrice: 185000 }] },
  { id: 'PAY-002', amount: 95000, method: 'mastercard', status: 'verified', date: '2025-07-24', customer: 'Amaka Bello', invoiceItems: [{ description: 'Corporate Dessert Package — 50 servings', qty: 1, unitPrice: 95000 }] },
  { id: 'PAY-003', amount: 450000, method: 'bank_transfer', status: 'pending', date: '2025-07-23', customer: 'Adaobi Nwosu', invoiceItems: [{ description: 'Wedding Cake — 5-Tier Premium', qty: 1, unitPrice: 450000 }] },
  { id: 'PAY-004', amount: 25000, method: 'visa', status: 'failed', date: '2025-07-18', customer: 'Tolu Adebayo', invoiceItems: [{ description: 'Monthly Dessert Subscription', qty: 1, unitPrice: 25000 }] },
  { id: 'PAY-005', amount: 35000, method: 'visa', status: 'pending', date: '2025-07-24', customer: 'Kofi Asante', invoiceItems: [{ description: 'Premium Pastry Box — Assorted', qty: 1, unitPrice: 35000 }] },
  { id: 'PAY-006', amount: 145000, method: 'mastercard', status: 'verified', date: '2025-07-21', customer: 'Naledi Dlamini', invoiceItems: [{ description: 'Custom Celebration Cake — 2-Tier', qty: 1, unitPrice: 145000 }] },
  { id: 'PAY-007', amount: 450000, method: 'bank_transfer', status: 'pending', date: '2025-07-24', customer: 'Thabo Mokoena', invoiceItems: [{ description: 'Wedding Cake — 5-Tier Premium', qty: 1, unitPrice: 450000 }] },
  { id: 'PAY-008', amount: 150000, method: 'mastercard', status: 'verified', date: '2025-07-22', customer: 'Brian Otieno', invoiceItems: [{ description: 'Corporate Dessert Package — 80 servings', qty: 1, unitPrice: 150000 }] },
];

// --- AI Agents ---
export const AGENTS: Agent[] = [
  {
    id: 'A001',
    name: 'Sales Agent',
    role: 'Lead Generation & Conversion',
    icon: 'TrendingUp',
    status: 'online',
    currentTask: 'Processing lead qualification queue',
    description: 'Handles lead scoring, follow-ups, and conversion optimization. Trained on your bakery sales playbook and CRM data.',
    capabilities: ['Lead Scoring', 'Email Outreach', 'Call Scripts', 'CRM Sync'],
    color: '#4F46E5',
  },
  {
    id: 'A002',
    name: 'Finance Agent',
    role: 'Invoicing & Expense Management',
    icon: 'DollarSign',
    status: 'idle',
    currentTask: 'Awaiting invoice batch',
    description: 'Manages invoicing, expense tracking, and financial reporting. Syncs with your bakery accounting software.',
    capabilities: ['Invoice Generation', 'Expense Tracking', 'Tax Reports', 'Payroll'],
    color: '#22C55E',
  },
  {
    id: 'A003',
    name: 'Customer Success Agent',
    role: 'Support & Retention',
    icon: 'Handshake',
    status: 'busy',
    currentTask: 'Resolving 3 support tickets',
    description: 'Handles customer inquiries, onboarding, and retention. Available 24/7 for your customers.',
    capabilities: ['Ticket Management', 'Onboarding', 'Feedback Analysis', 'NPS Tracking'],
    color: '#8B5CF6',
  },
];

// --- Timeline Events ---
export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'T1', icon: 'ShoppingCart', color: '#4F46E5', title: 'New Order Placed', description: 'Grace Eze ordered Custom Celebration Cake — awaiting payment verification', time: '1 hour ago' },
  { id: 'T2', icon: 'CheckCircle', color: '#22C55E', title: 'Quotation Completed', description: 'Sales Agent generated quotation for Grace Eze', time: '2 hours ago' },
  { id: 'T3', icon: 'Bot', color: '#8B5CF6', title: 'AI Agent Active', description: 'Finance Agent reviewing payment for Order #1048', time: '3 hours ago' },
  { id: 'T4', icon: 'Truck', color: '#F59E0B', title: 'Order Shipped', description: 'Brian Otieno\'s Corporate Dessert Package dispatched', time: '5 hours ago' },
  { id: 'T5', icon: 'Users', color: '#4F46E5', title: 'New Customer Registered', description: 'Zainab Ibrahim signed up for a wedding cake consultation', time: '6 hours ago' },
  { id: 'T6', icon: 'FileText', color: '#22C55E', title: 'Report Generated', description: 'Daily bakery sales report is ready for review', time: '8 hours ago' },
];

// --- Recent Activities ---
export const RECENT_ACTIVITIES: Activity[] = [
  { id: 'A1', action: 'placed', target: 'Order for Custom Celebration Cake', user: 'Grace Eze', time: '1h ago' },
  { id: 'A2', action: 'generated', target: 'quotation for Grace Eze', user: 'Sales Agent', time: '2h ago' },
  { id: 'A3', action: 'reviewing', target: 'payment for Order #1048', user: 'Finance Agent', time: '3h ago' },
  { id: 'A4', action: 'preparing', target: 'confirmation message for Grace Eze', user: 'Customer Success', time: '3h ago' },
  { id: 'A5', action: 'created', target: 'Order for Corporate Dessert Package', user: 'Brian Otieno', time: '5h ago' },
  { id: 'A6', action: 'registered', target: 'new wedding cake consultation', user: 'Zainab Ibrahim', time: '6h ago' },
  { id: 'A7', action: 'completed', target: 'Order #1044 for Naledi Dlamini', user: 'System', time: '8h ago' },
];

// --- AI Workforce Stats ---
export const AI_WORKFORCE_STATS = {
  agentsOnline: 3,
  activeTasks: 12,
  tasksCompletedToday: 247,
  averageSuccessRate: 98,
};

// --- Enhanced AI Agent Data ---
export interface AgentDetail {
  id: string;
  name: string;
  role: string;
  tagline: string;
  icon: string;
  status: 'online' | 'idle' | 'busy';
  statusLabel: string;
  gradient: string;
  currentTask: string;
  taskTarget: string;
  progress: number;
  confidenceScore: number;
  estimatedCompletion: string;
  capabilities: string[];
  recentActivity: { icon: string; text: string }[];
  primaryAction: string;
  primaryActionIcon: string;
  secondaryAction: string;
  secondaryActionIcon: string;
}

export const AGENT_DETAILS: AgentDetail[] = [
  {
    id: 'A001',
    name: 'Sales Agent',
    role: 'Recommends the perfect bakery products and converts conversations into orders.',
    tagline: 'Lead generation & conversion',
    icon: 'TrendingUp',
    status: 'online',
    statusLabel: 'Working',
    gradient: 'from-indigo-500 to-indigo-600',
    currentTask: 'Creating quotation',
    taskTarget: 'for Amaka Bello...',
    progress: 45,
    confidenceScore: 98,
    estimatedCompletion: '14 seconds',
    capabilities: ['Creates quotations', 'Generates orders', 'Recommends bakery products', 'Qualifies leads'],
    recentActivity: [
      { icon: 'CheckCircle', text: 'Completed quotation for Grace Eze' },
      { icon: 'CheckCircle', text: 'Recommended Custom Celebration Cake' },
      { icon: 'CheckCircle', text: 'Follow-up scheduled with Kofi Asante' },
    ],
    primaryAction: 'Open Chat',
    primaryActionIcon: 'MessageSquare',
    secondaryAction: 'View History',
    secondaryActionIcon: 'Clock',
  },
  {
    id: 'A002',
    name: 'Finance Agent',
    role: 'Verifies payments and manages financial operations for the bakery.',
    tagline: 'Payment & financial management',
    icon: 'DollarSign',
    status: 'online',
    statusLabel: 'Working',
    gradient: 'from-emerald-500 to-emerald-600',
    currentTask: 'Reviewing payment',
    taskTarget: 'for Order #1048 (Grace Eze)',
    progress: 72,
    confidenceScore: 99,
    estimatedCompletion: '8 seconds',
    capabilities: ['Verifies payments', 'Manages invoices', 'Detects anomalies', 'Generates reports'],
    recentActivity: [
      { icon: 'CheckCircle', text: 'Verifying Grace Eze\'s payment' },
      { icon: 'CheckCircle', text: 'Generated invoice for Amaka Bello' },
      { icon: 'CheckCircle', text: 'Flagged duplicate payment from Thabo' },
    ],
    primaryAction: 'Review',
    primaryActionIcon: 'Eye',
    secondaryAction: 'Transactions',
    secondaryActionIcon: 'ArrowRightLeft',
  },
  {
    id: 'A003',
    name: 'Customer Success Agent',
    role: 'Ensures every customer is delighted after their order.',
    tagline: 'Support & retention',
    icon: 'Handshake',
    status: 'online',
    statusLabel: 'Working',
    gradient: 'from-violet-500 to-violet-600',
    currentTask: 'Preparing confirmation message',
    taskTarget: 'for Grace Eze',
    progress: 34,
    confidenceScore: 97,
    estimatedCompletion: '22 seconds',
    capabilities: ['Resolves tickets', 'Sends order updates', 'Schedules reminders', 'Collects feedback'],
    recentActivity: [
      { icon: 'CheckCircle', text: 'Preparing confirmation for Grace Eze' },
      { icon: 'CheckCircle', text: 'Sent delivery update to Brian Otieno' },
      { icon: 'CheckCircle', text: 'Scheduled reminder for Adaobi Nwosu' },
    ],
    primaryAction: 'View Conversation',
    primaryActionIcon: 'MessageSquare',
    secondaryAction: 'Customer History',
    secondaryActionIcon: 'Users',
  },
];

// --- AI Activity Feed ---
export interface ActivityFeedEvent {
  id: string;
  agentName: string;
  agentIcon: string;
  agentGradient: string;
  action: string;
  target: string;
  timestamp: string;
  timeAgo: string;
  status: 'success' | 'pending' | 'info';
}

export const ACTIVITY_FEED_EVENTS: ActivityFeedEvent[] = [
  {
    id: 'F1',
    agentName: 'Sales Agent',
    agentIcon: 'TrendingUp',
    agentGradient: 'from-indigo-500 to-indigo-600',
    action: 'completed',
    target: 'quotation for Grace Eze',
    timestamp: '2025-07-24T14:32:00',
    timeAgo: '1m ago',
    status: 'success',
  },
  {
    id: 'F2',
    agentName: 'Finance Agent',
    agentIcon: 'DollarSign',
    agentGradient: 'from-emerald-500 to-emerald-600',
    action: 'reviewing',
    target: 'payment from Grace Eze for Order #1048',
    timestamp: '2025-07-24T14:28:00',
    timeAgo: '5m ago',
    status: 'pending',
  },
  {
    id: 'F3',
    agentName: 'Customer Success Agent',
    agentIcon: 'Handshake',
    agentGradient: 'from-violet-500 to-violet-600',
    action: 'preparing',
    target: 'confirmation message for Grace Eze',
    timestamp: '2025-07-24T14:22:00',
    timeAgo: '11m ago',
    status: 'info',
  },
  {
    id: 'F4',
    agentName: 'Sales Agent',
    agentIcon: 'TrendingUp',
    agentGradient: 'from-indigo-500 to-indigo-600',
    action: 'recommended',
    target: 'Corporate Dessert Package to Amaka Bello',
    timestamp: '2025-07-24T14:15:00',
    timeAgo: '18m ago',
    status: 'info',
  },
  {
    id: 'F5',
    agentName: 'Finance Agent',
    agentIcon: 'DollarSign',
    agentGradient: 'from-emerald-500 to-emerald-600',
    action: 'generated',
    target: 'invoice for Adaobi Nwosu (Wedding Cake Package)',
    timestamp: '2025-07-24T14:10:00',
    timeAgo: '23m ago',
    status: 'success',
  },
  {
    id: 'F6',
    agentName: 'Customer Success Agent',
    agentIcon: 'Handshake',
    agentGradient: 'from-violet-500 to-violet-600',
    action: 'sent',
    target: 'delivery update to Brian Otieno',
    timestamp: '2025-07-24T14:05:00',
    timeAgo: '28m ago',
    status: 'success',
  },
  {
    id: 'F7',
    agentName: 'Sales Agent',
    agentIcon: 'TrendingUp',
    agentGradient: 'from-indigo-500 to-indigo-600',
    action: 'qualified',
    target: 'Zainab Ibrahim for wedding cake consultation',
    timestamp: '2025-07-24T13:50:00',
    timeAgo: '43m ago',
    status: 'info',
  },
  {
    id: 'F8',
    agentName: 'Finance Agent',
    agentIcon: 'DollarSign',
    agentGradient: 'from-emerald-500 to-emerald-600',
    action: 'flagged',
    target: 'payment issue with Thabo Mokoena\'s order',
    timestamp: '2025-07-24T13:42:00',
    timeAgo: '51m ago',
    status: 'pending',
  },
];

// --- Performance Chart Data ---
export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export const PERFORMANCE_DATA = {
  tasksCompleted: [
    { label: 'Mon', value: 42, color: '#4F46E5' },
    { label: 'Tue', value: 58, color: '#4F46E5' },
    { label: 'Wed', value: 45, color: '#4F46E5' },
    { label: 'Thu', value: 72, color: '#4F46E5' },
    { label: 'Fri', value: 61, color: '#4F46E5' },
    { label: 'Sat', value: 38, color: '#4F46E5' },
    { label: 'Sun', value: 55, color: '#4F46E5' },
  ],
  agentUtilization: [
    { label: 'Sales', value: 92, color: '#4F46E5' },
    { label: 'Finance', value: 78, color: '#22C55E' },
    { label: 'Customer', value: 85, color: '#8B5CF6' },
  ],
  successRate: [
    { label: 'Sales', value: 98, color: '#4F46E5' },
    { label: 'Finance', value: 99, color: '#22C55E' },
    { label: 'Customer', value: 97, color: '#8B5CF6' },
  ],
  responseTime: [
    { label: 'Sales', value: 1.2, color: '#4F46E5' },
    { label: 'Finance', value: 0.8, color: '#22C55E' },
    { label: 'Customer', value: 2.1, color: '#8B5CF6' },
  ],
};

export const DASHBOARD_STATS: StatCard[] = [
  { label: 'Total Revenue', value: '₦8,290,000', change: '+12.5%', trend: 'up', icon: 'DollarSign', color: '#22C55E' },
  { label: 'Total Orders', value: '342', change: '+8.1%', trend: 'up', icon: 'ShoppingCart', color: '#4F46E5' },
  { label: 'Pending Payments', value: '₦1,283,000', change: '-3.2%', trend: 'down', icon: 'Clock', color: '#F59E0B' },
  { label: 'AI Insights', value: '3 Agents', change: '247 tasks', trend: 'up', icon: 'Bot', color: '#8B5CF6' },
];

// --- Analytics Stats ---
export const ANALYTICS_STATS: StatCard[] = [
  { label: 'Total Revenue', value: '₦28,430,000', change: '+18.2%', trend: 'up', icon: 'DollarSign', color: '#22C55E' },
  { label: 'Total Orders', value: '847', change: '+12.4%', trend: 'up', icon: 'ShoppingCart', color: '#4F46E5' },
  { label: 'Customer Growth', value: '+18.2%', change: '+43 new', trend: 'up', icon: 'Users', color: '#3B82F6' },
  { label: 'AI Productivity', value: '94%', change: '+12% efficiency', trend: 'up', icon: 'Zap', color: '#8B5CF6' },
];

// --- Quick Actions ---
export interface QuickAction {
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'New Order', description: 'Create a new order for a customer', icon: 'PlusCircle', color: '#4F46E5' },
  { label: 'Add Customer', description: 'Register a new customer account', icon: 'UserPlus', color: '#22C55E' },
  { label: 'Run Report', description: 'Generate a custom analytics report', icon: 'FileBarChart', color: '#F59E0B' },
  { label: 'View Analytics', description: 'Open the full analytics dashboard', icon: 'BarChart3', color: '#8B5CF6' },
];

// --- Settings Navigation ---
export interface SettingsTab {
  id: string;
  label: string;
  icon: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: 'profile', label: 'Business Profile', icon: 'Building2' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'ai-preferences', label: 'AI Preferences', icon: 'Bot' },
  { id: 'integrations', label: 'Integrations', icon: 'Puzzle' },
];

// --- Integrations ---
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

export const INTEGRATIONS: Integration[] = [
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', icon: 'Stripe', connected: true },
  { id: 'slack', name: 'Slack', description: 'Team notifications', icon: 'Slack', connected: true },
  { id: 'gmail', name: 'Gmail', description: 'Email integration', icon: 'Mail', connected: true },
  { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting sync', icon: 'FileText', connected: false },
  { id: 'shopify', name: 'Shopify', description: 'E-commerce platform', icon: 'ShoppingBag', connected: false },
];

// --- Notification Settings ---
export interface NotificationCategory {
  id: string;
  label: string;
  events: { id: string; label: string; email: boolean; push: boolean; sms: boolean }[];
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'orders', label: 'Orders',
    events: [
      { id: 'new-order', label: 'New Order Placed', email: true, push: true, sms: false },
      { id: 'order-shipped', label: 'Order Shipped', email: true, push: true, sms: false },
      { id: 'order-delivered', label: 'Order Delivered', email: false, push: true, sms: false },
    ],
  },
  {
    id: 'payments', label: 'Payments',
    events: [
      { id: 'payment-received', label: 'Payment Received', email: true, push: true, sms: false },
      { id: 'payment-failed', label: 'Payment Failed', email: true, push: true, sms: true },
      { id: 'invoice-ready', label: 'Invoice Ready', email: true, push: false, sms: false },
    ],
  },
  {
    id: 'customers', label: 'Customers',
    events: [
      { id: 'new-registration', label: 'New Customer Registration', email: false, push: true, sms: false },
      { id: 'support-ticket', label: 'Support Ticket Created', email: true, push: true, sms: false },
    ],
  },
  {
    id: 'agents', label: 'AI Agents',
    events: [
      { id: 'agent-task', label: 'Agent Task Completed', email: false, push: true, sms: false },
      { id: 'agent-error', label: 'Agent Error', email: true, push: true, sms: true },
    ],
  },
  {
    id: 'reports', label: 'Reports',
    events: [
      { id: 'report-ready', label: 'Report Ready', email: true, push: true, sms: false },
      { id: 'weekly-digest', label: 'Weekly Digest', email: true, push: false, sms: false },
    ],
  },
];

// --- Sidebar Navigation ---
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Automation Studio', path: '/automation-studio', icon: 'Workflow' },
  { label: 'AI Workforce', path: '/ai-workforce', icon: 'Bot' },
  { label: 'AI Workflow Engine', path: '/ai-workflow-engine', icon: 'Cpu' },
  { label: 'Knowledge Graph', path: '/knowledge-graph', icon: 'Network' },
  { label: 'Customers', path: '/customers', icon: 'Users' },
  { label: 'Orders', path: '/orders', icon: 'ShoppingCart' },
  { label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { label: 'Customer Success', path: '/customer-success', icon: 'Heart' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

// --- Chart data (for SVG placeholders) ---
export const CHART_DATA = {
  revenue: [320000, 450000, 380000, 520000, 480000, 610000, 550000, 680000, 720000, 650000, 780000, 850000],
  orders: [120, 145, 132, 168, 155, 189, 175, 210, 198, 225, 240, 268],
  customers: [180, 210, 195, 240, 225, 270, 255, 300, 285, 330, 315, 360],
  aiProductivity: 94,
};

// --- User Profile ---
// ============================================================================
// AI Customer Intelligence — New Types & Data
// ============================================================================

export interface CustomerDNA {
  buyingFrequency: number;
  paymentReliability: number;
  communicationEngagement: number;
  loyalty: number;
  upsellReadiness: number;
  customerSatisfaction: number;
}

export interface PredictiveInsight {
  label: string;
  value: string;
  confidence: number;
  color: string;
}

export interface AIEvidence {
  label: string;
  detail: string;
  icon: string;
  category: 'behavior' | 'payment' | 'timing' | 'social';
}

export interface NextBestAction {
  title: string;
  explanation: string;
  impact: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WorkflowStage {
  label: string;
  completed: boolean;
  active: boolean;
  agent?: string;
}

export interface CustomerIntelligence {
  id: string;
  name: string;
  email: string;
  avatar: string;
  relationshipScore: number;
  customerHealth: 'Excellent' | 'Healthy' | 'Growing' | 'At Risk' | 'Churned';
  latestOrder: string;
  aiStatus: string;
  isVIP: boolean;
  lifetimeValue: number;
  lifetimeValueLabel: string;
  preferredChannel: string;
  avgResponseTime: string;
  aiSummary: string;
  favouriteProducts: { name: string; count: number }[];
  averageOrderValue: number;
  orderFrequency: string;
  mostActiveMonth: string;
  preferredPaymentMethod: string;
  averagePaymentTime: string;
  likelihoodToPurchaseAgain: number;
  estimatedNextPurchase: string;
  upsellOpportunity: 'High' | 'Medium' | 'Low';
  churnRisk: 'Low' | 'Medium' | 'High';
  overallAIConfidence: number;
  recommendations: { title: string; reason: string }[];
  timeline: { id: string; icon: string; color: string; title: string; description: string; time: string }[];
  networkNodes: { id: string; label: string; type: 'order' | 'payment' | 'invoice' | 'support' | 'agent'; connections: string[] }[];
  // ── Customer Intelligence 360° Workspace fields ──
  customerDNA: CustomerDNA;
  predictiveInsights: PredictiveInsight[];
  aiEvidence: AIEvidence[];
  nextBestActions: NextBestAction[];
  activeWorkflowStages: WorkflowStage[];
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

export const CUSTOMER_INTELLIGENCE: CustomerIntelligence[] = [
  {
    id: 'C001',
    name: 'Grace Eze',
    email: 'grace@ezeinnovations.com',
    avatar: 'GE',
    relationshipScore: 98,
    customerHealth: 'Excellent',
    latestOrder: 'Payment Verified',
    aiStatus: 'Finance Agent reviewing payment',
    isVIP: true,
    lifetimeValue: 1200000,
    lifetimeValueLabel: '₦1.2M',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '18 minutes',
    aiSummary: 'Grace Eze is one of your highest-value customers. She frequently orders celebration cakes, pays promptly, and engages positively with follow-up messages. Swift AI predicts a high likelihood of another purchase within the next month and recommends sending a loyalty offer after her current order is completed.',
    favouriteProducts: [
      { name: 'Custom Celebration Cake', count: 8 },
      { name: 'Cupcake Collection', count: 5 },
      { name: 'Premium Pastry Box', count: 3 },
    ],
    averageOrderValue: 48500,
    orderFrequency: 'Every 2-3 weeks',
    mostActiveMonth: 'December',
    preferredPaymentMethod: 'Bank Transfer',
    averagePaymentTime: '2 hours',
    likelihoodToPurchaseAgain: 94,
    estimatedNextPurchase: 'Within 30 days',
    upsellOpportunity: 'High',
    churnRisk: 'Low',
    overallAIConfidence: 97,
    recommendations: [
      { title: 'Offer Loyalty Discount', reason: 'High repeat purchase probability.' },
      { title: 'Recommend Premium Cupcake Collection', reason: 'Frequently orders celebration cakes.' },
      { title: 'Schedule Follow-up', reason: 'Customer usually responds to morning messages.' },
    ],
    timeline: [
      { id: 'GT1', icon: 'CheckCircle', color: '#22C55E', title: 'Finance Agent verified payment', description: 'Grace Eze\'s bank transfer of N185,000 confirmed for Custom Celebration Cake.', time: '2 hours ago' },
      { id: 'GT2', icon: 'FileText', color: '#4F46E5', title: 'Customer approved quotation', description: 'Grace Eze approved the 3-Tier Celebration Cake quotation.', time: '4 hours ago' },
      { id: 'GT3', icon: 'Truck', color: '#F59E0B', title: 'Birthday cake delivered', description: 'Grace Eze\'s previous order was delivered on schedule.', time: '2 weeks ago' },
      { id: 'GT4', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer submitted new inquiry', description: 'Grace Eze inquired about a custom celebration cake via WhatsApp.', time: '2 weeks ago' },
      { id: 'GT5', icon: 'Star', color: '#22C55E', title: 'Customer left a positive review', description: '5-star review: "Absolutely stunning cake! Everyone loved it."', time: '3 weeks ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1048', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment N185K', type: 'payment', connections: ['N1', 'N5'] },
      { id: 'N3', label: 'Invoice #INV-01', type: 'invoice', connections: ['N2'] },
      { id: 'N4', label: 'WhatsApp Chat', type: 'support', connections: ['N1'] },
      { id: 'N5', label: 'Finance Agent', type: 'agent', connections: ['N1', 'N2'] },
    ],
    phone: '+234 801 234 5678',
    location: '12 Awolowo Road, Ikoyi, Lagos',
    totalOrders: 24,
    totalSpent: 1200000,
    memberSince: 'March 2024',
    customerDNA: {
      buyingFrequency: 92,
      paymentReliability: 98,
      communicationEngagement: 85,
      loyalty: 96,
      upsellReadiness: 78,
      customerSatisfaction: 97,
    },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '94%', confidence: 97, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 30 days', confidence: 94, color: '#4F46E5' },
      { label: 'Expected CLV', value: '₦2.4M', confidence: 88, color: '#8B5CF6' },
      { label: 'Churn Risk', value: 'Low (3%)', confidence: 96, color: '#22C55E' },
      { label: 'Upsell Opportunity', value: 'High — Premium Cupcake Collection', confidence: 91, color: '#F59E0B' },
      { label: 'Recommended Product', value: 'Premium Cupcake Collection', confidence: 93, color: '#EC4899' },
    ],
    aiEvidence: [
      { label: 'Purchase Frequency', detail: 'Placed 6 orders in the last 8 months — consistently orders every 2-3 weeks.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Purchase Interval', detail: 'Average interval between orders is 41 days, indicating a reliable repeat buyer.', icon: 'Clock', category: 'timing' },
      { label: 'Payment History', detail: '100% of payments were successful. Prefers bank transfer and pays within 2 hours on average.', icon: 'CheckCircle', category: 'payment' },
      { label: 'Communication Pattern', detail: 'Responds fastest to WhatsApp messages sent before noon. Opens 95% of messages within 15 minutes.', icon: 'MessageSquare', category: 'behavior' },
      { label: 'Peer Comparison', detail: 'Repeat customers with similar purchasing behaviour ordered again within 30 days at a 91% rate.', icon: 'Users', category: 'social' },
      { label: 'Review Sentiment', detail: 'Left 4 five-star reviews. Average rating: 4.9/5. Frequently mentions "quality" and "presentation."', icon: 'Star', category: 'social' },
    ],
    nextBestActions: [
      { title: 'Offer Loyalty Discount', explanation: 'Grace has a 94% repeat purchase probability and has ordered 3 times this month. A loyalty discount strengthens retention.', impact: 'Expected retention increase of 18%', icon: 'Gift', priority: 'high' },
      { title: 'Prepare Birthday Promotion', explanation: 'Her profile shows multiple family celebrations. A pre-birthday reminder with a personalised offer could drive early orders.', impact: 'Potential order value: ₦45,000–₦85,000', icon: 'Cake', priority: 'high' },
      { title: 'Schedule WhatsApp Follow-up', explanation: 'Grace responds fastest to WhatsApp messages before noon. A midday check-in increases engagement by 35%.', impact: 'Response rate: 95% within 15 minutes', icon: 'MessageSquare', priority: 'medium' },
      { title: 'Recommend Premium Cupcake Collection', explanation: 'Frequently orders celebration cakes but has not tried the premium cupcake line. A targeted upsell could increase AOV.', impact: 'Potential AOV increase: ₦12,000–₦18,000', icon: 'Zap', priority: 'medium' },
      { title: 'Create Repeat Order Shortcut', explanation: 'With a 41-day average purchase interval, a one-click reorder button saves time and reduces friction.', impact: 'Estimated 22% faster reorder cycle', icon: 'ShoppingCart', priority: 'low' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Grace Eze' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'Grace Eze' },
      { label: 'Payment Verification', completed: false, active: true, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: false, active: false, agent: 'Customer Success' },
      { label: 'Completed', completed: false, active: false, agent: undefined },
    ],
  },
  {
    id: 'C002',
    name: 'Amaka Bello',
    email: 'amaka@bellotech.com',
    avatar: 'AB',
    relationshipScore: 91,
    customerHealth: 'Healthy',
    latestOrder: 'Quotation Ready',
    aiStatus: 'Sales Agent drafting quotation',
    isVIP: false,
    lifetimeValue: 320000,
    lifetimeValueLabel: '₦320K',
    preferredChannel: 'Email',
    avgResponseTime: '45 minutes',
    aiSummary: 'Amaka Bello is a growing corporate client who orders dessert packages for business events. She responds well to product recommendations and has shown interest in expanding her order sizes. Swift AI suggests offering a corporate volume discount to increase average order value.',
    favouriteProducts: [
      { name: 'Corporate Dessert Package', count: 6 },
      { name: 'Pastry Assortment', count: 4 },
    ],
    averageOrderValue: 35500,
    orderFrequency: 'Every 3-4 weeks',
    mostActiveMonth: 'March',
    preferredPaymentMethod: 'Mastercard',
    averagePaymentTime: '1 hour',
    likelihoodToPurchaseAgain: 88,
    estimatedNextPurchase: 'Within 2 weeks',
    upsellOpportunity: 'High',
    churnRisk: 'Low',
    overallAIConfidence: 95,
    recommendations: [
      { title: 'Offer Corporate Volume Discount', reason: 'Growing business client with bulk potential.' },
      { title: 'Recommend Premium Pastry Box', reason: 'Has not tried the premium line yet.' },
      { title: 'Send Weekly Menu Update', reason: 'Responds well to email product showcases.' },
    ],
    timeline: [
      { id: 'AT1', icon: 'FileText', color: '#4F46E5', title: 'Sales Agent created quotation', description: 'Corporate Dessert Package quotation prepared for Amaka Bello.', time: '1 hour ago' },
      { id: 'AT2', icon: 'ShoppingCart', color: '#4F46E5', title: 'Customer submitted inquiry', description: 'Amaka Bello requested a quote for a corporate event.', time: '3 hours ago' },
      { id: 'AT3', icon: 'CheckCircle', color: '#22C55E', title: 'Previous order completed', description: 'Corporate Dessert Package — 50 servings delivered on time.', time: '1 week ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Quotation', type: 'invoice', connections: ['N5'] },
      { id: 'N2', label: 'Order #1047', type: 'order', connections: ['N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1', 'N2'] },
    ],
    phone: '+234 802 345 6789',
    location: '45 Marina Street, Lagos Island, Lagos',
    totalOrders: 18,
    totalSpent: 320000,
    memberSince: 'May 2024',
    customerDNA: { buyingFrequency: 78, paymentReliability: 92, communicationEngagement: 70, loyalty: 82, upsellReadiness: 85, customerSatisfaction: 88 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '88%', confidence: 95, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 2 weeks', confidence: 91, color: '#4F46E5' },
      { label: 'Expected CLV', value: '₦680K', confidence: 85, color: '#8B5CF6' },
      { label: 'Churn Risk', value: 'Low (5%)', confidence: 93, color: '#22C55E' },
      { label: 'Upsell Opportunity', value: 'High — Corporate Package', confidence: 89, color: '#F59E0B' },
      { label: 'Recommended Product', value: 'Premium Pastry Box', confidence: 87, color: '#EC4899' },
    ],
    aiEvidence: [
      { label: 'Purchase Pattern', detail: 'Orders corporate dessert packages every 3-4 weeks for business events.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Response Time', detail: 'Responds to emails within 45 minutes on average.', icon: 'MessageSquare', category: 'behavior' },
      { label: 'Payment History', detail: '100% on-time payment via Mastercard.', icon: 'CheckCircle', category: 'payment' },
    ],
    nextBestActions: [
      { title: 'Offer Corporate Volume Discount', explanation: 'Growing business client with bulk potential.', impact: 'Expected AOV increase of 25%', icon: 'Gift', priority: 'high' },
      { title: 'Recommend Premium Pastry Box', explanation: 'Has not tried the premium line yet.', impact: 'Potential upsell: ₦12,000', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Amaka Bello' },
      { label: 'Quotation', completed: true, active: true, agent: 'Sales Agent' },
      { label: 'Approval', completed: false, active: false },
      { label: 'Payment Verification', completed: false, active: false },
      { label: 'Confirmation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C003',
    name: 'Chinedu Okafor',
    email: 'chinedu@okafor.com',
    avatar: 'CO',
    relationshipScore: 82,
    customerHealth: 'Growing',
    latestOrder: 'Awaiting Payment',
    aiStatus: 'Awaiting payment confirmation',
    isVIP: true,
    lifetimeValue: 890000,
    lifetimeValueLabel: '₦890K',
    preferredChannel: 'Phone Call',
    avgResponseTime: '2 hours',
    aiSummary: 'Chinedu Okafor is a loyal VIP customer who frequently refers new clients. He has a high lifetime value but his current order is awaiting payment. Swift AI recommends sending a gentle payment reminder and offering a referral bonus for his recent successful referrals.',
    favouriteProducts: [
      { name: 'Wedding Cake Package', count: 3 },
      { name: 'Birthday Cake Package', count: 7 },
      { name: 'Custom Celebration Cake', count: 5 },
    ],
    averageOrderValue: 62000,
    orderFrequency: 'Every 4-6 weeks',
    mostActiveMonth: 'October',
    preferredPaymentMethod: 'Bank Transfer',
    averagePaymentTime: '6 hours',
    likelihoodToPurchaseAgain: 76,
    estimatedNextPurchase: 'Within 60 days',
    upsellOpportunity: 'Medium',
    churnRisk: 'Low',
    overallAIConfidence: 93,
    recommendations: [
      { title: 'Send Payment Reminder', reason: 'Current order is awaiting payment confirmation.' },
      { title: 'Offer Referral Bonus', reason: 'Has referred 3 new customers this year.' },
      { title: 'Exclusive VIP Preview', reason: 'High-value customer who appreciates exclusivity.' },
    ],
    timeline: [
      { id: 'CT1', icon: 'Clock', color: '#F59E0B', title: 'Awaiting Payment', description: 'Chinedu Okafor\'s order is pending payment confirmation.', time: '1 day ago' },
      { id: 'CT2', icon: 'CheckCircle', color: '#22C55E', title: 'Customer approved quotation', description: 'Chinedu approved the 5-Tier Birthday Cake quotation.', time: '2 days ago' },
      { id: 'CT3', icon: 'Users', color: '#4F46E5', title: 'Referred new customer', description: 'Chinedu referred Faith Njeri to Sweet Crumbs Bakery.', time: '1 week ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1049', type: 'order', connections: ['N2'] },
      { id: 'N2', label: 'Payment Pending', type: 'payment', connections: ['N1', 'N5'] },
      { id: 'N5', label: 'Finance Agent', type: 'agent', connections: ['N2'] },
    ],
    phone: '+234 803 456 7890',
    location: 'Lagos, Nigeria',
    totalOrders: 42,
    totalSpent: 890000,
    memberSince: 'November 2023',
    customerDNA: { buyingFrequency: 65, paymentReliability: 60, communicationEngagement: 55, loyalty: 90, upsellReadiness: 50, customerSatisfaction: 88 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '76%', confidence: 93, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 60 days', confidence: 85, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (8%)', confidence: 91, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Referral History', detail: 'Has referred 3 new customers this year.', icon: 'Users', category: 'social' },
      { label: 'Payment Pattern', detail: 'Average payment time is 6 hours.', icon: 'Clock', category: 'payment' },
    ],
    nextBestActions: [
      { title: 'Send Payment Reminder', explanation: 'Current order is awaiting payment.', impact: 'Unlock ₦190K order', icon: 'Gift', priority: 'high' },
      { title: 'Offer Referral Bonus', explanation: 'Has referred 3 customers — reward loyalty.', impact: 'Encourage more referrals', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false },
      { label: 'Quotation', completed: true, active: false },
      { label: 'Approval', completed: true, active: false, agent: 'Chinedu Okafor' },
      { label: 'Payment Verification', completed: false, active: true, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C004',
    name: 'Adaobi Nwosu',
    email: 'adaobi@nwosu.com',
    avatar: 'AN',
    relationshipScore: 65,
    customerHealth: 'Growing',
    latestOrder: 'Wedding Cake Package',
    aiStatus: 'Quotation sent — awaiting approval',
    isVIP: false,
    lifetimeValue: 45000,
    lifetimeValueLabel: '₦45K',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '3 hours',
    aiSummary: 'Adaobi Nwosu is a new lead who enquired about the Wedding Cake Package. She is still in the early evaluation stage and has not yet approved the quotation. Swift AI recommends following up with a personalised consultation offer and sharing wedding cake portfolio images.',
    favouriteProducts: [
      { name: 'Wedding Cake Package', count: 1 },
    ],
    averageOrderValue: 45000,
    orderFrequency: 'First order',
    mostActiveMonth: 'January',
    preferredPaymentMethod: 'Bank Transfer',
    averagePaymentTime: '—',
    likelihoodToPurchaseAgain: 55,
    estimatedNextPurchase: 'Uncertain',
    upsellOpportunity: 'Medium',
    churnRisk: 'Medium',
    overallAIConfidence: 85,
    recommendations: [
      { title: 'Schedule Consultation Call', reason: 'New lead — needs personalised guidance.' },
      { title: 'Share Wedding Cake Portfolio', reason: 'Visual portfolio increases conversion by 40%.' },
      { title: 'Offer Tasting Session', reason: 'Tasting sessions convert 70% of wedding inquiries.' },
    ],
    timeline: [
      { id: 'ADT1', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer submitted new inquiry', description: 'Adaobi Nwosu enquired about the Wedding Cake Package.', time: '3 days ago' },
      { id: 'ADT2', icon: 'FileText', color: '#4F46E5', title: 'Quotation sent', description: 'Sales Agent sent Wedding Cake Package quotation.', time: '2 days ago' },
      { id: 'ADT3', icon: 'Clock', color: '#F59E0B', title: 'Awaiting customer response', description: 'Adaobi has viewed the quotation but not yet responded.', time: '1 day ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Inquiry', type: 'support', connections: ['N5'] },
      { id: 'N2', label: 'Quotation', type: 'invoice', connections: ['N1', 'N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1', 'N2'] },
    ],
    phone: '+234 803 456 7890',
    location: 'Victoria Island, Lagos',
    totalOrders: 1,
    totalSpent: 45000,
    memberSince: 'January 2025',
    customerDNA: { buyingFrequency: 10, paymentReliability: 30, communicationEngagement: 45, loyalty: 15, upsellReadiness: 60, customerSatisfaction: 40 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '55%', confidence: 85, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Uncertain', confidence: 70, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Medium (35%)', confidence: 82, color: '#F59E0B' },
    ],
    aiEvidence: [
      { label: 'Lead Stage', detail: 'New lead — evaluating Wedding Cake Package.', icon: 'Users', category: 'behavior' },
      { label: 'Response Time', detail: 'Has not responded to quotation for 2 days.', icon: 'Clock', category: 'timing' },
    ],
    nextBestActions: [
      { title: 'Schedule Consultation Call', explanation: 'New lead needs personalised guidance.', impact: 'Conversion rate: 65%', icon: 'Gift', priority: 'high' },
      { title: 'Share Wedding Cake Portfolio', explanation: 'Visual portfolio increases conversion.', impact: '40% higher conversion', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Adaobi Nwosu' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: false, active: true, agent: 'Adaobi Nwosu' },
      { label: 'Payment Verification', completed: false, active: false },
      { label: 'Confirmation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C005',
    name: 'Tolu Adebayo',
    email: 'tolu@adebayo.com',
    avatar: 'TA',
    relationshipScore: 72,
    customerHealth: 'Healthy',
    latestOrder: 'Subscription Cancelled',
    aiStatus: 'Retention offer sent',
    isVIP: false,
    lifetimeValue: 215000,
    lifetimeValueLabel: '₦215K',
    preferredChannel: 'Email',
    avgResponseTime: '1.5 hours',
    aiSummary: 'Tolu Adebayo is a growing account with an upsell opportunity, but recently cancelled the Monthly Dessert Subscription due to relocation. Swift AI has sent a retention offer with a 20% discount. The customer is reviewing the offer and is likely to re-engage.',
    favouriteProducts: [
      { name: 'Monthly Dessert Subscription', count: 6 },
      { name: 'Cupcake Collection', count: 3 },
    ],
    averageOrderValue: 28000,
    orderFrequency: 'Monthly',
    mostActiveMonth: 'June',
    preferredPaymentMethod: 'Visa',
    averagePaymentTime: '30 minutes',
    likelihoodToPurchaseAgain: 68,
    estimatedNextPurchase: 'Within 45 days',
    upsellOpportunity: 'Medium',
    churnRisk: 'Medium',
    overallAIConfidence: 90,
    recommendations: [
      { title: 'Follow Up on Retention Offer', reason: 'Customer is reviewing 20% discount offer.' },
      { title: 'Suggest Pay-As-You-Go Option', reason: 'Relocation may mean no long-term commitment.' },
      { title: 'Offer Gift Card', reason: 'Customer may prefer to give as a gift if moving.' },
    ],
    timeline: [
      { id: 'TT1', icon: 'XCircle', color: '#EF4444', title: 'Subscription Cancelled', description: 'Tolu Adebayo cancelled Monthly Dessert Subscription due to relocation.', time: '1 day ago' },
      { id: 'TT2', icon: 'Gift', color: '#4F46E5', title: 'Retention offer sent', description: 'Sales Agent offered 20% discount on next order.', time: '12 hours ago' },
      { id: 'TT3', icon: 'Clock', color: '#F59E0B', title: 'Awaiting customer response', description: 'Tolu is reviewing the retention offer.', time: '6 hours ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Subscription', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment Failed', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 804 567 8901',
    location: 'Ikeja, Lagos',
    totalOrders: 15,
    totalSpent: 215000,
    memberSince: 'September 2024',
    customerDNA: { buyingFrequency: 45, paymentReliability: 70, communicationEngagement: 60, loyalty: 50, upsellReadiness: 55, customerSatisfaction: 65 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '68%', confidence: 90, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 45 days', confidence: 82, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Medium (25%)', confidence: 88, color: '#F59E0B' },
    ],
    aiEvidence: [
      { label: 'Cancellation Reason', detail: 'Cancelled subscription due to relocation.', icon: 'Clock', category: 'behavior' },
      { label: 'Retention Offer', detail: 'Sent 20% discount — awaiting response.', icon: 'MessageSquare', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Follow Up on Retention Offer', explanation: 'Customer is reviewing the offer.', impact: 'Win-back: 35% probability', icon: 'Gift', priority: 'high' },
      { title: 'Suggest Pay-As-You-Go', explanation: 'Relocation may mean no commitment.', impact: 'Flexibility drives retention', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Cancellation', completed: true, active: false, agent: 'Tolu Adebayo' },
      { label: 'Retention Offer', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Customer Response', completed: false, active: true },
      { label: 'Re-engagement', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C008',
    name: 'Kwame Mensah',
    email: 'kwame@mensah.com',
    avatar: 'KM',
    relationshipScore: 94,
    customerHealth: 'Excellent',
    latestOrder: 'Birthday Cake Delivered',
    aiStatus: 'Customer Success sending thank-you',
    isVIP: true,
    lifetimeValue: 620000,
    lifetimeValueLabel: '₦620K',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '12 minutes',
    aiSummary: 'Kwame Mensah is a loyal customer who consistently orders birthday cakes for family celebrations. He is highly responsive on WhatsApp and pays promptly. Swift AI predicts a high likelihood of continued orders and recommends enrolling him in the VIP loyalty programme.',
    favouriteProducts: [
      { name: 'Birthday Cake Package', count: 12 },
      { name: 'Cupcake Collection', count: 8 },
      { name: 'Custom Celebration Cake', count: 4 },
    ],
    averageOrderValue: 42000,
    orderFrequency: 'Every 3-4 weeks',
    mostActiveMonth: 'August',
    preferredPaymentMethod: 'Mastercard',
    averagePaymentTime: '15 minutes',
    likelihoodToPurchaseAgain: 96,
    estimatedNextPurchase: 'Within 3 weeks',
    upsellOpportunity: 'High',
    churnRisk: 'Low',
    overallAIConfidence: 98,
    recommendations: [
      { title: 'Enrol in VIP Loyalty Programme', reason: 'Loyal customer with consistent purchase pattern.' },
      { title: 'Recommend Celebration Cake Book', reason: 'Orders birthday cakes most frequently.' },
      { title: 'Send Advance Birthday Reminder', reason: 'Has multiple family birthdays saved.' },
    ],
    timeline: [
      { id: 'KT1', icon: 'CheckCircle', color: '#22C55E', title: 'Birthday cake delivered', description: 'Kwame\'s Birthday Cake Package was delivered on time.', time: '1 week ago' },
      { id: 'KT2', icon: 'Star', color: '#22C55E', title: 'Customer left a positive review', description: '5-star review: "Best birthday cake in Lagos!"', time: '1 week ago' },
      { id: 'KT3', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer inquired about new order', description: 'Kwame asked about birthday cake options for his son.', time: '3 days ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1043', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment N85K', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Customer Success', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 806 789 0123',
    location: 'Ikoyi, Lagos',
    totalOrders: 31,
    totalSpent: 620000,
    memberSince: 'January 2024',
    customerDNA: { buyingFrequency: 95, paymentReliability: 99, communicationEngagement: 80, loyalty: 97, upsellReadiness: 75, customerSatisfaction: 98 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '96%', confidence: 98, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 3 weeks', confidence: 95, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (2%)', confidence: 97, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Purchase Pattern', detail: 'Orders birthday cakes every 3-4 weeks for family celebrations.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Payment History', detail: '100% on-time payment via Mastercard within 15 minutes.', icon: 'CheckCircle', category: 'payment' },
      { label: 'Review Sentiment', detail: 'Multiple 5-star reviews. Highly satisfied customer.', icon: 'Star', category: 'social' },
    ],
    nextBestActions: [
      { title: 'Enrol in VIP Loyalty Programme', explanation: 'Loyal customer with consistent purchase pattern.', impact: 'Retention increase: 25%', icon: 'Gift', priority: 'high' },
      { title: 'Send Advance Birthday Reminder', explanation: 'Has multiple family birthdays saved.', impact: 'Drives repeat orders', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Kwame Mensah' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'Kwame Mensah' },
      { label: 'Payment Verification', completed: true, active: false, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: true, active: false, agent: 'Customer Success' },
      { label: 'Completed', completed: true, active: true },
    ],
  },
  {
    id: 'C010',
    name: 'Brian Otieno',
    email: 'brian@otieno.com',
    avatar: 'BO',
    relationshipScore: 78,
    customerHealth: 'Healthy',
    latestOrder: 'Corporate Package Delivered',
    aiStatus: 'Customer Success sent follow-up',
    isVIP: false,
    lifetimeValue: 175000,
    lifetimeValueLabel: '₦175K',
    preferredChannel: 'Email',
    avgResponseTime: '1 hour',
    aiSummary: 'Brian Otieno is a steady corporate client with consistent growth. His recent order of a Corporate Dessert Package was delivered successfully. Swift AI recommends following up with a volume discount offer to encourage larger orders for his growing business.',
    favouriteProducts: [
      { name: 'Corporate Dessert Package', count: 4 },
      { name: 'Pastry Assortment', count: 2 },
    ],
    averageOrderValue: 32000,
    orderFrequency: 'Every 5-6 weeks',
    mostActiveMonth: 'September',
    preferredPaymentMethod: 'Mastercard',
    averagePaymentTime: '45 minutes',
    likelihoodToPurchaseAgain: 82,
    estimatedNextPurchase: 'Within 4 weeks',
    upsellOpportunity: 'Medium',
    churnRisk: 'Low',
    overallAIConfidence: 92,
    recommendations: [
      { title: 'Offer Volume Discount', reason: 'Steady growth — incentivise larger orders.' },
      { title: 'Suggest Premium Upgrade', reason: 'Has not tried the premium corporate line.' },
      { title: 'Schedule Quarterly Review', reason: 'Corporate client with growing needs.' },
    ],
    timeline: [
      { id: 'BT1', icon: 'CheckCircle', color: '#22C55E', title: 'Order delivered', description: 'Corporate Dessert Package — 80 servings delivered to Brian Otieno.', time: '2 days ago' },
      { id: 'BT2', icon: 'Truck', color: '#F59E0B', title: 'Order shipped', description: 'Brian Otieno\'s order was dispatched for delivery.', time: '3 days ago' },
      { id: 'BT3', icon: 'MessageSquare', color: '#8B5CF6', title: 'Follow-up sent', description: 'Customer Success sent satisfaction follow-up message.', time: '1 day ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1045', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment N150K', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Customer Success', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 808 901 2345',
    location: 'Victoria Island, Lagos',
    totalOrders: 9,
    totalSpent: 175000,
    memberSince: 'October 2024',
    customerDNA: { buyingFrequency: 50, paymentReliability: 85, communicationEngagement: 55, loyalty: 60, upsellReadiness: 65, customerSatisfaction: 75 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '82%', confidence: 92, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 4 weeks', confidence: 88, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (8%)', confidence: 90, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Growth Pattern', detail: 'Steady corporate client with increasing order sizes.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Payment History', detail: 'Always pays via Mastercard within 45 minutes.', icon: 'CheckCircle', category: 'payment' },
    ],
    nextBestActions: [
      { title: 'Offer Volume Discount', explanation: 'Steady growth — incentivise larger orders.', impact: 'AOV increase: 20%', icon: 'Gift', priority: 'high' },
      { title: 'Suggest Premium Upgrade', explanation: 'Has not tried the premium line.', impact: 'Upsell: ₦15,000–₦25,000', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Brian Otieno' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'Brian Otieno' },
      { label: 'Payment Verification', completed: true, active: false, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: true, active: false, agent: 'Customer Success' },
      { label: 'Completed', completed: true, active: true },
    ],
  },
  {
    id: 'C012',
    name: 'Thabo Mokoena',
    email: 'thabo@mokoena.com',
    avatar: 'TM',
    relationshipScore: 85,
    customerHealth: 'Healthy',
    latestOrder: 'Wedding Cake Package',
    aiStatus: 'Payment flagged — bank declined',
    isVIP: false,
    lifetimeValue: 285000,
    lifetimeValueLabel: '₦285K',
    preferredChannel: 'Phone Call',
    avgResponseTime: '4 hours',
    aiSummary: 'Thabo Mokoena is a multi-product buyer who has shown strong interest in the Wedding Cake Package. However, his recent payment was declined by the bank. Swift AI recommends contacting Thabo to resolve the payment issue and offering alternative payment methods.',
    favouriteProducts: [
      { name: 'Wedding Cake Package', count: 1 },
      { name: 'Custom Celebration Cake', count: 3 },
      { name: 'Cupcake Collection', count: 2 },
    ],
    averageOrderValue: 52000,
    orderFrequency: 'Every 6-8 weeks',
    mostActiveMonth: 'November',
    preferredPaymentMethod: 'Bank Transfer',
    averagePaymentTime: '8 hours',
    likelihoodToPurchaseAgain: 72,
    estimatedNextPurchase: 'Within 60 days',
    upsellOpportunity: 'Medium',
    churnRisk: 'Low',
    overallAIConfidence: 88,
    recommendations: [
      { title: 'Contact Customer About Payment', reason: 'Bank declined transaction — offer alternatives.' },
      { title: 'Suggest Alternative Payment', reason: 'Customer may prefer a different method.' },
      { title: 'Offer Payment Plan', reason: 'Large order amount — instalments may help.' },
    ],
    timeline: [
      { id: 'THT1', icon: 'XCircle', color: '#EF4444', title: 'Payment declined', description: 'Bank declined Thabo Mokoena\'s transaction for Wedding Cake Package.', time: '1 hour ago' },
      { id: 'THT2', icon: 'CheckCircle', color: '#22C55E', title: 'Customer approved quotation', description: 'Thabo approved the Wedding Cake Package quotation.', time: '1 day ago' },
      { id: 'THT3', icon: 'FileText', color: '#4F46E5', title: 'Quotation generated', description: 'Sales Agent generated Wedding Cake Package quotation.', time: '2 days ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1042', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment Declined', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Finance Agent', type: 'agent', connections: ['N1', 'N2'] },
    ],
    phone: '+234 809 012 3456',
    location: 'Ikoyi, Lagos',
    totalOrders: 11,
    totalSpent: 285000,
    memberSince: 'June 2024',
    customerDNA: { buyingFrequency: 35, paymentReliability: 40, communicationEngagement: 30, loyalty: 55, upsellReadiness: 50, customerSatisfaction: 60 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '72%', confidence: 88, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 60 days', confidence: 80, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (10%)', confidence: 85, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Payment Issue', detail: 'Bank declined transaction — insufficient funds.', icon: 'XCircle', category: 'payment' },
      { label: 'Purchase Interest', detail: 'Strong interest in Wedding Cake Package.', icon: 'ShoppingCart', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Contact Customer About Payment', explanation: 'Bank declined — offer alternatives.', impact: 'Unlock ₦450K order', icon: 'Gift', priority: 'high' },
      { title: 'Offer Payment Plan', explanation: 'Large amount — instalments may help.', impact: 'Conversion: 60% probability', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Thabo Mokoena' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'Thabo Mokoena' },
      { label: 'Payment Verification', completed: false, active: true, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C013',
    name: 'Naledi Dlamini',
    email: 'naledi@dlamini.com',
    avatar: 'ND',
    relationshipScore: 88,
    customerHealth: 'Excellent',
    latestOrder: 'Celebration Cake Delivered',
    aiStatus: 'Customer Success sent thank-you',
    isVIP: false,
    lifetimeValue: 310000,
    lifetimeValueLabel: '₦310K',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '25 minutes',
    aiSummary: 'Naledi Dlamini is a regular customer who orders celebration cakes for special occasions. She pays promptly and always leaves positive feedback. Swift AI recommends enrolling her in the loyalty programme and suggesting a subscription for regular deliveries.',
    favouriteProducts: [
      { name: 'Custom Celebration Cake', count: 6 },
      { name: 'Cupcake Collection', count: 4 },
    ],
    averageOrderValue: 38000,
    orderFrequency: 'Every 3-4 weeks',
    mostActiveMonth: 'May',
    preferredPaymentMethod: 'Mastercard',
    averagePaymentTime: '20 minutes',
    likelihoodToPurchaseAgain: 90,
    estimatedNextPurchase: 'Within 3 weeks',
    upsellOpportunity: 'Medium',
    churnRisk: 'Low',
    overallAIConfidence: 95,
    recommendations: [
      { title: 'Enrol in Loyalty Programme', reason: 'Regular customer with consistent purchase pattern.' },
      { title: 'Suggest Monthly Subscription', reason: 'Orders celebration cakes every 3-4 weeks.' },
      { title: 'Send Thank-You Gift', reason: 'Highly engaged customer who leaves positive reviews.' },
    ],
    timeline: [
      { id: 'NT1', icon: 'CheckCircle', color: '#22C55E', title: 'Celebration cake delivered', description: 'Custom Celebration Cake — 2-Tier delivered to Naledi Dlamini.', time: '3 days ago' },
      { id: 'NT2', icon: 'Star', color: '#22C55E', title: 'Customer left a positive review', description: '5-star review: "Beautiful cake, exceeded expectations!"', time: '3 days ago' },
      { id: 'NT3', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer submitted new inquiry', description: 'Naledi enquired about options for her next celebration.', time: '1 day ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1044', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment N145K', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Customer Success', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 810 123 4567',
    location: 'Lekki, Lagos',
    totalOrders: 14,
    totalSpent: 310000,
    memberSince: 'August 2024',
    customerDNA: { buyingFrequency: 72, paymentReliability: 95, communicationEngagement: 65, loyalty: 78, upsellReadiness: 60, customerSatisfaction: 94 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '90%', confidence: 95, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 3 weeks', confidence: 92, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (4%)', confidence: 94, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Purchase Pattern', detail: 'Orders celebration cakes every 3-4 weeks.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Payment History', detail: 'Pays via Mastercard within 20 minutes.', icon: 'CheckCircle', category: 'payment' },
      { label: 'Review Sentiment', detail: 'Leaves 5-star reviews consistently.', icon: 'Star', category: 'social' },
    ],
    nextBestActions: [
      { title: 'Enrol in Loyalty Programme', explanation: 'Regular customer with consistent pattern.', impact: 'Retention: +22%', icon: 'Gift', priority: 'high' },
      { title: 'Suggest Monthly Subscription', explanation: 'Orders every 3-4 weeks — subscription fits.', impact: 'Recurring revenue: ₦38K/mo', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Naledi Dlamini' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'Naledi Dlamini' },
      { label: 'Payment Verification', completed: true, active: false, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: true, active: false, agent: 'Customer Success' },
      { label: 'Completed', completed: true, active: true },
    ],
  },
  {
    id: 'C014',
    name: 'David Mensah',
    email: 'david@mensah.com',
    avatar: 'DM',
    relationshipScore: 80,
    customerHealth: 'Healthy',
    latestOrder: 'Event Catering Delivered',
    aiStatus: 'Customer Success sent feedback request',
    isVIP: false,
    lifetimeValue: 420000,
    lifetimeValueLabel: '₦420K',
    preferredChannel: 'Email',
    avgResponseTime: '1.5 hours',
    aiSummary: 'David Mensah is a high-value customer who frequently orders Event Catering for corporate functions. He has a steady order pattern and pays reliably. Swift AI recommends offering a corporate partnership package to secure recurring monthly business.',
    favouriteProducts: [
      { name: 'Event Catering Package', count: 8 },
      { name: 'Corporate Dessert Package', count: 5 },
    ],
    averageOrderValue: 55000,
    orderFrequency: 'Every 2-3 weeks',
    mostActiveMonth: 'February',
    preferredPaymentMethod: 'Bank Transfer',
    averagePaymentTime: '3 hours',
    likelihoodToPurchaseAgain: 92,
    estimatedNextPurchase: 'Within 2 weeks',
    upsellOpportunity: 'High',
    churnRisk: 'Low',
    overallAIConfidence: 96,
    recommendations: [
      { title: 'Propose Corporate Partnership', reason: 'High-value customer with frequent catering orders.' },
      { title: 'Offer Exclusive Event Menu', reason: 'Customer orders Event Catering most frequently.' },
      { title: 'Schedule Business Review', reason: 'Growing corporate account with partnership potential.' },
    ],
    timeline: [
      { id: 'DT1', icon: 'CheckCircle', color: '#22C55E', title: 'Event catering delivered', description: 'Event Catering Package delivered for David Mensah\'s corporate event.', time: '5 days ago' },
      { id: 'DT2', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer feedback request sent', description: 'Customer Success sent satisfaction survey.', time: '4 days ago' },
      { id: 'DT3', icon: 'ShoppingCart', color: '#4F46E5', title: 'Customer submitted new inquiry', description: 'David enquired about catering for upcoming board meeting.', time: '2 days ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1050', type: 'order', connections: ['N2', 'N5'] },
      { id: 'N2', label: 'Payment N85K', type: 'payment', connections: ['N1'] },
      { id: 'N5', label: 'Customer Success', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 811 234 5678',
    location: 'Victoria Island, Lagos',
    totalOrders: 22,
    totalSpent: 420000,
    memberSince: 'February 2024',
    customerDNA: { buyingFrequency: 85, paymentReliability: 82, communicationEngagement: 60, loyalty: 75, upsellReadiness: 80, customerSatisfaction: 85 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '92%', confidence: 96, color: '#22C55E' },
      { label: 'Estimated Next Purchase', value: 'Within 2 weeks', confidence: 93, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Low (5%)', confidence: 94, color: '#22C55E' },
    ],
    aiEvidence: [
      { label: 'Purchase Pattern', detail: 'Orders Event Catering every 2-3 weeks.', icon: 'ShoppingCart', category: 'behavior' },
      { label: 'Payment History', detail: 'Reliable bank transfer payer.', icon: 'CheckCircle', category: 'payment' },
      { label: 'Growth Potential', detail: 'High-value customer with partnership potential.', icon: 'TrendingUp', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Propose Corporate Partnership', explanation: 'High-value with frequent catering orders.', impact: 'Recurring revenue: ₦220K/mo', icon: 'Gift', priority: 'high' },
      { title: 'Offer Exclusive Event Menu', explanation: 'Orders Event Catering most frequently.', impact: 'AOV increase: 30%', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'David Mensah' },
      { label: 'Quotation', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Approval', completed: true, active: false, agent: 'David Mensah' },
      { label: 'Payment Verification', completed: true, active: false, agent: 'Finance Agent' },
      { label: 'Confirmation', completed: true, active: false, agent: 'Customer Success' },
      { label: 'Completed', completed: true, active: true },
    ],
  },
  {
    id: 'C006',
    name: 'Kofi Asante',
    email: 'kofi@asante.com',
    avatar: 'KA',
    relationshipScore: 45,
    customerHealth: 'Growing',
    latestOrder: 'Premium Pastry Box',
    aiStatus: 'Sales Agent drafting quotation',
    isVIP: false,
    lifetimeValue: 0,
    lifetimeValueLabel: '₦0',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '—',
    aiSummary: 'Kofi Asante is a qualified lead who has expressed interest in the Premium Pastry Box. He is still in the early evaluation stage and has not yet placed an order. Swift AI recommends sharing product photos and customer testimonials to convert this lead.',
    favouriteProducts: [],
    averageOrderValue: 0,
    orderFrequency: 'No orders yet',
    mostActiveMonth: '—',
    preferredPaymentMethod: '—',
    averagePaymentTime: '—',
    likelihoodToPurchaseAgain: 45,
    estimatedNextPurchase: 'Uncertain',
    upsellOpportunity: 'Low',
    churnRisk: 'High',
    overallAIConfidence: 75,
    recommendations: [
      { title: 'Share Product Photos', reason: 'Visual content increases lead conversion by 35%.' },
      { title: 'Share Customer Testimonials', reason: 'New lead — needs social proof to convert.' },
      { title: 'Offer First Order Discount', reason: 'First-time buyer incentive reduces friction.' },
    ],
    timeline: [
      { id: 'KT1', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer submitted new inquiry', description: 'Kofi Asante inquired about the Premium Pastry Box via WhatsApp.', time: '5 hours ago' },
      { id: 'KT2', icon: 'Clock', color: '#F59E0B', title: 'Quotation pending', description: 'Sales Agent is preparing a quotation for the Premium Pastry Box.', time: '2 hours ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Inquiry', type: 'support', connections: ['N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 805 678 9012',
    location: 'Ikeja, Lagos',
    totalOrders: 0,
    totalSpent: 0,
    memberSince: 'February 2025',
    customerDNA: { buyingFrequency: 0, paymentReliability: 0, communicationEngagement: 35, loyalty: 0, upsellReadiness: 10, customerSatisfaction: 0 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '45%', confidence: 75, color: '#F59E0B' },
      { label: 'Lead Score', value: 'Qualified Lead', confidence: 75, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'High (60%)', confidence: 72, color: '#EF4444' },
    ],
    aiEvidence: [
      { label: 'Lead Source', detail: 'New lead — inquired via WhatsApp about Premium Pastry Box.', icon: 'MessageSquare', category: 'behavior' },
      { label: 'No Purchase History', detail: 'Has not placed any orders yet.', icon: 'Clock', category: 'timing' },
    ],
    nextBestActions: [
      { title: 'Share Product Photos', explanation: 'Visual content increases conversion by 35%.', impact: 'Conversion: 35% higher', icon: 'Gift', priority: 'high' },
      { title: 'Offer First Order Discount', explanation: 'First-time buyer incentive reduces friction.', impact: 'Reduces purchase hesitation', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Kofi Asante' },
      { label: 'Quotation', completed: false, active: true, agent: 'Sales Agent' },
      { label: 'Approval', completed: false, active: false },
      { label: 'Payment Verification', completed: false, active: false },
      { label: 'Confirmation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C015',
    name: 'Zainab Ibrahim',
    email: 'zainab@ibrahim.com',
    avatar: 'ZI',
    relationshipScore: 50,
    customerHealth: 'Growing',
    latestOrder: 'Wedding Cake Inquiry',
    aiStatus: 'Sales Agent qualified lead',
    isVIP: false,
    lifetimeValue: 35000,
    lifetimeValueLabel: '₦35K',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '—',
    aiSummary: 'Zainab Ibrahim is a new lead who has shown interest in the Wedding Cake Package. She has placed a small initial order and is evaluating Sweet Crumbs for her wedding. Swift AI recommends scheduling a consultation and sharing the wedding cake portfolio.',
    favouriteProducts: [
      { name: 'Wedding Cake Package', count: 1 },
    ],
    averageOrderValue: 35000,
    orderFrequency: 'One-time',
    mostActiveMonth: 'March',
    preferredPaymentMethod: '—',
    averagePaymentTime: '—',
    likelihoodToPurchaseAgain: 60,
    estimatedNextPurchase: 'Within 30 days',
    upsellOpportunity: 'High',
    churnRisk: 'Medium',
    overallAIConfidence: 82,
    recommendations: [
      { title: 'Schedule Wedding Consultation', reason: 'Bride-to-be evaluating wedding cake options.' },
      { title: 'Share Wedding Cake Portfolio', reason: 'Visual portfolio increases wedding conversion by 50%.' },
      { title: 'Offer Tasting Session', reason: 'Tasting sessions are critical for wedding decisions.' },
    ],
    timeline: [
      { id: 'ZT1', icon: 'MessageSquare', color: '#8B5CF6', title: 'Customer submitted inquiry', description: 'Zainab Ibrahim enquired about the Wedding Cake Package.', time: '2 days ago' },
      { id: 'ZT2', icon: 'CheckCircle', color: '#4F46E5', title: 'Lead qualified', description: 'Sales Agent qualified Zainab as a high-potential wedding lead.', time: '1 day ago' },
      { id: 'ZT3', icon: 'ShoppingCart', color: '#4F46E5', title: 'Initial order placed', description: 'Zainab placed a small order for the Premium Pastry Box.', time: '1 day ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Inquiry', type: 'support', connections: ['N5'] },
      { id: 'N2', label: 'Order #1051', type: 'order', connections: ['N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1', 'N2'] },
    ],
    phone: '+234 812 345 6789',
    location: 'Lagos, Nigeria',
    totalOrders: 1,
    totalSpent: 35000,
    memberSince: 'March 2025',
    customerDNA: { buyingFrequency: 5, paymentReliability: 10, communicationEngagement: 50, loyalty: 10, upsellReadiness: 70, customerSatisfaction: 30 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '60%', confidence: 82, color: '#F59E0B' },
      { label: 'Estimated Next Purchase', value: 'Within 30 days', confidence: 78, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Medium (30%)', confidence: 80, color: '#F59E0B' },
    ],
    aiEvidence: [
      { label: 'Lead Qualification', detail: 'High-potential wedding lead — initial order placed.', icon: 'Users', category: 'behavior' },
      { label: 'Purchase Intent', detail: 'Evaluating Wedding Cake Package for wedding.', icon: 'ShoppingCart', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Schedule Wedding Consultation', explanation: 'Bride-to-be evaluating options.', impact: 'Wedding conversion: 50% higher', icon: 'Gift', priority: 'high' },
      { title: 'Share Wedding Cake Portfolio', explanation: 'Visual portfolio increases conversion.', impact: '50% higher conversion', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Zainab Ibrahim' },
      { label: 'Lead Qualification', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Consultation', completed: false, active: true },
      { label: 'Quotation', completed: false, active: false },
      { label: 'Approval', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C007',
    name: 'Ama Boateng',
    email: 'ama@boateng.com',
    avatar: 'AM',
    relationshipScore: 35,
    customerHealth: 'At Risk',
    latestOrder: 'No recent orders',
    aiStatus: 'Re-engagement campaign ready',
    isVIP: false,
    lifetimeValue: 95000,
    lifetimeValueLabel: '₦95K',
    preferredChannel: 'Email',
    avgResponseTime: '—',
    aiSummary: 'Ama Boateng is a dormant customer who has not ordered in over 3 months. She previously ordered the Monthly Dessert Subscription. Swift AI recommends launching a re-engagement campaign with a special offer to win back her business.',
    favouriteProducts: [
      { name: 'Monthly Dessert Subscription', count: 3 },
      { name: 'Cupcake Collection', count: 2 },
    ],
    averageOrderValue: 28000,
    orderFrequency: 'Monthly (was)',
    mostActiveMonth: 'July',
    preferredPaymentMethod: 'Visa',
    averagePaymentTime: '1 hour',
    likelihoodToPurchaseAgain: 30,
    estimatedNextPurchase: 'Uncertain',
    upsellOpportunity: 'Low',
    churnRisk: 'High',
    overallAIConfidence: 80,
    recommendations: [
      { title: 'Launch Re-engagement Campaign', reason: 'Dormant for 3+ months — win-back needed.' },
      { title: 'Offer 30% Welcome Back Discount', reason: 'Strong incentive to re-engage dormant customers.' },
      { title: 'Send Monthly Dessert Highlights', reason: 'Previously subscribed to Monthly Dessert.' },
    ],
    timeline: [
      { id: 'AMT1', icon: 'Clock', color: '#F59E0B', title: 'Last order 3+ months ago', description: 'Ama Boateng\'s last order was the Monthly Dessert Subscription.', time: '3 months ago' },
      { id: 'AMT2', icon: 'Gift', color: '#4F46E5', title: 'Re-engagement campaign ready', description: 'Sales Agent prepared win-back campaign for Ama Boateng.', time: '1 week ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Subscription', type: 'order', connections: ['N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 813 456 7890',
    location: 'Lagos, Nigeria',
    totalOrders: 6,
    totalSpent: 95000,
    memberSince: 'July 2024',
    customerDNA: { buyingFrequency: 15, paymentReliability: 75, communicationEngagement: 20, loyalty: 25, upsellReadiness: 5, customerSatisfaction: 50 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '30%', confidence: 80, color: '#EF4444' },
      { label: 'Win-back Probability', value: '45% with discount', confidence: 75, color: '#F59E0B' },
      { label: 'Churn Risk', value: 'High (65%)', confidence: 82, color: '#EF4444' },
    ],
    aiEvidence: [
      { label: 'Dormancy Period', detail: 'No orders for 3+ months — was previously active.', icon: 'Clock', category: 'timing' },
      { label: 'Previous Engagement', detail: 'Subscribed to Monthly Dessert Subscription.', icon: 'ShoppingCart', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Launch Re-engagement Campaign', explanation: 'Dormant for 3+ months — win-back needed.', impact: 'Win-back: 30% probability', icon: 'Gift', priority: 'high' },
      { title: 'Offer 30% Welcome Back Discount', explanation: 'Strong incentive to re-engage.', impact: 'Conversion: 2x higher', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Dormancy Detected', completed: true, active: false, agent: 'Swift AI' },
      { label: 'Re-engagement Campaign', completed: false, active: true, agent: 'Sales Agent' },
      { label: 'Customer Response', completed: false, active: false },
      { label: 'Re-activation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C009',
    name: 'Amina Wanjiku',
    email: 'amina@wanjiku.com',
    avatar: 'AW',
    relationshipScore: 28,
    customerHealth: 'Churned',
    latestOrder: 'No recent orders',
    aiStatus: 'Win-back campaign available',
    isVIP: false,
    lifetimeValue: 55000,
    lifetimeValueLabel: '₦55K',
    preferredChannel: 'Email',
    avgResponseTime: '—',
    aiSummary: 'Amina Wanjiku has churned and not ordered in over 6 months. She previously purchased the Luxury Cupcake Collection. Swift AI recommends a win-back campaign with a compelling offer to re-engage this former customer.',
    favouriteProducts: [
      { name: 'Luxury Cupcake Collection', count: 2 },
    ],
    averageOrderValue: 22000,
    orderFrequency: 'Occasional',
    mostActiveMonth: 'April',
    preferredPaymentMethod: 'Visa',
    averagePaymentTime: '2 hours',
    likelihoodToPurchaseAgain: 15,
    estimatedNextPurchase: 'Unlikely',
    upsellOpportunity: 'Low',
    churnRisk: 'High',
    overallAIConfidence: 75,
    recommendations: [
      { title: 'Launch Win-Back Campaign', reason: 'Churned for 6+ months — last chance to re-engage.' },
      { title: 'Offer 40% Discount', reason: 'Strong incentive needed to win back churned customer.' },
      { title: 'Send New Product Announcement', reason: 'New products may rekindle interest.' },
    ],
    timeline: [
      { id: 'AWT1', icon: 'Clock', color: '#F59E0B', title: 'Last order 6+ months ago', description: 'Amina Wanjiku\'s last order was the Luxury Cupcake Collection.', time: '6 months ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1052', type: 'order', connections: [] },
    ],
    phone: '+234 814 567 8901',
    location: 'Lagos, Nigeria',
    totalOrders: 3,
    totalSpent: 55000,
    memberSince: 'April 2024',
    customerDNA: { buyingFrequency: 5, paymentReliability: 60, communicationEngagement: 10, loyalty: 8, upsellReadiness: 0, customerSatisfaction: 30 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '15%', confidence: 75, color: '#EF4444' },
      { label: 'Win-back Probability', value: '25% with 40% discount', confidence: 70, color: '#EF4444' },
      { label: 'Churn Risk', value: 'High (85%)', confidence: 78, color: '#EF4444' },
    ],
    aiEvidence: [
      { label: 'Churn Duration', detail: 'No orders for 6+ months — fully churned.', icon: 'Clock', category: 'timing' },
      { label: 'Last Purchase', detail: 'Previously purchased Luxury Cupcake Collection.', icon: 'ShoppingCart', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Launch Win-Back Campaign', explanation: 'Churned for 6+ months — last chance.', impact: 'Win-back: 15% probability', icon: 'Gift', priority: 'high' },
      { title: 'Send New Product Announcement', explanation: 'New products may rekindle interest.', impact: 'Re-engagement: 20%', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Churn Detected', completed: true, active: false, agent: 'Swift AI' },
      { label: 'Win-back Campaign', completed: false, active: true, agent: 'Sales Agent' },
      { label: 'Customer Response', completed: false, active: false },
      { label: 'Re-activation', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
  {
    id: 'C011',
    name: 'Faith Njeri',
    email: 'faith@njeri.com',
    avatar: 'FN',
    relationshipScore: 55,
    customerHealth: 'Growing',
    latestOrder: 'Birthday Cake Package',
    aiStatus: 'Sales Agent sent follow-up',
    isVIP: false,
    lifetimeValue: 28000,
    lifetimeValueLabel: '₦28K',
    preferredChannel: 'WhatsApp',
    avgResponseTime: '—',
    aiSummary: 'Faith Njeri is a trial user with high conversion potential. She was referred by Chinedu Okafor and has placed a small birthday cake order. Swift AI recommends nurturing this lead with personalised recommendations and a referral thank-you.',
    favouriteProducts: [
      { name: 'Birthday Cake Package', count: 1 },
    ],
    averageOrderValue: 28000,
    orderFrequency: 'Trial',
    mostActiveMonth: 'March',
    preferredPaymentMethod: '—',
    averagePaymentTime: '—',
    likelihoodToPurchaseAgain: 65,
    estimatedNextPurchase: 'Within 30 days',
    upsellOpportunity: 'Medium',
    churnRisk: 'Medium',
    overallAIConfidence: 82,
    recommendations: [
      { title: 'Send Personalised Recommendations', reason: 'Trial user — needs guidance to convert.' },
      { title: 'Thank Referring Customer', reason: 'Referred by Chinedu Okafor — strengthen referral loop.' },
      { title: 'Offer Birthday Club Membership', reason: 'Interested in birthday cakes — natural upsell.' },
    ],
    timeline: [
      { id: 'FT1', icon: 'ShoppingCart', color: '#4F46E5', title: 'Birthday cake ordered', description: 'Faith Njeri ordered the Birthday Cake Package.', time: '1 week ago' },
      { id: 'FT2', icon: 'MessageSquare', color: '#8B5CF6', title: 'Follow-up sent', description: 'Sales Agent sent personalised recommendations to Faith.', time: '5 days ago' },
      { id: 'FT3', icon: 'Users', color: '#4F46E5', title: 'Referred by Chinedu Okafor', description: 'Faith was referred by VIP customer Chinedu Okafor.', time: '2 weeks ago' },
    ],
    networkNodes: [
      { id: 'N1', label: 'Order #1053', type: 'order', connections: ['N5'] },
      { id: 'N5', label: 'Sales Agent', type: 'agent', connections: ['N1'] },
    ],
    phone: '+234 815 678 9012',
    location: 'Lagos, Nigeria',
    totalOrders: 2,
    totalSpent: 28000,
    memberSince: 'March 2025',
    customerDNA: { buyingFrequency: 8, paymentReliability: 15, communicationEngagement: 55, loyalty: 12, upsellReadiness: 45, customerSatisfaction: 35 },
    predictiveInsights: [
      { label: 'Likelihood to Purchase Again', value: '65%', confidence: 82, color: '#F59E0B' },
      { label: 'Estimated Next Purchase', value: 'Within 30 days', confidence: 78, color: '#4F46E5' },
      { label: 'Churn Risk', value: 'Medium (35%)', confidence: 80, color: '#F59E0B' },
    ],
    aiEvidence: [
      { label: 'Referral Source', detail: 'Referred by VIP customer Chinedu Okafor.', icon: 'Users', category: 'social' },
      { label: 'Trial Order', detail: 'Placed small birthday cake order — trial stage.', icon: 'ShoppingCart', category: 'behavior' },
    ],
    nextBestActions: [
      { title: 'Send Personalised Recommendations', explanation: 'Trial user needs guidance to convert.', impact: 'Conversion: 45% probability', icon: 'Gift', priority: 'high' },
      { title: 'Thank Referring Customer', explanation: 'Strengthen referral loop with Chinedu.', impact: 'Referral loop: +3 potential', icon: 'Zap', priority: 'medium' },
    ],
    activeWorkflowStages: [
      { label: 'Inquiry', completed: true, active: false, agent: 'Faith Njeri' },
      { label: 'Trial Order', completed: true, active: false, agent: 'Sales Agent' },
      { label: 'Follow-up', completed: false, active: true, agent: 'Sales Agent' },
      { label: 'Conversion', completed: false, active: false },
      { label: 'Retention', completed: false, active: false },
      { label: 'Completed', completed: false, active: false },
    ],
  },
];

export const USER_PROFILE = {
  name: 'Lawrence Ezealor',
  email: 'lawrence@sweetcrumbbakery.com',
  role: 'Admin',
  avatar: 'LE',
  company: 'Sweet Crumbs Bakery',
};

// ============================================================================
// Orders Page — Kanban Board, AI Assistant, Timeline & Activity
// ============================================================================

export interface KanbanOrder {
  id: string;
  customer: string;
  customerInitials: string;
  product: string;
  amount: number;
  status: 'new' | 'processing' | 'completed' | 'issue';
  priority: 'high' | 'medium' | 'low';
  aiRecommendation: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  customerInfo: { name: string; email: string; phone: string };
  shippingAddress: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  internalNotes: { text: string; author: string; time: string }[];
  timeline: { status: string; date: string; completed: boolean; agent?: string; agentInitials?: string }[];
}

export const KANBAN_ORDERS: KanbanOrder[] = [
  {
    id: 'ORD-1048',
    customer: 'Grace Eze',
    customerInitials: 'GE',
    product: 'Custom Celebration Cake',
    amount: 185000,
    status: 'processing',
    priority: 'high',
    aiRecommendation: 'Payment verification in progress — Finance Agent reviewing',
    date: '2025-07-24',
    items: [
      { name: 'Custom Celebration Cake — 3-Tier', qty: 1, price: 185000 },
    ],
    customerInfo: { name: 'Grace Eze', email: 'grace@ezeinnovations.com', phone: '+234 801 234 5678' },
    shippingAddress: '12 Awolowo Road, Ikoyi, Lagos',
    paymentStatus: 'pending',
    internalNotes: [
      { text: 'Customer requested expedited delivery for Saturday celebration.', author: 'Sales Agent', time: '1h ago' },
      { text: 'Bank transfer initiated — awaiting confirmation.', author: 'Finance Agent', time: '30m ago' },
    ],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 09:15', completed: true, agent: 'Grace Eze', agentInitials: 'GE' },
      { status: 'Sales Agent created quotation', date: '2025-07-24 09:18', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-24 10:02', completed: true, agent: 'Grace Eze', agentInitials: 'GE' },
      { status: 'Finance Agent verifying payment', date: '2025-07-24 10:05', completed: false, agent: 'Finance Agent', agentInitials: 'FA' },
    ],
  },
  {
    id: 'ORD-1047',
    customer: 'Amaka Bello',
    customerInitials: 'AB',
    product: 'Corporate Dessert Package',
    amount: 95000,
    status: 'new',
    priority: 'medium',
    aiRecommendation: 'Quotation ready for review',
    date: '2025-07-24',
    items: [
      { name: 'Corporate Dessert Package — 50 servings', qty: 1, price: 95000 },
    ],
    customerInfo: { name: 'Amaka Bello', email: 'amaka@bellotech.com', phone: '+234 802 345 6789' },
    shippingAddress: '45 Marina Street, Lagos Island, Lagos',
    paymentStatus: 'pending',
    internalNotes: [],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 11:30', completed: true, agent: 'Amaka Bello', agentInitials: 'AB' },
      { status: 'Sales Agent creating quotation', date: '—', completed: false, agent: 'Sales Agent', agentInitials: 'SA' },
    ],
  },
  {
    id: 'ORD-1046',
    customer: 'Adaobi Nwosu',
    customerInitials: 'AN',
    product: 'Wedding Cake Package',
    amount: 450000,
    status: 'processing',
    priority: 'high',
    aiRecommendation: 'Payment verification in progress — large transfer',
    date: '2025-07-23',
    items: [
      { name: 'Wedding Cake — 5-Tier Premium', qty: 1, price: 450000 },
    ],
    customerInfo: { name: 'Adaobi Nwosu', email: 'adaobi@nwosu.com', phone: '+234 803 456 7890' },
    shippingAddress: '8 Bishop Aboyade Cole Street, Victoria Island, Lagos',
    paymentStatus: 'pending',
    internalNotes: [
      { text: 'Finance Agent is reviewing bank transfer for N450,000.', author: 'Finance Agent', time: '30m ago' },
    ],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-23 08:00', completed: true, agent: 'Adaobi Nwosu', agentInitials: 'AN' },
      { status: 'Sales Agent created quotation', date: '2025-07-23 08:05', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-23 09:30', completed: true, agent: 'Adaobi Nwosu', agentInitials: 'AN' },
      { status: 'Finance Agent verifying payment', date: '2025-07-23 09:35', completed: false, agent: 'Finance Agent', agentInitials: 'FA' },
    ],
  },
  {
    id: 'ORD-1045',
    customer: 'Brian Otieno',
    customerInitials: 'BO',
    product: 'Corporate Dessert Package',
    amount: 150000,
    status: 'completed',
    priority: 'medium',
    aiRecommendation: 'Order completed — delivery confirmed',
    date: '2025-07-22',
    items: [
      { name: 'Corporate Dessert Package — 80 servings', qty: 1, price: 150000 },
    ],
    customerInfo: { name: 'Brian Otieno', email: 'brian@otieno.com', phone: '+234 808 901 2345' },
    shippingAddress: '10 Ligali Ayorinde Street, Victoria Island, Lagos',
    paymentStatus: 'paid',
    internalNotes: [],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-22 14:00', completed: true, agent: 'Brian Otieno', agentInitials: 'BO' },
      { status: 'Sales Agent created quotation', date: '2025-07-22 14:05', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-22 15:00', completed: true, agent: 'Brian Otieno', agentInitials: 'BO' },
      { status: 'Finance Agent verified payment', date: '2025-07-22 15:10', completed: true, agent: 'Finance Agent', agentInitials: 'FA' },
      { status: 'Customer Success confirmed delivery', date: '2025-07-22 16:05', completed: true, agent: 'Customer Success', agentInitials: 'CS' },
    ],
  },
  {
    id: 'ORD-1044',
    customer: 'Naledi Dlamini',
    customerInitials: 'ND',
    product: 'Custom Celebration Cake',
    amount: 145000,
    status: 'completed',
    priority: 'high',
    aiRecommendation: 'Order completed successfully — customer delighted',
    date: '2025-07-21',
    items: [
      { name: 'Custom Celebration Cake — 2-Tier', qty: 1, price: 145000 },
    ],
    customerInfo: { name: 'Naledi Dlamini', email: 'naledi@dlamini.com', phone: '+234 810 123 4567' },
    shippingAddress: '16 Admiralty Way, Lekki, Lagos',
    paymentStatus: 'paid',
    internalNotes: [
      { text: 'Customer very satisfied. Sent thank-you note.', author: 'Customer Success Agent', time: '2h ago' },
    ],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-15', completed: true, agent: 'Naledi Dlamini', agentInitials: 'ND' },
      { status: 'Sales Agent created quotation', date: '2025-07-15', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-15', completed: true, agent: 'Naledi Dlamini', agentInitials: 'ND' },
      { status: 'Finance Agent verified payment', date: '2025-07-15', completed: true, agent: 'Finance Agent', agentInitials: 'FA' },
      { status: 'Customer Success confirmed delivery', date: '2025-07-16', completed: true, agent: 'Customer Success', agentInitials: 'CS' },
    ],
  },
  {
    id: 'ORD-1043',
    customer: 'Kwame Mensah',
    customerInitials: 'KM',
    product: 'Birthday Cake Package',
    amount: 85000,
    status: 'completed',
    priority: 'medium',
    aiRecommendation: 'Order delivered — follow up for feedback',
    date: '2025-07-20',
    items: [
      { name: 'Birthday Cake Package', qty: 1, price: 85000 },
    ],
    customerInfo: { name: 'Kwame Mensah', email: 'kwame@mensah.com', phone: '+234 806 789 0123' },
    shippingAddress: '7 Raymond Njoku Street, Ikoyi, Lagos',
    paymentStatus: 'paid',
    internalNotes: [],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-10', completed: true, agent: 'Kwame Mensah', agentInitials: 'KM' },
      { status: 'Sales Agent created quotation', date: '2025-07-10', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-10', completed: true, agent: 'Kwame Mensah', agentInitials: 'KM' },
      { status: 'Finance Agent verified payment', date: '2025-07-10', completed: true, agent: 'Finance Agent', agentInitials: 'FA' },
      { status: 'Customer Success confirmed delivery', date: '2025-07-11', completed: true, agent: 'Customer Success', agentInitials: 'CS' },
    ],
  },
  {
    id: 'ORD-1042',
    customer: 'Thabo Mokoena',
    customerInitials: 'TM',
    product: 'Wedding Cake Package',
    amount: 450000,
    status: 'issue',
    priority: 'high',
    aiRecommendation: 'Payment failed — bank declined transaction',
    date: '2025-07-24',
    items: [
      { name: 'Wedding Cake — 5-Tier Premium', qty: 1, price: 450000 },
    ],
    customerInfo: { name: 'Thabo Mokoena', email: 'thabo@mokoena.com', phone: '+234 809 012 3456' },
    shippingAddress: '5 Ademola Street, Ikoyi, Lagos',
    paymentStatus: 'failed',
    internalNotes: [
      { text: 'Bank declined transaction. Customer notified.', author: 'Finance Agent', time: '15m ago' },
      { text: 'Attempted retry — insufficient funds.', author: 'Finance Agent', time: '5m ago' },
    ],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 08:00', completed: true, agent: 'Thabo Mokoena', agentInitials: 'TM' },
      { status: 'Sales Agent created quotation', date: '2025-07-24 08:05', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer approved quotation', date: '2025-07-24 09:00', completed: true, agent: 'Thabo Mokoena', agentInitials: 'TM' },
      { status: 'Payment failed — bank declined', date: '2025-07-24 09:15', completed: false, agent: 'Finance Agent', agentInitials: 'FA' },
    ],
  },
  {
    id: 'ORD-1041',
    customer: 'Tolu Adebayo',
    customerInitials: 'TA',
    product: 'Monthly Dessert Subscription',
    amount: 25000,
    status: 'issue',
    priority: 'low',
    aiRecommendation: 'Customer requested cancellation — retention offer sent',
    date: '2025-07-23',
    items: [
      { name: 'Monthly Dessert Subscription', qty: 1, price: 25000 },
    ],
    customerInfo: { name: 'Tolu Adebayo', email: 'tolu@adebayo.com', phone: '+234 804 567 8901' },
    shippingAddress: '22 Adeniyi Jones Avenue, Ikeja, Lagos',
    paymentStatus: 'failed',
    internalNotes: [
      { text: 'Customer requested cancellation due to moving.', author: 'Tolu Adebayo', time: '1d ago' },
      { text: 'Offered 20% discount on next order — awaiting response.', author: 'Sales Agent', time: '12h ago' },
    ],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-18', completed: true, agent: 'Tolu Adebayo', agentInitials: 'TA' },
      { status: 'Sales Agent created quotation', date: '2025-07-18', completed: true, agent: 'Sales Agent', agentInitials: 'SA' },
      { status: 'Customer cancelled — discount offered', date: '2025-07-19', completed: false, agent: 'Sales Agent', agentInitials: 'SA' },
    ],
  },
  {
    id: 'ORD-1040',
    customer: 'Kofi Asante',
    customerInitials: 'KA',
    product: 'Premium Pastry Box',
    amount: 35000,
    status: 'new',
    priority: 'low',
    aiRecommendation: 'New inquiry — draft quotation',
    date: '2025-07-24',
    items: [
      { name: 'Premium Pastry Box — Assorted', qty: 1, price: 35000 },
    ],
    customerInfo: { name: 'Kofi Asante', email: 'kofi@asante.com', phone: '+234 805 678 9012' },
    shippingAddress: '15 Toyin Street, Ikeja, Lagos',
    paymentStatus: 'pending',
    internalNotes: [],
    timeline: [
      { status: 'Customer Inquiry', date: '2025-07-24 12:00', completed: true, agent: 'Kofi Asante', agentInitials: 'KA' },
    ],
  },
];

// --- AI Order Assistant ---
export interface AIAssistantData {
  currentTask: string;
  recommendedActions: { label: string; description: string }[];
  confidence: number;
  estimatedCompletion: string;
}

export const AI_ORDER_ASSISTANT: AIAssistantData = {
  currentTask: 'Reviewing payment for Grace Eze\'s order...',
  recommendedActions: [
    { label: 'Verify payment', description: 'Confirm the bank transfer for N185,000' },
    { label: 'Send confirmation', description: 'Notify Grace Eze that her order is confirmed' },
    { label: 'Schedule delivery', description: 'Arrange Saturday delivery for the celebration' },
  ],
  confidence: 98,
  estimatedCompletion: '12 seconds',
};

// --- Today's AI Activity ---
export interface AIDailyActivity {
  id: string;
  agentName: string;
  agentIcon: string;
  agentColor: string;
  action: string;
  target: string;
  timeAgo: string;
}

export const TODAY_AI_ACTIVITIES: AIDailyActivity[] = [
  { id: 'TA1', agentName: 'Sales Agent', agentIcon: 'TrendingUp', agentColor: '#4F46E5', action: 'completed', target: 'quotation for Grace Eze', timeAgo: '2m ago' },
  { id: 'TA2', agentName: 'Finance Agent', agentIcon: 'DollarSign', agentColor: '#22C55E', action: 'reviewing', target: 'payment from Grace Eze', timeAgo: '5m ago' },
  { id: 'TA3', agentName: 'Customer Success', agentIcon: 'Handshake', agentColor: '#8B5CF6', action: 'preparing', target: 'confirmation for Grace Eze', timeAgo: '11m ago' },
  { id: 'TA4', agentName: 'Sales Agent', agentIcon: 'TrendingUp', agentColor: '#4F46E5', action: 'recommended', target: 'Corporate Dessert Package to Amaka Bello', timeAgo: '18m ago' },
  { id: 'TA5', agentName: 'Finance Agent', agentIcon: 'DollarSign', agentColor: '#22C55E', action: 'generated', target: 'invoice for Adaobi Nwosu', timeAgo: '23m ago' },
  { id: 'TA6', agentName: 'Customer Success', agentIcon: 'Handshake', agentColor: '#8B5CF6', action: 'sent', target: 'delivery update to Brian Otieno', timeAgo: '28m ago' },
  { id: 'TA7', agentName: 'Sales Agent', agentIcon: 'TrendingUp', agentColor: '#4F46E5', action: 'qualified', target: 'Zainab Ibrahim for wedding consultation', timeAgo: '43m ago' },
  { id: 'TA8', agentName: 'Finance Agent', agentIcon: 'DollarSign', agentColor: '#22C55E', action: 'flagged', target: 'payment issue with Thabo Mokoena', timeAgo: '55m ago' },
];

// --- Smart Insights ---
export interface AIInsight {
  id: string;
  type: 'revenue' | 'warning' | 'opportunity';
  message: string;
  actionLabel: string;
  actionIcon: string;
}

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'I1',
    type: 'revenue',
    message: 'Revenue increased 18% this month. Grace Eze\'s Custom Celebration Cake (N185,000) is pending payment verification.',
    actionLabel: 'View Report',
    actionIcon: 'BarChart3',
  },
  {
    id: 'I2',
    type: 'warning',
    message: 'Three orders have not been paid within 48 hours. Send reminders to Grace Eze, Adaobi Nwosu, and Thabo Mokoena.',
    actionLabel: 'Send Reminders',
    actionIcon: 'Bell',
  },
  {
    id: 'I3',
    type: 'opportunity',
    message: 'Grace Eze has ordered three times this month. Recommend offering a loyalty discount on her next order.',
    actionLabel: 'Create Offer',
    actionIcon: 'Gift',
  },
];