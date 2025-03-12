// src/utils/dateUtils.js

/**
 * Форматирует дату для отображения в формате DD.MM.YYYY HH:MM
 * @param {string|Date} dateString - Дата в формате ISO или объект Date
 * @returns {string} Отформатированная дата
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'Н/Д';
    
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    // Форматируем дату в локальном формате
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1, так как месяцы в JS начинаются с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  
  /**
   * Форматирует дату в относительном виде (например, "2 часа назад", "вчера")
   * @param {string|Date} dateString - Дата в формате ISO или объект Date
   * @returns {string} Относительная дата
   */
  export const formatRelativeDate = (dateString) => {
    if (!dateString) return 'Н/Д';
    
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Меньше минуты
    if (diffInSeconds < 60) {
      return 'только что';
    }
    
    // Меньше часа
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${declOfNum(minutes, ['минуту', 'минуты', 'минут'])} назад`;
    }
    
    // Меньше суток
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} назад`;
    }
    
    // Вчера
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()) {
      return 'вчера';
    }
    
    // Меньше недели
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${declOfNum(days, ['день', 'дня', 'дней'])} назад`;
    }
    
    // Форматируем обычную дату
    return formatDate(date);
  };
  
  /**
   * Склонение числительных
   * @param {number} number - Число
   * @param {Array<string>} titles - Массив склонений ['день', 'дня', 'дней']
   * @returns {string} Правильное склонение
   */
  export const declOfNum = (number, titles) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20 
        ? 2 
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };
  
  /**
   * Получает разницу между двумя датами в часах
   * @param {string|Date} date1 - Первая дата
   * @param {string|Date} date2 - Вторая дата
   * @returns {number} Разница в часах
   */
  export const getHoursDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Проверяем валидность дат
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }
    
    const diffInMs = Math.abs(d2 - d1);
    return Math.floor(diffInMs / (1000 * 60 * 60));
  };
  
  /**
   * Проверяет, просрочена ли заявка относительно дедлайна
   * @param {string|Date} deadline - Дедлайн
   * @returns {boolean} true, если дедлайн просрочен
   */
  export const isDeadlineOverdue = (deadline) => {
    if (!deadline) return false;
    
    const deadlineDate = new Date(deadline);
    
    // Проверяем валидность даты
    if (isNaN(deadlineDate.getTime())) {
      return false;
    }
    
    const now = new Date();
    return now > deadlineDate;
  };
  
  /**
   * Форматирует дату для ввода в input типа datetime-local
   * @param {string|Date} dateString - Дата в формате ISO или объект Date
   * @returns {string} Дата в формате YYYY-MM-DDThh:mm
   */
  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toISOString().slice(0, 16);
  };