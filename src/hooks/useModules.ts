import { useState } from 'react';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { AiModule } from '@/types/module';

export const useModules = () => {
  storage.initModules();
  const [modules, setModules] = useState<AiModule[]>(storage.getModules());

  const sync = (next: AiModule[], message?: string) => {
    setModules(next);
    storage.saveModules(next);
    if (message) toast.success(message);
  };

  const create = (payload: Omit<AiModule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    sync([{ ...payload, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...modules], 'Modul ditambahkan');
  };

  const update = (id: string, payload: Omit<AiModule, 'id' | 'createdAt' | 'updatedAt'>) => {
    sync(modules.map((m) => (m.id === id ? { ...m, ...payload, updatedAt: new Date().toISOString() } : m)), 'Modul diperbarui');
  };

  const remove = (id: string) => sync(modules.filter((m) => m.id !== id), 'Modul dihapus');

  return { modules, create, update, remove };
};
