import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Container,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../api/ticketService';
import { useTranslation } from 'react-i18next';

/**
 * Компонент страницы создания заявки для пользователя
 */
const CreateTicketPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['tickets', 'common']);
  
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
    contactPreference: 'email'
  });
  
  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Категории заявок
  const categories = [
    { value: 'foundation', label: t('tickets:category.foundation', 'Фундаментные работы') },
    { value: 'framing', label: t('tickets:category.framing', 'Каркасное строительство') },
    { value: 'roofing', label: t('tickets:category.roofing', 'Кровельные работы') },
    { value: 'masonry', label: t('tickets:category.masonry', 'Кладочные работы') },
    { value: 'plumbing', label: t('tickets:category.plumbing', 'Сантехнические работы') },
    { value: 'electrical', label: t('tickets:category.electrical', 'Электромонтажные работы') },
    { value: 'insulation', label: t('tickets:category.insulation', 'Теплоизоляция') },
    { value: 'drywall', label: t('tickets:category.drywall', 'Гипсокартонные работы') },
    { value: 'painting', label: t('tickets:category.painting', 'Малярные работы') },
    { value: 'flooring', label: t('tickets:category.flooring', 'Напольные покрытия') },
    { value: 'carpentry', label: t('tickets:category.carpentry', 'Столярные работы') },
    { value: 'windows', label: t('tickets:category.windows', 'Окна и двери') },
    { value: 'landscaping', label: t('tickets:category.landscaping', 'Ландшафтные работы') },
    { value: 'renovation', label: t('tickets:category.renovation', 'Реконструкция и реставрация') },
    { value: 'materials', label: t('tickets:category.materials', 'Поставка стройматериалов') },
    { value: 'equipment', label: t('tickets:category.equipment', 'Строительная техника') },
    { value: 'design', label: t('tickets:category.design', 'Проектирование и дизайн') },
    { value: 'permits', label: t('tickets:category.permits', 'Разрешения и документация') },
    { value: 'inspection', label: t('tickets:category.inspection', 'Технический надзор') },
    { value: 'other', label: t('tickets:category.other', 'Другое') }
  ];
  
  // Типы заявок
  const ticketTypes = [
    { value: 'construction', label: t('tickets:type.construction', 'Строительные работы') },
    { value: 'repair', label: t('tickets:type.repair', 'Ремонт и отделка') },
    { value: 'breakdown', label: t('tickets:type.breakdown', 'Устранение неисправностей') },
    { value: 'consultation', label: t('tickets:type.consultation', 'Консультация специалиста') },
    { value: 'inspection', label: t('tickets:type.inspection', 'Технический осмотр') },
    { value: 'material', label: t('tickets:type.material', 'Доставка материалов') },
    { value: 'emergency', label: t('tickets:type.emergency', 'Аварийная ситуация') },
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
      
      // Подготовка данных для отправки
      const ticketData = {
        ...formData,
        user_id: user?.id,
        status: 'new',
        metadata: {
          contactPreference: formData.contactPreference,
          type: formData.type // Добавляем тип в metadata для совместимости с backend
        },
        // Добавляем информацию о заявителе в специальное поле requester_metadata
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
      
      // Перенаправление на страницу успешного создания через 2 секунды
      setTimeout(() => {
        navigate('/dashboard', { state: { ticketCreated: true } });
      }, 2000);
      
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('tickets:create.ticketType', 'Тип заявки')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label={t('tickets:create.ticketType', 'Тип заявки')}
                >
                  {ticketTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
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
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t('tickets:create.subject', 'Тема')}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
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
                rows={6}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('tickets:create.priority', 'Приоритет')}</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label={t('tickets:create.priority', 'Приоритет')}
                >
                  {priorities.map(priority => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('tickets:create.contactPreference', 'Предпочтительный способ связи')}</InputLabel>
                <Select
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleChange}
                  label={t('tickets:create.contactPreference', 'Предпочтительный способ связи')}
                >
                  <MenuItem value="email">{t('tickets:create.contact.email', 'Email')}</MenuItem>
                  <MenuItem value="phone">{t('tickets:create.contact.phone', 'Телефон')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('tickets:create.verification.title', 'Проверьте данные вашей заявки')}
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">{t('tickets:create.verification.type', 'Тип заявки:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {ticketTypes.find(t => t.value === formData.type)?.label || formData.type}
                    </Typography>
                    
                    <Typography variant="subtitle2">{t('tickets:create.verification.category', 'Категория:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {categories.find(c => c.value === formData.category)?.label || formData.category}
                    </Typography>
                    
                    <Typography variant="subtitle2">{t('tickets:create.verification.priority', 'Приоритет:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {priorities.find(p => p.value === formData.priority)?.label || formData.priority}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">{t('tickets:create.verification.subject', 'Тема:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formData.subject}
                    </Typography>
                    
                    <Typography variant="subtitle2">{t('tickets:create.verification.contactInfo', 'Контактная информация:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {user?.email}
                    </Typography>
                    
                    <Typography variant="subtitle2">{t('tickets:create.verification.contactMethod', 'Способ связи:')}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formData.contactPreference === 'email' 
                        ? t('tickets:create.contact.email', 'Email') 
                        : t('tickets:create.contact.phone', 'Телефон')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">{t('tickets:create.verification.description', 'Описание:')}</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
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
  
  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            {t('tickets:create.back', 'Назад')}
          </Button>
          <Typography variant="h4">
            {t('tickets:create.title', 'Создание заявки')}
          </Typography>
        </Box>
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Отображение ошибки */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Отображение успешного создания */}
          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              {t('tickets:create.success', 'Заявка успешно создана! Вы будете перенаправлены на главную страницу.')}
            </Alert>
          ) : (
            <>
              {/* Содержимое текущего шага */}
              <Box sx={{ mb: 4 }}>
                {getStepContent(activeStep)}
              </Box>
              
              {/* Навигация между шагами */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ mr: 1 }}
                >
                  {t('tickets:create.cancel', 'Отмена')}
                </Button>
                <Box>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    {t('common:actions.back', 'Назад')}
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading || !isStepValid()}
                      startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    >
                      {loading 
                        ? t('tickets:create.sending', 'Отправка...') 
                        : t('tickets:create.submit', 'Отправить')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                    >
                      {t('tickets:create.next', 'Далее')}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateTicketPage;