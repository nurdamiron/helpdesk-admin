// src/api/index.js
import axios from 'axios';

// Определение базового URL для API в зависимости от среды
let API_URL;

// Проверяем режим работы (разработка или продакшн)
if (process.env.NODE_ENV === 'production') {
  // Используем переменную окружения из .env файла, или URL для продакшна по умолчанию
  API_URL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-2.onrender.com/api';
} else {
  // В режиме разработки используем локальный сервер
  API_URL = 'http://localhost:5002/api';
}

console.log(`Using API URL (${process.env.NODE_ENV} mode):`, API_URL);

// Отключить использование мокового сервиса
export const USE_MOCK_DATA = false;

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add CORS settings
  withCredentials: false,
});

// Добавляем перехватчик запросов для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    
    // Если есть токен, добавляем его в заголовок Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 Отправка запроса:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Получен ответ:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Ошибка API:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Если ошибка авторизации (401) или истек токен (403), перенаправляем на страницу входа
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Проверяем, не на странице ли логина мы уже находимся
      if (window.location.pathname !== '/login') {
        // Очищаем localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Сохраняем предыдущий URL для перенаправления после логина
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
        
        // Перенаправляем на страницу входа
        window.location = '/login?session_expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;