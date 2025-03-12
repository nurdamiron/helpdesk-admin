// src/pages/TicketsListPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Archive,
  User,
  Building,
  Filter,
  RefreshCw,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { ticketService } from '../api/ticketService';
import { formatDate } from '../utils/dateUtils';

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

// Приоритеты заявок
const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' },
];

const TicketsListPage = () => {
  // Состояние для списка тикетов
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Состояние для фильтров
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
    category: '',
  });
  
  // Состояние для отслеживания применения фильтров
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  // Загрузка тикетов при монтировании компонента или изменении фильтров/пагинации
  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage, appliedFilters]);

  // Функция для загрузки тикетов
  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Формируем параметры запроса
      const params = {
        ...appliedFilters,
        page: page + 1, // API uses 1-based indexing
        limit: rowsPerPage,
      };
      
      const response = await ticketService.getTickets(params);
      
      setTickets(response.data);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Не удалось загрузить список заявок');
    } finally {
      setLoading(false);
    }
  };

  // Обработчики изменения пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчики изменения фильтров
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  // Применение фильтров
  const applyFilters = () => {
    // Удаляем пустые фильтры
    const newFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    setAppliedFilters(newFilters);
    setPage(0); // Сбрасываем на первую страницу
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignedTo: '',
      category: '',
    });
    setAppliedFilters({});
    setPage(0);
  };

  // Функция для отображения статуса заявки
  const renderStatus = (status) => {
    switch (status) {
      case 'new':
        return (
          <Chip
            icon={<AlertCircle size={16} />}
            label="Новая"
            color="error"
            size="small"
          />
        );
      case 'open':
      case 'in_progress':
        return (
          <Chip
            icon={<Clock size={16} />}
            label="В работе"
            color="primary"
            size="small"
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<Clock size={16} />}
            label="Ожидает ответа"
            color="warning"
            size="small"
          />
        );
      case 'resolved':
        return (
          <Chip
            icon={<CheckCircle size={16} />}
            label="Решена"
            color="success"
            size="small"
          />
        );
      case 'closed':
        return (
          <Chip
            icon={<Archive size={16} />}
            label="Закрыта"
            color="default"
            size="small"
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Функция для отображения приоритета заявки
  const renderPriority = (priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <Chip
            label="Срочный"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      case 'high':
        return (
          <Chip
            label="Высокий"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
      case 'medium':
        return (
          <Chip
            label="Средний"
            color="info"
            size="small"
            variant="outlined"
          />
        );
      case 'low':
        return (
          <Chip
            label="Низкий"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      default:
        return null;
    }
  };

  // Найти категорию по значению
  const getCategoryLabel = (categoryValue) => {
    const category = TICKET_CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5" component="h1">
            Список заявок
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            component={RouterLink}
            to="/tickets/new"
          >
            Создать заявку
          </Button>
        </Box>

        {/* Блок с фильтрами */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Поиск по ID, названию или содержанию"
                variant="outlined"
                size="small"
                name="search"
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<Filter />}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>
                
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  color="primary"
                >
                  Применить
                </Button>
                
                <Tooltip title="Сбросить все фильтры">
                  <IconButton onClick={resetFilters}>
                    <RefreshCw size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            {filterOpen && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Статус</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      label="Статус"
                    >
                      <MenuItem value="">Все</MenuItem>
                      <MenuItem value="new">Новые</MenuItem>
                      <MenuItem value="in_progress">В работе</MenuItem>
                      <MenuItem value="pending">Ожидает ответа</MenuItem>
                      <MenuItem value="resolved">Решенные</MenuItem>
                      <MenuItem value="closed">Закрытые</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Приоритет</InputLabel>
                    <Select
                      name="priority"
                      value={filters.priority}
                      onChange={handleFilterChange}
                      label="Приоритет"
                    >
                      <MenuItem value="">Все</MenuItem>
                      {TICKET_PRIORITIES.map(priority => (
                        <MenuItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Категория</InputLabel>
                    <Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      label="Категория"
                    >
                      <MenuItem value="">Все</MenuItem>
                      {TICKET_CATEGORIES.map(category => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ответственный</InputLabel>
                    <Select
                      name="assignedTo"
                      value={filters.assignedTo}
                      onChange={handleFilterChange}
                      label="Ответственный"
                    >
                      <MenuItem value="">Все</MenuItem>
                      <MenuItem value="unassigned">Не назначен</MenuItem>
                      <MenuItem value="me">Назначенные мне</MenuItem>
                      {/* Здесь можно добавить список сотрудников */}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* Сообщение об ошибке */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Таблица заявок */}
        <Paper elevation={1}>
          <TableContainer>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
              </Box>
            ) : tickets.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="textSecondary">
                  Заявок не найдено
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Попробуйте изменить параметры фильтрации или создайте новую заявку
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Тема</TableCell>
                    <TableCell>Клиент</TableCell>
                    <TableCell>Объект</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Приоритет</TableCell>
                    <TableCell>Категория</TableCell>
                    <TableCell>Дата создания</TableCell>
                    <TableCell>Ответственный</TableCell>
                    <TableCell align="center">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => {
                    // Получаем информацию о клиенте из metadata
                    const requesterInfo = ticket.metadata?.requester || {};
                    const propertyInfo = ticket.metadata?.property || {};
                    
                    return (
                      <TableRow key={ticket.id} hover>
                        <TableCell>#{ticket.id}</TableCell>
                        <TableCell>
                          <RouterLink 
                            to={`/tickets/${ticket.id}`}
                            style={{ 
                              color: 'inherit', 
                              textDecoration: 'none',
                              fontWeight: 'medium',
                              display: 'block',
                              maxWidth: '200px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {ticket.subject}
                          </RouterLink>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <User size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                            <Tooltip title={`Email: ${requesterInfo.email || 'Н/Д'}\nТелефон: ${requesterInfo.phone || 'Н/Д'}`}>
                              <Typography variant="body2" noWrap>
                                {requesterInfo.full_name || 'Неизвестный клиент'}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Building size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                            <Tooltip title={propertyInfo.address || 'Адрес не указан'}>
                              <Typography variant="body2" noWrap sx={{ maxWidth: '120px' }}>
                                {propertyInfo.address ? 
                                  `${propertyInfo.type || ''} - ${propertyInfo.address.substring(0, 20)}${propertyInfo.address.length > 20 ? '...' : ''}` : 
                                  'Не указан'
                                }
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>{renderStatus(ticket.status)}</TableCell>
                        <TableCell>{renderPriority(ticket.priority)}</TableCell>
                        <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>
                          {ticket.assignedTo ? (
                            <Tooltip title={ticket.assignedTo.email || ''}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {ticket.assignedTo.name}
                              </Box>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Не назначен
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Просмотр заявки">
                            <IconButton
                              component={RouterLink}
                              to={`/tickets/${ticket.id}`}
                              size="small"
                              color="primary"
                            >
                              <MessageSquare size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default TicketsListPage;