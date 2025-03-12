// src/api/chatService.js
import api from './index';

export const chatService = {
  // Получить сообщения для тикета
  getMessages: async (ticketId) => {
    try {
      // Судя по вашей схеме БД, нам нужно сначала найти conversation_id
      // связанный с этим тикетом, а затем запросить сообщения
      const response = await api.get(`/tickets/${ticketId}/messages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Отправить новое сообщение
  sendMessage: async (ticketId, messageData) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/messages`, messageData);
      return response.data;
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
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading attachment for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Получить сведения о собеседнике (клиенте)
  getRequesterInfo: async (requesterId) => {
    try {
      const response = await api.get(`/requesters/${requesterId}`);
      return response.data;
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