import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Компонент для защиты маршрутов на основе прав доступа
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @param {string} [props.requiredRole] - Требуемая роль для доступа (user, moderator, admin)
 * @param {string} [props.requiredPermission] - Конкретное право доступа
 * @param {boolean} [props.redirectToHome] - Перенаправлять ли на домашнюю страницу вместо страницы отказа в доступе
 * @returns {React.ReactNode} Защищенный компонент или редирект
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermission = null,
  redirectToHome = false
}) => {
  const { isAuthenticated, hasPermission, hasSpecificPermission, loading, user } = useAuth();
  const location = useLocation();

  // Пока идет проверка авторизации, показываем индикатор загрузки
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Проверяем права доступа на основе роли
  if (requiredRole && !hasPermission(requiredRole)) {
    // Перенаправляем на соответствующую страницу
    return redirectToHome 
      ? <Navigate to={getHomepageForRole(user?.role)} replace />
      : <Navigate to="/access-denied" replace />;
  }

  // Проверяем конкретное право доступа
  if (requiredPermission && !hasSpecificPermission(requiredPermission)) {
    // Перенаправляем на соответствующую страницу
    return redirectToHome 
      ? <Navigate to={getHomepageForRole(user?.role)} replace />
      : <Navigate to="/access-denied" replace />;
  }

  // Если все проверки пройдены, возвращаем дочерние компоненты
  return children;
};

/**
 * Возвращает домашнюю страницу для указанной роли
 * @param {string} role - Роль пользователя
 * @returns {string} URL домашней страницы
 */
function getHomepageForRole(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'moderator':
    case 'support':
    case 'manager':
    case 'staff':
      return '/staff/dashboard';
    case 'user':
      return '/dashboard';
    default:
      return '/';
  }
}

export default ProtectedRoute;