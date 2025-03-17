// src/api/chatService.js
import api from './index';

export const chatService = {
  // Получить сообщения для тикета
  getMessages: async (ticketId) => {
    try {
      // Получаем сообщения заявки
      const response = await api.get(`/tickets/${ticketId}/messages`);
      return response.data.messages || response.data;
    } catch (error) {
      console.error(`Error fetching messages for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Отправить новое сообщение
  sendMessage: async (ticketId, messageData) => {
    try {
      // Подготовка данных для отправки
      const payload = {
        body: messageData.body || '',  // Убедимся, что body всегда строка
        attachments: messageData.attachments || [],
        // Добавляем флаг для отправки на email
        notify_email: messageData.sendToEmail || false
      };
      
      // Проверка, если сообщение пустое и нет вложений
      if (!payload.body.trim() && (!payload.attachments || payload.attachments.length === 0)) {
        throw new Error('Сообщение должно содержать текст или вложения');
      }
      
      // Отправляем запрос
      const response = await api.post(`/tickets/${ticketId}/messages`, payload);
      return response.data.message || response.data;
    } catch (error) {
      console.error(`Error sending message for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Загрузить вложение к сообщению
  uploadAttachment: async (ticketId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data.attachment || response.data;
    } catch (error) {
      console.error(`Error uploading attachment for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Получить сведения о собеседнике (клиенте)
  getRequesterInfo: async (requesterId) => {
    try {
      const response = await api.get(`/requesters/${requesterId}`);
      return response.data.requester || response.data;
    } catch (error) {
      console.error(`Error fetching requester info ${requesterId}:`, error);
      throw error;
    }
  },

  // Отметить сообщения как прочитанные
  markMessagesAsRead: async (ticketId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/messages/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking messages as read for ticket ${ticketId}:`, error);
      // Не выбрасываем ошибку, чтобы не блокировать основной функционал
      return { success: false };
    }
  }
};