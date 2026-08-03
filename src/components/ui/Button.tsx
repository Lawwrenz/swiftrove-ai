import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useRef, useState, type MouseEvent } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
  ripple?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:brightness-110 active:brightness-95 shadow-sm',
  secondary: 'bg-card text-primary border border-border hover:bg-surface active:bg-surface-hover',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-hover active:bg-surface',
  danger: 'bg-danger text-white hover:brightness-110 active:brightness-95 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, children, className = '', disabled, ripple = true, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const idRef = useRef(0);
    const resolvedRef = (ref || btnRef) as React.RefObject<HTMLButtonElement | null>;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled) {
        onClick?.(e);
        return;
      }

      const rect = (resolvedRef.current || btnRef.current)?.getBoundingClientRect();
      if (rect) {
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const id = idRef.current++;
        setRipples((prev) => [...prev, { id, x, y, size }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      onClick?.(e);
    };

    return (
      <button
        ref={resolvedRef}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center font-medium rounded-lg
          transition-all duration-150 ease-out cursor-pointer
          active:scale-[0.97]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          relative overflow-hidden
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}

        {/* Ripple effect layer */}
        {ripple && !disabled && (
          <span className="ripple-container" aria-hidden="true">
            {ripples.map((r) => (
              <span
                key={r.id}
                className="ripple-effect"
                style={{
                  left: r.x,
                  top: r.y,
                  width: r.size,
                  height: r.size,
                }}
              />
            ))}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;