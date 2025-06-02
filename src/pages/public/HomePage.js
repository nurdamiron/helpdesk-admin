import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  useMediaQuery,
  TextField,
  Stack,
  InputAdornment,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TicketForm from '../../components/ticket/TicketForm';
import { ticketService } from '../../api/ticketService';
import SupportIllustration from '../../components/common/SupportIllustration';

// Компонент с принципами работы
const PrincipleItem = ({ title, description }) => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center',
        padding: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 6px 25px rgba(0,0,0,0.09)',
        }
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: 'primary.main'
          }
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 3,
          fontWeight: 400
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

const HomePage = () => {
  const { t, i18n } = useTranslation(['pages']);
  const [showTicketForm, setShowTicketForm] = useState(true);
  const [ticketId, setTicketId] = useState('');
  const [ticketIdError, setTicketIdError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0 - Создать заявку, 1 - Найти заявку
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Плавный скролл к форме
  const scrollToForm = () => {
    // Если форма уже отображается, просто скроллим к ней
    if (!showTicketForm) {
      setShowTicketForm(true);
    }
    setTimeout(() => {
      const formElement = document.getElementById('ticket-form-section');
      if (formElement) {
        formElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Обработчик успешной отправки заявки (больше не используется)
  const handleSubmitSuccess = (ticket) => {
    // Логика перенесена в TicketForm компонент
  };

  // Обработчик поиска заявки по ID
  const handleFindTicket = () => {
    if (!ticketId.trim()) {
      setTicketIdError(t('form.required', 'Обязательное поле'));
      return;
    }
    
    // Проверяем, что ID состоит только из цифр
    if (!/^\d+$/.test(ticketId)) {
      setTicketIdError(t('homePage.invalidTicketId', 'Недействительный ID заявки'));
      return;
    }
    
    // Если проверки пройдены, перенаправляем на страницу заявки
    setTicketIdError('');
    navigate(`/tickets/${ticketId}`);
  };

  const handleTicketIdChange = (e) => {
    setTicketId(e.target.value);
    if (ticketIdError) {
      setTicketIdError('');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Определяем принципы работы
  const principles = [
    { 
      title: t('homePage.principles.speed.title', 'Скорость'), 
      description: t('homePage.principles.speed.description', 'Мы стараемся обрабатывать заявки максимально быстро, чтобы решить ваши вопросы в кратчайшие сроки.')
    },
    { 
      title: t('homePage.principles.quality.title', 'Качество'), 
      description: t('homePage.principles.quality.description', 'Мы уделяем особое внимание качеству обслуживания и стремимся предоставить наилучшие решения.')
    },
    { 
      title: t('homePage.principles.transparency.title', 'Прозрачность'), 
      description: t('homePage.principles.transparency.description', 'Вы всегда в курсе статуса вашей заявки, а процесс решения абсолютно прозрачен.')
    }
  ];

  return (
    <>
      {/* Главный баннер с заголовком */}
      <Box 
        sx={{ 
          pt: { xs: 4, sm: 8, md: 12 }, 
          pb: { xs: 5, sm: 8, md: 12 },
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 2,
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    letterSpacing: '-0.5px',
                  }}
                >
                  {t('homePage.title', 'Служба технической поддержки')}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  {t('homePage.description', 'Создайте заявку или проверьте статус существующей. Мы всегда готовы вам помочь.')}
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ 
                    justifyContent: { xs: 'center', md: 'flex-start' } 
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={scrollToForm}
                    startIcon={<AddIcon />}
                    sx={{ 
                      px: 3, 
                      py: 1.5,
                      boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.4)'
                    }}
                  >
                    {t('homePage.createTicket', 'Создать заявку')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setActiveTab(1)}
                    startIcon={<SearchIcon />}
                    sx={{ 
                      px: 3, 
                      py: 1.5,
                    }}
                  >
                    {t('homePage.findTicket', 'Найти заявку')}
                  </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: { xs: 250, sm: 350, md: 400 } 
              }}>
                <SupportIllustration 
                  width={isMobile ? 280 : isTablet ? 320 : 380} 
                  height={isMobile ? 280 : isTablet ? 320 : 380} 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Принципы работы */}
      <Box sx={{ mb: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center"
            sx={{ 
              mb: 6,
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } 
            }}
          >
            {t('homePage.principlesTitle', 'Наши принципы работы')}
          </Typography>
          
          <Grid container spacing={4}>
            {principles.map((principle, index) => (
              <Grid item xs={12} md={4} key={index}>
                <PrincipleItem 
                  title={principle.title} 
                  description={principle.description}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Форма и поиск */}
      <Box id="ticket-form-section" sx={{ mb: 8 }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                centered={!isMobile}
                sx={{ mb: 1 }}
                indicatorColor="primary"
              >
                <Tab 
                  label={t('homePage.createTicketTab', 'Создать заявку')} 
                  id="tab-0" 
                  aria-controls="tabpanel-0" 
                />
                <Tab 
                  label={t('homePage.findTicketTab', 'Найти заявку')} 
                  id="tab-1" 
                  aria-controls="tabpanel-1" 
                />
              </Tabs>
            </Box>
            
            {/* Панель создания заявки */}
            <div
              role="tabpanel"
              hidden={activeTab !== 0}
              id="tabpanel-0"
              aria-labelledby="tab-0"
            >
              {activeTab === 0 && (
                <TicketForm onSubmitSuccess={handleSubmitSuccess} />
              )}
            </div>
            
            {/* Панель поиска заявки */}
            <div
              role="tabpanel"
              hidden={activeTab !== 1}
              id="tabpanel-1"
              aria-labelledby="tab-1"
            >
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('homePage.findTicketHeading', 'Найти существующую заявку')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('homePage.findTicketDescription', 'Введите номер заявки, чтобы узнать ее статус.')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      label={t('homePage.ticketNumber', 'Номер заявки')}
                      variant="outlined"
                      fullWidth
                      value={ticketId}
                      onChange={handleTicketIdChange}
                      error={!!ticketIdError}
                      helperText={ticketIdError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleFindTicket}
                      sx={{ 
                        minWidth: { xs: '100%', sm: 'auto' },
                        py: 1.5
                      }}
                    >
                      {t('homePage.findButton', 'Найти')}
                    </Button>
                  </Box>
                </Box>
              )}
            </div>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default HomePage; 