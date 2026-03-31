import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/projects/project-card';
import { Card } from '@/components/ui/card';

export function FavoritesPage({ projects, onDelete, onFavorite }: { projects: Project[]; onDelete: (id: string) => void; onFavorite: (id: string) => void }) {
  const favorites = projects.filter((p) => p.favorite);
  if (!favorites.length) return <Card className="space-y-3 animate-in"><h1 className="text-xl font-bold">Favorites</h1><p className="text-sm text-muted-foreground">Belum ada favorit. Tambahkan proyek agar modul ini punya alur CRUD lengkap.</p><Link to="/projects/new" className="inline-flex rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Tambah Project</Link></Card>;
  return <div className="space-y-3 animate-in"><div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl font-bold">Favorites</h1><Link to="/projects/new" className="inline-flex rounded-md border border-border bg-card px-3 py-2 text-sm font-medium">Create</Link></div>{favorites.map((p)=><ProjectCard key={p.id} project={p} onDelete={() => onDelete(p.id)} onFavorite={() => onFavorite(p.id)} />)}</div>;
}
