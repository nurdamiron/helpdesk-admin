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
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Добавляем данные пользователя в заголовки
        config.headers['X-User-Id'] = user.id;
        config.headers['X-User-Email'] = user.email;
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
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
      // Очищаем данные пользователя
      localStorage.removeItem('user');
      // Перенаправляем на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;