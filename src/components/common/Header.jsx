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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
        zIndex: theme.zIndex.drawer + 1, // Ensure header stays on top
      }}
      elevation={2}
    >
      <Toolbar sx={{ 
        minHeight: { xs: '56px', sm: '64px' },
        px: { xs: 1, sm: 2 }
      }}>
        <IconButton
          color="inherit"
          aria-label={t('common:aria.openDrawer', 'open drawer')}
          edge="start"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{ 
            mr: { xs: 1, sm: 2 }, 
            display: { sm: 'none' },
            padding: { xs: '8px', sm: '12px' }
          }}
        >
          {drawerOpen ? <ChevronLeft size={isMobile ? 20 : 24} /> : <MenuIcon size={isMobile ? 20 : 24} />}
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            marginLeft: { xs: 0.5, sm: 0 },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {menuItems.find(item => location.pathname.startsWith(item.path))?.text || t('app.title')}
        </Typography>
        
        {/* Language switcher - more visible on mobile */}
        <Box sx={{ 
          mr: { xs: 1, sm: 2 }, 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <LanguageSwitcher />
        </Box>

        {/* Profile */}
        <Tooltip title={t('auth.account', 'Профиль')}>
          <IconButton 
            onClick={handleOpenUserMenu} 
            sx={{ 
              p: 0,
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 }
            }}
          >
            <Avatar 
              alt={user?.name || "User"}
              sx={{ 
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}
            >
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
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 150,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1
              }
            }
          }}
        >
          <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/settings/profile">
            <Typography textAlign="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {t('auth.profile', 'Профиль')}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {t('auth.logout', 'Шығу')}
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 