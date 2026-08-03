interface WorkflowLineProps {
  completed: number;
  total: number;
  className?: string;
  height?: number;
  color?: string;
  trackColor?: string;
}

export default function WorkflowLine({
  completed,
  total,
  className = '',
  height = 2,
  color = '#22C55E',
  trackColor = '#E2E8F0',
}: WorkflowLineProps) {
  const progress = total > 0 ? (completed / (total - 1)) * 100 : 0;

  return (
    <svg className={`w-full ${className}`} style={{ height }} aria-hidden="true">
      <defs>
        <linearGradient id={`flowGrad-${completed}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} />
          <stop offset={`${progress}%`} stopColor={color} />
          <stop offset={`${Math.min(progress + 1, 100)}%`} stopColor={trackColor} />
          <stop offset="100%" stopColor={trackColor} />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1={height / 2}
        x2="100%"
        y2={height / 2}
        stroke={`url(#flowGrad-${completed})`}
        strokeWidth={height}
        strokeLinecap="round"
      />
      {/* Animated dot on the progress line */}
      {completed < total - 1 && (
        <circle
          cx={`${progress}%`}
          cy={height / 2}
          r={height * 1.5}
          fill={color}
          className="animate-pulse-dot"
          style={{ animationDuration: '1.5s' }}
        />
      )}
    </svg>
  );
}