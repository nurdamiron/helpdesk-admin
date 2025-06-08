import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Breadcrumbs as MuiBreadcrumbs, 
  Typography, 
  Link as MuiLink,
  Box,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  Home, 
  ChevronRight, 
  TicketCheck,
  Settings,
  HelpCircle,
  User
} from 'lucide-react';

const Breadcrumbs = ({ ticketId, ticketSubject }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation(['common']);
  
  // Function to get proper path label and icon
  const getPathDetails = (path) => {
    switch(path) {
      case 'dashboard':
        return { label: t('nav.dashboard', 'Панель мониторинга'), icon: <Home size={16} /> };
      case 'tickets':
        return { label: t('nav.tickets', 'Обращения'), icon: <TicketCheck size={16} /> };
      case 'settings':
        return { label: t('nav.settings', 'Настройки'), icon: <Settings size={16} /> };
      case 'help':
        return { label: t('nav.help', 'Справка'), icon: <HelpCircle size={16} /> };
      case 'profile':
        return { label: t('auth.profile', 'Профиль'), icon: <User size={16} /> };
      default:
        if (ticketId && path === ticketId) {
          return { 
            label: ticketSubject ? 
              (isMobile ? 
                `#${ticketId}: ${ticketSubject.substring(0, 20)}${ticketSubject.length > 20 ? '...' : ''}` : 
                `#${ticketId}: ${ticketSubject}`
              ) : 
              t('tickets.ticketNumber', 'Обращение #{{number}}', { number: ticketId }), 
            icon: null 
          };
        }
        return { label: path.charAt(0).toUpperCase() + path.slice(1), icon: null };
    }
  };
  
  // Split and decode the path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on dashboard page
  if (pathnames.length === 1 && pathnames[0] === 'dashboard') {
    return null;
  }
  
  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <MuiBreadcrumbs 
        separator={<ChevronRight size={14} />} 
        aria-label={t('aria.breadcrumbs', 'навигационная цепочка')}
      >
        {/* Home link always shown */}
        <MuiLink 
          component={Link} 
          to="/dashboard" 
          underline="hover" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.primary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Home size={16} style={{ marginRight: '4px' }} />
          {!isMobile && <Typography variant="body2">{t('nav.dashboard', 'Панель мониторинга')}</Typography>}
        </MuiLink>
        
        {/* Path segments */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const path = `/${pathnames.slice(0, index + 1).join('/')}`;
          const { label, icon } = getPathDetails(value);
          
          // Don't include "dashboard" in breadcrumbs
          if (value === 'dashboard') return null;
          
          return last ? (
            <Typography 
              key={path} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 500,
                color: 'text.primary'
              }}
              variant="body2"
            >
              {icon && <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
              {label}
            </Typography>
          ) : (
            <MuiLink
              component={Link}
              to={path}
              key={path}
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {icon && <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
              <Typography variant="body2">{label}</Typography>
            </MuiLink>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 