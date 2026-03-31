import { cn } from '@/lib/utils';
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('rounded-xl border border-border bg-card p-4 shadow-sm', className)} {...props} />;
