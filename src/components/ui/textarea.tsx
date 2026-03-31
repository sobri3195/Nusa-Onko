import { cn } from '@/lib/utils';
export const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cn('min-h-24 w-full rounded-md border border-border bg-card p-3 text-sm', className)} {...props} />;
