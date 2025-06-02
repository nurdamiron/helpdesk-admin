// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

// Создаем контекст аутентификации
const AuthContext = createContext(null);

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // При загрузке приложения проверяем, есть ли сохраненный пользователь
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Не удалось инициализировать авторизацию');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Функция для входа в систему
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Функция для регистрации пользователя
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для обновления данных пользователя
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw new Error('Пользователь не авторизован');
      
      const data = await authService.updateUser(user.id, userData);
      
      // Обновляем данные в localStorage
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления профиля');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Проверка прав доступа пользователя - с учетом ролей в базе данных
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    // Админ имеет доступ ко всему
    if (user.role === 'admin') return true;
    
    // Support, Manager, Staff имеют доступ как модераторы
    if (['support', 'manager', 'moderator', 'staff'].includes(user.role)) {
      return requiredRole === 'moderator' || requiredRole === 'staff';
    }
    
    // Обычный пользователь имеет доступ только к роли пользователя
    if (user.role === 'user') {
      return requiredRole === 'user';
    }
    
    return false;
  };

  // Проверка конкретных прав доступа
  const hasSpecificPermission = (permission) => {
    if (!user) return false;
    
    // Разные права в зависимости от типа действия
    switch(permission) {
      case 'view_all_tickets':
        return ['admin', 'support', 'manager', 'moderator', 'staff'].includes(user.role);
        
      case 'edit_any_ticket':
        return ['admin', 'support', 'manager', 'moderator'].includes(user.role);
        
      case 'assign_tickets':
        return ['admin', 'support', 'manager', 'moderator'].includes(user.role);
        
      case 'manage_users':
        return user.role === 'admin';
        
      case 'access_reports':
        return ['admin', 'manager'].includes(user.role);
        
      default:
        return false;
    }
  };

  // Значение контекста, которое будет доступно потребителям
  const value = {
    user,
    loading,
    error,
    initialized,
    login,
    logout,
    register,
    updateProfile,
    hasPermission,
    hasSpecificPermission,
    isAuthenticated: !!user && initialized,
    isAdmin: user?.role === 'admin',
    isModerator: ['moderator', 'admin', 'support', 'manager', 'staff'].includes(user?.role),
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста в компонентах
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};