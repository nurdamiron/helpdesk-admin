import React from 'react';
import { Box, Container, Typography, Link, Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation(['common', 'footer']);
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('app.title', 'HelpDesk')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer:description', 'Система поддержки и приема заявок для решения ваших вопросов.')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer:links', 'Ссылки')}
            </Typography>
            <Stack spacing={1}>

              <Link component={RouterLink} to="/login" color="inherit" underline="hover">
                {t('header:login', 'Войти')}
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer:contact', 'Контакты')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('footer:address', 'Адрес: ул. Примерная, 123')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('footer:email', 'Email: Свяжитесь с администратором')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer:phone', 'Телефон: +7 (123) 456-7890')}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} {t('app.title', 'HelpDesk')}. {t('common:copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 