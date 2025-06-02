// src/api/authService.js
import api from './index';

export const authService = {
  // Авторизация по email и паролю
  login: async (email, password) => {
    try {
      // Запрос к API
      const response = await api.post('/auth/login', { email, password });
      
      // Сохраняем токен и данные пользователя в localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
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
    localStorage.removeItem('token');
  },

  // Получение текущего пользователя из localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  },
  
  // Получение JWT токена из localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Проверка, авторизован ли пользователь
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Регистрация нового пользователя (создание пользователя администратором)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Получение списка пользователей
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Получение данных пользователя по ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Обновление данных пользователя
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      
      // Если обновляем текущего пользователя, обновим данные в localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...currentUser, ...userData };
        // Не сохраняем пароль в localStorage
        if (updatedUser.password) delete updatedUser.password;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Удаление пользователя
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
  
  // Проверка прав доступа по роли
  checkPermission: (user, requiredRole) => {
    if (!user) return false;
    
    // Админ имеет доступ ко всему
    if (user.role === 'admin') return true;
    
    // Support и Manager имеют доступ как модераторы
    if (user.role === 'support' || user.role === 'manager' || user.role === 'moderator') {
      return requiredRole === 'moderator' || requiredRole === 'staff';
    }
    
    // Пользователь имеет доступ только к роли пользователя
    if (user.role === 'user') {
      return requiredRole === 'user';
    }
    
    return false;
  }
};

export default authService;