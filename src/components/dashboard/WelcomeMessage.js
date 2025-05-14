import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Компонент для отображения приветственного сообщения с часами
 */
const WelcomeMessage = ({ name, role }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  
  // Обновление времени каждую минуту
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Очистка интервала при размонтировании
    return () => clearInterval(timerId);
  }, []);
  
  // Функция для получения приветствия в зависимости от времени суток
  const getGreeting = () => {
    const hours = currentTime.getHours();
    
    if (hours >= 5 && hours < 12) {
      return t('welcome.morning', 'Доброе утро!');
    } else if (hours >= 12 && hours < 18) {
      return t('welcome.afternoon', 'Добрый день!');
    } else if (hours >= 18 && hours < 23) {
      return t('welcome.evening', 'Добрый вечер!');
    } else {
      return t('welcome.night', 'Доброй ночи!');
    }
  };
  
  // Форматируем время в формате ЧЧ:MM
  const formattedTime = currentTime.toLocaleTimeString(i18n.language || 'ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          right: -30,
          bottom: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          zIndex: 0
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            mb: 1,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent'
          }}
        >
          {getGreeting()}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {(name || (user && user.displayName)) && `${name || user.displayName}, `} 
          {t('welcome.message', 'мы рады сообщить о вашем входе в систему')}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            py: 1,
            px: 2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            color: theme.palette.primary.main,
            fontWeight: 600
          }}
        >
          <Clock size={16} style={{ marginRight: 8 }} />
          <Typography 
            variant="h6"
            fontWeight="600"
            sx={{ 
              letterSpacing: 1
            }}
          >
            {formattedTime}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeMessage; 