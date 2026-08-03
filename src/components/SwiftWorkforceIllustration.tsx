// ============================================================================
// SwiftWorkforceIllustration — Premium animated SVG for Tablet/Mobile Hero
// ============================================================================
// Visual story: Swift (center) coordinates Sales, Finance, Customer Success,
// Automation, and Business Workflows as orbiting nodes with connection lines.
// GPU-friendly CSS animations using transform and opacity only.
// ============================================================================

export default function SwiftWorkforceIllustration() {
  return (
    <div className="swift-illustration-wrapper" aria-hidden="true">
      <style>{`
        /* ── Float — gentle vertical bob on the whole illustration ── */
        @keyframes si-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        /* ── Center glow pulse ── */
        @keyframes si-pulse-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.18); }
        }
        /* ── Center icon pulse ── */
        @keyframes si-pulse-center {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        /* ── Node bob ── */
        @keyframes si-bob {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -4px); }
        }
        /* ── Connection dash animation ── */
        @keyframes si-dash {
          to { stroke-dashoffset: -20; }
        }

        .si-float      { animation: si-float 5s ease-in-out infinite; }
        .si-pulse-glow { animation: si-pulse-glow 3s ease-in-out infinite; transform-origin: 140px 140px; }
        .si-pulse-c    { animation: si-pulse-center 2.5s ease-in-out infinite; transform-origin: 140px 140px; }

        .si-node-1 { animation: si-bob 3.0s ease-in-out 0.0s infinite; }
        .si-node-2 { animation: si-bob 3.2s ease-in-out 0.4s infinite; }
        .si-node-3 { animation: si-bob 3.4s ease-in-out 0.8s infinite; }
        .si-node-4 { animation: si-bob 3.1s ease-in-out 1.2s infinite; }
        .si-node-5 { animation: si-bob 3.3s ease-in-out 1.6s infinite; }

        .si-dash { animation: si-dash 1.2s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .si-float, .si-pulse-glow, .si-pulse-c,
          .si-node-1, .si-node-2, .si-node-3, .si-node-4, .si-node-5,
          .si-dash { animation: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 280 280"
        className="w-full max-w-[260px] sm:max-w-[320px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Center glow gradient */}
          <radialGradient id="si-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
          {/* Center orb gradient */}
          <linearGradient id="si-orb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          {/* Node gradients */}
          <linearGradient id="si-sales" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="si-finance" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="si-success" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="si-auto" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="si-workflow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          {/* Node glow filter */}
          <filter id="si-node-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="si-center-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="si-float">
          {/* ── Background glow ring ── */}
          <circle cx="140" cy="140" r="80" className="si-pulse-glow" fill="url(#si-glow)" />

          {/* ── Orbit ring (decorative dashed circle) ── */}
          <circle
            cx="140" cy="140" r="88"
            stroke="#4F46E5" strokeWidth="0.5" strokeDasharray="3 6"
            opacity="0.2"
          />

          {/* ── Connection lines (center → each node) ── */}
          <g strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5">
            {/* Center → Sales (top) */}
            <line x1="140" y1="140" x2="140" y2="52" stroke="#4F46E5" className="si-dash" />
            {/* Center → Finance (top-right) */}
            <line x1="140" y1="140" x2="215" y2="80" stroke="#22C55E" className="si-dash" />
            {/* Center → Customer Success (bottom-right) */}
            <line x1="140" y1="140" x2="205" y2="200" stroke="#8B5CF6" className="si-dash" />
            {/* Center → Automation (bottom-left) */}
            <line x1="140" y1="140" x2="75" y2="200" stroke="#F59E0B" className="si-dash" />
            {/* Center → Workflows (top-left) */}
            <line x1="140" y1="140" x2="65" y2="80" stroke="#3B82F6" className="si-dash" />
          </g>

          {/* ── Node 1: Sales (top) ── */}
          <g className="si-node-1" filter="url(#si-node-glow)">
            <circle cx="140" cy="52" r="16" fill="url(#si-sales)" />
            <circle cx="140" cy="52" r="16" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* Trending up arrow */}
            <path d="M136 56 L140 48 L144 56 M140 48 V56" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* ── Node 2: Finance (top-right) ── */}
          <g className="si-node-2" filter="url(#si-node-glow)">
            <circle cx="215" cy="80" r="16" fill="url(#si-finance)" />
            <circle cx="215" cy="80" r="16" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* Dollar sign */}
            <path d="M213 76 h4 M215 74 v-2 a2 2 0 0 0 -2 2 a2 2 0 0 0 2 2 h0.5 a2 2 0 0 1 0 4 h-1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* ── Node 3: Customer Success (bottom-right) ── */}
          <g className="si-node-3" filter="url(#si-node-glow)">
            <circle cx="205" cy="200" r="16" fill="url(#si-success)" />
            <circle cx="205" cy="200" r="16" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* Heart */}
            <path d="M205 204 C203 202 200 200 198 202 C195 204 195 208 198 211 L205 218 L212 211 C215 208 215 204 212 202 C210 200 207 202 205 204 Z" stroke="white" strokeWidth="1.5" fill="white" opacity="0.9" />
          </g>

          {/* ── Node 4: Automation (bottom-left) ── */}
          <g className="si-node-4" filter="url(#si-node-glow)">
            <circle cx="75" cy="200" r="16" fill="url(#si-auto)" />
            <circle cx="75" cy="200" r="16" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* Lightning bolt */}
            <path d="M77 192 L70 200 L74 200 L72 208 L80 200 L76 200 Z" stroke="white" strokeWidth="1.5" fill="white" opacity="0.9" />
          </g>

          {/* ── Node 5: Workflows (top-left) ── */}
          <g className="si-node-5" filter="url(#si-node-glow)">
            <circle cx="65" cy="80" r="16" fill="url(#si-workflow)" />
            <circle cx="65" cy="80" r="16" stroke="white" strokeWidth="2" opacity="0.3" />
            {/* Network nodes */}
            <circle cx="62" cy="76" r="2.5" fill="white" />
            <circle cx="68" cy="76" r="2.5" fill="white" />
            <circle cx="65" cy="84" r="2.5" fill="white" />
            <line x1="62" y1="76" x2="68" y2="76" stroke="white" strokeWidth="1.5" />
            <line x1="62" y1="76" x2="65" y2="84" stroke="white" strokeWidth="1.5" />
            <line x1="68" y1="76" x2="65" y2="84" stroke="white" strokeWidth="1.5" />
          </g>

          {/* ── Center: Swift orb ── */}
          <g className="si-pulse-c" filter="url(#si-center-glow)">
            <circle cx="140" cy="140" r="26" fill="url(#si-orb)" />
            <circle cx="140" cy="140" r="26" stroke="white" strokeWidth="2.5" opacity="0.2" />
            {/* Inner ring */}
            <circle cx="140" cy="140" r="20" stroke="white" strokeWidth="1" opacity="0.15" />
            {/* Sparkle/star icon */}
            <path
              d="M140 126 L142.5 133.5 L150 136 L142.5 138.5 L140 146 L137.5 138.5 L130 136 L137.5 133.5 Z"
              fill="white"
              opacity="0.95"
            />
            {/* Small orbiting dots around center */}
            <circle cx="140" cy="116" r="2" fill="white" opacity="0.5" />
            <circle cx="164" cy="140" r="2" fill="white" opacity="0.5" />
            <circle cx="140" cy="164" r="2" fill="white" opacity="0.5" />
            <circle cx="116" cy="140" r="2" fill="white" opacity="0.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}