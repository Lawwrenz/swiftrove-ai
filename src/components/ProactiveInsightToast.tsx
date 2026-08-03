import { useState, useEffect, useCallback } from 'react';
import { X, Lightbulb, TrendingUp, Zap, Clock, AlertCircle, Star, Sparkles } from 'lucide-react';
import { useSwift } from '../context/SwiftContext';

export default function ProactiveInsightToast() {
  const { proactiveInsight, openSwift, dismissProactiveInsight } = useSwift();
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (proactiveInsight) {
      setVisible(true);
      setExiting(false);
      setDismissed(false);
    }
  }, [proactiveInsight]);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setDismissed(true);
    setTimeout(() => {
      dismissProactiveInsight();
      setVisible(false);
    }, 250);
  }, [dismissProactiveInsight]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!proactiveInsight || dismissed) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [proactiveInsight, dismissed, handleDismiss]);

  if (!proactiveInsight || !visible) return null;

  const InsightIcon = proactiveInsight.icon === 'TrendingUp' ? TrendingUp :
    proactiveInsight.icon === 'Zap' ? Zap :
    proactiveInsight.icon === 'Clock' ? Clock :
    proactiveInsight.icon === 'AlertCircle' ? AlertCircle :
    proactiveInsight.icon === 'Star' ? Star :
    proactiveInsight.icon === 'Sparkles' ? Sparkles : Lightbulb;

  return (
    <div className={`fixed bottom-24 right-6 z-40 max-w-sm ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
      <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/80 p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${proactiveInsight.color}15` }}
          >
            <InsightIcon size={16} style={{ color: proactiveInsight.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb size={11} className="text-amber-500" />
              <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Proactive Insight</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{proactiveInsight.message}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => { handleDismiss(); setTimeout(() => openSwift(), 300); }}
                className="text-xs font-medium text-primary hover:text-indigo-700 transition-colors cursor-pointer"
              >
                Ask Swift
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-0.5 rounded text-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Dismiss insight"
          >
            <X size={14} />
          </button>
        </div>
        {/* Progress bar for auto-dismiss */}
        {!dismissed && (
          <div className="mt-3 h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/40 rounded-full"
              style={{ animation: 'progress-fill 8s linear forwards' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}