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
  getTickets: async (filters = {}) => {
    // If we should always use mock data, skip the API call
    if (ALWAYS_USE_MOCK) {
      console.log('Using mock ticket data');
      return mockTicketService.getTickets(filters);
    }
    
    try {
      // Try to get real data from API
      const response = await api.get('/tickets', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets from API, using mock data:', error);
      // Fallback to mock data
      return mockTicketService.getTickets(filters);
    }
  },
  
  // Get ticket by ID
  getTicketById: async (id) => {
    if (ALWAYS_USE_MOCK) {
      console.log(`Using mock data for ticket #${id}`);
      return mockTicketService.getTicketById(id);
    }
    
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket #${id}, using mock data:`, error);
      return mockTicketService.getTicketById(id);
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