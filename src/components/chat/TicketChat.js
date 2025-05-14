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
  Paperclip as PaperclipIcon,
  Image as ImageIcon,
  File as FileIcon,
  Download as DownloadIcon,
  X as XIcon,
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
}));

// Компонент статуса сообщения
const MessageStatus = ({ status }) => {
  switch(status) {
    case 'sending':
      return <Clock size={14} color="#9e9e9e" />;
    case 'sent':
      return <CheckCircle size={14} color="#9e9e9e" />;
    case 'delivered':
      return (
        <Box sx={{ display: 'flex' }}>
          <CheckCircle size={14} color="#2196f3" />
          <CheckCircle size={14} color="#2196f3" style={{ marginLeft: -5 }} />
        </Box>
      );
    case 'read':
      return (
        <Box sx={{ display: 'flex' }}>
          <CheckCircle size={14} color="#4caf50" />
          <CheckCircle size={14} color="#4caf50" style={{ marginLeft: -5 }} />
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
  const [attachments, setAttachments] = useState([]);
  const [sendToEmail, setSendToEmail] = useState(true); // По умолчанию включено
  const [sendSuccess, setSendSuccess] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineMessages, setOfflineMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
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
        setMessages(prev => {
          // Избегаем дублирования сообщений
          if (!prev.some(msg => msg.id === newMessage.id)) {
            return [...prev, newMessage];
          }
          return prev;
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

  // Отправка офлайн сообщений
  const sendOfflineMessages = async () => {
    if (offlineMessages.length === 0) return;
    
    const messagesToSend = [...offlineMessages];
    setOfflineMessages([]);
    
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
    
    // Проверяем, есть ли текст или вложения
    if (!newMessage.trim() && attachments.length === 0) {
      setError('Добавьте текст сообщения или вложение');
      return;
    }
    
    setSending(true);
    
    try {
      // Если мы в офлайн режиме, сохраняем сообщение локально
      if (offlineMode || !wsConnected) {
        // Добавляем сообщение локально
        const tempId = Date.now().toString();
        const offlineMessage = {
          id: tempId,
          content: newMessage,
          created_at: new Date().toISOString(),
          sender: {
            id: user.id,
            name: user.displayName || user.email,
            type: 'staff'
          },
          status: 'sending',
          notifyRequester: sendToEmail
        };
        
        // Добавляем в локальный массив сообщений
        setMessages(prev => [...prev, offlineMessage]);
        setOfflineMessages(prev => [...prev, { 
          id: tempId, 
          content: newMessage, 
          notifyRequester: sendToEmail 
        }]);
        
        // Очищаем форму
        setNewMessage('');
        setAttachments([]);
        setSendSuccess(true);
      } else {
        // Если онлайн - отправляем через API
        const messageData = new FormData();
        messageData.append('content', newMessage);
        messageData.append('sender_type', 'staff');
        messageData.append('notify_requester', sendToEmail);
        
        // Добавляем вложения, если есть
        attachments.forEach((file, index) => {
          messageData.append(`attachments[${index}]`, file);
        });
        
        const response = await api.post(`/tickets/${ticketId}/messages`, messageData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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
        setAttachments([]);
        setSendSuccess(true);
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  // Обработчик клика на кнопку прикрепления файла
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
      // Сбрасываем input
      e.target.value = null;
    }
  };

  // Удаление вложения
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Закрытие уведомления об успешной отправке
  const handleCloseSuccess = () => {
    setSendSuccess(false);
  };

  // Проверяем, является ли сообщение от текущего пользователя
  const isMessageFromCurrentUser = (senderId, senderType) => {
    return (senderType === 'staff' && user && (senderId === user.id || senderId === user.email));
  };

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
            Офлайн режим - байланыс қалпына келгенде хабарламалар жіберіледі
          </Typography>
        </Box>
      );
    }
    
    if (!wsConnected) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'error.light',
          color: 'error.contrastText',
          py: 1,
          px: 2
        }}>
          <WifiOffIcon size={16} style={{ marginRight: 8 }} />
          <Typography variant="body2" fontWeight={500}>
            Сервермен байланыс жоқ
          </Typography>
          <Button 
            size="small" 
            variant="contained" 
            sx={{ ml: 2, minWidth: 0, px: 1 }}
            onClick={() => wsRef.current?.reconnect()}
          >
            <RefreshCw size={16} />
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
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        mb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Өтінішті талқылау #{ticketId}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          p: 2,
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
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500, bgcolor: 'background.paper' }}
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
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: message.sender?.type === 'requester' ? 'primary.main' : 'secondary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {message.sender?.name?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                    )}
                    
                    {!isOwn && !showAvatar && (
                      <Box sx={{ width: 32, mr: 1 }} />
                    )}
                    
                    <Box sx={{ maxWidth: '80%' }}>
                      {/* Имя отправителя */}
                      {!isOwn && showAvatar && (
                        <Typography variant="caption" sx={{ ml: 1, mb: 0.5, display: 'block', fontWeight: 500 }}>
                          {message.sender?.name || 'Пользователь'}
                        </Typography>
                      )}
                      
                      {/* Пузырек сообщения */}
                      <MessageBubble isOwn={isOwn}>
                        <Typography variant="body2" component="div">
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
                            fontSize: '0.7rem'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
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
                      
                      {/* Вложения */}
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mt: 1, ml: isOwn ? 0 : 1 }}>
                          {message.attachments.map((attachment, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                p: 1,
                                bgcolor: isOwn ? alpha(theme.palette.primary.main, 0.05) : '#f0f0f0',
                                borderRadius: 1,
                                mb: 0.5
                              }}
                            >
                              <FileIcon size={16} style={{ marginRight: 8 }} />
                              <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                                {attachment.filename || 'Файл'}
                              </Typography>
                              <Tooltip title="Жүктеп алу">
                                <IconButton 
                                  size="small"
                                  component="a"
                                  href={attachment.url}
                                  download
                                  target="_blank"
                                >
                                  <DownloadIcon size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ))}
                        </Box>
                      )}
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
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          position: 'relative'
        }}
      >
        {/* Вложения */}
        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 1
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Тіркемелер:
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => removeAttachment(index)}
                  icon={<FileIcon size={16} />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Строка ввода и кнопки */}
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            sx={{ bgcolor: 'background.paper' }}
          />
          
          {/* Кнопка добавления вложений */}
          <Tooltip title="Файл тіркеу">
            <IconButton 
              type="button" 
              onClick={handleAttachmentClick}
              disabled={sending}
              sx={{ color: 'primary.main' }}
            >
              <PaperclipIcon size={20} />
            </IconButton>
          </Tooltip>
          
          {/* Кнопка отправки */}
          <Button
            variant="contained"
            type="submit"
            disabled={sending || (!newMessage.trim() && attachments.length === 0)}
            sx={{ 
              borderRadius: 2,
              minWidth: 'auto',
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
          
          {/* Скрытый input для выбора файлов */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple
          />
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
              <Typography variant="body2">
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