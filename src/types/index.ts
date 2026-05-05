export type TaskType = 'Bill' | 'Assignment' | 'Reminder' | 'Appointment';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  deadline: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  ai_confidence?: number;
  created_at?: string;
  updated_at?: string;
}
