import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, categories, statuses } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/project-card';

export function ProjectsPage({ projects, onDelete, onFavorite }: { projects: Project[]; onDelete: (id: string) => void; onFavorite: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('updatedAt');

  const filtered = useMemo(() => [...projects]
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => category === 'all' || p.category === category)
    .filter((p) => status === 'all' || p.status === status)
    .sort((a, b) => sort === 'name' ? a.title.localeCompare(b.title) : sort === 'priority' ? a.priority.localeCompare(b.priority) : b.updatedAt.localeCompare(a.updatedAt)), [projects, search, category, status, sort]);

  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Projects</h1><Link to="/projects/new" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Tambah</Link></div>
    <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <Select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">Semua kategori</option>{categories.map((c)=><option key={c}>{c}</option>)}</Select>
      <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Semua status</option>{statuses.map((s)=><option key={s}>{s}</option>)}</Select>
      <Select value={sort} onChange={(e) => setSort(e.target.value)}><option value="updatedAt">Updated</option><option value="name">Name</option><option value="priority">Priority</option></Select>
    </div>
    {filtered.map((p) => <ProjectCard key={p.id} project={p} onDelete={() => onDelete(p.id)} onFavorite={() => onFavorite(p.id)} />)}
  </div>;
}
