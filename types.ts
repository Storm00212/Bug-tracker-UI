export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export interface User {
  id: string;
  name: string;
  avatar: string; // URL to avatar image
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  projectId: string;
}