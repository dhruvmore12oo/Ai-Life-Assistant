import { Search, Bell, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-accent transition-colors duration-200" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-border rounded-lg leading-5 bg-background placeholder-gray-400 text-sidebar focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent sm:text-sm transition-all duration-300 ease-in-out"
            placeholder="Search tasks, reminders, documents..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-6 pl-4 border-l border-border">
        <button className="relative p-2 text-gray-500 hover:text-sidebar transition-colors rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/20">
          <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 ring-offset-2 transition-shadow"
          >
            <div className="h-9 w-9 rounded-full bg-blue-50 text-accent flex items-center justify-center ring-2 ring-white shadow-sm overflow-hidden border border-blue-100">
              <User className="h-5 w-5" />
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-border z-20">
              <button 
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out securely
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
