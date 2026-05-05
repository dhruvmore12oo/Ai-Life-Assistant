import { useState } from 'react';
import { 
  FileText, Calendar, BellRing, CheckCircle, 
  Upload, Edit, Play, Inbox, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../components/ui/Table';
import { TaskDetailDrawer } from '../components/features/TaskDetailDrawer';
import { useTasks } from '../context/TaskContext';
import { TaskAPI } from '../api/tasks';
import type { Task } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { tasks, isLoading, removeTaskState, updateTaskState } = useTasks();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'High': return <Badge variant="danger">High</Badge>;
      case 'Medium': return <Badge variant="warning">Medium</Badge>;
      case 'Low': return <Badge variant="default">Low</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Pending') return <Badge variant="warning">Pending</Badge>;
    if (status === 'Completed') return <Badge variant="success">Completed</Badge>;
    return <Badge>{status}</Badge>;
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      const response = await TaskAPI.update(updatedTask.id, updatedTask);
      updateTaskState(response.data);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await TaskAPI.delete(id);
      removeTaskState(id);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const response = await TaskAPI.update(id, { status: 'Completed' });
      updateTaskState(response.data);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Failed to complete task', err);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your tasks and reminders</p>
        </div>
        <button 
          onClick={() => navigate('/upload')}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-3 bg-blue-50 text-accent rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {tasks.filter(t => t.status === 'Completed').length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Deadlines</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {tasks.filter(t => t.status === 'Pending').length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Bills</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                 {tasks.filter(t => t.type === 'Bill' && t.status === 'Pending').length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Volume</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{tasks.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
        
        {isLoading ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center shadow-sm">
             <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
             <p className="text-gray-500 font-medium">Fetching real-time tasks...</p>
          </Card>
        ) : tasks.length > 0 ? (
          <Card className="overflow-hidden border-border bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow 
                    key={task.id} 
                    className="group cursor-pointer hover:bg-gray-50/80 transition-colors"
                    onClick={() => handleRowClick(task)}
                  >
                    <TableCell className="font-semibold text-gray-800">{task.title}</TableCell>
                    <TableCell>
                      <span className="text-gray-500">{task.type}</span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}
                    </TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          className="p-2 text-gray-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                          title="View details"
                          onClick={(e) => { e.stopPropagation(); handleRowClick(task); }}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                          title="Edit task"
                          onClick={(e) => { e.stopPropagation(); handleRowClick(task); }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed bg-transparent shadow-none">
            <div className="bg-white border border-gray-100 p-5 rounded-full mb-5 shadow-sm">
              <Inbox className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No tasks mapped yet</h3>
            <p className="mt-2 text-gray-500 max-w-sm text-sm leading-relaxed">
              Upload a bill, screenshot, or reminder to let our AI extract and organize your tasks automatically.
            </p>
            <button 
              onClick={() => navigate('/upload')}
              className="mt-8 inline-flex items-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 hover:text-accent px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="h-4 w-4 mr-2 text-gray-400 group-hover:text-accent" />
              Upload New Task
            </button>
          </Card>
        )}
      </div>

      <TaskDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />
    </div>
  );
}
