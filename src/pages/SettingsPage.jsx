// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField,
  Button,
  Divider,
  Avatar,
  Snackbar,
  Alert,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  User, 
  Save,
  Lock 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../api/userService';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation('settings');
  
  // Loading states
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // States for form values
  const [formValues, setFormValues] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setFormValues(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);
  
  // State for password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
    
    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    
    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formValues.firstName.trim()) {
      newErrors.firstName = t('profile.firstNameRequired');
    }
    
    if (!formValues.lastName.trim()) {
      newErrors.lastName = t('profile.lastNameRequired');
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = t('profile.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = t('profile.emailInvalid');
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = t('security.currentPasswordRequired');
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = t('security.newPasswordRequired');
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = t('security.newPasswordMinLength');
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('security.confirmPasswordRequired');
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('security.passwordMismatch');
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle profile save
  const handleProfileSave = async () => {
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setIsProfileLoading(true);
      
      // Prepare user data
      const userData = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone
      };
      
      // Отправляем запрос на обновление профиля через API сервис
      await userService.updateProfile(userData);
      
      // Обновляем данные в контексте
      updateProfile(userData);
      
      setNotification({
        open: true,
        message: t('profile.updateSuccess'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: error.response?.data?.error || t('profile.updateError'),
        severity: 'error'
      });
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  // Handle password save
  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setIsPasswordLoading(true);
      
      // Используем сервис для обновления пароля
      await userService.updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setNotification({
        open: true,
        message: t('security.updateSuccess'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      
      if (error.response?.status === 401) {
        setErrors(prev => ({
          ...prev,
          currentPassword: t('security.currentPasswordError')
        }));
      }
      
      setNotification({
        open: true,
        message: error.response?.data?.error || t('security.updateError'),
        severity: 'error'
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      {/* User Profile Card */}
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
          <Typography variant="h6" fontWeight={600}>{t('profile.title')}</Typography>
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
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('profile.firstName')}
          </Typography>
          <TextField
            fullWidth
            name="firstName"
            value={formValues.firstName}
            onChange={handleInputChange}
            variant="outlined"
            error={!!errors.firstName}
            helperText={errors.firstName}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('profile.lastName')}
          </Typography>
          <TextField
            fullWidth
            name="lastName"
            value={formValues.lastName}
            onChange={handleInputChange}
            variant="outlined"
            error={!!errors.lastName}
            helperText={errors.lastName}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('profile.email')}
          </Typography>
          <TextField
            fullWidth
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('profile.phone')}
          </Typography>
          <TextField
            fullWidth
            name="phone"
            value={formValues.phone}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={isProfileLoading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={handleProfileSave}
              disabled={isProfileLoading}
              sx={{ 
                borderRadius: '8px',
                fontWeight: 500
              }}
            >
              {isProfileLoading ? t('profile.updating') : t('profile.saveButton')}
            </Button>
          </Box>
        </Box>
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
          <Typography variant="h6" fontWeight={600}>{t('security.title')}</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={500}>
          {t('security.changePassword')}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('security.currentPassword')}
          </Typography>
          <TextField
            fullWidth
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            variant="outlined"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('security.newPassword')}
          </Typography>
          <TextField
            fullWidth
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            variant="outlined"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('security.confirmPassword')}
          </Typography>
          <TextField
            fullWidth
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={isPasswordLoading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={handlePasswordSave}
              disabled={isPasswordLoading}
              sx={{
                borderRadius: '8px',
                fontWeight: 500
              }}
            >
              {isPasswordLoading ? t('security.updating') : t('security.saveButton')}
            </Button>
          </Box>
        </Box>
      </Paper>
      
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
    </Box>
  );
};

export default SettingsPage;