import * as React from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'destructive' }) {
  return <button className={cn('inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50', variant === 'default' && 'bg-primary text-primary-foreground', variant === 'outline' && 'border border-border bg-card', variant === 'destructive' && 'bg-red-600 text-white', className)} {...props} />;
}
