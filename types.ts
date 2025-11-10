// Fix: Populating `types.ts` with required type definitions to resolve module errors.
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  password?: string; // Password is for authentication simulation
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assigneeId: string | null;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}