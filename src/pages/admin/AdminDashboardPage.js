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
  Tooltip,
  useMediaQuery
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
import { authService } from '../../api/authService';
import MobileWelcomeCard from '../../components/dashboard/MobileWelcomeCard';

/**
 * Компонент дашборда для администратора
 */
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation(['dashboard', 'common', 'tickets']);
  const [stats, setStats] = useState({
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
    averageResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [userStats, setUserStats] = useState({
    admins: 0,
    moderators: 0,
    users: 0
  });

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
          pendingTickets: analyticsData.byStatus?.waiting || 0, // Изменено с pending на waiting
          averageResponseTime: analyticsData.averageResponseTime || 0
        });

        // Загружаем статистику пользователей
        try {
          const users = await authService.getUsers();
          const admins = users.filter(u => u.role === 'admin').length;
          const moderators = users.filter(u => ['moderator', 'support', 'manager', 'staff'].includes(u.role)).length;
          const regularUsers = users.filter(u => u.role === 'user').length;
          
          setUserStats({
            admins,
            moderators,
            users: regularUsers
          });
        } catch (userErr) {
          console.error('Error fetching user stats:', userErr);
        }

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
      case 'waiting': return 'info'; // Изменено с pending на waiting
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
      case 'waiting': return t('dashboard:status.pending', 'Күтуде'); // Изменено с pending на waiting, но сохранен тот же перевод
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
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: { xs: 1, sm: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Вступительный блок / Заголовок страницы */}
      {isMobile ? (
        <MobileWelcomeCard name={user?.first_name || user?.email} />
      ) : (
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
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
            }}>
              {t('dashboard:title', 'Басқару тақтасы')}
            </Typography>
            
            <Typography variant="subtitle1">
              {t('dashboard:welcome.greeting', 'Қош келдіңіз, {{name}}!', { name: user?.first_name || user?.email })}
            </Typography>
          </Box>
          
        </Box>
      )}
      
      <Grid container spacing={{ xs: 1, sm: 3 }}>
        {/* Общая статистика */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              {t('dashboard:stats.title', 'Өтініштер статистикасы')}
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 1, sm: 2 } }}>
              {/* Карточка всех заявок */}
              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: { xs: 1, sm: 2 },
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-5px)' },
                    boxShadow: { xs: theme.shadows[2], sm: theme.shadows[6] }
                  }
                }}>
                  <CardContent sx={{ 
                    px: { xs: 0.5, sm: 2 }, 
                    py: { xs: 1, sm: 2 }, 
                    '&:last-child': { pb: { xs: 1, sm: 2 } }
                  }}>
                    <Typography variant="h4" align="center" sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '1.3rem', sm: '2rem', md: '2.125rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }}>
                      {stats.totalTickets}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.875rem' }, 
                      mt: { xs: 0.2, sm: 1 },
                      px: { xs: 0.5, sm: 0 }
                    }}>
                      {t('dashboard:stats.totalTickets', 'Барлық өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка новых заявок */}
              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'error.main', 
                  color: 'white',
                  borderRadius: { xs: 1, sm: 2 },
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-5px)' },
                    boxShadow: { xs: theme.shadows[2], sm: theme.shadows[6] }
                  }
                }}>
                  <CardContent sx={{ 
                    px: { xs: 0.5, sm: 2 }, 
                    py: { xs: 1, sm: 2 }, 
                    '&:last-child': { pb: { xs: 1, sm: 2 } }
                  }}>
                    <Typography variant="h4" align="center" sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '1.3rem', sm: '2rem', md: '2.125rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }}>
                      {stats.newTickets}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.875rem' }, 
                      mt: { xs: 0.2, sm: 1 },
                      px: { xs: 0.5, sm: 0 }
                    }}>
                      {t('dashboard:stats.newTickets', 'Жаңа өтініштер')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка заявок в работе */}
              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'warning.main', 
                  color: 'white',
                  borderRadius: { xs: 1, sm: 2 },
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-5px)' },
                    boxShadow: { xs: theme.shadows[2], sm: theme.shadows[6] }
                  }
                }}>
                  <CardContent sx={{ 
                    px: { xs: 0.5, sm: 2 }, 
                    py: { xs: 1, sm: 2 }, 
                    '&:last-child': { pb: { xs: 1, sm: 2 } }
                  }}>
                    <Typography variant="h4" align="center" sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '1.3rem', sm: '2rem', md: '2.125rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }}>
                      {stats.inProgressTickets}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.875rem' }, 
                      mt: { xs: 0.2, sm: 1 },
                      px: { xs: 0.5, sm: 0 }
                    }}>
                      {t('dashboard:stats.inProgressTickets', 'Жұмыста')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Карточка решенных заявок */}
              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white',
                  borderRadius: { xs: 1, sm: 2 },
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-5px)' },
                    boxShadow: { xs: theme.shadows[2], sm: theme.shadows[6] }
                  }
                }}>
                  <CardContent sx={{ 
                    px: { xs: 0.5, sm: 2 }, 
                    py: { xs: 1, sm: 2 }, 
                    '&:last-child': { pb: { xs: 1, sm: 2 } }
                  }}>
                    <Typography variant="h4" align="center" sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '1.3rem', sm: '2rem', md: '2.125rem' },
                      lineHeight: { xs: 1.2, sm: 1.4 }
                    }}>
                      {stats.resolvedTickets}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.875rem' }, 
                      mt: { xs: 0.2, sm: 1 },
                      px: { xs: 0.5, sm: 0 }
                    }}>
                      {t('dashboard:stats.resolvedTickets', 'Шешілген')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Производительность системы */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ 
            p: { xs: 1.5, sm: 3 }, 
            borderRadius: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mb: { xs: 1, sm: 2 },
              textAlign: 'center'
            }}>
              {t('dashboard:performance.title', 'Өнімділік')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column', 
              mt: { xs: 0.5, sm: 2 },
              py: { xs: 1.5, sm: 3 },
              px: { xs: 1, sm: 3 },
              mx: { xs: 0.5, sm: 1 },
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              minHeight: { xs: '100px', sm: '150px' }
            }}>
              <Typography variant="h3" color="primary" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '3rem' },
                lineHeight: 1.2
              }}>
                {stats.averageResponseTime}h
              </Typography>
              <Typography variant="body2" sx={{ 
                mt: { xs: 0.5, sm: 1.5 }, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                textAlign: 'center',
                maxWidth: { xs: '160px', sm: '200px' }
              }}>
                {t('dashboard:performance.avgResponseTime', 'Орташа жауап беру уақыты')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Таблица последних заявок */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              mb: { xs: 1, sm: 2 } 
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                {t('dashboard:activity.title', 'Соңғы өтініштер')}
              </Typography>
              <Button 
                variant="outlined"
                endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />}
                onClick={handleViewAllTickets}
                sx={{ 
                  borderRadius: '8px',
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  py: { xs: 0.3, sm: 1 },
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 'auto', sm: '120px' }
                }}
                size="small"
              >
                {t('dashboard:recentTickets.viewAll', 'Барлығын көру')}
              </Button>
            </Box>
            
            <TableContainer sx={{ 
              maxHeight: { xs: 250, sm: 350 }, 
              mt: 1,
              overflowX: 'auto',
              borderRadius: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              '&::-webkit-scrollbar': {
                height: '6px',
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '3px',
              },
              '.MuiTableCell-root': {
                padding: { xs: '4px 6px', sm: '12px 16px' },
                whiteSpace: { xs: 'nowrap', sm: 'normal' }
              }
            }}>
              <Table 
                stickyHeader 
                size="small"
                sx={{ 
                  minWidth: { xs: 350, sm: 650 },
                  tableLayout: 'fixed'
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      width: { xs: '35px', sm: '50px' },
                      padding: { xs: '6px 4px', sm: '12px 16px' }
                    }}>ID</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      width: { xs: '35%', sm: '35%' },
                      padding: { xs: '6px 4px', sm: '12px 16px' }
                    }}>{t('dashboard:table.subject', 'Тақырып')}</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      width: { xs: '30%', sm: '20%' },
                      padding: { xs: '6px 4px', sm: '12px 16px' }
                    }}>{t('dashboard:table.status', 'Статус')}</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }, 
                      display: { xs: 'none', sm: 'table-cell' },
                      width: { sm: '25%' },
                      padding: { xs: '6px 4px', sm: '12px 16px' }
                    }}>{t('dashboard:table.date', 'Құрылған күні')}</TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      width: { xs: '40px', sm: '60px' },
                      padding: { xs: '6px 4px', sm: '12px 16px' }
                    }}>{t('dashboard:table.actions', 'Әрекеттер')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingTickets ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={24} sx={{ my: { xs: 1, sm: 2 } }} />
                      </TableCell>
                    </TableRow>
                  ) : recentTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ py: { xs: 1, sm: 2 }, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
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
                        <TableCell sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          py: { xs: 0.75, sm: 1.5 },
                          padding: { xs: '6px 4px', sm: '12px 16px' }
                        }}>{ticket.id}</TableCell>
                        <TableCell sx={{ 
                          py: { xs: 0.75, sm: 1.5 },
                          padding: { xs: '6px 4px', sm: '12px 16px' }
                        }}>
                          <Typography variant="body2" noWrap sx={{ 
                            maxWidth: { xs: 80, sm: 150, md: 200 },
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {ticket.subject}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ 
                          py: { xs: 0.75, sm: 1.5 },
                          padding: { xs: '6px 4px', sm: '12px 16px' }
                        }}>
                          {ticket.status ? (
                            <Chip 
                              label={getStatusText(ticket.status)}
                              color={getStatusColor(ticket.status)}
                              size="small"
                              sx={{ 
                                height: { xs: '20px', sm: '24px' },
                                '& .MuiChip-label': {
                                  px: { xs: 0.5, sm: 1.5 },
                                  fontSize: { xs: '0.6rem', sm: '0.75rem' }
                                }
                              }}
                            />
                          ) : (
                            <Chip 
                              label={t('dashboard:status.new', 'Жаңа')}
                              color="error"
                              size="small"
                              sx={{ 
                                height: { xs: '20px', sm: '24px' },
                                '& .MuiChip-label': {
                                  px: { xs: 0.5, sm: 1.5 },
                                  fontSize: { xs: '0.6rem', sm: '0.75rem' }
                                }
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          display: { xs: 'none', sm: 'table-cell' },
                          py: { xs: 0.75, sm: 1.5 },
                          padding: { xs: '6px 4px', sm: '12px 16px' }
                        }}>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell align="right" sx={{ 
                          py: { xs: 0.75, sm: 1.5 },
                          padding: { xs: '6px 4px', sm: '12px 16px' }
                        }}>
                          <Tooltip title={t('dashboard:actions.view', 'Қарау')}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              sx={{ 
                                padding: { xs: '2px', sm: '8px' }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTicketClick(ticket.id);
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: { xs: '14px', sm: '18px' } }} />
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
        
        {/* Статистика пользователей */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ 
            p: { xs: 1.5, sm: 3 }, 
            borderRadius: 2, 
            height: '100%'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mb: { xs: 1, sm: 2 },
              textAlign: 'center'
            }}>
              {t('dashboard:users.title', 'Жүйе пайдаланушылары')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: { xs: 1, sm: 3 },
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ 
                textAlign: 'center',
                px: { xs: 1, sm: 2 },
                py: { xs: 1.5, sm: 3 },
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                borderRadius: 2,
                width: { xs: '28%', sm: 'auto' },
                minWidth: { xs: '60px', sm: '80px' }
              }}>
                <Typography variant="h5" color="primary" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' }
                }}>
                  {userStats.admins}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: { xs: 0.3, sm: 1 }, 
                  color: 'text.secondary',
                  fontSize: { xs: '0.65rem', sm: '0.875rem' }
                }}>
                  {t('dashboard:users.admins', 'Администраторлар')}
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                px: { xs: 1, sm: 2 },
                py: { xs: 1.5, sm: 3 },
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                borderRadius: 2,
                width: { xs: '28%', sm: 'auto' },
                minWidth: { xs: '60px', sm: '80px' }
              }}>
                <Typography variant="h5" color="primary" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' }
                }}>
                  {userStats.moderators}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: { xs: 0.3, sm: 1 }, 
                  color: 'text.secondary',
                  fontSize: { xs: '0.65rem', sm: '0.875rem' }
                }}>
                  {t('dashboard:users.moderators', 'Модераторлар')}
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                px: { xs: 1, sm: 2 },
                py: { xs: 1.5, sm: 3 },
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                borderRadius: 2,
                width: { xs: '28%', sm: 'auto' },
                minWidth: { xs: '60px', sm: '80px' }
              }}>
                <Typography variant="h5" color="primary" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' }
                }}>
                  {userStats.users}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: { xs: 0.3, sm: 1 }, 
                  color: 'text.secondary',
                  fontSize: { xs: '0.65rem', sm: '0.875rem' }
                }}>
                  {t('dashboard:users.users', 'Пайдаланушылар')}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: { xs: 2, sm: 3 } }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 1.5, sm: 2 } }}>
              <Button
                variant="contained" 
                color="primary"
                onClick={() => navigate('/users')}
                sx={{ 
                  borderRadius: '8px',
                  px: { xs: 1.5, sm: 3 },
                  py: { xs: 0.75, sm: 1 },
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  },
                  width: { xs: '100%', sm: 'auto' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  maxWidth: { xs: '90%', sm: 'none' }
                }}
              >
                {t('dashboard:users.manage', 'Пайдаланушыларды басқару')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;