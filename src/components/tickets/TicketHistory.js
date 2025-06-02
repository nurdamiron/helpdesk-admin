// src/components/tickets/TicketHistory.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import {
  Clock,
  User,
  Edit,
  Settings,
  Mail,
  CheckCircle,
  MessageCircle,
  FileText,
  Users,
  AlertCircle
} from 'lucide-react';

import api from '../../api/index';
import { formatDate } from '../../utils/dateUtils';

// Функция для получения иконки события
const getEventIcon = (eventType) => {
  switch (eventType) {
    case 'created':
      return <Edit size={16} color="#4caf50" />;
    case 'updated':
      return <Settings size={16} color="#2196f3" />;
    case 'status_change':
      return <CheckCircle size={16} color="#ff9800" />;
    case 'comment_added':
      return <MessageCircle size={16} color="#9c27b0" />;
    case 'file_uploaded':
      return <FileText size={16} color="#795548" />;
    case 'assigned':
      return <Users size={16} color="#607d8b" />;
    case 'email_sent':
      return <Mail size={16} color="#00bcd4" />;
    default:
      return <AlertCircle size={16} color="#9e9e9e" />;
  }
};

// Функция для форматирования текста события
const getEventText = (event) => {
  switch (event.type) {
    case 'created':
      return 'Өтінім жасалды';
    case 'updated':
      return `Өтінім жаңартылды: ${event.details?.fields?.join(', ') || 'өзгерістер'}`;
    case 'status_change':
      return `Күйі өзгертілді: ${event.details?.from} → ${event.details?.to}`;
    case 'comment_added':
      return 'Жаңа пікір қосылды';
    case 'file_uploaded':
      return `Файл жүктелді: ${event.details?.filename || 'файл'}`;
    case 'assigned':
      return `Тағайындалды: ${event.details?.assignee_name || event.details?.assignee || 'қызметкер'}`;
    case 'email_sent':
      return `Email жіберілді: ${event.details?.recipient || 'пайдаланушы'}`;
    default:
      return 'Өтінім жаңартылды';
  }
};

const TicketHistory = ({ ticketId }) => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticketId) return;
    
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tickets/${ticketId}/history`);
        console.log('История заявки:', response.data);
        
        if (response.data && response.data.history) {
          setHistory(response.data.history);
        } else if (Array.isArray(response.data)) {
          setHistory(response.data);
        } else {
          setHistory([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке истории:', err);
        setError('Не удалось загрузить историю заявки');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [ticketId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.default, 0.5)
        }}
      >
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Әзірге тарих жоқ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Өтінімді жаңарту, пікір қосу немесе күйін өзгерту кезінде тарих жазбалары пайда болады
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          position: 'relative',
          paddingBottom: '10px',
          marginBottom: 2,
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '40px',
            height: '3px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '2px'
          }
        }}
      >
        Өтінім тарихы
      </Typography>

      <Box sx={{ 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 16,
          width: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.2),
          zIndex: 0
        }
      }}>
        {history.map((event, index) => (
          <Box 
            key={event.id || index}
            sx={{ 
              display: 'flex', 
              mb: 2,
              position: 'relative'
            }}
          >
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                zIndex: 1,
                boxShadow: `0px 0px 0px 4px ${alpha('#fff', 0.7)}`
              }}
            >
              {getEventIcon(event.type)}
            </Box>
            
            <Box 
              sx={{ 
                flex: 1, 
                ml: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                borderRadius: 2,
                p: 2,
                boxShadow: `0 2px 8px ${alpha('#000', 0.05)}`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {getEventText(event)}
                </Typography>
                <Chip 
                  label={formatDate(event.timestamp || event.created_at)} 
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <User size={14} style={{ marginRight: 4, opacity: 0.7 }} />
                <Typography variant="caption" color="text.secondary">
                  {event.performed_by?.name || event.performed_by?.email || 'Система'}
                </Typography>
              </Box>
              
              {event.details?.notes && (
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {event.details.notes}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TicketHistory;