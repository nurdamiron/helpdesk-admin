// src/api/ticketService.js
import api from './index';

/**
 * Единый сервис для работы с заявками как в клиентской, так и в административной части
 */
export const ticketService = {
  /**
   * Получение всех заявок с опциональной фильтрацией
   * @param {Object} filters - Фильтры для запроса
   * @returns {Promise<Object>} - Ответ с данными заявок
   */
  getTickets: async (filters = {}) => {
    try {
      console.log('Запрос списка заявок с фильтрами:', filters);
      
      const response = await api.get('/tickets', { params: filters });
      
      console.log('Ответ API для списка заявок:', response.data);
      
      // Стандартизация формата ответа
      if (response.data.data) {
        // Если ответ содержит data.data (вложенный объект)
        return response.data;
      } else if (Array.isArray(response.data)) {
        // Если ответ - просто массив
        return { 
          data: response.data,
          total: response.data.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: Math.ceil(response.data.length / (filters.limit || 10))
        };
      } else {
        // Любой другой формат
        return response.data;
      }
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    }
  },
  
  /**
   * Получение заявки по ID
   * @param {string|number} id - ID заявки
   * @returns {Promise<Object>} - Данные заявки
   */
  getTicketById: async (id) => {
    try {
      console.log(`Запрос заявки #${id}`);
      
      const response = await api.get(`/tickets/${id}`);
      
      console.log(`Получены данные заявки #${id}:`, response.data);
      
      // Стандартизация формата ответа
      if (response.data && response.data.ticket) {
        return response.data;
      } else if (response.data) {
        // Если данные есть, но нет вложенного объекта 'ticket'
        return { ticket: response.data };
      } else {
        throw new Error('Некорректный формат данных от API');
      }
    } catch (error) {
      console.error(`Ошибка при загрузке заявки #${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Создание новой заявки
   * @param {Object} ticketData - Данные для создания заявки
   * @returns {Promise<Object>} - Созданная заявка
   */
  createTicket: async (ticketData) => {
    try {
      console.log('Создание новой заявки:', ticketData);
      
      const response = await api.post('/tickets', ticketData);
      
      console.log('Ответ API при создании заявки:', response.data);
      
      // Стандартизация формата ответа
      if (response.data && response.data.ticket) {
        return response.data;
      } else if (response.data) {
        return { ticket: response.data };
      }
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании заявки:', error);
      throw error;
    }
  },
  
  /**
   * Обновление заявки
   * @param {string|number} id - ID заявки
   * @param {Object} ticketData - Данные для обновления
   * @returns {Promise<Object>} - Обновленная заявка
   */
  updateTicket: async (id, ticketData) => {
    try {
      console.log(`Обновление заявки #${id}:`, ticketData);
      
      const response = await api.put(`/tickets/${id}`, ticketData);
      
      console.log(`Ответ API при обновлении заявки #${id}:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении заявки #${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Обновление статуса заявки
   * @param {string|number} id - ID заявки
   * @param {string} status - Новый статус
   * @returns {Promise<Object>} - Результат операции
   */
  updateTicketStatus: async (id, status) => {
    try {
      console.log(`Обновление статуса заявки #${id} на "${status}"`);
      
      return ticketService.updateTicket(id, { status });
    } catch (error) {
      console.error(`Ошибка при обновлении статуса заявки #${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Удаление заявки
   * @param {string|number} id - ID заявки
   * @returns {Promise<Object>} - Результат операции
   */
  deleteTicket: async (id) => {
    try {
      console.log(`Удаление заявки #${id}`);
      
      const response = await api.delete(`/tickets/${id}`);
      
      console.log(`Ответ API при удалении заявки #${id}:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении заявки #${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Получение истории заявки
   * @param {string|number} ticketId - ID заявки
   * @returns {Promise<Array>} - История заявки
   */
  getTicketHistory: async (ticketId) => {
    try {
      console.log(`Запрос истории заявки #${ticketId}`);
      
      const response = await api.get(`/tickets/${ticketId}/history`);
      
      console.log(`Ответ API для истории заявки #${ticketId}:`, response.data);
      
      return response.data.history || [];
    } catch (error) {
      console.error(`Ошибка при загрузке истории заявки #${ticketId}:`, error);
      return [];
    }
  },
  
  /**
   * Добавление внутренней заметки
   * @param {string|number} ticketId - ID заявки
   * @param {Object} noteData - Данные заметки
   * @returns {Promise<Object>} - Созданная заметка
   */
  addInternalNote: async (ticketId, noteData) => {
    try {
      console.log(`Добавление заметки к заявке #${ticketId}:`, noteData);
      
      const response = await api.post(`/tickets/${ticketId}/notes`, noteData);
      
      console.log(`Ответ API при добавлении заметки к заявке #${ticketId}:`, response.data);
      
      return response.data.note || response.data;
    } catch (error) {
      console.error(`Ошибка при добавлении заметки к заявке #${ticketId}:`, error);
      throw error;
    }
  },
  
  /**
   * Загрузка файла к заявке
   * @param {string|number} ticketId - ID заявки
   * @param {File} file - Файл для загрузки
   * @returns {Promise<Object>} - Данные загруженного файла
   */
  uploadFile: async (ticketId, file) => {
    try {
      console.log(`Загрузка файла к заявке #${ticketId}`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log(`Ответ API при загрузке файла к заявке #${ticketId}:`, response.data);
      
      return response.data.attachment || response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке файла к заявке #${ticketId}:`, error);
      throw error;
    }
  },
  
  /**
   * Удаление файла
   * @param {string|number} ticketId - ID заявки
   * @param {string|number} fileId - ID файла
   * @returns {Promise<Object>} - Результат операции
   */
  deleteFile: async (ticketId, fileId) => {
    try {
      console.log(`Удаление файла #${fileId} из заявки #${ticketId}`);
      
      const response = await api.delete(`/tickets/${ticketId}/attachments/${fileId}`);
      
      console.log(`Ответ API при удалении файла #${fileId} из заявки #${ticketId}:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении файла #${fileId} из заявки #${ticketId}:`, error);
      throw error;
    }
  }
};

export default ticketService;