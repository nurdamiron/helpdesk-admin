import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, CardActions, Fade } from '@mui/material';
import { Telegram as TelegramIcon, Description as FormIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TicketForm from '../../components/ticket/TicketForm';

const CreateTicketPage = () => {
  const { t } = useTranslation(['tickets', 'common']);
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const handleTelegramBot = () => {
    window.open('https://t.me/HelpdeskKZBot', '_blank');
  };
  
  const handleBack = () => {
    setSelectedMethod(null);
  };
  
  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          {t('tickets:create.title', 'Создать заявку')}
        </Typography>
        
        {!selectedMethod && (
          <Fade in={!selectedMethod}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                {t('tickets:create.chooseMethod', 'Выберите удобный способ обращения')}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={handleTelegramBot}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <TelegramIcon sx={{ fontSize: 60, color: '#0088cc', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {t('tickets:create.telegramBot', 'Telegram бот')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('tickets:create.telegramBotFullDescription', 'Мгновенная поддержка через Telegram. Отправьте сообщение боту и получите быстрый ответ 24/7')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<TelegramIcon />}
                        sx={{
                          bgcolor: '#0088cc',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#006bb3'
                          }
                        }}
                      >
                        {t('tickets:create.openTelegram', 'Открыть Telegram')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => setSelectedMethod('form')}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <FormIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {t('tickets:create.formMethod', 'Форма заявки')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('tickets:create.formMethodDescription', 'Заполните подробную форму и выберите способ отправки: Email или WhatsApp')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<FormIcon />}
                      >
                        {t('tickets:create.fillForm', 'Заполнить форму')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('tickets:create.helpText', 'Выберите наиболее удобный для вас способ связи. Мы готовы помочь вам в любое время.')}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
        
        {selectedMethod === 'form' && (
          <Fade in={selectedMethod === 'form'}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 3 }}
              >
                {t('common:back', 'Назад')}
              </Button>
              
              <Paper sx={{ p: 4 }}>
                <TicketForm />
              </Paper>
            </Box>
          </Fade>
        )}
    </Box>
  );
};

export default CreateTicketPage;