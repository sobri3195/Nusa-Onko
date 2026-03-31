import { seedProjects } from '@/data/seedProjects';
import { Project } from '@/types/project';

const PROJECTS_KEY = 'nusa_onko_projects';
const THEME_KEY = 'nusa_onko_theme';

export const storage = {
  init: () => {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (!data) localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects));
  },
  getProjects: (): Project[] => JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? '[]'),
  saveProjects: (projects: Project[]) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)),
  reset: () => localStorage.removeItem(PROJECTS_KEY),
  restoreSeed: () => localStorage.setItem(PROJECTS_KEY, JSON.stringify(seedProjects)),
  getTheme: () => localStorage.getItem(THEME_KEY) ?? 'light',
  setTheme: (theme: 'light' | 'dark') => localStorage.setItem(THEME_KEY, theme)
};
