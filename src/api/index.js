// src/api/index.js
import axios from 'axios';
import { API_URL } from '../config/api';

console.log(`Using API URL (${process.env.NODE_ENV} mode):`, API_URL);

// Отключить использование мокового сервиса
export const USE_MOCK_DATA = false;

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Добавляем мобильные заголовки
    'User-Agent': navigator.userAgent || 'HelpDesk Mobile Client',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // CORS настройки для мобильных
  withCredentials: false,
  timeout: 30000, // 30 секунд таймаут для медленных мобильных сетей
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
    // Детальная диагностика ошибок для мобильных
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      network: navigator.onLine ? 'online' : 'offline',
      userAgent: navigator.userAgent
    };
    
    console.error('❌ Ошибка API:', errorInfo);
    
    // Специальная обработка сетевых ошибок на мобильных
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        console.error('🔥 Мобильная сетевая ошибка:', {
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
          headers: error.config?.headers
        });
        
        // Создаем более понятную ошибку для мобильных
        const mobileError = new Error('Не удается подключиться к серверу. Проверьте интернет-соединение.');
        mobileError.isMobileNetworkError = true;
        mobileError.originalError = error;
        return Promise.reject(mobileError);
      }
    }
    
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