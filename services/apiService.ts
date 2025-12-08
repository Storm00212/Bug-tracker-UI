import axios from 'axios';
import {
  User,
  Project,
  Bug,
  Comment,
  CreateBug,
  UpdateBug,
  CreateProject,
  UpdateProject,
  CreateComment,
  UpdateComment,
  LoginRequest,
  RegisterRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:3000'; // Adjust if needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/api/users/login', credentials);
    return { user: response.data.user, token: response.data.token };
  },
  register: async (userData: RegisterRequest) => {
    const response = await api.post('/api/users/register', userData);
    return response.data.user;
  },
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data.user;
  },
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data.user;
  },
  changePassword: async (passwordData: { oldPassword: string; newPassword: string }) => {
    const response = await api.put('/api/users/change-password', passwordData);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/api/projects');
    return response.data.projects;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data.project;
  },
  getByCreator: async (creatorId: number) => {
    const response = await api.get(`/api/projects/creator/${creatorId}`);
    return response.data.projects;
  },
  create: async (project: CreateProject) => {
    const response = await api.post('/api/projects', project);
    return response.data.project;
  },
  update: async (id: number, project: UpdateProject) => {
    const response = await api.put(`/api/projects/${id}`, project);
    return response.data.project;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
};

// Bugs API
export const bugsAPI = {
  getAll: async () => {
    const response = await api.get('/api/bugs');
    return response.data.bugs;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/bugs/${id}`);
    return response.data.bug;
  },
  getByProject: async (projectId: number) => {
    const response = await api.get(`/api/bugs/project/${projectId}`);
    return response.data.bugs;
  },
  getByAssignee: async (assigneeId: number) => {
    const response = await api.get(`/api/bugs/assignee/${assigneeId}`);
    return response.data.bugs;
  },
  getByReporter: async (reporterId: number) => {
    const response = await api.get(`/api/bugs/reporter/${reporterId}`);
    return response.data.bugs;
  },
  getByStatus: async (status: string) => {
    const response = await api.get(`/api/bugs/status/${status}`);
    return response.data.bugs;
  },
  create: async (bug: CreateBug) => {
    const response = await api.post('/api/bugs', bug);
    return response.data.bug;
  },
  update: async (id: number, bug: UpdateBug) => {
    const response = await api.put(`/api/bugs/${id}`, bug);
    return response.data.bug;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/bugs/${id}`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getAll: async () => {
    const response = await api.get('/api/comments');
    return response.data.comments;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/comments/${id}`);
    return response.data.comment;
  },
  getByBug: async (bugId: number) => {
    const response = await api.get(`/api/comments/bug/${bugId}`);
    return response.data.comments;
  },
  getByUser: async (userId: number) => {
    const response = await api.get(`/api/comments/user/${userId}`);
    return response.data.comments;
  },
  create: async (comment: CreateComment) => {
    const response = await api.post('/api/comments', comment);
    return response.data.comment;
  },
  update: async (id: number, comment: UpdateComment) => {
    const response = await api.put(`/api/comments/${id}`, comment);
    return response.data.comment;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/comments/${id}`);
    return response.data;
  },
  deleteByBug: async (bugId: number) => {
    const response = await api.delete(`/api/comments/bug/${bugId}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data.users;
  },
  getByProject: async (projectId: number) => {
    const response = await api.get(`/api/users/project/${projectId}`);
    return response.data.users;
  },
};