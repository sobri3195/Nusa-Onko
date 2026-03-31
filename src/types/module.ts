export const moduleStatuses = ['Draft', 'Pilot', 'Validated', 'Production', 'Archived'] as const;
export const modulePriorities = ['Low', 'Medium', 'High', 'Critical'] as const;

export type ModuleStatus = (typeof moduleStatuses)[number];
export type ModulePriority = (typeof modulePriorities)[number];

export interface AiModule {
  id: string;
  name: string;
  slug: string;
  summary: string;
  details: string;
  status: ModuleStatus;
  priority: ModulePriority;
  owner: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
