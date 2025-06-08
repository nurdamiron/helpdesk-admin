// src/components/common/AppLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
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
  User,
  LogOut
} from 'lucide-react';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../api/ticketService';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import HelpDeskLogo from '../../assets/images/logo.jsx';
import PageTransition from './PageTransition';

const AppLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const params = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { t } = useTranslation(['common']);
  
  // State for mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  
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
          console.error(t('errors.ticketInfo', 'Ошибка при загрузке информации о заявке:'), err);
        }
      };
      
      fetchTicketInfo();
    }
  }, [ticketId, ticketInfo, t]);
  
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
              aria-label={t('aria.openMenu', 'Открыть меню')}
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                p: 1.2,
                '&:active': {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                } 
              }}
            >
              <MenuIcon size={26} />
            </IconButton>
          )}
          
          {/* App title */}
          <Box 
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.text.primary 
            }}
          >
            <HelpDeskLogo width={isMobile ? 120 : 140} height={40} />
          </Box>
          
          {/* Language switcher */}
          <Box sx={{ mr: 2 }}>
            <LanguageSwitcher />
          </Box>
          
          
          {/* User avatar & menu */}
          <IconButton
            onClick={handleUserMenuOpen}
            aria-controls={openUserMenu ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openUserMenu ? 'true' : undefined}
            aria-label={t('auth.profile', 'Профиль')}
            sx={{ 
              ml: 1, 
              p: isMobile ? 1 : 0.5,
              '&:active': {
                bgcolor: 'rgba(25, 118, 210, 0.12)',
              } 
            }}
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              width: { xs: '85%', sm: 280 }, 
              maxWidth: 320,
              boxSizing: 'border-box',
              boxShadow: 3
            },
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
          minHeight: 'calc(100vh - 64px)',
          pb: { xs: 5, sm: 0 } // Add padding at bottom for mobile
        }}
      >
        {/* Breadcrumbs */}
        <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 3 }, py: 0 }}>
          <Breadcrumbs 
            ticketId={ticketId} 
            ticketSubject={ticketInfo?.subject} 
          />
        </Container>
        
        {/* Page content with animation */}
        <PageTransition transitionKey={location.pathname + location.search}>
          <Box sx={{ px: { xs: 1, sm: 0 } }}>
            <Outlet />
          </Box>
        </PageTransition>
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
          {t('auth.profile', 'Профиль')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          {t('auth.logout', 'Выход')}
        </MenuItem>
      </Menu>
      
    </Box>
  );
};

export default AppLayout;