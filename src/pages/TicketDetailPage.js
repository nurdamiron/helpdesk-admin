// src/pages/TicketDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Grid, Paper, Typography, Chip, Divider, Button,
  CircularProgress, Alert, useTheme, useMediaQuery, Tab, Tabs
} from '@mui/material';
import { 
  Clock, CheckCircle, AlertCircle, MoreHorizontal, 
  ArrowLeft, Save
} from 'lucide-react';

// Импортируем обновленные сервисы и утилиты
import { ticketService } from '../api/ticketService';
import { formatTicketStatus, formatTicketPriority, formatTicketCategory } from '../utils/formatters';

// Импортируем компоненты
import TicketInfo from '../components/tickets/TicketInfo';
import TicketStatusSelect from '../components/tickets/TicketStatusSelect';
import TicketHistory from '../components/tickets/TicketHistory';
import TicketChat from '../components/chat/TicketChat';
import TicketFiles from '../components/tickets/TicketFiles';
import TicketInternalNotes from '../components/tickets/TicketInternalNotes';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Получение данных заявки при загрузке компонента
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketService.getTicketById(id);
        console.log('Получены данные заявки:', response);
        
        // Обработка ответа API
        if (response.ticket) {
          setTicket(response.ticket);
        } else if (response.data) {
          setTicket(response.data);
        } else {
          setError('Не удалось получить данные заявки');
        }
      } catch (err) {
        console.error('Ошибка при загрузке заявки:', err);
        setError('Произошла ошибка при загрузке данных заявки');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketData();
    }
  }, [id]);

  // Обработчик изменения статуса
  const handleStatusChange = (newStatus) => {
    setTicket(prev => ({ ...prev, status: newStatus }));
  };

  // Обработчик изменения приоритета
  const handlePriorityChange = (event) => {
    setTicket(prev => ({ ...prev, priority: event.target.value }));
  };

  // Сохранение изменений заявки
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Подготовка данных для обновления
      const updateData = {
        status: ticket.status,
        priority: ticket.priority
      };
      
      const response = await ticketService.updateTicket(id, updateData);
      
      console.log('Ответ API при обновлении:', response);
      
      setSavingSuccess(true);
      
      // Сбросить сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSavingSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Ошибка при обновлении заявки:', err);
      setError('Не удалось сохранить изменения. Пожалуйста, попробуйте снова.');
    } finally {
      setSaving(false);
    }
  };

  // Получение иконки статуса
  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <AlertCircle color="#f44336" size={20} />;
      case 'in_progress': return <Clock color="#2196f3" size={20} />;
      case 'pending': return <Clock color="#ff9800" size={20} />;
      case 'resolved': return <CheckCircle color="#4caf50" size={20} />;
      case 'closed': return <CheckCircle color="#9e9e9e" size={20} />;
      default: return <MoreHorizontal size={20} />;
    }
  };

  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Отображение загрузки
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <Box m={3}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft />} 
          onClick={() => navigate('/tickets')}
          sx={{ mt: 2 }}
        >
          Вернуться к списку заявок
        </Button>
      </Box>
    );
  }

  if (!ticket) return null;

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Заголовок страницы */}
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 2 : 0
        }}
      >
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft />} 
          onClick={() => navigate('/tickets')}
          sx={{ mr: isMobile ? 0 : 2 }}
          fullWidth={isMobile}
        >
          Назад
        </Button>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h1"
          sx={{ 
            whiteSpace: 'normal', 
            wordBreak: 'break-word' 
          }}
        >
          Заявка #{ticket.id}: {ticket.subject}
        </Typography>
      </Box>

      {/* Сообщение об успешном сохранении */}
      {savingSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Изменения успешно сохранены
        </Alert>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Основная колонка с информацией */}
        <Grid item xs={12} md={8} order={isMobile ? 2 : 1}>
          {/* Детали заявки */}
          <Paper elevation={1} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center',
                mb: 2, 
                gap: isMobile ? 2 : 0
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {getStatusIcon(ticket.status)}
                <Chip 
                  label={formatTicketPriority(ticket.priority)} 
                  color={
                    ticket.priority === 'urgent' ? 'error' : 
                    ticket.priority === 'high' ? 'warning' : 
                    ticket.priority === 'medium' ? 'primary' : 'default'
                  }
                  size="small"
                />
                <Chip 
                  label={formatTicketCategory(ticket.category)} 
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
                fullWidth={isMobile}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Box>

            {/* Основная информация о заявке */}
            <TicketInfo ticket={ticket} isMobile={isMobile} />
          </Paper>

          {/* Вкладки - Обсуждение, Файлы, История */}
          <Paper elevation={1} sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : "standard"}
                allowScrollButtonsMobile
              >
                <Tab 
                  label="Обсуждение"
                  id="tab-0"
                  aria-controls="tabpanel-0"
                />
                <Tab 
                  label="Файлы"
                  id="tab-1"
                  aria-controls="tabpanel-1"
                />
                <Tab 
                  label="История"
                  id="tab-2"
                  aria-controls="tabpanel-2"
                />
              </Tabs>
            </Box>
            
            {/* Содержимое вкладок */}
            <TabPanel value={activeTab} index={0}>
              <TicketChat 
                ticketId={ticket.id}
                requesterEmail={ticket.requester?.email || ticket.metadata?.requester?.email}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <TicketFiles 
                ticketId={ticket.id} 
                files={ticket.attachments || []}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <TicketHistory 
                ticketId={ticket.id}
              />
            </TabPanel>
          </Paper>
        </Grid>

        {/* Правая колонка - управление заявкой */}
        <Grid item xs={12} md={4} order={isMobile ? 1 : 2}>
          <Paper elevation={1} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
            <Typography variant="h6" gutterBottom>
              Управление заявкой
            </Typography>
            
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Статус
              </Typography>
              <TicketStatusSelect
                value={ticket.status}
                onChange={handleStatusChange}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Приоритет
              </Typography>
              <select
                value={ticket.priority || 'medium'}
                onChange={handlePriorityChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
                fullWidth
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant="h6" gutterBottom>
              Внутренние заметки
            </Typography>
            <TicketInternalNotes ticketId={ticket.id} notes={ticket.internalNotes || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Компонент для отображения содержимого вкладок
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default TicketDetailPage;