import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, Grid, Paper, Typography, Chip, Divider, Button,
  CircularProgress, Alert, useTheme, useMediaQuery, Tab, Tabs,
  List, ListItem, ListItemAvatar, Avatar, ListItemText
} from '@mui/material';
import { 
  ArrowBack, Save, CalendarToday,
  Email, Phone, Message, AttachFile
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ticketService } from '../api/ticketService';
import TicketChat from '../components/chat/TicketChat';

// TabPanel component for Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ticket-tabpanel-${index}`}
      aria-labelledby={`ticket-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Компонент страницы с деталями заявки
 * Отображается по-разному в зависимости от роли пользователя
 * @param {Object} props - Component props
 * @param {boolean} props.editMode - Whether to display the page in edit mode
 */
const TicketDetailPage = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isAdmin, isModerator } = useAuth();
  const { t, i18n } = useTranslation(['tickets', 'common']);
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  // Set initial edit state based on editMode prop
  const [isEditing, setIsEditing] = useState(editMode);
  const [savingStatus, setSavingStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  
  // Загрузка данных заявки
  // If in edit mode from URL, show edit form when loaded
  useEffect(() => {
    if (editMode) {
      setIsEditing(true);
    }
  }, [editMode]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        
        // Запрос к API для получения заявки по ID
        const response = await ticketService.getTicketById(id);
        
        // Если был получен объект ticket внутри response, используем его
        const ticketData = response.ticket || response;
        
        console.log('Fetched ticket:', ticketData);
        
        // Проверка доступа для обычного пользователя - должен видеть только свои заявки
        if (user && user.role === 'user' && ticketData.requester?.id !== user.id && ticketData.user_id !== user.id) {
          setError(t('tickets:errors.accessDenied', 'У вас нет доступа к этой заявке'));
          setLoading(false);
          return;
        }
        
        // Если данные пользователя отсутствуют в запросе, добавляем их из текущего пользователя
        if ((!ticketData.requester || !ticketData.requester.name) && user) {
          ticketData.requester = {
            ...ticketData.requester,
            name: user.name || user.full_name || user.email,
            email: user.email,
            id: user.id
          };
        }
        
        setTicket(ticketData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Не удалось загрузить данные заявки: ' + (err.message || 'Неизвестная ошибка'));
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [id, user]);
  
  // Обработчик изменения активной вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Обработчик изменения статуса заявки
  const handleStatusChange = (event) => {
    setTicket(prev => ({
      ...prev,
      status: event.target.value
    }));
  };
  
  // Обработчик изменения приоритета заявки
  const handlePriorityChange = (event) => {
    setTicket(prev => ({
      ...prev,
      priority: event.target.value
    }));
  };
  
  // Обработчик сохранения изменений
  const handleSaveChanges = async () => {
    try {
      setSavingStatus({
        loading: true,
        success: false,
        error: null
      });
      
      // Подготовка данных для обновления
      const ticketData = {
        status: ticket.status,
        priority: ticket.priority,
        // Добавляем только необходимые поля, чтобы не перезаписать лишнее
        metadata: ticket.metadata
      };
      
      // If subject was edited, include it in the update
      if (ticket.subject) {
        ticketData.subject = ticket.subject;
      }
      
      // If description was edited, include it in the update
      if (ticket.description) {
        ticketData.description = ticket.description;
      }
      
      // Отправка запроса к API для обновления заявки
      const response = await ticketService.updateTicket(ticket.id, ticketData);
      
      // Обрабатываем успешный ответ
      console.log('Ticket updated:', response);
      
      setSavingStatus({
        loading: false,
        success: true,
        error: null
      });
      
      // If we're in edit mode (from URL), redirect back to view page after saving
      if (editMode) {
        navigate(`/tickets/${ticket.id}`);
        return;
      }
      
      // For inline edits, show success message and update UI
      // Сбрасываем статус успеха через 3 секунды
      setTimeout(() => {
        setSavingStatus(prev => ({
          ...prev,
          success: false
        }));
        // Exit edit mode if we were editing inline
        if (isEditing) setIsEditing(false);
      }, 3000);
      
      // Обновляем данные заявки на странице
      const updatedTicket = response.ticket || response;
      setTicket(updatedTicket);
      
    } catch (err) {
      console.error('Error saving ticket:', err);
      setSavingStatus({
        loading: false,
        success: false,
        error: 'Не удалось сохранить изменения: ' + (err.message || 'Неизвестная ошибка')
      });
    }
  };
  
  // Обработчик возврата к списку заявок
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Получение цвета для статуса заявки
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error';
      case 'in_progress': return 'warning';
      case 'pending': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };
  
  // Получение текста для статуса заявки
  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'pending': return 'Ожидает';
      case 'resolved': return 'Решена';
      case 'closed': return 'Закрыта';
      default: return status;
    }
  };
  
  // Получение цвета для приоритета заявки
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  // Получение текста для приоритета заявки
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Срочный';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };
  
  // Форматирование даты с учетом выбранного языка
  const formatDate = (dateString) => {
    const currentLang = i18n.language?.substring(0, 2) || 'ru';
    const locale = currentLang === 'en' ? 'en-US' : (currentLang === 'ru' ? 'ru-RU' : 'kk-KZ');
    
    return new Date(dateString).toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Отображение загрузки
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Отображение ошибки
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={handleGoBack}
        >
          {t('common:actions.back', 'Назад')}
        </Button>
      </Box>
    );
  }
  
  // Если заявка не найдена
  if (!ticket) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>{t('tickets:errors.ticketNotFound', 'Заявка не найдена')}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={handleGoBack}
        >
          {t('common:actions.back', 'Назад')}
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Верхняя панель */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={handleGoBack}
          >
            {t('common:actions.back', 'Назад')}
          </Button>
          <Typography variant={isMobile ? 'h6' : 'h5'}>
            {t('tickets:details.ticketId', 'Заявка #{{id}}', {id: ticket.id})}
          </Typography>
          <Chip 
            label={t(`tickets:status.${ticket.status}`, getStatusText(ticket.status))} 
            color={getStatusColor(ticket.status)}
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        
        {/* Кнопка сохранения для админа или модератора */}
        {(isAdmin || isModerator) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={savingStatus.loading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSaveChanges}
            disabled={savingStatus.loading}
          >
            {savingStatus.loading ? t('tickets:actions.saving', 'Сохранение...') : t('tickets:actions.saveChanges', 'Сохранить изменения')}
          </Button>
        )}
      </Box>
      
      {/* Сообщение об успешном сохранении */}
      {savingStatus.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t('tickets:alerts.saveSuccess', 'Изменения успешно сохранены')}
        </Alert>
      )}
      
      {/* Сообщение об ошибке сохранения */}
      {savingStatus.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {savingStatus.error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Основная информация о заявке */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {ticket.subject}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('tickets:details.type', 'Тип:')}
                </Typography>
                <Typography variant="body1">
                  {t(`tickets:type.${ticket.type}`, ticket.type)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('tickets:details.category', 'Категория:')}
                </Typography>
                <Typography variant="body1">
                  {t(`tickets:category.${ticket.category}`, ticket.category)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('tickets:details.priority', 'Приоритет:')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Chip 
                    label={t(`tickets:priority.${ticket.priority}`, getPriorityText(ticket.priority))}
                    color={getPriorityColor(ticket.priority)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('tickets:details.createdAt', 'Дата создания:')}
                </Typography>
                <Typography variant="body1">
                  {formatDate(ticket.created_at)}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              {t('tickets:details.description', 'Описание:')}
            </Typography>
            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
            
            {ticket.attachments && ticket.attachments.length > 0 && (
              <>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  {t('tickets:details.attachments', 'Вложения:')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {ticket.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      icon={<AttachFile />}
                      label={attachment.filename}
                      variant="outlined"
                      clickable
                      component="a"
                      href={attachment.url}
                      target="_blank"
                    />
                  ))}
                </Box>
              </>
            )}
          </Paper>
          
          {/* Вкладки с чатом и историей */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
              >
                <Tab label={t('tickets:tabs.discussion', 'Обсуждение')} />
                <Tab label={t('tickets:tabs.history', 'История')} />
              </Tabs>
            </Box>
            
            {/* Вкладка обсуждения */}
            <TabPanel value={activeTab} index={0}>
              <TicketChat 
                ticketId={ticket.id}
                messages={ticket.messages}
                userRole={user?.role}
              />
            </TabPanel>
            
            {/* Вкладка истории */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                {t('tickets:tabs.historyComingSoon', 'История изменений будет доступна в ближайшее время')}
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
        
        {/* Боковая панель */}
        <Grid item xs={12} md={4}>
          {/* Управление заявкой (только для админа и модератора) */}
          {(isAdmin || isModerator) && (
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('tickets:management.title', 'Управление заявкой')}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('tickets:management.status', 'Статус:')}
                </Typography>
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    marginBottom: '16px'
                  }}
                >
                  <option value="new">{t('tickets:status.new', 'Новая')}</option>
                  <option value="in_progress">{t('tickets:status.in_progress', 'В работе')}</option>
                  <option value="pending">{t('tickets:status.pending', 'Ожидает')}</option>
                  <option value="resolved">{t('tickets:status.resolved', 'Решена')}</option>
                  <option value="closed">{t('tickets:status.closed', 'Закрыта')}</option>
                </select>
                
                <Typography variant="subtitle2" gutterBottom>
                  {t('tickets:management.priority', 'Приоритет:')}
                </Typography>
                <select
                  value={ticket.priority}
                  onChange={handlePriorityChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="low">{t('tickets:priority.low', 'Низкий')}</option>
                  <option value="medium">{t('tickets:priority.medium', 'Средний')}</option>
                  <option value="high">{t('tickets:priority.high', 'Высокий')}</option>
                  <option value="urgent">{t('tickets:priority.urgent', 'Срочный')}</option>
                </select>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={savingStatus.loading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSaveChanges}
                disabled={savingStatus.loading}
              >
                {savingStatus.loading ? t('tickets:actions.saving', 'Сохранение...') : t('tickets:actions.saveChanges', 'Сохранить изменения')}
              </Button>
            </Paper>
          )}
          
          {/* Информация о пользователе */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('tickets:details.requesterInfo', 'Информация о заявителе')}
            </Typography>
            
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar>{ticket.requester?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={ticket.requester?.name || ticket.requester?.full_name || user?.name || user?.full_name || user?.email || t('tickets:details.unknownUser', 'Неизвестный пользователь')}
                  secondary={ticket.requester?.email || user?.email || ''}
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2 }}>
              {ticket.requester?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                  <Typography variant="body2">
                    {ticket.requester.phone}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                <Typography variant="body2">
                  {ticket.requester?.email || t('tickets:details.noData', 'Нет данных')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Message fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                <Typography variant="body2">
                  {t('tickets:details.contactPreference', 'Предпочтительный способ связи')}: {ticket.metadata?.contactPreference === 'email' ? 'Email' : t('tickets:details.phone', 'Телефон')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                <Typography variant="body2">
                  {t('tickets:details.created', 'Создано')}: {formatDate(ticket.created_at)}
                </Typography>
              </Box>
            </Box>
            
            {ticket.assigned_user && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  {t('tickets:details.assignedTo', 'Назначено:')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                    {ticket.assigned_user.name?.charAt(0) || 'M'}
                  </Avatar>
                  <Typography variant="body2">
                    {ticket.assigned_user.name || ticket.assigned_user.email}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetailPage;