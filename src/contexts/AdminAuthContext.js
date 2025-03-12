// src/contexts/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '../api/adminAuthService';

// Создаем контекст админ-авторизации
const AdminAuthContext = createContext(null);

// Провайдер контекста
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // При загрузке приложения проверяем, есть ли сохраненный администратор
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentAdmin = adminAuthService.getCurrentAdmin();
        setAdmin(currentAdmin);
      } catch (err) {
        console.error('Error initializing admin auth:', err);
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
      const data = await adminAuthService.login(email, password);
      setAdmin(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = () => {
    adminAuthService.logout();
    setAdmin(null);
  };

  // Значение контекста, которое будет доступно потребителям
  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// Хук для использования контекста в компонентах
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth должен использоваться внутри AdminAuthProvider');
  }
  return context;
};