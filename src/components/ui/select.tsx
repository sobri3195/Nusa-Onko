import { cn } from '@/lib/utils';
export const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => <select className={cn('h-10 w-full rounded-md border border-border bg-card px-3 text-sm', className)} {...props} />;
