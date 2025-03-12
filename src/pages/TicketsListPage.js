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
  Tooltip
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
  Archive
} from 'lucide-react';
import { ticketService } from '../api/ticketService';

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

// Приоритеты заявок
const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
];

const TicketsListPage = () => {
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
      setError('Не удалось загрузить список заявок. Попробуйте позже.');
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
            icon={<Archive size={14} />}
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

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Список заявок
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          component={Link}
          to="/tickets/new"
        >
          Создать заявку
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Filter />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
              </Button>
              
              <Button
                variant="contained"
                onClick={applyFilters}
              >
                Применить
              </Button>
              
              <IconButton onClick={resetFilters} title="Сбросить фильтры">
                <RefreshCw size={20} />
              </IconButton>
            </Box>
          </Grid>
          
          {showFilters && (
            <>
              <Grid item xs={12} sm={4}>
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
              
              <Grid item xs={12} sm={4}>
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
              
              <Grid item xs={12} sm={4}>
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

      {/* Ticket list */}
      <Paper>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : tickets.length === 0 ? (
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
                  <TableCell>Категория</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Приоритет</TableCell>
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
                    <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                    <TableCell>{renderStatus(ticket.status)}</TableCell>
                    <TableCell>{renderPriority(ticket.priority)}</TableCell>
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
        </TableContainer>
        
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
      </Paper>
    </Container>
  );
};

export default TicketsListPage;