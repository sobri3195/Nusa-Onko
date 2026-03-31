import { Link, useParams } from 'react-router-dom';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ProjectDetailPage({ projects, onDelete, onFavorite }: { projects: Project[]; onDelete: (id: string) => void; onFavorite: (id: string) => void }) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  if (!project) return <Card className="space-y-3 animate-in"><p>Project tidak ditemukan</p><Link to="/projects" className="text-sm text-primary">Kembali ke daftar project</Link></Card>;

  return <Card className="space-y-3 animate-in">
    <h1 className="text-xl font-bold">{project.title}</h1>
    <p>{project.fullDescription}</p>
    <p className="text-sm text-muted-foreground">Tags: {project.tags.join(', ')}</p>
    <p className="text-xs text-muted-foreground">Dibuat: {new Date(project.createdAt).toLocaleString()} • Diperbarui: {new Date(project.updatedAt).toLocaleString()}</p>
    <div className="flex flex-wrap gap-2">
      <Link to={`/projects/${project.id}/edit`} className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Edit</Link>
      <Button variant="outline" onClick={() => onFavorite(project.id)}>{project.favorite ? 'Unfavorite' : 'Favorite'}</Button>
      <Button variant="destructive" onClick={() => onDelete(project.id)}>Hapus</Button>
    </div>
  </Card>;
}
