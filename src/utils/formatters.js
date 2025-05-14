// src/utils/formatters.js
import i18next from 'i18next';

/**
 * Единые утилиты форматирования для использования в клиентской и административной части
 */

/**
 * Получает текущий язык пользовательского интерфейса
 * @returns {string} - Код языка (kk, ru или en)
 */
export const getCurrentLanguage = () => {
  return i18next.language?.substring(0, 2) || 'kk';
};

/**
 * Форматирует статус заявки на выбранном языке
 * @param {string} status - Статус заявки
 * @returns {string} Локализованный статус
 */
export const formatTicketStatus = (status) => {
  const lang = getCurrentLanguage();
  
  const statusMap = {
    'kk': {
      'new': 'Жаңа',
      'in_review': 'Қарастыруда',
      'in_progress': 'Өңделуде',
      'pending': 'Күтілуде',
      'resolved': 'Шешілді',
      'closed': 'Жабық',
      'default': 'Белгісіз'
    },
    'ru': {
      'new': 'Новый',
      'in_review': 'На рассмотрении',
      'in_progress': 'В работе',
      'pending': 'В ожидании',
      'resolved': 'Решен',
      'closed': 'Закрыт',
      'default': 'Неизвестно'
    },
    'en': {
      'new': 'New',
      'in_review': 'In Review',
      'in_progress': 'In Progress',
      'pending': 'Pending',
      'resolved': 'Resolved',
      'closed': 'Closed',
      'default': 'Unknown'
    }
  };
  
  // Возвращаем локализованный статус или значение по умолчанию
  return statusMap[lang][status] || statusMap[lang].default || status;
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
 * Форматирует приоритет заявки на выбранном языке
 * @param {string} priority - Приоритет заявки
 * @returns {string} Локализованный приоритет
 */
export const formatTicketPriority = (priority) => {
  const lang = getCurrentLanguage();
  
  const priorityMap = {
    'kk': {
      'low': 'Төмен',
      'medium': 'Орташа',
      'high': 'Жоғары',
      'urgent': 'Шұғыл',
      'default': 'Орташа'
    },
    'ru': {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный',
      'default': 'Средний'
    },
    'en': {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'urgent': 'Urgent',
      'default': 'Medium'
    }
  };
  
  return priorityMap[lang][priority] || priorityMap[lang].default || priority;
};

/**
 * Форматирует тип заявки на выбранном языке
 * @param {string} type - Тип заявки
 * @returns {string} Локализованный тип
 */
export const formatTicketType = (type) => {
  const lang = getCurrentLanguage();
  
  const typeMap = {
    'kk': {
      'request': 'Сұраныс',
      'complaint': 'Шағым',
      'suggestion': 'Ұсыныс',
      'other': 'Басқа',
      'default': 'Белгісіз'
    },
    'ru': {
      'request': 'Запрос',
      'complaint': 'Жалоба',
      'suggestion': 'Предложение',
      'other': 'Другое',
      'default': 'Неизвестно'
    },
    'en': {
      'request': 'Request',
      'complaint': 'Complaint',
      'suggestion': 'Suggestion',
      'other': 'Other',
      'default': 'Unknown'
    }
  };
  
  return typeMap[lang][type] || typeMap[lang].default || type;
};

/**
 * Форматирует категорию заявки на выбранном языке
 * @param {string} category - Категория заявки
 * @returns {string} Локализованная категория
 */
export const formatTicketCategory = (category) => {
  const lang = getCurrentLanguage();
  
  const categoryMap = {
    'kk': {
      'repair': 'Жөндеу жұмыстары',
      'plumbing': 'Сантехника',
      'electrical': 'Электрика',
      'construction': 'Құрылыс',
      'design': 'Жобалау',
      'consultation': 'Кеңес беру',
      'estimate': 'Смета және есептеулер',
      'materials': 'Материалдар',
      'warranty': 'Кепілдік жағдайы',
      'other': 'Басқа',
      'default': 'Белгісіз'
    },
    'ru': {
      'repair': 'Ремонтные работы',
      'plumbing': 'Сантехника',
      'electrical': 'Электрика',
      'construction': 'Строительство',
      'design': 'Проектирование',
      'consultation': 'Консультации',
      'estimate': 'Сметы и расчеты',
      'materials': 'Материалы',
      'warranty': 'Гарантийный случай',
      'other': 'Другое',
      'default': 'Неизвестно'
    },
    'en': {
      'repair': 'Repair Works',
      'plumbing': 'Plumbing',
      'electrical': 'Electrical',
      'construction': 'Construction',
      'design': 'Design',
      'consultation': 'Consultation',
      'estimate': 'Estimates and Calculations',
      'materials': 'Materials',
      'warranty': 'Warranty Case',
      'other': 'Other',
      'default': 'Unknown'
    }
  };
  
  return categoryMap[lang][category] || categoryMap[lang].default || category;
};

/**
 * Преобразование типа объекта в человекочитаемый текст
 * @param {string} propertyType - Тип объекта
 * @returns {string} - Человекочитаемый текст
 */
export const formatPropertyType = (propertyType) => {
  const lang = getCurrentLanguage();
  
  const propertyTypeMap = {
    'kk': {
      'apartment': 'Пәтер',
      'house': 'Жеке үй',
      'office': 'Кеңсе',
      'commercial': 'Коммерциялық үй-жай',
      'land': 'Жер учаскесі',
      'other': 'Басқа'
    },
    'ru': {
      'apartment': 'Квартира',
      'house': 'Частный дом',
      'office': 'Офис',
      'commercial': 'Коммерческое помещение',
      'land': 'Земельный участок',
      'other': 'Другое'
    },
    'en': {
      'apartment': 'Apartment',
      'house': 'House',
      'office': 'Office',
      'commercial': 'Commercial Space',
      'land': 'Land Plot',
      'other': 'Other'
    }
  };
  
  return (propertyTypeMap[lang] && propertyTypeMap[lang][propertyType]) || propertyType;
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
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const lang = getCurrentLanguage();
  
  const sizes = {
    'kk': ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'],
    'ru': ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'],
    'en': ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  };
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeUnits = sizes[lang] || sizes['en'];
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizeUnits[i];
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

/**
 * Создает инициалы из имени
 * @param {string} name - Полное имя
 * @returns {string} Инициалы (до 2 символов)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

/**
 * Сокращает текст до указанной длины
 * @param {string} text - Исходный текст
 * @param {number} maxLength - Максимальная длина
 * @returns {string} Сокращенный текст с многоточием
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Форматирует номер телефона в читаемый вид
 * @param {string} phone - Номер телефона
 * @returns {string} Форматированный номер
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Удаляем все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  
  // Проверяем длину
  if (digits.length !== 11 && digits.length !== 10) {
    return phone; // Возвращаем как есть, если формат неизвестен
  }
  
  // Форматирование для казахстанских номеров (начинающихся с 7)
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits.substring(0, 1)} (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 9)}-${digits.substring(9, 11)}`;
  }
  
  // Форматирование для номеров без кода страны
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 8)}-${digits.substring(8, 10)}`;
  }
  
  return phone;
};