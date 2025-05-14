// src/api/authService.js
import api from './index';

export const authService = {
  // Авторизация по email и паролю
  login: async (email, password) => {
    try {
      // Для разработки: имитируем ответ сервера с mock-пользователями
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      // Всегда используем настоящие данные API
      // const isDevelopment = false; // Отключаем мок-данные
      if (false) { // Всегда используем API, даже в режиме разработки
        // Проверяем тестовые учетные данные
        const mockUsers = [
          { email: 'admin@example.com', password: 'admin123', role: 'admin', first_name: 'Админ', last_name: 'Системы', id: 1 },
          { email: 'support@example.com', password: 'support123', role: 'support', first_name: 'Поддержка', last_name: 'Клиентов', id: 2 },
          { email: 'manager@example.com', password: 'manager123', role: 'manager', first_name: 'Менеджер', last_name: 'Отдела', id: 3 },
          { email: 'user@example.com', password: 'user123', role: 'user', first_name: 'Обычный', last_name: 'Пользователь', id: 4 }
        ];
        
        // Находим пользователя по email и password
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          console.log('Mock login success:', user);
          
          // Имитируем задержку запроса
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Возвращаем успешный ответ
          const responseData = {
            status: 'success',
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          };
          
          // Имитируем JWT токен для разработки, включая в него роль пользователя
          const role = user.role || 'user';
          const mockToken = `mock-jwt-token-${role}-` + Math.random().toString(36).substring(2);
          responseData.token = mockToken;
          
          // Сохраняем токен и данные пользователя в localStorage
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          
          return responseData;
        } else {
          // Имитируем задержку запроса
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Имитируем ошибку аутентификации
          const error = new Error('Неверные учетные данные');
          error.response = {
            status: 401,
            data: {
              status: 'error',
              error: 'Неверный email или пароль'
            }
          };
          throw error;
        }
      } else {
        // В реальном приложении: запрос к API
        const response = await api.post('/auth/login', { email, password });
        
        // Сохраняем токен и данные пользователя в localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      }
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