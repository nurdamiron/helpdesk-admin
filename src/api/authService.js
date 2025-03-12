// src/api/authService.js
import api from './index';

export const authService = {
  // Простая авторизация по email и паролю
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Сохраняем данные пользователя в localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Выход из системы (очистка localStorage)
  logout: () => {
    localStorage.removeItem('user');
  },

  // Получение текущего пользователя из localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  },

  // Получение списка пользователей для назначения ответственных
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};