// src/api/adminAuthService.js
import api from './index';

export const adminAuthService = {
  // Простая авторизация для админ-панели без JWT
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      
      // Сохраняем данные администратора в localStorage
      if (response.data.user) {
        localStorage.setItem('admin', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Выход из системы (очистка localStorage)
  logout: () => {
    localStorage.removeItem('admin');
  },

  // Получение текущего администратора из localStorage
  getCurrentAdmin: () => {
    const adminStr = localStorage.getItem('admin');
    if (!adminStr) return null;
    
    try {
      return JSON.parse(adminStr);
    } catch (e) {
      console.error('Error parsing admin from localStorage', e);
      return null;
    }
  },

  // Получение списка пользователей системы для админ-панели
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};