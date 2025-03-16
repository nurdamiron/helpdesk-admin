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

  // Значение контекста, которое будет доступно потребителям
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
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