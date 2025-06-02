// src/api/userService.js
import api from './index';
import { BaseApiService } from './baseApiService';
import { authService } from './authService';

/**
 * Сервис для работы с данными пользователей
 */
export class UserService extends BaseApiService {
  /**
   * Получение профиля текущего пользователя
   */
  async getProfile() {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Получаем актуальные данные с сервера
      const response = await this.request({
        method: 'get',
        url: `/users/${currentUser.id}`,
        authService
      });
      
      return response;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  /**
   * Обновление профиля пользователя
   * @param {Object} userData - Данные для обновления
   */
  async updateProfile(userData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      const response = await this.request({
        method: 'put',
        url: `/users/${currentUser.id}`,
        data: userData,
        authService
      });
      
      // Обновляем данные в localStorage
      if (response.user) {
        const updatedUser = { ...currentUser, ...response.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Обновление пароля
   * @param {string} currentPassword - Текущий пароль
   * @param {string} newPassword - Новый пароль
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      const response = await this.request({
        method: 'put',
        url: `/users/${currentUser.id}/password`,
        data: {
          currentPassword,
          newPassword
        },
        authService
      });
      
      return response;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Обновление настроек пользователя
   * @param {Object} settings - Настройки пользователя
   */
  async updateSettings(settings) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      const response = await this.request({
        method: 'put',
        url: `/users/${currentUser.id}/settings`,
        data: settings,
        authService
      });
      
      return response;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const userService = new UserService();
export default userService;