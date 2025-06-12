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
  Container,
  Button,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LogIn, Info, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import HelpDeskLogo from '../../assets/images/logo.jsx';

/**
 * Компонент шапки для публичной части сайта
 * Содержит логотип, меню и кнопку авторизации
 */
const PublicHeader = () => {
  const { t } = useTranslation(['common', 'header']);
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleAdmin = () => {
    navigate('/dashboard');
  };

  // Не отображаем кнопки авторизации, пока не завершена инициализация Auth
  const showAuthButtons = initialized && !loading;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo - desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, alignItems: 'center' }}>
            <HelpDeskLogo width={50} height={50} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
{t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label={t('menu', { ns: 'header', defaultValue: 'Меню' })}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Drawer для мобильного меню */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  width: 280,
                  bgcolor: 'background.paper',
                }
              }}
            >
              <Box
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  p: 2, 
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HelpDeskLogo width={35} height={35} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {t('menu', { ns: 'header', defaultValue: 'Меню' })}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={toggleDrawer(false)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Divider />
                
                <List sx={{ px: 1 }}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      component={RouterLink} 
                      to="/"
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={t('home', { ns: 'header', defaultValue: 'Басты бет' })} 
                        primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      component="a"
                      href="https://alataustroyinvest.tilda.ws/"
                      target="_blank"
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <Building2 size={18} style={{ marginRight: 12, color: '#666' }} />
                      <ListItemText 
                        primary={t('nav.aboutUs', { ns: 'header', defaultValue: 'О нас' })} 
                        primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  {showAuthButtons && (
                    isAuthenticated ? (
                      <ListItem disablePadding sx={{ mt: 2 }}>
                        <ListItemButton 
                          onClick={handleAdmin}
                          sx={{ 
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            }
                          }}
                        >
                          <LogIn size={18} style={{ marginRight: 12 }} />
                          <ListItemText primary={t('adminPanel', { ns: 'header', defaultValue: 'Басқару панелі' })} />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <ListItem disablePadding sx={{ mt: 2 }}>
                        <ListItemButton 
                          onClick={handleLogin}
                          sx={{ 
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            }
                          }}
                        >
                          <LogIn size={18} style={{ marginRight: 12 }} />
                          <ListItemText primary={t('login', { ns: 'header', defaultValue: 'Жүйеге кіру' })} />
                        </ListItemButton>
                      </ListItem>
                    )
                  )}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('languageSelector', { ns: 'header', defaultValue: 'Тіл таңдау' })}
                  </Typography>
                  <LanguageSwitcher />
                </Box>
              </Box>
            </Drawer>
          </Box>

          {/* Logo - mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, alignItems: 'center' }}>
            <HelpDeskLogo width={40} height={40} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
{t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })}
          </Typography>

          {/* Spacer for desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                px: 3,
                py: 1,
                color: 'text.primary', 
                fontSize: '0.95rem',
                fontWeight: 500,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  color: 'primary.main',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: 0,
                  height: '2px',
                  backgroundColor: 'primary.main',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)',
                },
                '&:hover::after': {
                  width: '80%',
                }
              }}
            >
{t('home', { ns: 'header', defaultValue: 'Басты бет' })}
            </Button>
            
            <Button
              component="a"
              href="https://alataustroyinvest.tilda.ws/"
              target="_blank"
              startIcon={<Building2 size={18} />}
              sx={{ 
                px: 3,
                py: 1,
                color: 'text.primary',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  color: 'primary.main',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: 0,
                  height: '2px',
                  backgroundColor: 'primary.main',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)',
                },
                '&:hover::after': {
                  width: '80%',
                }
              }}
            >
{t('nav.aboutUs', { ns: 'header', defaultValue: 'О нас' })}
            </Button>
          </Box>

          {/* Right section - Language switcher & Login button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <LanguageSwitcher />
            </Box>
            
            {showAuthButtons && (
              isAuthenticated ? (
                <Button
                  variant="contained"
                  startIcon={<LogIn size={18} />}
                  onClick={handleAdmin}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
{t('adminPanel', { ns: 'header', defaultValue: 'Басқару панелі' })}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<LogIn size={18} />}
                  onClick={handleLogin}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
{t('login', { ns: 'header', defaultValue: 'Жүйеге кіру' })}
                </Button>
              )
            )}
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicHeader; 