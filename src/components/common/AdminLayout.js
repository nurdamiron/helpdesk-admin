// src/components/common/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TicketCheck,
  Inbox,
  Users,
  Settings,
  Bell,
  LogOut,
  User,
  Home,
  HelpCircle,
  BarChart2,
  ChevronLeft,
  Building,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Ширина бокового меню
const drawerWidth = 240;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Состояние для открытия/закрытия бокового меню
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  // Состояние для меню профиля
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  // Обработчики открытия/закрытия меню профиля
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Обработчики открытия/закрытия меню уведомлений
  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Пункты меню навигации
  const menuItems = [
    { path: '/dashboard', icon: <Home size={20} />, text: 'Главная' },
    { path: '/tickets', icon: <TicketCheck size={20} />, text: 'Заявки' },
    { path: '/messages', icon: <Inbox size={20} />, text: 'Сообщения', count: 3 },
    { path: '/clients', icon: <Users size={20} />, text: 'Клиенты' },
    { path: '/objects', icon: <Building size={20} />, text: 'Объекты' },
    { path: '/reports', icon: <BarChart2 size={20} />, text: 'Отчеты' },
  ];

  // Дополнительные пункты меню
  const secondaryMenuItems = [
    { path: '/settings', icon: <Settings size={20} />, text: 'Настройки' },
    { path: '/help', icon: <HelpCircle size={20} />, text: 'Помощь' },
  ];

  // Имитация уведомлений для демонстрации
  const notifications = [
    { id: 1, text: 'Новая заявка #234', time: '5 минут назад' },
    { id: 2, text: 'Сообщение от клиента Иванов И.И.', time: '15 минут назад' },
    { id: 3, text: 'Напоминание: Встреча через 1 час', time: '30 минут назад' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
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
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Строительная компания — HelpDesk
          </Typography>

          {/* Иконка уведомлений */}
          <Tooltip title="Уведомления">
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

          {/* Аватар пользователя */}
          <Tooltip title="Профиль">
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer для бокового меню */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f7f9fa',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="primary">
            HelpDesk Admin
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setDrawerOpen(false);
              }}
              selected={location.pathname === item.path || 
                         (item.path !== '/dashboard' && location.pathname.startsWith(item.path))}
            >
              <ListItemIcon>
                {item.count ? (
                  <Badge badgeContent={item.count} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {secondaryMenuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setDrawerOpen(false);
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Box sx={{ p: 0 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Меню профиля */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <User size={16} style={{ marginRight: 8 }} />
          Профиль
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Выйти
        </MenuItem>
      </Menu>

      {/* Меню уведомлений */}
      <Menu
        id="notifications-menu"
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            width: '300px',
            maxHeight: '400px',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1">Уведомления</Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsMenuClose}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography variant="body2">{notification.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationsMenuClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            Показать все уведомления
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;