import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { TaskAPI } from '../api/tasks';
import type { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  updateTaskState: (updatedTask: Task) => void;
  removeTaskState: (id: string) => void;
  addTaskState: (newTask: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await TaskAPI.getAll();
      setTasks(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks dynamically');
      console.error('[TaskContext Exception]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskState = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const removeTaskState = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTaskState = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, isLoading, error, refreshTasks: fetchTasks, 
      updateTaskState, removeTaskState, addTaskState 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be invoked safely within a TaskProvider boundary');
  }
  return context;
}
