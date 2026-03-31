import { Project } from '@/types/project';
import { ProjectCard } from '@/components/projects/project-card';

export function FavoritesPage({ projects, onDelete, onFavorite }: { projects: Project[]; onDelete: (id: string) => void; onFavorite: (id: string) => void }) {
  const favorites = projects.filter((p) => p.favorite);
  if (!favorites.length) return <p className="text-sm text-muted-foreground">Belum ada favorit.</p>;
  return <div className="space-y-3"><h1 className="text-xl font-bold">Favorites</h1>{favorites.map((p)=><ProjectCard key={p.id} project={p} onDelete={() => onDelete(p.id)} onFavorite={() => onFavorite(p.id)} />)}</div>;
}
