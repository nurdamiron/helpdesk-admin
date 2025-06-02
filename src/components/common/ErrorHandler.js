// src/components/common/ErrorHandler.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography } from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { BaseApiService } from '../../api/baseApiService';

// Создаем контекст для обработки ошибок
const ErrorContext = createContext(null);

/**
 * Провайдер для обработки ошибок
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 */
export const ErrorProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['common']);
  const [error, setError] = useState(null);
  
  // Показывает простое уведомление об ошибке
  const showError = useCallback((message, options = {}) => {
    enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 5000,
      ...options
    });
  }, [enqueueSnackbar]);
  
  // Показывает модальное окно с деталями ошибки
  const showErrorModal = useCallback((title, message, details = null) => {
    setError({
      title,
      message,
      details
    });
  }, []);
  
  // Закрывает модальное окно с ошибкой
  const closeErrorModal = useCallback(() => {
    setError(null);
  }, []);
  
  // Обрабатывает ошибку API
  const handleApiError = useCallback((error, options = {}) => {
    const { showModal = false, title = t('errors.apiError', 'Ошибка API') } = options;
    
    // Формируем сообщение об ошибке
    let message = '';
    let details = null;
    
    if (error.response) {
      // Ошибка от сервера
      if (error.response.data && error.response.data.error) {
        // Текстовое сообщение от сервера
        message = typeof error.response.data.error === 'string' 
          ? error.response.data.error 
          : error.response.data.error.message || t('errors.unknownServerError', 'Неизвестная ошибка сервера');
          
        // Детали ошибки для модального окна
        details = error.response.data.error.details || null;
      } else {
        // Стандартное сообщение по коду ответа
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            message = t('errors.badRequest', 'Неверный запрос');
            break;
          case 401:
            message = t('errors.unauthorized', 'Необходима авторизация');
            break;
          case 403:
            message = t('errors.forbidden', 'Доступ запрещен');
            break;
          case 404:
            message = t('errors.notFound', 'Запрашиваемый ресурс не найден');
            break;
          case 500:
            message = t('errors.serverError', 'Ошибка сервера');
            break;
          default:
            message = t('errors.apiGeneric', 'Ошибка при выполнении запроса (код {{statusCode}})', { statusCode });
        }
      }
    } else if (error.request) {
      // Ошибка сети
      message = t('errors.network', 'Ошибка сети. Проверьте подключение к интернету');
    } else {
      // Другие ошибки
      message = error.message || t('errors.unknown', 'Произошла неизвестная ошибка');
    }
    
    // Показываем ошибку в зависимости от настроек
    if (showModal) {
      showErrorModal(title, message, details);
    } else {
      showError(message);
    }
    
    // Для возможности использования в catch блоках
    return error;
  }, [t, showError, showErrorModal]);
  
  // Регистрируем обработчик ошибок в базовом сервисе API
  useEffect(() => {
    BaseApiService.setErrorHandler({
      handleApiError
    });
    
    // Очистка при размонтировании
    return () => {
      BaseApiService.setErrorHandler(null);
    };
  }, [handleApiError]);
  
  // Контекст, доступный потребителям
  const contextValue = {
    showError,
    showErrorModal,
    handleApiError,
    closeErrorModal
  };
  
  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      
      {/* Модальное окно с ошибкой */}
      <Dialog
        open={!!error}
        onClose={closeErrorModal}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        {error && (
          <>
            <DialogTitle id="error-dialog-title">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertCircle color="error" size={24} />
                <Typography variant="h6" component="span">
                  {error.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="error-dialog-description">
                {error.message}
              </DialogContentText>
              
              {error.details && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {typeof error.details === 'string' 
                      ? error.details 
                      : JSON.stringify(error.details, null, 2)}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeErrorModal} color="primary" autoFocus>
                {t('common:close', 'Закрыть')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ErrorContext.Provider>
  );
};

// Хук для использования контекста ошибок
export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler должен использоваться внутри ErrorProvider');
  }
  return context;
};

export default ErrorProvider; 