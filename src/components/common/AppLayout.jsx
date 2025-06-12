// src/components/common/AppLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  User,
  LogOut
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../api/ticketService';
import PageTransition from './PageTransition';

const AppLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const params = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { t } = useTranslation(['common']);
  
  // State for sidebar
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  
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

  // Sidebar component (responsive)
  const sidebarContent = <Sidebar />;


  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      
      {/* Sidebar - responsive behavior */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
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
          sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        >
          {sidebarContent}
        </Box>
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: '64px', // Toolbar height
          bgcolor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
          pb: { xs: 5, sm: 0 } // Add padding at bottom for mobile
        }}
      >
        {/* Breadcrumbs */}
        <Container maxWidth={false} sx={{ px: 0, py: 0 }}>
          <Breadcrumbs 
            ticketId={ticketId} 
            ticketSubject={ticketInfo?.subject} 
          />
        </Container>
        
        {/* Page content with animation */}
        <PageTransition transitionKey={location.pathname + location.search}>
          <Box sx={{ px: 0 }}>
            <Outlet />
          </Box>
        </PageTransition>
      </Box>
    </Box>
  );
};

export default AppLayout;