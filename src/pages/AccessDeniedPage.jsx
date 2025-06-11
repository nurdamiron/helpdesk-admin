import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Container
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * Страница, отображаемая при отказе в доступе
 */
const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation(['pages', 'common']);

  // Обработчик возврата на главную страницу
  const handleGoHome = () => {
    navigate('/');
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 5, 
          borderRadius: 2,
          textAlign: 'center' 
        }}
      >
        <Typography 
          variant="h4" 
          color="error" 
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {t('pages:accessDenied.title', 'Доступ запрещен')}
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {t('pages:accessDenied.message', 'У вас недостаточно прав для доступа к этой странице.')}
          {user && (
            <> {t('pages:accessDenied.currentRole', 'Ваша текущая роль: {{role}}', { role: user.role })}</>
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleGoHome} 
            sx={{ minWidth: 120 }}
          >
            {t('pages:accessDenied.buttons.home', 'На главную')}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogout}
            sx={{ minWidth: 120 }}
          >
            {t('pages:accessDenied.buttons.logout', 'Выйти')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccessDeniedPage;