// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

// Контекст авторизации администраторов
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';

// Компоненты страниц
import LoginPage from './pages/LoginPage';
import TicketsListPage from './pages/TicketsListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminLayout from './components/common/AdminLayout';

// Компонент для защищенных маршрутов админ-панели
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    // Можно добавить компонент загрузки здесь
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Основной компонент приложения
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<LoginPage />} />

            {/* Защищенные маршруты админ-панели */}
            <Route 
              path="/" 
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/tickets" replace />} />
              <Route path="tickets" element={<TicketsListPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              {/* Другие маршруты будут добавлены здесь */}
            </Route>

            {/* Перенаправление на страницу логина для неизвестных маршрутов */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </ThemeProvider>
  );
};

export default App;