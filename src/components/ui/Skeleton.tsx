interface SkeletonProps {
  variant?: 'text' | 'card' | 'table-row' | 'avatar' | 'stat' | 'chart' | 'hero';
  className?: string;
}

export default function Skeleton({ variant = 'text', className = '' }: SkeletonProps) {
  const base = 'animate-shimmer rounded-lg';

  switch (variant) {
    case 'card':
      return (
        <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6 ${className}`}>
          <div className={`${base} h-4 w-3/4 mb-4`} />
          <div className={`${base} h-3 w-1/2 mb-3`} />
          <div className={`${base} h-3 w-2/3 mb-3`} />
          <div className={`${base} h-3 w-1/3`} />
        </div>
      );
    case 'table-row':
      return (
        <div className={`flex items-center gap-4 py-3 ${className}`}>
          <div className={`${base} w-8 h-8 rounded-full shrink-0`} />
          <div className="flex-1 space-y-2">
            <div className={`${base} h-3 w-1/3`} />
            <div className={`${base} h-3 w-1/4`} />
          </div>
          <div className={`${base} h-3 w-16`} />
          <div className={`${base} h-3 w-20`} />
          <div className={`${base} h-6 w-16 rounded-full`} />
        </div>
      );
    case 'avatar':
      return <div className={`${base} rounded-full ${className || 'w-9 h-9'}`} />;
    case 'stat':
      return (
        <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-5 ${className}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`${base} w-10 h-10 rounded-xl`} />
            <div className={`${base} h-3 w-16`} />
          </div>
          <div className={`${base} h-8 w-24 mb-1`} />
          <div className={`${base} h-3 w-20`} />
        </div>
      );
    case 'chart':
      return (
        <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6 ${className}`}>
          <div className={`${base} h-4 w-32 mb-6`} />
          <div className="flex items-end justify-between gap-3 h-32">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`${base} flex-1`}
                style={{ height: `${20 + Math.random() * 80}%` }}
              />
            ))}
          </div>
        </div>
      );
    case 'hero':
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 p-8 ${className}`}>
          <div className={`${base} h-8 w-48 mb-3 bg-white/60`} />
          <div className={`${base} h-4 w-96 mb-6 bg-white/60`} />
          <div className="flex gap-3">
            <div className={`${base} h-10 w-32 bg-white/60`} />
            <div className={`${base} h-10 w-32 bg-white/60`} />
          </div>
        </div>
      );
    case 'text':
    default:
      return <div className={`${base} h-3 ${className || 'w-full'}`} />;
  }
}