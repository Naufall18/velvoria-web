import React from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'gold' | 'success' | 'danger' | 'warning' | 'info' | 'dark';

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-alt text-muted',
  gold:    'bg-rose-soft text-rose-600',
  success: 'bg-success-soft text-success',
  danger:  'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  info:    'bg-info-soft text-info',
  dark:    'bg-primary text-white',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge = ({ className, tone = 'neutral', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
      tones[tone],
      className,
    )}
    {...props}
  />
);
