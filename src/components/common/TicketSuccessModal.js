import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const TicketSuccessModal = ({ open, onClose, ticketData, ticketId }) => {
  const { t } = useTranslation(['tickets', 'common']);
  const navigate = useNavigate();

  const handleCopyTicketId = () => {
    navigator.clipboard.writeText(ticketId);
  };

  const handleContinue = () => {
    onClose();
    navigate('/');
  };

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          
          <Typography variant="h5" component="h2" gutterBottom>
            {t('tickets:success.title', 'Заявка успешно отправлена!')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            {t('tickets:success.description', 'Ваша заявка принята и будет обработана в ближайшее время.')}
          </Typography>
        </Box>

        {ticketId && (
          <>
            <Box 
              sx={{ 
                bgcolor: 'success.light', 
                color: 'success.contrastText', 
                p: 2, 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 2
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {t('tickets:success.ticketId', 'Номер заявки')}: #{ticketId}
              </Typography>
              
              <IconButton 
                size="small"
                onClick={handleCopyTicketId}
                sx={{ 
                  ml: 1,
                  color: 'success.contrastText',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  }
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {t('tickets:success.saveNumber', 'Сохраните этот номер для отслеживания статуса заявки.')}
            </Typography>
          </>
        )}

        <Alert 
          icon={<EmailIcon />} 
          severity="info" 
          sx={{ mb: 2, textAlign: 'left' }}
        >
          {t('tickets:success.emailSent', 'Информация о заявке отправлена на ваш email.')}
        </Alert>

        {ticketData && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('tickets:success.ticketDetails', 'Информация о заявке')}:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('tickets:fields.subject', 'Тема')}:
                  </Typography>
                  <Typography variant="body2">
                    {ticketData.subject}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('tickets:fields.priority', 'Приоритет')}:
                  </Typography>
                  <Box>
                    <Chip 
                      label={
                        ticketData.priority === 'urgent' ? t('tickets:priority.urgent', 'Срочный') :
                        ticketData.priority === 'high' ? t('tickets:priority.high', 'Высокий') :
                        ticketData.priority === 'medium' ? t('tickets:priority.medium', 'Средний') :
                        t('tickets:priority.low', 'Низкий')
                      }
                      color={
                        ticketData.priority === 'urgent' ? 'error' :
                        ticketData.priority === 'high' ? 'warning' :
                        ticketData.priority === 'medium' ? 'primary' :
                        'success'
                      }
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleContinue}
          size="large"
        >
          {t('common:actions.goToHome', 'Перейти на главную')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketSuccessModal;