// src/api/index.js
import axios from 'axios';

// Базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик запросов для добавления данных авторизации
api.interceptors.request.use(
  (config) => {
    // Проверяем, это запрос для админ-панели или для клиентской части
    if (config.url.startsWith('/admin')) {
      // Для админ-панели используем обычный пароль/логин из localStorage
      const adminStr = localStorage.getItem('admin');
      if (adminStr) {
        try {
          const admin = JSON.parse(adminStr);
          
          // Добавляем данные администратора в заголовки
          config.headers['X-Admin-Id'] = admin.id;
          config.headers['X-Admin-Email'] = admin.email;
        } catch (e) {
          console.error('Error parsing admin from localStorage', e);
        }
      }
    } else {
      // Для клиентских запросов используем JWT-токен
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.access) {
            config.headers['Authorization'] = `Bearer ${user.access}`;
          }
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обрабатываем ошибки авторизации
    if (error.response && error.response.status === 401) {
      // Определяем тип запроса
      const isAdminRequest = error.config.url.startsWith('/admin');
      
      if (isAdminRequest) {
        // Очищаем данные администратора
        localStorage.removeItem('admin');
        // Перенаправляем на страницу входа админ-панели
        window.location.href = '/login';
      } else {
        // Обработка для клиентских запросов
        // Проверяем, есть ли refresh токен
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.refresh) {
              // Можно реализовать обновление токена здесь
              // Или просто очистить данные и перенаправить на страницу входа
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          } catch (e) {
            console.error('Error parsing user from localStorage', e);
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        } else {
          // Если нет данных пользователя, просто перенаправляем на вход
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;