import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import PublicHeader from './PublicHeader';
import Footer from './Footer';
import PageTransition from './PageTransition';

/**
 * Компонент-обертка для публичной части сайта
 * Содержит шапку, подвал и основной контент с помощью Outlet
 */
const PublicLayout = () => {
  const location = useLocation();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f5',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container maxWidth="lg">
          <PageTransition transitionKey={location.pathname + location.search}>
            <Outlet />
          </PageTransition>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout; 