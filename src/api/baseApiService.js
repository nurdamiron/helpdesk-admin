import api from './index';
// Remove the circular dependency
// We'll get authService instance from params

/**
 * Базовый класс для API-сервисов
 * Содержит общую логику обработки ошибок и проверки прав доступа
 */
export class BaseApiService {
  // Ссылка на обработчик ошибок, которая будет установлена из компонента
  static errorHandler = null;
  
  /**
   * Устанавливает обработчик ошибок для всех сервисов API
   * @param {Object} handler - Обработчик ошибок
   */
  static setErrorHandler(handler) {
    BaseApiService.errorHandler = handler;
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