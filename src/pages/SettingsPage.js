// src/pages/SettingsPage.js
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Switch, 
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Settings, 
  Bell, 
  Mail, 
  Lock, 
  User, 
  Save,
  Smartphone,
  Globe,
  Moon,
  Calendar,
  FileText,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  // State for tabs (mobile view)
  const [tabValue, setTabValue] = useState(0);
  
  // States for form values
  const [formValues, setFormValues] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    position: 'Менеджер службы поддержки',
    phone: '+7 (999) 123-45-67',
    language: 'ru',
    timezone: 'europe-moscow',
    notifyNewTickets: true,
    notifyResponses: true,
    notifyStatusChanges: true,
    notifyWeeklyReport: false,
    darkTheme: false
  });
  
  // State for password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // Handle switch changes
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: checked
    });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle profile save
  const handleProfileSave = () => {
    // Here you would typically make an API call to update the profile
    setNotification({
      open: true,
      message: 'Профиль успешно обновлен',
      severity: 'success'
    });
  };
  
  // Handle password save
  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        open: true,
        message: 'Пароли не совпадают',
        severity: 'error'
      });
      return;
    }
    
    // Here you would typically make an API call to update the password
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setNotification({
      open: true,
      message: 'Пароль успешно обновлен',
      severity: 'success'
    });
  };
  
  // Handle settings save
  const handleSettingsSave = () => {
    // Here you would typically make an API call to update settings
    setNotification({
      open: true,
      message: 'Настройки успешно сохранены',
      severity: 'success'
    });
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Mobile view with tabs
  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1">
            Настройки
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление параметрами системы и профиля
          </Typography>
        </Box>
        
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="settings tabs"
          >
            <Tab icon={<User size={18} />} label="Профиль" />
            <Tab icon={<Bell size={18} />} label="Уведомления" />
            <Tab icon={<Settings size={18} />} label="Система" />
          </Tabs>
          
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                      mb: 1
                    }}
                  >
                    {formValues.firstName?.charAt(0) || 'U'}
                  </Avatar>
                </Box>
                
                <TextField
                  fullWidth
                  label="Имя"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Должность"
                  name="position"
                  value={formValues.position}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Телефон"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleProfileSave}
                  sx={{ mt: 2 }}
                >
                  Сохранить профиль
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="h6" gutterBottom>
                  Смена пароля
                </Typography>
                
                <TextField
                  fullWidth
                  label="Текущий пароль"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Новый пароль"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Подтвердите пароль"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <Button 
                  variant="contained" 
                  fullWidth
                  color="secondary"
                  startIcon={<Lock />}
                  onClick={handlePasswordSave}
                  sx={{ mt: 2 }}
                >
                  Сменить пароль
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Notifications Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Настройки уведомлений
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formValues.notifyNewTickets} 
                      onChange={handleSwitchChange}
                      name="notifyNewTickets"
                    />
                  }
                  label="Новые заявки"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mb: 2 }}>
                  Получать уведомления при создании новых заявок
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formValues.notifyResponses} 
                      onChange={handleSwitchChange}
                      name="notifyResponses"
                    />
                  }
                  label="Ответы клиентов"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mb: 2 }}>
                  Получать уведомления при ответах клиентов
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formValues.notifyStatusChanges} 
                      onChange={handleSwitchChange}
                      name="notifyStatusChanges"
                    />
                  }
                  label="Изменения в заявках"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mb: 2 }}>
                  Получать уведомления при изменении статуса заявок
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formValues.notifyWeeklyReport} 
                      onChange={handleSwitchChange}
                      name="notifyWeeklyReport"
                    />
                  }
                  label="Еженедельный отчет"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mb: 3 }}>
                  Получать еженедельный отчет по заявкам
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSettingsSave}
                  sx={{ mt: 2 }}
                >
                  Сохранить настройки
                </Button>
              </Box>
            </Box>
          )}
          
          {/* System Settings Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Системные настройки
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Язык системы
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="language"
                  value={formValues.language}
                  onChange={handleInputChange}
                  size="small"
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mb: 3 }}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </TextField>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Часовой пояс
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="timezone"
                  value={formValues.timezone}
                  onChange={handleInputChange}
                  size="small"
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mb: 3 }}
                >
                  <option value="europe-moscow">Москва (GMT+3)</option>
                  <option value="europe-kaliningrad">Калининград (GMT+2)</option>
                  <option value="asia-yekaterinburg">Екатеринбург (GMT+5)</option>
                </TextField>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formValues.darkTheme} 
                      onChange={handleSwitchChange}
                      name="darkTheme"
                    />
                  }
                  label="Темная тема"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mb: 3 }}>
                  Использовать темную тему интерфейса
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSettingsSave}
                  sx={{ mt: 2 }}
                >
                  Сохранить настройки
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
        
        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
  
  // Desktop view with columns
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1">
          Настройки
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Управление параметрами системы и профиля
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile & Security */}
        <Grid item xs={12} md={6}>
          {/* Profile Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <User size={20} style={{ marginRight: 10 }} />
              <Typography variant="h6">Профиль пользователя</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '2.5rem'
                }}
              >
                {formValues.firstName?.charAt(0) || 'U'}
              </Avatar>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Должность"
                  name="position"
                  value={formValues.position}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Телефон"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Save />}
                    onClick={handleProfileSave}
                  >
                    Сохранить профиль
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Security Card */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lock size={20} style={{ marginRight: 10 }} />
              <Typography variant="h6">Безопасность</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Текущий пароль"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Новый пароль"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              margin="normal"
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<Lock />}
                onClick={handlePasswordSave}
              >
                Обновить пароль
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Notifications & System Settings */}
        <Grid item xs={12} md={6}>
          {/* Notifications Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Bell size={20} style={{ marginRight: 10 }} />
              <Typography variant="h6">Уведомления</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formValues.notifyNewTickets} 
                  onChange={handleSwitchChange}
                  name="notifyNewTickets"
                />
              }
              label="Новые заявки"
            />
            <Box sx={{ ml: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Получать уведомления при создании новых заявок
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formValues.notifyResponses} 
                  onChange={handleSwitchChange}
                  name="notifyResponses"
                />
              }
              label="Ответы клиентов"
            />
            <Box sx={{ ml: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Получать уведомления при ответах клиентов
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formValues.notifyStatusChanges} 
                  onChange={handleSwitchChange}
                  name="notifyStatusChanges"
                />
              }
              label="Изменения в заявках"
            />
            <Box sx={{ ml: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Получать уведомления при изменении статуса заявок
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formValues.notifyWeeklyReport} 
                  onChange={handleSwitchChange}
                  name="notifyWeeklyReport"
                />
              }
              label="Еженедельный отчет"
            />
            <Box sx={{ ml: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Получать еженедельный отчет по заявкам
              </Typography>
            </Box>
          </Paper>
          
          {/* System Settings Card */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings size={20} style={{ marginRight: 10 }} />
              <Typography variant="h6">Общие настройки</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Язык системы
              </Typography>
              <TextField
                select
                fullWidth
                name="language"
                value={formValues.language}
                onChange={handleInputChange}
                size="small"
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </TextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Часовой пояс
              </Typography>
              <TextField
                select
                fullWidth
                name="timezone"
                value={formValues.timezone}
                onChange={handleInputChange}
                size="small"
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="europe-moscow">Москва (GMT+3)</option>
                <option value="europe-kaliningrad">Калининград (GMT+2)</option>
                <option value="asia-yekaterinburg">Екатеринбург (GMT+5)</option>
              </TextField>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formValues.darkTheme} 
                  onChange={handleSwitchChange}
                  name="darkTheme"
                />
              }
              label="Темная тема"
            />
            <Box sx={{ ml: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Использовать темную тему интерфейса
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSettingsSave}
              >
                Сохранить настройки
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;