// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  TicketCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Users, 
  Building,
  Calendar,
  TrendingUp
} from 'lucide-react';

import { ticketService } from '../api/ticketService';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalClients: 0,
    totalObjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Normally we would fetch dashboard data from the backend
        // For now, let's use the ticket service to fetch some data
        const response = await ticketService.getTickets();
        
        // Mock data for dashboard stats
        setStats({
          totalTickets: response.data?.length || 10,
          newTickets: 3,
          inProgressTickets: 4,
          resolvedTickets: 2,
          totalClients: 8,
          totalObjects: 12
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Не удалось загрузить данные для дашборда');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель управления
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tickets Stats */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TicketCheck size={40} />
                <Box ml={2}>
                  <Typography variant="h3">{stats.totalTickets}</Typography>
                  <Typography variant="body1">Всего заявок</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AlertCircle size={40} />
                <Box ml={2}>
                  <Typography variant="h3">{stats.newTickets}</Typography>
                  <Typography variant="body1">Новые заявки</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Clock size={40} />
                <Box ml={2}>
                  <Typography variant="h3">{stats.inProgressTickets}</Typography>
                  <Typography variant="body1">В работе</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle size={40} />
                <Box ml={2}>
                  <Typography variant="h3">{stats.resolvedTickets}</Typography>
                  <Typography variant="body1">Решенные</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Additional Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика клиентов
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Users size={24} style={{ marginRight: '12px' }} />
                <Typography variant="body1">Всего клиентов: <strong>{stats.totalClients}</strong></Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Building size={24} style={{ marginRight: '12px' }} />
                <Typography variant="body1">Всего объектов: <strong>{stats.totalObjects}</strong></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Общая информация
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Calendar size={24} style={{ marginRight: '12px' }} />
                <Typography variant="body1">
                  Сегодня: <strong>{new Date().toLocaleDateString('ru-RU')}</strong>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <TrendingUp size={24} style={{ marginRight: '12px' }} />
                <Typography variant="body1">
                  Ср. время решения: <strong>16 часов</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Tickets */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Последние заявки
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography color="textSecondary">
                Список последних заявок будет отображаться здесь
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;