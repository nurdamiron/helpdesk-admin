import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Stack,
  Alert,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const SubmissionSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'tickets']);
  
  // Получаем данные из state, если они есть
  const { ticket, authorized, emailSent } = location.state || {};
  
  const handleCopyTicketId = () => {
    navigator.clipboard.writeText(id);
    // Можно добавить уведомление о копировании
  };
  
  const handleViewTicket = () => {
    navigate(`/tickets/${id}`);
  };
  
  const handleBackHome = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}
        >
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('tickets:success.title', 'Заявка успешно отправлена!')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center">
            {t('tickets:success.description', 'Ваша заявка принята и будет обработана в ближайшее время.')}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              bgcolor: 'success.light', 
              color: 'success.contrastText', 
              p: 2, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
            <Typography variant="h6">
              {t('tickets:success.ticketId', 'Номер заявки')}: {id}
            </Typography>
            
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyTicketId}
              sx={{ ml: 2 }}
            >
              {t('tickets:success.copy', 'Копировать')}
            </Button>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1 }}
          >
            {t('tickets:success.saveNumber', 'Сохраните этот номер, чтобы вы могли отслеживать статус вашей заявки.')}
          </Typography>
        </Box>
        
        {emailSent && (
          <Alert 
            icon={<EmailIcon />} 
            severity="info" 
            sx={{ mb: 4 }}
          >
            {t('tickets:success.emailSent', 'Информация о заявке также отправлена на ваш email.')}
          </Alert>
        )}
        
        {ticket && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('tickets:success.ticketDetails', 'Информация о заявке')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">
                  {t('tickets:fields.subject', 'Тема')}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.subject}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">
                  {t('tickets:fields.category', 'Категория')}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.category?.name || ticket.category}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">
                  {t('tickets:fields.name', 'Имя')}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">
                  {t('tickets:fields.email', 'Email')}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.email}
                </Typography>
              </Grid>
              
              {ticket.phone && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">
                    {t('tickets:fields.phone', 'Телефон')}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.phone}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">
                  {t('tickets:fields.priority', 'Приоритет')}:
                </Typography>
                <Chip 
                  label={
                    ticket.priority === 'high' ? t('tickets:priorities.high', 'Высокий') :
                    ticket.priority === 'normal' ? t('tickets:priorities.normal', 'Обычный') :
                    t('tickets:priorities.low', 'Низкий')
                  }
                  color={
                    ticket.priority === 'high' ? 'error' :
                    ticket.priority === 'normal' ? 'primary' :
                    'success'
                  }
                  size="small"
                />
              </Grid>
            </Grid>
          </>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button 
            variant="outlined" 
            startIcon={<HomeIcon />}
            onClick={handleBackHome}
          >
            {t('common:backToHome', 'Вернуться на главную')}
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<VisibilityIcon />}
            onClick={handleViewTicket}
          >
            {t('tickets:success.viewTicket', 'Просмотреть заявку')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SubmissionSuccessPage; 