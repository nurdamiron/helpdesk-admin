// src/components/chat/TicketChat.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  Badge,
  Alert,
} from '@mui/material';
import {
  Send,
  Paperclip,
  Image,
  File,
  Download,
  X,
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { chatService } from '../../api/chatService';
import { useAuth } from '../../contexts/AuthContext';

const TicketChat = ({ ticketId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Загрузка сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await chatService.getMessages(ticketId);
        setMessages(data);
        // Отмечаем сообщения как прочитанные
        await chatService.markMessagesAsRead(ticketId);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Не удалось загрузить сообщения');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ticketId]);

  // Прокрутка чата вниз при получении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setSending(true);
      
      // Отправка вложений, если они есть
      const uploadedAttachments = [];
      for (const file of attachments) {
        const response = await chatService.uploadAttachment(ticketId, file);
        uploadedAttachments.push(response);
      }

      // Отправка сообщения
      const messageData = {
        body: newMessage.trim(),
        attachments: uploadedAttachments.map(a => a.id),
      };

      const response = await chatService.sendMessage(ticketId, messageData);
      
      // Обновляем список сообщений
      setMessages([...messages, response]);
      setNewMessage('');
      setAttachments([]);
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    // Сброс значения input, чтобы можно было выбрать тот же файл снова
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Определяем, является ли сообщение от текущего пользователя
  const isMessageFromCurrentUser = (senderId) => {
    return user && user.id === senderId;
  };

  // Отображение вложений
  const renderAttachment = (attachment) => {
    const isImage = attachment.contentType?.startsWith('image/');
    
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
          <Image size={20} />
        ) : (
          <File size={20} />
        )}
        <Typography variant="body2" sx={{ ml: 1, flexGrow: 1 }}>
          {attachment.fileName}
        </Typography>
        <IconButton 
          size="small" 
          href={attachment.url} 
          download={attachment.fileName}
          target="_blank"
        >
          <Download size={16} />
        </IconButton>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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
            <Typography color="textSecondary">
              Сообщений пока нет. Начните общение с клиентом!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isCurrentUser = isMessageFromCurrentUser(message.sender.id);
            
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
                  src={message.sender.avatar}
                  sx={{ 
                    bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main',
                    mr: isCurrentUser ? 0 : 1,
                    ml: isCurrentUser ? 1 : 0,
                  }}
                >
                  {message.sender.name?.charAt(0) || 'U'}
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
                    {message.sender.name || 'Неизвестный пользователь'}
                  </Typography>
                  
                  {message.body && (
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {message.body}
                    </Typography>
                  )}
                  
                  {message.attachments && message.attachments.length > 0 && (
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
                    {formatDate(message.createdAt)}
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
                    <Image size={16} />
                  ) : (
                    <File size={16} />
                  )}
                  <Typography variant="caption" sx={{ ml: 0.5, maxWidth: '120px' }} noWrap>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={() => removeAttachment(index)}>
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <form onSubmit={handleSendMessage}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mr: 1 }}
              multiline
              maxRows={4}
              disabled={sending}
            />
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
            >
              <Paperclip />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={sending || (!newMessage.trim() && attachments.length === 0)}
              startIcon={sending ? <CircularProgress size={20} /> : <Send />}
              sx={{ ml: 1 }}
            >
              {sending ? 'Отправка...' : 'Отправить'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TicketChat;