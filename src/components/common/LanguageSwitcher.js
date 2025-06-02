// src/components/common/LanguageSwitcher.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language?.substring(0, 2) || 'kk');
  const theme = useTheme();

  // Отслеживаем изменения языка
  useEffect(() => {
    const newLang = i18n.language?.substring(0, 2) || 'kk';
    setCurrentLanguage(newLang);
    console.log('Текущий язык:', newLang); // Добавлен отладочный вывод
    document.documentElement.lang = newLang; // Обновляем атрибут lang у html элемента
  }, [i18n.language]);

  // При первой загрузке проверяем сохраненный язык
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    console.log('Сохраненный язык:', savedLang); // Добавлен отладочный вывод
    
    if (savedLang) {
      const lang = savedLang.substring(0, 2);
      if (lang !== i18n.language) {
        console.log('Применяем сохраненный язык:', lang);
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang);
      }
    } else {
      // Если язык не указан, определяем язык браузера или используем казахский
      const browserLang = navigator.language?.substring(0, 2);
      const defaultLang = ['kk', 'ru', 'en'].includes(browserLang) ? browserLang : 'kk';
      console.log('Язык не указан, используем:', defaultLang);
      i18n.changeLanguage(defaultLang);
      localStorage.setItem('i18nextLng', defaultLang);
      setCurrentLanguage(defaultLang);
    }
  }, []); // Пустой массив для выполнения только при монтировании

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    console.log('Изменение языка на:', lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    setCurrentLanguage(lng);
    handleClose();
    
    // Перезагружаем страницу для применения переводов ко всем компонентам
    console.log('Перезагрузка страницы для применения переводов');
    window.location.reload();
  };

  // Доступные языки
  const languages = [
    { code: 'kk', name: t('language.kk', 'Қазақша') },
    { code: 'ru', name: t('language.ru', 'Русский') },
    { code: 'en', name: t('language.en', 'English') }
  ];

  return (
    <Box>
      <Tooltip title={t('common:language.select', 'Тілді таңдау')}>
        <IconButton
          size="medium"
          color="inherit"
          aria-label="language"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ 
            padding: { xs: '6px', sm: '8px' },
            backgroundColor: open ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }
          }}
        >
          <Badge
            badgeContent={currentLanguage.toUpperCase()}
            color="primary"
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: { xs: '9px', sm: '10px' },
                height: { xs: '16px', sm: '18px' },
                minWidth: { xs: '16px', sm: '18px' },
                padding: { xs: '0 4px', sm: '0 5px' }
              }
            }}
          >
            <Globe size={theme.breakpoints.down('sm') ? 18 : 22} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          dense: theme.breakpoints.down('sm') ? true : false
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: { xs: 120, sm: 150 },
            mt: 1,
            '& .MuiMenuItem-root': {
              minHeight: { xs: '36px', sm: '42px' }
            }
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
            selected={currentLanguage === lang.code}
            sx={{ 
              py: { xs: 0.75, sm: 1 }, 
              px: { xs: 1.5, sm: 2 },
              minHeight: { xs: '36px', sm: 'auto' },
              '&.Mui-selected': {
                bgcolor: 'action.selected',
              }
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight={currentLanguage === lang.code ? 'bold' : 'normal'}
              sx={{ 
                fontSize: { xs: '0.8125rem', sm: '0.875rem' }
              }}
            >
              {lang.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 