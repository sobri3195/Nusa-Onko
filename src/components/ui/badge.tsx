import { cn } from '@/lib/utils';
export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span className={cn('inline-flex rounded-full bg-muted px-2 py-0.5 text-xs', className)} {...props} />;
