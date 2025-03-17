// src/components/tickets/TicketHistory.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot
} from '@mui/lab';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  MessageSquare, 
  Paperclip, 
  Edit,
  Star,
  Flag,
  Tag
} from 'lucide-react';

import { ticketService } from '../../api/ticketService';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils'; // Исправлен импорт
import { formatTicketStatus, formatTicketPriority } from '../../utils/formatters';

const TicketHistory = ({ ticketId, language = 'ru' }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTicketHistory(ticketId);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching ticket history:', err);
        setError('Не удалось загрузить историю заявки');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [ticketId]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'status_change': return <Clock size={20} />;
      case 'assigned': return <User size={20} />;
      case 'comment': return <MessageSquare size={20} />;
      case 'file_upload': return <Paperclip size={20} />;
      case 'file_delete': return <Paperclip size={20} />;
      case 'created': return <AlertCircle size={20} />;
      case 'resolved': return <CheckCircle size={20} />;
      case 'edited': return <Edit size={20} />;
      case 'priority_change': return <Star size={20} />;
      case 'deadline_change': return <Flag size={20} />;
      case 'category_change': return <Tag size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'status_change': return 'primary';
      case 'assigned': return 'info';
      case 'comment': return 'secondary';
      case 'file_upload': return 'warning';
      case 'file_delete': return 'error';
      case 'created': return 'error';
      case 'resolved': return 'success';
      case 'edited': return 'warning';
      case 'priority_change': return 'warning';
      case 'deadline_change': return 'warning';
      case 'category_change': return 'info';
      default: return 'grey';
    }
  };

  const getEventTitle = (event) => {
    switch (event.type) {
      case 'status_change':
        return `Статус изменен на "${formatTicketStatus(event.data.newStatus, language)}"`;
      case 'assigned':
        return `Назначен ответственный: ${event.data.assignedTo?.name || 'Неизвестно'}`;
      case 'comment':
        return `Добавлен комментарий`;
      case 'file_upload':
        return `Загружен файл: ${event.data.fileName || 'Файл'}`;
      case 'file_delete':
        return `Удален файл: ${event.data.fileName || 'Файл'}`;
      case 'created':
        return `Заявка создана`;
      case 'resolved':
        return `Заявка решена`;
      case 'edited':
        return `Заявка отредактирована`;
      case 'priority_change':
        return `Приоритет изменен на "${formatTicketPriority(event.data.newPriority, language)}"`;
      case 'deadline_change':
        return event.data.newDeadline 
          ? `Установлен дедлайн: ${formatDate(event.data.newDeadline)}` 
          : `Дедлайн удален`;
      case 'category_change':
        return `Категория изменена на "${event.data.newCategory}"`;
      default:
        return `Неизвестное событие`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box p={2}>
        <Typography color="textSecondary">
          История событий пуста
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: '500px', overflowY: 'auto', p: 1 }}>
      <Timeline position="right">
        {history.map((event, index) => (
          <TimelineItem key={event.id || index}>
            <TimelineSeparator>
              <TimelineDot color={getEventColor(event.type)}>
                {getEventIcon(event.type)}
              </TimelineDot>
              {index < history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2">
                  {getEventTitle(event)}
                </Typography>
                
                {event.data?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {event.data.description}
                  </Typography>
                )}
                
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {event.user ? `${event.user.name}` : 'Система'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(event.timestamp, language)}
                  </Typography>
                </Box>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default TicketHistory;