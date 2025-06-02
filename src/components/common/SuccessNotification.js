import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SuccessNotification = ({ 
  open, 
  onClose, 
  type = 'email', // 'email' or 'whatsapp'
  ticketId = null,
  autoRedirect = true,
  redirectDelay = 3000 
}) => {
  const { t } = useTranslation(['tickets']);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));

  useEffect(() => {
    if (!open || !autoRedirect) return;

    const timer = setTimeout(() => {
      onClose();
      navigate('/');
    }, redirectDelay);

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [open, autoRedirect, redirectDelay, onClose, navigate]);

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const getMessage = () => {
    if (type === 'whatsapp') {
      return t('tickets:success.whatsappRedirect');
    }
    return t('tickets:success.emailSuccess');
  };

  const getIcon = () => {
    if (type === 'whatsapp') {
      return <WhatsAppIcon color="success" />;
    }
    return <CheckCircleIcon color="success" />;
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ 
        top: '20px !important',
        '& .MuiSnackbarContent-root': {
          padding: 0
        }
      }}
    >
      <Alert
        severity="success"
        icon={getIcon()}
        sx={{
          width: '100%',
          minWidth: '400px',
          maxWidth: '600px',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleClose}
            sx={{ fontWeight: 'bold' }}
          >
            {t('tickets:success.redirecting')} ({countdown}s)
          </Button>
        }
      >
        <AlertTitle sx={{ fontWeight: 'bold', mb: 1 }}>
          {t('tickets:success.title')}
        </AlertTitle>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          {getMessage()}
        </Typography>

        {ticketId && (
          <Box sx={{ 
            mt: 1, 
            p: 1, 
            bgcolor: 'success.light', 
            borderRadius: 1,
            display: 'inline-block'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.contrastText' }}>
              {t('tickets:success.ticketId')}: #{ticketId}
            </Typography>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default SuccessNotification;