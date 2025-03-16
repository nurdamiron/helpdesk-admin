// src/components/common/AppLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../api/ticketService';

const AppLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const params = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  
  // State for mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  
  // State for notifications menu
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotifications = Boolean(notificationAnchorEl);
  
  // State for ticket information (for breadcrumbs)
  const [ticketInfo, setTicketInfo] = useState(null);
  
  // Check if we're on a ticket detail page
  const isTicketDetail = location.pathname.match(/^\/tickets\/(\d+)$/);
  const ticketId = isTicketDetail ? isTicketDetail[1] : null;
  
  // Fetch ticket info if needed for breadcrumbs
  useEffect(() => {
    if (ticketId && !ticketInfo) {
      const fetchTicketInfo = async () => {
        try {
          const data = await ticketService.getTicket(ticketId);
          setTicketInfo(data);
        } catch (err) {
          console.error('Error fetching ticket info for breadcrumbs:', err);
        }
      };
      
      fetchTicketInfo();
    }
  }, [ticketId, ticketInfo]);
  
  // Clear ticket info when navigating away
  useEffect(() => {
    if (!isTicketDetail) {
      setTicketInfo(null);
    }
  }, [location, isTicketDetail]);
  
  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle user menu open
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle user menu close
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle notification menu
  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  // Sidebar component (responsive)
  const sidebarContent = <Sidebar />;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        color="default"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${isMobile ? 0 : 220}px)` },
          ml: { sm: `${isMobile ? 0 : 220}px` },
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#fff'
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* App title */}
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              flexGrow: 1,
              color: theme.palette.text.primary 
            }}
          >
            Строительная компания — HelpDesk
          </Typography>
          
          {/* Notification button */}
          <IconButton
            color="inherit"
            aria-label="notifications"
            aria-controls={openNotifications ? 'notifications-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openNotifications ? 'true' : undefined}
            onClick={handleNotificationOpen}
          >
            <Badge badgeContent={3} color="error">
              <Bell size={22} />
            </Badge>
          </IconButton>
          
          {/* User avatar & menu */}
          <IconButton
            onClick={handleUserMenuOpen}
            aria-controls={openUserMenu ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openUserMenu ? 'true' : undefined}
            sx={{ ml: 1 }}
          >
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                width: 32,
                height: 32
              }}
            >
              {user?.first_name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar - responsive behavior */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{ width: { sm: 220 }, flexShrink: { sm: 0 } }}
        >
          {sidebarContent}
        </Box>
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${isMobile ? 0 : 220}px)` },
          ml: { sm: `${isMobile ? 0 : 220}px` },
          mt: '64px', // Toolbar height
          bgcolor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {/* Breadcrumbs */}
        <Container maxWidth={false} sx={{ px: isMobile ? 2 : 3, py: 0 }}>
          <Breadcrumbs 
            ticketId={ticketId} 
            ticketSubject={ticketInfo?.subject} 
          />
        </Container>
        
        {/* Page content */}
        <Outlet />
      </Box>
      
      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={openUserMenu}
        onClose={handleUserMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <User size={16} style={{ marginRight: 8 }} />
          Профиль
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Выйти
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        id="notifications-menu"
        anchorEl={notificationAnchorEl}
        open={openNotifications}
        onClose={handleNotificationClose}
        MenuListProps={{
          'aria-labelledby': 'notification-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            width: 320,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1">Уведомления (3)</Typography>
        </Box>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>Новая заявка #124</Typography>
            <Typography variant="caption" color="text.secondary">5 минут назад</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>Ответ от клиента в заявке #120</Typography>
            <Typography variant="caption" color="text.secondary">15 минут назад</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>Напоминание: дедлайн заявки #115</Typography>
            <Typography variant="caption" color="text.secondary">1 час назад</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">Все уведомления</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AppLayout;