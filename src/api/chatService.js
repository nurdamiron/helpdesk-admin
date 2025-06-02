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
      // Преобразуем тип пользователя для совместимости с бэкендом
      let senderType = messageData.sender_type || 'admin';
      
      // Если прислали 'staff', преобразуем в 'admin' для совместимости с бэкендом
      if (senderType === 'staff') {
        senderType = 'admin';
      }
      
      const payload = {
        content: messageData.content || '',
        sender_type: senderType,
        notify_requester: messageData.sendToEmail || false
      };
      
      // Проверка, если сообщение пустое
      if (!payload.content.trim()) {
        throw new Error('Сообщение должно содержать текст');
      }
      
      console.log('Отправка сообщения с типом отправителя:', payload.sender_type);
      
      // Отправляем запрос
      const response = await api.post(`/tickets/${ticketId}/messages`, payload);
      return response.data.message || response.data;
    } catch (error) {
      console.error(`Error sending message for ticket ${ticketId}:`, error);
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