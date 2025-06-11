import { BaseApiService } from './baseApiService';
import authService from './authService';

class StatisticsService extends BaseApiService {
  // Получение общей статистики для дашборда
  async getDashboardStats() {
    return this.request({
      method: 'get',
      url: '/statistics/dashboard',
      requiredRole: 'admin',
      authService
    });
  }

  // Получение статистики по времени для графиков
  async getTimelineStats(period = '7days') {
    return this.request({
      method: 'get',
      url: `/statistics/timeline?period=${period}`,
      requiredRole: 'admin',
      authService
    });
  }

  // Получение статистики производительности сотрудников
  async getStaffPerformance() {
    return this.request({
      method: 'get',
      url: '/statistics/staff-performance',
      requiredRole: 'admin',
      authService
    });
  }

  // Получение KPI метрик
  async getKPIMetrics() {
    return this.request({
      method: 'get',
      url: '/statistics/kpi',
      requiredRole: 'admin',
      authService
    });
  }

  // Экспорт статистики
  async exportStatistics(format = 'json', dateFrom = null, dateTo = null) {
    const params = new URLSearchParams();
    params.append('format', format);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    if (format === 'csv') {
      // Для CSV используем специальный подход
      const url = `/statistics/export?${params.toString()}`;
      window.open(`${window.location.origin}/api${url}`, '_blank');
      return { status: 'success', message: 'Export started' };
    }
    
    return this.request({
      method: 'get',
      url: `/statistics/export?${params.toString()}`,
      requiredRole: 'admin',
      authService
    });
  }
}

export default new StatisticsService();