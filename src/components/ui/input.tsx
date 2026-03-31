import { cn } from '@/lib/utils';
export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input className={cn('h-10 w-full rounded-md border border-border bg-card px-3 text-sm', className)} {...props} />;
