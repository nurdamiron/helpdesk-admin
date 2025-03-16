// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home,
  TicketCheck,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Menu items configuration
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Главная', 
      icon: <Home size={isMobile ? 22 : 24} /> 
    },
    { 
      path: '/tickets', 
      label: 'Заявки', 
      icon: <TicketCheck size={isMobile ? 22 : 24} /> 
    },
    { 
      path: '/settings', 
      label: 'Настройки', 
      icon: <Settings size={isMobile ? 22 : 24} /> 
    },
    { 
      path: '/help', 
      label: 'Помощь', 
      icon: <HelpCircle size={isMobile ? 22 : 24} /> 
    }
  ];

  // Check if the current path matches or is a subpath of the menu item
  const isActive = (path) => {
    // Exact match for dashboard (to avoid matching all paths)
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    // For other paths, check if the current location starts with the path
    return location.pathname.startsWith(path);
  };

  return (
    <Paper 
      square 
      elevation={0}
      sx={{ 
        width: isMobile ? '100%' : '220px',
        height: isMobile ? 'auto' : '100vh',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        bgcolor: '#f8f9fa'
      }}
    >
      {/* App logo/title */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component={Link} 
          to="/dashboard"
          sx={{ 
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          HelpDesk
        </Typography>
      </Box>

      {/* Navigation menu */}
      <List sx={{ width: '100%', pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              padding: isMobile ? '12px 16px' : '12px 24px',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
              borderColor: isActive(item.path) ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
              },
              textDecoration: 'none',
              transition: 'all 0.2s ease'
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
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;