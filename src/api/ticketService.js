// src/api/ticketService.js
import { BaseApiService } from './baseApiService';

/**
 * Сервис для работы с заявками 
 * Поддерживает как публичную, так и административную части
 */
class TicketService extends BaseApiService {
  /**
   * Получение списка заявок с возможностью фильтрации
   * @param {Object} options - Параметры фильтрации
   * @param {string} options.status - Статус заявок для фильтрации
   * @param {string} options.priority - Приоритет заявок для фильтрации
   * @param {string} options.assignedTo - ID пользователя, кому назначены заявки
   * @param {string} options.search - Поисковый запрос
   * @returns {Promise<Array>} Массив заявок
   */
  async getTickets(options = {}) {
    // Формируем URL с параметрами запроса
    let url = '/tickets';
    const params = new URLSearchParams();
    
    // Добавляем параметры фильтрации, если они указаны
    if (options.status) params.append('status', options.status);
    if (options.priority) params.append('priority', options.priority);
    if (options.assignedTo) params.append('assignedTo', options.assignedTo);
    if (options.search) params.append('search', options.search);
    
    // Добавляем параметры запроса к URL
    if (params.toString()) {
      url = `${url}?${params.toString()}`;
    }
    
    // Выполняем запрос с указанием требуемой роли
    return this.request({
      method: 'get',
      url,
      requiredRole: null // Доступно для всех авторизованных пользователей
    });
  }
  
  /**
   * Получение публичных заявок (доступно без авторизации)
   * @param {string} searchToken - Токен для поиска заявки (для публичного доступа)
   * @returns {Promise<Array>} Массив публичных заявок
   */
  async getPublicTickets(searchToken = null) {
    let url = '/public/tickets';
    
    // Если указан токен поиска, добавляем его к запросу
    if (searchToken) {
      url = `${url}?token=${searchToken}`;
    }
    
    return this.request({
      method: 'get',
      url,
      requiredRole: null // Доступно всем, даже неавторизованным пользователям
    });
  }
  
  /**
   * Получение заявки по ID
   * @param {string} id - ID заявки
   * @param {boolean} isPublic - Флаг, указывающий на публичный доступ
   * @returns {Promise<Object>} Данные заявки
   */
  async getTicketById(id, isPublic = false) {
    // В зависимости от типа доступа используем разные эндпоинты
    const url = isPublic ? `/public/tickets/${id}` : `/tickets/${id}`;
    
    return this.request({
      method: 'get',
      url,
      requiredRole: isPublic ? null : null // Для админской части требуется авторизация, проверенная в middleware бэкенда
    });
  }
  
  /**
   * Создание новой заявки
   * @param {Object} ticketData - Данные заявки
   * @param {boolean} isPublic - Флаг, указывающий на публичный доступ
   * @returns {Promise<Object>} Созданная заявка
   */
  async createTicket(ticketData, isPublic = false) {
    // В зависимости от типа доступа используем разные эндпоинты
    const url = isPublic ? '/tickets' : '/tickets';
    
    console.log('Creating ticket:', { ticketData, isPublic, url });
    
    return this.request({
      method: 'post',
      url,
      data: ticketData,
      requiredRole: isPublic ? null : null // Для публичной части не требуется роль
    });
  }
  
  /**
   * Обновление заявки
   * @param {string} id - ID заявки
   * @param {Object} ticketData - Новые данные заявки
   * @returns {Promise<Object>} Обновленная заявка
   */
  async updateTicket(id, ticketData) {
    return this.request({
      method: 'put',
      url: `/tickets/${id}`,
      data: ticketData,
      requiredRole: 'staff' // Требуется роль как минимум сотрудника
    });
  }
  
  /**
   * Назначение заявки пользователю
   * @param {string} ticketId - ID заявки
   * @param {string} userId - ID пользователя
   * @returns {Promise<Object>} Обновленная заявка
   */
  async assignTicket(ticketId, userId) {
    return this.request({
      method: 'put',
      url: `/tickets/${ticketId}/assign`,
      data: { assignedTo: userId },
      requiredRole: 'moderator' // Требуется роль как минимум модератора
    });
  }
  
  /**
   * Изменение статуса заявки
   * @param {string} ticketId - ID заявки
   * @param {string} status - Новый статус
   * @param {string} comment - Комментарий к изменению статуса
   * @returns {Promise<Object>} Обновленная заявка
   */
  async changeTicketStatus(ticketId, status, comment = '') {
    return this.request({
      method: 'put',
      url: `/tickets/${ticketId}/status`,
      data: { status, comment },
      requiredRole: 'staff' // Требуется роль как минимум сотрудника
    });
  }
  
  /**
   * Получение списка категорий
   * @returns {Promise<Array>} Массив категорий
   */
  async getCategories() {
    // Возвращаем статичный список категорий, так как бэкенд может не иметь этот endpoint
    return Promise.resolve([
      { id: 'technical', name: 'Техническая проблема' },
      { id: 'billing', name: 'Биллинг и расчеты' },
      { id: 'general', name: 'Общие вопросы' },
      { id: 'it_support', name: 'IT поддержка' },
      { id: 'equipment_issue', name: 'Проблемы с оборудованием' },
      { id: 'software_issue', name: 'Проблемы с ПО' },
      { id: 'access_request', name: 'Запрос доступа' },
      { id: 'complaint', name: 'Жалоба' },
      { id: 'suggestion', name: 'Предложение' },
      { id: 'hr_question', name: 'Вопрос по HR' },
      { id: 'safety_issue', name: 'Вопрос безопасности' },
      { id: 'training_request', name: 'Запрос на обучение' },
      { id: 'policy_question', name: 'Вопрос по политикам' },
      { id: 'other', name: 'Другое' }
    ]);
  }
  
  /**
   * Добавление комментария к заявке
   * @param {string} ticketId - ID заявки
   * @param {string} text - Текст комментария
   * @param {boolean} isPublic - Флаг, указывающий на публичный комментарий
   * @returns {Promise<Object>} Обновленная заявка с комментарием
   */
  async addComment(ticketId, text, isPublic = false) {
    return this.request({
      method: 'post',
      url: `/tickets/${ticketId}/comments`,
      data: { text, isPublic },
      requiredRole: 'staff' // Требуется роль как минимум сотрудника
    });
  }
  
  /**
   * Получение аналитики по заявкам (статистика)
   * @returns {Promise<Object>} Статистика по заявкам
   */
  async getTicketsAnalytics() {
    return this.request({
      method: 'get',
      url: '/tickets/analytics',
      requiredRole: 'moderator' // Требуется роль как минимум модератора
    });
  }
  
  /**
   * Экспорт заявок в CSV
   * @param {Object} filters - Параметры фильтрации
   * @returns {Promise<Blob>} Файл CSV с данными заявок
   */
  async exportTicketsToCSV(filters = {}) {
    // Формируем URL с параметрами запроса
    let url = '/tickets/export';
    const params = new URLSearchParams();
    
    // Добавляем параметры фильтрации, если они указаны
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);
    
    // Добавляем параметры запроса к URL
    if (params.toString()) {
      url = `${url}?${params.toString()}`;
    }
    
    // Используем axios напрямую для получения файла
    return this.request({
      method: 'get',
      url,
      requiredRole: 'moderator' // Требуется роль как минимум модератора
    });
  }
}

export const ticketService = new TicketService();
export default ticketService;