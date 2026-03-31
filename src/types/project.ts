export const categories = ['Segmentation','Adaptive RT','Toxicity Prediction','Treatment Planning','Setup Verification','Document Audit','Cognitive Outcome','Scheduling','Liver Toxicity'] as const;
export const statuses = ['Idea','In Review','Active','Completed','Archived'] as const;
export const priorities = ['Low','Medium','High','Critical'] as const;

export type Category = (typeof categories)[number];
export type Status = (typeof statuses)[number];
export type Priority = (typeof priorities)[number];

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}
