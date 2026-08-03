interface ThinkingDotsProps {
  className?: string;
  dotCount?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThinkingDots({
  className = '',
  dotCount = 3,
  color = 'bg-indigo-400',
  size = 'sm',
}: ThinkingDotsProps) {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: dotCount }).map((_, i) => (
        <span
          key={i}
          className={`${dotSizes[size]} rounded-full ${color} animate-thinking-dot`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}