import api from './index';
import axios from 'axios';
// Remove the circular dependency
// We'll get authService instance from params

/**
 * Базовый класс для API-сервисов
 * Содержит общую логику обработки ошибок и проверки прав доступа
 */
export class BaseApiService {
  // Ссылка на обработчик ошибок, которая будет установлена из компонента
  static errorHandler = null;
  
  // Кэш для проверки доступности локального сервера
  static localServerAvailable = null;
  static lastLocalServerCheck = 0;
  static LOCAL_SERVER_CHECK_INTERVAL = 5000; // Проверяем каждые 5 секунд
  
  /**
   * Устанавливает обработчик ошибок для всех сервисов API
   * @param {Object} handler - Обработчик ошибок
   */
  static setErrorHandler(handler) {
    BaseApiService.errorHandler = handler;
  }
  
  /**
   * Проверка доступности локального сервера
   */
  static async checkLocalServer() {
    const now = Date.now();
    
    // Используем кэш, если проверка была недавно
    if (BaseApiService.localServerAvailable !== null && 
        now - BaseApiService.lastLocalServerCheck < BaseApiService.LOCAL_SERVER_CHECK_INTERVAL) {
      return BaseApiService.localServerAvailable;
    }
    
    try {
      console.log('🔍 Checking local server at http://localhost:5002/health');
      const response = await axios.get('http://localhost:5002/health', { 
        timeout: 1000,
        validateStatus: () => true 
      });
      BaseApiService.localServerAvailable = response.status === 200;
      BaseApiService.lastLocalServerCheck = now;
      
      if (BaseApiService.localServerAvailable) {
        console.log('🟢 Local server is available');
      } else {
        console.log(`🔴 Local server returned status: ${response.status}`);
      }
      
      return BaseApiService.localServerAvailable;
    } catch (error) {
      console.log('🔴 Local server is not available:', error.message);
      BaseApiService.localServerAvailable = false;
      BaseApiService.lastLocalServerCheck = now;
      return false;
    }
  }
  
  /**
   * Проверяем, находимся ли мы в режиме разработки
   */
  static isDevelopmentMode() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    return (hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173';
  }

  /**
   * Выполняет запрос с обработкой ошибок и проверкой прав
   * @param {Object} options - Параметры запроса
   * @param {string} options.method - HTTP метод (get, post, put, delete)
   * @param {string} options.url - URL запроса
   * @param {Object} options.data - Данные для отправки
   * @param {string|null} options.requiredRole - Необходимая роль для выполнения запроса
   * @param {number} options.retries - Количество повторных попыток (по умолчанию 1)
   * @param {Object} options.errorOptions - Опции для обработчика ошибок
   * @param {Object} options.authService - Сервис аутентификации (для избежания циклической зависимости)
   * @returns {Promise} - Результат запроса
   */
  async request({ method, url, data = null, requiredRole = null, retries = 1, errorOptions = {}, authService = null }) {
    console.log(`🔄 Making API request: ${method.toUpperCase()} ${url}`);
    
    // Проверяем права доступа, если указана необходимая роль
    if (requiredRole && authService) {
      const user = authService.getCurrentUser();
      if (!user || !authService.checkPermission(user, requiredRole)) {
        const error = new Error('Недостаточно прав для выполнения этой операции');
        
        // Используем обработчик ошибок, если он доступен
        if (BaseApiService.errorHandler) {
          return BaseApiService.errorHandler.handleApiError(error, errorOptions);
        }
        
        throw error;
      }
    }

    const isDev = BaseApiService.isDevelopmentMode();
    
    // В режиме разработки всегда пробуем локальный сервер первым
    if (isDev) {
      const localAvailable = await BaseApiService.checkLocalServer();
      
      if (localAvailable) {
        try {
          const localInstance = axios.create({
            baseURL: 'http://localhost:5002/api',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
            }
          });
          
          let response;
          
          switch (method.toLowerCase()) {
            case 'get':
              response = await localInstance.get(url);
              break;
            case 'post':
              response = await localInstance.post(url, data);
              break;
            case 'put':
              response = await localInstance.put(url, data);
              break;
            case 'delete':
              response = await localInstance.delete(url);
              break;
            default:
              throw new Error(`Неподдерживаемый метод: ${method}`);
          }
          
          console.log(`✅ Local server response for ${url}`);
          return response.data;
        } catch (localError) {
          console.log(`⚠️ Local server error for ${url}:`, localError.message);
          console.log('Response status:', localError.response?.status);
          console.log('Response data:', localError.response?.data);
          
          // В режиме разработки НЕ переключаемся на production при ошибках сервера
          // Только при недоступности сервера (сетевые ошибки)
          if (localError.response) {
            // Это ошибка сервера (4xx, 5xx), не сетевая ошибка
            console.log('💡 Server error detected, staying on local server in dev mode');
            throw localError; // Пробрасываем ошибку как есть
          }
          
          console.log('🔄 Network error detected, trying production server as fallback...');
          // Продолжаем с production сервером только при сетевых ошибках
        }
      } else {
        console.log('🔄 Local server unavailable in dev mode, using production fallback...');
      }
    }
    
    // Используем production сервер (или в production режиме, или как fallback в dev)
    try {
      let response;
      
      // Выполняем запрос в зависимости от метода
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url);
          break;
        case 'post':
          response = await api.post(url, data);
          break;
        case 'put':
          response = await api.put(url, data);
          break;
        case 'delete':
          response = await api.delete(url);
          break;
        default:
          throw new Error(`Неподдерживаемый метод: ${method}`);
      }
      
      return response.data;
    } catch (error) {
      // Логируем ошибку для отладки
      console.error(`❌ API Error for ${url}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          method: method,
          url: url,
          baseURL: error.config?.baseURL
        }
      });
      
      // Ошибки аутентификации обрабатываются в axios interceptor
      // Здесь просто передаем ошибку дальше
      
      // Повторные попытки, если они указаны
      if (retries > 0 && !error.response) {
        // Повторяем запрос только при ошибках сети, а не при ошибках сервера
        console.log(`Повторная попытка запроса (осталось ${retries})`);
        return this.request({ 
          method, 
          url, 
          data, 
          requiredRole, 
          retries: retries - 1,
          errorOptions,
          authService
        });
      }
      
      // Используем обработчик ошибок, если он доступен
      if (BaseApiService.errorHandler) {
        return Promise.reject(BaseApiService.errorHandler.handleApiError(error, errorOptions));
      }
      
      // Стандартная обработка ошибок, если обработчик недоступен
      const errorMessage = error.response?.data?.error || error.message || 'Произошла неизвестная ошибка';
      throw new Error(errorMessage);
    }
  }
}

export default new BaseApiService(); 