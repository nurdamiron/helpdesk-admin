import React from 'react';
import { Box, Container, Typography, Link, Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation(['common', 'footer', 'header']);
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
{t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
{t('description', { ns: 'footer', defaultValue: 'Қазақстан Республикасының мемлекеттік ұйымдарына арналған техникалық қолдау жүйесі.' })}
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight="medium">
{t('organization', { ns: 'footer', defaultValue: 'Қазақстан Республикасы Цифрлық Даму министрлігі' })}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('links', { ns: 'footer', defaultValue: 'Сілтемелер' })}
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/login" color="inherit" underline="hover">
                {t('login', { ns: 'header', defaultValue: 'Жүйеге кіру' })}
              </Link>
              <Link href="#" color="inherit" underline="hover">
                {t('terms', { ns: 'footer', defaultValue: 'Қызмет көрсету шарттары' })}
              </Link>
              <Link href="#" color="inherit" underline="hover">
                {t('privacy', { ns: 'footer', defaultValue: 'Құпиялылық саясаты' })}
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('contact', { ns: 'footer', defaultValue: 'Контакттар' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('address', { ns: 'footer', defaultValue: 'Мекенжай: Қазақстан, Алматы қ., Абай даңғылы, 150' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('email', { ns: 'footer', defaultValue: 'Email: support@helpdesk.gov.kz' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('phone', { ns: 'footer', defaultValue: 'Телефон: +7 (727) 300-00-00' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t('workingHours', { ns: 'footer', defaultValue: 'Жұмыс уақыты: дүйсенбі-жұма 9:00-18:00' })}
            </Typography>
            <Typography variant="body2" color="warning.main" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
              {t('emergencySupport', { ns: 'footer', defaultValue: 'Апаттық жағдайларда: 24/7 қолдау' })}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} {t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}. {t('copyright', { ns: 'footer', defaultValue: 'Барлық құқықтар қорғалған.' })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 