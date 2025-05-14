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
      <IconButton
        size="large"
        color="inherit"
        aria-label="language"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge
          badgeContent={currentLanguage.toUpperCase()}
          color="primary"
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Globe size={22} />
        </Badge>
      </IconButton>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 150,
            mt: 1,
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
            selected={currentLanguage === lang.code}
            sx={{ 
              py: 1, 
              minHeight: 'auto',
              '&.Mui-selected': {
                bgcolor: 'action.selected',
              }
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight={currentLanguage === lang.code ? 'bold' : 'normal'}
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