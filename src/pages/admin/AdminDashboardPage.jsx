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
import statisticsService from '../../api/statisticsService';
import StatCard from '../../components/statistics/StatCard';
import TicketsChart from '../../components/statistics/TicketsChart';
import CategoryPieChart from '../../components/statistics/CategoryPieChart';
import StaffPerformanceTable from '../../components/statistics/StaffPerformanceTable';
import KPIMetrics from '../../components/statistics/KPIMetrics';
import { 
  Assignment as AssignmentIcon,
  NewReleases as NewReleasesIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Support as SupportIcon
} from '@mui/icons-material';

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
  const [dashboardStats, setDashboardStats] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [kpiMetrics, setKpiMetrics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // Загрузка статистики при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем расширенную статистику через новый API
        const [dashboardData, timelineStats, staffStats, kpiData] = await Promise.all([
          statisticsService.getDashboardStats(),
          statisticsService.getTimelineStats(selectedPeriod),
          statisticsService.getStaffPerformance(),
          statisticsService.getKPIMetrics()
        ]);

        // Устанавливаем данные дашборда
        if (dashboardData?.data) {
          setDashboardStats(dashboardData.data);
          setStats({
            totalTickets: dashboardData.data.tickets?.total || 0,
            newTickets: dashboardData.data.tickets?.new_tickets || 0,
            inProgressTickets: dashboardData.data.tickets?.in_progress || 0,
            resolvedTickets: dashboardData.data.tickets?.resolved || 0,
            pendingTickets: dashboardData.data.tickets?.pending || 0,
            averageResponseTime: dashboardData.data.avgResponseTime || 0
          });
          
          // Статистика пользователей из нового API
          if (dashboardData.data.users) {
            setUserStats({
              admins: dashboardData.data.users.admin_count || 0,
              moderators: dashboardData.data.users.moderator_count || 0,
              users: dashboardData.data.users.user_count || 0
            });
          }
        }

        // Устанавливаем данные временной статистики
        if (timelineStats?.data) {
          setTimelineData(timelineStats.data);
        }

        // Устанавливаем данные производительности сотрудников
        if (staffStats?.data) {
          setStaffPerformance(staffStats.data);
        }

        // Устанавливаем KPI метрики
        if (kpiData?.data) {
          setKpiMetrics(kpiData.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        // Если новый API не работает, пробуем старый
        try {
          const analyticsData = await ticketService.getTicketsAnalytics();
          setStats({
            totalTickets: analyticsData.totalTickets || 0,
            newTickets: analyticsData.byStatus?.new || 0,
            inProgressTickets: analyticsData.byStatus?.in_progress || 0,
            resolvedTickets: analyticsData.byStatus?.resolved || 0,
            pendingTickets: analyticsData.byStatus?.waiting || 0,
            averageResponseTime: analyticsData.averageResponseTime || 0
          });
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
        }
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
  }, [t, selectedPeriod]);

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
        {/* Карточки основной статистики */}
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title={t('dashboard:stats.totalTickets', 'Всего заявок')}
            value={stats.totalTickets}
            icon={AssignmentIcon}
            color="primary"
            loading={loading}
            subtitle={dashboardStats?.tickets?.last_24h ? 
              `+${dashboardStats.tickets.last_24h} за 24ч` : null}
          />
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title={t('dashboard:stats.newTickets', 'Новые заявки')}
            value={stats.newTickets}
            icon={NewReleasesIcon}
            color="error"
            loading={loading}
            trend={dashboardStats?.tickets?.last_7days && stats.totalTickets > 0 ? 
              Math.round((stats.newTickets / stats.totalTickets) * 100) : null}
          />
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title={t('dashboard:stats.inProgressTickets', 'В работе')}
            value={stats.inProgressTickets}
            icon={HourglassEmptyIcon}
            color="warning"
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title={t('dashboard:stats.resolvedTickets', 'Решено')}
            value={stats.resolvedTickets}
            icon={CheckCircleIcon}
            color="success"
            loading={loading}
            trend={dashboardStats?.tickets?.total > 0 ? 
              Math.round((stats.resolvedTickets / dashboardStats.tickets.total) * 100) : null}
            trendLabel={dashboardStats?.tickets?.total > 0 ? 
              `${Math.round((stats.resolvedTickets / dashboardStats.tickets.total) * 100)}% от всех` : null}
          />
        </Grid>
        
        {/* График динамики заявок */}
        <Grid item xs={12} md={8}>
          <TicketsChart 
            data={timelineData} 
            loading={loading}
          />
        </Grid>
        
        {/* Распределение по категориям */}
        <Grid item xs={12} md={4}>
          <CategoryPieChart 
            data={dashboardStats?.categories || []}
            loading={loading}
          />
        </Grid>
        
        {/* KPI Метрики */}
        <Grid item xs={12}>
          <KPIMetrics 
            data={kpiMetrics}
            loading={loading}
          />
        </Grid>
        
        {/* Производительность сотрудников */}
        <Grid item xs={12}>
          <StaffPerformanceTable
            data={staffPerformance}
            loading={loading}
          />
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