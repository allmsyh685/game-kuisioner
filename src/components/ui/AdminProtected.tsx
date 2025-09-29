'use client';

import { useState, useEffect, ReactNode } from 'react';
import PasskeyAuth from './PasskeyAuth';
import { LogOut } from 'lucide-react';

interface AdminProtectedProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminProtected({ children, title, description }: AdminProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('adminAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when passkey is entered in another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuthenticated' && e.newValue === 'true') {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically to catch sessionStorage changes
    const interval = setInterval(checkAuth, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleAuthSuccess = () => {
    // Update local state immediately
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    // Redirect to admin main page
    window.location.href = '/admin';
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Show passkey authentication if not authenticated
  if (!isAuthenticated) {
    return <PasskeyAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title || 'Panel Admin'}</h1>
            <p className="text-gray-600">{description || 'Kelola data dan pengaturan'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
} 