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
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={600}
            sx={{ mb: 0.5 }}
          >
            {getGreeting()}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            {name && `${name}, `}
            {t('welcome.message', 'мы рады сообщить о вашем входе в систему')}
          </Typography>
        </Box>
        
        <Chip
          icon={<Clock size={14} />}
          label={formattedTime}
          color="primary"
          variant="outlined"
          sx={{ 
            fontWeight: 500,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default MobileWelcomeCard; 