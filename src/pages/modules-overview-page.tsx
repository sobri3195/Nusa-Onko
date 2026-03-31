import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MODULE_DEFINITIONS } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';
import { MobileFilterSheet, MobileModuleCard } from '@/components/mobile/mobile-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const filters = ['All', 'Active', 'In Review', 'High Alert'] as const;

export function ModulesOverviewPage() {
  const { executions, notifications } = useRTStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');

  const modules = useMemo(() => MODULE_DEFINITIONS.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.purpose.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="space-y-4 p-3 md:p-6">
      <div className="space-y-2">
        <h1 className="hidden text-2xl font-bold md:block">Modules Overview</h1>
        <Input placeholder="Cari modul AI" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11" />
      </div>

      <MobileFilterSheet title="Quick Filter (mobile bottom-sheet style)">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} className="h-8" onClick={() => setActiveFilter(filter)}>
              {filter}
            </Button>
          ))}
        </div>
      </MobileFilterSheet>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((m, index) => {
          const runCount = executions.filter((x) => x.moduleKey === m.key).length;
          const alertCount = notifications.filter((x) => x.moduleKey === m.key).length;
          const status = alertCount > 0 ? 'High Alert' : index % 2 === 0 ? 'Active' : 'In Review';
          if (activeFilter !== 'All' && activeFilter !== status) return null;
          return (
            <Link key={m.key} to={`/modules/${m.key}`}>
              <MobileModuleCard title={m.name} purpose={m.purpose} status={status} runs={runCount} isFavorite={index < 3} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
