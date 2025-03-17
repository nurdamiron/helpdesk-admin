// src/utils/formatters.js
/**
 * Единые утилиты форматирования для использования в клиентской и административной части
 */

/**
 * Преобразование статуса заявки в человекочитаемый текст
 * @param {string} status - Статус заявки
 * @param {string} [locale='ru'] - Локаль (ru или kz)
 * @returns {string} - Человекочитаемый текст
 */
export const formatTicketStatus = (status, locale = 'ru') => {
  const statusMap = {
    'ru': {
      'new': 'Новая',
      'open': 'Открыта',
      'in_progress': 'В работе',
      'pending': 'Ожидает ответа',
      'resolved': 'Решена',
      'closed': 'Закрыта'
    },
    'kz': {
      'new': 'Жаңа',
      'open': 'Ашық',
      'in_progress': 'Жұмыста',
      'pending': 'Жауап күтуде',
      'resolved': 'Шешілді',
      'closed': 'Жабық'
    }
  };
  
  return (statusMap[locale] && statusMap[locale][status]) || status;
};

/**
 * Получение цвета для статуса заявки
 * @param {string} status - Статус заявки
 * @returns {string} - Цвет в формате Material UI
 */
export const getStatusColor = (status) => {
  const colorMap = {
    'new': 'info',
    'open': 'primary',
    'in_progress': 'secondary',
    'pending': 'warning',
    'resolved': 'success',
    'closed': 'default'
  };
  
  return colorMap[status] || 'default';
};

/**
 * Преобразование приоритета заявки в человекочитаемый текст
 * @param {string} priority - Приоритет заявки
 * @param {string} [locale='ru'] - Локаль (ru или kz)
 * @returns {string} - Человекочитаемый текст
 */
export const formatTicketPriority = (priority, locale = 'ru') => {
  const priorityMap = {
    'ru': {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный'
    },
    'kz': {
      'low': 'Төмен',
      'medium': 'Орташа',
      'high': 'Жоғары',
      'urgent': 'Шұғыл'
    }
  };
  
  return (priorityMap[locale] && priorityMap[locale][priority]) || priority;
};

/**
 * Преобразование категории заявки в человекочитаемый текст
 * @param {string} category - Категория заявки
 * @param {string} [locale='ru'] - Локаль (ru или kz)
 * @returns {string} - Человекочитаемый текст
 */
export const formatTicketCategory = (category, locale = 'ru') => {
  const categoryMap = {
    'ru': {
      'repair': 'Ремонтные работы',
      'plumbing': 'Сантехника',
      'electrical': 'Электрика',
      'construction': 'Строительство',
      'design': 'Проектирование',
      'consultation': 'Консультация',
      'estimate': 'Смета и расчеты',
      'materials': 'Материалы',
      'warranty': 'Гарантийный случай',
      'other': 'Другое'
    },
    'kz': {
      'repair': 'Жөндеу жұмыстары',
      'plumbing': 'Сантехника',
      'electrical': 'Электрика',
      'construction': 'Құрылыс',
      'design': 'Жобалау',
      'consultation': 'Кеңес беру',
      'estimate': 'Смета және есептеулер',
      'materials': 'Материалдар',
      'warranty': 'Кепілдік жағдайы',
      'other': 'Басқа'
    }
  };
  
  return (categoryMap[locale] && categoryMap[locale][category]) || category;
};

/**
 * Преобразование типа объекта в человекочитаемый текст
 * @param {string} propertyType - Тип объекта
 * @param {string} [locale='ru'] - Локаль (ru или kz)
 * @returns {string} - Человекочитаемый текст
 */
export const formatPropertyType = (propertyType, locale = 'ru') => {
  const propertyTypeMap = {
    'ru': {
      'apartment': 'Квартира',
      'house': 'Частный дом',
      'office': 'Офис',
      'commercial': 'Коммерческое помещение',
      'land': 'Земельный участок',
      'other': 'Другое'
    },
    'kz': {
      'apartment': 'Пәтер',
      'house': 'Жеке үй',
      'office': 'Кеңсе',
      'commercial': 'Коммерциялық үй-жай',
      'land': 'Жер учаскесі',
      'other': 'Басқа'
    }
  };
  
  return (propertyTypeMap[locale] && propertyTypeMap[locale][propertyType]) || propertyType;
};

/**
 * Форматирование казахстанского номера телефона
 * @param {string} phone - Номер телефона
 * @returns {string} - Отформатированный номер
 */
export const formatKzPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Удаление всех нецифровых символов
  const cleaned = phone.replace(/\D/g, '');
  
  // Проверка формата казахстанского номера
  if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
    // Форматирование: +7 (XXX) XXX-XX-XX
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  
  return phone;
};

/**
 * Форматирование размера файла
 * @param {number} bytes - Размер в байтах
 * @param {number} [decimals=2] - Количество знаков после запятой
 * @returns {string} - Отформатированный размер
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Байт';
  
  const k = 1024;
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Проверка, можно ли выполнять действия с заявкой на основе ее статуса
 * @param {string} status - Статус заявки
 * @returns {boolean} - true, если с заявкой можно выполнять действия
 */
export const isTicketActionable = (status) => {
  // Заявки в этих статусах уже завершены и с ними нельзя выполнять действия
  const nonActionableStatuses = ['resolved', 'closed'];
  
  return !nonActionableStatuses.includes(status);
};