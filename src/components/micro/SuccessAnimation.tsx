import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  size?: number;
  className?: string;
  onComplete?: () => void;
}

export default function SuccessAnimation({
  size = 56,
  className = '',
  onComplete,
}: SuccessAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    if (onComplete) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  if (!show) return null;

  const sparklePositions = [
    { top: '-4px', right: '-4px', delay: '0.1s' },
    { top: '-4px', left: '-4px', delay: '0.2s' },
    { bottom: '-4px', right: '-4px', delay: '0.15s' },
    { bottom: '-4px', left: '-4px', delay: '0.25s' },
  ];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-emerald-400"
          style={{
            ...pos,
            animation: `success-sparkle 0.8s ${pos.delay} ease-out forwards`,
            opacity: 0,
          }}
        />
      ))}

      {/* Circle */}
      <div
        className="animate-success-circle absolute inset-0 rounded-full bg-emerald-100 flex items-center justify-center"
        style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' }}
      >
        {/* Checkmark */}
        <svg
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 24 24"
          fill="none"
          className="absolute"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-success-check"
            style={{ strokeDashoffset: 30 }}
          />
        </svg>
      </div>
    </div>
  );
}