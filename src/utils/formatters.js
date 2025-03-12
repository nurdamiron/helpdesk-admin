// src/utils/formatters.js

/**
 * Форматирует число как денежную сумму
 * @param {number} amount - Сумма
 * @param {string} currency - Валюта (RUB по умолчанию)
 * @returns {string} Отформатированная сумма
 */
export const formatCurrency = (amount, currency = 'RUB') => {
    if (amount === null || amount === undefined) return '—';
    
    // Форматируем через Intl.NumberFormat
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  };
  
  /**
   * Форматирует число с разделителями разрядов
   * @param {number} value - Число для форматирования
   * @param {number} fractionDigits - Количество десятичных знаков
   * @returns {string} Отформатированное число
   */
  export const formatNumber = (value, fractionDigits = 0) => {
    if (value === null || value === undefined) return '—';
    
    const formatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    
    return formatter.format(value);
  };
  
  /**
   * Сокращает длинный текст
   * @param {string} text - Текст для сокращения
   * @param {number} maxLength - Максимальная длина (по умолчанию 100)
   * @returns {string} Сокращенный текст
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Форматирует размер файла в байтах в читаемый формат
   * @param {number} bytes - Размер в байтах
   * @param {number} decimals - Количество десятичных знаков (по умолчанию 2)
   * @returns {string} Отформатированный размер
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Форматирует телефонный номер в российском формате
   * @param {string} phone - Номер телефона
   * @returns {string} Отформатированный номер
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Удаляем все нецифровые символы
    const cleaned = phone.replace(/\D/g, '');
    
    // Проверяем, что номер российский (начинается с 7 или 8)
    if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      // Если номер начинается с 8, заменяем на 7
      const normalized = cleaned.startsWith('8') ? `7${cleaned.slice(1)}` : cleaned;
      
      // Форматируем как +7 (999) 123-45-67
      return `+${normalized.slice(0, 1)} (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
    }
    
    // Если номер не соответствует российскому формату, возвращаем как есть
    return phone;
  };
  
  /**
   * Преобразует первую букву строки в верхний регистр
   * @param {string} str - Строка для преобразования
   * @returns {string} Преобразованная строка
   */
  export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Форматирует статус заявки для отображения
   * @param {string} status - Статус заявки
   * @returns {string} Отформатированный статус
   */
  export const formatTicketStatus = (status) => {
    const statuses = {
      'new': 'Новая',
      'open': 'Открыта',
      'in_progress': 'В работе',
      'pending': 'Ожидает ответа',
      'resolved': 'Решена',
      'closed': 'Закрыта'
    };
    
    return statuses[status] || status;
  };
  
  /**
   * Форматирует приоритет заявки для отображения
   * @param {string} priority - Приоритет заявки
   * @returns {string} Отформатированный приоритет
   */
  export const formatTicketPriority = (priority) => {
    const priorities = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный'
    };
    
    return priorities[priority] || priority;
  };
  
  /**
   * Форматирует категорию заявки для отображения
   * @param {string} category - Категория заявки
   * @returns {string} Отформатированная категория
   */
  export const formatTicketCategory = (category) => {
    const categories = {
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
    };
    
    return categories[category] || category;
  };
  
  /**
   * Форматирует тип объекта для отображения
   * @param {string} propertyType - Тип объекта
   * @returns {string} Отформатированный тип объекта
   */
  export const formatPropertyType = (propertyType) => {
    const propertyTypes = {
      'apartment': 'Квартира',
      'house': 'Частный дом',
      'office': 'Офис',
      'commercial': 'Коммерческое помещение',
      'land': 'Земельный участок',
      'other': 'Другое'
    };
    
    return propertyTypes[propertyType] || propertyType;
  };
  
  /**
   * Форматирует предпочтительный способ связи для отображения
   * @param {string} contactMethod - Способ связи
   * @returns {string} Отформатированный способ связи
   */
  export const formatContactMethod = (contactMethod) => {
    const contactMethods = {
      'email': 'Email',
      'phone': 'Телефон',
      'whatsapp': 'WhatsApp'
    };
    
    return contactMethods[contactMethod] || contactMethod;
  };