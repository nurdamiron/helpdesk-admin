// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Home,
  TicketCheck,
  Settings,
  ExternalLink,
  User,
  UserCircle,
  Users
} from 'lucide-react';
import HelpDeskLogo from '../../assets/images/logo.jsx';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../hooks/usePermission';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation(['common', 'users']);
  const { user, isAdmin, isModerator } = useAuth();
  const { canManageUsers } = usePermission();
  
  // Get configuration based on user role
  const getMenuConfig = () => {
    // Base menu available to all users
    const baseMenu = [
      { 
        path: '/dashboard', 
        label: t('nav.dashboard', 'Басқару тақтасы'), 
        icon: <Home size={isMobile ? 22 : 24} />,
        visible: true
      },
      {
        path: '/tickets',
        label: t('nav.tickets', 'Өтініштер'),
        icon: <TicketCheck size={isMobile ? 22 : 24} />,
        visible: true
      },

    ];

    // Add user management for admins
    if (isAdmin) {
      baseMenu.push({ 
        path: '/users', 
        label: t('users:managementTitle', 'Управление пользователями'), 
        icon: <Users size={isMobile ? 22 : 24} />,
        visible: true // Admin should always see this menu item
      });
    }

    return baseMenu;
  };

  const menuItems = getMenuConfig().filter(item => item.visible);

  // Check if the current path matches or is a subpath of the menu item
  const isActive = (path) => {
    // Handle special cases
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    // For other paths, check if the current location starts with the path
    return location.pathname.startsWith(path);
  };

  // For regular menu items
  const renderMenuItem = (item) => {
    return (
      <ListItem
        key={item.path}
        component={Link}
        to={item.path}
        sx={{
          padding: isMobile ? '16px 20px' : '14px 24px',
          minHeight: isMobile ? '60px' : '48px',
          color: isActive(item.path) ? 'primary.main' : 'text.primary',
          bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
          borderColor: isActive(item.path) ? 'primary.main' : 'transparent',
          '&:hover': {
            bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
          },
          '&:active': {
            bgcolor: 'rgba(25, 118, 210, 0.16)',
          },
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          my: 0.5,
          borderRadius: 1
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: isMobile ? 40 : 48,
          color: isActive(item.path) ? 'primary.main' : 'text.secondary'
        }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.label} 
          primaryTypographyProps={{ 
            fontWeight: isActive(item.path) ? 600 : 400,
            fontSize: isMobile ? '0.95rem' : '1rem'
          }}
        />
      </ListItem>
    );
  };

  return (
    <Paper 
      square 
      elevation={0}
      sx={{ 
        width: isMobile ? '100%' : '240px',
        height: isMobile ? 'auto' : '100vh',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.drawer,
        bgcolor: '#f8f9fa',
        overflow: 'auto'
      }}
    >
      {/* App logo/title */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <HelpDeskLogo 
            width={isMobile ? 120 : 150} 
            height={isMobile ? 120 : 150} 
          />
        </Link>
      </Box>

      {/* User info */}
      {user && (
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {user.first_name} {user.last_name || ''}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.role === 'admin' && t('users:roles.admin', 'Администратор')}
              {user.role === 'support' && t('common:roles.support', 'Поддержка')}
              {user.role === 'manager' && t('common:roles.manager', 'Менеджер')}
              {user.role === 'moderator' && t('users:roles.moderator', 'Модератор')}
              {user.role === 'staff' && t('users:roles.staff', 'Сотрудник')}
              {user.role === 'user' && t('users:roles.user', 'Пользователь')}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation menu */}
      <List sx={{ width: '100%', pt: 1, overflow: 'auto' }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      
    </Paper>
  );
};

export default Sidebar;