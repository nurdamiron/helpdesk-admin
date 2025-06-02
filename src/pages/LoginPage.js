// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { Lock, Mail, Eye, EyeOff, Construction } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Используем контекст авторизации
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth(); // Используем hook useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation(['common', 'auth']);

  // Получаем URL для перенаправления из sessionStorage, query параметра или используем дефолтный
  const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
  const from = savedRedirect || location.state?.from || '/dashboard';
  
  // Получаем сообщение из state или из query params
  const sessionExpired = new URLSearchParams(location.search).get('session_expired');
  const message = location.state?.message || (sessionExpired ? t('auth:session.expired', 'Ваша сессия истекла. Пожалуйста, войдите снова.') : '');

  useEffect(() => {
    // Если пользователь уже залогинен — уходим на страницу, с которой пришли
    if (isAuthenticated) {
      // Очищаем сохраненное перенаправление после использования
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]); // Добавлен from в зависимости

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('auth:errors.emailRequired', 'Введите email'));
      return;
    }
    if (!password.trim()) {
      setError(t('auth:errors.passwordRequired', 'Введите пароль'));
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password); // Используем метод login из контекста
      // Не используем navigate здесь - это будет сделано в useEffect
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response && err.response.data && err.response.data.error) {
        // Более подробные ошибки от сервера
        const serverError = err.response.data.error;
        
        if (typeof serverError === 'string') {
          setError(serverError);
        } else if (serverError.message) {
          setError(serverError.message);
        } else {
          setError(t('auth:errors.loginFailed', 'Ошибка авторизации. Пожалуйста, попробуйте снова.'));
        }
      } else if (err.message) {
        // Ошибки от клиента или сети
        setError(err.message);
      } else {
        setError(t('auth:errors.loginFailed', 'Ошибка авторизации. Пожалуйста, попробуйте снова.'));
      }
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 4
              }}
            >
              <Box
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Construction size={40} color="#1e88e5" />
              </Box>
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 500 }}>
                {t('auth:login', 'Вход в систему')}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {t('app.description', 'Строительная Помощь HelpDesk')}
              </Typography>
            </Box>

            {message && (
              <Alert severity="info" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t('auth:email', 'Email')}
                variant="outlined"
                margin="normal"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} color="#999" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label={t('auth:password', 'Пароль')}
                variant="outlined"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color="#999" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || authLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading || authLoading ? <CircularProgress size={24} /> : t('auth:loginButton', 'Войти')}
              </Button>
            </form>

            <Box mt={3} textAlign="center">
              <Link href="/" variant="body2" sx={{ textDecoration: 'none', display: 'block', mb: 2 }}>
                {t('auth:backToSite', 'Вернуться на главную страницу')}
              </Link>
              <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} {t('app.title', 'Строительная Помощь')}. {t('common:copyright', 'Все права защищены.')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;