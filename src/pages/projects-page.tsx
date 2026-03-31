import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, categories, statuses } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ProjectCard } from '@/components/projects/project-card';
import { matchesSearch, ProjectSort, sortProjects } from '@/lib/project-utils';

export function ProjectsPage({ projects, onDelete, onFavorite }: { projects: Project[]; onDelete: (id: string) => void; onFavorite: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<ProjectSort>('updatedAt');

  const filtered = useMemo(() => sortProjects(projects, sort)
    .filter((p) => matchesSearch(p, search))
    .filter((p) => category === 'all' || p.category === category)
    .filter((p) => status === 'all' || p.status === status)
  , [projects, search, category, status, sort]);

  return <div className="space-y-4 animate-in">
    <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl font-bold">Projects</h1><Link to="/projects/new" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90">Tambah</Link></div>
    <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <Select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">Semua kategori</option>{categories.map((c)=><option key={c}>{c}</option>)}</Select>
      <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Semua status</option>{statuses.map((s)=><option key={s}>{s}</option>)}</Select>
      <Select value={sort} onChange={(e) => setSort(e.target.value as ProjectSort)}><option value="updatedAt">Updated</option><option value="name">Name</option><option value="priority">Priority</option></Select>
    </div>
    <p className="text-sm text-muted-foreground">Menampilkan {filtered.length} dari {projects.length} project</p>
    {filtered.length ? filtered.map((p) => <ProjectCard key={p.id} project={p} onDelete={() => onDelete(p.id)} onFavorite={() => onFavorite(p.id)} />) : <p className="rounded-md border p-4 text-sm text-muted-foreground">Tidak ada project yang cocok dengan filter saat ini.</p>}
  </div>;
}
