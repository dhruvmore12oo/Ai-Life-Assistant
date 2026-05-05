import { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Calendar as CalendarIcon, Clock, CheckCircle, Tag
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';

export function CalendarPage() {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  const [selectedDay, setSelectedDay] = useState<number>(isCurrentMonth ? today.getDate() : 1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Mapping Dynamic Backend Payload to the Current Calendar View Metrics
  const tasksForMonth = tasks.filter(t => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const dynamicCalendarTasks: Record<number, Task[]> = {};
  tasksForMonth.forEach(t => {
    const d = new Date(t.deadline!);
    const day = d.getDate();
    if (!dynamicCalendarTasks[day]) dynamicCalendarTasks[day] = [];
    dynamicCalendarTasks[day].push(t);
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'High': return <Badge variant="danger">High</Badge>;
      case 'Medium': return <Badge variant="warning">Medium</Badge>;
      case 'Low': return <Badge variant="default">Low</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const selectedTasks = dynamicCalendarTasks[selectedDay] || [];

  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar</h1>
          <p className="text-gray-500 mt-1">View and plan your AI extracted tasks across time</p>
        </div>
        <button className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
          <Plus className="w-4 h-4 mr-2" />
          Add Manual Task
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Main Calendar View */}
        <Card className="flex-1 flex flex-col p-6 shadow-sm border border-border bg-white rounded-xl">
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 border border-border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDay(new Date().getDate());
                }}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 border border-border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-border rounded-lg overflow-hidden flex-1">
            {/* Weekdays Header */}
            {weekDays.map(day => (
              <div key={day} className="bg-gray-50/80 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
            
            {/* Empty Cells */}
            {Array.from({ length: startingEmptyCells }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-gray-50/30 min-h-[100px] p-2" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNum = index + 1;
              const isToday = isCurrentMonth && dayNum === today.getDate();
              const isSelected = selectedDay === dayNum;
              const dayTasks = dynamicCalendarTasks[dayNum] || [];

              return (
                <div 
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={cn(
                    "bg-white min-h-[100px] p-2 hover:bg-blue-50/30 cursor-pointer transition-colors border-t border-transparent relative group",
                    isSelected && "ring-2 ring-inset ring-accent z-10",
                    isToday && !isSelected && "bg-blue-50/10"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <span className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ml-1 mt-1 transition-colors",
                      isToday ? "bg-accent text-white" : "text-gray-700 group-hover:text-accent"
                    )}>
                      {dayNum}
                    </span>
                    
                    {/* Dynamic Task Indicators Linked to DB payloads */}
                    <div className="mt-2 space-y-1.5 px-1 py-1">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center text-xs px-2 py-1 rounded bg-gray-50 border border-gray-100 text-gray-600 truncate shadow-sm transition-all group-hover:border-blue-100 group-hover:bg-white"
                          title={t.title}
                        >
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0",
                            t.priority === 'High' ? 'bg-red-500' :
                            t.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                          )} />
                          <span className="truncate">{t.title}</span>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] font-medium text-gray-400 pl-1 mt-1">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Panel - Daily Tasks */}
        <Card className="lg:w-96 flex flex-col p-0 shadow-sm border border-border bg-white rounded-xl overflow-hidden shrink-0">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-accent" />
              {monthNames[month]} {selectedDay}, {year}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} scheduled
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 custom-scrollbar">
            {selectedTasks.length > 0 ? (
              selectedTasks.map((task) => (
                <div 
                  key={task.id}
                  className={cn(
                    "bg-white border p-4 rounded-xl transition-colors group cursor-pointer shadow-sm hover:shadow",
                    task.status === 'Completed' ? "border-green-200 bg-green-50/20" : "border-border hover:border-blue-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={cn(
                        "font-semibold flex-1 pr-3 leading-tight transition-colors",
                         task.status === 'Completed' ? "text-gray-400 line-through" : "text-gray-900 group-hover:text-accent"
                    )}>
                      {task.title}
                    </h4>
                    {getPriorityBadge(task.priority)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-3 space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {task.deadline ? new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Anytime'}
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {task.type}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-80">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="font-semibold text-gray-900">Your day is clear</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
                  No backend mapped tasks scheduled parsing today!
                </p>
              </div>
            )}
          </div>
          
          <div className="p-5 bg-white border-t border-gray-100">
            <button className="w-full flex justify-center items-center px-4 py-2 bg-white border-2 border-dashed border-gray-300 hover:border-accent text-gray-600 hover:text-accent rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Task to this Date
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
