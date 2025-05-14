import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  PlusCircle, 
  Clock, 
  CalendarClock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { ticketService } from '../api/ticketService';
import TicketForm from '../components/ticket/TicketForm';

/**
 * Страница для сотрудников с формой создания заявок и списком своих заявок
 */
const StaffHomePage = () => {
  const { t } = useTranslation(['common', 'staff']);
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Загрузка заявок пользователя (только созданные текущим сотрудником)
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!user || !user.id) {
        setTickets([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await ticketService.getTickets({ 
          created_by: user.id, // Фильтр только по заявкам, созданным текущим сотрудником
          limit: 10,
          sort: 'created_at',
          order: 'DESC'
        });
        
        const ticketData = Array.isArray(response) ? response : 
                         (response.data || response.tickets || []);
        
        // Calculate ticket statistics
        const stats = {
          total: ticketData.length,
          new: ticketData.filter(t => t.status === 'new').length,
          inProgress: ticketData.filter(t => t.status === 'in_progress').length,
          resolved: ticketData.filter(t => t.status === 'resolved').length
        };
        
        setTickets(ticketData);
        setTicketStats(stats);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке заявок:', err);
        setError(t('errors.loadingTickets', 'Не удалось загрузить список ваших заявок. Пожалуйста, попробуйте позже.'));
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserTickets();
  }, [user, formSubmitted, t]);

  // Обработчик отправки формы
  const handleSubmitSuccess = (ticket) => {
    setFormSubmitted(prev => !prev); // Инвертируем состояние для повторной загрузки
    navigate(`/success/${ticket.id}`, { 
      state: { 
        ticket,
        authorized: true,
        emailSent: ticket.email_sent 
      }
    });
  };

  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Отрисовка статуса заявки
  const renderStatus = (status) => {
    switch (status) {
      case 'new':
        return (
          <Chip
            size="small"
            icon={<AlertCircle size={14} />}
            label={t('ticketStatus.new', 'Новая')}
            color="info"
          />
        );
      case 'in_progress':
        return (
          <Chip
            size="small"
            icon={<Clock size={14} />}
            label={t('ticketStatus.inProgress', 'В работе')}
            color="warning"
          />
        );
      case 'pending':
        return (
          <Chip
            size="small"
            icon={<CalendarClock size={14} />}
            label={t('ticketStatus.pending', 'Ожидает')}
            color="secondary"
          />
        );
      case 'resolved':
        return (
          <Chip
            size="small"
            icon={<CheckCircle2 size={14} />}
            label={t('ticketStatus.resolved', 'Решена')}
            color="success"
          />
        );
      default:
        return (
          <Chip
            size="small"
            label={status}
            color="default"
          />
        );
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('staff:title', 'Рабочее пространство')}
      </Typography>
      
      {/* Приветственное сообщение */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'primary.light', 
          color: 'primary.contrastText',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('staff:welcome', 'Добрый день')}, {user?.first_name || t('staff:user', 'Сотрудник')}!
        </Typography>
        <Typography variant="body1">
          {t('staff:welcomeMessage', 'Здесь вы можете создать новую заявку или просмотреть свои существующие заявки.')}
        </Typography>
      </Paper>
      
      {/* Статистика по заявкам */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Всего заявок */}
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h4" align="center">
                {ticketStats.total}
              </Typography>
              <Typography variant="body2" align="center">
                {t('staff:stats.totalTickets', 'Всего заявок')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Новые заявки */}
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h4" align="center">
                {ticketStats.new}
              </Typography>
              <Typography variant="body2" align="center">
                {t('staff:stats.newTickets', 'Новые')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* В работе */}
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h4" align="center">
                {ticketStats.inProgress}
              </Typography>
              <Typography variant="body2" align="center">
                {t('staff:stats.inProgressTickets', 'В работе')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Решенные */}
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h4" align="center">
                {ticketStats.resolved}
              </Typography>
              <Typography variant="body2" align="center">
                {t('staff:stats.resolvedTickets', 'Решенные')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Вкладки */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={t('staff:tabs.newTicket', 'Создать заявку')} 
            icon={<PlusCircle size={18} />} 
            iconPosition="start"
          />
          <Tab 
            label={t('staff:tabs.myTickets', 'Мои заявки')} 
            icon={<Clock size={18} />} 
            iconPosition="start"
          />
        </Tabs>
        
        {/* Содержимое вкладки создания заявки */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('staff:createTicket', 'Создание новой заявки')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('staff:createTicketDescription', 'Заполните форму ниже, чтобы создать новую заявку. Обязательные поля отмечены *')}
            </Typography>
            
            <TicketForm 
              onSubmitSuccess={handleSubmitSuccess} 
              initialData={{
                user_id: user?.id,
                employee_id: user?.employee_id,
                email: user?.email,
                full_name: user?.full_name || user?.name,
                department: user?.department,
                position: user?.position
              }}
            />
          </Box>
        )}
        
        {/* Содержимое вкладки списка заявок */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('staff:myTickets', 'Мои заявки')}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>{t('common:loading', 'Загрузка...')}</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : tickets.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('staff:noTickets', 'У вас пока нет созданных заявок. Создайте первую заявку!')}
              </Alert>
            ) : (
              <List sx={{ width: '100%' }} disablePadding>
                {tickets.map((ticket, index) => (
                  <React.Fragment key={ticket.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem 
                      alignItems="flex-start"
                      secondaryAction={
                        <Button
                          component={Link}
                          to={`/tickets/${ticket.id}`}
                          endIcon={<ArrowRight size={16} />}
                          sx={{ minWidth: 100 }}
                        >
                          {t('common:details', 'Детали')}
                        </Button>
                      }
                      sx={{ py: 2 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={7}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            gutterBottom
                          >
                            #{ticket.id}: {ticket.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {ticket.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} container direction="column" spacing={1}>
                          <Grid item>
                            <Typography variant="caption" color="text.secondary">
                              {t('common:status', 'Статус')}:
                            </Typography>{' '}
                            {renderStatus(ticket.status)}
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" color="text.secondary">
                              {t('common:category', 'Категория')}:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {ticket.category_text || ticket.category || t('common:notSpecified', 'Не указана')}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" color="text.secondary">
                              {t('common:createdAt', 'Создана')}:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {formatDate(ticket.created_at)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {tickets.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  component={Link} 
                  to="/tickets" 
                  variant="outlined" 
                  endIcon={<ArrowRight size={16} />}
                >
                  {t('staff:seeAllTickets', 'Показать все мои заявки')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StaffHomePage; 