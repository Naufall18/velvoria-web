import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tambahkan hairline emas signature di tepi atas. */
  gold?: boolean;
  /** Aktifkan lift + shadow saat hover (untuk kartu yang bisa diklik). */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gold, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('vv-card', gold && 'vv-card-gold', interactive && 'vv-hover cursor-pointer', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props} />
);
