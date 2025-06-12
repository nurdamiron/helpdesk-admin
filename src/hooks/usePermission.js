import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Хук для проверки прав доступа в компонентах
 * Позволяет проверить, имеет ли текущий пользователь доступ к определенным функциям
 * @returns {Object} объект с функциями для проверки прав
 */
export const usePermission = () => {
  const { user, hasPermission, hasSpecificPermission } = useAuth();
  
  /**
   * Проверяет, может ли пользователь выполнить операцию
   * @param {string} requiredRole - Необходимая роль для выполнения операции
   * @returns {boolean} Результат проверки
   */
  const canPerform = useCallback((requiredRole) => {
    return hasPermission(requiredRole);
  }, [hasPermission]);
  
  /**
   * Проверяет, может ли пользователь редактировать заявку
   * @param {Object} ticket - Заявка для проверки
   * @returns {boolean} Может ли пользователь редактировать заявку
   */
  const canEditTicket = useCallback((ticket) => {
    if (!user) return false;
    
    // Админ может редактировать любую заявку
    if (user.role === 'admin') return true;
    
    // Модератор может редактировать любую заявку
    if (user.role === 'moderator') return true;
    
    // Пользователь может редактировать только свои заявки
    if (user.role === 'user') {
      return ticket.user_id === user.id;
    }
    
    return false;
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь управлять пользователями
   * @param {Object} targetUser - Пользователь, для которого проверяются права
   * @returns {boolean} Может ли пользователь управлять целевым пользователем
   */
  const canManageUser = useCallback((targetUser) => {
    if (!user) return false;
    
    // Никто не может изменять сам себя (кроме своего профиля)
    if (targetUser.id === user.id) return false;
    
    // Админ может управлять всеми пользователями
    if (user.role === 'admin') return true;
    
    // Модератор может управлять только обычными пользователями
    if (user.role === 'moderator') {
      return targetUser.role === 'user';
    }
    
    return false;
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь назначать заявки другим пользователям
   * @returns {boolean} Может ли пользователь назначать заявки
   */
  const canAssignTickets = useCallback(() => {
    if (!user) return false;
    return ['admin', 'moderator'].includes(user.role);
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь просматривать аналитику
   * @returns {boolean} Может ли пользователь просматривать аналитику
   */
  const canViewAnalytics = useCallback(() => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь экспортировать данные
   * @returns {boolean} Может ли пользователь экспортировать данные
   */
  const canExportData = useCallback(() => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь видеть все заявки
   * @returns {boolean} Может ли пользователь видеть все заявки
   */
  const canViewAllTickets = useCallback(() => {
    return hasSpecificPermission('view_all_tickets');
  }, [hasSpecificPermission]);
  
  /**
   * Проверяет, может ли пользователь управлять системными настройками
   * @returns {boolean} Может ли пользователь управлять системными настройками
   */
  const canManageSettings = useCallback(() => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);
  
  /**
   * Проверяет, может ли пользователь управлять пользователями системы (список всех пользователей)
   * @returns {boolean} Может ли пользователь управлять пользователями системы
   */
  const canManageUsers = useCallback(() => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);
  
  return {
    canPerform,
    canEditTicket,
    canManageUser,
    canAssignTickets,
    canViewAnalytics,
    canExportData,
    canViewAllTickets,
    canManageSettings,
    canManageUsers
  };
};

export default usePermission;