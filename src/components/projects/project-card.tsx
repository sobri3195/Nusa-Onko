import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ProjectCard({ project, onDelete, onFavorite }: { project: Project; onDelete?: () => void; onFavorite?: () => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <Link to={`/projects/${project.id}`} className="space-y-2">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
        </Link>
        <Button variant="outline" onClick={onFavorite}>{project.favorite ? '★' : '☆'}</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{project.category}</Badge><Badge>{project.status}</Badge><Badge>{project.priority}</Badge>
      </div>
      {onDelete && <div className="mt-3"><Button variant="destructive" onClick={onDelete}>Hapus</Button></div>}
    </Card>
  );
}
