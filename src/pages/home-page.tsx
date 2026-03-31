import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function groupProjectsBy<T extends keyof Project>(projects: Project[], key: T): Record<string, Project[]> {
  return projects.reduce<Record<string, Project[]>>((acc, project) => {
    const groupKey = String(project[key] ?? 'Uncategorized');
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(project);
    return acc;
  }, {});
}

export function HomePage({ projects }: { projects: Project[] }) {
  const byStatus = groupProjectsBy(projects, 'status');
  const byCategory = groupProjectsBy(projects, 'category');
  const favorites = projects.filter((p) => p.favorite).slice(0, 3);
  const recent = [...projects].sort((a,b)=> b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);

  return <div className="space-y-4">
    <h1 className="text-2xl font-bold">Nusa Onko</h1>
    <Input placeholder="Quick search..." />
    <Card><p className="text-sm text-muted-foreground">Total proyek</p><p className="text-3xl font-semibold">{projects.length}</p></Card>
    <Card><h2 className="font-semibold mb-2">Ringkasan Status</h2>{Object.entries(byStatus).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
    <Card><h2 className="font-semibold mb-2">Ringkasan Kategori</h2>{Object.entries(byCategory).map(([k,v])=> <p key={k} className="text-sm">{k}: {v.length}</p>)}</Card>
    <Card><h2 className="font-semibold mb-2">Favorit</h2>{favorites.map((p)=><Link className="block text-sm text-primary" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>)}</Card>
    <Card><h2 className="font-semibold mb-2">Recent Updated</h2>{recent.map((p)=><Link className="block text-sm" key={p.id} to={`/projects/${p.id}`}>{p.title}</Link>)}</Card>
  </div>;
}
