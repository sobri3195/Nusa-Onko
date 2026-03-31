import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MODULE_DEFINITIONS } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';
import { MobileFilterSheet, MobileModuleCard } from '@/components/mobile/mobile-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const filters = ['All', 'Active', 'In Review', 'High Alert'] as const;

export function ModulesOverviewPage() {
  const { executions, notifications } = useRTStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');

  const modules = useMemo(() => MODULE_DEFINITIONS
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.purpose.toLowerCase().includes(query.toLowerCase()))
    .map((module, index) => {
      const runCount = executions.filter((x) => x.moduleKey === module.key).length;
      const alertCount = notifications.filter((x) => x.moduleKey === module.key).length;
      const status: 'Active' | 'In Review' | 'High Alert' = alertCount > 0 ? 'High Alert' : runCount > 0 ? 'Active' : index % 2 === 0 ? 'In Review' : 'Active';
      return { module, runCount, alertCount, status };
    }), [query, executions, notifications]);

  const visibleModules = modules.filter((item) => activeFilter === 'All' || item.status === activeFilter);
  const totalRuns = modules.reduce((acc, item) => acc + item.runCount, 0);
  const highAlertModules = modules.filter((item) => item.status === 'High Alert').length;

  return (
    <div className="space-y-4 p-3 md:p-6">
      <div className="space-y-2">
        <h1 className="hidden text-2xl font-bold md:block">Modules</h1>
        <Input placeholder="Cari modul AI" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Modules</p><p className="text-2xl font-bold">{modules.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Runs</p><p className="text-2xl font-bold">{totalRuns}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">High Alert Modules</p><p className="text-2xl font-bold">{highAlertModules}</p></Card>
      </div>

      <MobileFilterSheet title="Quick Filter">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} className="h-8" onClick={() => setActiveFilter(filter)}>
              {filter}
            </Button>
          ))}
        </div>
      </MobileFilterSheet>

      {visibleModules.length === 0 ? (
        <Card className="p-4 text-sm text-muted-foreground">Tidak ada modul yang cocok dengan filter saat ini.</Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map(({ module, runCount, status }, index) => (
            <Link key={module.key} to={`/modules/${module.key}`}>
              <MobileModuleCard title={module.name} purpose={module.purpose} status={status} runs={runCount} featureCount={module.features.length} isFavorite={index < 3} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
