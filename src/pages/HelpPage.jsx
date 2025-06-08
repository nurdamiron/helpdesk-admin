// src/pages/HelpPage.js
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button,
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Divider,
  Alert
} from '@mui/material';
import { Info, AlertTriangle, FileText, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '../components/common/ErrorHandler';
import { usePermission } from '../hooks/usePermission';

const HelpPage = () => {
  const { t } = useTranslation(['help', 'common']);
  const { showError, showErrorModal } = useErrorHandler();
  const { canViewAnalytics } = usePermission();
  const [testSuccess, setTestSuccess] = useState(false);
  
  // Функция для тестирования отображения обычной ошибки
  const handleTestError = () => {
    showError(t('help:testErrorMessage', 'Это тестовое сообщение об ошибке'));
    setTestSuccess(true);
  };
  
  // Функция для тестирования отображения модальной ошибки
  const handleTestErrorModal = () => {
    showErrorModal(
      t('help:testModalTitle', 'Тестовая ошибка'), 
      t('help:testModalMessage', 'Это тестовое модальное окно с ошибкой'),
      { stack: 'Error: Test error\n  at HelpPage.handleTestErrorModal' }
    );
    setTestSuccess(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('help:title', 'Справка и руководство')}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {t('help:description', 'Здесь вы найдете информацию о работе с системой HelpDesk и ответы на часто задаваемые вопросы.')}
        </Typography>
        
        {testSuccess && (
          <Alert severity="success" sx={{ my: 2 }}>
            {t('help:testSuccess', 'Тестирование системы уведомлений прошло успешно')}
          </Alert>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom>
          {t('help:testSectionTitle', 'Тестирование системы')}
                </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            {t('help:testSectionDescription', 'Здесь вы можете протестировать работу различных компонентов системы.')}
                </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item>
              <Button 
                  variant="outlined"
                color="primary" 
                onClick={handleTestError}
                startIcon={<AlertTriangle size={18} />}
                  >
                {t('help:testError', 'Тест уведомления')}
                  </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleTestErrorModal}
                startIcon={<AlertTriangle size={18} />}
              >
                {t('help:testErrorModal', 'Тест модальной ошибки')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom>
          {t('help:topicsTitle', 'Разделы справки')}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <FileText size={24} color={canViewAnalytics() ? '#1e88e5' : '#757575'} />
                  <Typography variant="h6" sx={{ ml: 1.5 }}>
                    {t('help:topic1Title', 'Работа с заявками')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('help:topic1Description', 'Создание, просмотр и управление заявками в системе.')}
                </Typography>
            </CardContent>
              <CardActions>
                <Button size="small">{t('help:readMore', 'Подробнее')}</Button>
              </CardActions>
          </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <MessageCircle size={24} color="#1e88e5" />
                  <Typography variant="h6" sx={{ ml: 1.5 }}>
                    {t('help:topic2Title', 'Коммуникация с клиентами')}
                  </Typography>
              </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('help:topic2Description', 'Общение с клиентами, отправка уведомлений и управление сообщениями.')}
              </Typography>
            </CardContent>
              <CardActions>
                <Button size="small">{t('help:readMore', 'Подробнее')}</Button>
              </CardActions>
          </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Info size={24} color="#1e88e5" />
                  <Typography variant="h6" sx={{ ml: 1.5 }}>
                    {t('help:topic3Title', 'Часто задаваемые вопросы')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('help:topic3Description', 'Ответы на наиболее популярные вопросы пользователей системы.')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">{t('help:readMore', 'Подробнее')}</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Mail size={24} color="#1e88e5" />
                  <Typography variant="h6" sx={{ ml: 1.5 }}>
                    {t('help:topic4Title', 'Обратная связь')}
                  </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                  {t('help:topic4Description', 'Свяжитесь с нами для получения дополнительной помощи или предложений по улучшению.')}
              </Typography>
            </CardContent>
              <CardActions>
                <Button size="small">{t('help:readMore', 'Подробнее')}</Button>
              </CardActions>
          </Card>
        </Grid>
      </Grid>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={500}>
            {t('help:additionalResources', 'Дополнительные ресурсы')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button 
              variant="text" 
              color="primary" 
              startIcon={<ExternalLink size={16} />}
              href="#"
              disabled
            >
              {t('help:documentation', 'Документация')}
            </Button>
            <Button 
              variant="text" 
              color="primary" 
              startIcon={<ExternalLink size={16} />}
              href="#"
              disabled
            >
              {t('help:training', 'Обучающие материалы')}
            </Button>
            <Button 
              variant="text" 
              color="primary" 
              startIcon={<ExternalLink size={16} />}
              href="#"
              disabled
            >
              {t('help:support', 'Техническая поддержка')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HelpPage;