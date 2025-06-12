import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Assignment,
  Person,
  AccessTime,
  TrendingUp,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import statisticsService from '../../api/statisticsService';
import ticketService from '../../api/ticketService';

const ManagerDashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTickets, setActiveTickets] = useState([]);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем общую статистику
      const dashboard = await statisticsService.getDashboardStats();
      setDashboardData(dashboard);

      // Получаем активные заявки для менеджера
      const tickets = await ticketService.getTickets({
        status: ['new', 'in_progress', 'pending'],
        limit: 10
      });
      setActiveTickets(tickets.tickets || []);

    } catch (err) {
      console.error('Error fetching manager data:', err);
      setError('Ошибка при загрузке данных менеджера');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" component="h2" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box 
            sx={{ 
              backgroundColor: theme.palette[color].light,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: theme.palette[color].main, fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in_progress': return 'warning';
      case 'pending': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Жүктелуде... / Загрузка...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          👨‍💼 Менеджер дашборды / Manager Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Сәлеметсіз бе, {user?.first_name}! / Добро пожаловать, {user?.first_name}!
        </Typography>
      </Box>

      {/* Статистические карточки */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Барлық өтініштер / Всего заявок"
            value={dashboardData?.tickets?.total || 0}
            icon={Assignment}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Жаңа өтініштер / Новые заявки"
            value={dashboardData?.tickets?.new_tickets || 0}
            icon={ErrorIcon}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Өңделуде / В работе"
            value={dashboardData?.tickets?.in_progress || 0}
            icon={AccessTime}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Шешілген / Решено"
            value={dashboardData?.tickets?.resolved || 0}
            icon={CheckCircle}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Дополнительная статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Шұғыл өтініштер / Срочные"
            value={dashboardData?.tickets?.urgent || 0}
            subtitle="Назначение в течение 1 часа"
            icon={Warning}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Белсенді пайдаланушылар / Активные пользователи"
            value={dashboardData?.users?.active_users || 0}
            icon={Person}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Соңғы 24 сағат / За 24 часа"
            value={dashboardData?.tickets?.last_24h || 0}
            subtitle="новых заявок"
            icon={TrendingUp}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Активные заявки */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment />
          Белсенді өтініштер / Активные заявки
        </Typography>
        
        {activeTickets.length === 0 ? (
          <Alert severity="info">
            Белсенді өтініштер жоқ / Нет активных заявок
          </Alert>
        ) : (
          <TableContainer>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Тақырып / Тема</TableCell>
                  <TableCell>Күй / Статус</TableCell>
                  <TableCell>Басымдылық / Приоритет</TableCell>
                  <TableCell>Құрылған / Создано</TableCell>
                  <TableCell>Әрекеттер / Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>#{ticket.id}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {ticket.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.status} 
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.priority} 
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(ticket.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => window.open(`/tickets/${ticket.id}`, '_blank')}
                      >
                        Көру / Просмотр
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ManagerDashboardPage;