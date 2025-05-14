// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
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
  const { user, updateProfile } = useAuth();
  
  // State for tabs (mobile view)
  const [tabValue, setTabValue] = useState(0);
  
  // States for form values
  const [formValues, setFormValues] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    position: 'Менеджер службы поддержки',
    phone: '+7 (999) 123-45-67',
    language: 'kk',
    timezone: 'asia-almaty',
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

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormValues(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
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
  const handleProfileSave = async () => {
    try {
      // Prepare the user data to update
      const userData = {
        first_name: formValues.firstName,
        last_name: formValues.lastName
      };
      
      // Call the updateProfile function from AuthContext
      await updateProfile(userData);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Профиль сәтті жаңартылды',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Профильді жаңарту кезінде қате пайда болды',
        severity: 'error'
      });
    }
  };
  
  // Handle password save
  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        open: true,
        message: 'Құпия сөздер сәйкес келмейді',
        severity: 'error'
      });
      return;
    }
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setNotification({
        open: true,
        message: 'Барлық өрістерді толтырыңыз',
        severity: 'error'
      });
      return;
    }
    
    // Here you would make an API call to update the password
    // For now we'll just simulate success
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setNotification({
      open: true,
      message: 'Құпия сөз сәтті жаңартылды',
      severity: 'success'
    });
  };
  
  // Handle settings save
  const handleSettingsSave = () => {
    // Here you would make an API call to update settings
    // Simulate a language change by updating the document
    document.documentElement.lang = formValues.language;
    
    // Show success notification
    setNotification({
      open: true,
      message: 'Параметрлер сәтті сақталды',
      severity: 'success'
    });
    
    // If dark theme is toggled, we could implement theme switching here
    // This would require context setup for theme switching
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
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{
              fontWeight: 600,
              position: 'relative',
              paddingBottom: '8px',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '40px',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '2px'
              }
            }}
          >
            Параметрлер
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Жүйе параметрлері мен профильді басқару
          </Typography>
        </Box>
        
        <Paper 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="settings tabs"
            sx={{
              '& .MuiTab-root': {
                minHeight: '56px',
                fontWeight: 500
              }
            }}
          >
            <Tab icon={<User size={18} />} label="Профиль" />
            <Tab icon={<Bell size={18} />} label="Хабарламалар" />
            <Tab icon={<Settings size={18} />} label="Жүйе" />
          </Tabs>
          
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                      mb: 1
                    }}
                  >
                    {formValues.firstName?.charAt(0) || 'A'}
                  </Avatar>
                </Box>
                
                <TextField
                  fullWidth
                  label="Аты"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Тегі"
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
                  disabled
                />
                
                <TextField
                  fullWidth
                  label="Лауазымы"
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
                  sx={{ 
                    mt: 2,
                    borderRadius: '8px',
                    fontWeight: 500
                  }}
                >
                  Профильді сақтау
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Құпия сөзді өзгерту
                </Typography>
                
                <TextField
                  fullWidth
                  label="Ағымдағы құпия сөз"
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
                  label="Жаңа құпия сөз"
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
                  label="Құпия сөзді растаңыз"
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
                  color="primary"
                  fullWidth
                  startIcon={<Save />}
                  onClick={handlePasswordSave}
                  sx={{ 
                    mt: 2, 
                    borderRadius: '8px',
                    fontWeight: 500
                  }}
                >
                  Құпия сөзді сақтау
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Notifications Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Хабарламалар
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.notifyNewTickets}
                      onChange={handleSwitchChange}
                      name="notifyNewTickets"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight={500}>Жаңа өтінімдер</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Жаңа өтінімдер құрылған кезде хабарландыру алу
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.notifyResponses}
                      onChange={handleSwitchChange}
                      name="notifyResponses"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight={500}>Клиенттердің жауаптары</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Клиенттерден жауаптар келгенде хабарландыру алу
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.notifyStatusChanges}
                      onChange={handleSwitchChange}
                      name="notifyStatusChanges"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight={500}>Өтінімдердегі өзгерістер</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Өтінімдердің статусы өзгерген кезде хабарландыру алу
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.notifyWeeklyReport}
                      onChange={handleSwitchChange}
                      name="notifyWeeklyReport"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight={500}>Апталық есеп</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Өтінімдер туралы апталық есеп алу
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<Save />}
                onClick={handleSettingsSave}
                sx={{ 
                  mt: 3,
                  borderRadius: '8px',
                  fontWeight: 500
                }}
              >
                Параметрлерді сақтау
              </Button>
            </Box>
          )}
          
          {/* System Settings Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Жүйе параметрлері
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight={500}>
                  Жүйе тілі
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
                  <option value="kk">Қазақша</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </TextField>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight={500}>
                  Сағат белдеуі
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
                  <option value="asia-almaty">Алматы (GMT+6)</option>
                  <option value="asia-astana">Астана (GMT+6)</option>
                  <option value="europe-moscow">Мәскеу (GMT+3)</option>
                </TextField>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.darkTheme}
                      onChange={handleSwitchChange}
                      name="darkTheme"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight={500}>Қараңғы тақырып</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Интерфейс үшін қараңғы тақырыпты қолдану
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<Save />}
                onClick={handleSettingsSave}
                sx={{ 
                  mt: 3, 
                  borderRadius: '8px',
                  fontWeight: 500
                }}
              >
                Параметрлерді сақтау
              </Button>
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
        <Typography 
          variant="h5" 
          component="h1"
          sx={{
            fontWeight: 600,
            position: 'relative',
            paddingBottom: '8px',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: '3px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}
        >
          Параметрлер
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Жүйе параметрлері мен профильді басқару
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile & Security */}
        <Grid item xs={12} md={6}>
          {/* Profile Card */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <User size={20} style={{ marginRight: 10, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>Пайдаланушы профилі</Typography>
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
                {formValues.firstName?.charAt(0) || 'A'}
              </Avatar>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Аты"
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
                  label="Тегі"
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
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Лауазымы"
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
                    sx={{ 
                      borderRadius: '8px',
                      fontWeight: 500
                    }}
                  >
                    Профильді сақтау
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Security Card */}
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lock size={20} style={{ marginRight: 10, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>Қауіпсіздік</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={500}>
              Құпия сөзді өзгерту
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ағымдағы құпия сөз"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Жаңа құпия сөз"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Құпия сөзді растаңыз"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<Save />}
                    onClick={handlePasswordSave}
                    sx={{
                      borderRadius: '8px',
                      fontWeight: 500
                    }}
                  >
                    Құпия сөзді сақтау
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Right Column - Notifications & System Settings */}
        <Grid item xs={12} md={6}>
          {/* Notifications Card */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Bell size={20} style={{ marginRight: 10, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>Хабарламалар</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.notifyNewTickets}
                    onChange={handleSwitchChange}
                    name="notifyNewTickets"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight={500}>Жаңа өтінімдер</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Жаңа өтінімдер құрылған кезде хабарландыру алу
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.notifyResponses}
                    onChange={handleSwitchChange}
                    name="notifyResponses"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight={500}>Клиенттердің жауаптары</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Клиенттерден жауаптар келгенде хабарландыру алу
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.notifyStatusChanges}
                    onChange={handleSwitchChange}
                    name="notifyStatusChanges"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight={500}>Өтінімдердегі өзгерістер</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Өтінімдердің статусы өзгерген кезде хабарландыру алу
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.notifyWeeklyReport}
                    onChange={handleSwitchChange}
                    name="notifyWeeklyReport"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight={500}>Апталық есеп</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Өтінімдер туралы апталық есеп алу
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
              />
            </Box>
          </Paper>
          
          {/* System Settings Card */}
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings size={20} style={{ marginRight: 10, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>Жалпы параметрлер</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                Жүйе тілі
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
                <option value="kk">Қазақша</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </TextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                Сағат белдеуі
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
                <option value="asia-almaty">Алматы (GMT+6)</option>
                <option value="asia-astana">Астана (GMT+6)</option>
                <option value="europe-moscow">Мәскеу (GMT+3)</option>
              </TextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.darkTheme}
                    onChange={handleSwitchChange}
                    name="darkTheme"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight={500}>Қараңғы тақырып</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Интерфейс үшін қараңғы тақырыпты қолдану
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2, mx: 0, width: '100%', alignItems: 'flex-start' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSettingsSave}
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: 500
                }}
              >
                Параметрлерді сақтау
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;