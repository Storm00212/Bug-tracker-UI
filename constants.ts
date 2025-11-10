import { Status, Priority, User, Issue, Project } from './types';

export const STATUSES: Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE];

export const PRIORITIES: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT];

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'James Smith', avatar: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Unassigned', avatar: 'https://i.pravatar.cc/150?u=user-4' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Phoenix Project', description: 'A new web application for customer management.' },
  { id: 'proj-2', name: 'Mobile App Refactor', description: 'Updating the legacy mobile application to a new framework.' },
];


export const MOCK_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    title: 'Login button unresponsive on Safari',
    description: 'The main login button does not trigger the authentication flow when clicked on Safari 15.2. Works fine on Chrome and Firefox.',
    status: Status.TODO,
    priority: Priority.HIGH,
    assigneeId: 'user-1',
    projectId: 'proj-1',
  },
  {
    id: 'issue-2',
    title: 'API returns 500 error for /users endpoint',
    description: 'When fetching the user list, the server occasionally returns a 500 Internal Server Error. Seems to be related to database connection pooling.',
    status: Status.IN_PROGRESS,
    priority: Priority.URGENT,
    assigneeId: 'user-2',
    projectId: 'proj-1',
  },
  {
    id: 'issue-3',
    title: 'Incorrect color scheme in dark mode',
    description: 'Some components in the settings page do not adhere to the dark mode color palette.',
    status: Status.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assigneeId: 'user-3',
    projectId: 'proj-2',
  },
  {
    id: 'issue-4',
    title: 'User profile pictures not loading',
    description: 'The avatar images in the user profile section are broken, showing the alt text instead.',
    status: Status.DONE,
    priority: Priority.MEDIUM,
    assigneeId: 'user-1',
    projectId: 'proj-2',
  },
  {
    id: 'issue-5',
    title: 'Typo in welcome email template',
    description: 'The welcome email contains a grammatical error in the first paragraph.',
    status: Status.TODO,
    priority: Priority.LOW,
    assigneeId: null,
    projectId: 'proj-1',
  },
];