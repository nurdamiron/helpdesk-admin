import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme
} from '@mui/material';

const UserFormDialog = ({ open, handleClose, handleSubmit, editUser, loading, error }) => {
  const { t } = useTranslation(['users', 'common']);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
        password: '', // Сбрасываем пароль при редактировании
        is_active: editUser.is_active === undefined ? true : editUser.is_active
      });
    } else {
      // Сбрасываем форму при создании нового пользователя
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'staff',
        is_active: true,
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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          mx: isSmallScreen ? 2 : 'auto',
          width: isSmallScreen ? 'calc(100% - 32px)' : 'auto'
        }
      }}
    >
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    name="is_active"
                    color="primary"
                  />
                }
                label={t('users:activeStatus', 'Активный пользователь')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, flexWrap: 'wrap', gap: 1, justifyContent: isSmallScreen ? 'center' : 'flex-end' }}>
          <Button onClick={handleClose} sx={{ mb: { xs: isSmallScreen ? 1 : 0 } }}>{t('common:cancel', 'Отмена')}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ minWidth: '120px' }}
          >
            {loading ? t('common:saving', 'Сохранение...') : t('common:save', 'Сохранить')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;