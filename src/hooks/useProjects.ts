import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Project } from '@/types/project';

export const useProjects = () => {
  storage.init();
  const [projects, setProjects] = useState<Project[]>(storage.getProjects());

  const sync = (next: Project[], message?: string) => {
    setProjects(next);
    storage.saveProjects(next);
    if (message) toast.success(message);
  };

  const create = (payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    sync([{ ...payload, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...projects], 'Project ditambahkan');
  };
  const update = (id: string, payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    sync(projects.map((p) => (p.id === id ? { ...p, ...payload, updatedAt: new Date().toISOString() } : p)), 'Project diperbarui');
  };
  const remove = (id: string) => sync(projects.filter((p) => p.id !== id), 'Project dihapus');
  const toggleFavorite = (id: string) => sync(projects.map((p) => (p.id === id ? { ...p, favorite: !p.favorite, updatedAt: new Date().toISOString() } : p)));
  const resetStorage = () => {
    storage.reset();
    storage.init();
    const next = storage.getProjects();
    setProjects(next);
    toast.success('Local storage di-reset');
  };
  const restoreSeed = () => {
    storage.restoreSeed();
    setProjects(storage.getProjects());
    toast.success('Seed data dipulihkan');
  };
  const reload = () => setProjects(storage.getProjects());

  const favorites = useMemo(() => projects.filter((p) => p.favorite), [projects]);
  return { projects, favorites, create, update, remove, toggleFavorite, resetStorage, restoreSeed, reload };
};
