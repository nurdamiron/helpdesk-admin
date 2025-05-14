import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Мобильная версия приветственного компонента для дашборда
 */
const MobileWelcomeCard = ({ name }) => {
  const theme = useTheme();
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
        p: { xs: 1.5, sm: 2.5 },
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 1.5, sm: 2 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        width: '100%'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'center', sm: 'center' },
        flexDirection: { xs: 'row', sm: 'row' },
        gap: { xs: 1, sm: 1 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <Box sx={{ flex: 1, minWidth: '60%' }}>
          <Typography 
            variant="h5" 
            fontWeight={600}
            sx={{ 
              mb: { xs: 0.2, sm: 0.75 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.2
            }}
          >
            {getGreeting()}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              lineHeight: 1.3,
              fontWeight: { xs: 400, sm: 400 }
            }}
          >
            {name && `${name}, `}
            {t('welcome.message', 'мы рады сообщить о вашем входе в систему')}
          </Typography>
        </Box>
        
        <Chip
          icon={<Clock size={12} />}
          label={formattedTime}
          color="primary"
          variant="outlined"
          sx={{ 
            fontWeight: 500,
            '& .MuiChip-label': {
              px: { xs: 0.75, sm: 1.25 }
            },
            height: { xs: 28, sm: 34 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        />
      </Box>
    </Paper>
  );
};

export default MobileWelcomeCard; 