// src/pages/TicketDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Grid, Paper, Typography, Chip, Divider, Button, TextField, 
  CircularProgress, Alert, Card, CardContent, Tooltip, 
  Table, TableBody, TableCell, TableContainer, TableRow, MenuItem
} from '@mui/material';
import { 
  Clock, CheckCircle, AlertCircle, MoreHorizontal, 
  User, Building, Calendar, MapPin, FileText, MessageSquare,
  ArrowLeft, Save, Phone, Mail, Construction, Home, 
  Briefcase, DollarSign, CalendarDays
} from 'lucide-react';

import { ticketService } from '../api/ticketService';
import { formatDate } from '../utils/dateUtils';
import TicketStatusSelect from '../components/tickets/TicketStatusSelect';
import TicketAssignSelect from '../components/tickets/TicketAssignSelect';
import TicketHistory from '../components/tickets/TicketHistory';
import TicketChat from '../components/chat/TicketChat';
import TicketFiles from '../components/tickets/TicketFiles';
import TicketInternalNotes from '../components/tickets/TicketInternalNotes';

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
  { value: 'other', label: 'Другое' },
];

// Типы объектов
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Частный дом' },
  { value: 'office', label: 'Офис' },
  { value: 'commercial', label: 'Коммерческое помещение' },
  { value: 'land', label: 'Земельный участок' },
  { value: 'other', label: 'Другое' },
];

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicket(id);
      setTicket(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные заявки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setTicket({ ...ticket, status: newStatus });
  };

  const handleAssignChange = (userId) => {
    setTicket({ ...ticket, assignedTo: userId });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ticketService.updateTicket(id, {
        status: ticket.status,
        assignedTo: ticket.assignedTo
      });
      setSavingSuccess(true);
      setTimeout(() => setSavingSuccess(false), 3000);
    } catch (err) {
      setError('Не удалось сохранить изменения');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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

  // Найти категорию по значению
  const getCategoryLabel = (categoryValue) => {
    const category = TICKET_CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Найти тип объекта по значению
  const getPropertyTypeLabel = (typeValue) => {
    const propertyType = PROPERTY_TYPES.find(t => t.value === typeValue);
    return propertyType ? propertyType.label : typeValue;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={3}>
        <Alert severity="error">{error}</Alert>
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

  // Получаем информацию о клиенте и объекте из metadata
  const requesterInfo = ticket.metadata?.requester || {};
  const propertyInfo = ticket.metadata?.property || {};
  const additionalInfo = ticket.metadata?.additional || {};

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft />} 
          onClick={() => navigate('/tickets')}
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h5" component="h1">
          Заявка #{ticket.id}: {ticket.subject}
        </Typography>
      </Box>

      {savingSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Изменения успешно сохранены
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left column - Ticket details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                {getStatusIcon(ticket.status)}
                <Chip 
                  label={ticket.priority === 'urgent' ? 'Срочный' : 
                         ticket.priority === 'high' ? 'Высокий приоритет' : 
                         ticket.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'} 
                  color={ticket.priority === 'urgent' ? 'error' : 
                         ticket.priority === 'high' ? 'warning' : 
                         ticket.priority === 'medium' ? 'primary' : 'default'}
                  size="small"
                  sx={{ ml: 1 }}
                />
                <Chip 
                  label={getCategoryLabel(ticket.category)} 
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              {ticket.subject}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {ticket.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Информация о клиенте и объекте */}
            <Grid container spacing={2}>
              {/* Информация о клиенте */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={18} style={{ marginRight: '8px' }} />
                      Информация о клиенте
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          ФИО:
                        </Typography>
                        <Typography variant="body2">
                          {requesterInfo.full_name || 'Не указано'}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          Email:
                        </Typography>
                        <Typography variant="body2">
                          <a href={`mailto:${requesterInfo.email}`}>{requesterInfo.email || 'Не указан'}</a>
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          Телефон:
                        </Typography>
                        <Typography variant="body2">
                          <a href={`tel:${requesterInfo.phone}`}>{requesterInfo.phone || 'Не указан'}</a>
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          Предпочт. способ связи:
                        </Typography>
                        <Typography variant="body2">
                          {requesterInfo.preferred_contact === 'phone' ? 'Телефон' : 
                           requesterInfo.preferred_contact === 'email' ? 'Email' : 
                           requesterInfo.preferred_contact === 'whatsapp' ? 'WhatsApp' : 'Не указан'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Информация об объекте */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Building size={18} style={{ marginRight: '8px' }} />
                      Информация об объекте
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          Тип объекта:
                        </Typography>
                        <Typography variant="body2">
                          {getPropertyTypeLabel(propertyInfo.type) || 'Не указан'}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                          Адрес:
                        </Typography>
                        <Typography variant="body2">
                          {propertyInfo.address || 'Не указан'}
                        </Typography>
                      </Box>
                      
                      {propertyInfo.area && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                            Площадь:
                          </Typography>
                          <Typography variant="body2">
                            {propertyInfo.area} м²
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Дополнительная информация */}
              {(additionalInfo.desired_date || additionalInfo.budget || additionalInfo.service_type) && (
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Construction size={18} style={{ marginRight: '8px' }} />
                        Дополнительная информация
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {additionalInfo.desired_date && (
                          <Grid item xs={12} sm={4}>
                            <Box display="flex" alignItems="center">
                              <CalendarDays size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                              <Typography variant="body2">
                                <strong>Желаемая дата:</strong> {formatDate(additionalInfo.desired_date)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {additionalInfo.budget && (
                          <Grid item xs={12} sm={4}>
                            <Box display="flex" alignItems="center">
                              <DollarSign size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                              <Typography variant="body2">
                                <strong>Бюджет:</strong> {additionalInfo.budget} ₽
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {additionalInfo.service_type && (
                          <Grid item xs={12} sm={4}>
                            <Box display="flex" alignItems="center">
                              <Briefcase size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                              <Typography variant="body2">
                                <strong>Тип услуги:</strong> {
                                  additionalInfo.service_type === 'construction' ? 'Строительство' :
                                  additionalInfo.service_type === 'renovation' ? 'Ремонт' :
                                  additionalInfo.service_type === 'design' ? 'Проектирование' :
                                  additionalInfo.service_type === 'maintenance' ? 'Обслуживание' :
                                  additionalInfo.service_type === 'consultation' ? 'Консультация' :
                                  additionalInfo.service_type
                                }
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Основная информация о заявке */}
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Calendar size={18} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      <strong>Создана:</strong> {formatDate(ticket.created_at)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Clock size={18} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      <strong>Обновлена:</strong> {formatDate(ticket.updated_at)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <FileText size={18} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      <strong>Категория:</strong> {getCategoryLabel(ticket.category)}
                    </Typography>
                  </Box>
                </Grid>
                
                {ticket.company_id && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Building size={18} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        <strong>Компания:</strong> {ticket.company_name || `ID: ${ticket.company_id}`}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>

          {/* Chat and Files Tabs */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Box display="flex">
                <Button 
                  variant={activeTab === 'details' ? 'contained' : 'text'} 
                  onClick={() => setActiveTab('details')}
                  sx={{ mr: 1 }}
                >
                  Обсуждение
                </Button>
                <Button 
                  variant={activeTab === 'files' ? 'contained' : 'text'} 
                  onClick={() => setActiveTab('files')}
                  sx={{ mr: 1 }}
                >
                  Файлы
                </Button>
                <Button 
                  variant={activeTab === 'history' ? 'contained' : 'text'} 
                  onClick={() => setActiveTab('history')}
                >
                  История
                </Button>
              </Box>
            </Box>
            
            {activeTab === 'details' && (
              <TicketChat ticketId={ticket.id} />
            )}
            
            {activeTab === 'files' && (
              <TicketFiles ticketId={ticket.id} files={ticket.files || []} />
            )}
            
            {activeTab === 'history' && (
              <TicketHistory ticketId={ticket.id} />
            )}
          </Paper>
        </Grid>

        {/* Right column - Status, Assignment, Notes */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
            
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Ответственный
              </Typography>
              <TicketAssignSelect
                value={ticket.assignedTo}
                onChange={handleAssignChange}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Дедлайн
              </Typography>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                value={ticket.deadline ? new Date(ticket.deadline).toISOString().slice(0, 16) : ''}
                onChange={(e) => setTicket({ ...ticket, deadline: e.target.value })}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Приоритет
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={ticket.priority}
                onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
              >
                <MenuItem value="low">Низкий</MenuItem>
                <MenuItem value="medium">Средний</MenuItem>
                <MenuItem value="high">Высокий</MenuItem>
                <MenuItem value="urgent">Срочный</MenuItem>
              </TextField>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
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

export default TicketDetailPage;