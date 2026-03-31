import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ModuleCard } from '@/components/modules/module-card';
import { moduleStatuses, AiModule } from '@/types/module';

export function ModulesPage({ modules, onDelete }: { modules: AiModule[]; onDelete: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => modules
    .filter((m) => [m.name, m.slug, m.summary, m.owner, ...m.tags].join(' ').toLowerCase().includes(query.toLowerCase()))
    .filter((m) => status === 'all' || m.status === status)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [modules, query, status]);

  return <div className="space-y-4 animate-in">
    <div className="flex items-center justify-between gap-2"><h1 className="text-xl font-bold">AI Modules</h1><Link to="/modules/new" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow">Tambah Modul</Link></div>
    <Input placeholder="Cari modul..." value={query} onChange={(e) => setQuery(e.target.value)} />
    <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Semua status</option>{moduleStatuses.map((s) => <option key={s}>{s}</option>)}</Select>
    <p className="text-sm text-muted-foreground">Menampilkan {filtered.length} dari {modules.length} modul</p>
    <div className="space-y-3">{filtered.map((module) => <ModuleCard key={module.id} module={module} onDelete={() => onDelete(module.id)} />)}</div>
  </div>;
}
