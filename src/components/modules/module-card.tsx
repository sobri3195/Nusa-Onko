import { Link } from 'react-router-dom';
import { AiModule } from '@/types/module';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ModuleCard({ module, onDelete }: { module: AiModule; onDelete: () => void }) {
  return <Card className="space-y-2">
    <div className="flex items-start justify-between gap-2">
      <div>
        <Link className="font-semibold text-primary" to={`/modules/${module.id}`}>{module.name}</Link>
        <p className="text-xs text-muted-foreground">{module.status} • {module.priority}</p>
      </div>
      <Link to={`/modules/${module.id}/edit`} className="rounded border px-2 py-1 text-xs">Edit</Link>
    </div>
    <p className="text-sm text-muted-foreground">{module.summary}</p>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Owner: {module.owner}</span>
      <Button variant="destructive" className="h-auto px-2 py-1 text-xs" onClick={onDelete}>Delete</Button>
    </div>
  </Card>;
}
