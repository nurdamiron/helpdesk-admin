import React from 'react';
import { Box, Container, Typography, Link, Grid, Stack, IconButton, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Home, 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  Building2
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation(['common', 'footer', 'header']);
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white',
        borderTop: '4px solid',
        borderColor: 'primary.main',
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Building2 size={28} style={{ marginRight: '12px' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
                Алатау Строй Инвест
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
              {t('description', { ns: 'footer', defaultValue: 'Мы строим надежное будущее. Качество, инновации и ответственность - наши главные принципы.' })}
            </Typography>
            <Link 
              href="https://alataustroyinvest.tilda.ws/" 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                color: '#4ecdc4',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: '#45b7d1',
                  textDecoration: 'underline'
                }
              }}
            >
              {t('visitWebsite', { ns: 'footer', defaultValue: 'Посетить наш сайт' })}
              <ExternalLink size={16} style={{ marginLeft: '6px' }} />
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
              {t('links', { ns: 'footer', defaultValue: 'Полезные ссылки' })}
            </Typography>
            <Stack spacing={1.5}>
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { 
                    color: '#4ecdc4',
                    textDecoration: 'underline' 
                  } 
                }}
              >
                <Home size={16} style={{ marginRight: '8px' }} />
                {t('login', { ns: 'header', defaultValue: 'Вход в систему' })}
              </Link>
              <Link 
                href="https://alataustroyinvest.tilda.ws/#rec759669926" 
                target="_blank"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { 
                    color: '#4ecdc4',
                    textDecoration: 'underline' 
                  } 
                }}
              >
                <Building2 size={16} style={{ marginRight: '8px' }} />
                {t('aboutCompany', { ns: 'footer', defaultValue: 'О компании' })}
              </Link>
              <Link 
                href="https://alataustroyinvest.tilda.ws/#rec759714086" 
                target="_blank"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { 
                    color: '#4ecdc4',
                    textDecoration: 'underline' 
                  } 
                }}
              >
                <Building2 size={16} style={{ marginRight: '8px' }} />
                {t('ourProjects', { ns: 'footer', defaultValue: 'Наши проекты' })}
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
              {t('contact', { ns: 'footer', defaultValue: 'Контакты' })}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ marginRight: '12px', marginTop: '2px', color: '#4ecdc4' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t('address', { ns: 'footer', defaultValue: 'Казахстан, г. Алматы, ул. Азербаева, 161б' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ marginRight: '12px', color: '#4ecdc4' }} />
                <Link 
                  href="mailto:it-support@alataustroyinvest.kz" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    textDecoration: 'none',
                    '&:hover': { 
                      color: '#4ecdc4',
                      textDecoration: 'underline' 
                    } 
                  }}
                >
                  it-support@alataustroyinvest.kz
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone size={18} style={{ marginRight: '12px', color: '#4ecdc4' }} />
                <Link 
                  href="tel:+77770131838" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    textDecoration: 'none',
                    '&:hover': { 
                      color: '#4ecdc4',
                      textDecoration: 'underline' 
                    } 
                  }}
                >
                  +7 (777) 013-1838
                </Link>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {t('workingHours', { ns: 'footer', defaultValue: 'Пн-Пт: 8:00-18:00, Сб: 9:00-13:00' })}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 'medium' }}>
                {t('emergencySupport', { ns: 'footer', defaultValue: 'Круглосуточная IT поддержка' })}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 5, mb: 3 }} />
        
        <Box sx={{ 
          mt: 3, 
          textAlign: 'center',
          pb: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              fontWeight: 300
            }}
          >
            © {currentYear} {t('helpdesk', { ns: 'header', defaultValue: 'Қолдау Орталығы' })} • Алатау Строй Инвест
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.75rem',
              mt: 0.5,
              display: 'block'
            }}
          >
            {t('copyright', { ns: 'footer', defaultValue: 'Барлық құқықтар қорғалған.' })}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#4ecdc4',
              fontSize: '0.75rem',
              mt: 1,
              display: 'block',
              fontWeight: 500
            }}
          >
            Powered by IT Department
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 