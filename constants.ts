// Fix: Populating `constants.ts` with required constants and dummy data to resolve module errors.
import { Priority, Status, User, Project, Issue } from './types';

export const PRIORITIES: Priority[] = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.URGENT,
];

export const DUMMY_USERS: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=user-1', email: 'alice@example.com', password: 'password123' },
  { id: 'user-2', name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=user-2', email: 'bob@example.com', password: 'password123' },
  { id: 'user-3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?u=user-3', email: 'charlie@example.com', password: 'password123' },
];

export const DUMMY_PROJECTS: Project[] = [
    { id: 'proj-1', name: 'Phoenix Project', description: 'A project to rebuild the main application from scratch.'},
    { id: 'proj-2', name: 'Marketing Website', description: 'Redesign of the company marketing website.'}
];

export const DUMMY_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication for the new API.',
    priority: Priority.URGENT,
    status: Status.TODO,
    assigneeId: 'user-1',
    projectId: 'proj-1',
  },
  {
    id: 'issue-2',
    title: 'Design database schema',
    description: 'Create and document the initial database schema using ER diagrams.',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    assigneeId: 'user-2',
    projectId: 'proj-1',
  },
  {
    id: 'issue-3',
    title: 'Fix button alignment on homepage',
    description: 'The main CTA button is misaligned on mobile devices.',
    priority: Priority.MEDIUM,
    status: Status.DONE,
    assigneeId: 'user-3',
    projectId: 'proj-2',
  },
    {
    id: 'issue-4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: Priority.HIGH,
    status: Status.TODO,
    assigneeId: 'user-2',
    projectId: 'proj-1',
  },
];