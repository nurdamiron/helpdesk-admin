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
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 240;

const Header = ({ drawerOpen, setDrawerOpen }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  // Имитация уведомлений для демонстрации
  const notifications = [
    { id: 1, text: 'Жаңа өтінім #234', time: '5 минут бұрын' },
    { id: 2, text: 'Клиенттен хабарлама', time: '15 минут бұрын' },
    { id: 3, text: 'Еске салу: 1 сағаттан кейін кездесу', time: '30 минут бұрын' },
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  const menuItems = [
    { text: t('nav.dashboard'), path: '/dashboard' },
    { text: t('nav.tickets'), path: '/tickets' },
    { text: t('nav.settings'), path: '/settings' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        bgcolor: '#2b3a47', // Тёмно-синий оттенок для строительной тематики
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {menuItems.find(item => location.pathname.startsWith(item.path))?.text || t('app.title')}
        </Typography>
        
        {/* Язык - делаем более заметным */}
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>

        {/* Уведомления */}
        <Tooltip title={t('notifications.title', 'Хабарламалар')}>
          <IconButton 
            color="inherit" 
            onClick={handleNotificationsMenuOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="notifications-menu"
          anchorEl={notificationsAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsMenuClose}
        >
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationsMenuClose}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1">{notification.text}</Typography>
                <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
        
        {/* Профиль */}
        <Tooltip title={t('auth.account', 'Профиль')}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={user?.name || "User"}>
              {user?.name?.charAt(0) || user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/settings/profile">
            <Typography textAlign="center">{t('auth.profile', 'Профиль')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center">{t('auth.logout', 'Шығу')}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 