// src/api/ticketService.js
import axios from 'axios';
import { mockTicketService } from './mockTicketService';

// Base API URL from environment variables or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add admin auth headers to requests
api.interceptors.request.use(
  (config) => {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        config.headers['X-Admin-Id'] = admin.id;
        config.headers['X-Admin-Email'] = admin.email;
      } catch (err) {
        console.error('Error parsing admin data:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to determine if we should use mock data
// Set to true to always use mock data, or false to only use it when API fails
const ALWAYS_USE_MOCK = false;

export const ticketService = {
  // Get all tickets with optional filtering
  // src/api/ticketService.js

// Только часть метода getTickets - обновите его в вашем файле
getTickets: async (filters = {}) => {
  try {
    console.log('Запрос списка тикетов с фильтрами:', filters);
    
    // Получаем реальные данные из API
    const response = await api.get('/tickets', { params: filters });
    
    console.log('Ответ API для списка тикетов:', response.data);
    
    // Обработка различных форматов ответа
    if (response.data.data) {
      // Если ответ содержит data.data (некоторые API возвращают данные в таком формате)
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
    console.error('Ошибка при получении списка тикетов:', error);
    // Если нам нужен запасной вариант
    throw error;
  }
},
  
  // Get ticket by ID
  // src/api/ticketService.js - метод getTicketById
getTicketById: async (id) => {
  try {
    // Получаем данные тикета из API
    const response = await api.get(`/tickets/${id}`);
    
    // Проверяем формат ответа и извлекаем данные тикета
    if (response.data && response.data.ticket) {
      return response.data.ticket;
    } else if (response.data) {
      // Если данные есть, но нет вложенного объекта 'ticket'
      return response.data;
    } else {
      throw new Error('Некорректный формат данных от API');
    }
  } catch (error) {
    console.error(`Error fetching ticket #${id}:`, error);
    
    // Если нужно, здесь можно вернуть моковые данные как запасной вариант
    throw error; // Или пробросить ошибку дальше
  }
},
  
  // Create a new ticket
  createTicket: async (ticketData) => {
    if (ALWAYS_USE_MOCK) {
      console.log('Creating mock ticket');
      return mockTicketService.createTicket(ticketData);
    }
    
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket, using mock data:', error);
      return mockTicketService.createTicket(ticketData);
    }
  },
  
  // Update a ticket
  updateTicket: async (id, ticketData) => {
    if (ALWAYS_USE_MOCK) {
      console.log(`Updating mock ticket #${id}`);
      return mockTicketService.updateTicket(id, ticketData);
    }
    
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket #${id}, using mock data:`, error);
      return mockTicketService.updateTicket(id, ticketData);
    }
  },
  
  // Delete a ticket
  deleteTicket: async (id) => {
    if (ALWAYS_USE_MOCK) {
      console.log(`Deleting mock ticket #${id}`);
      return mockTicketService.deleteTicket(id);
    }
    
    try {
      const response = await api.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket #${id}, using mock data:`, error);
      return mockTicketService.deleteTicket(id);
    }
  }
};

export default ticketService;