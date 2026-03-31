import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { matchesSearch } from '@/lib/project-utils';

function groupProjectsBy<T extends keyof Project>(projects: Project[], key: T): Record<string, Project[]> {
  return projects.reduce<Record<string, Project[]>>((acc, project) => {
    const groupKey = String(project[key] ?? 'Uncategorized');
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(project);
    return acc;
  }, {});
}

export function HomePage({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('');
  const byStatus = groupProjectsBy(projects, 'status');
  const byCategory = groupProjectsBy(projects, 'category');
  const favorites = projects.filter((p) => p.favorite).slice(0, 3);
  const recent = [...projects].sort((a,b)=> b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const quickResult = useMemo(() => projects.filter((project) => matchesSearch(project, query)).slice(0, 5), [projects, query]);

  return <div className="space-y-4">
    <h1 className="text-2xl font-bold">Nusa Onko</h1>
    <Input placeholder="Quick search..." value={query} onChange={(e) => setQuery(e.target.value)} />
    {query ? <Card><h2 className="font-semibold mb-2">Hasil pencarian</h2>{quickResult.length ? quickResult.map((p) => <Link className="block text-sm text-primary" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>) : <p className="text-sm text-muted-foreground">Tidak ada hasil.</p>}</Card> : null}
    <Card><p className="text-sm text-muted-foreground">Total proyek</p><p className="text-3xl font-semibold">{projects.length}</p></Card>
    <Card><h2 className="font-semibold mb-2">Ringkasan Status</h2>{Object.entries(byStatus).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
    <Card><h2 className="font-semibold mb-2">Ringkasan Kategori</h2>{Object.entries(byCategory).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
    <Card><h2 className="font-semibold mb-2">Favorit</h2>{favorites.map((p)=><Link className="block text-sm text-primary" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>)}</Card>
    <Card><h2 className="font-semibold mb-2">Recent Updated</h2>{recent.map((p)=><Link className="block text-sm" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>)}</Card>
  </div>;
}
