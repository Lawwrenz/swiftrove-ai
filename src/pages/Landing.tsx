// ============================================================================
// Swiftrove AI — Public Landing Page
// ============================================================================
// A premium SaaS landing page designed for investors, judges, and potential
// customers. Supports light/dark mode via the existing ThemeContext system.
// ============================================================================

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Bot, Workflow, Network, BarChart3, TrendingUp, DollarSign,
  Heart, CheckCircle, ArrowRight, Menu, X, ChevronDown, Play, Star,
  Users, Mail,
  ChevronRight, ChevronLeft, Brain, Radio,
  MessageSquare,
} from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';
import ThemeToggle from '../components/ThemeToggle';
import SwiftWorkforceIllustration from '../components/SwiftWorkforceIllustration';

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI Workforce', href: '#ai-workforce' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const FEATURES = [
  {
    icon: Workflow,
    title: 'AI Workflow Engine',
    desc: 'Design and execute multi-step business workflows that route tasks between AI agents automatically.',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Brain,
    title: 'AI Customer Intelligence',
    desc: 'Deep customer insights powered by behavioural analysis, predictive scoring, and natural language understanding.',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    icon: DollarSign,
    title: 'Finance Agent',
    desc: 'Automated invoicing, payment verification, expense tracking, and fraud detection — all AI-driven.',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Heart,
    title: 'Customer Success Agent',
    desc: '24/7 intelligent support that resolves tickets, sends updates, and nurtures customer relationships.',
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    icon: Radio,
    title: 'Automation Studio',
    desc: 'Visual drag-and-drop builder for creating complex automations without writing a single line of code.',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    icon: Network,
    title: 'Business Knowledge Graph',
    desc: 'AI-powered relationship mapping that connects customers, orders, payments, and interactions in real-time.',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Live dashboards with AI-generated insights, trend detection, and automated executive reporting.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'Swift Executive Assistant',
    desc: 'Your AI co-pilot that answers questions, generates reports, and orchestrates your entire workforce on demand.',
    gradient: 'from-purple-500 to-purple-600',
  },
];

const AGENTS = [
  {
    icon: TrendingUp,
    name: 'Sales Agent',
    role: 'Lead generation & conversion',
    desc: 'Qualifies leads, generates quotations, recommends products, and converts conversations into orders — all autonomously.',
    gradient: 'from-indigo-500 to-indigo-600',
    stat: '92%',
    statLabel: 'Conversion Rate',
  },
  {
    icon: DollarSign,
    name: 'Finance Agent',
    role: 'Payment & financial management',
    desc: 'Verifies payments, manages invoices, detects anomalies, generates financial reports, and ensures compliance.',
    gradient: 'from-emerald-500 to-emerald-600',
    stat: '99.5%',
    statLabel: 'Accuracy Rate',
  },
  {
    icon: Heart,
    name: 'Customer Success Agent',
    role: 'Support & retention',
    desc: 'Resolves tickets, sends order updates, collects feedback, and nurtures relationships — available 24/7.',
    gradient: 'from-violet-500 to-violet-600',
    stat: '97%',
    statLabel: 'Satisfaction Score',
  },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    desc: 'Perfect for small businesses getting started with AI automation.',
    features: ['1 AI Agent', '500 tasks/month', 'Basic analytics', 'Email support', '1 workflow'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    desc: 'For growing teams that need full AI workforce orchestration.',
    features: ['3 AI Agents', '5,000 tasks/month', 'Advanced analytics', 'Priority support', 'Unlimited workflows', 'Custom integrations', 'Knowledge Graph'],
    cta: 'Start Free',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    desc: 'For organisations requiring custom AI solutions and dedicated support.',
    features: ['Unlimited AI Agents', 'Unlimited tasks', 'Real-time analytics', 'Dedicated account manager', 'Custom AI training', 'SSO & SAML', 'SLA guarantee', 'On-premise option'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQ_DATA = [
  {
    q: 'What is Swiftrove AI?',
    a: 'Swiftrove AI is an intelligent operations platform that orchestrates a workforce of AI agents to automate your business processes — from sales and finance to customer success and workflow management.',
  },
  {
    q: 'How does Swift work?',
    a: 'Swift is your AI executive assistant. It understands natural language, coordinates your AI agents, generates reports, answers questions about your business, and proactively suggests improvements — all in real-time.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. Swiftrove AI uses enterprise-grade encryption (AES-256 at rest, TLS 1.3 in transit), SOC 2 compliant infrastructure, and strict access controls. Your data never leaves your secure environment.',
  },
  {
    q: 'Can I use my own integrations?',
    a: 'Yes. Swiftrove AI integrates with Stripe, Slack, Gmail, QuickBooks, Shopify, and more. Our API-first architecture means you can connect any custom tool or service.',
  },
  {
    q: 'Can my team collaborate?',
    a: 'Absolutely. Swiftrove AI supports multi-role access, shared workspaces, team conversations with AI agents, and granular permission controls. Your entire team can work alongside the AI workforce.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO, Mitchell & Co.',
    content: 'Swiftrove AI transformed our operations. The Sales Agent alone saved us 20 hours a week. Our team now focuses on strategy while the AI handles execution.',
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'James Adewale',
    role: 'COO, TechBridge Solutions',
    content: 'The Finance Agent caught a payment anomaly that would have cost us $12,000. The ROI in the first month alone was incredible. This is the future of business operations.',
    rating: 5,
    initials: 'JA',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, Bloom & Co.',
    content: 'We went from 4 separate tools to one unified platform. The Customer Success Agent handles 80% of support tickets autonomously. Our customers love the instant responses.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'David Okonkwo',
    role: 'CTO, GrowthLabs',
    content: 'The Knowledge Graph alone is worth the subscription. Seeing how every customer, order, and interaction connects has given us insights we never knew existed.',
    rating: 5,
    initials: 'DO',
  },
];

const COMPARISON_ROWS = [
  { label: 'AI-Powered Automation', traditional: 'Manual or limited', swiftrove: 'Full AI orchestration' },
  { label: 'AI Decision Making', traditional: 'Rule-based only', swiftrove: 'Predictive & adaptive AI' },
  { label: 'Workflow Intelligence', traditional: 'Static pipelines', swiftrove: 'Dynamic, self-optimising' },
  { label: 'Customer Insights', traditional: 'Basic reports', swiftrove: 'Deep behavioural AI' },
  { label: 'Unified Operations', traditional: 'Multiple disconnected tools', swiftrove: 'Single intelligent platform' },
];

const SHOWCASE_ITEMS = [
  { label: 'Dashboard', icon: BarChart3, color: '#4F46E5' },
  { label: 'Customers', icon: Users, color: '#22C55E' },
  { label: 'Workflow Engine', icon: Workflow, color: '#8B5CF6' },
  { label: 'Automation Studio', icon: Radio, color: '#F59E0B' },
  { label: 'Analytics', icon: TrendingUp, color: '#EC4899' },
];

// ============================================================================
// Reusable Components
// ============================================================================

function SectionHeading({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
      {label && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-4">
          <Sparkles size={12} />
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function RevealOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedStat({ value, suffix = '', prefix = '', label, className = '' }: { value: number; suffix?: string; prefix?: string; label: string; className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const duration = 1500;
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(value);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
        {prefix}{count}{suffix}
      </p>
      <p className="mt-1.5 text-sm text-text-secondary font-medium">{label}</p>
    </div>
  );
}

// ============================================================================
// Main Landing Page Component
// ============================================================================

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sticky nav scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSignIn = () => navigate('/login');
  const handleGetStarted = () => navigate('/signup');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Skip to content (accessibility) */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-card focus:text-primary focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary">
        Skip to content
      </a>

      {/* ====================================================================
          STICKY NAVIGATION
      ==================================================================== */}
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-card/80 backdrop-blur-xl shadow-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <img
                src="/nativelyai.svg"
                alt="Swiftrove AI"
                className="w-9 h-9 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300 shrink-0"
              />
              <span className="font-bold text-lg text-foreground tracking-tight">
                Swiftrove <span className="text-primary">AI</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-foreground rounded-lg hover:bg-surface-hover transition-all duration-150 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleSignIn}
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground rounded-lg hover:bg-surface-hover transition-all duration-150 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:brightness-110 active:scale-[0.97] transition-all duration-150 shadow-lg shadow-primary/25 cursor-pointer"
              >
                Get Started
                <ArrowRight size={14} />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          role="menu"
        >
          <div className="px-4 pb-4 pt-2 space-y-1 bg-card border-t border-border">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors duration-150 cursor-pointer"
                role="menuitem"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-border my-2" />
            <button
              onClick={handleSignIn}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors duration-150 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:brightness-110 transition-all duration-150 cursor-pointer"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          HERO SECTION
      ==================================================================== */}
      <section id="main-content" className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] animate-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero text */}
            <div className="text-center lg:text-left">
              {/* Tablet & Mobile animated illustration — hidden on desktop */}
              <div className="block lg:hidden mb-6 sm:mb-8">
                <SwiftWorkforceIllustration />
              </div>
              <RevealOnScroll>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-6">
                  <Sparkles size={12} />
                  AI-Powered Operations
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight leading-[1.08]">
                  Meet{' '}
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                    Swift
                  </span>
                  .
                  <br />
                  <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                    Your AI Workforce for{' '}
                    <span className="text-primary">Smarter Business</span> Operations.
                  </span>
                </h1>
                <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Swiftrove AI orchestrates intelligent AI agents across sales, finance, customer success and business workflows — so you can focus on growing your business.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-primary rounded-xl hover:brightness-110 active:scale-[0.97] transition-all duration-150 shadow-xl shadow-primary/30 hover:shadow-primary/40 cursor-pointer group"
                  >
                    <img
                      src="/nativelyai.svg"
                      alt=""
                      className="w-5 h-5 shrink-0 rounded-md"
                      aria-hidden="true"
                    />
                    Start for Free
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollTo('#how-it-works')}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-medium text-foreground bg-card border border-border rounded-xl hover:bg-surface-hover active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  >
                    <Play size={16} className="text-primary" />
                    Watch Demo
                  </button>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right: Product mockup */}
            <RevealOnScroll className="hidden lg:block">
              <div className="relative">
                {/* Glow behind mockup */}
                <div className="absolute -inset-8 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent rounded-3xl blur-3xl" />
                <div className="relative bg-card rounded-2xl shadow-2xl ring-1 ring-border overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-surface border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="ml-3 flex-1 max-w-[200px] h-5 rounded-md bg-surface-hover flex items-center px-2">
                      <span className="text-[10px] text-text-secondary truncate">app.swiftrove.ai/dashboard</span>
                    </div>
                  </div>
                  {/* Mockup content */}
                  <div className="p-5 space-y-4">
                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Sparkles size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">AI Operations Center</p>
                          <p className="text-[10px] text-text-secondary">Good morning, welcome back</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                        <span className="text-[10px] font-medium text-emerald-600">3 Agents Online</span>
                      </div>
                    </div>
                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Tasks Today', value: '247', color: 'bg-indigo-500' },
                        { label: 'Orders', value: '18', color: 'bg-emerald-500' },
                        { label: 'Revenue', value: '₦8.2M', color: 'bg-amber-500' },
                        { label: 'AI Health', value: '96%', color: 'bg-violet-500' },
                      ].map((m) => (
                        <div key={m.label} className="p-2.5 rounded-lg bg-surface border border-border">
                          <p className="text-[10px] text-text-secondary">{m.label}</p>
                          <p className="text-sm font-bold text-foreground mt-0.5">{m.value}</p>
                          <div className="mt-1.5 h-1.5 rounded-full bg-surface-hover overflow-hidden">
                            <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.random() * 40 + 60}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Activity feed */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Live Activity</p>
                      {[
                        { agent: 'Sales Agent', action: 'Completed quotation', target: 'Grace Eze', color: '#4F46E5' },
                        { agent: 'Finance Agent', action: 'Verified payment', target: 'Order #1048', color: '#22C55E' },
                        { agent: 'Customer Success', action: 'Sent confirmation', target: 'Brian Otieno', color: '#8B5CF6' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-surface border border-border">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                            <Bot size={12} style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-foreground truncate">
                              {item.agent} <span className="text-text-secondary font-normal">{item.action}</span>
                            </p>
                            <p className="text-[10px] text-text-secondary truncate">{item.target}</p>
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ====================================================================
          TRUST / STATS SECTION
      ==================================================================== */}
      <section className="py-16 lg:py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <p className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wider mb-10">
              Built for modern businesses.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <AnimatedStat value={18} suffix="+" label="Tasks Automated Daily" />
              <AnimatedStat value={96} suffix="%" label="Business Health" />
              <AnimatedStat value={8} prefix="~" suffix="hrs" label="Weekly Time Saved" />
              <AnimatedStat value={3} label="AI Agents Working Together" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ====================================================================
          HOW IT WORKS
      ==================================================================== */}
      <section id="how-it-works" className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="How It Works"
              title="From Inquiry to Completion"
              subtitle="Watch how Swift orchestrates your AI agents through every step of the customer journey."
            />
          </RevealOnScroll>

          <RevealOnScroll className="mt-8">
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-500 to-emerald-500 hidden sm:block" />

              {[
                { icon: MessageSquare, label: 'Customer Inquiry', desc: 'A customer reaches out via WhatsApp, email, or web form.', color: '#4F46E5' },
                { icon: Bot, label: 'Swift', desc: 'Swift AI analyses the inquiry and routes it to the right agent.', color: '#8B5CF6' },
                { icon: TrendingUp, label: 'Sales Agent', desc: 'Generates a quotation, recommends products, and follows up.', color: '#4F46E5' },
                { icon: DollarSign, label: 'Finance Agent', desc: 'Verifies payment, creates invoices, and updates records.', color: '#22C55E' },
                { icon: Heart, label: 'Customer Success Agent', desc: 'Sends confirmations, tracks delivery, and collects feedback.', color: '#8B5CF6' },
                { icon: CheckCircle, label: 'Workflow Complete', desc: 'Order fulfilled. Customer delighted. AI learns for next time.', color: '#22C55E' },
              ].map((step, i) => (
                <div key={step.label} className={`flex items-start gap-5 pb-8 last:pb-0 relative ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Connector dot */}
                  <div className="hidden sm:flex absolute left-6 lg:left-1/2 lg:-translate-x-1/2 w-3 h-3 rounded-full bg-card ring-4 ring-background z-10" style={{ backgroundColor: step.color }} />

                  {/* Content */}
                  <div className={`flex-1 flex items-start gap-4 sm:pl-14 lg:pl-0 ${i % 2 === 0 ? 'lg:pr-[50%] lg:text-right lg:flex-row-reverse' : 'lg:pl-[50%]'}`}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                      <step.icon size={22} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">{step.label}</p>
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ====================================================================
          FEATURES SECTION
      ==================================================================== */}
      <section id="features" className="py-16 lg:py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="Features"
              title="Everything You Need to Scale"
              subtitle="A complete AI-powered operations platform that grows with your business."
            />
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => (
              <RevealOnScroll key={feature.title}>
                <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          AI WORKFORCE SECTION
      ==================================================================== */}
      <section id="ai-workforce" className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="AI Workforce"
              title="Meet Your AI Team"
              subtitle="Three specialised AI agents working in harmony to run your business operations."
            />
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {AGENTS.map((agent, i) => (
              <RevealOnScroll key={agent.name}>
                <div className="relative group p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  {/* Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${agent.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 pointer-events-none`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shadow-lg mb-5`}>
                    <agent.icon size={26} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{agent.name}</h3>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">{agent.role}</p>
                  <p className="text-sm text-text-secondary mt-3 leading-relaxed">{agent.desc}</p>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-foreground">{agent.stat}</p>
                      <p className="text-[11px] text-text-secondary">{agent.statLabel}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <span>Learn more</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          PRODUCT SHOWCASE
      ==================================================================== */}
      <section className="py-16 lg:py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="Product Showcase"
              title="See Swiftrove in Action"
              subtitle="Explore the key screens that make up the Swiftrove AI platform."
            />
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="relative max-w-4xl mx-auto">
              {/* Showcase carousel */}
              <div className="relative bg-card rounded-2xl shadow-xl ring-1 ring-border overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-surface border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="ml-3 flex-1 max-w-[240px] h-5 rounded-md bg-surface-hover flex items-center px-2">
                    <span className="text-[10px] text-text-secondary truncate">
                      app.swiftrove.ai/{SHOWCASE_ITEMS[activeShowcase].label.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                    <span className="text-[10px] text-emerald-600 font-medium">Live</span>
                  </div>
                </div>

                {/* Showcase content */}
                <div className="p-6 sm:p-8 lg:p-10 min-h-[320px] flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-500`} style={{ backgroundColor: `${SHOWCASE_ITEMS[activeShowcase].color}15` }}>
                      {(() => {
                        const Icon = SHOWCASE_ITEMS[activeShowcase].icon;
                        return <Icon size={36} style={{ color: SHOWCASE_ITEMS[activeShowcase].color }} />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{SHOWCASE_ITEMS[activeShowcase].label}</h3>
                    <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
                      {SHOWCASE_ITEMS[activeShowcase].label === 'Dashboard' && 'Real-time operations dashboard with AI-powered insights, live metrics, and workforce status.'}
                      {SHOWCASE_ITEMS[activeShowcase].label === 'Customers' && '360° customer intelligence with behavioural analysis, predictive scoring, and relationship mapping.'}
                      {SHOWCASE_ITEMS[activeShowcase].label === 'Workflow Engine' && 'Visual workflow builder that routes tasks between AI agents with intelligent decision-making.'}
                      {SHOWCASE_ITEMS[activeShowcase].label === 'Automation Studio' && 'Drag-and-drop automation studio for creating complex business processes without code.'}
                      {SHOWCASE_ITEMS[activeShowcase].label === 'Analytics' && 'Comprehensive analytics with AI-generated insights, trend detection, and executive reporting.'}
                    </p>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={() => setActiveShowcase((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length)}
                    className="ml-2 w-9 h-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                    aria-label="Previous showcase"
                  >
                    <ChevronLeft size={16} className="text-text-secondary" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setActiveShowcase((prev) => (prev + 1) % SHOWCASE_ITEMS.length)}
                    className="mr-2 w-9 h-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                    aria-label="Next showcase"
                  >
                    <ChevronRight size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-5">
                {SHOWCASE_ITEMS.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveShowcase(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeShowcase ? 'w-6 bg-primary' : 'bg-border hover:bg-text-secondary'
                    }`}
                    aria-label={`Show ${item.label}`}
                  />
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ====================================================================
          WHY SWIFTROVE (COMPARISON)
      ==================================================================== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="Why Swiftrove"
              title="Traditional Software vs. Swiftrove AI"
              subtitle="See how AI-powered operations outperform traditional business software."
            />
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 p-5 bg-surface border-b border-border">
                <div className="text-sm font-semibold text-text-secondary">Capability</div>
                <div className="text-sm font-semibold text-text-secondary text-center">Traditional</div>
                <div className="text-sm font-semibold text-primary text-center">Swiftrove AI</div>
              </div>
              {/* Rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 gap-4 p-5 items-center ${
                    i < COMPARISON_ROWS.length - 1 ? 'border-b border-border' : ''
                  } hover:bg-surface/50 transition-colors duration-150`}
                >
                  <div className="text-sm font-medium text-foreground">{row.label}</div>
                  <div className="text-sm text-text-secondary text-center flex items-center justify-center gap-1.5">
                    <X size={14} className="text-red-400 shrink-0" />
                    <span>{row.traditional}</span>
                  </div>
                  <div className="text-sm font-medium text-primary text-center flex items-center justify-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    <span>{row.swiftrove}</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ====================================================================
          TESTIMONIALS
      ==================================================================== */}
      <section className="py-16 lg:py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="Testimonials"
              title="Trusted by Business Leaders"
              subtitle="Hear from the founders and executives who transformed their operations with Swiftrove AI."
            />
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <RevealOnScroll key={t.name}>
                <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{t.content}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-text-secondary">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          PRICING
      ==================================================================== */}
      <section id="pricing" className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="Pricing"
              title="Simple, Transparent Pricing"
              subtitle="Start free and scale as your business grows. No hidden fees, no surprises."
            />
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <RevealOnScroll key={plan.name}>
                <div className={`relative p-8 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                  plan.popular
                    ? 'bg-card border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20'
                    : 'bg-card border-border hover:shadow-lg'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-text-secondary mt-1">{plan.desc}</p>
                    <div className="mt-5 flex items-baseline justify-center gap-0.5">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-text-secondary">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={plan.name === 'Enterprise' ? () => scrollTo('#contact') : handleGetStarted}
                    className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                      plan.popular
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:brightness-110'
                        : 'bg-card text-foreground border border-border hover:bg-surface-hover'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ
      ==================================================================== */}
      <section id="faq" className="py-16 lg:py-24 bg-surface/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <SectionHeading
              label="FAQ"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about Swiftrove AI."
            />
          </RevealOnScroll>

          <div className="space-y-3">
            {FAQ_DATA.map((item, i) => (
              <RevealOnScroll key={i}>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors duration-150 cursor-pointer"
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-text-secondary transition-transform duration-200 shrink-0 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          FINAL CTA
      ==================================================================== */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Ready to put AI to work for your business?
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
              Join thousands of businesses that have transformed their operations with Swiftrove AI. Start free, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-primary rounded-xl hover:brightness-110 active:scale-[0.97] transition-all duration-150 shadow-xl shadow-primary/30 cursor-pointer group"
              >
                <Sparkles size={18} />
                Start Free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-medium text-foreground bg-card border border-border rounded-xl hover:bg-surface-hover active:scale-[0.97] transition-all duration-150 cursor-pointer"
              >
                <Play size={16} className="text-primary" />
                Book a Demo
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
      ==================================================================== */}
      <footer id="contact" className="border-t border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-2">
              <a href="#" className="flex items-center gap-2.5 group">
                <img
                  src="/nativelyai.svg"
                  alt="Swiftrove AI"
                  className="w-9 h-9 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0"
                />
                <span className="font-bold text-lg text-foreground tracking-tight">
                  Swiftrove <span className="text-primary">AI</span>
                </span>
              </a>
              <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-sm">
                The intelligent operations platform that orchestrates AI agents across your entire business — sales, finance, customer success, and beyond.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a href="#" className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-150 cursor-pointer" aria-label="Twitter">
                  <FaXTwitter size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-150 cursor-pointer" aria-label="LinkedIn">
                  <FaLinkedin size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-150 cursor-pointer" aria-label="GitHub">
                  <FaGithub size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-150 cursor-pointer" aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                {['Features', 'Pricing', 'Documentation', 'API Reference', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">
              © 2026 Swiftrove AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <a href="#" className="hover:text-foreground transition-colors duration-150">Privacy</a>
              <span className="text-border">·</span>
              <a href="#" className="hover:text-foreground transition-colors duration-150">Terms</a>
              <span className="text-border">·</span>
              <a href="#" className="hover:text-foreground transition-colors duration-150">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}