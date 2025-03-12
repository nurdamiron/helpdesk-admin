// src/pages/LoginPage.js (пример)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CardContent
} from '@mui/material';
import { Lock, Mail, Eye, EyeOff, Construction } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Если админ уже залогинен — уходим на /dashboard
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        if (admin && admin.id) {
          navigate('/dashboard');
        }
      } catch {
        localStorage.removeItem('admin');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');

    if (!email.trim()) {
      setError('Введите email');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      // Проверяем статус
      if (!response.ok) {
        // Напр., 401 — неверный пароль
        const errText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errText}`);
      }

      // Парсим json
      const data = await response.json();
      // Ожидаем, что data.user есть
      if (data && data.user) {
        localStorage.setItem('admin', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        throw new Error('Неверный формат ответа сервера');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Неправильный логин или пароль');
      setDebugInfo(err.message);
    } finally {
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
                Панель Администратора
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Строительная Помощь HelpDesk
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
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
                label="Пароль"
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
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Войти'}
              </Button>
            </form>

            {/* Debug info (необязательно) */}
            {debugInfo && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                  {debugInfo}
                </Typography>
              </Alert>
            )}

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Строительная Помощь. Все права защищены.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
