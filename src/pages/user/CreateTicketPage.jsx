import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TicketForm from '../../components/ticket/TicketForm';

const CreateTicketPage = () => {
  const { t } = useTranslation(['tickets', 'common']);
<<<<<<< HEAD

=======
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Состояние шагов формы
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    t('tickets:create.typeStep', 'Тип заявки'), 
    t('tickets:create.detailsStep', 'Детали заявки'), 
    t('tickets:create.confirmationStep', 'Подтверждение')
  ];
  
  // Данные формы
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    contactPreference: 'email',
    communicationChannel: 'email' // Добавляем выбор канала связи
  });
  
  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);
  
  // Категории заявок для службы поддержки сотрудников
  const categories = [
    { value: 'technical', label: t('tickets:category.technical', 'Техническая проблема') },
    { value: 'billing', label: t('tickets:category.billing', 'Биллинг и расчеты') },
    { value: 'general', label: t('tickets:category.general', 'Общие вопросы') },
    { value: 'it_support', label: t('tickets:category.it_support', 'IT поддержка') },
    { value: 'equipment_issue', label: t('tickets:category.equipment_issue', 'Проблемы с оборудованием') },
    { value: 'software_issue', label: t('tickets:category.software_issue', 'Проблемы с ПО') },
    { value: 'access_request', label: t('tickets:category.access_request', 'Запрос доступа') },
    { value: 'complaint', label: t('tickets:category.complaint', 'Жалоба') },
    { value: 'suggestion', label: t('tickets:category.suggestion', 'Предложение') },
    { value: 'hr_question', label: t('tickets:category.hr_question', 'Вопрос по HR') },
    { value: 'safety_issue', label: t('tickets:category.safety_issue', 'Вопрос безопасности') },
    { value: 'training_request', label: t('tickets:category.training_request', 'Запрос на обучение') },
    { value: 'policy_question', label: t('tickets:category.policy_question', 'Вопрос по политикам') },
    { value: 'other', label: t('tickets:category.other', 'Другое') }
  ];
  
  // Типы заявок для службы поддержки сотрудников
  const ticketTypes = [
    { value: 'support_request', label: t('tickets:type.support_request', 'Запрос поддержки') },
    { value: 'incident', label: t('tickets:type.incident', 'Инцидент') },
    { value: 'complaint', label: t('tickets:type.complaint', 'Жалоба') },
    { value: 'suggestion', label: t('tickets:type.suggestion', 'Предложение по улучшению') },
    { value: 'access_request', label: t('tickets:type.access_request', 'Запрос доступа') },
    { value: 'information_request', label: t('tickets:type.information_request', 'Запрос информации') },
    { value: 'emergency', label: t('tickets:type.emergency', 'Срочная проблема') },
    { value: 'other', label: t('tickets:type.other', 'Другое') }
  ];
  
  // Приоритеты заявок
  const priorities = [
    { value: 'low', label: t('tickets:priority.low', 'Низкий') },
    { value: 'medium', label: t('tickets:priority.medium', 'Средний') },
    { value: 'high', label: t('tickets:priority.high', 'Высокий') },
    { value: 'urgent', label: t('tickets:priority.urgent', 'Срочный') }
  ];
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Переход к следующему шагу
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  // Возврат к предыдущему шагу
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Проверка валидности текущего шага
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.type !== '' && formData.category !== '';
      case 1:
        return formData.subject !== '' && formData.description !== '';
      case 2:
        return true;
      default:
        return false;
    }
  };
  
  // Возврат к списку заявок
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  // Отправка формы
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Если выбран WhatsApp, создаем ссылку для отправки
      if (formData.communicationChannel === 'whatsapp') {
        // Подготовка текста сообщения для WhatsApp
        const message = `🎫 *НОВАЯ ЗАЯВКА В СЛУЖБУ ПОДДЕРЖКИ*\n\n` +
          `👤 *Сотрудник:* ${user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}\n` +
          `📧 *Email:* ${user?.email}\n` +
          `📱 *Телефон:* ${user?.phone || 'Не указан'}\n\n` +
          `📋 *Тема обращения:* ${formData.subject}\n` +
          `🏷️ *Тип заявки:* ${ticketTypes.find(t => t.value === formData.type)?.label || formData.type}\n` +
          `📂 *Категория:* ${categories.find(c => c.value === formData.category)?.label || formData.category}\n` +
          `⚡ *Приоритет:* ${priorities.find(p => p.value === formData.priority)?.label || formData.priority}\n\n` +
          `📝 *Описание проблемы:*\n${formData.description}\n\n` +
          `#поддержка #helpdesk #сотрудник`;
        
        // Создаем WhatsApp URL
        const whatsappNumber = '77770131838'; // Номер без + и пробелов
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Сохраняем заявку в системе со статусом 'whatsapp_pending'
        const ticketData = {
          ...formData,
          user_id: user?.id,
          status: 'whatsapp_pending',
          metadata: {
            contactPreference: formData.contactPreference,
            type: formData.type,
            communicationChannel: 'whatsapp',
            whatsappSent: false
          },
          requester_metadata: {
            email: user?.email,
            name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email,
            phone: user?.phone || '',
            full_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email
          }
        };
        
        // Создаем тикет в системе
        const response = await ticketService.createTicket(ticketData);
        
        setSuccess(true);
        setLoading(false);
        
        // Открываем WhatsApp (оптимизировано для мобильных)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // На мобильных устройствах используем прямой переход
          window.location.href = whatsappUrl;
        } else {
          // На десктопе открываем в новом окне и перенаправляем
          const newWindow = window.open(whatsappUrl, '_blank');
          if (!newWindow) {
            // Если заблокировано всплывающее окно, используем прямой переход
            window.location.href = whatsappUrl;
          } else {
            // Если успешно открыли в новом окне, перенаправляем на главную
            navigate('/');
          }
        }
        
      } else {
        // Обычная отправка через Email
        const ticketData = {
          ...formData,
          user_id: user?.id,
          status: 'new',
          metadata: {
            contactPreference: formData.contactPreference,
            type: formData.type,
            communicationChannel: 'email'
          },
          requester_metadata: {
            email: user?.email,
            name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email,
            phone: user?.phone || '',
            full_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email
          }
        };
        
        // Отправка данных через API сервис
        const response = await ticketService.createTicket(ticketData);
        
        console.log('Ticket created successfully:', response);
        setSuccess(true);
        setLoading(false);
        setCreatedTicketId(response.id);
        setShowSuccessModal(true);
      }
      
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(t('tickets:errors.createFailed', 'Не удалось создать заявку. Пожалуйста, попробуйте позже.'));
      setLoading(false);
    }
  };
  
  // Отображение содержимого в зависимости от текущего шага
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('tickets:create.ticketType', 'Тип заявки')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label={t('tickets:create.ticketType', 'Тип заявки')}
                  MenuProps={{ 
                    PaperProps: { 
                      style: { 
                        maxHeight: '300px',
                      } 
                    },
                    MenuListProps: {
                      style: { padding: '0' }
                    }
                  }}
                  sx={{
                    '.MuiSelect-select': {
                      padding: { xs: '12px 14px', sm: '16px 14px' }
                    }
                  }}
                >
                  {ticketTypes.map(type => (
                    <MenuItem 
                      key={type.value} 
                      value={type.value}
                      sx={{ 
                        minHeight: { xs: '40px', sm: '48px' },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('tickets:create.category', 'Категория')}</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label={t('tickets:create.category', 'Категория')}
                  MenuProps={{ 
                    PaperProps: { 
                      style: { 
                        maxHeight: '300px',
                      } 
                    },
                    MenuListProps: {
                      style: { padding: '0' }
                    }
                  }}
                  sx={{
                    '.MuiSelect-select': {
                      padding: { xs: '12px 14px', sm: '16px 14px' }
                    }
                  }}
                >
                  {categories.map(category => (
                    <MenuItem 
                      key={category.value} 
                      value={category.value}
                      sx={{ 
                        minHeight: { xs: '40px', sm: '48px' },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t('tickets:create.subject', 'Тема')}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: { xs: '12px 14px', sm: '16.5px 14px' },
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t('tickets:create.description', 'Описание')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={isMobile ? 4 : 6}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: { xs: 1.4, sm: 1.5 }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {t('tickets:create.priority', 'Приоритет')}
                </InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label={t('tickets:create.priority', 'Приоритет')}
                  MenuProps={{ 
                    PaperProps: { 
                      style: { 
                        maxHeight: '300px',
                      } 
                    },
                    MenuListProps: {
                      style: { padding: '0' }
                    }
                  }}
                  sx={{
                    '.MuiSelect-select': {
                      padding: { xs: '12px 14px', sm: '16px 14px' },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    borderRadius: '8px'
                  }}
                >
                  {priorities.map(priority => (
                    <MenuItem 
                      key={priority.value} 
                      value={priority.value}
                      sx={{ 
                        minHeight: { xs: '40px', sm: '48px' },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {t('tickets:create.contactPreference', 'Предпочтительный способ связи')}
                </InputLabel>
                <Select
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleChange}
                  label={t('tickets:create.contactPreference', 'Предпочтительный способ связи')}
                  MenuProps={{ 
                    PaperProps: { 
                      style: { 
                        maxHeight: '300px'
                      } 
                    },
                    MenuListProps: {
                      style: { padding: '0' }
                    }
                  }}
                  sx={{
                    '.MuiSelect-select': {
                      padding: { xs: '12px 14px', sm: '16px 14px' },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    borderRadius: '8px'
                  }}
                >
                  <MenuItem 
                    value="email"
                    sx={{ 
                      minHeight: { xs: '40px', sm: '48px' },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {t('tickets:create.contact.email', 'Email')}
                  </MenuItem>
                  <MenuItem 
                    value="phone"
                    sx={{ 
                      minHeight: { xs: '40px', sm: '48px' },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {t('tickets:create.contact.phone', 'Телефон')}
                  </MenuItem>
                </Select>
              </FormControl>
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
                    sx={{ flex: 1, minWidth: '200px' }}
                  >
                    Email
                  </Button>
                  <Button
                    variant={formData.communicationChannel === 'whatsapp' ? 'contained' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, communicationChannel: 'whatsapp' }))}
                    sx={{ flex: 1, minWidth: '200px' }}
                  >
                    WhatsApp
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  {formData.communicationChannel === 'whatsapp' 
                    ? t('tickets:create.whatsappHint', 'Заявка будет отправлена через WhatsApp на номер службы поддержки +7 777 013 1838. Дальнейшая работа ведется по email.')
                    : t('tickets:create.emailHint', 'Заявка будет зарегистрирована в системе поддержки и вы получите уведомление на email')
                  }
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {t('tickets:create.verification.title', 'Проверьте данные вашей заявки')}
              </Typography>
              
              <Paper 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  bgcolor: 'background.paper',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {isMobile ? (
                    // Mobile layout - one column
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.85rem',
                            color: theme.palette.primary.main 
                          }}
                        >
                          {t('tickets:create.verification.subject', 'Тема:')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: '0.95rem',
                            wordBreak: 'break-word'
                          }}
                        >
                          {formData.subject}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ minWidth: '40%' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.85rem',
                              color: theme.palette.primary.main 
                            }}
                          >
                            {t('tickets:create.verification.type', 'Тип заявки:')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                            {ticketTypes.find(t => t.value === formData.type)?.label || formData.type}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ minWidth: '40%' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.85rem',
                              color: theme.palette.primary.main 
                            }}
                          >
                            {t('tickets:create.verification.priority', 'Приоритет:')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                            {priorities.find(p => p.value === formData.priority)?.label || formData.priority}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ minWidth: '40%' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.85rem',
                              color: theme.palette.primary.main 
                            }}
                          >
                            {t('tickets:create.verification.category', 'Категория:')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                            {categories.find(c => c.value === formData.category)?.label || formData.category}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ minWidth: '40%' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.85rem',
                              color: theme.palette.primary.main 
                            }}
                          >
                            {t('tickets:create.verification.contactMethod', 'Способ связи:')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                            {formData.contactPreference === 'email' 
                              ? t('tickets:create.contact.email', 'Email') 
                              : t('tickets:create.contact.phone', 'Телефон')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.85rem',
                            color: theme.palette.primary.main 
                          }}
                        >
                          {t('tickets:create.verification.contactInfo', 'Контактная информация:')}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                          {user?.email}
                        </Typography>
                      </Box>
                    </Grid>
                  ) : (
                    // Desktop layout - two columns
                    <>
                      <Grid item xs={12} md={6}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main  
                          }}
                        >
                          {t('tickets:create.verification.type', 'Тип заявки:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {ticketTypes.find(t => t.value === formData.type)?.label || formData.type}
                        </Typography>
                        
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main 
                          }}
                        >
                          {t('tickets:create.verification.category', 'Категория:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {categories.find(c => c.value === formData.category)?.label || formData.category}
                        </Typography>
                        
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main 
                          }}
                        >
                          {t('tickets:create.verification.priority', 'Приоритет:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {priorities.find(p => p.value === formData.priority)?.label || formData.priority}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main  
                          }}
                        >
                          {t('tickets:create.verification.subject', 'Тема:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {formData.subject}
                        </Typography>
                        
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main  
                          }}
                        >
                          {t('tickets:create.verification.contactInfo', 'Контактная информация:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {user?.email}
                        </Typography>
                        
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main  
                          }}
                        >
                          {t('tickets:create.verification.contactMethod', 'Способ связи:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          {formData.contactPreference === 'email' 
                            ? t('tickets:create.contact.email', 'Email') 
                            : t('tickets:create.contact.phone', 'Телефон')}
                        </Typography>
                        
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: theme.palette.primary.main  
                          }}
                        >
                          {t('tickets:create.verification.channel', 'Способ подачи заявки:')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {formData.communicationChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: { xs: '0.85rem', sm: '0.875rem' },
                        color: theme.palette.primary.main,
                        mb: 0.5
                      }}
                    >
                      {t('tickets:create.verification.description', 'Описание:')}
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        mt: 0.5,
                        borderRadius: '6px',
                        borderColor: 'rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                          lineHeight: 1.5
                        }}
                      >
                        {formData.description}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return t('tickets:create.unknownStep', 'Неизвестный шаг');
    }
  };
  
>>>>>>> 801ce2854997a6d5c7a6484a2dd78f66db5a6d62
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          {t('tickets:create.title', 'Создать заявку')}
        </Typography>
        
        <Paper sx={{ p: 4 }}>
          <TicketForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateTicketPage;