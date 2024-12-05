import { Routes, Route, Navigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserNav } from '@/components/UserNav';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {user && (
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Receipt className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">SubTrackr</h1>
              </div>
              <p className="text-muted-foreground hidden sm:block">
                Welcome, <span className="text-foreground font-medium">{user.user_metadata.full_name || user.email}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
        )}

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthForm />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;