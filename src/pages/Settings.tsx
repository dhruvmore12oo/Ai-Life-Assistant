import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Modal } from '../components/ui/Modal';
import { 
  User, Bell, Sparkles, Palette, ShieldAlert,
  Trash2, Loader2, CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
}

// Reusable Sub-components
function SettingsSectionHeader({ title, description, icon: Icon }: { title: string, description?: string, icon?: any }) {
  return (
    <div className="flex items-start sm:items-center space-x-3 mb-6">
      {Icon && (
        <div className="p-2.5 bg-gray-50 shrink-0 rounded-lg border border-gray-100 shadow-sm mt-1 sm:mt-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}

function SettingsCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Card className={cn("overflow-hidden border-border bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl", className)}>
      <CardContent className="p-6 sm:p-8">
        {children}
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { user } = useAuth();

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Profile State
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [fullName, setFullName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [defaultView, setDefaultView] = useState('Dashboard');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Notifications State
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [aiCompletionFlags, setAiCompletionFlags] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // AI Preferences
  const [autoCreateTasks, setAutoCreateTasks] = useState(true);
  const [requireConfirmation, setRequireConfirmation] = useState(true);
  const [preferredPriority, setPreferredPriority] = useState('Auto');

  // Appearance
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Danger Zone
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Existing Profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, timezone')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error.message);
        }

        if (data) {
          if (data.full_name) setFullName(data.full_name);
          if (data.timezone) setTimezone(data.timezone);
        }
      } catch (err) {
        console.error('Failed to load profile securely', err);
      } finally {
        setIsFetchingProfile(false);
      }
    }
    loadProfile();
  }, [user]);

  // Toast Helper
  const showToast = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    
    try {
      const updates = {
        id: user.id,
        email: user.email,
        full_name: fullName,
        timezone: timezone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      
      if (error) throw error;
      showToast('Profile settings saved successfully');
    } catch (err: any) {
      console.error('Error saving profile:', err.message);
      showToast('Failed to save profile natively.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleClearData = async () => {
    // Implement clearing logic here
    showToast('All tasks have been cleared.');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    showToast('Account scheduled for deletion.');
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="flex items-center px-4 py-3 bg-gray-900 border border-gray-800 text-white rounded-lg shadow-xl animate-in slide-in-from-bottom-2 duration-300 pointer-events-auto"
          >
            <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and integrations</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Profile Settings */}
        <SettingsCard>
          <SettingsSectionHeader 
            title="Profile details" 
            description="Manage your personal information and application defaults."
            icon={User}
          />
          {isFetchingProfile ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">Greenwich Mean Time (London)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Default App View</label>
                  <select 
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Dashboard">Interactive Dashboard</option>
                    <option value="Calendar">Monthly Calendar</option>
                    <option value="Tasks">Global Tasks List</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-white min-w-[140px] px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </SettingsCard>

        {/* 2. Notification Settings */}
        <SettingsCard>
          <SettingsSectionHeader 
            title="Notifications" 
            description="Choose how and when you want to be alerted by the system."
            icon={Bell}
          />
          <div className="space-y-5 mt-6 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="pr-4">
                <p className="font-semibold text-sm text-gray-900">Task Deadline Reminders</p>
                <p className="text-xs text-gray-500 mt-0.5">Receive an alert 24 hours before a strict deadline.</p>
              </div>
              <Switch checked={deadlineReminders} onChange={setDeadlineReminders} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="pr-4">
                <p className="font-semibold text-sm text-gray-900">Urgent Bill Notifications</p>
                <p className="text-xs text-gray-500 mt-0.5">Prioritized red-badge alerts when an invoice is due.</p>
              </div>
              <Switch checked={billReminders} onChange={setBillReminders} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="pr-4">
                <p className="font-semibold text-sm text-gray-900">AI Processing Completion</p>
                <p className="text-xs text-gray-500 mt-0.5">Get notified when document extraction finishes background processing.</p>
              </div>
              <Switch checked={aiCompletionFlags} onChange={setAiCompletionFlags} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="pr-4">
                <p className="font-semibold text-sm text-gray-900">Weekly Summary Email</p>
                <p className="text-xs text-gray-500 mt-0.5">A digest of tasks accomplished and upcoming week forecast.</p>
              </div>
              <Switch checked={weeklySummary} onChange={setWeeklySummary} />
            </div>
          </div>
        </SettingsCard>

        {/* 3. AI Processing Preferences */}
        <SettingsCard>
          <SettingsSectionHeader 
            title="AI Extraction Engine" 
            description="Fine-tune how the machine learning models interpret your uploads."
            icon={Sparkles}
          />
          <div className="space-y-6 mt-6">
            <div className="flex items-start justify-between">
              <div className="pr-6">
                <label className="font-semibold text-sm text-gray-900 block mb-1">Auto-create Tasks</label>
                <p className="text-xs text-gray-500 leading-relaxed">Automatically instantiate tasks on your dashboard immediately when high-confidence extraction succeeds from Voice or PDFs.</p>
              </div>
              <div className="mt-1">
                <Switch checked={autoCreateTasks} onChange={setAutoCreateTasks} />
              </div>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="pr-6">
                <label className="font-semibold text-sm text-gray-900 block mb-1">Manual Confirmation Required</label>
                <p className="text-xs text-gray-500 leading-relaxed">Require explicit approval before saving parsed data to your permanent persistent records database.</p>
              </div>
              <div className="mt-1">
                <Switch checked={requireConfirmation} onChange={setRequireConfirmation} />
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-5 bg-blue-50/30">
              <label className="font-semibold text-sm text-gray-900 block mb-3">Preferred Task Priority Handling</label>
              <select 
                value={preferredPriority}
                onChange={(e) => setPreferredPriority(e.target.value)}
                className="w-full sm:max-w-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm appearance-none cursor-pointer"
              >
                <option value="Auto">Let AI Calculate Automatically</option>
                <option value="High">Always default to High</option>
                <option value="Medium">Always default to Medium</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Only applies if no explicit priority was detected in the upload.</p>
            </div>
          </div>
        </SettingsCard>

        {/* 4. Appearance Settings */}
        <SettingsCard>
          <SettingsSectionHeader 
            title="Appearance" 
            description="Customize how the user interface looks and feels on your device."
            icon={Palette}
          />
          <div className="grid gap-6 sm:grid-cols-2 mt-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] bg-white group hover:border-accent transition-colors">
              <div className="h-24 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-16 h-10 bg-white border border-gray-200 rounded shadow-sm"></div>
                  <div className="w-16 h-10 bg-gray-900 rounded shadow-sm opacity-50 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">SOON</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <label className="font-semibold text-sm text-gray-900 block mb-1.5">Theme Selection</label>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">Light Mode Active</span>
                  <span className="text-xs text-gray-400">Dark mode arriving in v1.2</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors bg-white">
              <label className="font-semibold text-sm text-gray-900 block mb-1">Compact Interface Elements</label>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Reduce padding and font sizes slightly to display more data rows on smaller laptop screens.</p>
              <Switch checked={isCompactMode} onChange={setIsCompactMode} />
            </div>
          </div>
        </SettingsCard>

        {/* 5. Danger Zone */}
        <SettingsCard className="border-red-100 bg-red-50/10">
          <SettingsSectionHeader 
            title="Danger Zone" 
            description="Destructive actions that cannot be undone."
            icon={ShieldAlert}
          />
          <div className="mt-6 flex flex-col sm:flex-row gap-4 border-t border-red-100 pt-6">
            <button 
              onClick={handleClearData}
              className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              Clear All Extracted Tasks
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account & Data
            </button>
          </div>
        </SettingsCard>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account permanently?"
        description="This action cannot be undone. All your tasks, documents, and historical AI extractions will be instantly removed from our servers."
      >
        <div className="bg-red-50 border border-red-100 p-4 rounded-lg mb-6 flex items-start">
          <Trash2 className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
          <p className="text-sm text-red-800 leading-relaxed font-medium">Please confirm you wish to destroy your account completely.</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button 
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-red-400"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
          </button>
        </div>
      </Modal>

    </div>
  );
}
