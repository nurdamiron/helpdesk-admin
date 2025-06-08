// src/components/tickets/TicketFiles.js
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Alert,
  Tooltip,
  Grid,
  Card,
  useTheme,
  alpha
} from '@mui/material';
import {
  File as FileIcon,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

import api from '../../api/index';
import { formatDate } from '../../utils/dateUtils';

// Функция для определения типа файла
const getFileIcon = (fileName) => {
  if (!fileName) return <FileIcon size={20} />;
  
  const extension = fileName.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf', 'odt'];
  
  if (imageExtensions.includes(extension)) {
    return <ImageIcon size={20} color="#4caf50" />;
  } else if (documentExtensions.includes(extension)) {
    return <FileTextIcon size={20} color="#2196f3" />;
  }
  
  return <FileIcon size={20} color="#ff9800" />;
};

// Функция для форматирования размера файла
const formatFileSize = (bytes, t) => {
  if (!bytes || isNaN(bytes)) return t('tickets:files.sizeUnknown', 'Неизвестно');
  
  if (bytes < 1024) return bytes + ' ' + t('tickets:files.sizeBytes', 'Б');
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' ' + t('tickets:files.sizeKB', 'КБ');
  return (bytes / (1024 * 1024)).toFixed(2) + ' ' + t('tickets:files.sizeMB', 'МБ');
};

const TicketFiles = ({ ticketId, files = [] }) => {
  const { t } = useTranslation(['tickets', 'common']);
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [attachments, setAttachments] = useState(files);
  const [preview, setPreview] = useState(null);

  // Обработчик добавления файла
  const handleAddFile = () => {
    fileInputRef.current.click();
  };

  // Обработчик изменения файла
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      
      // Имитация прогресса загрузки
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Обновление списка вложений
      const newAttachments = response.data.attachments || response.data;
      setAttachments(prev => [...prev, ...newAttachments]);
      setSuccess(true);
      
      // Сброс формы через 2 секунды
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setSuccess(false);
        e.target.value = null;
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err);
      setError(t('tickets:files.uploadError', 'Не удалось загрузить файл. Пожалуйста, попробуйте еще раз.'));
      setUploading(false);
      setUploadProgress(0);
      e.target.value = null;
    }
  };

  // Обработчик удаления файла
  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/tickets/${ticketId}/attachments/${fileId}`);
      setAttachments(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Ошибка при удалении файла:', err);
      setError(t('tickets:files.deleteError', 'Не удалось удалить файл. Пожалуйста, попробуйте еще раз.'));
    }
  };

  // Обработчик предпросмотра изображения
  const handlePreview = (file) => {
    const extension = file.filename?.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    
    if (imageExtensions.includes(extension)) {
      setPreview(file);
    }
  };

  // Закрытие предпросмотра
  const closePreview = () => {
    setPreview(null);
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            position: 'relative',
            paddingBottom: '10px',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: '3px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}
        >
          {t('tickets:files.title', 'Прикрепленные файлы')}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<PlusIcon size={16} />}
          onClick={handleAddFile}
          disabled={uploading}
          size="small"
          sx={{ fontWeight: 500 }}
        >
          {t('tickets:files.addFile', 'Добавить файл')}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
      </Box>
      
      {/* Сообщения об ошибке или успехе */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('tickets:files.uploadSuccess', 'Файл(ы) успешно загружены')}
        </Alert>
      )}
      
      {/* Индикатор загрузки */}
      {uploading && (
        <Box sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {t('tickets:files.uploading', 'Загрузка файла...')} {uploadProgress}%
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 4, 
                bgcolor: '#e0e0e0',
                borderRadius: 1,
                mt: 0.5
              }}>
                <Box sx={{ 
                  width: `${uploadProgress}%`, 
                  height: '100%', 
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 1,
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>
            <CircularProgress 
              variant="determinate" 
              value={uploadProgress} 
              size={24} 
            />
          </Box>
        </Box>
      )}
      
      {/* Список файлов */}
      {attachments.length === 0 ? (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5)
          }}
        >
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            {t('tickets:files.noFiles', 'Нет прикрепленных файлов')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('tickets:files.uploadInstruction', 'Нажмите кнопку "Добавить файл", чтобы загрузить файлы')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<UploadIcon size={16} />}
            onClick={handleAddFile}
            sx={{ mt: 2, fontWeight: 500 }}
          >
            {t('tickets:files.uploadFile', 'Загрузить файл')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {attachments.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id || file.filename}>
              <Card 
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {getFileIcon(file.filename)}
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={500}
                      sx={{ 
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.filename || t('tickets:files.defaultName', 'Файл')}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Calendar size={14} style={{ marginRight: '4px', opacity: 0.7 }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(file.created_at || new Date())}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size, t)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <Tooltip title={t('tickets:files.download', 'Скачать')}>
                    <IconButton 
                      size="small"
                      component="a"
                      href={file.url}
                      download
                      target="_blank"
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2)
                        }
                      }}
                    >
                      <DownloadIcon size={16} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={t('tickets:files.delete', 'Удалить')}>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteFile(file.id)}
                      sx={{ 
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.2)
                        }
                      }}
                    >
                      <TrashIcon size={16} color={theme.palette.error.main} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Предпросмотр изображения */}
      {preview && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2
          }}
          onClick={closePreview}
        >
          <Box
            component="img"
            src={preview.url}
            alt={preview.filename}
            sx={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: 1,
              bgcolor: 'white',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TicketFiles;