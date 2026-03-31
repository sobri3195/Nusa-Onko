import { Priority, Project } from '@/types/project';

export type ProjectSort = 'updatedAt' | 'name' | 'priority';

const priorityRank: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export function normalizeSearch(text: string) {
  return text.trim().toLowerCase();
}

export function matchesSearch(project: Project, query: string) {
  const normalized = normalizeSearch(query);
  if (!normalized) return true;
  return [
    project.title,
    project.shortDescription,
    project.fullDescription,
    project.slug,
    project.category,
    project.status,
    project.priority,
    project.tags.join(' ')
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export function sortProjects(projects: Project[], sort: ProjectSort) {
  return [...projects].sort((a, b) => {
    if (sort === 'name') return a.title.localeCompare(b.title);
    if (sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
