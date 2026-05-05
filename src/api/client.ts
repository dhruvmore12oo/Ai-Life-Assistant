import axios from 'axios';

// Singleton API configuration pointing to local Express Backend
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor universally parsing `{ success, data, message }` payload wrappers natively
apiClient.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    /* 
      Normalizes error logic strictly so components only deal with pure strings dynamically
    */
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred contacting the server';
    return Promise.reject(new Error(errorMsg));
  }
);
