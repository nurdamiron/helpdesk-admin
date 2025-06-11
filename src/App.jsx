// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ErrorProvider from './components/common/ErrorHandler';

// Import theme
import theme from './theme';

// Import layouts
import AppLayout from './components/common/AppLayout';
import PublicLayout from './components/common/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import public pages (перенесенные из клиентского проекта)
import LandingPage from './pages/public/LandingPage';
import HomePage from './pages/public/HomePage';
import TicketDetailPublicPage from './pages/public/TicketDetailPublicPage';
import SubmissionSuccessPage from './pages/public/SubmissionSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// Import admin pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsListPage from './pages/TicketsListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import UsersManagementPage from './pages/UsersManagementPage';

// Import user pages
import CreateTicketPage from './pages/user/CreateTicketPage';

// Компонент для автоматического перенаправления с главной страницы
const DefaultRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Если пользователь авторизован, перенаправляем в админку
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Если не авторизован, перенаправляем на страницу входа
  return <Navigate to="/login" replace />;
};

// Компонент, который перенаправляет в зависимости от роли
const RoleBasedRedirect = () => {
  const { isAdmin, isModerator, isUser, user } = useAuth();
  
  // На основе роли перенаправляем на соответствующий дашборд
  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Модераторы, саппорты и другие сотрудники
  if (isModerator) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Обычные пользователи видят свой дашборд
  if (isUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Если не получилось определить роль, отправляем на страницу входа
  return <Navigate to="/login" replace />;
};

function App() {
  const { i18n, t } = useTranslation(['common']);
  
  // Устанавливаем атрибуты документа в зависимости от выбранного языка
  useEffect(() => {
    // Устанавливаем язык документа
    document.documentElement.lang = i18n.language?.substring(0, 2) || 'ru';
    
    // Устанавливаем заголовок документа
    document.title = t('app.title', 'Система поддержки');
    
    // Устанавливаем метатеги для документа
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('app.description', 'Система обработки заявок и обращений'));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      meta.setAttribute('content', t('app.description', 'Система обработки заявок и обращений'));
      document.head.appendChild(meta);
    }
    
    // Log the current API URL for debugging
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.REACT_APP_API_URL);
  }, [i18n.language, t]);
  
  // Environment indicator for development
  const EnvIndicator = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          bgcolor: 'warning.main', 
          color: 'warning.contrastText',
          zIndex: 9999,
          px: 1,
          py: 0.5,
          fontSize: '10px',
          opacity: 0.8
        }}
      >
        API: {process.env.REACT_APP_API_URL || 'Default'}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EnvIndicator />
      <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
        <AuthProvider>
          <ErrorProvider>
            <Routes>
              {/* Публичные маршруты */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
              </Route>
              
              {/* Главная страница - показываем LandingPage */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
              </Route>
              
              {/* Маршрут для перенаправления авторизованных пользователей в админку */}
              <Route path="/admin" element={<RoleBasedRedirect />} />
              
              {/* Защищенные маршруты с общим макетом */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                {/* Дашборд в зависимости от роли (маршрутизация внутри компонента) */}
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Маршруты для заявок - доступны всем авторизованным пользователям */}
                <Route path="/tickets" element={
                  <ProtectedRoute>
                    <TicketsListPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/tickets/create" element={
                  <ProtectedRoute requiredRole="user" redirectToHome={true}>
                    <CreateTicketPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/tickets/:id" element={
                  <ProtectedRoute>
                    <TicketDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/tickets/:id/edit" element={
                  <ProtectedRoute>
                    <TicketDetailPage editMode={true} />
                  </ProtectedRoute>
                } />
                
                {/* Маршруты только для админа */}
                <Route path="/users" element={
                  <ProtectedRoute requiredPermission="manage_users" redirectToHome={true}>
                    <UsersManagementPage />
                  </ProtectedRoute>
                } />
                
                {/* Маршруты для админа/модератора */}
                <Route path="/settings" element={
                  <ProtectedRoute requiredRole="moderator" redirectToHome={true}>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* Маршруты для доступа к отчетам */}
                <Route path="/reports" element={
                  <ProtectedRoute requiredPermission="access_reports" redirectToHome={true}>
                    <NotFoundPage />
                  </ProtectedRoute>
                } />
                
                {/* Общие маршруты */}
                <Route path="/help" element={<HelpPage />} />
              </Route>
              
              {/* Публичные маршруты */}
              <Route path="/public" element={<PublicLayout />}>
                <Route path="tickets/:id" element={<TicketDetailPublicPage />} />
                <Route path="success/:id" element={<SubmissionSuccessPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;