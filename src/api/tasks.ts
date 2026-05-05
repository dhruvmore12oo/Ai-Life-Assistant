import { apiClient } from './client';
import type { Task } from '../types';

export const TaskAPI = {
  getAll: async (filters?: { status?: string, type?: string }) => {
    return apiClient.get('/tasks', { params: filters });
  },

  getById: async (id: string) => {
    return apiClient.get(`/tasks/${id}`);
  },

  create: async (taskData: Partial<Task>) => {
    return apiClient.post('/tasks', taskData);
  },

  update: async (id: string, updateData: Partial<Task>) => {
    return apiClient.put(`/tasks/${id}`, updateData);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  },

  uploadDocument: async (file: File) => {
    // Multi-part boundaries natively mapped for Express Multer consumption
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadText: async (text: string) => {
    return apiClient.post('/upload/text', { text });
  }
};
