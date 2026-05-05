import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  CheckSquare, 
  CalendarDays, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Upload', path: '/upload', icon: Upload },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "relative flex flex-col h-screen text-gray-100 transition-all duration-300 ease-in-out border-r border-[#4B5563] shadow-lg",
        isCollapsed ? "w-20" : "w-64"
      )}
      style={{ backgroundColor: '#374151' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#4B5563]/50 min-h-[4rem]">
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <div className="p-2 bg-accent/20 rounded-lg shrink-0">
            <Bot className="w-6 h-6 text-[#60A5FA]" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-lg tracking-wide text-white transition-opacity duration-300">
              AI Life Admin
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1.5 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center py-2.5 px-3 rounded-md transition-all duration-200 group text-gray-300 hover:text-white hover:bg-[#4B5563]/80",
                  isActive && "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm font-medium"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-colors", 
                  // isActive handling is implicit since parent group sets text colors, but we ensure it overrides if needed.
                )} />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#4B5563]/50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#4B5563]/80 transition-all duration-200"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
