import { useNavigate, useParams } from 'react-router-dom';
import { ModuleForm } from '@/components/modules/module-form';
import { AiModule } from '@/types/module';

export function ModuleFormPage({ modules, onCreate, onUpdate }: { modules: AiModule[]; onCreate: (p: Omit<AiModule, 'id' | 'createdAt' | 'updatedAt'>) => void; onUpdate: (id: string, p: Omit<AiModule, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const edit = modules.find((m) => m.id === id);
  const existingSlugs = modules.filter((m) => m.id !== edit?.id).map((m) => m.slug.toLowerCase());

  return <div className="space-y-3 animate-in">
    <h1 className="text-xl font-bold">{edit ? 'Edit Modul' : 'Tambah Modul AI'}</h1>
    <ModuleForm initial={edit} existingSlugs={existingSlugs} onSubmit={(payload) => { edit ? onUpdate(edit.id, payload) : onCreate(payload); navigate('/modules'); }} />
  </div>;
}
