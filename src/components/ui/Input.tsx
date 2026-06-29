import React from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-ink',
              'placeholder:text-muted-soft transition-colors',
              'focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20',
              icon && 'pl-11',
              error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-line-strong',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
