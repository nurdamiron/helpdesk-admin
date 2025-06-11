import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import HelpDeskLogo from '../../assets/images/logo.jsx';

/**
 * Компонент шапки для публичной части сайта
 * Содержит логотип, меню и кнопку авторизации
 */
const PublicHeader = () => {
  const { t } = useTranslation(['common', 'header']);
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleAdmin = () => {
    navigate('/dashboard');
  };

  // Не отображаем кнопки авторизации, пока не завершена инициализация Auth
  const showAuthButtons = initialized && !loading;

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, alignItems: 'center' }}>
            <HelpDeskLogo width={70} height={70} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
{t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label={t('menu', { ns: 'header', defaultValue: 'Меню' })}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            {/* Drawer для мобильного меню */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {t('menu', { ns: 'header', defaultValue: 'Меню' })}
                  </Typography>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Divider />
                
                <List>
                  <ListItem disablePadding>
                    <ListItemButton 
                      component={RouterLink} 
                      to="/"
                    >
                      <ListItemText primary={t('home', { ns: 'header', defaultValue: 'Главная' })} />
                    </ListItemButton>
                  </ListItem>
                  
                  {showAuthButtons && (
                    isAuthenticated ? (
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleAdmin}>
                          <ListItemText primary={t('adminPanel', { ns: 'header', defaultValue: 'Админ панель' })} />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleLogin}>
                          <ListItemText primary={t('login', { ns: 'header', defaultValue: 'Войти' })} />
                        </ListItemButton>
                      </ListItem>
                    )
                  )}
                </List>
                
                <Divider />
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title={t('languageSelector', { ns: 'header', defaultValue: 'Выбор языка' })}>
                    <Box>
                      <LanguageSwitcher />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            </Drawer>
          </Box>

          {/* Logo - mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, alignItems: 'center' }}>
            <HelpDeskLogo width={60} height={60} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
{t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}
          </Typography>

          {/* Spacer for desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
{t('home', { ns: 'header', defaultValue: 'Басты бет' })}
            </Button>
          </Box>

          {/* Right section - Language switcher & Login button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('languageSelector', { ns: 'header', defaultValue: 'Выбор языка' })}>
              <Box sx={{ mr: 2 }}>
                <LanguageSwitcher />
              </Box>
            </Tooltip>
            
            {showAuthButtons && (
              isAuthenticated ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LogIn size={18} />}
                  onClick={handleAdmin}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
{t('adminPanel', { ns: 'header', defaultValue: 'Басқару панелі' })}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LogIn size={18} />}
                  onClick={handleLogin}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
{t('login', { ns: 'header', defaultValue: 'Жүйеге кіру' })}
                </Button>
              )
            )}
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicHeader; 