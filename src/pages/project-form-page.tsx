import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '@/types/project';
import { ProjectForm } from '@/components/projects/project-form';

export function ProjectFormPage({ projects, onCreate, onUpdate }: { projects: Project[]; onCreate: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void; onUpdate: (id: string, p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const edit = projects.find((p) => p.id === id);
  const existingSlugs = projects
    .filter((p) => p.id !== edit?.id)
    .map((p) => p.slug.toLowerCase());

  return <div className="space-y-3 animate-in">
    <h1 className="text-xl font-bold">{edit ? 'Edit Project' : 'Tambah Project'}</h1>
    <ProjectForm initial={edit} existingSlugs={existingSlugs} onSubmit={(payload) => { edit ? onUpdate(edit.id, payload) : onCreate(payload); navigate('/projects'); }} />
  </div>;
}
