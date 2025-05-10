// src/pages/TicketsListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle,
  Archive,
  ArrowRight,
  Calendar,
  Tag,
  Flag,
  MessageSquare
} from 'lucide-react';
import { ticketService } from '../api/ticketService';

// Типы обращений
const TICKET_TYPES = [
  { value: 'request', label: 'Запрос' },
  { value: 'complaint', label: 'Жалоба' },
  { value: 'suggestion', label: 'Предложение' },
  { value: 'other', label: 'Другое' }
];

// Категории обращений для внутреннего портала
const TICKET_CATEGORIES = [
  { value: 'it', label: 'ИТ поддержка' },
  { value: 'hr', label: 'Кадровые вопросы' },
  { value: 'facilities', label: 'Инфраструктура' },
  { value: 'finance', label: 'Финансы' },
  { value: 'legal', label: 'Юридические вопросы' },
  { value: 'security', label: 'Безопасность' },
  { value: 'management', label: 'Руководство' },
  { value: 'other', label: 'Другое' }
];

// Приоритеты заявок
const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
];

const TicketsListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for tickets data
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    priority: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Fetch tickets when component mounts or filters change
  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage, appliedFilters]);

  // Function to fetch tickets from API (or mock)
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare params for API
      const params = {
        ...appliedFilters,
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage
      };
      
      // Get tickets
      const result = await ticketService.getTickets(params);
      
      // Update state with data
      setTickets(result.data || []);
      setTotalTickets(result.total || 0);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Не удалось загрузить список обращений. Попробуйте позже.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    // Remove empty filters
    const filtersToApply = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    setAppliedFilters(filtersToApply);
    setPage(0); // Reset to first page
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      priority: '',
      category: ''
    });
    setAppliedFilters({});
    setPage(0);
  };

  // Get category label
  const getCategoryLabel = (categoryValue) => {
    const category = TICKET_CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Get type label
  const getTypeLabel = (typeValue) => {
    const type = TICKET_TYPES.find(t => t.value === typeValue);
    return type ? type.label : typeValue;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render status chip
  const renderStatus = (status) => {
    switch (status) {
      case 'new':
        return (
          <Chip
            size="small"
            icon={<AlertCircle size={14} />}
            label="Новая"
            color="info"
            variant="outlined"
          />
        );
      case 'in_review':
        return (
          <Chip
            size="small"
            icon={<Eye size={14} />}
            label="На рассмотрении"
            color="secondary"
            variant="outlined"
          />
        );
      case 'in_progress':
        return (
          <Chip
            size="small"
            icon={<Clock size={14} />}
            label="В работе"
            color="warning"
            variant="outlined"
          />
        );
      case 'pending':
        return (
          <Chip
            size="small"
            icon={<MoreHorizontal size={14} />}
            label="Ожидает"
            color="default"
            variant="outlined"
          />
        );
      case 'resolved':
        return (
          <Chip
            size="small"
            icon={<CheckCircle size={14} />}
            label="Решена"
            color="success"
            variant="outlined"
          />
        );
      case 'closed':
        return (
          <Chip
            size="small"
            icon={<Archive size={14} />}
            label="Закрыта"
            color="default"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            size="small"
            label={status}
            color="default"
            variant="outlined"
          />
        );
    }
  };

  // Render type chip
  const renderType = (type) => {
    switch (type) {
      case 'request':
        return (
          <Chip
            size="small"
            icon={<MessageSquare size={14} />}
            label="Запрос"
            color="primary"
            variant="outlined"
          />
        );
      case 'complaint':
        return (
          <Chip
            size="small"
            icon={<AlertCircle size={14} />}
            label="Жалоба"
            color="error"
            variant="outlined"
          />
        );
      case 'suggestion':
        return (
          <Chip
            size="small"
            icon={<Flag size={14} />}
            label="Предложение"
            color="success"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            size="small"
            label={getTypeLabel(type)}
            color="default"
            variant="outlined"
          />
        );
    }
  };

  // Render priority chip
  const renderPriority = (priority) => {
    switch (priority) {
      case 'low':
        return <Chip size="small" label="Низкий" color="success" variant="outlined" />;
      case 'medium':
        return <Chip size="small" label="Средний" color="info" variant="outlined" />;
      case 'high':
        return <Chip size="small" label="Высокий" color="warning" variant="outlined" />;
      case 'urgent':
        return <Chip size="small" label="Срочный" color="error" variant="outlined" />;
      default:
        return null;
    }
  };

  // Render mobile card view for tickets
  const renderMobileTicketList = () => {
    if (tickets.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            Заявок не найдено
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры фильтрации или создайте новую заявку
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 2 }}>
        {tickets.map(ticket => (
          <Card key={ticket.id} sx={{ mb: 2 }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  #{ticket.id}
                </Typography>
                <Box>
                  {renderStatus(ticket.status)}
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                {ticket.subject}
              </Typography>
              
              {ticket.metadata?.requester?.full_name && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Клиент: {ticket.metadata.requester.full_name}
                </Typography>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <Tag size={14} style={{ marginRight: '4px', opacity: 0.7 }} />
                    <Typography variant="body2" color="textSecondary">
                      {getCategoryLabel(ticket.category)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    <Flag size={14} style={{ marginRight: '4px', opacity: 0.7 }} />
                    <Typography variant="body2" color="textSecondary">
                      {renderPriority(ticket.priority)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Calendar size={14} style={{ marginRight: '4px', opacity: 0.7 }} />
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(ticket.created_at)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <Button
                component={Link}
                to={`/tickets/${ticket.id}`}
                size="small"
                endIcon={<ArrowRight size={16} />}
                sx={{ textTransform: 'none' }}
              >
                Подробнее
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 3 }}>
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 2 : 0
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: isMobile ? 1 : 0 }}>
          Список заявок
        </Typography>
        {/* <Button
          variant="contained"
          startIcon={<Plus />}
          component={Link}
          to="/tickets/new"
          fullWidth={isMobile}
        >
          Создать заявку
        </Button> */}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Поиск по ID, названию или содержанию"
              variant="outlined"
              size="small"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Filter />}
                onClick={() => setShowFilters(!showFilters)}
                fullWidth={isMobile}
                sx={{ flex: isMobile ? '1 0 100%' : '1 0 auto' }}
              >
                {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
              </Button>
              
              <Button
                variant="contained"
                onClick={applyFilters}
                fullWidth={isMobile}
                sx={{ flex: isMobile ? '1 0 calc(50% - 8px)' : '1 0 auto' }}
              >
                Применить
              </Button>
              
              <IconButton 
                onClick={resetFilters} 
                title="Сбросить фильтры"
                sx={{ 
                  flex: isMobile ? '0 0 auto' : '0 0 auto',
                  ml: isMobile ? 'auto' : 0
                }}
              >
                <RefreshCw size={20} />
              </IconButton>
            </Box>
          </Grid>
          
          {showFilters && (
            <>
              <Grid item xs={12} sm={6} md={4}>
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
                    <MenuItem value="resolved">Решенные</MenuItem>
                    <MenuItem value="closed">Закрытые</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Тип</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Тип"
                  >
                    <MenuItem value="">Все</MenuItem>
                    {TICKET_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
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
              
              <Grid item xs={12} sm={6} md={4}>
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
            </>
          )}
        </Grid>
      </Paper>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Ticket list - responsive view */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : isMobile ? (
          // Mobile card view
          <Box sx={{ p: 2 }}>
            {renderMobileTicketList()}
            <TablePagination
              component="div"
              count={totalTickets}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Строк:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
          </Box>
        ) : (
          // Desktop table view
          <TableContainer>
            {tickets.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">
                  Заявок не найдено
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Попробуйте изменить параметры фильтрации или создайте новую заявку
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Заявка</TableCell>
                    {!isTablet && <TableCell>Категория</TableCell>}
                    <TableCell>Статус</TableCell>
                    {!isTablet && <TableCell>Тип</TableCell>}
                    {!isTablet && <TableCell>Приоритет</TableCell>}
                    <TableCell>Дата создания</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>#{ticket.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {ticket.subject}
                        </Typography>
                        {ticket.metadata?.requester?.full_name && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            {ticket.metadata.requester.full_name}
                          </Typography>
                        )}
                      </TableCell>
                      {!isTablet && <TableCell>{getCategoryLabel(ticket.category)}</TableCell>}
                      <TableCell>{renderStatus(ticket.status)}</TableCell>
                      {!isTablet && <TableCell>{renderType(ticket.type)}</TableCell>}
                      {!isTablet && <TableCell>{renderPriority(ticket.priority)}</TableCell>}
                      <TableCell>{formatDate(ticket.created_at)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Просмотреть заявку">
                          <IconButton
                            component={Link}
                            to={`/tickets/${ticket.id}`}
                            size="small"
                          >
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ещё">
                          <IconButton size="small">
                            <MoreHorizontal size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <TablePagination
              component="div"
              count={totalTickets}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default TicketsListPage;