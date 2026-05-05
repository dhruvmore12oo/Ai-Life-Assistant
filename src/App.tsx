import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/Calendar';
import { SettingsPage } from './pages/Settings';
import { UploadPage } from './pages/Upload';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function MockPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500">This page is under construction.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
