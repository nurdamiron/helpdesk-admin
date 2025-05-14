/**
 * Класс для работы с WebSocket соединениями на стороне администратора
 * Администратор жағында WebSocket байланыстарымен жұмыс істеуге арналған класс
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.userType = null;
    this.isConnected = false;
    this.connectionStatusCallbacks = [];
    this.messageCallbacks = {};
    this.typingCallbacks = {};
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 секунды
    this.pendingMessages = []; // Инициализируем массив для хранения отложенных сообщений
    this.debug = true; // Включаем режим отладки
    this.lastHeartbeat = null;
    this.heartbeatInterval = null;
    
    // Определяем базовый URL для WebSocket в зависимости от среды
    let websocketUrl;
    
    if (process.env.NODE_ENV === 'production') {
      // В production режиме используем WSS для безопасного соединения
      websocketUrl = process.env.REACT_APP_WS_URL || 'wss://helpdesk-backend-2.onrender.com/ws';
    } else {
      // В режиме разработки используем локальный сервер
      websocketUrl = 'ws://localhost:5002/ws';
    }
    
    console.log(`WebSocket URL (${process.env.NODE_ENV} mode):`, websocketUrl);
    
    // Базовый URL для WebSocket соединения
    this.baseUrl = websocketUrl;
    
    // Настраиваем слушатели событий сети
    this.setupNetworkListeners();
    
    console.log('WebSocketService инициализирован с URL:', this.baseUrl);
  }

  /**
   * Установка слушателей состояния сети
   * Желі күйінің тыңдаушыларын орнату
   */
  setupNetworkListeners() {
    // Отслеживаем онлайн/офлайн статус
    window.addEventListener('online', () => {
      console.log('Браузер перешел в режим онлайн. Переподключаем WebSocket...');
      this.reconnect();
    });
    
    window.addEventListener('offline', () => {
      console.log('Браузер перешел в режим офлайн. Закрываем WebSocket соединение...');
      this.isConnected = false;
      this.notifyConnectionStatus();
    });
    
    // Отслеживаем видимость страницы
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.isConnected) {
        console.log('Страница стала видимой. Проверяем WebSocket соединение...');
        this.reconnect();
      }
    });
  }
  
  /**
   * Запуск проверки сердцебиения
   * Жүрек соғуын тексеруді бастау
   */
  startHeartbeat() {
    this.clearHeartbeat();
    
    this.lastHeartbeat = Date.now();
    
    this.heartbeatInterval = setInterval(() => {
      // Проверяем, сколько времени прошло с последнего успешного взаимодействия
      const now = Date.now();
      const elapsed = now - this.lastHeartbeat;
      
      // Если больше 45 секунд без активности - соединение, вероятно, разорвано
      if (elapsed > 45000 && this.isConnected) {
        console.warn('Нет сообщений от сервера более 45 секунд. Соединение может быть разорвано.');
        this.reconnect();
        return;
      }
      
      // Отправляем сигнал сердцебиения, если соединение активно
      if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
        this.sendData({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        });
      }
    }, 15000); // Проверяем каждые 15 секунд
  }
  
  /**
   * Очистка интервала сердцебиения
   * Жүрек соғу аралығын тазалау
   */
  clearHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  /**
   * Обновление времени последнего сердцебиения
   * Соңғы жүрек соғу уақытын жаңарту
   */
  updateHeartbeat() {
    this.lastHeartbeat = Date.now();
  }

  /**
   * Инициализация WebSocket соединения
   * WebSocket байланысын инициализациялау
   * 
   * @param {string|number} userId - ID пользователя
   * @param {string} userType - Тип пользователя (staff)
   * @returns {WebSocketService} - Экземпляр сервиса
   */
  init(userId, userType = 'staff') {
    if (this.socket && this.isConnected) {
      console.log('WebSocket уже подключен');
      return this;
    }

    this.userId = userId || 'anonymous';
    this.userType = userType;
    
    console.log(`Инициализация WebSocket для пользователя: ${this.userId}, тип: ${this.userType}`);

    this.connect();
    return this;
  }

  /**
   * Подключение к WebSocket серверу
   * WebSocket серверіне қосылу
   */
  connect() {
    try {
      // Очищаем существующее соединение
      if (this.socket) {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        this.socket.close();
        this.socket = null;
      }
      
      // Очищаем интервалы
      this.clearPingInterval();
      this.clearHeartbeat();
      
      // Проверяем, что userId и userType установлены
      if (!this.userId || !this.userType) {
        console.error('WebSocket connect failed: userId or userType not set');
        this.notifyConnectionStatus(false, 'Missing required parameters');
        this.scheduleReconnect();
        return;
      }
      
      // Правильно формируем URL с параметрами
      const timestamp = Date.now();
      const url = `${this.baseUrl}?userId=${encodeURIComponent(this.userId)}&userType=${encodeURIComponent(this.userType)}&t=${timestamp}`;
      console.log(`Подключение к WebSocket: ${url}`);
      
      // Создаем таймаут для соединения
      const connectTimeoutId = setTimeout(() => {
        if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket соединение не установлено в течение 10 секунд');
          if (this.socket) {
            this.socket.close(4000, "Таймаут соединения");
          }
          this.scheduleReconnect();
        }
      }, 10000); // 10 секунд на соединение
      
      // Создаем новое соединение с обработкой ошибок
      try {
        this.socket = new WebSocket(url);
        
        if (this.debug) {
          console.log('WebSocket создан с состоянием:', this.socket.readyState);
          console.log('Время начала подключения:', new Date().toISOString());
          
          // Мониторинг состояния подключения
          setTimeout(() => {
            if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
              console.warn('WebSocket не подключился в течение 5 секунд, текущее состояние:', this.socket.readyState);
            }
          }, 5000);
        }

        // Установка обработчиков событий
        this.socket.onopen = (event) => {
          clearTimeout(connectTimeoutId);
          this.handleOpen(event);
        };
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onerror = this.handleError.bind(this);
        this.socket.onclose = this.handleClose.bind(this);
      } catch (socketError) {
        clearTimeout(connectTimeoutId);
        console.error('Error creating WebSocket:', socketError);
        this.notifyConnectionStatus(false, socketError.message);
        this.scheduleReconnect();
      }
    } catch (error) {
      console.error('Ошибка WebSocket подключения:', error);
      this.notifyConnectionStatus(false, error.message);
      this.scheduleReconnect();
    }
  }

  /**
   * Обработчик открытия соединения
   * Байланысты ашу өңдеушісі
   * 
   * @param {Event} event - Событие открытия соединения
   */
  handleOpen(event) {
    console.log('WebSocket соединение установлено:', event);
    console.log('Время успешного подключения:', new Date().toISOString());
    console.log('Детали сокета:', {
      url: this.socket.url,
      protocol: this.socket.protocol,
      readyState: this.socket.readyState
    });
    
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.updateHeartbeat();
    
    // Уведомляем о подключении
    this.notifyConnectionStatus(true, "Соединение установлено");
    
    // Начинаем сервисные интервалы
    this.startPingInterval();
    this.startHeartbeat();
    
    // Отправляем накопленные сообщения, если есть
    if (this.pendingMessages && this.pendingMessages.length > 0) {
      console.log(`Отправляем ${this.pendingMessages.length} накопленных сообщений`);
      
      // Копируем и очищаем массив перед отправкой для избежания циклических добавлений
      const messagesToSend = [...this.pendingMessages];
      this.pendingMessages = [];
      
      // Отправляем каждое сообщение
      messagesToSend.forEach(msg => {
        this.sendData(msg);
      });
    }
    
    // Отправляем приветственное сообщение
    this.sendData({
      type: 'connection_init',
      userId: this.userId,
      userType: this.userType,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Обработчик сообщений
   * Хабарламаларды өңдеуші
   * 
   * @param {MessageEvent} event - Событие сообщения
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // Обновляем время последнего heartbeat
      this.updateHeartbeat();
      
      if (this.debug) {
        console.log('Получено сообщение WebSocket:', data);
      }
      
      // Обрабатываем разные типы сообщений
      switch (data.type) {
        case 'pong':
        case 'heartbeat_ack':
          // Пинг-понг для поддержания соединения
          break;
          
        case 'new_message':
          // Новое сообщение в чате
          this.handleNewMessage(data);
          break;
          
        case 'message_status':
          // Обновление статуса сообщения
          this.handleStatusUpdate(data);
          break;
          
        case 'typing_indicator':
          // Индикатор набора текста
          this.handleTypingIndicator(data);
          break;
          
        case 'connection_established':
          // Подтверждение подключения
          console.log('Соединение подтверждено сервером:', data);
          break;
          
        default:
          console.log('Получено неизвестное сообщение:', data.type);
      }
    } catch (error) {
      console.error('Ошибка при обработке сообщения WebSocket:', error, 'Сырые данные:', event.data);
    }
  }

  /**
   * Обработчик ошибок подключения
   * Байланыс қателерін өңдеуші
   * 
   * @param {string} errorType - Тип ошибки (например, 'timeout', 'network', 'server')
   * @param {Object} errorDetails - Дополнительная информация об ошибке
   */
  handleConnectionError(errorType, errorDetails = {}) {
    console.error(`WebSocket connection error: ${errorType}`, errorDetails);
    
    // Записываем информацию об ошибке
    this.lastConnectionError = {
      type: errorType,
      details: errorDetails,
      timestamp: new Date().toISOString()
    };
    
    // Оповещаем о проблеме
    this.notifyConnectionStatus(false, `Connection error: ${errorType}`);
    
    // Разные стратегии в зависимости от типа ошибки
    switch (errorType) {
      case 'timeout':
        // При таймауте пытаемся переподключиться сразу
        this.reconnect();
        break;
        
      case 'authentication':
        // При ошибке аутентификации не пытаемся переподключаться
        // Это может означать проблемы с токеном или правами доступа
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        this.isConnected = false;
        break;
        
      case 'server':
      case 'network':
      default:
        // Для других ошибок используем стандартный механизм переподключения
        this.scheduleReconnect();
    }
  }

  handleError(error) {
    console.error('WebSocket error occurred:', error);
    
    // Статус и сообщение для детального логирования
    let errorStatus = 'unknown';
    let errorMessage = 'Unknown WebSocket error';
    let errorType = 'unknown';
    
    if (error && error.target && error.target.readyState) {
      switch (error.target.readyState) {
        case WebSocket.CONNECTING:
          errorStatus = 'connecting';
          errorMessage = 'Error while connecting to server';
          errorType = 'connection';
          break;
        case WebSocket.CLOSING:
          errorStatus = 'closing';
          errorMessage = 'Connection is closing';
          errorType = 'closing';
          break;
        case WebSocket.CLOSED:
          errorStatus = 'closed';
          errorMessage = 'Connection is closed';
          errorType = 'closed';
          break;
      }
    }
    
    console.error(`WebSocket error status: ${errorStatus}, message: ${errorMessage}`);
    
    // Детальный анализ ошибки
    const errorDetails = {
      readyState: error.target?.readyState,
      status: errorStatus,
      message: errorMessage,
      originalError: error.message || 'No detailed error message'
    };
    
    // Используем новый обработчик с более детальной информацией
    this.handleConnectionError(errorType, errorDetails);
  }

  /**
   * Обработчик закрытия соединения
   * Байланысты жабу өңдеушісі
   */
  handleClose(event) {
    this.isConnected = false;
    this.clearPingInterval();
    this.clearHeartbeat();
    
    console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}, Clean: ${event.wasClean}`);
    
    // Анализируем код закрытия для более точной диагностики
    let closeMessage = '';
    
    switch (event.code) {
      case 1000:
        closeMessage = 'Normal closure';
        break;
      case 1001:
        closeMessage = 'Server going down or browser navigating away';
        break;
      case 1002:
        closeMessage = 'Protocol error';
        break;
      case 1003:
        closeMessage = 'Unsupported data';
        break;
      case 1005:
        closeMessage = 'No status code present';
        break;
      case 1006:
        closeMessage = 'Abnormal closure, connection lost';
        break;
      case 1007:
        closeMessage = 'Invalid frame payload data';
        break;
      case 1008:
        closeMessage = 'Policy violation';
        break;
      case 1009:
        closeMessage = 'Message too big';
        break;
      case 1010:
        closeMessage = 'Missing extension';
        break;
      case 1011:
        closeMessage = 'Internal server error';
        break;
      case 1012:
        closeMessage = 'Service restart';
        break;
      case 1013:
        closeMessage = 'Try again later';
        break;
      case 1014:
        closeMessage = 'Bad gateway';
        break;
      case 1015:
        closeMessage = 'TLS handshake failure';
        break;
      default:
        closeMessage = `Unknown close code: ${event.code}`;
    }
    
    console.log(`WebSocket close diagnosis: ${closeMessage}`);
    
    // Логируем дополнительную информацию для диагностики кода 1006
    if (event.code === 1006) {
      console.warn('Code 1006 indicates connection loss without proper close frame.');
      console.warn('Possible causes: network issues, server crash, firewall or proxy issues.');
    }
    
    // Уведомляем о закрытии соединения
    this.notifyConnectionStatus(false, closeMessage);
    
    // Пытаемся переподключиться, если соединение закрылось неожиданно
    if (!event.wasClean) {
      this.scheduleReconnect();
    }
  }

  /**
   * Отправка уведомления о статусе соединения
   * Байланыс күйі туралы хабарлама жіберу
   * 
   * @param {boolean} isConnected - Статус соединения
   * @param {string} message - Дополнительное сообщение
   */
  notifyConnectionStatus(isConnected, message = '') {
    console.log(`Notification: WebSocket connection ${isConnected ? 'established' : 'lost'}${message ? ': ' + message : ''}`);
    
    // Вызываем все колбэки с обновленным статусом
    this.connectionStatusCallbacks.forEach(callback => {
      try {
        callback(isConnected, message);
      } catch (error) {
        console.error('Error in connection status callback:', error);
      }
    });
  }

  /**
   * Переподключение к WebSocket
   * WebSocket қайта қосылу
   */
  reconnect() {
    console.log('Попытка переподключения к WebSocket...');
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Полностью сбрасываем состояние для чистого переподключения
    if (this.socket) {
      try {
        this.socket.close(1000, "Manual reconnection");
      } catch (e) {
        console.error("Ошибка закрытия сокета при переподключении:", e);
      }
      this.socket = null;
    }
    
    this.isConnected = false;
    
    // Уведомляем о начале переподключения
    this.notifyConnectionStatus(false, "Инициировано переподключение");
    
    // Начинаем новое подключение с небольшой задержкой
    setTimeout(() => {
      console.log('Попытка немедленного переподключения...');
      this.connect();
    }, 1000);
  }

  /**
   * Планирование переподключения
   * Қайта қосылуды жоспарлау
   */
  scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Достигнуто максимальное количество попыток переподключения');
      return;
    }

    // Экспоненциальное увеличение задержки между попытками
    // Талпыныстар арасындағы кідірісті экспоненциалды түрде арттыру
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000 // Максимальная задержка 30 секунд
    );

    console.log(`Планирование переподключения через ${delay}мс, попытка ${this.reconnectAttempts + 1}`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts += 1;
      this.connect();
    }, delay);
  }

  /**
   * Начать отправку ping-сообщений
   * Ping хабарламаларын жіберуді бастау
   */
  startPingInterval() {
    this.clearPingInterval(); // Очищаем предыдущий интервал, если есть
    
    this.pingInterval = setInterval(() => {
      if (this.isConnected) {
        this.sendData({
          type: 'ping',
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Пинг каждые 30 секунд
  }

  /**
   * Очистить интервал отправки ping
   * Ping жіберу аралығын тазалау
   */
  clearPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Отправка сообщения через WebSocket
   * WebSocket арқылы хабарлама жіберу
   * 
   * @param {Object} data - Данные для отправки
   * @returns {boolean} - Результат отправки
   */
  sendData(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Невозможно отправить сообщение, WebSocket не подключен', {
        isConnected: this.isConnected,
        readyState: this.socket ? this.socket.readyState : 'нет сокета'
      });
      
      // Сохраняем сообщение для отправки после переподключения
      if (data.type !== 'ping' && data.type !== 'heartbeat') {
        console.log('Сообщение сохранено для отправки после переподключения:', data.type);
        this.pendingMessages.push(data);
      }
      
      // Пробуем переподключиться, если не идет процесс переподключения
      if (!this.reconnectTimeout) {
        this.reconnect();
      }
      
      return false;
    }

    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Ошибка отправки WebSocket сообщения:', error);
      return false;
    }
  }

  /**
   * Отправка сообщения чата
   * Чат хабарламасын жіберу
   * 
   * @param {string|number} ticketId - ID тикета
   * @param {string} content - Текст сообщения
   * @returns {boolean} - Результат отправки
   */
  sendChatMessage(ticketId, content) {
    // Преобразуем тип пользователя для совместимости с бэкендом
    // На бэкенде ожидается sender_type: admin, moderator или requester
    // А в WebSocket используется staff или requester
    let backendUserType = this.userType;
    if (this.userType === 'staff') {
      // По умолчанию отправляем как администратор, если система присылает staff
      backendUserType = 'admin';
    }
    
    return this.sendData({
      type: 'chat_message',
      ticket_id: ticketId,
      content,
      sender_id: this.userId,
      sender_type: backendUserType,
      sender_name: 'Администратор',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Отправка статуса набора текста
   * Мәтінді теру күйін жіберу
   * 
   * @param {string|number} ticketId - ID тикета
   * @param {boolean} isTyping - Статус набора
   * @returns {boolean} - Результат отправки
   */
  sendTypingStatus(ticketId, isTyping) {
    return this.sendData({
      type: 'typing',
      ticket_id: ticketId,
      isTyping,
      sender_id: this.userId,
      sender_type: this.userType,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Отправка статуса сообщения
   * Хабарлама күйін жіберу
   * 
   * @param {string|number} messageId - ID сообщения
   * @param {string} status - Статус (read/delivered)
   * @returns {boolean} - Результат отправки
   */
  sendMessageStatus(messageId, status) {
    return this.sendData({
      type: 'message_status',
      message_id: messageId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Закрытие WebSocket соединения
   * WebSocket байланысын жабу
   */
  disconnect() {
    this.clearPingInterval();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      try {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.close(1000, 'Пользователь отключился');
        }
      } catch (error) {
        console.error('Ошибка закрытия WebSocket:', error);
      } finally {
        this.socket = null;
        this.isConnected = false;
      }
    }
    
    console.log('WebSocket отключен пользователем');
  }

  /**
   * Обработка нового сообщения
   * Жаңа хабарламаны өңдеу
   * 
   * @param {Object} data - Данные сообщения
   */
  handleNewMessage(data) {
    const { message } = data;
    
    if (!message || !message.ticket_id) {
      console.error('Неверный формат сообщения:', data);
      return;
    }
    
    const ticketId = message.ticket_id.toString();
    
    // Уведомляем всех подписчиков по этому тикету
    if (this.messageCallbacks[ticketId]) {
      const handlers = this.messageCallbacks[ticketId];
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Ошибка в обработчике сообщений:', error);
        }
      });
    }
  }

  /**
   * Обработка обновления статуса
   * Күй жаңартуын өңдеу
   * 
   * @param {Object} data - Данные статуса
   */
  handleStatusUpdate(data) {
    const { message_id, status, ticket_id } = data;
    
    if (!message_id || !status || !ticket_id) {
      console.error('Неверный формат статуса сообщения:', data);
      return;
    }
    
    // Уведомляем всех подписчиков по этому тикету
    if (this.messageCallbacks[ticket_id.toString()]) {
      const handlers = this.messageCallbacks[ticket_id.toString()];
      handlers.forEach(handler => {
        try {
          handler(message_id, status);
        } catch (error) {
          console.error('Ошибка в обработчике статусов:', error);
        }
      });
    }
  }

  /**
   * Обработка индикатора набора текста
   * Мәтін теру индикаторын өңдеу
   * 
   * @param {Object} data - Данные индикатора
   */
  handleTypingIndicator(data) {
    const { ticket_id, user_id, isTyping } = data;
    
    if (!ticket_id) {
      console.error('Неверный формат индикатора набора:', data);
      return;
    }
    
    // Уведомляем всех подписчиков по этому тикету
    if (this.typingCallbacks[ticket_id.toString()]) {
      const handlers = this.typingCallbacks[ticket_id.toString()];
      handlers.forEach(handler => {
        try {
          handler(user_id, isTyping);
        } catch (error) {
          console.error('Ошибка в обработчике индикатора набора:', error);
        }
      });
    }
  }

  /**
   * Подписка на новые сообщения
   * Жаңа хабарламаларға жазылу
   * 
   * @param {string|number} ticketId - ID тикета
   * @param {Function} handler - Обработчик сообщений
   * @returns {Function} - Функция отписки
   */
  subscribeToMessages(ticketId, handler) {
    const ticketKey = ticketId.toString();
    
    if (!this.messageCallbacks[ticketKey]) {
      this.messageCallbacks[ticketKey] = [];
    }
    
    this.messageCallbacks[ticketKey].push(handler);
    
    return () => {
      if (this.messageCallbacks[ticketKey]) {
        const handlers = this.messageCallbacks[ticketKey];
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Подписка на обновления статусов сообщений
   * Хабарлама күйлерін жаңартуға жазылу
   * 
   * @param {string|number} ticketId - ID тикета
   * @param {Function} handler - Обработчик статусов
   * @returns {Function} - Функция отписки
   */
  subscribeToStatusUpdates(ticketId, handler) {
    const ticketKey = ticketId.toString();
    
    if (!this.messageCallbacks[ticketKey]) {
      this.messageCallbacks[ticketKey] = [];
    }
    
    this.messageCallbacks[ticketKey].push(handler);
    
    return () => {
      if (this.messageCallbacks[ticketKey]) {
        const handlers = this.messageCallbacks[ticketKey];
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Подписка на индикаторы набора текста
   * Мәтін теру индикаторларына жазылу
   * 
   * @param {string|number} ticketId - ID тикета
   * @param {Function} handler - Обработчик индикаторов
   * @returns {Function} - Функция отписки
   */
  subscribeToTypingIndicators(ticketId, handler) {
    const ticketKey = ticketId.toString();
    
    if (!this.typingCallbacks[ticketKey]) {
      this.typingCallbacks[ticketKey] = [];
    }
    
    this.typingCallbacks[ticketKey].push(handler);
    
    return () => {
      if (this.typingCallbacks[ticketKey]) {
        const handlers = this.typingCallbacks[ticketKey];
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Подписка на статус соединения
   * Байланыс күйіне жазылу
   * 
   * @param {Function} handler - Обработчик статуса соединения
   * @returns {Function} - Функция отписки
   */
  subscribeToConnectionStatus(handler) {
    this.connectionStatusCallbacks.push(handler);
    
    // Сразу оповещаем о текущем состоянии
    try {
      handler(this.isConnected);
    } catch (error) {
      console.error('Ошибка в обработчике статуса соединения:', error);
    }
    
    return () => {
      this.connectionStatusCallbacks = this.connectionStatusCallbacks.filter(cb => cb !== handler);
    };
  }
}

// Создаем единственный экземпляр сервиса (Singleton)
const wsService = new WebSocketService();

export default wsService;