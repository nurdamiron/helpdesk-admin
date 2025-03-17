// src/utils/dateUtils.js
/**
 * Общие утилиты для работы с датами
 */

/**
 * Форматирование даты в человекочитаемый формат
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @param {string} [timezone='Europe/Moscow'] - Часовой пояс
 * @returns {string} - Отформатированная дата
 */
export const formatDate = (dateString, timezone = 'Asia/Almaty') => {
  if (!dateString) return 'Н/Д';
  
  try {
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    // Форматируем с учетом локали и указанного часового пояса
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateString);
  }
};

/**
 * Форматирование относительного времени (например, "5 минут назад")
 * @param {string|Date} dateString - Дата в виде строки или объекта Date
 * @param {string} [locale='ru'] - Локаль (ru или kz)
 * @returns {string} - Относительное время
 */
export const formatRelativeTime = (dateString, locale = 'ru') => {
  if (!dateString) return 'Н/Д';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    // Разница в секундах, минутах, часах и днях
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Массивы склонений для русского и казахского языков
    const timeUnits = {
      'ru': {
        seconds: ['секунду', 'секунды', 'секунд'],
        minutes: ['минуту', 'минуты', 'минут'],
        hours: ['час', 'часа', 'часов'],
        days: ['день', 'дня', 'дней']
      },
      'kz': {
        seconds: ['секунд', 'секунд', 'секунд'],
        minutes: ['минут', 'минут', 'минут'],
        hours: ['сағат', 'сағат', 'сағат'],
        days: ['күн', 'күн', 'күн']
      }
    };
    
    const agoText = locale === 'kz' ? 'бұрын' : 'назад';
    
    // Функция для выбора правильного склонения (только для русского языка)
    const getCorrectForm = (number, forms) => {
      if (locale !== 'ru') return forms[0]; // В казахском не нужно склонение
      
      const cases = [2, 0, 1, 1, 1, 2];
      return forms[
        number % 100 > 4 && number % 100 < 20 ? 2 : cases[Math.min(number % 10, 5)]
      ];
    };
    
    // Относительное время
    if (diffSec < 60) {
      return `${diffSec} ${getCorrectForm(diffSec, timeUnits[locale].seconds)} ${agoText}`;
    } else if (diffMin < 60) {
      return `${diffMin} ${getCorrectForm(diffMin, timeUnits[locale].minutes)} ${agoText}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${getCorrectForm(diffHours, timeUnits[locale].hours)} ${agoText}`;
    } else if (diffDays < 7) {
      return `${diffDays} ${getCorrectForm(diffDays, timeUnits[locale].days)} ${agoText}`;
    }
    
    // Для более давних дат используем обычное форматирование
    return formatDate(dateString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return String(dateString);
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