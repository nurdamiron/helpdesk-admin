import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Paper
} from '@mui/material';
import { Send as SendIcon, Login as LoginIcon, Email as EmailIcon, Telegram as TelegramIcon } from '@mui/icons-material';
import { ticketService } from '../../api/ticketService';
import { useAuth } from '../../contexts/AuthContext';
import SuccessNotification from '../common/SuccessNotification';
import WhatsAppIcon from '../common/WhatsAppIcon';

const TicketForm = ({ onSubmitSuccess }) => {
  const { t } = useTranslation(['common', 'pages', 'tickets']);
  const navigate = useNavigate();
  const { isAuthenticated, user, isStaff } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    type: 'support_request', // Установим тип по умолчанию для службы поддержки
    message: '',
    priority: 'medium',
    communicationChannel: 'email', // Канал связи по умолчанию
  });
  
  // Типы заявок для службы поддержки сотрудников
  const ticketTypes = [
    { id: 'incident', name: t('tickets:type.incident', 'Инцидент') },
    { id: 'support_request', name: t('tickets:type.support_request', 'Запрос') },
    { id: 'complaint', name: t('tickets:type.complaint', 'Жалоба') }
  ];
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successType, setSuccessType] = useState('email');
  const [createdTicketId, setCreatedTicketId] = useState(null);
  
  // Если пользователь авторизован, заполняем его данные
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.first_name || user.last_name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [isAuthenticated, user]);
  
  // Перенаправляем на страницу логина
  const handleLogin = () => {
    navigate('/login', { state: { from: '/', message: 'Пожалуйста, войдите в систему для создания заявки.' } });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаем ошибку валидации при изменении поля
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const requiredMessage = t('form.required', 'Обязательное поле');
    
    // Проверка обязательных полей
    if (!formData.name.trim()) errors.name = requiredMessage;
    if (!formData.email.trim()) errors.email = requiredMessage;
    if (!formData.subject.trim()) errors.subject = requiredMessage;
    if (!formData.message.trim()) errors.message = requiredMessage;
    if (!formData.type) errors.type = requiredMessage;
    
    // Проверка email на валидность
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('form.invalidEmail', 'Некорректный email адрес');
    }
    
    // Проверка телефона (если указан)
    if (formData.phone.trim() && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      errors.phone = t('form.invalidPhone', 'Некорректный номер телефона');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // форма валидна, если ошибок нет
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Если сотрудник не авторизован, показываем сообщение
    if (isStaff && !isAuthenticated) {
      setError(t('form.authRequired', 'Сотрудникам необходимо авторизоваться для создания заявок.'));
      return;
    }
    
    // Сбрасываем предыдущую ошибку
    setError(null);
    
    // Проверяем валидность формы
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Если выбран WhatsApp или Telegram, обрабатываем особым образом
      if (formData.communicationChannel === 'whatsapp' || formData.communicationChannel === 'telegram') {
        // Подготовка текста сообщения для WhatsApp
        const message = `🎫 *НОВАЯ ЗАЯВКА В СЛУЖБУ ПОДДЕРЖКИ*\n\n` +
          `👤 *Сотрудник:* ${formData.name}\n` +
          `📧 *Email:* ${formData.email}\n` +
          `📱 *Телефон:* ${formData.phone || 'Не указан'}\n\n` +
          `📋 *Тема обращения:* ${formData.subject}\n` +
          `🏷️ *Тип заявки:* ${ticketTypes.find(t => t.id === formData.type)?.name || formData.type}\n` +
          `⚡ *Приоритет:* ${formData.priority === 'low' ? 'Низкий' : formData.priority === 'medium' ? 'Средний' : formData.priority === 'high' ? 'Высокий' : 'Срочный'}\n\n` +
          `📝 *Описание проблемы:*\n${formData.message}\n\n` +
          `#поддержка #helpdesk #сотрудник`;
        
        // Создаем URL для WhatsApp или Telegram
        let messengerUrl;
        let communicationChannel;
        
        if (formData.communicationChannel === 'whatsapp') {
          const whatsappNumber = '77770131838'; // Номер без + и пробелов
          const encodedMessage = encodeURIComponent(message);
          messengerUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
          communicationChannel = 'whatsapp';
        } else {
          // Telegram
          const telegramBotUsername = 'HelpdeskKZBot'; // Ваш реальный бот
          const encodedMessage = encodeURIComponent(message);
          messengerUrl = `https://t.me/${telegramBotUsername}?start=${encodedMessage}`;
          communicationChannel = 'telegram';
        }
        
        // Сохраняем заявку в системе со статусом 'messenger_pending'
        const ticketData = {
          subject: formData.subject,
          description: formData.message,
          type: formData.type,
          priority: formData.priority,
          status: communicationChannel === 'whatsapp' ? 'whatsapp_pending' : 'telegram_pending',
          user_id: isAuthenticated && user ? user.id : null,
          metadata: {
            contactPreference: 'email',
            communicationChannel: communicationChannel,
            messengerSent: false
          },
          requester_metadata: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            full_name: formData.name
          }
        };
        
        // Отправляем данные на сервер (используем публичный endpoint для неавторизованных пользователей)
        const response = await ticketService.createTicket(ticketData, !isAuthenticated);
        const newTicket = response.ticket || response;
        
        // Открываем мессенджер в новом окне
        window.open(messengerUrl, '_blank');
        
        // Показываем уведомление об успехе
        setError(null);
        setSuccessType(communicationChannel);
        setCreatedTicketId(newTicket.id);
        setShowSuccessNotification(true);
        
      } else {
        // Обычная отправка через Email
        const ticketData = {
          subject: formData.subject,
          description: formData.message,
          type: formData.type,
          priority: formData.priority,
          user_id: isAuthenticated && user ? user.id : null,
          metadata: {
            type: formData.type,
            contactPreference: 'email',
            communicationChannel: 'email'
          },
          requester_metadata: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            full_name: formData.name
          }
        };
        
        // Отправляем данные на сервер (используем публичный endpoint для неавторизованных пользователей)
        const response = await ticketService.createTicket(ticketData, !isAuthenticated);
        const newTicket = response.ticket || response;
        
        // Показываем уведомление об успехе
        setError(null);
        setSuccessType('email');
        setCreatedTicketId(newTicket.id);
        setShowSuccessNotification(true);
      }
      
      // Очищаем форму после успешной отправки
      if (!isAuthenticated) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          type: 'support_request',
          message: '',
          priority: 'medium',
          communicationChannel: 'email',
        });
      } else {
        // Для авторизованных пользователей очищаем только поля заявки
        setFormData(prev => ({
          ...prev,
          subject: '',
          type: 'support_request',
          message: '',
          priority: 'medium',
          communicationChannel: 'email',
        }));
      }
      
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err);
      
      // Проверяем, является ли это ошибкой аутентификации
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError(t('form.authError', 'Для отправки заявки требуется авторизация. Пожалуйста, войдите в систему.'));
      } else if (!err.response) {
        // Ошибка сети
        setError(t('form.networkError', 'Ошибка соединения с сервером. Проверьте подключение к интернету.'));
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || t('form.submitError', 'Ошибка при отправке формы. Попробуйте позже.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Если пользователь является сотрудником и не авторизован
  if (isStaff && !isAuthenticated) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {t('form.staffAuthRequired', 'Авторизация для сотрудников')}
        </Typography>
        
        <Typography paragraph>
          {t('form.staffAuthMessage', 'Для создания заявок сотрудникам необходимо войти в систему.')}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoginIcon />}
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          {t('form.login', 'Войти в систему')}
        </Button>
      </Paper>
    );
  }
  
  return (
    <>
      <SuccessNotification
        open={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        type={successType}
        ticketId={createdTicketId}
        autoRedirect={true}
        redirectDelay={3000}
      />
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>{t('form.error', 'Ошибка')}</AlertTitle>
          {error}
          {error.includes('авторизация') && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
              >
                {t('form.login', 'Войти в систему')}
              </Button>
            </Box>
          )}
        </Alert>
      )}
      
      <Typography variant="h6" gutterBottom>
        {t('form.contactInfo', 'Контактная информация')}
      </Typography>
      
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="name"
            name="name"
            label={t('form.name', 'Имя')}
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={loading || (isAuthenticated && user)}
            inputProps={{
              style: {
                fontSize: '1rem',
                padding: '14px 12px'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label={t('form.email', 'Email')}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={loading || (isAuthenticated && user)}
            inputProps={{
              style: {
                fontSize: '1rem',
                padding: '14px 12px'
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t('form.phone', 'Телефон (необязательно)')}
            value={formData.phone}
            onChange={handleChange}
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            disabled={loading}
            inputProps={{
              style: {
                fontSize: '1rem',
                padding: '14px 12px'
              }
            }}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        {t('form.ticketDetails', 'Информация о заявке')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="subject"
            name="subject"
            label={t('form.subject', 'Тема')}
            value={formData.subject}
            onChange={handleChange}
            error={!!formErrors.subject}
            helperText={formErrors.subject}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth error={!!formErrors.type} disabled={loading}>
            <InputLabel id="type-label">{t('tickets:create.ticketType', 'Тип заявки')}</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label={t('tickets:create.ticketType', 'Тип заявки')}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              {ticketTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
            {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="priority-label">{t('form.priority', 'Приоритет')}</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label={t('form.priority', 'Приоритет')}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              <MenuItem value="low">{t('tickets:priority.low', 'Низкий')}</MenuItem>
              <MenuItem value="medium">{t('tickets:priority.medium', 'Средний')}</MenuItem>
              <MenuItem value="high">{t('tickets:priority.high', 'Высокий')}</MenuItem>
              <MenuItem value="urgent">{t('tickets:priority.urgent', 'Срочный')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            id="message"
            name="message"
            label={t('form.message', 'Сообщение')}
            value={formData.message}
            onChange={handleChange}
            error={!!formErrors.message}
            helperText={formErrors.message}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              {t('tickets:create.communicationChannel', 'Способ подачи заявки')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button
                variant={formData.communicationChannel === 'email' ? 'contained' : 'outlined'}
                onClick={() => setFormData(prev => ({ ...prev, communicationChannel: 'email' }))}
                startIcon={<EmailIcon />}
                sx={{ 
                  flex: 1, 
                  minWidth: '200px',
                  py: 1.5,
                  ...(formData.communicationChannel === 'email' ? {
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  } : {})
                }}
                disabled={loading}
              >
                Email
              </Button>
              <Button
                variant={formData.communicationChannel === 'whatsapp' ? 'contained' : 'outlined'}
                onClick={() => setFormData(prev => ({ ...prev, communicationChannel: 'whatsapp' }))}
                startIcon={<WhatsAppIcon />}
                sx={{ 
                  flex: 1, 
                  minWidth: '200px',
                  py: 1.5,
                  ...(formData.communicationChannel === 'whatsapp' ? {
                    bgcolor: '#25D366',
                    color: 'white',
                    '&:hover': { bgcolor: '#1DA851' }
                  } : {
                    borderColor: '#25D366',
                    color: '#25D366',
                    '&:hover': { 
                      borderColor: '#1DA851',
                      bgcolor: 'rgba(37, 211, 102, 0.04)'
                    }
                  })
                }}
                disabled={loading}
              >
                WhatsApp
              </Button>
              <Button
                variant={formData.communicationChannel === 'telegram' ? 'contained' : 'outlined'}
                onClick={() => setFormData(prev => ({ ...prev, communicationChannel: 'telegram' }))}
                startIcon={<TelegramIcon />}
                sx={{ 
                  flex: 1, 
                  minWidth: '200px',
                  py: 1.5,
                  ...(formData.communicationChannel === 'telegram' ? {
                    bgcolor: '#0088cc',
                    color: 'white',
                    '&:hover': { bgcolor: '#006bb3' }
                  } : {
                    borderColor: '#0088cc',
                    color: '#0088cc',
                    '&:hover': { 
                      borderColor: '#006bb3',
                      bgcolor: 'rgba(0, 136, 204, 0.04)'
                    }
                  })
                }}
                disabled={loading}
              >
                Telegram
              </Button>
            </Box>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
              {formData.communicationChannel === 'whatsapp' 
                ? t('tickets:create.whatsappHint', 'Заявка будет отправлена через WhatsApp на номер службы поддержки +7 777 013 1838. Дальнейшая работа ведется по email.')
                : formData.communicationChannel === 'telegram'
                ? t('tickets:create.telegramHint', 'Заявка будет отправлена через Telegram бот @HelpdeskKZBot. Дальнейшая работа ведется по email.')
                : t('tickets:create.emailHint', 'Заявка будет зарегистрирована в системе поддержки и вы получите уведомление на email')
              }
            </Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', sm: 'flex-start' },
            mt: 2 
          }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              sx={{ 
                py: { xs: 1.5, sm: 1 },
                px: { xs: 3, sm: 2 },
                fontSize: { xs: '1rem', sm: 'inherit' },
                width: { xs: '100%', sm: 'auto' },
                maxWidth: '400px'
              }}
            >
              {loading 
                ? t('form.sending', 'Отправка...') 
                : t('form.submit', 'Отправить заявку')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default TicketForm; 