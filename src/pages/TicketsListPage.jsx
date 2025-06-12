import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ticketService } from '../api/ticketService';

/**
 * Компонент списка заявок с улучшенным дизайном и поддержкой казахского языка
 */
const TicketsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isModerator } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation(['tickets', 'common']);
  
  // Состояние для данных таблицы
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  
  // Получение параметров фильтрации из URL
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status');
  const priorityFromUrl = queryParams.get('priority');
  const searchFromUrl = queryParams.get('search');

  // Состояние для фильтрации и сортировки
  const [filters, setFilters] = useState({
    status: statusFromUrl || '',
    priority: priorityFromUrl || '',
    search: searchFromUrl || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Загрузка заявок при монтировании компонента или изменении фильтров
  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage, filters, sortBy, sortDirection]);
  
  // Функция загрузки заявок из реального API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Подготовка параметров запроса
      const params = {
        page: page + 1, // API использует 1-based индексацию
        limit: rowsPerPage,
        sort: sortBy,
        order: sortDirection,
        ...filters
      };
      
      // Если пользователь не админ и не модератор, 
      // то backend уже будет фильтровать по user_id из токена аутентификации
      // Но для дополнительной защиты, явно указываем user_id для обычных пользователей
      if (user && user.role === 'user') {
        params.user_id = user.id;
      }
      
      // Реальный API запрос
      const response = await ticketService.getTickets(params);
      
      // Обработка ответа API, который может иметь разную структуру
      let ticketsData = [];
      let total = 0;
      
      if (Array.isArray(response)) {
        ticketsData = response;
        total = response.length;
      } else if (response?.data) {
        ticketsData = response.data;
        total = response.pagination?.total || response.total || response.data.length;
      } else if (response?.tickets) {
        ticketsData = response.tickets;
        total = response.total || response.tickets.length;
      }

      // Используем только реальные данные с API
      setTotalTickets(total);
      setTickets(ticketsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(t('tickets:errors.loadFailed', 'Өтініштер тізімін жүктеу кезінде қате болды'));
      setLoading(false);
    }
  };
  
  // Обработчик изменения страницы
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Обработчик изменения фильтров
  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0); // Сбрасываем страницу при изменении фильтров

    // Обновляем URL с параметрами фильтров
    const params = new URLSearchParams(location.search);
    if (event.target.value) {
      params.set(field, event.target.value);
    } else {
      params.delete(field);
    }
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };
  
  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: ''
    });
    setSortBy('created_at');
    setSortDirection('desc');
    setPage(0);

    // Очищаем URL от параметров фильтров
    navigate(location.pathname, { replace: true });
  };
  
  // Обработчик создания новой заявки
  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };
  
  // Обработчик перехода к детальной странице заявки
  const handleTicketClick = (id) => {
    navigate(`/tickets/${id}`);
  };
  
  // Обработчик изменения сортировки
  const handleSort = (field) => {
    if (sortBy === field) {
      // Если уже сортируем по этому полю, меняем направление
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Иначе устанавливаем новое поле и сортируем по убыванию
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Получение иконки сортировки
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: 16 }} />
      : <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5, fontSize: 16 }} />;
  };
  
  // Получение цвета статуса заявки
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error';
      case 'in_progress': return 'warning';
      case 'waiting': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      case '': return 'default'; // Пустой статус
      default: return 'default';
    }
  };
  
  // Получение текста статуса заявки
  const getStatusText = (status) => {
    switch (status) {
      case 'new': return t('tickets:status.new', 'Новая');
      case 'in_progress': return t('tickets:status.in_progress', 'В работе');
      case 'waiting': return t('tickets:status.pending', 'Ожидает');
      case 'resolved': return t('tickets:status.resolved', 'Решена');
      case 'closed': return t('tickets:status.closed', 'Закрыта');
      case '': return '';  // Пустой статус
      case null: return ''; // Null статус
      case undefined: return ''; // Undefined статус
      default: return status;
    }
  };
  
  // Получение цвета приоритета заявки
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  // Получение текста приоритета заявки
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return t('tickets:priority.urgent', 'Шұғыл');
      case 'high': return t('tickets:priority.high', 'Жоғары');
      case 'medium': return t('tickets:priority.medium', 'Орташа');
      case 'low': return t('tickets:priority.low', 'Төмен');
      default: return priority;
    }
  };
  
  // Форматирование даты по текущей локали
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
  
  // Получение видимых колонок в зависимости от размера экрана
  const getVisibleColumns = () => {
    if (isMobile) {
      return ['id', 'subject', 'status', 'actions'];
    } else if (isTablet) {
      return ['id', 'subject', 'status', 'created_at', 'actions'];
    } else {
      // Убрана колонка assigned_to
      return ['id', 'subject', 'status', 'priority', 'requester', 'created_at', 'actions'];
    }
  };
  
  const visibleColumns = getVisibleColumns();
  
  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Заголовок страницы */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.primary.main,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}>
          {t('tickets:list.title', 'Өтініштер тізімі')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(prev => !prev)}
            sx={{ borderRadius: '8px' }}
          >
            {showFilters 
              ? t('tickets:filters.hide', 'Сүзгілерді жасыру') 
              : t('tickets:filters.show', 'Сүзгілерді көрсету')}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateTicket}
            sx={{ 
              borderRadius: '8px',
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[5],
              },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              whiteSpace: 'nowrap',
            }}
          >
            {t('tickets:list.newTicket', 'Жаңа өтініш')}
          </Button>
        </Box>
      </Box>
      
      {/* Ошибка при загрузке */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Панель фильтров */}
      {showFilters && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                label={t('tickets:filters.search', 'Іздеу')}
                value={filters.search}
                onChange={handleFilterChange('search')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />,
                  sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('tickets:filters.status', 'Статус')}</InputLabel>
                <Select
                  value={filters.status}
                  onChange={handleFilterChange('status')}
                  label={t('tickets:filters.status', 'Статус')}
                >
                  <MenuItem value="">{t('tickets:filters.all', 'Все')}</MenuItem>
                  <MenuItem value="new">{t('tickets:status.new', 'Новая')}</MenuItem>
                  <MenuItem value="in_progress">{t('tickets:status.in_progress', 'В работе')}</MenuItem>
                  <MenuItem value="waiting">{t('tickets:status.pending', 'Ожидает')}</MenuItem>
                  <MenuItem value="resolved">{t('tickets:status.resolved', 'Решена')}</MenuItem>
                  <MenuItem value="closed">{t('tickets:status.closed', 'Закрыта')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('tickets:filters.priority', 'Басымдық')}</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={handleFilterChange('priority')}
                  label={t('tickets:filters.priority', 'Басымдық')}
                >
                  <MenuItem value="">{t('tickets:filters.all', 'Барлығы')}</MenuItem>
                  <MenuItem value="low">{t('tickets:priority.low', 'Төмен')}</MenuItem>
                  <MenuItem value="medium">{t('tickets:priority.medium', 'Орташа')}</MenuItem>
                  <MenuItem value="high">{t('tickets:priority.high', 'Жоғары')}</MenuItem>
                  <MenuItem value="urgent">{t('tickets:priority.urgent', 'Шұғыл')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-end' }, gap: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
                sx={{ 
                  borderRadius: '8px',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                }}
              >
                {t('tickets:filters.reset', 'Тазарту')}
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={fetchTickets}
                sx={{ 
                  borderRadius: '8px',
                  boxShadow: theme.shadows[2],
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                }}
              >
                {t('tickets:filters.apply', 'Қолдану')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Таблица заявок */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: { xs: 1, sm: 2 } }}>
        <TableContainer sx={{ 
          '.MuiTableCell-root': {
            padding: { xs: '8px 8px', sm: '16px 16px' }
          },
          overflowX: 'auto'
        }}>
          <Table stickyHeader aria-label={t('tickets:list.tableLabel', 'Өтініштер тізімі')}>
            <TableHead>
              <TableRow>
                {visibleColumns.includes('id') && (
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSort('id')}
                    >
                      ID
                      {getSortIcon('id')}
                    </Box>
                  </TableCell>
                )}
                
                {visibleColumns.includes('subject') && (
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {t('tickets:table.subject', 'Тақырыбы')}
                  </TableCell>
                )}
                
                {visibleColumns.includes('status') && (
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSort('status')}
                    >
                      {t('tickets:table.status', 'Статус')}
                      {getSortIcon('status')}
                    </Box>
                  </TableCell>
                )}
                
                {visibleColumns.includes('priority') && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSort('priority')}
                    >
                      {t('tickets:table.priority', 'Басымдық')}
                      {getSortIcon('priority')}
                    </Box>
                  </TableCell>
                )}
                
                {visibleColumns.includes('requester') && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('tickets:table.requester', 'Өтініш беруші')}
                  </TableCell>
                )}
                
                {visibleColumns.includes('created_at') && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSort('created_at')}
                    >
                      {t('tickets:table.createdAt', 'Құрылған күні')}
                      {getSortIcon('created_at')}
                    </Box>
                  </TableCell>
                )}
                
                {visibleColumns.includes('assigned_to') && (isAdmin || isModerator) && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('tickets:table.assignedTo', 'Тағайындалған')}
                  </TableCell>
                )}
                
                {visibleColumns.includes('actions') && (
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {t('tickets:table.actions', 'Әрекеттер')}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} align="center">
                    <CircularProgress size={32} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} align="center">
                    <Typography variant="body1" sx={{ py: { xs: 2, sm: 3 }, color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {t('tickets:list.noTickets', 'Өтініштер табылмады')}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleCreateTicket}
                      sx={{ mt: 1, borderRadius: '8px' }}
                    >
                      {t('tickets:list.createFirst', 'Алғашқы өтініш жасау')}
                    </Button>
                  </TableCell>
                </TableRow>
              ) : tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  hover
                  onClick={() => handleTicketClick(ticket.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  {visibleColumns.includes('id') && (
                    <TableCell>
                      <Badge color="primary" variant="dot" invisible={ticket.status !== 'new'}>
                        {ticket.id}
                      </Badge>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('subject') && (
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        fontWeight={ticket.status === 'new' ? 600 : 400} 
                        noWrap 
                        sx={{ 
                          maxWidth: { xs: 80, sm: 200, md: 300 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {ticket.subject}
                      </Typography>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('status') && (
                    <TableCell>
                      {ticket.status ? (
                        <Chip 
                          label={getStatusText(ticket.status)} 
                          color={getStatusColor(ticket.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            '& .MuiChip-label': { 
                              px: { xs: 0.75, sm: 1.5 },
                              fontSize: { xs: '0.625rem', sm: '0.75rem' } 
                            },
                            height: { xs: 24, sm: 32 },
                            minWidth: { xs: 60, sm: 75 }
                          }}
                        />
                      ) : (
                        <Chip 
                          label={t('tickets:status.new', 'Жаңа')} 
                          color="error"
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            '& .MuiChip-label': { 
                              px: { xs: 0.75, sm: 1.5 },
                              fontSize: { xs: '0.625rem', sm: '0.75rem' } 
                            },
                            height: { xs: 24, sm: 32 },
                            minWidth: { xs: 60, sm: 75 }
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('priority') && (
                    <TableCell>
                      <Chip 
                        label={getPriorityText(ticket.priority)} 
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                        sx={{ 
                          fontWeight: 500,
                          '& .MuiChip-label': { 
                            px: { xs: 0.75, sm: 1.5 },
                            fontSize: { xs: '0.625rem', sm: '0.75rem' } 
                          },
                          height: { xs: 24, sm: 32 },
                          minWidth: { xs: 60, sm: 75 }
                        }}
                      />
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('requester') && (
                    <TableCell>
                      <Tooltip title={ticket.requester?.email || ''}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {ticket.requester?.name || t('tickets:table.unknown', 'Белгісіз')}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('created_at') && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {formatDate(ticket.created_at)}
                      </Typography>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('assigned_to') && (isAdmin || isModerator) && (
                    <TableCell>
                      {ticket.assigned_to ? (
                        <Typography variant="body2">
                          {ticket.assigned_to.name}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          {t('tickets:table.notAssigned', 'Тағайындалмаған')}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('actions') && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title={t('tickets:actions.view', 'Қарау')}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            sx={{ 
                              padding: { xs: '4px', sm: '8px' },
                              '& .MuiSvgIcon-root': { fontSize: { xs: '1rem', sm: '1.25rem' } }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTicketClick(ticket.id);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {(isAdmin || isModerator || (user?.id === ticket.submitted_by)) && (
                          <Tooltip title={t('tickets:actions.edit', 'Өңдеу')}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              sx={{ 
                                padding: { xs: '4px', sm: '8px' },
                                '& .MuiSvgIcon-root': { fontSize: { xs: '1rem', sm: '1.25rem' } }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tickets/${ticket.id}/edit`);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Пагинация */}
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
          component="div"
          count={totalTickets}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('tickets:pagination.rowsPerPage', 'Беттегі жолдар:')}
          labelDisplayedRows={({ from, to, count }) => 
            t('tickets:pagination.displayedRows', '{{from}}-{{to}} / {{count}}', { from, to, count })
          }
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              margin: { xs: 0 }
            },
            '.MuiTablePagination-select': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '.MuiTablePagination-actions': {
              marginLeft: { xs: 0, sm: 2 }
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default TicketsListPage;