// src/pages/NotFoundPage.js
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation(['pages']);
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <FileQuestion size={100} color="#9e9e9e" style={{ marginBottom: '2rem' }} />
        
          <Typography variant="h1" component="h1" sx={{ 
            mb: 4, 
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: 700
          }}>
          404
        </Typography>
        
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 500 }}>
            {t('notFound.title', 'Страница не найдена')}
        </Typography>
        
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '500px', mx: 'auto', color: 'text.secondary' }}>
            {t('notFound.message', 'Страница, которую вы ищете, не существует или была перемещена.')}
        </Typography>
        
        <Button 
            component={Link} 
            to="/" 
          variant="contained" 
          color="primary" 
          size="large"
            sx={{ fontWeight: 500 }}
        >
            {t('notFound.button', 'Вернуться на главную')}
        </Button>
        </Box>
    </Container>
    </Box>
  );
};

export default NotFoundPage;