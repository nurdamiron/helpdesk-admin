// src/api/adminAuthService.js
import axios from 'axios';

// Base API URL from environment variables or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include admin headers
api.interceptors.request.use(
  (config) => {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        config.headers['X-Admin-Id'] = admin.id;
        config.headers['X-Admin-Email'] = admin.email;
      } catch (err) {
        console.error('Error parsing admin from localStorage:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminAuthService = {
  // Login for admin panel
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      
      // Save admin data in localStorage
      if (response.data && response.data.user) {
        localStorage.setItem('admin', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout (remove admin data from localStorage)
  logout: () => {
    localStorage.removeItem('admin');
  },

  // Get current admin from localStorage
  getCurrentAdmin: () => {
    const adminStr = localStorage.getItem('admin');
    if (!adminStr) return null;
    
    try {
      return JSON.parse(adminStr);
    } catch (e) {
      console.error('Error parsing admin from localStorage:', e);
      return null;
    }
  },

  // Get all users (employees) for admin panel
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Check if user has admin rights
  checkAdmin: async () => {
    try {
      const response = await api.get('/admin/check');
      return response.data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  }
};

export default adminAuthService;