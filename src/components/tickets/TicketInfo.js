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

import { formatDate } from '../../utils/dateUtils';

const TicketInfo = ({ ticket, isMobile }) => {
  const theme = useTheme();

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
                Өтініш беруші: {' '}
                <Typography component="span">
                  {ticket.requester?.name || 
                   ticket.metadata?.requester?.full_name || 
                   'Көрсетілмеген'}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Calendar size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Құрылған күні: {' '}
                <Typography component="span">
                  {formatDate(ticket.created_at)}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Tag size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Санат: {' '}
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
                Email: {' '}
                <Typography component="span">
                  {ticket.requester?.email || 
                   ticket.metadata?.requester?.email || 
                   'Көрсетілмеген'}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Телефон: {' '}
                <Typography component="span">
                  {ticket.requester?.phone || 
                   ticket.metadata?.requester?.phone || 
                   'Көрсетілмеген'}
                </Typography>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Building size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Мекенжай: {' '}
                <Typography component="span">
                  {ticket.property_address || 
                   ticket.metadata?.property_address || 
                   'Көрсетілмеген'}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Өтініш сипаттамасы
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
        {ticket.description}
      </Typography>
    </Box>
  );
};

export default TicketInfo;