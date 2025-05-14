import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AddCircleOutline, 
  Visibility as VisibilityIcon, 
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../api/ticketService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент дашборда для модератора с улучшенным дизайном и казахским языком
 */
const ModeratorDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation(['dashboard', 'common', 'tickets']);
  const [stats, setStats] = useState({
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
    totalAssigned: 0,
    averageResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Загрузка статистики при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Получаем данные аналитики через API
        const analyticsData = await ticketService.getTicketsAnalytics();
        
        // Обрабатываем полученные данные
        setStats({
          totalTickets: analyticsData.totalTickets || 0,
          newTickets: analyticsData.byStatus?.new || 0,
          inProgressTickets: analyticsData.byStatus?.in_progress || 0,
          resolvedTickets: analyticsData.byStatus?.resolved || 0,
          pendingTickets: analyticsData.byStatus?.pending || 0,
          totalAssigned: analyticsData.assignedToCurrentUser || 0,
          averageResponseTime: analyticsData.averageResponseTime || 0
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(t('dashboard:error', 'Статистика жүктеу кезінде қате пайда болды'));
        setLoading(false);
      }
    };

    const fetchRecentTickets = async () => {
      try {
        setLoadingTickets(true);
        // Получаем последние заявки
        const tickets = await ticketService.getTickets({
          limit: 5,
          sort: 'created_at',
          order: 'desc'
        });
        
        // Обрабатываем полученные данные
        const ticketsData = Array.isArray(tickets) ? tickets : 
                         (tickets?.data || tickets?.tickets || []);
        
        setRecentTickets(ticketsData.slice(0, 5));
        setLoadingTickets(false);
      } catch (err) {
        console.error('Error fetching recent tickets:', err);
        setLoadingTickets(false);
      }
    };

    fetchData();
    fetchRecentTickets();
  }, [t]);

  // Обработчик перехода к странице заявки
  const handleTicketClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  // Получение цвета статуса заявки
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error';
      case 'in_progress': return 'warning';
      case 'pending': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  // Получение текста статуса заявки
  const getStatusText = (status) => {
    switch (status) {
      case 'new': return t('dashboard:status.new', 'Жаңа');
      case 'in_progress': return t('dashboard:status.in_progress', 'Жұмыста');
      case 'pending': return t('dashboard:status.pending', 'Күтуде');
      case 'resolved': return t('dashboard:status.resolved', 'Шешілген');
      case 'closed': return t('dashboard:status.closed', 'Жабық');
      default: return status;
    }
  };

  // Форматирование даты
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

  // Обработчик создания новой заявки
  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };

  // Обработчик перехода к списку всех заявок
  const handleViewAllTickets = () => {
    navigate('/tickets');
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
    <Box sx={{ px: 4, py: 3, maxWidth: 1600, mx: 'auto' }}>
      {/* Вступительный блок / Заголовок страницы */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            {t('dashboard:moderator.title', 'Модератор тақтасы')}
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
            py: 1.5,
            px: 3,
            fontWeight: 'bold',
            boxShadow: (theme) => theme.shadows[4],
            '&:hover': {
              boxShadow: (theme) => theme.shadows[8],
            },
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            borderRadius: '8px'
          }}
        >
          {t('tickets:list.newTicket', 'Жаңа өтініш')}
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Общая статистика */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}>
              {t('dashboard:stats.title', 'Өтініштер статистикасы')}
            </Typography>
            <Grid container spacing={2}>
              {/* Карточка всех заявок */}
              <Grid item xs={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <CardContent>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                      {stats.totalAssigned}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('dashboard:stats.totalAssigned', 'Тағайындалған')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка новых заявок */}
              <Grid item xs={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'error.main', 
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <CardContent>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                      {stats.newTickets}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('dashboard:stats.newTickets', 'Жаңа өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка заявок в работе */}
              <Grid item xs={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'warning.main', 
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <CardContent>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                      {stats.inProgressTickets}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('dashboard:stats.inProgressTickets', 'Жұмыста')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка решенных заявок */}
              <Grid item xs={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <CardContent>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                      {stats.resolvedTickets}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('dashboard:stats.resolvedTickets', 'Шешілген')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Производительность модератора */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ 
            p: 3, 
            borderRadius: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              {t('dashboard:performance.title', 'Өнімділік')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column', 
              mt: 2,
              py: 2,
              bgcolor: 'rgba(25, 118, 210, 0.05)',
              borderRadius: 2
            }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {stats.averageResponseTime}h
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('dashboard:performance.avgResponseTime', 'Орташа жауап беру уақыты')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Таблица последних заявок */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                {t('dashboard:activity.title', 'Соңғы өтініштер')}
              </Typography>
              <Button 
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewAllTickets}
                sx={{ borderRadius: '8px' }}
              >
                {t('dashboard:recentTickets.viewAll', 'Барлығын көру')}
              </Button>
            </Box>
            
            <TableContainer sx={{ maxHeight: 350, mt: 1 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('dashboard:table.subject', 'Тақырып')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('dashboard:table.status', 'Статус')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('dashboard:table.date', 'Құрылған күні')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('dashboard:table.actions', 'Әрекеттер')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingTickets ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={30} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  ) : recentTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
                          {t('dashboard:recentTickets.noTickets', 'Өтініштер табылмады')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTickets.map((ticket, index) => (
                      <TableRow 
                        key={ticket.id}
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => handleTicketClick(ticket.id)}
                      >
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {ticket.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {ticket.status ? (
                            <Chip 
                              label={getStatusText(ticket.status)}
                              color={getStatusColor(ticket.status)}
                              size="small"
                            />
                          ) : (
                            <Chip 
                              label={t('dashboard:status.new', 'Жаңа')}
                              color="error"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('dashboard:actions.view', 'Қарау')}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTicketClick(ticket.id);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModeratorDashboardPage;