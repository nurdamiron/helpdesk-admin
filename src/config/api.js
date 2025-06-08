// Автоматическое определение URL бэкенда
const getApiUrl = () => {
  // Если указан явный URL в переменных окружения, используем его
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Определяем текущий хост
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  
  // Если это localhost, используем localhost
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5002/api';
  }
  
  // Если это локальный IP адрес, используем тот же IP для бэкенда
  const localIpPattern = /^(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3})$/;
  if (localIpPattern.test(currentHost)) {
    return `${currentProtocol}//${currentHost}:5002/api`;
  }
  
  // Для production окружения
  if (currentHost.includes('vercel.app') || currentHost.includes('onrender.com')) {
    return 'https://helpdesk-backend-ycoo.onrender.com/api';
  }
  
  // По умолчанию используем относительный путь
  return '/api';
};

// Автоматическое определение WebSocket URL
const getWsUrl = () => {
  // Если указан явный URL в переменных окружения, используем его
  if (process.env.REACT_APP_WS_URL) {
    return process.env.REACT_APP_WS_URL;
  }

  // Определяем текущий хост
  const currentHost = window.location.hostname;
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  // Если это localhost, используем localhost
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'ws://localhost:5002/ws';
  }
  
  // Если это локальный IP адрес, используем тот же IP для WebSocket
  const localIpPattern = /^(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3})$/;
  if (localIpPattern.test(currentHost)) {
    return `${wsProtocol}//${currentHost}:5002/ws`;
  }
  
  // Для production окружения
  if (currentHost.includes('vercel.app') || currentHost.includes('onrender.com')) {
    return 'wss://helpdesk-backend-ycoo.onrender.com/ws';
  }
  
  // По умолчанию используем относительный путь
  return `${wsProtocol}//${currentHost}/ws`;
};

export const API_URL = getApiUrl();
export const WS_URL = getWsUrl();

// Для отладки
const debugInfo = {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  nodeEnv: process.env.NODE_ENV,
  envApiUrl: process.env.REACT_APP_API_URL,
  envWsUrl: process.env.REACT_APP_WS_URL,
  calculatedApiUrl: API_URL,
  calculatedWsUrl: WS_URL,
  userAgent: navigator.userAgent,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isOnline: navigator.onLine,
  connectionType: navigator.connection?.effectiveType || 'unknown'
};

console.log('🔧 API Configuration:', debugInfo);

// Проверка доступности API для мобильных устройств
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  // Простая проверка доступности API
  fetch(API_URL + '/health', { 
    method: 'GET', 
    timeout: 5000,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      console.log('✅ API Health Check:', response.status);
    })
    .catch(error => {
      console.error('❌ API Health Check Failed:', error.message);
      console.error('🔥 Возможные проблемы:', {
        'CORS': 'Сервер может блокировать запросы с мобильных устройств',
        'Network': 'Проблемы с интернет-соединением',
        'DNS': 'Не удается разрешить имя сервера',
        'SSL': 'Проблемы с SSL сертификатом',
        'Timeout': 'Сервер не отвечает в течение 5 секунд'
      });
    });
}

export default {
  API_URL,
  WS_URL
};