// src/pages/LoginPage.js (Debug Version)
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
  
  // Check if already authenticated
  useEffect(() => {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        if (admin && admin.id) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error parsing admin data:', err);
        localStorage.removeItem('admin');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');

    // Form validation
    if (!email.trim()) {
      setError('Пожалуйста, введите email');
      return;
    }
    if (!password.trim()) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setLoading(true);

    // Set up API base URL - try different variations to troubleshoot
    const apiUrls = [
      'http://localhost:5000/api',     // Default
      'http://localhost:5000',         // Without /api
      `${window.location.origin}/api`, // Same origin
      '/api'                           // Relative path
    ];
    
    let successfulLogin = false;
    let lastError = null;
    
    // Try each URL until one works
    for (const baseUrl of apiUrls) {
      if (successfulLogin) break;
      
      try {
        setDebugInfo(prev => prev + `\nTrying: ${baseUrl}/admin/login`);
        
        // Use fetch for better debugging visibility
        const response = await fetch(`${baseUrl}/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        // Log response status
        setDebugInfo(prev => prev + `\nStatus: ${response.status}`);
        
        // If not successful, throw an error
        if (!response.ok) {
          const errorText = await response.text();
          setDebugInfo(prev => prev + `\nError response: ${errorText}`);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        // Parse the response
        const data = await response.json();
        setDebugInfo(prev => prev + `\nSuccess! Response: ${JSON.stringify(data)}`);
        
        // If successful, set the admin data in localStorage
        if (data && data.user) {
          localStorage.setItem('admin', JSON.stringify(data.user));
          successfulLogin = true;
          // Navigate to the dashboard
          navigate('/dashboard');
          break;
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        lastError = err;
        setDebugInfo(prev => prev + `\nError: ${err.message}`);
        console.error(`Login error with ${baseUrl}:`, err);
      }
    }
    
    if (!successfulLogin) {
      // Just for testing - hardcoded login
      if (email === 'nurda' && password === 'nurda') {
        setDebugInfo(prev => prev + '\nUsing hardcoded admin login');
        // Create a mock admin user
        const mockAdmin = {
          id: 1,
          email: 'nurda@test.com',
          first_name: 'Admin',
          last_name: 'User',
          employee: {
            id: 1,
            role: 'admin',
            status: 'active',
            name: 'Admin User'
          },
          company: {
            id: 1,
            name: 'Construction Company'
          }
        };
        
        localStorage.setItem('admin', JSON.stringify(mockAdmin));
        navigate('/dashboard');
        return;
      }
      
      // If all attempts failed, show the last error
      setError(lastError?.message || 'Ошибка входа. Пожалуйста, проверьте ваши учетные данные.');
    }
    
    setLoading(false);
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
                name="email"
                autoComplete="email"
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
            
            {debugInfo && (
              <Alert severity="info" sx={{ mt: 2, mb: 2, overflow: 'auto', maxHeight: '200px' }}>
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