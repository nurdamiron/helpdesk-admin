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
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  Paperclip as PaperclipIcon,
  Image as ImageIcon,
  File as FileIcon,
  Download as DownloadIcon,
  X as XIcon
} from 'lucide-react';

// Импортируем обновленные сервисы и утилиты
import { chatService } from '../../api/chatService';
import { formatDate } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';

const TicketChat = ({ ticketId, requesterEmail }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [sendToEmail, setSendToEmail] = useState(true);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Загрузка сообщений при монтировании компонента
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await chatService.getMessages(ticketId);
        
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data.messages) {
          setMessages(data.messages);
        } else {
          console.warn("Неожиданный формат данных от API:", data);
          setMessages([]);
        }
        
        // Отмечаем сообщения как прочитанные
        await chatService.markMessagesAsRead(ticketId);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке сообщений:', err);
        setError('Не удалось загрузить сообщения');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchMessages();
    }
  }, [ticketId]);

  // Прокрутка чата вниз при получении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Прокрутка чата вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Отправка сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setSending(true);
      
      // Загрузка вложений
      const uploadedAttachments = [];
      for (const file of attachments) {
        const attachment = await chatService.uploadAttachment(ticketId, file);
        uploadedAttachments.push(attachment);
      }

      // Подготовка данных сообщения
      const messageData = {
        body: newMessage.trim(),
        attachments: uploadedAttachments.map(a => a.id),
        sendToEmail: sendToEmail && requesterEmail ? true : false
      };

      // Отправка сообщения
      const response = await chatService.sendMessage(ticketId, messageData);
      
      // Обновление списка сообщений
      if (response) {
        if (Array.isArray(response)) {
          setMessages([...messages, ...response]);
        } else {
          setMessages([...messages, response]);
        }
        
        // Показываем уведомление об успешной отправке на email
        if (sendToEmail && requesterEmail) {
          setSendSuccess(true);
        }
      }
      
      // Очистка формы
      setNewMessage('');
      setAttachments([]);
      setError(null);
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  // Вызов диалога выбора файла
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  // Обработка выбранных файлов
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    // Сброс значения input, чтобы можно было выбрать тот же файл снова
    e.target.value = null;
  };

  // Удаление вложения
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Закрытие уведомления об успешной отправке
  const handleCloseSuccess = () => {
    setSendSuccess(false);
  };

  // Определение, является ли сообщение от текущего пользователя
  const isMessageFromCurrentUser = (senderId, senderType) => {
    if (senderType === 'staff') return true;
    if (user && user.id === senderId) return true;
    return false;
  };

  // Отображение вложений
  const renderAttachment = (attachment) => {
    const isImage = attachment.contentType?.startsWith('image/') || 
                    attachment.file_type?.startsWith('image/');
    
    return (
      <Box 
        key={attachment.id} 
        sx={{ 
          position: 'relative',
          mb: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          p: 1,
          backgroundColor: '#f5f5f5',
        }}
      >
        {isImage ? (
          <ImageIcon size={20} />
        ) : (
          <FileIcon size={20} />
        )}
        <Typography variant="body2" sx={{ ml: 1, flexGrow: 1 }}>
          {attachment.fileName || attachment.file_name}
        </Typography>
        <IconButton 
          size="small" 
          href={attachment.url || `/uploads/${attachment.file_path}`} 
          download={attachment.fileName || attachment.file_name}
          target="_blank"
        >
          <DownloadIcon size={16} />
        </IconButton>
      </Box>
    );
  };

  // Отображение загрузки
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Сообщение об ошибке */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Область сообщений */}
      <Paper 
        variant="outlined" 
        sx={{ 
          height: '500px', 
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          mb: 2
        }}
      >
        {messages.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography color="textSecondary" align="center">
              Сообщений пока нет. Начните общение с клиентом!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            // Определяем тип отправителя
            const isCurrentUser = isMessageFromCurrentUser(
              message.sender?.id || message.sender_id,
              message.sender?.type || message.sender_type
            );
            
            // Данные отправителя
            const senderName = message.sender?.name || 
                              message.sender_name || 
                              (isCurrentUser ? 'Вы' : 'Клиент');
            
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{ 
                    bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main',
                    mr: isCurrentUser ? 0 : 1,
                    ml: isCurrentUser ? 1 : 0,
                  }}
                >
                  {senderName.charAt(0)}
                </Avatar>
                
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                    p: 2,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Typography variant="subtitle2" color={isCurrentUser ? 'primary.contrastText' : 'textPrimary'}>
                    {senderName}
                  </Typography>
                  
                  {(message.body || message.content) && (
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {message.body || message.content}
                    </Typography>
                  )}
                  
                  {(message.attachments && message.attachments.length > 0) && (
                    <Box sx={{ mt: 1 }}>
                      {message.attachments.map(attachment => renderAttachment(attachment))}
                    </Box>
                  )}
                  
                  <Typography
                    variant="caption"
                    color={isCurrentUser ? 'primary.contrastText' : 'textSecondary'}
                    sx={{
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5,
                    }}
                  >
                    {formatDate(message.createdAt || message.created_at)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Форма отправки сообщения */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        {/* Предпросмотр вложений */}
        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Вложения ({attachments.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 0.5,
                    pl: 1,
                  }}
                >
                  {file.type.startsWith('image/') ? (
                    <ImageIcon size={16} />
                  ) : (
                    <FileIcon size={16} />
                  )}
                  <Typography variant="caption" sx={{ ml: 0.5, maxWidth: '120px' }} noWrap>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={() => removeAttachment(index)}>
                    <XIcon size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <form onSubmit={handleSendMessage}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              multiline
              maxRows={4}
              disabled={sending}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {/* Скрытый input для загрузки файлов */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
              />
              <IconButton 
                color="primary" 
                onClick={handleAttachmentClick}
                disabled={sending}
                title="Прикрепить файл"
              >
                <PaperclipIcon />
              </IconButton>
              
              {requesterEmail && (
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
                      Отправить копию на Email клиента
                    </Typography>
                  }
                />
              )}
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={sending || (!newMessage.trim() && attachments.length === 0)}
              startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {sending ? 'Отправка...' : 'Отправить'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {/* Уведомление об успешной отправке на email */}
      <Snackbar
        open={sendSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" variant="filled">
          Сообщение успешно отправлено на Email клиента
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketChat;