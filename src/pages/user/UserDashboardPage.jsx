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
  useTheme,
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { 
  AddCircleOutline,
  Visibility as VisibilityIcon, 
  Assignment as AssignmentIcon, 
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ticketService } from '../../api/ticketService';

/**
 * Улучшенный компонент дашборда для обычного пользователя с казахскими переводами
 */
const UserDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(['user', 'common', 'tickets']);

  // Загрузка заявок пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true);
        // Используем сервис для получения заявок пользователя
        const response = await ticketService.getTickets({
          // Фильтруем только заявки текущего пользователя
          user_id: user?.id,
          sort: 'created_at',
          order: 'desc'
        });
        
        // Обработка ответа API, который может иметь разную структуру
        let ticketsData = [];
        
        if (Array.isArray(response)) {
          ticketsData = response;
        } else if (response?.data) {
          ticketsData = response.data;
        } else if (response?.tickets) {
          ticketsData = response.tickets;
        }
          
        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user tickets:', err);
        setError(t('common:errors.loadFailed', 'Сіздің өтініштеріңізді жүктеу мүмкін болмады'));
        setLoading(false);
      }
    };

    // Только если пользователь залогинен
    if (user?.id) {
      fetchUserTickets();
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

  // Обработчик перехода к списку всех заявок
  const handleViewAllTickets = () => {
    navigate('/tickets');
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
      case 'new': return t('tickets:status.new', 'Жаңа');
      case 'in_progress': return t('tickets:status.in_progress', 'Жұмыста');
      case 'pending': return t('tickets:status.pending', 'Күтуде');
      case 'resolved': return t('tickets:status.resolved', 'Шешілген');
      case 'closed': return t('tickets:status.closed', 'Жабық');
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

  // Функция для безопасной фильтрации tickets
  const safeFilter = (filterFn) => {
    if (!Array.isArray(tickets)) return 0;
    return tickets.filter(filterFn).length;
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
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Заголовок страницы */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 }
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.primary.main,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}>
            {t('user:dashboard.title', 'Пайдаланушы тақтасы')}
          </Typography>
          
          <Typography variant="subtitle1">
            {t('user:dashboard.welcome', 'Қош келдіңіз, {{name}}!', { name: user?.first_name || user?.email })}
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
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Статистика заявок */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}>
              {t('user:dashboard.yourTickets', 'Сіздің өтініштеріңіз')}
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {/* Все заявки */}
              <Grid item xs={6} sm={4} md={4}>
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
                      {Array.isArray(tickets) ? tickets.length : 0}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('user:dashboard.totalTickets', 'Барлық өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Активные заявки */}
              <Grid item xs={6} sm={4} md={4}>
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
                      {safeFilter(t => t.status === 'in_progress' || t.status === 'new')}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('user:dashboard.activeTickets', 'Актив өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Решенные заявки */}
              <Grid item xs={6} sm={4} md={4}>
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
                      {safeFilter(t => t.status === 'resolved')}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('user:dashboard.resolvedTickets', 'Шешілген өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Боковая информационная панель */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                {t('user:dashboard.info.title', 'Ақпарат')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('user:dashboard.info.createTicketInfo', 'Жаңа өтініш жасау үшін, "Жаңа өтініш" түймесін басыңыз. Өзіңіздің өтініштеріңіздің жағдайын "Соңғы өтініштер" бөлімінде бақылай аласыз.')}
              </Typography>
              <Box sx={{ 
                bgcolor: 'primary.light', 
                color: 'white', 
                p: 2, 
                borderRadius: 2,
                mt: { xs: 1.5, sm: 2 }
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('user:dashboard.info.needHelp', 'Көмек керек пе?')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {t('user:dashboard.info.supportContact', 'Егер сұрақтарыңыз болса, көмек қызметіне хабарласыңыз:')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  +7 (777) 777-77-77
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AssignmentIcon />}
              onClick={handleViewAllTickets}
              sx={{ 
                mt: { xs: 2, sm: 3 },
                borderRadius: '8px',
                py: { xs: 1.2, sm: 1.5 },
                width: { xs: '100%', sm: 'auto' },
                boxShadow: theme.shadows[1],
                '&:hover': {
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              {t('user:dashboard.viewAllTickets', 'Барлық өтініштерді көру')}
            </Button>
          </Paper>
        </Grid>
        
        {/* Таблица последних заявок */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                {t('user:dashboard.recentTickets', 'Соңғы өтініштер')}
              </Typography>
              <Button 
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewAllTickets}
                sx={{ borderRadius: '8px' }}
              >
                {t('user:dashboard.viewAll', 'Барлығын көру')}
              </Button>
            </Box>
            
            <TableContainer sx={{ 
              maxHeight: { xs: 300, sm: 350 }, 
              mt: 1,
              overflowX: 'auto'
            }}>
              <Table 
                stickyHeader 
                size="small"
                sx={{ minWidth: { xs: 550, sm: 650 } }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('tickets:table.subject', 'Тақырып')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('tickets:table.status', 'Күйі')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('tickets:table.created', 'Құрылған күні')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('tickets:table.actions', 'Әрекеттер')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(tickets) && tickets.length > 0 ? (
                    tickets.slice(0, 5).map((ticket, index) => (
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
                          <Typography variant="body2" noWrap sx={{ 
                            maxWidth: { xs: 80, sm: 120, md: 150 },
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}>
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
                        <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'table-cell' }
                      }}>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('tickets:actions.view', 'Қарау')}>
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
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: { xs: 4, sm: 5 } }}>
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography variant="body1" gutterBottom color="text.secondary">
                            {t('user:dashboard.noTickets', 'Сізде әлі өтініштер жоқ')}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutline />}
                            onClick={handleCreateTicket}
                            sx={{ 
                              mt: 2,
                              py: { xs: 1.2, sm: 1.5 },
                              px: { xs: 2, sm: 3 },
                              fontWeight: 'bold',
                              borderRadius: '8px',
                              width: { xs: '100%', sm: 'auto' },
                              boxShadow: theme.shadows[3],
                              '&:hover': {
                                boxShadow: theme.shadows[5],
                              }
                            }}
                          >
                            {t('user:dashboard.createFirstTicket', 'Алғашқы өтініш жасау')}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
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

export default UserDashboardPage;