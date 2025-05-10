import api from './index';

/**
 * Сервис для работы с сотрудниками в админ-панели
 */
export const employeeService = {
  /**
   * Получить список сотрудников с пагинацией и фильтрацией
   * @param {Object} filters - Параметры фильтрации и пагинации
   * @returns {Promise<Object>} Ответ с данными сотрудников
   */
  getEmployees: async (filters = {}) => {
    try {
      console.log('Запрос списка сотрудников с фильтрами:', filters);
      
      const response = await api.get('/employees', { params: filters });
      
      console.log('Ответ API для списка сотрудников:', response.data);
      
      // Стандартизация формата ответа
      if (response.data.employees) {
        return {
          data: response.data.employees,
          total: response.data.employees.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: Math.ceil(response.data.employees.length / (filters.limit || 10))
        };
      } else if (Array.isArray(response.data)) {
        return { 
          data: response.data,
          total: response.data.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: Math.ceil(response.data.length / (filters.limit || 10))
        };
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Ошибка при получении списка сотрудников:', error);
      throw error;
    }
  },

  /**
   * Получить сотрудника по ID
   * @param {string|number} id - ID сотрудника
   * @returns {Promise<Object>} Ответ с данными сотрудника
   */
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data.employee || response.data;
    } catch (error) {
      console.error(`Ошибка при получении данных сотрудника #${id}:`, error);
      throw error;
    }
  },

  /**
   * Создать нового сотрудника
   * @param {Object} employeeData - Данные нового сотрудника
   * @returns {Promise<Object>} Созданный сотрудник
   */
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data.employee || response.data;
    } catch (error) {
      console.error('Ошибка при создании сотрудника:', error);
      throw error;
    }
  },

  /**
   * Обновить данные сотрудника
   * @param {string|number} id - ID сотрудника
   * @param {Object} employeeData - Новые данные сотрудника
   * @returns {Promise<Object>} Обновленный сотрудник
   */
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data.employee || response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении сотрудника #${id}:`, error);
      throw error;
    }
  },

  /**
   * Удалить сотрудника
   * @param {string|number} id - ID сотрудника
   * @returns {Promise<Object>} Результат удаления
   */
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении сотрудника #${id}:`, error);
      throw error;
    }
  },

  /**
   * Получить статистику по сотрудникам (по отделам, должностям и т.д.)
   * @returns {Promise<Object>} Данные статистики
   */
  getEmployeeStats: async () => {
    try {
      const response = await api.get('/employees/stats');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статистики по сотрудникам:', error);
      throw error;
    }
  }
};

export default employeeService; 