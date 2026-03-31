import { seedProjects } from '@/data/seedProjects';
import { Project } from '@/types/project';

const PROJECTS_KEY = 'nusa_onko_projects';
const THEME_KEY = 'nusa_onko_theme';

export const storage = {
  init: () => {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (!data) localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects));
  },
  getProjects: (): Project[] => {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  saveProjects: (projects: Project[]) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)),
  reset: () => localStorage.removeItem(PROJECTS_KEY),
  restoreSeed: () => localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects)),
  getTheme: () => localStorage.getItem(THEME_KEY) ?? 'light',
  setTheme: (theme: 'light' | 'dark') => localStorage.setItem(THEME_KEY, theme),
  exportProjects: () => JSON.stringify(storage.getProjects(), null, 2),
  importProjects: (rawJson: string) => {
    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) throw new Error('Format JSON tidak valid');
    storage.saveProjects(parsed as Project[]);
  }
};
