import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboardPage from './admin/AdminDashboardPage';
import ModeratorDashboardPage from './moderator/ModeratorDashboardPage';
import UserDashboardPage from './user/UserDashboardPage';
import StaffDashboardPage from './StaffDashboardPage';
import { Box, CircularProgress } from '@mui/material';

/**
 * Маршрутизирующий компонент дашборда
 * Перенаправляет на соответствующую панель управления в зависимости от роли пользователя
 */
const DashboardPage = () => {
  const { user, isAdmin, isModerator, isUser, loading } = useAuth();

  // Пока идет проверка авторизации, показываем загрузку
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // В зависимости от роли отображаем соответствующий дашборд
  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  // Для роли staff используем специальный дашборд
  if (user?.role === 'staff') {
    return <StaffDashboardPage />;
  }

  // Для модераторов, менеджеров и других ролей поддержки
  if (isModerator && user?.role !== 'staff') {
    return <ModeratorDashboardPage />;
  }

  if (isUser) {
    return <UserDashboardPage />;
  }

  // Если нет определенной роли, перенаправляем на страницу входа
  return <Navigate to="/login" replace />;
};

export default DashboardPage;