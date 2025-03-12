// src/api/ticketService.js
import api from './index';

export const ticketService = {
  // Получить список всех заявок
  getTickets: async (filters = {}) => {
    try {
      // Преобразуем объект фильтров в строку запроса
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/tickets${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Получить детальную информацию о заявке
  getTicket: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      throw error;
    }
  },

  // Обновить заявку
  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      throw error;
    }
  },

  // Создать новую заявку
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Получить историю изменений заявки
  getTicketHistory: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}/history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket history for ticket ${id}:`, error);
      throw error;
    }
  },

  // Добавить внутренний комментарий к заявке
  addInternalNote: async (id, noteData) => {
    try {
      const response = await api.post(`/tickets/${id}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Error adding note to ticket ${id}:`, error);
      throw error;
    }
  },

  // Загрузить файл к заявке
  uploadFile: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/tickets/${id}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading file to ticket ${id}:`, error);
      throw error;
    }
  },

  // Удалить файл из заявки
  deleteFile: async (ticketId, fileId) => {
    try {
      const response = await api.delete(`/tickets/${ticketId}/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting file ${fileId} from ticket ${ticketId}:`, error);
      throw error;
    }
  }
};