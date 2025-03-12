// src/contexts/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import adminAuthService from '../api/adminAuthService';

// Create the context
const AdminAuthContext = createContext(null);

// Provider component
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is logged in on component mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentAdmin = adminAuthService.getCurrentAdmin();
        if (currentAdmin) {
          setAdmin(currentAdmin);
          
          // Verify admin status with backend
          try {
            await adminAuthService.checkAdmin();
          } catch (err) {
            // If there's an error with the admin validation, log them out
            console.error('Admin validation failed:', err);
            adminAuthService.logout();
            setAdmin(null);
          }
        }
      } catch (err) {
        console.error('Error initializing admin auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await adminAuthService.login(email, password);
      setAdmin(data.user);
      return data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    adminAuthService.logout();
    setAdmin(null);
  };

  // Context value
  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// Custom hook for using the context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};