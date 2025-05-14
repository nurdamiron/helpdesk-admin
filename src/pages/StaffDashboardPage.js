import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ticketService } from '../api/ticketService';

/**
 * Компонент дашборда для сотрудника
 */
const StaffDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(['dashboard', 'common']);

  // Загрузка заявок сотрудника при монтировании компонента
  useEffect(() => {
    const fetchStaffTickets = async () => {
      try {
        setLoading(true);
        // Используем сервис для получения заявок, созданных сотрудником
        const response = await ticketService.getTickets({
          // Фильтруем только заявки, созданные текущим сотрудником
          submitted_by: user?.id,  // Используем submitted_by вместо created_by
          employee_id: user?.id    // Также проверяем по employee_id, если API его поддерживает
        });
        
        // Обработка ответа API, который может иметь разную структуру
        const ticketsData = Array.isArray(response) ? response : 
                          (response?.data || response?.tickets || []);
                          
        // Дополнительная фильтрация на клиенте, чтобы гарантировать, что показываем только заявки этого сотрудника
        const filteredTickets = ticketsData.filter(ticket => 
          ticket.submitted_by === user?.id || 
          ticket.employee_id === user?.id || 
          ticket.created_by === user?.id ||
          ticket.user_id === user?.id
        );
        
        // Рассчет статистики по заявкам
        const stats = {
          total: filteredTickets.length,
          new: filteredTickets.filter(t => t.status === 'new').length,
          inProgress: filteredTickets.filter(t => t.status === 'in_progress').length,
          resolved: filteredTickets.filter(t => t.status === 'resolved').length
        };
        
        setTickets(filteredTickets);
        setTicketStats(stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching staff tickets:', err);
        setError(t('common:errors.loadFailed', 'Не удалось загрузить ваши заявки'));
        setLoading(false);
      }
    };

    // Только если пользователь залогинен
    if (user?.id) {
      fetchStaffTickets();
    } else {
      setLoading(false);
    }
  }, [user, t]);

  // Обработчик перехода к странице создания заявки
  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };

  // Обработчик перехода к деталям заявки
  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  // Получение цвета статуса заявки
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error';
      case 'in_progress': return 'warning';
      case 'pending': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  // Получение текста статуса заявки
  const getStatusText = (status) => {
    switch (status) {
      case 'new': return t('dashboard:status.new', 'Новая');
      case 'in_progress': return t('dashboard:status.in_progress', 'В работе');
      case 'pending': return t('dashboard:status.pending', 'Ожидает');
      case 'resolved': return t('dashboard:status.resolved', 'Решена');
      default: return status;
    }
  };

  // Форматирование даты в соответствии с текущей локалью
  const formatDate = (dateString) => {
    const currentLang = i18n.language?.substring(0, 2) || 'kk';
    const locale = currentLang === 'en' ? 'en-US' : (currentLang === 'ru' ? 'ru-RU' : 'kk-KZ');
    
    return new Date(dateString).toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Отображение загрузки
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Шапка */}
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t('dashboard:title', 'Басқару тақтасы')}
                </Typography>
                <Typography variant="subtitle1">
                  {t('dashboard:welcome.greeting', 'Қош келдіңіз, {{name}}!', { name: user?.first_name || user?.email })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutline />}
                onClick={handleCreateTicket}
                sx={{ 
                  height: 'fit-content',
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  boxShadow: (theme) => theme.shadows[4],
                  '&:hover': {
                    boxShadow: (theme) => theme.shadows[8],
                  },
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {t('dashboard:createTicket', 'Жаңа өтініш')}
              </Button>
            </Box>
          </Grid>
          
          {/* Статистика заявок */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('dashboard:stats.title', 'Статистика')}
              </Typography>
              <Grid container spacing={2}>
                {/* Всего заявок */}
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h4" align="center">
                        {ticketStats.total}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t('dashboard:stats.totalTickets', 'Всего заявок')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Новые заявки */}
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h4" align="center">
                        {ticketStats.new}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t('dashboard:stats.newTickets', 'Новые')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* В работе */}
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h4" align="center">
                        {ticketStats.inProgress}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t('dashboard:stats.inProgressTickets', 'В работе')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Решенные */}
                <Grid item xs={6} sm={3}>
                  <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h4" align="center">
                        {ticketStats.resolved}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t('dashboard:stats.resolvedTickets', 'Решенные')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Список заявок */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('dashboard:recentTickets.title', 'Последние заявки')}
              </Typography>
              
              <List>
                {tickets && tickets.length > 0 ? (
                  tickets.slice(0, 10).map((ticket, index) => (
                    <React.Fragment key={ticket.id}>
                      <ListItem 
                        button 
                        onClick={() => handleTicketClick(ticket.id)}
                        sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <ListItemText 
                          primary={ticket.subject}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                #{ticket.id} • 
                              </Typography>{' '}
                              {formatDate(ticket.created_at)}
                            </>
                          }
                        />
                        <Chip 
                          label={getStatusText(ticket.status)} 
                          color={getStatusColor(ticket.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                      {index < tickets.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>
                      {t('dashboard:recentTickets.noTickets', 'У вас пока нет заявок')}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutline />}
                      onClick={handleCreateTicket}
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        px: 3,
                        fontWeight: 'bold',
                        boxShadow: (theme) => theme.shadows[4],
                        '&:hover': {
                          boxShadow: (theme) => theme.shadows[8],
                        },
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('dashboard:createFirstTicket', 'Создать первую заявку')}
                    </Button>
                  </Box>
                )}
              </List>
              
              {tickets && tickets.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/tickets')}
                    sx={{ px: 3 }}
                  >
                    {t('dashboard:recentTickets.viewAll', 'Смотреть все мои заявки')}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StaffDashboardPage;