// src/pages/NotFoundPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper 
} from '@mui/material';
import { Construction, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    // Auto redirect to dashboard after countdown
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, countdown * 1000);
    
    // Update countdown
    const interval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Construction size={80} color="#ff8f00" />
        </Box>
        
        <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Страница не найдена
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Запрашиваемая страница не существует или была перемещена.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/dashboard" 
          startIcon={<ArrowLeft />}
          size="large"
          sx={{ mb: 3 }}
        >
          Вернуться на главную
        </Button>
        
        <Typography variant="body2" color="textSecondary">
          Автоматический переход через {countdown} секунд...
        </Typography>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;