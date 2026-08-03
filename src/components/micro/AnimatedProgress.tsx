import { useEffect, useState, useRef, useCallback } from 'react';

interface AnimatedProgressProps {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export default function AnimatedProgress({
  value,
  color = '#4F46E5',
  height = 8,
  showLabel = false,
  label,
  className = '',
  animated = true,
}: AnimatedProgressProps) {
  const [width, setWidth] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setWidth(eased * value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    hasAnimated.current = false;
    if (animated) animate();
    else setWidth(value);
  }, [value, animated, animate]);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
          <span className="text-xs font-semibold" style={{ color }}>{Math.round(width)}%</span>
        </div>
      )}
      <div
        className="bg-slate-100 rounded-full overflow-hidden ring-1 ring-inset ring-slate-200/50"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: width > 0 ? `0 0 8px ${color}66` : 'none',
          }}
        />
      </div>
    </div>
  );
}