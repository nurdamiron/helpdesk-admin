// src/pages/UsersManagementPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Engineering as EngineerIcon,
  Shield as ModeratorIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { authService } from '../api/authService';
import { useAuth } from '../contexts/AuthContext';
import UserFormDialog from '../components/users/UserFormDialog';
import UserStatusChip from '../components/users/UserStatusChip';

const UserRoleChip = ({ role }) => {
  const { t } = useTranslation(['users']);
  
  switch (role) {
    case 'admin':
      return (
        <Chip 
          icon={<AdminIcon fontSize="small" />} 
          label={t('roles.admin', 'Администратор')} 
          color="error" 
          size="small"
          sx={{ '& .MuiChip-label': { color: 'white' } }}
        />
      );
    case 'moderator':
      return (
        <Chip 
          icon={<ModeratorIcon fontSize="small" />} 
          label={t('roles.moderator', 'Модератор')} 
          color="warning" 
          size="small"
          sx={{ '& .MuiChip-label': { color: 'white' } }}
        />
      );
    case 'staff':
      return (
        <Chip 
          icon={<EngineerIcon fontSize="small" />} 
          label={t('roles.staff', 'Сотрудник')} 
          color="info" 
          size="small"
          sx={{ '& .MuiChip-label': { color: 'white' } }}
        />
      );
    default:
      return (
        <Chip 
          icon={<PersonIcon fontSize="small" />} 
          label={t('roles.user', 'Пользователь')} 
          color="default" 
          size="small"
          sx={{ '& .MuiChip-label': { color: 'rgba(0, 0, 0, 0.87)' } }}
        />
      );
  }
};

// Using imported UserFormDialog component instead of this one
/*const UserFormDialog = ({ open, handleClose, handleSubmit, editUser, loading, error }) => {
  const { t } = useTranslation(['users', 'common']);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'staff',
    is_active: true,
  });
  
  // Если передан пользователь для редактирования - заполняем форму его данными
  useEffect(() => {
    if (editUser) {
      setFormData({
        ...editUser,
        password: '' // Сбрасываем пароль при редактировании
      });
    } else {
      // Сбрасываем форму при создании нового пользователя
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'staff',
      });
    }
  }, [editUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {editUser ? t('users:editUser', 'Редактировать пользователя') : t('users:addUser', 'Добавить пользователя')}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                label={t('users:firstName', 'Имя')}
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label={t('users:lastName', 'Фамилия')}
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label={t('users:email', 'Email')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label={editUser ? t('users:newPassword', 'Новый пароль (оставьте пустым, чтобы не менять)') : t('users:password', 'Пароль')}
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!editUser}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">{t('users:role', 'Роль')}</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label={t('users:role', 'Роль')}
                >
                  <MenuItem value="admin">{t('users:roles.admin', 'Администратор')}</MenuItem>
                  <MenuItem value="moderator">{t('users:roles.moderator', 'Модератор')}</MenuItem>
                  <MenuItem value="staff">{t('users:roles.staff', 'Сотрудник')}</MenuItem>
                  <MenuItem value="user">{t('users:roles.user', 'Пользователь')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common:cancel', 'Отмена')}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? t('common:saving', 'Сохранение...') : t('common:save', 'Сохранить')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};*/

const DeleteConfirmDialog = ({ open, handleClose, handleConfirm, loading, userName }) => {
  const { t } = useTranslation(['users', 'common']);
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('users:deleteUser', 'Удалить пользователя')}</DialogTitle>
      <DialogContent>
        <Typography>
          {t('users:deleteConfirmation', 'Вы уверены, что хотите удалить пользователя {{name}}?', { name: userName })}
        </Typography>
        <Typography color="error" sx={{ mt: 2 }}>
          {t('users:deleteWarning', 'Это действие нельзя отменить.')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:cancel', 'Отмена')}</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? t('common:deleting', 'Удаление...') : t('common:delete', 'Удалить')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UsersManagementPage = () => {
  const { t } = useTranslation(['users', 'common']);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Состояние для диалогов
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Загрузка пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Фильтрация пользователей при изменении поискового запроса
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.first_name?.toLowerCase().includes(lowercaseSearch) ||
      user.last_name?.toLowerCase().includes(lowercaseSearch) ||
      user.email?.toLowerCase().includes(lowercaseSearch) ||
      (user.role && user.role.toLowerCase().includes(lowercaseSearch))
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);
  
  // Получение списка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setError(t('users:errors.loadFailed', 'Не удалось загрузить пользователей. Попробуйте позже.'));
    } finally {
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
  
  // Открытие диалога для создания нового пользователя
  const handleOpenCreateDialog = () => {
    setSelectedUser(null);
    setFormError(null);
    setFormDialogOpen(true);
  };
  
  // Открытие диалога для редактирования пользователя
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setFormError(null);
    setFormDialogOpen(true);
  };
  
  // Открытие диалога для подтверждения удаления
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  // Закрытие диалога формы
  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
  };
  
  // Закрытие диалога удаления
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // Обработчик отправки формы (создание/редактирование пользователя)
  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (selectedUser) {
        // Редактирование существующего пользователя
        const updatedUser = { ...data };
        
        // Если пароль пустой, удаляем его из запроса
        if (!updatedUser.password) {
          delete updatedUser.password;
        }
        
        await authService.updateUser(selectedUser.id, updatedUser);
        
        // Обновляем список пользователей
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user
        ));
      } else {
        // Создание нового пользователя
        const newUser = await authService.register(data);
        setUsers(prev => [...prev, newUser]);
      }
      
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Ошибка при сохранении пользователя:', err);
      setFormError(err.response?.data?.error || t('users:errors.saveFailed', 'Не удалось сохранить пользователя. Попробуйте позже.'));
    } finally {
      setFormLoading(false);
    }
  };
  
  // Обработчик переключения статуса пользователя (активный/неактивный)
  const handleToggleUserStatus = async (user) => {
    if (!user) return;
    
    setFormLoading(true);
    
    try {
      const updatedStatus = !user.is_active;
      await authService.updateUser(user.id, { is_active: updatedStatus });
      
      // Обновляем статус пользователя в списке
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_active: updatedStatus } : u
      ));
    } catch (err) {
      console.error('Ошибка при изменении статуса пользователя:', err);
      setError(t('users:errors.statusUpdateFailed', 'Не удалось изменить статус пользователя. Попробуйте позже.'));
    } finally {
      setFormLoading(false);
    }
  };
  
  // Обработчик удаления пользователя
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setDeleteLoading(true);
    
    try {
      await authService.deleteUser(selectedUser.id);
      
      // Удаляем пользователя из списка
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Ошибка при удалении пользователя:', err);
      // Здесь можно добавить отображение ошибки в диалоге удаления
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Проверка, может ли текущий пользователь редактировать указанного пользователя
  const canEditUser = (user) => {
    if (!currentUser) return false;
    
    // Админ может редактировать всех
    if (currentUser.role === 'admin') return true;
    
    // Модератор может редактировать только сотрудников и себя
    if (currentUser.role === 'moderator') {
      return user.role === 'staff' || user.id === currentUser.id;
    }
    
    // Остальные могут редактировать только себя
    return user.id === currentUser.id;
  };
  
  // Проверка, может ли текущий пользователь удалить указанного пользователя
  const canDeleteUser = (user) => {
    if (!currentUser) return false;
    
    // Никто не может удалить самого себя
    if (user.id === currentUser.id) return false;
    
    // Админ может удалить любого, кроме себя
    if (currentUser.role === 'admin') return true;
    
    // Модератор может удалить только сотрудников
    if (currentUser.role === 'moderator') {
      return user.role === 'staff';
    }
    
    // Остальные не могут удалять никого
    return false;
  };
  
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1600, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2, width: '100%' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            {t('users:managementTitle', 'Управление пользователями')}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ 
              py: 1.5,
              px: 3,
              fontWeight: 'bold',
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[5],
              },
              borderRadius: '8px',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {t('users:addUser', 'Добавить пользователя')}
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3, width: '100%' }}>
          <TextField
            fullWidth
            placeholder={t('users:search', 'Поиск пользователей...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : isSmallScreen ? (
          // Мобильное представление в виде карточек
          <>
            {filteredUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography color="textSecondary">
                  {searchTerm 
                    ? t('users:noSearchResults', 'Пользователи не найдены. Попробуйте изменить поисковый запрос.') 
                    : t('users:noUsers', 'Пользователи не найдены.')}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ width: '100%' }}>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <Grid item xs={12} key={user.id}>
                      <Card variant="outlined" sx={{ borderRadius: 2, width: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6" noWrap sx={{ maxWidth: { xs: '150px', sm: '200px' } }}>{user.first_name} {user.last_name}</Typography>
                            <UserRoleChip role={user.role} />
                          </Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }} noWrap>{user.email}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <UserStatusChip isActive={user.is_active} />
                          </Box>
                        </CardContent>
                        <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {canEditUser(user) && (
                            <Button 
                              size="small" 
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenEditDialog(user)}
                              sx={{ mb: { xs: 1, sm: 0 } }}
                            >
                              {t('common:edit', 'Редактировать')}
                            </Button>
                          )}
                          {canEditUser(user) && (
                            <Button 
                              size="small"
                              color={user.is_active ? "default" : "primary"}
                              startIcon={user.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                              onClick={() => handleToggleUserStatus(user)}
                              sx={{ mb: { xs: 1, sm: 0 } }}
                            >
                              {user.is_active ? t('users:deactivate', 'Деактивировать') : t('users:activate', 'Активировать')}
                            </Button>
                          )}
                          {canDeleteUser(user) && (
                            <Button 
                              size="small" 
                              color="error" 
                              startIcon={<DeleteIcon />}
                              onClick={() => handleOpenDeleteDialog(user)}
                              sx={{ mb: { xs: 1, sm: 0 } }}
                            >
                              {t('common:delete', 'Удалить')}
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
          </>
        ) : (
          // Десктопное представление в виде таблицы
          <>
            <TableContainer sx={{ overflow: 'auto', maxWidth: '100%' }}>
              <Table sx={{ minWidth: { xs: 650, sm: 800 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('users:name', 'Имя')}</TableCell>
                    <TableCell>{t('users:email', 'Email')}</TableCell>
                    <TableCell>{t('users:role', 'Роль')}</TableCell>
                    <TableCell>{t('users:status', 'Статус')}</TableCell>
                    <TableCell align="right">{t('users:actions', 'Действия')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="textSecondary" sx={{ py: 3 }}>
                          {searchTerm 
                            ? t('users:noSearchResults', 'Пользователи не найдены. Попробуйте изменить поисковый запрос.') 
                            : t('users:noUsers', 'Пользователи не найдены.')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.first_name} {user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <UserRoleChip role={user.role} />
                          </TableCell>
                          <TableCell>
                            <UserStatusChip isActive={user.is_active} />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              {canEditUser(user) && (
                                <Tooltip title={t('common:edit', 'Редактировать')}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleOpenEditDialog(user)}
                                  >
                                    <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canEditUser(user) && (
                                <Tooltip title={user.is_active ? t('users:deactivate', 'Деактивировать') : t('users:activate', 'Активировать')}>
                                  <IconButton 
                                    size="small"
                                    color={user.is_active ? "default" : "primary"}
                                    onClick={() => handleToggleUserStatus(user)}
                                  >
                                    {user.is_active ? <ToggleOnIcon fontSize={isSmallScreen ? "small" : "medium"} /> : <ToggleOffIcon fontSize={isSmallScreen ? "small" : "medium"} />}
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canDeleteUser(user) && (
                                <Tooltip title={t('common:delete', 'Удалить')}>
                                  <IconButton 
                                    size="small"
                                    color="error" 
                                    onClick={() => handleOpenDeleteDialog(user)}
                                  >
                                    <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isSmallScreen ? '' : t('common:rowsPerPage', 'Строк на странице:')}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t('common:of', 'из')} ${count}`
          }
          sx={{
            '.MuiTablePagination-selectLabel': {
              display: { xs: 'none', sm: 'block' }
            },
            '.MuiTablePagination-select': {
              marginRight: { xs: 1, sm: 2 }
            }
          }}
        />
      </Paper>
      
      {/* Диалог для создания/редактирования пользователя */}
      <UserFormDialog
        open={formDialogOpen}
        handleClose={handleCloseFormDialog}
        handleSubmit={handleFormSubmit}
        editUser={selectedUser}
        loading={formLoading}
        error={formError}
      />
      
      {/* Диалог для подтверждения удаления */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleDeleteUser}
        loading={deleteLoading}
        userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}
      />
    </Box>
  );
};

export default UsersManagementPage;