import { type ReactNode, useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: (DropdownItem | 'divider')[];
  align?: 'left' | 'right';
}

export default function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={`
            absolute z-40 mt-1 w-48 bg-card rounded-lg shadow-lg ring-1 ring-border
            py-1 animate-scale-in origin-top
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, i) => {
            if (item === 'divider') {
              return <div key={`divider-${i}`} className="my-1 border-t border-border" />;
            }
            const { label, icon, onClick, danger, disabled } = item;
            return (
              <button
                key={label}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    onClick();
                    setOpen(false);
                  }
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150
                  ${disabled
                    ? 'text-muted cursor-not-allowed'
                    : danger
                      ? 'text-danger hover:bg-danger/5 cursor-pointer'
                      : 'text-text-secondary hover:bg-surface hover:text-foreground cursor-pointer'
                  }
                `}
              >
                {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}