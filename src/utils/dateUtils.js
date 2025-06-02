// src/utils/dateUtils.js
/**
 * Общие утилиты для работы с датами
 */

/**
 * Форматирует дату в локализованный формат
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @param {Object} options - Опции форматирования
 * @returns {string} Форматированная дата
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    // Проверка на валидность даты
    if (isNaN(date.getTime())) {
      return 'Жарамсыз күн';
    }
    
    // Опции по умолчанию
    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Объединение опций
    const formatOptions = { ...defaultOptions, ...options };
    
    return date.toLocaleDateString('kk-KZ', formatOptions);
  } catch (error) {
    console.error('Күнді пішімдеу қатесі:', error);
    return 'Форматтау қатесі';
  }
};

/**
 * Возвращает относительное время (например, "5 минут назад")
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @returns {string} Относительное время
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Проверка на валидность даты
    if (isNaN(date.getTime())) {
      return 'Жарамсыз күн';
    }
    
    const secondsAgo = Math.floor((now - date) / 1000);
    
    // Меньше минуты
    if (secondsAgo < 60) {
      return 'Жаңа ғана';
    }
    
    // Меньше часа
    if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} ${minutes === 1 ? 'минут' : 'минут'} бұрын`;
    }
    
    // Меньше дня
    if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} ${hours === 1 ? 'сағат' : 'сағат'} бұрын`;
    }
    
    // Меньше недели
    if (secondsAgo < 604800) {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} ${days === 1 ? 'күн' : 'күн'} бұрын`;
    }
    
    // Более недели - форматируем дату
    return formatDate(date);
  } catch (error) {
    console.error('Салыстырмалы уақытты есептеу қатесі:', error);
    return 'Уақытты есептеу қатесі';
  }
};

/**
 * Проверяет, была ли дата сегодня
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @returns {boolean} true, если дата сегодня
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

/**
 * Форматирует длительность времени
 * @param {number} seconds - Длительность в секундах
 * @returns {string} Форматированная длительность
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '-';
  
  try {
    if (seconds < 60) {
      return `${seconds} сек`;
    }
    
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} мин ${remainingSeconds > 0 ? remainingSeconds + ' сек' : ''}`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours} сағ ${remainingMinutes > 0 ? remainingMinutes + ' мин' : ''}`;
  } catch (error) {
    return 'Форматтау қатесі';
  }
};

/**
 * Форматирование даты для ввода в input типа datetime-local
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @returns {string} - Дата в формате YYYY-MM-DDThh:mm
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Получение текущей даты и времени в формате ISO
 * @returns {string} - Текущая дата в формате ISO
 */
export const getCurrentISODateTime = () => {
  return new Date().toISOString();
};

/**
 * Проверка истечения срока дедлайна
 * @param {string|Date} deadlineDate - Дата дедлайна
 * @returns {boolean} - true, если дедлайн истек
 */
export const isDeadlinePassed = (deadlineDate) => {
  if (!deadlineDate) return false;
  
  try {
    const deadline = new Date(deadlineDate);
    const now = new Date();
    
    // Проверяем валидность даты
    if (isNaN(deadline.getTime())) {
      return false;
    }
    
    return now > deadline;
  } catch (error) {
    console.error('Error checking deadline:', error);
    return false;
  }
};