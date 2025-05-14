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
  StepLabel,
  useTheme,
  useMediaQuery
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
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {formData.contactPreference === 'email' 
                            ? t('tickets:create.contact.email', 'Email') 
                            : t('tickets:create.contact.phone', 'Телефон')}
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
  
  return (
    <Container maxWidth="md">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box 
          display="flex" 
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={3}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 0 }}
        >
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleCancel}
            sx={{ 
              mr: { xs: 0, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
            size="medium"
          >
            {t('tickets:create.back', 'Назад')}
          </Button>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontWeight: 'bold'
            }}
          >
            {t('tickets:create.title', 'Создание заявки')}
          </Typography>
        </Box>
        
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            overflowX: 'hidden'
          }}>
          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
            alternativeLabel
          >
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
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ 
                    mr: { xs: 0, sm: 1 },
                    order: { xs: 3, sm: 1 },
                    display: { xs: activeStep === steps.length - 1 ? 'none' : 'block', sm: 'block' }
                  }}
                  fullWidth={isMobile}
                >
                  {t('tickets:create.cancel', 'Отмена')}
                </Button>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 1 },
                  order: { xs: '1 2', sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ 
                      mr: { xs: 0, sm: 1 },
                      order: { xs: 2, sm: 1 }
                    }}
                    variant="outlined"
                    fullWidth={isMobile}
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
                      sx={{ 
                        order: { xs: 1, sm: 2 },
                        py: { xs: 1.5, sm: 1 }
                      }}
                      fullWidth={isMobile}
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
                      sx={{ 
                        order: { xs: 1, sm: 2 },
                        py: { xs: 1.5, sm: 1 }
                      }}
                      fullWidth={isMobile}
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