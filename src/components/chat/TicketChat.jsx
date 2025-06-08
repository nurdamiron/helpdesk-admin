// src/components/chat/TicketChat.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
  Send as SendIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  CheckCircle,
  RefreshCw,
  Clock
} from 'lucide-react';

// Импортируем api вместо кастомного сервиса
import api from '../../api/index';
import { formatDate } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';

// WebSocket сервис для реального времени
import WebSocketService from '../../services/WebSocketService';

// Стилизованные компоненты для сообщений
const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  backgroundColor: isOwn ? alpha(theme.palette.primary.main, 0.1) : '#f5f5f5',
  borderRadius: '1rem',
  padding: '0.8rem 1rem',
  maxWidth: '85%',
  width: 'fit-content',
  position: 'relative',
  marginBottom: '0.5rem',
  boxShadow: isOwn ? 
    '0 2px 5px rgba(25, 118, 210, 0.08)' : 
    '0 2px 5px rgba(0, 0, 0, 0.05)',
  borderTopLeftRadius: isOwn ? '1rem' : '0.3rem',
  borderTopRightRadius: isOwn ? '0.3rem' : '1rem',
  wordBreak: 'break-word',
  hyphens: 'auto',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '95%',
    padding: '0.7rem 0.8rem',
  },
}));

// Компонент статуса сообщения
const MessageStatus = ({ status }) => {
  // Используем useState и useEffect для реактивного изменения размера иконок
  const [iconSize, setIconSize] = useState(14);
  const [marginOffset, setMarginOffset] = useState(-5);
  const theme = useTheme();
  
  // Обновляем размеры при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < theme.breakpoints.values.sm) {
        setIconSize(12);
        setMarginOffset(-4);
      } else {
        setIconSize(14);
        setMarginOffset(-5);
      }
    };
    
    // Устанавливаем начальные значения
    handleResize();
    
    // Добавляем слушатель событий
    window.addEventListener('resize', handleResize);
    
    // Удаляем слушатель при размонтировании
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints.values.sm]);
  
  switch(status) {
    case 'sending':
      return <Clock size={iconSize} color="#9e9e9e" />;
    case 'sent':
      return <CheckCircle size={iconSize} color="#9e9e9e" />;
    case 'delivered':
      return (
        <Box sx={{ display: 'flex' }}>
          <CheckCircle size={iconSize} color="#2196f3" />
          <CheckCircle size={iconSize} color="#2196f3" style={{ marginLeft: marginOffset }} />
        </Box>
      );
    case 'read':
      return (
        <Box sx={{ display: 'flex' }}>
          <CheckCircle size={iconSize} color="#4caf50" />
          <CheckCircle size={iconSize} color="#4caf50" style={{ marginLeft: marginOffset }} />
        </Box>
      );
    default:
      return null;
  }
};

const TicketChat = ({ ticketId, requesterEmail }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [sendToEmail, setSendToEmail] = useState(true); // По умолчанию включено
  const [sendSuccess, setSendSuccess] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineMessages, setOfflineMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Инициализация WebSocket при монтировании компонента
  useEffect(() => {
    if (!ticketId || !user) return;

    try {
      console.log('Инициализация WebSocket для администратора:', user.id);
      
      // Инициализируем WebSocket сервис
      wsRef.current = WebSocketService;
      wsRef.current.init(user.id, 'staff');
      
      // Подписываемся на изменение статуса соединения
      const unsubscribeConnection = wsRef.current.subscribeToConnectionStatus((connected) => {
        console.log('WebSocket статус соединения:', connected);
        setWsConnected(connected);
        
        // Если переподключились, обновляем сообщения
        if (connected && messages.length > 0) {
          fetchMessages();
          // Отправляем offline сообщения
          if (offlineMessages.length > 0) {
            sendOfflineMessages();
          }
        }
      });
      
      // Подписываемся на новые сообщения
      const unsubscribeMessages = wsRef.current.subscribeToMessages(ticketId, (newMessage) => {
        console.log('Получено новое сообщение через WebSocket:', newMessage);
        
        const now = Date.now();
        
        setMessages(prev => {
          // Проверяем, есть ли сообщение уже в массиве
          const existingIndex = prev.findIndex(msg => msg.id === newMessage.id);
          
          // Если сообщение уже существует
          if (existingIndex !== -1) {
            // Если оно было получено через HTTP в течение последней секунды,
            // проигнорируем версию WebSocket
            const existingMsg = prev[existingIndex];
            if (existingMsg._receivedViaHttp && now - existingMsg._httpTimestamp < 1000) {
              console.log('Игнорируем дубликат сообщения из WebSocket, так как оно уже получено через HTTP');
              return prev;
            }
            
            // Иначе обновляем существующее сообщение
            const updatedMessages = [...prev];
            updatedMessages[existingIndex] = { ...newMessage };
            return updatedMessages;
          }
          
          // Иначе добавляем новое сообщение
          return [...prev, newMessage];
        });
        
        // Если сообщение не от нас, отмечаем как прочитанное
        if (newMessage.sender.type !== 'staff') {
          wsRef.current.sendMessageStatus(newMessage.id, 'read');
        }
      });
      
      // Подписываемся на индикаторы набора текста
      const unsubscribeTyping = wsRef.current.subscribeToTypingIndicators(ticketId, (userId, isTyping) => {
        console.log(`Пользователь ${userId} ${isTyping ? 'печатает' : 'перестал печатать'}`);
        setIsTyping(isTyping);
        setTypingUserId(isTyping ? userId : null);
      });
      
      // Очистка при размонтировании
      return () => {
        unsubscribeConnection();
        unsubscribeMessages();
        unsubscribeTyping();
      };
    } catch (err) {
      console.error('Ошибка инициализации WebSocket:', err);
      setError('Не удалось подключиться к сервису сообщений в реальном времени');
    }
  }, [ticketId, user]);

  // Загрузка сообщений при монтировании компонента
  useEffect(() => {
    if (!ticketId) return;
    fetchMessages();
  }, [ticketId]);

  // Функция загрузки сообщений
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${ticketId}/messages`);
      console.log('Ответ API при получении сообщений:', response.data);
      
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      } else if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.warn("Неожиданный формат данных от API:", response.data);
        setMessages([]);
      }
      
      // Отмечаем сообщения как прочитанные
      try {
        await api.put(`/tickets/${ticketId}/messages/read`);
      } catch (readError) {
        console.error('Ошибка при отметке сообщений как прочитанные:', readError);
        // Не прерываем работу из-за этой ошибки
      }
      
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке сообщений:', err);
      setError('Не удалось загрузить сообщения. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка офлайн сообщений из localStorage
  useEffect(() => {
    if (!ticketId) return;
    
    // Загружаем сохраненные офлайн сообщения при запуске
    try {
      const savedMessages = localStorage.getItem(`offlineMessages_${ticketId}`);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          console.log(`Загружено ${parsedMessages.length} офлайн сообщений из localStorage`);
          setOfflineMessages(parsedMessages);
          
          // Добавляем офлайн сообщения в интерфейс для показа
          setMessages(prev => [
            ...prev,
            ...parsedMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              created_at: msg.created_at,
              sender: {
                id: user?.id,
                name: user?.displayName || user?.email,
                type: 'staff'
              },
              status: 'sending',
              isOfflineMessage: true
            }))
          ]);
          
          // Если мы онлайн, начнем отправку
          if (wsConnected) {
            sendOfflineMessages();
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке офлайн сообщений:', error);
    }
  }, [ticketId]);
  
  // Сохраняем офлайн сообщения в localStorage при изменении
  useEffect(() => {
    if (!ticketId || offlineMessages.length === 0) return;
    
    try {
      localStorage.setItem(`offlineMessages_${ticketId}`, JSON.stringify(offlineMessages));
    } catch (error) {
      console.error('Ошибка при сохранении офлайн сообщений:', error);
    }
  }, [offlineMessages, ticketId]);
  
  // Отправка офлайн сообщений
  const sendOfflineMessages = async () => {
    if (offlineMessages.length === 0) return;
    
    const messagesToSend = [...offlineMessages];
    setOfflineMessages([]);
    
    // Очищаем localStorage
    try {
      localStorage.removeItem(`offlineMessages_${ticketId}`);
    } catch (error) {
      console.error('Ошибка при очистке localStorage:', error);
    }
    
    for (const message of messagesToSend) {
      try {
        await api.post(`/tickets/${ticketId}/messages`, {
          content: message.content,
          sender_type: 'staff',
          notify_requester: message.notifyRequester
        });
      } catch (err) {
        console.error('Ошибка при отправке офлайн сообщения:', err);
        // Добавляем обратно в офлайн очередь
        setOfflineMessages(prev => [...prev, message]);
      }
    }
  };

  // Прокрутка чата вниз при получении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Прокрутка чата вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Обработчик изменения текста сообщения
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    
    // Отправляем статус набора текста через WebSocket
    if (e.target.value && wsConnected && wsRef.current) {
      wsRef.current.sendTypingStatus(ticketId, true);
      
      // Через 2 секунды после последнего нажатия отменяем статус набора
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (wsRef.current) {
          wsRef.current.sendTypingStatus(ticketId, false);
        }
        typingTimeoutRef.current = null;
      }, 2000);
    } else if (!e.target.value && typingTimeoutRef.current) {
      // Если поле пустое и есть активный таймер, отменяем набор
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      
      if (wsConnected && wsRef.current) {
        wsRef.current.sendTypingStatus(ticketId, false);
      }
    }
  };

  // Отправка сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Проверяем, есть ли текст сообщения
    if (!newMessage.trim()) {
      setError('Добавьте текст сообщения');
      return;
    }
    
    setSending(true);
    
    try {
      // Если мы в офлайн режиме, сохраняем сообщение локально
      if (offlineMode || !wsConnected) {
        // Добавляем сообщение локально
        const tempId = Date.now().toString();
        const currentTimestamp = new Date().toISOString();
        
        const offlineMessage = {
          id: tempId,
          content: newMessage,
          created_at: currentTimestamp,
          sender: {
            id: user.id,
            name: user.displayName || user.email,
            type: 'staff'
          },
          status: 'sending',
          notifyRequester: sendToEmail,
          isOfflineMessage: true
        };
        
        // Сохраняем для отправки позже
        const messageToStore = { 
          id: tempId, 
          content: newMessage, 
          notifyRequester: sendToEmail,
          created_at: currentTimestamp,
          ticket_id: ticketId
        };
        
        // Добавляем в локальный массив сообщений
        setMessages(prev => [...prev, offlineMessage]);
        setOfflineMessages(prev => {
          const newMessages = [...prev, messageToStore];
          
          // Сохраняем в localStorage
          try {
            localStorage.setItem(`offlineMessages_${ticketId}`, JSON.stringify(newMessages));
          } catch (error) {
            console.error('Ошибка при сохранении офлайн сообщения в localStorage:', error);
          }
          
          return newMessages;
        });
        
        // Очищаем форму
        setNewMessage('');
        setSendSuccess(true);
      } else {
        // Если онлайн - отправляем через API
        // Используем тип "admin" вместо "staff" для совместимости с бекендом
        const response = await api.post(`/tickets/${ticketId}/messages`, {
          content: newMessage,
          sender_type: 'admin', // Изменяем с "staff" на "admin" для совместимости
          notify_requester: sendToEmail
        });
        
        console.log('Ответ API при отправке сообщения:', response.data);
        
        // Отслеживаем ID сообщения, чтобы избежать дублирования
        const messageId = response.data.id;
        const responseReceived = Date.now();
        
        // Обновляем список сообщений сразу, но помним, что получили через HTTP
        setMessages(prev => {
          if (!prev.some(msg => msg.id === messageId)) {
            return [...prev, {...response.data, _receivedViaHttp: true, _httpTimestamp: responseReceived}];
          }
          return prev;
        });
        
        // Если в течение 1 секунды придет то же сообщение через WebSocket, мы его проигнорируем
        // Это решает проблему дублирования сообщений
        
        // Очищаем форму
        setNewMessage('');
        setSendSuccess(true);
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  // Закрытие уведомления об успешной отправке
  const handleCloseSuccess = () => {
    setSendSuccess(false);
  };

  // Проверяем, является ли сообщение от текущего пользователя
  const isMessageFromCurrentUser = (senderId, senderType) => {
    return (senderType === 'staff' && user && (senderId === user.id || senderId === user.email));
  };

  // Состояние попыток подключения
  const [reconnectInfo, setReconnectInfo] = useState({ attempts: 0, maxAttempts: 5, nextAttemptTime: null });
  
  // Обновляем информацию о подключении
  useEffect(() => {
    if (!wsRef.current) return;
    
    const updateReconnectInfo = () => {
      if (wsRef.current) {
        setReconnectInfo({
          attempts: wsRef.current.reconnectAttempts || 0,
          maxAttempts: wsRef.current.maxReconnectAttempts || 5,
          nextAttemptTime: wsRef.current.reconnectTimeout ? Date.now() + 5000 : null
        });
      }
    };
    
    const intervalId = setInterval(updateReconnectInfo, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [wsConnected]);
  
  // Отображение статуса соединения
  const renderConnectionStatus = () => {
    if (offlineMode) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          py: 1,
          px: 2
        }}>
          <WifiOffIcon size={16} style={{ marginRight: 8 }} />
          <Typography variant="body2" fontWeight={500}>
            Офлайн режим - байланыс қалпына келгенде хабарламалар жіберіледі ({offlineMessages.length} сообщений)
          </Typography>
        </Box>
      );
    }
    
    if (!wsConnected) {
      // Показываем разные сообщения в зависимости от статуса подключения
      let statusMessage = 'Сервермен байланыс жоқ';
      let statusColor = 'error.light';
      let showReconnectButton = true;
      
      if (reconnectInfo.attempts >= reconnectInfo.maxAttempts) {
        statusMessage = 'Максимальное количество попыток подключения исчерпано';
        statusColor = 'error.dark';
      } else if (reconnectInfo.attempts > 0) {
        const nextAttemptIn = reconnectInfo.nextAttemptTime ? Math.ceil((reconnectInfo.nextAttemptTime - Date.now()) / 1000) : 0;
        statusMessage = `Попытка подключения ${reconnectInfo.attempts} из ${reconnectInfo.maxAttempts}${nextAttemptIn > 0 ? ` (следующая через ${nextAttemptIn} сек)` : ''}`;
        statusColor = 'warning.dark';
      }
      
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: statusColor,
          color: 'white',
          py: 1,
          px: 2
        }}>
          <WifiOffIcon size={16} style={{ marginRight: 8 }} />
          <Typography variant="body2" fontWeight={500}>
            {statusMessage}
          </Typography>
          {showReconnectButton && (
            <Button 
              size="small" 
              variant="contained" 
              sx={{ ml: 2, minWidth: 0, px: 1, bgcolor: 'white', color: 'text.primary' }}
              onClick={() => {
                // Принудительно сбрасываем счетчик попыток и переподключаемся
                if (wsRef.current) {
                  wsRef.current.reconnectAttempts = 0;
                  wsRef.current.reconnect();
                }
              }}
            >
              <RefreshCw size={16} />
            </Button>
          )}
          {offlineMessages.length > 0 && (
            <Badge color="warning" badgeContent={offlineMessages.length} sx={{ ml: 1 }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 1, minWidth: 0, px: 1, bgcolor: 'white', color: 'text.primary' }}
                onClick={toggleOfflineMode}
              >
                Офлайн режим
              </Button>
            </Badge>
          )}
        </Box>
      );
    }
    
    // Показываем статус онлайн только если есть офлайн сообщения
    if (wsConnected && offlineMessages.length > 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'success.light',
          color: 'success.contrastText',
          py: 1,
          px: 2
        }}>
          <WifiIcon size={16} style={{ marginRight: 8 }} />
          <Typography variant="body2" fontWeight={500}>
            Онлайн - готовы отправить {offlineMessages.length} неотправленных сообщений
          </Typography>
          <Button 
            size="small" 
            variant="contained" 
            sx={{ ml: 2, minWidth: 0, px: 1 }}
            onClick={sendOfflineMessages}
          >
            Отправить
          </Button>
        </Box>
      );
    }
    
    return null;
  };

  // Отображение индикатора набора текста
  const renderTypingIndicator = () => {
    if (!isTyping || !typingUserId) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        pl: 2,
        mb: 1,
        height: 24
      }}>
        <Typography variant="caption" color="text.secondary" fontStyle="italic">
          Клиент жазып жатыр...
        </Typography>
      </Box>
    );
  };

  // Переключение режима офлайн
  const toggleOfflineMode = () => {
    setOfflineMode(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Статус соединения */}
      {renderConnectionStatus()}
      
      {/* Ошибка при загрузке */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        mb: 2
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 1, sm: 0 }
        }}>
          Өтінішті талқылау #{ticketId}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-end' }
        }}>
          <Chip 
            label={offlineMode ? "Офлайн" : "Онлайн"} 
            color={offlineMode ? "warning" : "success"}
            size="small"
            icon={offlineMode ? <WifiOffIcon size={14} /> : <WifiIcon size={14} />}
            onClick={toggleOfflineMode}
            sx={{ fontWeight: 500 }}
          />
          <Badge 
            color="info" 
            badgeContent={offlineMessages.length} 
            invisible={offlineMessages.length === 0}
          >
            <Chip 
              label={`${messages.length} хабарлама`} 
              variant="outlined" 
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Badge>
        </Box>
      </Box>
      
      {/* Сообщения */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha('#f5f5f5', 0.3)
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} />
          </Box>
        ) : messages.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              textAlign: 'center',
              color: 'text.secondary',
              gap: 2
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              Әзірге хабарламалар жоқ
            </Typography>
            <Typography variant="body2">
              Бұл өтінім бойынша талқылауды бастау үшін хабарлама жіберіңіз
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = isMessageFromCurrentUser(message.sender?.id, message.sender?.type);
              const showAvatar = !isOwn && 
                (index === 0 || messages[index - 1].sender?.id !== message.sender?.id);
              const messageDate = new Date(message.created_at);
              
              // Показываем дату, если это первое сообщение или день изменился
              const showDate = index === 0 || 
                new Date(messages[index - 1].created_at).toDateString() !== messageDate.toDateString();
                
              return (
                <React.Fragment key={message.id || index}>
                  {/* Дата */}
                  {showDate && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2, 
                        mt: index > 0 ? 2 : 0
                      }}
                    >
                      <Chip 
                        label={messageDate.toLocaleDateString('kk-KZ', { 
                          weekday: { xs: undefined, sm: 'long' }, 
                          day: 'numeric', 
                          month: { xs: 'short', sm: 'long' }, 
                          year: 'numeric' 
                        })}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontWeight: 500, 
                          bgcolor: 'background.paper',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                    </Box>
                  )}
                  
                  {/* Сообщение */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: isOwn ? 'flex-end' : 'flex-start',
                      mb: 1.5,
                      alignItems: 'flex-end'
                    }}
                  >
                    {/* Аватар отправителя */}
                    {!isOwn && showAvatar && (
                      <Avatar 
                        sx={{ 
                          width: { xs: 28, sm: 32 }, 
                          height: { xs: 28, sm: 32 }, 
                          mr: { xs: 0.5, sm: 1 },
                          bgcolor: message.sender?.type === 'requester' ? 'primary.main' : 'secondary.main',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {message.sender?.name?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                    )}
                    
                    {!isOwn && !showAvatar && (
                      <Box sx={{ width: { xs: 28, sm: 32 }, mr: { xs: 0.5, sm: 1 } }} />
                    )}
                    
                    <Box sx={{ maxWidth: { xs: '90%', sm: '80%' } }}>
                      {/* Имя отправителя */}
                      {!isOwn && showAvatar && (
                        <Typography variant="caption" sx={{ 
                          ml: { xs: 0.5, sm: 1 }, 
                          mb: 0.5, 
                          display: 'block', 
                          fontWeight: 500,
                          fontSize: { xs: '0.65rem', sm: '0.75rem' }
                        }}>
                          {message.sender?.name || 'Пользователь'}
                        </Typography>
                      )}
                      
                      {/* Пузырек сообщения */}
                      <MessageBubble isOwn={isOwn}>
                        <Typography variant="body2" component="div" sx={{ 
                          fontSize: { xs: '0.875rem', sm: '1rem' } 
                        }}>
                          {message.content}
                        </Typography>
                        
                        {/* Время и статус */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            mt: 0.5,
                            gap: 0.5,
                            opacity: 0.7,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{
                            fontSize: 'inherit'
                          }}>
                            {messageDate.toLocaleTimeString('kk-KZ', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                          
                          {isOwn && (
                            <MessageStatus status={message.status || 'sent'} />
                          )}
                        </Box>
                      </MessageBubble>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
            
            {/* Индикатор набора сообщения */}
            {renderTypingIndicator()}
            
            {/* Элемент для прокрутки вниз */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      
      {/* Индикатор набора текста другим пользователем */}
      <Box sx={{ height: 24 }}>
        {isTyping && typingUserId && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
            Клиент печатает...
          </Typography>
        )}
      </Box>
      
      {/* Форма отправки */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          position: 'relative'
        }}
      >
        {/* Строка ввода и кнопки */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          <TextField
            fullWidth
            placeholder="Хабарламаңызды жазыңыз..."
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={handleMessageChange}
            disabled={sending}
            multiline
            maxRows={4}
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '8px 10px', sm: '8px 14px' }
              }
            }}
          />
          
          {/* Кнопка отправки */}
          <Button
            variant="contained"
            type="submit"
            disabled={sending || !newMessage.trim()}
            sx={{ 
              borderRadius: 2,
              minWidth: { xs: '40px', sm: 'auto' },
              padding: { xs: '6px', sm: '8px 16px' },
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
              }
            }}
          >
            {sending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon size={20} />
            )}
          </Button>
        </Box>
        
        {/* Опция отправки на email */}
        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={sendToEmail} 
                onChange={(e) => setSendToEmail(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Клиентке email арқылы хабарлау ({requesterEmail || 'email көрсетілмеген'})
              </Typography>
            }
          />
        </Box>
      </Box>
      
      {/* Уведомление об успешной отправке */}
      <Snackbar
        open={sendSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message="Хабарлама сәтті жіберілді"
      />
    </Box>
  );
};

export default TicketChat;