// src/components/tickets/TicketFiles.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import {
  FileText,
  Image,
  FileArchive,
  FilePlus,
  Download,
  X,
  Eye,
  Trash2,
  Upload,
  File
} from 'lucide-react';
import { ticketService } from '../../api/ticketService';
import { formatDate } from '../../utils/dateUtils';
import { formatFileSize } from '../../utils/formatters';

const TicketFiles = ({ ticketId, files = [] }) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [localFiles, setLocalFiles] = useState(files);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Функция загрузки файла
  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploadLoading(true);
      setError(null);
      setSuccess(null);

      const response = await ticketService.uploadFile(ticketId, file);
      
      // Добавляем загруженный файл в список
      setLocalFiles([...localFiles, response]);
      setSuccess('Файл успешно загружен');

      // Сбросить сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Не удалось загрузить файл');
      console.error('Error uploading file:', err);
    } finally {
      setUploadLoading(false);
      
      // Сбрасываем значение input для возможности выбора того же файла снова
      event.target.value = '';
    }
  };

  // Открыть предпросмотр файла
  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  // Закрыть предпросмотр файла
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  // Удалить файл
  const handleDelete = async (fileId) => {
    try {
      setDeleteLoading(true);
      setError(null);
      setSuccess(null);

      await ticketService.deleteFile(ticketId, fileId);
      
      // Удаляем файл из списка
      setLocalFiles(localFiles.filter(file => file.id !== fileId));
      setSuccess('Файл успешно удален');

      // Сбросить сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Не удалось удалить файл');
      console.error('Error deleting file:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Определить иконку файла по типу
  const getFileIcon = (fileType) => {
    switch (true) {
      case fileType.startsWith('image/'):
        return <Image size={24} />;
      case fileType === 'application/pdf':
        return <FileText size={24} />;
      case fileType === 'application/zip':
      case fileType === 'application/x-zip-compressed':
      case fileType === 'application/x-rar-compressed':
        return <FileArchive size={24} />;
      default:
        return <File size={24} />;
    }
  };

  // Проверить, возможен ли предпросмотр файла
  const canPreview = (fileType) => {
    return fileType.startsWith('image/') || fileType === 'application/pdf';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Файлы заявки ({localFiles.length})</Typography>
        <Box>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={uploadLoading ? <CircularProgress size={20} /> : <Upload />}
              disabled={uploadLoading}
            >
              Загрузить файл
            </Button>
          </label>
        </Box>
      </Box>

      {/* Сообщения об ошибках и успехе */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Список файлов */}
      {localFiles.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
          bgcolor="background.paper"
          border={1}
          borderColor="divider"
          borderRadius={1}
        >
          <FilePlus size={48} color="#9e9e9e" />
          <Typography color="textSecondary" mt={2}>
            К этой заявке пока не прикреплено ни одного файла
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {localFiles.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {getFileIcon(file.type)}
                    <Typography variant="subtitle2" ml={1} noWrap>
                      {file.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary" display="block">
                    Размер: {formatFileSize(file.size)}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary" display="block">
                    Загружен: {formatDate(file.uploadedAt)}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary" display="block" noWrap>
                    Кем: {file.uploadedBy && file.uploadedBy.name ? file.uploadedBy.name : 'Система'}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {canPreview(file.type) && (
                    <Tooltip title="Предпросмотр">
                      <IconButton size="small" onClick={() => handlePreview(file)}>
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Скачать">
                    <IconButton 
                      size="small" 
                      href={file.url} 
                      download={file.name}
                      target="_blank"
                    >
                      <Download size={18} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Удалить">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(file.id)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? <CircularProgress size={18} /> : <Trash2 size={18} />}
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог предпросмотра */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        {previewFile && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {previewFile.name}
                <IconButton onClick={handleClosePreview}>
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {previewFile.type.startsWith('image/') ? (
                <Box 
                  component="img" 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: '70vh',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              ) : previewFile.type === 'application/pdf' ? (
                <Box 
                  component="iframe" 
                  src={previewFile.url}
                  sx={{ 
                    width: '100%', 
                    height: '70vh', 
                    border: 'none'
                  }}
                />
              ) : (
                <Typography>
                  Предпросмотр для этого типа файлов недоступен
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                href={previewFile.url} 
                download={previewFile.name}
                target="_blank"
                variant="contained"
                startIcon={<Download />}
              >
                Скачать
              </Button>
              <Button onClick={handleClosePreview}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TicketFiles;