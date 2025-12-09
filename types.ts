// Types aligned with backend API
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical', // Adjusted to match backend
}

export enum Status {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved', // Adjusted to match backend
}

export interface User {
  UserID: number;
  Username: string;
  Email: string;
  PasswordHash?: string; // For login
  Role: string;
  CreatedAt: string;
  // Frontend specific
  avatar?: string;
}

export interface Bug {
  BugID: number;
  Title: string;
  Description: string | null;
  Status: string;
  Priority: string;
  ProjectID: number;
  ReportedBy: number | null;
  AssignedTo: number | null;
  CreatedAt: string;
}

export interface CreateBug {
  Title: string;
  Description?: string;
  Status?: string;
  Priority?: string;
  ProjectID: number;
  ReportedBy?: number;
  AssignedTo?: number;
}

export interface UpdateBug {
  Title?: string;
  Description?: string;
  Status?: string;
  Priority?: string;
  AssignedTo?: number;
}

export interface Project {
  ProjectID: number;
  ProjectName: string;
  Description: string | null;
  CreatedBy: number;
  CreatedAt: string;
}

export interface CreateProject {
  ProjectName: string;
  Description?: string;
  CreatedBy: number;
}

export interface UpdateProject {
  ProjectName?: string;
  Description?: string;
}

export interface Comment {
  CommentID: number;
  BugID: number;
  UserID: number;
  CommentText: string;
  CreatedAt: string;
}

export interface CreateComment {
  BugID: number;
  UserID: number;
  CommentText: string;
}

export interface UpdateComment {
  CommentText?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// For backward compatibility, alias Issue to Bug
export type Issue = Bug;