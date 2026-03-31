import { Link, useParams } from 'react-router-dom';
import { AiModule } from '@/types/module';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ModuleDetailPage({ modules, onDelete }: { modules: AiModule[]; onDelete: (id: string) => void }) {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);
  if (!module) return <Card><p>Modul tidak ditemukan</p><Link className="text-sm text-primary" to="/modules">Kembali ke daftar modul</Link></Card>;

  return <Card className="space-y-3 animate-in">
    <h1 className="text-xl font-bold">{module.name}</h1>
    <p>{module.details}</p>
    <p className="text-sm text-muted-foreground">Owner: {module.owner}</p>
    <p className="text-sm text-muted-foreground">Tags: {module.tags.join(', ')}</p>
    <p className="text-xs text-muted-foreground">Dibuat: {new Date(module.createdAt).toLocaleString()} • Diperbarui: {new Date(module.updatedAt).toLocaleString()}</p>
    <div className="flex gap-2">
      <Link to={`/modules/${module.id}/edit`} className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Edit</Link>
      <Button variant="destructive" onClick={() => onDelete(module.id)}>Hapus</Button>
    </div>
  </Card>;
}
