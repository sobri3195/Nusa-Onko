import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SeverityLevel } from '@/types/radiotherapy';
import { cn } from '@/lib/utils';

export const severityClass: Record<SeverityLevel, string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700'
};

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return <Badge className={cn('font-medium', severityClass[severity])}>{severity}</Badge>;
}

export function StatCard({ title, value, detail }: { title: string; value: string | number; detail: string }) {
  return (
    <Card className="space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </Card>
  );
}
