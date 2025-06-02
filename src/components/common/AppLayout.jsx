import React, { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

const drawerWidth = 240;

const AppLayout = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isModerator, isStaff } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Определяем пункты меню в зависимости от роли пользователя
  const getMenuItems = () => {
    // Базовые пункты меню для всех
    const baseItems = [
      // Для обычных сотрудников показываем страницу создания заявок первой
      ...(isStaff && !isAdmin && !isModerator ? [
        { text: t('nav.staffHome', 'Рабочее пространство'), icon: <HomeIcon />, path: '/staff-home' },
      ] : []),
      
      // Для админов и модераторов показываем дашборд
      ...(isAdmin || isModerator ? [
        { text: t('nav.dashboard', 'Панель мониторинга'), icon: <DashboardIcon />, path: '/dashboard' },
      ] : []),
      
      // Заявки доступны всем, но у сотрудников там будут только их заявки
      { text: t('nav.tickets', 'Заявки'), icon: <TicketIcon />, path: '/tickets' },
      
      // Управление пользователями доступно только админам и модераторам
      ...(isAdmin || isModerator ? [
        { text: t('nav.users', 'Пользователи'), icon: <PeopleIcon />, path: '/users' },
      ] : []),
      
      // Настройки профиля для всех
      { text: t('nav.settings', 'Настройки'), icon: <SettingsIcon />, path: '/settings' },
      
      
    ];
    
    return baseItems;
  };

  // Получаем пункты меню
  const menuItems = getMenuItems();

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {t('app.title')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{
              backgroundColor: location.pathname.includes(item.path) 
                ? 'rgba(0, 0, 0, 0.04)' 
                : 'transparent',
            }}
          >
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Используем компонент Header */}
      <Header drawerOpen={mobileOpen} setDrawerOpen={setMobileOpen} />
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout; 