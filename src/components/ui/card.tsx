import { cn } from '@/lib/utils';
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-xl border border-border/80 bg-card/95 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
      className
    )}
    {...props}
  />
);
