// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  CircularProgress, Divider, Chip, Button, List, ListItem,
  ListItemText, ListItemIcon, Avatar, useTheme, useMediaQuery, Alert
} from '@mui/material';
import {
  TicketCheck, AlertCircle, Clock, CheckCircle, Users,
  Building, Calendar, TrendingUp, ArrowRight, Plus
} from 'lucide-react';
import { ticketService } from '../api/ticketService';
import { formatDate } from '../utils/dateUtils';
import { formatTicketCategory } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

// Категории заявок для строительной компании
const TICKET_CATEGORIES = [
  { value: 'repair', label: 'Ремонтные работы' },
  { value: 'plumbing', label: 'Сантехника' },
  { value: 'electrical', label: 'Электрика' },
  { value: 'construction', label: 'Строительство' },
  { value: 'design', label: 'Проектирование' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'estimate', label: 'Смета и расчеты' },
  { value: 'materials', label: 'Материалы' },
  { value: 'warranty', label: 'Гарантийный случай' },
  { value: 'other', label: 'Другое' }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [stats, setStats] = useState({
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalClients: 0,
    totalObjects: 0
  });
  
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Добавляем отладочную информацию
        console.log('Начинаем загрузку данных для дашборда');
        
        // Получаем данные о заявках с сервера
        const response = await ticketService.getTickets({ 
          limit: 10,  // Запрашиваем больше для статистики
          sort: 'created_at', 
          order: 'DESC' 
        });
        
        console.log('Получен ответ от API:', response);
        
        // Проверяем структуру ответа
        let tickets = [];
        
        if (response.data) {
          tickets = response.data;
        } else if (Array.isArray(response)) {
          tickets = response;
        } else {
          console.warn('Неожиданная структура ответа:', response);
          tickets = [];
        }
        
        if (tickets.length > 0) {
          console.log('Обрабатываем полученные заявки:', tickets);
          
          // Берем 5 последних для отображения
          setRecentTickets(tickets.slice(0, 5));
          
          // Рассчитываем статистику
          const newCount = tickets.filter(ticket => ticket.status === 'new').length;
          const inProgressCount = tickets.filter(ticket => ticket.status === 'in_progress').length;
          const resolvedCount = tickets.filter(ticket => ticket.status === 'resolved').length;
          
          console.log('Рассчитанная статистика:', { 
            total: tickets.length,
            new: newCount,
            inProgress: inProgressCount,
            resolved: resolvedCount 
          });
          
          // Уникальные клиенты и объекты
          const uniqueClientIds = new Set();
          const uniqueObjectAddresses = new Set();
          
          tickets.forEach(ticket => {
            if (ticket.requester_id) uniqueClientIds.add(ticket.requester_id);
            if (ticket.property_address) uniqueObjectAddresses.add(ticket.property_address);
          });
          
          setStats({
            totalTickets: tickets.length,
            newTickets: newCount,
            inProgressTickets: inProgressCount,
            resolvedTickets: resolvedCount,
            totalClients: uniqueClientIds.size || 0,
            totalObjects: uniqueObjectAddresses.size || 0
          });
        } else {
          console.log('Нет данных о заявках, показываем пустой список');
          setRecentTickets([]);
          setStats({
            totalTickets: 0,
            newTickets: 0,
            inProgressTickets: 0,
            resolvedTickets: 0,
            totalClients: 0,
            totalObjects: 0
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки данных для дашборда:', err);
        setError('Не удалось загрузить данные для дашборда. Попробуйте позже.');
        
        // Показываем пустой дашборд при ошибке
        setRecentTickets([]);
        setStats({
          totalTickets: 0,
          newTickets: 0,
          inProgressTickets: 0,
          resolvedTickets: 0,
          totalClients: 0,
          totalObjects: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Получение названия категории
  const getCategoryLabel = (categoryValue) => {
    const category = TICKET_CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Отображение чипа статуса
  const renderStatusChip = (status) => {
    switch (status) {
      case 'new':
        return (
          <Chip
            size="small"
            icon={<AlertCircle size={14} />}
            label="Новая"
            color="info"
          />
        );
      case 'in_progress':
        return (
          <Chip
            size="small"
            icon={<Clock size={14} />}
            label="В работе"
            color="warning"
          />
        );
      case 'resolved':
        return (
          <Chip
            size="small"
            icon={<CheckCircle size={14} />}
            label="Решена"
            color="success"
          />
        );
      case 'closed':
        return (
          <Chip
            size="small"
            icon={<CheckCircle size={14} />}
            label="Закрыта"
            color="default"
          />
        );
      default:
        return (
          <Chip
            size="small"
            label={status}
          />
        );
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h1" sx={{ mb: isMobile ? 2 : 0 }}>
          Панель управления
        </Typography>
        
        {/* <Button
          variant="contained"
          startIcon={<Plus />}
          component={Link}
          to="/tickets/new"
          size={isMobile ? "medium" : "large"}
        >
          Создать заявку
        </Button> */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Статистика заявок */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TicketCheck size={isTablet ? 32 : 40} />
                <Box ml={2}>
                  <Typography variant={isTablet ? "h4" : "h3"}>{stats.totalTickets}</Typography>
                  <Typography variant="body1">Всего заявок</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AlertCircle size={isTablet ? 32 : 40} />
                <Box ml={2}>
                  <Typography variant={isTablet ? "h4" : "h3"}>{stats.newTickets}</Typography>
                  <Typography variant="body1">Новые заявки</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Clock size={isTablet ? 32 : 40} />
                <Box ml={2}>
                  <Typography variant={isTablet ? "h4" : "h3"}>{stats.inProgressTickets}</Typography>
                  <Typography variant="body1">В работе</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle size={isTablet ? 32 : 40} />
                <Box ml={2}>
                  <Typography variant={isTablet ? "h4" : "h3"}>{stats.resolvedTickets}</Typography>
                  <Typography variant="body1">Решенные</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Информационные карточки */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Users size={20} style={{ marginRight: '10px' }} />
              Статистика клиентов
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Users size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Всего клиентов</Typography>
                    <Typography variant="h5">{stats.totalClients}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <Building size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Всего объектов</Typography>
                    <Typography variant="h5">{stats.totalObjects}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={20} style={{ marginRight: '10px' }} />
              Общая информация
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <Calendar size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Сегодня</Typography>
                    <Typography variant="h5">
                      {new Date().toLocaleDateString('ru-RU')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <TrendingUp size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Среднее время решения</Typography>
                    <Typography variant="h5">16 часов</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Последние заявки */}
      <Paper sx={{ p: 3 }}>
        <Box 
          sx={{ 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}
        >
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: isMobile ? 1 : 0,
            width: isMobile ? '100%' : 'auto'
          }}>
            <Clock size={20} style={{ marginRight: '10px' }} />
            Последние заявки
          </Typography>
          
          <Button
            component={Link}
            to="/tickets"
            endIcon={<ArrowRight />}
            sx={{ 
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}
          >
            Все заявки
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {recentTickets.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              Заявок пока нет. Создайте новую заявку!
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recentTickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <ListItem 
                  button 
                  component={Link} 
                  to={`/tickets/${ticket.id}`}
                  sx={{ 
                    py: 2, 
                    px: isMobile ? 1 : 2,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {ticket.id}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box 
                        display="flex" 
                        alignItems={isMobile ? 'flex-start' : 'center'} 
                        flexDirection={isMobile ? 'column' : 'row'}
                      >
                        <Typography 
                          variant="subtitle1" 
                          component="span" 
                          fontWeight="medium" 
                          sx={{ mr: 2, mb: isMobile ? 1 : 0 }}
                          noWrap={!isMobile}
                        >
                          {ticket.subject}
                        </Typography>
                        {renderStatusChip(ticket.status)}
                      </Box>
                    }
                    secondary={
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        mt={0.5}
                        flexDirection={isMobile ? 'column' : 'row'}
                      >
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          component="span"
                          sx={{ mr: 2, mb: isMobile ? 0.5 : 0 }}
                        >
                          {typeof formatTicketCategory === 'function' 
                            ? formatTicketCategory(ticket.category) 
                            : getCategoryLabel(ticket.category)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="span">
                          {typeof formatDate === 'function' 
                            ? formatDate(ticket.created_at) 
                            : new Date(ticket.created_at).toLocaleString('ru-RU')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentTickets.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardPage;