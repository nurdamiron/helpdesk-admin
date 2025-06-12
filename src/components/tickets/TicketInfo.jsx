// src/components/tickets/TicketInfo.js
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  useTheme
} from '@mui/material';
import {
  Calendar,
  Tag,
  MessageCircle,
  AlertCircle,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatDate } from '../../utils/dateUtils';

const TicketInfo = ({ ticket, isMobile }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!ticket) return null;

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          position: 'relative',
          paddingBottom: '10px',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '40px',
            height: '3px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '2px'
          },
          mb: 2
        }}
      >
        {ticket.subject}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <User size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.requester')}: {' '}
                <Typography component="span">
                  {ticket.requester?.name || 
                   ticket.metadata?.requester?.full_name || 
                   t('tickets:info.notSpecified')}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Calendar size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.createdDate')}: {' '}
                <Typography component="span">
                  {formatDate(ticket.created_at)}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Tag size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.category')}: {' '}
                <Typography component="span">
                  {ticket.category}
                </Typography>
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Mail size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.email')}: {' '}
                <Typography component="span">
                  {ticket.requester?.email || 
                   ticket.metadata?.requester?.email || 
                   t('tickets:info.notSpecified')}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.phone')}: {' '}
                <Typography component="span">
                  {ticket.requester?.phone || 
                   ticket.metadata?.requester?.phone || 
                   t('tickets:info.notSpecified')}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Building size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {t('tickets:info.address')}: {' '}
                <Typography component="span">
                  {ticket.property_address || 
                   ticket.metadata?.property_address || 
                   t('tickets:info.notSpecified')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        {t('tickets:info.ticketDescription')}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
        {ticket.description}
      </Typography>
    </Box>
  );
};

export default TicketInfo;