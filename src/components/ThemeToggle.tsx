import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
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

  const options: { value: typeof theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentIcon = options.find((o) => o.value === theme)?.icon || (resolvedTheme === 'dark' ? Moon : Sun);
  const CurrentIcon = currentIcon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-foreground transition-all duration-150 cursor-pointer"
        aria-label="Toggle theme"
        aria-expanded={open}
      >
        <CurrentIcon size={18} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-36 bg-card rounded-xl shadow-lg ring-1 ring-border py-1.5 animate-scale-in z-50"
          role="menu"
          aria-label="Theme selection"
        >
          {options.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                role="menuitem"
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150 cursor-pointer
                  ${theme === option.value
                    ? 'text-primary bg-secondary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'
                  }`}
                aria-current={theme === option.value ? 'true' : undefined}
              >
                <OptionIcon size={16} className="shrink-0" />
                <span>{option.label}</span>
                {theme === option.value && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}