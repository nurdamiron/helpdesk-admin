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
      // Добавляем флаг для отправки на email, если он указан
      const payload = {
        ...messageData,
        notify_email: messageData.sendToEmail || false
      };
      
      // Удаляем вспомогательный флаг
      if (payload.sendToEmail) {
        delete payload.sendToEmail;
      }
      
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
      
      const response = await api.post(`/tickets/${ticketId}/messages/attachments`, formData, {
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
      throw error;
    }
  }
};