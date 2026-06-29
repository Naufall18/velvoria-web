import React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-700 shadow-lg shadow-primary/15',
  secondary: 'bg-surface-alt text-ink hover:bg-line',
  outline:   'border border-line-strong bg-transparent text-ink hover:border-primary hover:bg-surface-alt',
  ghost:     'bg-transparent text-ink hover:bg-surface-alt',
  gold:      'bg-rose text-ink hover:bg-rose-600 shadow-lg shadow-rose/25',
  danger:    'bg-danger text-white hover:opacity-90',
};

const sizes: Record<Size, string> = {
  sm:   'h-9 px-4 text-sm',
  md:   'h-11 px-6 text-sm',
  lg:   'h-13 px-8 text-base',
  icon: 'h-11 w-11',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide',
          'transition-all duration-200 active:scale-[0.98]',
          'focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
