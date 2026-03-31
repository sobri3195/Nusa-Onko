import { Bell, Blocks, Filter, Home, MoreHorizontal, Search, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mobileItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/modules', label: 'Modules', icon: Blocks },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/reports', label: 'Profile', icon: MoreHorizontal }
];

export function MobileBottomNav({ alertCount = 0 }: { alertCount?: number }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5">
        {mobileItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn('relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Alerts' && alertCount > 0 && <Badge className="absolute right-4 top-1 min-w-5 px-1 text-[10px]">{alertCount > 99 ? '99+' : alertCount}</Badge>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function MobileTopBar({ title, onSearch, onFilter, onAdd, backButton }: { title: string; onSearch?: () => void; onFilter?: () => void; onAdd?: () => void; backButton?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur md:hidden">
      <div className="flex min-h-14 items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          {backButton}
          <h1 className="text-sm font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          {onSearch && <Button variant="outline" className="h-8 w-8 p-0" onClick={onSearch}><Search className="h-4 w-4" /></Button>}
          {onFilter && <Button variant="outline" className="h-8 w-8 p-0" onClick={onFilter}><Filter className="h-4 w-4" /></Button>}
          {onAdd && <Button variant="outline" className="h-8 w-8 p-0" onClick={onAdd}>+</Button>}
        </div>
      </div>
    </header>
  );
}

export function MobileModuleCard({ title, purpose, status, runs, featureCount, isFavorite = false }: { title: string; purpose: string; status: 'Active' | 'In Review' | 'High Alert'; runs: number; featureCount: number; isFavorite?: boolean }) {
  return (
    <Card className="space-y-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">{purpose}</p>
        </div>
        {isFavorite && <Badge className="border border-border bg-background">Favorite</Badge>}
      </div>
      <div className="flex items-center justify-between text-xs">
        <Badge>{status}</Badge>
        <span>{runs} analisis</span>
      </div>
      <p className="text-xs text-muted-foreground">{featureCount} fitur siap pakai</p>
    </Card>
  );
}

export function MobilePatientHeader({ name, diagnosis, age, status }: { name: string; diagnosis: string; age: number; status: string }) {
  return <Card className="space-y-1 p-3"><p className="text-base font-semibold">{name}</p><p className="text-sm text-muted-foreground">{diagnosis} • {age} th</p><Badge className="w-fit">{status}</Badge></Card>;
}

export function MobileResultCard({ score, severity, summary, recommendation }: { score: number; severity: string; summary: string; recommendation: string }) {
  return <Card className="space-y-2 p-3"><p className="text-xs text-muted-foreground">Risk Score</p><p className="text-3xl font-bold">{score.toFixed(1)}</p><Badge>{severity.toUpperCase()}</Badge><p className="text-sm">{summary}</p><p className="text-sm text-muted-foreground">Rekomendasi: {recommendation}</p></Card>;
}

export function MobileAlertList({ items }: { items: { id: string; title: string; detail: string; severity: string }[] }) {
  return <div className="space-y-2">{items.map((item) => <Card key={item.id} className="space-y-1 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{item.title}</p><Badge className="bg-red-100 text-red-700">{item.severity}</Badge></div><p className="text-xs text-muted-foreground">{item.detail}</p></Card>)}</div>;
}

export function MobileFilterSheet({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="space-y-3 border-dashed p-3"><p className="text-sm font-semibold">{title}</p><div className="space-y-2">{children}</div></Card>;
}

export function MobileActionBar({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-20 z-30 mt-3 flex gap-2 rounded-xl border bg-background/95 p-2 shadow-sm backdrop-blur md:bottom-3">{children}</div>;
}

export function MobileHistoryAccordion({ items }: { items: { id: string; title: string; detail: string; meta: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details key={item.id} className="rounded-lg border p-3">
          <summary className="cursor-pointer text-sm font-medium">{item.title}</summary>
          <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
        </details>
      ))}
    </div>
  );
}
