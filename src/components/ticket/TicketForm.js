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
import { Send as SendIcon, Login as LoginIcon } from '@mui/icons-material';
import { ticketService } from '../../api/ticketService';
import { useAuth } from '../../contexts/AuthContext';

const TicketForm = ({ onSubmitSuccess }) => {
  const { t } = useTranslation(['common', 'pages', 'tickets']);
  const navigate = useNavigate();
  const { isAuthenticated, user, isStaff } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    type: 'construction', // Установим строительный тип по умолчанию
    message: '',
    priority: 'normal',
  });
  
  // Типы заявок для строительной тематики
  const ticketTypes = [
    { id: 'construction', name: t('tickets:type.construction', 'Строительные работы') },
    { id: 'repair', name: t('tickets:type.repair', 'Ремонт и отделка') },
    { id: 'breakdown', name: t('tickets:type.breakdown', 'Устранение неисправностей') },
    { id: 'consultation', name: t('tickets:type.consultation', 'Консультация специалиста') },
    { id: 'inspection', name: t('tickets:type.inspection', 'Технический осмотр') },
    { id: 'material', name: t('tickets:type.material', 'Доставка материалов') },
    { id: 'emergency', name: t('tickets:type.emergency', 'Аварийная ситуация') },
    { id: 'other', name: t('tickets:type.other', 'Другое') }
  ];
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
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
  
  // Получение категорий с сервера
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ticketService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        // Установим строительные категории на случай ошибки
        setCategories([
          { id: 'foundation', name: t('tickets:category.foundation', 'Фундаментные работы') },
          { id: 'framing', name: t('tickets:category.framing', 'Каркасное строительство') },
          { id: 'roofing', name: t('tickets:category.roofing', 'Кровельные работы') },
          { id: 'plumbing', name: t('tickets:category.plumbing', 'Сантехнические работы') },
          { id: 'electrical', name: t('tickets:category.electrical', 'Электромонтажные работы') },
          { id: 'painting', name: t('tickets:category.painting', 'Малярные работы') },
          { id: 'flooring', name: t('tickets:category.flooring', 'Напольные покрытия') },
          { id: 'materials', name: t('tickets:category.materials', 'Поставка стройматериалов') },
          { id: 'other', name: t('tickets:category.other', 'Другое') }
        ]);
      }
    };
    
    fetchCategories();
  }, [t]);
  
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
    if (!formData.category) errors.category = requiredMessage;
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
      // Преобразуем данные формы в формат, ожидаемый API
      const ticketData = {
        subject: formData.subject,
        description: formData.message, // Преобразуем message в description
        category: formData.category,
        priority: formData.priority,
        user_id: isAuthenticated && user ? user.id : null,
        metadata: {
          type: formData.type, // Используем выбранный тип заявки
          contactPreference: 'email' // По умолчанию предпочтительный способ связи
        },
        requester_metadata: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          full_name: formData.name // Добавляем full_name для совместимости с emailService
        }
      };
      
      // Если это сотрудник, сохраняем информацию в метаданных
      if (isAuthenticated && user && user.role === 'staff') {
        ticketData.metadata.is_staff = true;
        ticketData.metadata.staff_id = user.id;
      }
      
      // Отправляем данные на сервер
      const response = await ticketService.createTicket(ticketData);
      
      // Извлекаем ticket из ответа
      const newTicket = response.ticket || response;
      
      // Вызываем функцию обработки успешной отправки
      if (onSubmitSuccess) {
        onSubmitSuccess(newTicket);
      }
      
      // Очищаем форму после успешной отправки
      if (!isAuthenticated) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          type: 'construction',
          message: '',
          priority: 'normal',
        });
      } else {
        // Для авторизованных пользователей очищаем только поля заявки
        setFormData(prev => ({
          ...prev,
          subject: '',
          category: '',
          type: 'construction',
          message: '',
          priority: 'normal',
        }));
      }
      
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err);
      setError(err.response?.data?.error || t('form.submitError', 'Ошибка при отправке формы. Попробуйте позже.'));
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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>{t('form.error', 'Ошибка')}</AlertTitle>
          {error}
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
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth error={!!formErrors.category} disabled={loading}>
            <InputLabel id="category-label">{t('form.category', 'Категория')}</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label={t('form.category', 'Категория')}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
            {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
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
  );
};

export default TicketForm; 