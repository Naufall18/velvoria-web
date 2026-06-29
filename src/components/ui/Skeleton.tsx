import { cn } from '../../lib/cn';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('vv-skeleton', className)} />
);
