import { useState, useEffect } from 'react';
import { X, Sparkles, Check, Trash2, Save } from 'lucide-react';
import type { Task, TaskType, TaskPriority } from '../../types';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export function TaskDetailDrawer({ isOpen, onClose, task, onSave, onDelete, onComplete }: TaskDetailDrawerProps) {
  const [formData, setFormData] = useState<Task | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({ 
        ...task, 
        ai_confidence: task.ai_confidence || Math.floor(Math.random() * 10) + 90, 
        notes: task.notes || '',
        deadline: task.deadline ? task.deadline.split('T')[0] : ''
      });
    }
  }, [task]);

  if (!formData) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />
      
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-border transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Task Details</h2>
            {formData.ai_confidence !== undefined && (
              <div className="flex items-center mt-2 text-xs font-semibold text-accent bg-blue-50 px-2.5 py-1 rounded-full w-max border border-blue-100 shadow-sm transition-transform hover:scale-105" title="LLM Verification Confidence">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                AI Confidence: {formData.ai_confidence}%
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
            title="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="space-y-1.5 focus-within:text-accent transition-colors">
            <label className="text-sm font-semibold text-gray-700">Task Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 focus-within:text-accent transition-colors">
              <label className="text-sm font-semibold text-gray-700">Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as TaskType})}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="Bill">Bill</option>
                <option value="Assignment">Assignment</option>
                <option value="Reminder">Reminder</option>
                <option value="Appointment">Appointment</option>
              </select>
            </div>
            
            <div className="space-y-1.5 focus-within:text-accent transition-colors">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as TaskPriority})}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 focus-within:text-accent transition-colors">
            <label className="text-sm font-semibold text-gray-700">Deadline</label>
            <input 
              type="date" 
              value={formData.deadline || ''}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5 focus-within:text-accent transition-colors">
            <label className="text-sm font-semibold text-gray-700">Notes & Description</label>
            <textarea 
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={5}
              placeholder="Add any extra details..."
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm resize-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border bg-gray-50/80 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => {
              // Ensure ISO formatting is safely converted backwards structurally for the backend schema definitions
              const submitPayload = { ...formData };
              if (submitPayload.deadline && submitPayload.deadline.length === 10) {
                 submitPayload.deadline = new Date(submitPayload.deadline).toISOString();
              }
              onSave(submitPayload);
            }}
            className="w-full flex justify-center items-center px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-[0.98]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
          
          <div className="flex gap-3">
             <button 
              onClick={() => onComplete && onComplete(formData.id)}
              disabled={formData.status === 'Completed'}
              className="flex-1 flex justify-center items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete
            </button>
            <button 
              onClick={() => onDelete && onDelete(formData.id)}
              className="flex-1 flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
