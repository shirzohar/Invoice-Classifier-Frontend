// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';

// A wrapper to protect routes that require authentication
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

// Handles route rendering and conditional header display
function AppContent() {
  const location = useLocation();
  const { username, isLoading } = useAuth(); // Getting auth state from context

  // Pages where the header should not be shown
  const hideHeaderPaths = ['/login', '/register'];
  const showHeader = !isLoading && username && !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {/* Display header only when user is logged in and not on login/register pages */}
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

// Top-level app component with AuthProvider and router setup
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
