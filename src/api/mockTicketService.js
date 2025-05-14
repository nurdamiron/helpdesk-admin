// src/api/mockTicketService.js
// This service provides mock data when the backend API is unavailable

// Generate a random date within the last 30 days
const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString();
  };
  
  // Generate mock ticket data
  const generateMockTickets = (count = 15) => {
    const statuses = ['new', 'in_progress', 'waiting', 'resolved', 'closed'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    const categories = ['repair', 'plumbing', 'electrical', 'construction', 'design', 'consultation'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      subject: `Тестовая заявка #${i + 1}`,
      description: `Это тестовое описание для заявки #${i + 1}. Используется для демонстрации интерфейса.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      created_at: getRandomDate(),
      updated_at: getRandomDate(),
      company_id: 1,
      metadata: {
        requester: {
          full_name: `Клиент ${i + 1}`,
          email: `client${i + 1}@example.com`,
          phone: `+7705${Math.floor(1000000 + Math.random() * 9000000)}`
        },
        property: {
          type: ['apartment', 'house', 'office'][Math.floor(Math.random() * 3)],
          address: `ул. Примерная, д. ${Math.floor(Math.random() * 100) + 1}, кв. ${Math.floor(Math.random() * 100) + 1}`,
          area: `${Math.floor(Math.random() * 100) + 30}`
        }
      }
    }));
  };
  
  // Mock ticket data
  const mockTickets = generateMockTickets();
  
  export const mockTicketService = {
    // Get all tickets with optional filtering
    getTickets: async (filters = {}) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate network failure if requested
      if (filters.simulateError) {
        throw new Error('Network Error');
      }
      
      // Filter tickets based on search query
      let filteredTickets = [...mockTickets];
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.subject.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.id.toString() === filters.search
        );
      }
      
      // Filter by status
      if (filters.status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
      }
      
      // Filter by priority
      if (filters.priority) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
      }
      
      // Filter by category
      if (filters.category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === filters.category);
      }
      
      // Handle pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
      
      return {
        data: paginatedTickets,
        total: filteredTickets.length,
        page,
        limit,
        pages: Math.ceil(filteredTickets.length / limit)
      };
    },
    
    // Get ticket by ID
    getTicketById: async (id) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticket = mockTickets.find(t => t.id.toString() === id.toString());
      
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      
      return { ticket };
    },
    
    // Create a new ticket
    createTicket: async (ticketData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const newTicket = {
        id: mockTickets.length + 1,
        ...ticketData,
        status: ticketData.status || 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockTickets.push(newTicket);
      
      return { ticket: newTicket };
    },
    
    // Update an existing ticket
    updateTicket: async (id, ticketData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockTickets.findIndex(t => t.id.toString() === id.toString());
      
      if (index === -1) {
        throw new Error('Ticket not found');
      }
      
      const updatedTicket = {
        ...mockTickets[index],
        ...ticketData,
        updated_at: new Date().toISOString()
      };
      
      mockTickets[index] = updatedTicket;
      
      return { ticket: updatedTicket };
    },
    
    // Delete a ticket
    deleteTicket: async (id) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const index = mockTickets.findIndex(t => t.id.toString() === id.toString());
      
      if (index === -1) {
        throw new Error('Ticket not found');
      }
      
      mockTickets.splice(index, 1);
      
      return { success: true };
    }
  };
  
  export default mockTicketService;