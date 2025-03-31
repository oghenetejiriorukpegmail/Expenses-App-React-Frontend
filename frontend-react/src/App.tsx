import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Page Components
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import TripsPage from './pages/TripsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  const { user, isLoading, logout } = useAuth();
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved theme
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Effect to apply the theme class to HTML element and save preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  // NavLink styling function (updated for dark mode)
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-md py-sm rounded-lg transition-all duration-300 ease-in-out flex items-center group ${
      isActive
        ? 'bg-primary text-white shadow-md scale-105'
        : 'text-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary-light hover:bg-primary-bg dark:hover:bg-dark-card-bg' // Added dark mode variants
    }`;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed in App:", error);
    }
  };

  if (isLoading) {
     return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-bg to-secondary-bg dark:from-dark-background dark:to-gray-800">Loading Application...</div>; // Added dark mode loading bg
  }

  const defaultPath = user ? "/dashboard" : "/login";

  return (
    // Apply dark mode background
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background font-sans">
      {/* Navigation Bar */}
      <nav className="bg-gradient-primary shadow-lg mb-xl sticky top-0 z-sticky">
        <div className="container mx-auto px-md py-sm flex justify-between items-center">
          <Link to={defaultPath} className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
            ExpenseApp
          </Link>
          <ul className="flex space-x-sm items-center">
             {/* Theme Toggle Button */}
             <li>
               <button
                 onClick={toggleTheme}
                 className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                 title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
               >
                 {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
               </button>
             </li>

            {user ? (
              <>
                 <li>
                  <NavLink to="/dashboard" className={getNavLinkClass}>
                    <i className="fas fa-tachometer-alt mr-xs"></i> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/expenses" className={getNavLinkClass}>
                    <i className="fas fa-receipt mr-xs"></i> Expenses
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/trips" className={getNavLinkClass}>
                    <i className="fas fa-route mr-xs"></i> Trips
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/settings" className={getNavLinkClass}>
                    <i className="fas fa-cog mr-xs"></i> Settings
                  </NavLink>
                </li>
                 <li>
                   <button onClick={handleLogout} className="px-md py-sm rounded-lg text-danger-dark bg-danger-bg hover:bg-danger hover:text-white transition-all duration-300 ease-in-out flex items-center group shadow-sm hover:shadow-md dark:bg-dark-card-bg dark:text-danger-light dark:hover:bg-danger dark:hover:text-white"> {/* Dark mode logout button */}
                     <i className="fas fa-sign-out-alt mr-xs group-hover:animate-pulse"></i> Logout ({user.username})
                   </button>
                 </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={getNavLinkClass}>
                    Login
                  </NavLink>
                </li>
                 <li>
                  <NavLink to="/register" className={getNavLinkClass}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto p-md">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Redirect root path */}
          <Route path="/" element={<Navigate to={defaultPath} replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={defaultPath} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;