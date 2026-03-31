import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { matchesSearch } from '@/lib/project-utils';
import { Button } from '@/components/ui/button';
import { featureRoadmap } from '@/data/featureRoadmap';

function groupProjectsBy<T extends keyof Project>(projects: Project[], key: T): Record<string, Project[]> {
  return projects.reduce<Record<string, Project[]>>((acc, project) => {
    const groupKey = String(project[key] ?? 'Uncategorized');
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(project);
    return acc;
  }, {});
}

export function HomePage({ projects, onDelete }: { projects: Project[]; onDelete: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const byStatus = groupProjectsBy(projects, 'status');
  const byCategory = groupProjectsBy(projects, 'category');
  const favorites = projects.filter((p) => p.favorite).slice(0, 3);
  const recent = [...projects].sort((a,b)=> b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const quickResult = useMemo(() => projects.filter((project) => matchesSearch(project, query)).slice(0, 5), [projects, query]);

  return <div className="space-y-4">
    <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-xl animate-in">
      <h1 className="text-2xl font-bold">Nusa Onko</h1>
      <p className="mt-1 text-sm text-white/90">Dashboard manajemen ide AI radioterapi yang cepat, modern, dan responsif.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Link to="/projects/new" className="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-indigo-700">Create</Link>
        <Link to="/projects" className="rounded-md bg-white/20 px-3 py-2 text-center text-sm font-semibold">Read</Link>
        <Link to="/modules" className="rounded-md bg-white/20 px-3 py-2 text-center text-sm font-semibold">Modules</Link>
        {recent[0] ? <Link to={`/projects/${recent[0].id}/edit`} className="rounded-md bg-white/20 px-3 py-2 text-center text-sm font-semibold">Update</Link> : null}
      </div>
    </div>
    <Input placeholder="Quick search..." value={query} onChange={(e) => setQuery(e.target.value)} />
    {query ? <Card><h2 className="mb-2 font-semibold">Hasil pencarian</h2>{quickResult.length ? quickResult.map((p) => <Link className="block text-sm text-primary" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>) : <p className="text-sm text-muted-foreground">Tidak ada hasil.</p>}</Card> : null}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Card><p className="text-sm text-muted-foreground">Total proyek</p><p className="text-3xl font-semibold">{projects.length}</p></Card>
      <Card><h2 className="mb-2 font-semibold">Favorit</h2>{favorites.length ? favorites.map((p)=><Link className="block text-sm text-primary" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>) : <p className="text-sm text-muted-foreground">Belum ada favorit.</p>}</Card>
      <Card><h2 className="mb-2 font-semibold">Ringkasan Status</h2>{Object.entries(byStatus).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
      <Card><h2 className="mb-2 font-semibold">Ringkasan Kategori</h2>{Object.entries(byCategory).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
    </div>
    <Card>
      <h2 className="mb-2 font-semibold">Recent Updated (CRUD)</h2>
      <div className="space-y-2">
        {recent.map((p)=>(
          <div key={p.id} className="flex flex-col gap-2 rounded-md border border-border/70 p-2 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-sm font-medium text-primary" to={`/projects/${p.id}`}>{p.title}</Link>
            <div className="flex flex-wrap gap-2">
              <Link to={`/projects/${p.id}`} className="rounded-md border px-2 py-1 text-xs">Read</Link>
              <Link to={`/projects/${p.id}/edit`} className="rounded-md border px-2 py-1 text-xs">Update</Link>
              <Button variant="destructive" className="px-2 py-1 text-xs" onClick={() => onDelete(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <h2 className="mb-1 font-semibold">Usulan Pengembangan Fitur</h2>
      <p className="mb-3 text-sm text-muted-foreground">Rencana fitur lanjutan untuk meningkatkan kolaborasi dan pelaporan tim.</p>
      <div className="space-y-3">
        {featureRoadmap.map((feature) => (
          <div key={feature.title} className="rounded-md border border-border/70 p-3">
            <h3 className="text-sm font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {feature.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  </div>;
}
