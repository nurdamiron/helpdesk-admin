import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Stack
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
  Comment as CommentIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { ticketService } from '../../api/ticketService';

// Компонент отображения сообщения
const MessageItem = ({ message, isClient = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mb: 3,
        p: 2,
        maxWidth: '80%',
        borderRadius: 2,
        bgcolor: isClient ? '#e3f2fd' : '#f5f5f5',
        alignSelf: isClient ? 'flex-end' : 'flex-start',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {isClient ? 'Вы' : message.author || 'Поддержка'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(message.created_at).toLocaleString()}
        </Typography>
      </Box>
      
      <Typography variant="body2">{message.content}</Typography>
    </Box>
  );
};

// Статус заявки
const StatusChip = ({ status }) => {
  let color;
  let label;
  
  switch (status) {
    case 'open':
      color = 'info';
      label = 'Открыта';
      break;
    case 'in_progress':
      color = 'warning';
      label = 'В обработке';
      break;
    case 'resolved':
      color = 'success';
      label = 'Решена';
      break;
    case 'closed':
      color = 'default';
      label = 'Закрыта';
      break;
    default:
      color = 'default';
      label = status;
  }
  
  return <Chip color={color} size="small" label={label} />;
};

// Приоритет заявки
const PriorityChip = ({ priority }) => {
  let color;
  let label;
  
  switch (priority) {
    case 'high':
      color = 'error';
      label = 'Высокий';
      break;
    case 'normal':
      color = 'info';
      label = 'Обычный';
      break;
    case 'low':
      color = 'success';
      label = 'Низкий';
      break;
    default:
      color = 'default';
      label = priority;
  }
  
  return <Chip color={color} size="small" icon={<FlagIcon />} label={label} />;
};

const TicketDetailPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'tickets']);
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Загрузка данных заявки
  useEffect(() => {
    const fetchTicketData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем информацию о заявке
        const data = await ticketService.getTicket(id);
        setTicket(data);
        
        // Загружаем сообщения
        const messagesData = await ticketService.getTicketMessages(id);
        setMessages(messagesData);
      } catch (err) {
        console.error('Error fetching ticket data:', err);
        setError(t('tickets:error.loadFailed', 'Не удалось загрузить информацию о заявке. Проверьте номер заявки и попробуйте снова.'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketData();
  }, [id, t]);
  
  // Обработчик отправки нового сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const messageData = {
        ticket_id: id,
        content: newMessage,
        is_client: true
      };
      
      const response = await ticketService.addMessage(id, messageData);
      
      // Добавляем новое сообщение в список
      setMessages([...messages, response]);
      
      // Очищаем поле ввода
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      // Показываем ошибку (можно использовать snackbar)
      alert(t('tickets:error.sendFailed', 'Не удалось отправить сообщение. Попробуйте позже.'));
    } finally {
      setSending(false);
    }
  };
  
  // Обработчик нажатия Enter в поле ввода
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            sx={{ mt: 3 }} 
            onClick={() => navigate('/')}
          >
            {t('common:backToHome', 'Вернуться на главную')}
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!ticket) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="warning">
            {t('tickets:error.notFound', 'Заявка не найдена. Проверьте номер заявки и попробуйте снова.')}
          </Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            sx={{ mt: 3 }} 
            onClick={() => navigate('/')}
          >
            {t('common:backToHome', 'Вернуться на главную')}
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        {/* Заголовок и информация о заявке */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            {t('common:back', 'Назад')}
          </Button>
          
          <Typography variant="h5" component="h1" gutterBottom>
            {ticket.subject}
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon fontSize="small" />
                {new Date(ticket.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                {ticket.name}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon fontSize="small" />
                {ticket.category?.name || ticket.category}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1}>
                <StatusChip status={ticket.status} />
                <PriorityChip priority={ticket.priority} />
              </Stack>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Исходное сообщение заявки */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            {t('tickets:originalMessage', 'Исходное сообщение')}
          </Typography>
          <Typography variant="body2">{ticket.message}</Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Переписка */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            {t('tickets:conversation', 'Переписка')}
          </Typography>
          
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 3, p: 1 }}>
            {messages.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                {t('tickets:noMessages', 'Пока нет сообщений в этой заявке.')}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    isClient={message.is_client} 
                  />
                ))}
              </Box>
            )}
          </Box>
          
          {/* Форма отправки нового сообщения */}
          {ticket.status !== 'closed' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                placeholder={t('tickets:typeYourMessage', 'Введите ваше сообщение...')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
              />
              <IconButton 
                color="primary" 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sending}
                sx={{ alignSelf: 'flex-end' }}
              >
                {sending ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          )}
          
          {ticket.status === 'closed' && (
            <Alert severity="info">
              {t('tickets:ticketClosed', 'Эта заявка закрыта. Вы не можете добавлять новые сообщения.')}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TicketDetailPublicPage; 